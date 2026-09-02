# Purdue IEEE Discord Verification System

A serverless, zero-maintenance Discord email verification system built on Cloudflare Workers, Cloudflare KV, and Resend Transactional Email API with custom domain DNS verification (`purdueieee.org`).

---

## 1. Problem & Architecture Overview

### The Problem

* Third-party verification bots (such as EmailBot) enforce strict monthly email quotas on free tiers (e.g., 25 emails/month), locking out prospective members unless paid subscriptions or credit packs are purchased.
* Traditional self-hosted Discord bots (`discord.js`, Python `discord.py`) require 24/7 WebSocket connections, making them unreliable on free cloud container platforms (like Render or Fly.io) that spin down inactive instances or charge for continuous background workers.
* Generic Gmail relays or unauthenticated mailers get flagged by Microsoft Defender / Purdue Outlook as brand impersonation and routed into Quarantine.

### The Solution

* **Discord HTTP Interactions API:** Replaces persistent Gateway WebSockets with stateless HTTP POST webhooks that invoke compute only when an interaction occurs.
* **Cloudflare Workers:** Runs verification logic on ephemeral V8 isolates (100,000 requests/day free tier).
* **Cloudflare KV:** Stores 30-minute OTP tokens with native auto-expiration (TTL) and permanently maps Discord user IDs to email addresses to prevent duplicate/alt registrations.
* **Resend Transactional Email API:** Sends cryptographically signed (DKIM + SPF + DMARC) verification emails from `verify@purdueieee.org`, guaranteeing 100% inbox delivery and zero Microsoft Defender quarantine flags.

---

## 2. Infrastructure Components

| Component | Service | Purpose | Free Tier Limit |
| --- | --- | --- | --- |
| **Interactions Gateway** | Cloudflare Workers | Validates cryptographic signatures, routes commands, handles modals | 100,000 req/day |
| **State Storage** | Cloudflare KV | Stores 30-minute OTP codes and permanent User-Email mappings | 100k reads, 1k writes/day |
| **Email Dispatch** | Resend API (`purdueieee.org`) | Transmits responsive HTML OTP emails signed with DKIM/SPF from `verify@purdueieee.org` | 3,000 emails/month (100/day) |
| **Role Management** | Discord REST API | Automatically assigns the verified role via authenticated PUT requests | 50 req/sec |

---

## 3. Step-by-Step Setup Guide

### Step A: Resend Custom Domain Authentication

1. Create a free account at [resend.com](https://resend.com).
2. Go to **Domains > Add Domain** and enter `purdueieee.org`.
3. In **Cloudflare Dashboard > `purdueieee.org` > DNS > Records**, add the 3 generated records (Proxy status: **DNS only / Grey cloud**):
   * **DKIM (TXT):** `resend._domainkey` -> `p=MIGf...`
   * **SPF / Return-Path (MX):** `send` -> `feedback-smtp.us-east-1.amazonses.com` (Priority 10)
   * **SPF Validation (TXT):** `send` -> `v=spf1 include:amazonses.com ~all`
4. Click **Verify DNS Records** in Resend until status turns **Verified (Green)**.
5. In Resend, go to **API Keys > Create API Key** (name: `Discord Verification Bot` with Sending/Full Access) and copy the `re_...` key.

---

### Step B: Cloudflare KV and Worker Configuration

1. In the Cloudflare Dashboard, navigate to **Storage & Databases > KV** and create a namespace named `VERIFY_KV`.
2. Go to **Workers & Pages > Create Application > Create Worker** (choose "Hello World").
3. In the Worker's **Settings > Bindings**, add a KV Namespace binding:
   * **Variable name:** `VERIFY_KV`
   * **KV namespace:** `VERIFY_KV`
4. Under **Settings > Variables and secrets**, define the following:

| Variable Name | Type | Description |
| --- | --- | --- |
| `DISCORD_PUBLIC_KEY` | Secret | Public Key from Discord Developer Portal |
| `DISCORD_BOT_TOKEN` | Secret | Bot Token from Discord Developer Portal |
| `RESEND_API_KEY` | Secret | Resend API Key (`re_...`) |
| `GUILD_ID` | Text | Discord Server (Guild) ID |
| `ROLE_ID` | Text | Discord Verified Member Role ID |
| `DOMAIN_FILTER` | Text | Required email suffix (e.g., `@purdue.edu`) |
| `LOG_CHANNEL_ID` | Text | (Optional) Admin channel ID for audit logs |

5. Replace `worker.js` with the complete worker script below and click **Deploy**:

```javascript
export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("OK", { status: 200 });

    const signature = request.headers.get("x-signature-ed25519");
    const timestamp = request.headers.get("x-signature-timestamp");
    const bodyText = await request.text();

    if (!signature || !timestamp || !(await verifySignature(env.DISCORD_PUBLIC_KEY, signature, timestamp, bodyText))) {
      return new Response("Invalid signature", { status: 401 });
    }

    const interaction = JSON.parse(bodyText);

    // Discord Ping Validation (Type 1)
    if (interaction.type === 1) {
      return Response.json({ type: 1 });
    }

    const userId = interaction.member ? interaction.member.user.id : interaction.user?.id;

    // Slash Commands (Type 2)
    if (interaction.type === 2) {
      const { name, options } = interaction.data;

      if (name === "post-button") {
        return Response.json({
          type: 4,
          data: {
            embeds: [
              {
                title: "Server Verification",
                description: `Welcome! Click the button below to verify your membership using your \`${env.DOMAIN_FILTER || "@purdue.edu"}\` email address.`,
                color: 0xCFB991
              }
            ],
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: 1,
                    label: "Verify with Email",
                    custom_id: "btn_open_email_modal"
                  }
                ]
              }
            ]
          }
        });
      }

      if (name === "unverify") {
        const targetUserId = options.find((o) => o.name === "user").value;
        const linkedEmail = await env.VERIFY_KV.get(`user_to_email:${targetUserId}`);

        if (linkedEmail) {
          await env.VERIFY_KV.delete(`email_to_user:${linkedEmail}`);
          await env.VERIFY_KV.delete(`user_to_email:${targetUserId}`);
        }

        await fetch(
          `https://discord.com/api/v10/guilds/${env.GUILD_ID}/members/${targetUserId}/roles/${env.ROLE_ID}`,
          {
            method: "DELETE",
            headers: { "Authorization": `Bot ${env.DISCORD_BOT_TOKEN}` }
          }
        );

        return Response.json({
          type: 4,
          data: { content: `Successfully unverified <@${targetUserId}> and freed the email mapping.`, flags: 64 }
        });
      }
    }

    // Component Interactions / Buttons (Type 3)
    if (interaction.type === 3) {
      const customId = interaction.data.custom_id;

      if (customId === "btn_open_email_modal") {
        return Response.json({
          type: 9,
          data: {
            custom_id: "modal_submit_email",
            title: "Email Verification",
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: "input_email",
                    label: "Institutional Email",
                    style: 1,
                    min_length: 5,
                    max_length: 100,
                    placeholder: `username${env.DOMAIN_FILTER || "@purdue.edu"}`,
                    required: true
                  }
                ]
              }
            ]
          }
        });
      }

      if (customId === "btn_open_code_modal") {
        return Response.json({
          type: 9,
          data: {
            custom_id: "modal_submit_code",
            title: "Enter Verification Code",
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: "input_code",
                    label: "6-Digit Code",
                    style: 1,
                    min_length: 6,
                    max_length: 6,
                    placeholder: "123456",
                    required: true
                  }
                ]
              }
            ]
          }
        });
      }
    }

    // Modal Submissions (Type 5)
    if (interaction.type === 5) {
      const customId = interaction.data.custom_id;

      if (customId === "modal_submit_email") {
        const email = interaction.data.components[0].components[0].value.trim().toLowerCase();

        if (env.DOMAIN_FILTER && !email.endsWith(env.DOMAIN_FILTER)) {
          return Response.json({
            type: 4,
            data: { content: `Error: Email must end with \`${env.DOMAIN_FILTER}\``, flags: 64 }
          });
        }

        const existingUserId = await env.VERIFY_KV.get(`email_to_user:${email}`);
        if (existingUserId && existingUserId !== userId) {
          return Response.json({
            type: 4,
            data: { content: "Error: This email is already registered to another Discord account.", flags: 64 }
          });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await env.VERIFY_KV.put(`otp:${userId}`, JSON.stringify({ email, otp }), { expirationTtl: 1800 });

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "Purdue IEEE <verify@purdueieee.org>",
            reply_to: "ieeepurdueweb@gmail.com",
            to: [email],
            subject: `Your Purdue IEEE Verification Code: ${otp}`,
            text: `Your Purdue IEEE Discord verification code is: ${otp}\n\nThis code expires in 30 minutes.\n\nIf you did not request this verification, you can safely ignore this email.\n\nPurdue University IEEE Student Branch\nElectrical Engineering Building (EE 014)\n465 Northwestern Ave, West Lafayette, IN 47907`,
            html: generateEmailTemplate(otp)
          })
        });

        if (!emailRes.ok) {
          const errText = await emailRes.text();
          console.error("Resend API Error:", errText);
          return Response.json({
            type: 4,
            data: { content: "Failed to dispatch verification email. Please contact an officer.", flags: 64 }
          });
        }

        return Response.json({
          type: 4,
          data: {
            content: `Verification code sent to \`${email}\`. Check your inbox (and spam), then click below:`,
            flags: 64,
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: 3,
                    label: "Enter 6-Digit Code",
                    custom_id: "btn_open_code_modal"
                  }
                ]
              }
            ]
          }
        });
      }

      if (customId === "modal_submit_code") {
        const codeInput = interaction.data.components[0].components[0].value.trim();
        const storedData = await env.VERIFY_KV.get(`otp:${userId}`, "json");

        if (!storedData || storedData.otp !== codeInput) {
          return Response.json({
            type: 4,
            data: { content: "Invalid or expired code. Please click the button to request a new code.", flags: 64 }
          });
        }

        const roleRes = await fetch(
          `https://discord.com/api/v10/guilds/${env.GUILD_ID}/members/${userId}/roles/${env.ROLE_ID}`,
          {
            method: "PUT",
            headers: { "Authorization": `Bot ${env.DISCORD_BOT_TOKEN}` }
          }
        );

        if (!roleRes.ok) {
          return Response.json({
            type: 4,
            data: { content: "Failed to assign role. Ensure the bot's role is positioned above the verified role in server settings.", flags: 64 }
          });
        }

        await env.VERIFY_KV.put(`email_to_user:${storedData.email}`, userId);
        await env.VERIFY_KV.put(`user_to_email:${userId}`, storedData.email);
        await env.VERIFY_KV.delete(`otp:${userId}`);

        if (env.LOG_CHANNEL_ID) {
          await fetch(`https://discord.com/api/v10/channels/${env.LOG_CHANNEL_ID}/messages`, {
            method: "POST",
            headers: {
              "Authorization": `Bot ${env.DISCORD_BOT_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              embeds: [
                {
                  title: "Member Verified",
                  description: `<@${userId}> verified with \`${storedData.email}\``,
                  color: 0x57F287,
                  timestamp: new Date().toISOString()
                }
              ]
            })
          });
        }

        return Response.json({
          type: 4,
          data: { content: "Verification successful! Your role has been granted.", flags: 64 }
        });
      }
    }

    return Response.json({ type: 4, data: { content: "Unknown interaction", flags: 64 } });
  }
};

async function verifySignature(publicKeyHex, signatureHex, timestamp, body) {
  try {
    const pubKeyBytes = hexToUint8Array(publicKeyHex);
    const sigBytes = hexToUint8Array(signatureHex);
    const dataBytes = new TextEncoder().encode(timestamp + body);

    const key = await crypto.subtle.importKey(
      "raw",
      pubKeyBytes,
      { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
      false,
      ["verify"]
    ).catch(() => crypto.subtle.importKey("raw", pubKeyBytes, { name: "Ed25519" }, false, ["verify"]));

    return await crypto.subtle.verify(key.algorithm.name, key, sigBytes, dataBytes);
  } catch (e) {
    return false;
  }
}

function hexToUint8Array(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function generateEmailTemplate(otp) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7; padding: 40px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e6e6eb;">
            <tr>
              <td style="background-color: #000000; padding: 24px; text-align: center; border-bottom: 3px solid #CFB991;">
                <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">
                  Purdue IEEE Student Branch
                </h1>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #CFB991; font-weight: 500;">
                  Discord Server Verification
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 28px; text-align: center;">
                <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #1f2937; font-weight: 600;">
                  Verify Your Membership
                </h2>
                <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #4b5563;">
                  Use the one-time code below to complete your server registration and unlock member channels.
                </p>
                <div style="display: inline-block; background-color: #f8fafc; border: 2px dashed #CFB991; border-radius: 8px; padding: 14px 28px; margin-bottom: 24px;">
                  <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 32px; font-weight: 700; color: #000000; letter-spacing: 6px;">
                    ${otp}
                  </span>
                </div>
                <p style="margin: 0; font-size: 13px; color: #6b7280;">
                  This code expires in <strong>30 minutes</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f9fafb; padding: 18px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
                  If you did not request this verification, you can safely ignore this email.<br>
                  Purdue IEEE &bull; West Lafayette, IN
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

```

---

### Step C: Registering Slash Commands in Discord

Run the following command in PowerShell to register the `/post-button` and `/unverify` administrative commands to your guild:

```powershell
$APP_ID = "<YOUR_DISCORD_APP_ID>"
$BOT_TOKEN = "<YOUR_DISCORD_BOT_TOKEN>"
$GUILD_ID = "1358686585725391018"

$body = @'
[
  {
    "name": "post-button",
    "description": "Post the verification panel with button",
    "default_member_permissions": "8"
  },
  {
    "name": "unverify",
    "description": "Remove verification and free up email",
    "default_member_permissions": "8",
    "options": [
      {
        "name": "user",
        "description": "The user to unverify",
        "type": 6,
        "required": true
      }
    ]
  }
]
'@

Invoke-RestMethod `
  -Uri "https://discord.com/api/v10/applications/$APP_ID/guilds/$GUILD_ID/commands" `
  -Method Put `
  -UserAgent "DiscordBot (https://discord.com, 1.0.0)" `
  -Headers @{
    "Authorization" = "Bot $BOT_TOKEN"
    "Content-Type"  = "application/json"
  } `
  -Body $body

```

---

### Step D: Linking the Worker URL to Discord

1. Copy the public Worker URL (e.g., `[https://discord-email-verify.ieeepurdueweb.workers.dev](https://discord-email-verify.ieeepurdueweb.workers.dev)`).
2. Go to the [Discord Developer Portal](https://discord.com/developers/applications) > your application > **General Information**.
3. Paste the URL into **Interactions Endpoint URL** (ensure it starts with `https://`) and click **Save Changes**.
4. Discord will execute an automated signature verification handshake. A green success prompt confirms that signature validation passed.

---

## 4. Operational Usage & Moderation

### Deploying the Verification Panel

1. In Discord, navigate to the `#verification` or `#welcome` channel.
2. Run `/post-button` as an administrator.
3. The bot posts a permanent embed containing the **Verify with Email** button.

### User Verification Flow

1. Member clicks **Verify with Email**.
2. A Discord modal prompts the user for their `@purdue.edu` email.
3. The Worker verifies domain validity and alt-account status, generates a 6-digit OTP, stores it in KV with a 600-second TTL, and triggers the Google Apps Script relay.
4. The member receives an HTML email from `Purdue IEEE Discord`.
5. The member clicks **Enter 6-Digit Code** in Discord and submits their code.
6. The Worker verifies the OTP match, provisions the role via Discord's REST API, deletes the OTP token, stores the permanent user/email association, and dispatches a timestamped audit log to the moderation channel.

### Revoking Verification

Run `/unverify user:@Member` to remove their verified role and clear the email binding in KV, allowing the address to be re-verified if needed.
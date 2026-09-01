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

      // Permission check for administrative slash commands
      if (name === "post-button" || name === "unverify") {
        if (!hasAdminOrManageRoles(interaction)) {
          return Response.json({
            type: 4,
            data: { content: "Error: You do not have permission to execute this administrative command.", flags: 64 }
          });
        }
      }

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

        // Email rate limit: max 3 requests per 10 minutes
        const emailRateKey = `ratelimit:email:${userId}`;
        const emailCount = parseInt((await env.VERIFY_KV.get(emailRateKey)) || "0", 10);
        if (emailCount >= 3) {
          return Response.json({
            type: 4,
            data: { content: "Rate limit exceeded: You can only request up to 3 verification emails per 10 minutes. Please check your spam folder or try again later.", flags: 64 }
          });
        }
        await env.VERIFY_KV.put(emailRateKey, (emailCount + 1).toString(), { expirationTtl: 600 });

        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        const otp = (100000 + (array[0] % 900000)).toString();
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
            content: `Verification code sent to \`${email}\`. Check your inbox, then click below:`,
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

        const attemptsKey = `otp_attempts:${userId}`;
        const failedAttempts = parseInt((await env.VERIFY_KV.get(attemptsKey)) || "0", 10);

        if (failedAttempts >= 3 || !storedData) {
          await env.VERIFY_KV.delete(`otp:${userId}`);
          await env.VERIFY_KV.delete(attemptsKey);
          return Response.json({
            type: 4,
            data: { content: "Invalid or expired code. Please request a new verification code.", flags: 64 }
          });
        }

        if (storedData.otp !== codeInput) {
          const newAttempts = failedAttempts + 1;
          if (newAttempts >= 3) {
            await env.VERIFY_KV.delete(`otp:${userId}`);
            await env.VERIFY_KV.delete(attemptsKey);
            return Response.json({
              type: 4,
              data: { content: "Invalid code. You have exceeded 3 attempts. Your code has been invalidated. Please request a new code.", flags: 64 }
            });
          }
          await env.VERIFY_KV.put(attemptsKey, newAttempts.toString(), { expirationTtl: 1800 });
          return Response.json({
            type: 4,
            data: { content: `Invalid code. ${3 - newAttempts} attempt(s) remaining.`, flags: 64 }
          });
        }

        // Clean up attempts counter on success
        await env.VERIFY_KV.delete(attemptsKey);

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

function hasAdminOrManageRoles(interaction) {
  if (!interaction.member || !interaction.member.permissions) return false;
  try {
    const perms = BigInt(interaction.member.permissions);
    const ADMINISTRATOR = 1n << 3n;
    const MANAGE_ROLES = 1n << 28n;
    const MANAGE_GUILD = 1n << 5n;
    return (perms & ADMINISTRATOR) !== 0n || (perms & MANAGE_ROLES) !== 0n || (perms & MANAGE_GUILD) !== 0n;
  } catch {
    return false;
  }
}

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
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purdue IEEE Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preview preheader text -->
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your Purdue IEEE Discord verification code is ${otp}. Valid for 30 minutes.
  </div>
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
                Purdue University IEEE Student Branch &bull; EE 014<br>
                465 Northwestern Ave, West Lafayette, IN 47907
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

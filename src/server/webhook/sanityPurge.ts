export async function handleSanityWebhook(
  request: any,
  env: any,
): Promise<any> {
  const signature = request.headers.get("sanity-webhook-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 401 });
  }

  // Format: t=1612345678,v1=...base64url...
  const parts = signature.split(",");
  if (parts.length !== 2) {
    return new Response("Invalid signature format", { status: 401 });
  }

  const timestampPart = parts[0].split("=");
  const signaturePart = parts[1].split("=");

  if (timestampPart[0] !== "t" || signaturePart[0] !== "v1") {
    return new Response("Invalid signature format", { status: 401 });
  }

  const timestamp = timestampPart[1];
  const sig = signaturePart[1];

  const body = await request.text();

  const secret = env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Missing webhook secret configuration", {
      status: 500,
    });
  }

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify", "sign"],
    );

    const data = enc.encode(`${body}`);
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);

    // Sanity signature is a base64url encoded string
    const uint8 = new Uint8Array(signatureBuffer);
    let str = "";
    for (let i = 0; i < uint8.length; i++) {
      str += String.fromCharCode(uint8[i]);
    }
    const base64String = btoa(str);
    const base64UrlString = base64String
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    // The provided logic above didn't use the timestamp for hashing based on standard Sanity implementation which just hashes the body.
    if (base64UrlString !== sig) {
      return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(body);

    if (payload._type === "committee" || payload._type === "officer") {
      const url = new URL(request.url);
      const cache = (caches as any).default;
      const urlsToPurge = [
        new URL("/about", url.origin),
        new URL("/officers", url.origin),
      ];

      for (const target of urlsToPurge) {
        await cache.delete(target.toString());
      }
      return new Response("Cache purged successfully", { status: 200 });
    }

    return new Response("Ignored event type", { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}

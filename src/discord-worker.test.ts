import { describe, it, expect, vi } from "vitest";
import worker, { generateOTP } from "./discord-worker.js";

describe("Discord Worker OTP Security", () => {
  it("generateOTP uses crypto.getRandomValues to produce secure 6-digit OTPs", () => {
    const spyGetRandomValues = vi.spyOn(crypto, "getRandomValues");

    const otp = generateOTP();

    expect(spyGetRandomValues).toHaveBeenCalled();
    expect(otp).toMatch(/^\d{6}$/);
    const otpNum = parseInt(otp, 10);
    expect(otpNum).toBeGreaterThanOrEqual(100000);
    expect(otpNum).toBeLessThan(1000000);

    spyGetRandomValues.mockRestore();
  });

  it("handles invalid signature gracefully", async () => {
    const req = new Request("https://worker.local", {
      method: "POST",
      headers: {
        "x-signature-ed25519": "invalid_sig",
        "x-signature-timestamp": "12345678",
      },
      body: JSON.stringify({ type: 1 }),
    });

    const env = {
      DISCORD_PUBLIC_KEY: "00".repeat(32),
    };

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(401);
  });
});

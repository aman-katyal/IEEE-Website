import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleSanityWebhook } from "./sanityPurge";

// Mock crypto.subtle and btoa for node environment tests
const mockSign = vi.fn();
Object.defineProperty(global, "crypto", {
  value: {
    subtle: {
      importKey: vi.fn().mockResolvedValue("mock-key"),
      sign: mockSign,
    },
  },
});

const mockCacheDelete = vi.fn();
Object.defineProperty(global, "caches", {
  value: {
    default: {
      delete: mockCacheDelete,
    },
  },
  configurable: true,
});

describe("handleSanityWebhook", () => {
  const env = { SANITY_WEBHOOK_SECRET: "test-secret" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects missing signature", async () => {
    const req = new Request("https://test.com", { method: "POST", body: "{}" });
    const res = await handleSanityWebhook(req, env);
    expect(res.status).toBe(401);
    expect(await res.text()).toBe("Missing signature");
  });

  it("rejects invalid signature format", async () => {
    const req = new Request("https://test.com", {
      method: "POST",
      body: "{}",
      headers: { "sanity-webhook-signature": "invalid-format" },
    });
    const res = await handleSanityWebhook(req, env);
    expect(res.status).toBe(401);
  });

  it("rejects unauthenticated requests (invalid signature)", async () => {
    mockSign.mockResolvedValueOnce(new Uint8Array([1, 2, 3]).buffer);
    const req = new Request("https://test.com", {
      method: "POST",
      body: "{}",
      headers: { "sanity-webhook-signature": "t=123,v1=wrong-sig" },
    });
    const res = await handleSanityWebhook(req, env);
    expect(res.status).toBe(401);
  });

  it("purges cache for committee and officer routes on valid signature", async () => {
    mockSign.mockResolvedValueOnce(new Uint8Array([1, 2, 3]).buffer);
    const mockSigStr = Buffer.from(new Uint8Array([1, 2, 3])).toString(
      "base64url",
    );

    const req = new Request("https://test.com", {
      method: "POST",
      body: JSON.stringify({ _type: "committee" }),
      headers: { "sanity-webhook-signature": `t=123,v1=${mockSigStr}` },
    });

    mockCacheDelete.mockResolvedValue(true);

    const res = await handleSanityWebhook(req, env);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Cache purged successfully");

    expect(mockCacheDelete).toHaveBeenCalledTimes(2);
    expect(mockCacheDelete).toHaveBeenCalledWith("https://test.com/about");
    expect(mockCacheDelete).toHaveBeenCalledWith("https://test.com/officers");
  });
});

import { describe, it, expect, vi } from 'vitest';
import worker from './discord-worker';

describe('discord-worker', () => {
  it('uses crypto.getRandomValues to generate 6-digit OTP when modal_submit_email is called', async () => {
    const spy = vi.spyOn(crypto, 'getRandomValues');
    const mockKv = new Map<string, string>();
    const env = {
      DISCORD_PUBLIC_KEY: '00'.repeat(32),
      DOMAIN_FILTER: '@purdue.edu',
      RESEND_API_KEY: 're_test',
      VERIFY_KV: {
        get: vi.fn(async (key: string) => mockKv.get(key) || null),
        put: vi.fn(async (key: string, val: string) => { mockKv.set(key, val); }),
        delete: vi.fn(async (key: string) => { mockKv.delete(key); }),
      },
    };

    const payload = JSON.stringify({
      type: 5,
      member: { user: { id: 'user123' } },
      data: {
        custom_id: 'modal_submit_email',
        components: [
          { components: [{ value: 'testuser@purdue.edu' }] }
        ]
      }
    });

    const request = new Request('https://worker.local', {
      method: 'POST',
      headers: {
        'x-signature-ed25519': '00'.repeat(64),
        'x-signature-timestamp': '1234567890',
      },
      body: payload,
    });

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url === 'https://api.resend.com/emails') {
        return {
          ok: true,
          text: async () => 'OK',
        } as any;
      }
      return { ok: true } as any;
    });

    // Mock crypto.subtle.verify to bypass Discord signature verification in tests
    const originalVerify = crypto.subtle.verify;
    crypto.subtle.verify = vi.fn().mockResolvedValue(true);

    try {
      const res = await worker.fetch(request, env);
      expect(res.status).toBe(200);
      expect(spy).toHaveBeenCalled();
      const storedOtpJson = mockKv.get('otp:user123');
      expect(storedOtpJson).toBeDefined();
      const storedData = JSON.parse(storedOtpJson!);
      expect(storedData.otp).toMatch(/^\d{6}$/);
    } finally {
      globalThis.fetch = originalFetch;
      crypto.subtle.verify = originalVerify;
      spy.mockRestore();
    }
  });
});

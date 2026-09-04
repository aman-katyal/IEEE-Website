import { describe, it, expect, vi } from 'vitest';
import worker from './discord-worker.js';

describe('discord-worker OTP generation security', () => {
  it('generates a 6-digit OTP using crypto.getRandomValues', async () => {
    let storedOtp = '';
    const mockEnv = {
      DISCORD_PUBLIC_KEY: '00'.repeat(32),
      DOMAIN_FILTER: '@purdue.edu',
      VERIFY_KV: {
        get: vi.fn().mockImplementation(async (key: string) => {
          if (key.startsWith('ratelimit:email:')) return '0';
          if (key.startsWith('email_to_user:')) return null;
          return null;
        }),
        put: vi.fn().mockImplementation(async (key: string, value: string) => {
          if (key.startsWith('otp:')) {
            const parsed = JSON.parse(value);
            storedOtp = parsed.otp;
          }
        }),
      },
      RESEND_API_KEY: 'test_key',
    };

    const mockBody = JSON.stringify({
      type: 5,
      member: { user: { id: 'user123' } },
      data: {
        custom_id: 'modal_submit_email',
        components: [
          {
            components: [
              { value: 'testuser@purdue.edu' }
            ]
          }
        ]
      }
    });

    const mockRequest = new Request('https://worker.test', {
      method: 'POST',
      headers: {
        'x-signature-ed25519': '00'.repeat(64),
        'x-signature-timestamp': '1234567890',
        'content-type': 'application/json',
      },
      body: mockBody,
    });

    const globalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => '',
    });

    try {
      if (globalThis.crypto && globalThis.crypto.subtle) {
        vi.spyOn(globalThis.crypto.subtle, 'importKey').mockImplementation(async () => ({ algorithm: { name: 'Ed25519' } } as any));
        vi.spyOn(globalThis.crypto.subtle, 'verify').mockImplementation(async () => true);
      }

      const mathRandomSpy = vi.spyOn(Math, 'random');

      const response = await worker.fetch(mockRequest, mockEnv as any);
      expect(response.status).toBe(200);

      expect(mathRandomSpy).not.toHaveBeenCalled();
      expect(storedOtp).toMatch(/^\d{6}$/);
      const otpNum = parseInt(storedOtp, 10);
      expect(otpNum).toBeGreaterThanOrEqual(100000);
      expect(otpNum).toBeLessThanOrEqual(999999);
    } finally {
      globalThis.fetch = globalFetch;
      vi.restoreAllMocks();
    }
  });
});

import { describe, it, expect } from 'vitest';
import { InMemoryRateLimiter } from './rateLimit';

describe('InMemoryRateLimiter', () => {
  it('allows initial requests with max remaining attempts', () => {
    const limiter = new InMemoryRateLimiter({ maxAttempts: 3 });
    const res = limiter.check('192.168.1.1');
    expect(res.allowed).toBe(true);
    expect(res.remainingAttempts).toBe(3);
    expect(res.retryAfterSeconds).toBe(0);
  });

  it('decrements remaining attempts on recorded failures', () => {
    const limiter = new InMemoryRateLimiter({ maxAttempts: 3 });
    limiter.recordFailure('192.168.1.1');
    const res = limiter.check('192.168.1.1');
    expect(res.allowed).toBe(true);
    expect(res.remainingAttempts).toBe(2);
  });

  it('blocks client when maxAttempts is reached and returns retryAfter', () => {
    const now = 1000000;
    const limiter = new InMemoryRateLimiter({ maxAttempts: 3, baseLockoutMs: 60000 });
    limiter.recordFailure('192.168.1.1', now);
    limiter.recordFailure('192.168.1.1', now + 1000);
    limiter.recordFailure('192.168.1.1', now + 2000);

    const res = limiter.check('192.168.1.1', now + 3000);
    expect(res.allowed).toBe(false);
    expect(res.remainingAttempts).toBe(0);
    expect(res.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('clears record on recordSuccess', () => {
    const limiter = new InMemoryRateLimiter({ maxAttempts: 3 });
    limiter.recordFailure('192.168.1.1');
    limiter.recordFailure('192.168.1.1');
    limiter.recordSuccess('192.168.1.1');

    const res = limiter.check('192.168.1.1');
    expect(res.allowed).toBe(true);
    expect(res.remainingAttempts).toBe(3);
  });

  it('resets window after windowMs elapses', () => {
    const now = 1000000;
    const limiter = new InMemoryRateLimiter({ maxAttempts: 3, windowMs: 5000 });
    limiter.recordFailure('192.168.1.1', now);
    limiter.recordFailure('192.168.1.1', now + 1000);

    const res = limiter.check('192.168.1.1', now + 6000);
    expect(res.allowed).toBe(true);
    expect(res.remainingAttempts).toBe(3);
  });
});

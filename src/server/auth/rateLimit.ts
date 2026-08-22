/**
 * BoilerBooks 3.0 IP Rate Limiting & Exponential Backoff Utility.
 * Protects PIN authentication and mutation endpoints against brute-force attacks.
 */

export interface RateLimitOptions {
  /** Maximum failed attempts allowed in window before lockout (default: 5) */
  maxAttempts?: number;
  /** Sliding window duration in milliseconds (default: 10 mins = 600000ms) */
  windowMs?: number;
  /** Base lockout duration in milliseconds on initial lockout (default: 60000ms) */
  baseLockoutMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
  delayMs: number;
}

interface AttemptRecord {
  failures: number;
  windowStart: number;
  blockedUntil: number;
}

export class InMemoryRateLimiter {
  private records = new Map<string, AttemptRecord>();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly baseLockoutMs: number;

  constructor(options: RateLimitOptions = {}) {
    this.maxAttempts = options.maxAttempts ?? 5;
    this.windowMs = options.windowMs ?? 10 * 60 * 1000;
    this.baseLockoutMs = options.baseLockoutMs ?? 60 * 1000;
  }

  /**
   * Checks current rate limit status for a given key (e.g. client IP).
   */
  check(key: string, now = Date.now()): RateLimitResult {
    this.cleanup(now);
    const record = this.records.get(key);

    if (!record) {
      return {
        allowed: true,
        remainingAttempts: this.maxAttempts,
        retryAfterSeconds: 0,
        delayMs: 0,
      };
    }

    // Check if currently blocked
    if (record.blockedUntil > now) {
      const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSeconds,
        delayMs: 0,
      };
    }

    // Check window expiration
    if (now - record.windowStart > this.windowMs) {
      this.records.delete(key);
      return {
        allowed: true,
        remainingAttempts: this.maxAttempts,
        retryAfterSeconds: 0,
        delayMs: 0,
      };
    }

    const remaining = Math.max(0, this.maxAttempts - record.failures);
    // Calculate exponential delay backoff based on previous failures
    const delayMs = record.failures > 2 ? Math.min(1000 * Math.pow(2, record.failures - 3), 4000) : 0;

    return {
      allowed: record.failures < this.maxAttempts,
      remainingAttempts: remaining,
      retryAfterSeconds: 0,
      delayMs,
    };
  }

  /**
   * Records a failed attempt for a given key.
   */
  recordFailure(key: string, now = Date.now()): RateLimitResult {
    this.cleanup(now);
    let record = this.records.get(key);

    if (!record || now - record.windowStart > this.windowMs) {
      record = {
        failures: 1,
        windowStart: now,
        blockedUntil: 0,
      };
      this.records.set(key, record);
    } else {
      record.failures += 1;
    }

    if (record.failures >= this.maxAttempts) {
      const excess = record.failures - this.maxAttempts;
      const lockoutDuration = this.baseLockoutMs * Math.pow(2, excess);
      record.blockedUntil = now + lockoutDuration;
    }

    return this.check(key, now);
  }

  /**
   * Resets rate limit record upon successful authentication.
   */
  recordSuccess(key: string): void {
    this.records.delete(key);
  }

  /**
   * Purges expired records to prevent unbounded memory growth.
   */
  private cleanup(now: number): void {
    if (this.records.size < 1000) return;
    for (const [key, record] of this.records.entries()) {
      if (now - record.windowStart > this.windowMs && record.blockedUntil < now) {
        this.records.delete(key);
      }
    }
  }
}

/** Global default limiter instance for PIN auth */
export const pinAuthLimiter = new InMemoryRateLimiter();

import { describe, it, expect } from 'vitest';
import { formatCurrencyUSD, formatPhoneNumber } from './formatters';

describe('formatCurrencyUSD', () => {
  it('formats 1234.5 as $1,234.50', () => {
    expect(formatCurrencyUSD(1234.5)).toBe('$1,234.50');
  });

  it('formats 0 as $0.00', () => {
    expect(formatCurrencyUSD(0)).toBe('$0.00');
  });

  it('formats negative amounts', () => {
    expect(formatCurrencyUSD(-50)).toBe('-$50.00');
  });

  it('respects custom decimals', () => {
    expect(formatCurrencyUSD(9.9, 0)).toBe('$10');
  });
});

describe('formatPhoneNumber', () => {
  it('formats 10-digit number as (XXX) XXX-XXXX', () => {
    expect(formatPhoneNumber('8005551234')).toBe('(800) 555-1234');
  });

  it('formats 10-digit with dashes', () => {
    expect(formatPhoneNumber('800-555-1234')).toBe('(800) 555-1234');
  });

  it('formats 11-digit number with leading 1 as +1 (...)', () => {
    expect(formatPhoneNumber('18005551234')).toBe('+1 (800) 555-1234');
  });

  it('returns non-standard formats as-is', () => {
    expect(formatPhoneNumber('123')).toBe('123');
  });

  it('returns empty string as-is', () => {
    expect(formatPhoneNumber('')).toBe('');
  });
});

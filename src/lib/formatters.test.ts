import { describe, it, expect } from 'vitest';
import {
  formatCurrencyUSD,
  formatPhoneNumber,
  toE164Phone,
  dollarsToCents,
  centsToDollars,
} from './formatters';

describe('dollarsToCents and centsToDollars', () => {
  it('converts dollars to integer cents accurately without floating precision errors', () => {
    expect(dollarsToCents(19.99)).toBe(1999);
    expect(dollarsToCents(0.01)).toBe(1);
    expect(dollarsToCents(0)).toBe(0);
    expect(dollarsToCents(1234.56)).toBe(123456);
  });

  it('converts integer cents back to dollars', () => {
    expect(centsToDollars(1999)).toBe(19.99);
    expect(centsToDollars(1)).toBe(0.01);
    expect(centsToDollars(0)).toBe(0);
  });

  it('handles non-finite values safely', () => {
    expect(dollarsToCents(NaN)).toBe(0);
    expect(centsToDollars(Infinity)).toBe(0);
  });
});

describe('formatCurrencyUSD', () => {
  it('formats 1234.5 as $1,234.50', () => {
    expect(formatCurrencyUSD(1234.5)).toBe('$1,234.50');
  });

  it('formats amount in cents when inCents is true', () => {
    expect(formatCurrencyUSD(123450, { inCents: true })).toBe('$1,234.50');
    expect(formatCurrencyUSD(99, { inCents: true })).toBe('$0.99');
  });

  it('formats 0 as $0.00', () => {
    expect(formatCurrencyUSD(0)).toBe('$0.00');
  });

  it('formats negative amounts', () => {
    expect(formatCurrencyUSD(-50)).toBe('-$50.00');
  });

  it('respects custom decimals', () => {
    expect(formatCurrencyUSD(9.9, 0)).toBe('$10');
    expect(formatCurrencyUSD(9.9, { decimals: 0 })).toBe('$10');
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
    expect(formatPhoneNumber('invalid-phone-number')).toBe('invalid-phone-number');
  });

  it('converts numbers to E.164 international standard', () => {
    expect(toE164Phone('(765) 494-6724')).toBe('+17654946724');
    expect(toE164Phone('1-765-494-6724')).toBe('+17654946724');
    expect(toE164Phone('')).toBe('');
  });

  it('returns empty string as-is', () => {
    expect(formatPhoneNumber('')).toBe('');
  });
});

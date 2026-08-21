import { describe, it, expect } from 'vitest';
import { calculatePercentage } from './mathUtils';

describe('calculatePercentage', () => {
  it('returns 0 when total is 0', () => {
    expect(calculatePercentage(50, 0)).toBe(0);
  });

  it('returns 0 when total is negative', () => {
    expect(calculatePercentage(50, -100)).toBe(0);
  });

  it('returns 50 for 50/100', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
  });

  it('clamps to 100 when value exceeds total (clamp=true default)', () => {
    expect(calculatePercentage(200, 100)).toBe(100);
  });

  it('returns >100 when clamp=false and value exceeds total', () => {
    expect(calculatePercentage(200, 100, { clamp: false })).toBe(200);
  });

  it('respects decimals=2 option', () => {
    expect(calculatePercentage(1, 3, { decimals: 2 })).toBe(33.33);
  });

  it('rounds correctly at decimals=0', () => {
    expect(calculatePercentage(1, 3)).toBe(33);
  });
});

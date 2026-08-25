import { describe, it, expect } from 'vitest';
import { deepEqual } from './deepEqual';

describe('deepEqual', () => {
  it('returns true for identical primitives', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('hello', 'hello')).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
  });

  it('returns false for different primitives', () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('a', 'b')).toBe(false);
    expect(deepEqual(null, undefined)).toBe(false);
  });

  it('compares deeply nested objects correctly', () => {
    const obj1 = { a: 1, b: { c: [1, 2, 3], d: 'nested' } };
    const obj2 = { a: 1, b: { c: [1, 2, 3], d: 'nested' } };
    const obj3 = { a: 1, b: { c: [1, 2, 4], d: 'nested' } };

    expect(deepEqual(obj1, obj2)).toBe(true);
    expect(deepEqual(obj1, obj3)).toBe(false);
  });

  it('compares dates accurately', () => {
    const d1 = new Date('2026-01-01');
    const d2 = new Date('2026-01-01');
    const d3 = new Date('2026-01-02');

    expect(deepEqual(d1, d2)).toBe(true);
    expect(deepEqual(d1, d3)).toBe(false);
  });
});

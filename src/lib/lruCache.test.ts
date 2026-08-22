import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LRUCache } from './lruCache';

describe('LRUCache Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stores and retrieves values within TTL', () => {
    const cache = new LRUCache<string, { title: string }>(3, 1000);
    cache.set('ev1', { title: 'General Meeting' });

    expect(cache.get('ev1')).toEqual({ title: 'General Meeting' });
    expect(cache.has('ev1')).toBe(true);

    // Advance beyond TTL
    vi.advanceTimersByTime(1500);
    expect(cache.get('ev1')).toBeUndefined();
    expect(cache.has('ev1')).toBe(false);
  });

  it('evicts least recently used item when capacity is reached', () => {
    const cache = new LRUCache<string, number>(3, 5000);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    // Access 'a' to make 'b' the least recently used
    cache.get('a');

    // Add 'd' -> 'b' should be evicted
    cache.set('d', 4);

    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe(1);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { safeStorage } from './safeStorage';

describe('safeStorage', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  it('stores and retrieves JSON serializable data correctly', () => {
    const data = { theme: 'dark', fontSize: 16, enabled: true };
    expect(safeStorage.setItem('test_config', data)).toBe(true);
    expect(safeStorage.getItem('test_config')).toEqual(data);
  });

  it('returns default value when key does not exist', () => {
    expect(safeStorage.getItem('missing_key', 'fallback')).toBe('fallback');
  });

  it('safely handles corrupted JSON in localStorage without throwing', () => {
    window.localStorage.setItem('corrupted', '{ invalid json');
    expect(safeStorage.getItem('corrupted', 'default')).toBe('default');
  });

  it('removes keys successfully', () => {
    safeStorage.setItem('removable', { a: 1 });
    expect(safeStorage.getItem('removable')).toEqual({ a: 1 });
    safeStorage.removeItem('removable');
    expect(safeStorage.getItem('removable')).toBeNull();
  });

  it('falls back to in-memory map when localStorage.setItem throws QuotaExceededError', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const success = safeStorage.setItem('overflow_key', { status: 'safe' });
    expect(success).toBe(true);
    expect(safeStorage.getItem('overflow_key')).toEqual({ status: 'safe' });

    setItemSpy.mockRestore();
  });
});

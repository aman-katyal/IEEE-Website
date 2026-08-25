/**
 * Safe LocalStorage Wrapper
 * Handles QuotaExceededError, private browsing restrictions, and corrupted JSON.
 */

const memoryFallback = new Map<string, string>();

export const safeStorage = {
  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      let raw: string | null = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        raw = window.localStorage.getItem(key);
      }
      if (raw === null) {
        raw = memoryFallback.get(key) ?? null;
      }

      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      // JSON parse error or access blocked
      return defaultValue;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
      } else {
        memoryFallback.set(key, serialized);
      }
      return true;
    } catch {
      // Quota exceeded or private browsing error -> fallback to memory map
      try {
        memoryFallback.set(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      memoryFallback.delete(key);
    } catch {
      memoryFallback.delete(key);
    }
  },

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      memoryFallback.clear();
    } catch {
      memoryFallback.clear();
    }
  },
};

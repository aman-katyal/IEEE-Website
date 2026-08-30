import { describe, it, expect } from 'vitest';
import { queryAll, roundCurrency, D1DatabaseLike } from './query';

describe('Query Helpers Suite', () => {
  describe('roundCurrency', () => {
    it('rounds to 2 decimal places properly', () => {
      expect(roundCurrency(1.005)).toBe(1.01);
      expect(roundCurrency(1.004)).toBe(1.00);
      expect(roundCurrency(NaN)).toBe(0);
      expect(roundCurrency(Infinity)).toBe(0);
    });
  });

  describe('queryAll', () => {
    it('returns empty array when results is missing in response', async () => {
      const mockDb: D1DatabaseLike = {
        prepare: () => ({
          bind: () => mockDb.prepare(''),
          first: async () => null,
          all: async () => ({ success: true } as any), // Missing results property
          run: async () => ({ success: true }),
        }),
      };

      const res = await queryAll(mockDb, 'SELECT * FROM test');
      expect(res).toEqual([]);
    });

    it('returns results array when present', async () => {
      const mockDb: D1DatabaseLike = {
        prepare: () => ({
          bind: () => mockDb.prepare(''),
          first: async () => null,
          all: async () => ({ success: true, results: [{ id: 1 }] }),
          run: async () => ({ success: true }),
        }),
      };

      const res = await queryAll(mockDb, 'SELECT * FROM test');
      expect(res).toEqual([{ id: 1 }]);
    });
  });
});

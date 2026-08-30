import { describe, it, expect } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import { queryAll, queryFirst, executeRun, roundCurrency, D1DatabaseLike } from './query';

describe('query helpers', () => {
  describe('roundCurrency', () => {
    it('should round numbers to 2 decimal places', () => {
      expect(roundCurrency(10.123)).toBe(10.12);
      expect(roundCurrency(10.125)).toBe(10.13);
      expect(roundCurrency(1.005)).toBe(1.01);
    });

    it('should handle edge cases', () => {
      expect(roundCurrency(Infinity)).toBe(0);
      expect(roundCurrency(NaN)).toBe(0);
    });
  });

  describe('database queries', () => {
    it('queryAll should return results', async () => {
      const db = new DatabaseSync(':memory:');
      db.exec("CREATE TABLE test (id INTEGER, name TEXT); INSERT INTO test VALUES (1, 'a'), (2, 'b');");
      const results = await queryAll<{ id: number, name: string }>(db, 'SELECT * FROM test');
      expect(results).toEqual([{ id: 1, name: 'a' }, { id: 2, name: 'b' }]);
    });

    it('queryFirst should return the first result', async () => {
      const db = new DatabaseSync(':memory:');
      db.exec("CREATE TABLE test (id INTEGER, name TEXT); INSERT INTO test VALUES (1, 'a'), (2, 'b');");
      const result = await queryFirst<{ id: number, name: string }>(db, 'SELECT * FROM test WHERE id = 2');
      expect(result).toEqual({ id: 2, name: 'b' });
    });

    it('queryFirst should return null if no result', async () => {
      const db = new DatabaseSync(':memory:');
      db.exec('CREATE TABLE test (id INTEGER, name TEXT);');
      const result = await queryFirst<{ id: number, name: string }>(db, 'SELECT * FROM test WHERE id = 2');
      expect(result).toBeNull();
    });

    describe('executeRun', () => {
      it('should return changes using node:sqlite', async () => {
        const db = new DatabaseSync(':memory:');
        db.exec('CREATE TABLE test (id INTEGER, name TEXT);');
        const result = await executeRun(db, "INSERT INTO test VALUES (1, 'a'), (2, 'b');");
        expect(result.changes).toBe(2);
      });

      it('should return changes from D1 meta', async () => {
        const mockDb: D1DatabaseLike = {
          prepare: () => {
            const stmt = {
              bind: () => stmt,
              first: async () => null,
              all: async () => ({ results: [], success: true }),
              run: async () => ({ success: true, meta: { changes: 5 } })
            };
            return stmt as any;
          }
        };

        const result = await executeRun(mockDb, 'UPDATE test SET name = "c"');
        expect(result.changes).toBe(5);
      });

      it('should fallback to 1 change if success is true but meta is undefined', async () => {
        const mockDb: D1DatabaseLike = {
          prepare: () => {
            const stmt = {
              bind: () => stmt,
              first: async () => null,
              all: async () => ({ results: [], success: true }),
              run: async () => ({ success: true, meta: undefined })
            };
            return stmt as any;
          }
        };

        const result = await executeRun(mockDb, 'UPDATE test SET name = "c"');
        expect(result.changes).toBe(1);
      });

      it('should fallback to 0 changes if success is false and meta is undefined', async () => {
        const mockDb: D1DatabaseLike = {
          prepare: () => {
            const stmt = {
              bind: () => stmt,
              first: async () => null,
              all: async () => ({ results: [], success: false }),
              run: async () => ({ success: false, meta: undefined })
            };
            return stmt as any;
          }
        };

        const result = await executeRun(mockDb, 'UPDATE test SET name = "c"');
        expect(result.changes).toBe(0);
      });

      it('should return 1 change when success is true and meta.changes is undefined', async () => {
          const mockDb: D1DatabaseLike = {
              prepare: () => {
                  const stmt = {
                      bind: () => stmt,
                      first: async () => null,
                      all: async () => ({ results: [], success: true }),
                      run: async () => ({ success: true, meta: { changes: undefined } })
                  };
                  return stmt as any;
              }
          };

          const result = await executeRun(mockDb, 'UPDATE test SET name = "c"');
          expect(result.changes).toBe(1);
      });

      it('should throw an error if database instance is missing', async () => {
        await expect(executeRun(null as any, 'SELECT 1')).rejects.toThrow('Invalid database instance: database is required');
      });
    });
  });
});

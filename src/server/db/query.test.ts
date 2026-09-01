import { describe, it, expect, beforeEach } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import { queryAll, queryFirst, executeRun, roundCurrency } from './query';

describe('Query Helpers', () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    db.exec(`
      CREATE TABLE IF NOT EXISTS test_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value DECIMAL(10, 2) NOT NULL
      );
      INSERT INTO test_items (name, value) VALUES ('Item A', 10.50);
      INSERT INTO test_items (name, value) VALUES ('Item B', 20.75);
    `);
  });

  describe('roundCurrency', () => {
    it('rounds numbers to 2 decimal places properly', () => {
      expect(roundCurrency(10.004)).toBe(10.00);
      expect(roundCurrency(10.005)).toBe(10.01);
      expect(roundCurrency(10)).toBe(10.00);
    });

    it('returns 0 for non-finite values', () => {
      expect(roundCurrency(NaN)).toBe(0);
      expect(roundCurrency(Infinity)).toBe(0);
      expect(roundCurrency(-Infinity)).toBe(0);
    });
  });

  describe('queryAll', () => {
    it('returns all matching rows', async () => {
      const rows = await queryAll<{ id: number; name: string; value: number }>(db, 'SELECT * FROM test_items ORDER BY id ASC');
      expect(rows).toHaveLength(2);
      expect(rows[0].name).toBe('Item A');
      expect(rows[1].name).toBe('Item B');
    });

    it('returns empty array when no rows match', async () => {
      const rows = await queryAll(db, 'SELECT * FROM test_items WHERE name = ?', ['Nonexistent']);
      expect(rows).toEqual([]);
    });

    it('throws error if database is not provided', async () => {
      await expect(queryAll(null as any, 'SELECT 1')).rejects.toThrow('Invalid database instance: database is required');
    });
  });

  describe('queryFirst', () => {
    it('returns the first matching row', async () => {
      const row = await queryFirst<{ name: string }>(db, 'SELECT name FROM test_items WHERE id = ?', [1]);
      expect(row).toEqual({ name: 'Item A' });
    });

    it('returns null when no rows match', async () => {
      const row = await queryFirst(db, 'SELECT * FROM test_items WHERE id = ?', [999]);
      expect(row).toBeNull();
    });
  });

  describe('executeRun', () => {
    it('executes INSERT and returns changes count', async () => {
      const res = await executeRun(db, 'INSERT INTO test_items (name, value) VALUES (?, ?)', ['Item C', 30.00]);
      expect(res.changes).toBe(1);

      const rows = await queryAll(db, 'SELECT * FROM test_items');
      expect(rows).toHaveLength(3);
    });

    it('executes UPDATE and returns changes count', async () => {
      const res = await executeRun(db, 'UPDATE test_items SET value = ? WHERE id = ?', [15.00, 1]);
      expect(res.changes).toBe(1);

      const row = await queryFirst<{ value: number }>(db, 'SELECT value FROM test_items WHERE id = 1');
      expect(row?.value).toBe(15.00);
    });

    it('executes DELETE and returns changes count', async () => {
      const res = await executeRun(db, 'DELETE FROM test_items WHERE id = ?', [1]);
      expect(res.changes).toBe(1);

      const rows = await queryAll(db, 'SELECT * FROM test_items');
      expect(rows).toHaveLength(1);
    });

    it('throws error if database is not provided', async () => {
      await expect(executeRun(null as any, 'DELETE FROM test_items')).rejects.toThrow('Invalid database instance: database is required');
    });
  });
});

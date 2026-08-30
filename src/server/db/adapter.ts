import type { DatabaseSync } from 'node:sqlite';

/**
 * Cloudflare D1-compatible PreparedStatement interface
 */
export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean; meta?: unknown }>;
  run(): Promise<{ success: boolean; meta?: unknown }>;
  raw?<T = unknown>(): Promise<T[]>;
}

/**
 * Cloudflare D1-compatible Database interface
 */
export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike;
  exec?(query: string): Promise<unknown>;
  batch?(statements: D1PreparedStatementLike[]): Promise<{ success: boolean; meta?: unknown }[]>;
}

/**
 * Wraps node:sqlite DatabaseSync instance to present a D1Database-compatible asynchronous API.
 */
export function wrapSqliteDatabase(sqliteDb: DatabaseSync): D1DatabaseLike {
  return {
    prepare(query: string): D1PreparedStatementLike {
      let boundParams: unknown[] = [];
      const stmt = sqliteDb.prepare(query);

      const prepared: D1PreparedStatementLike = {
        bind(...values: unknown[]) {
          boundParams = values;
          return prepared;
        },
        async first<T = unknown>(colName?: string): Promise<T | null> {
          const row = stmt.get(...(boundParams as any[])) as Record<string, unknown> | undefined;
          if (!row) return null;
          if (colName) {
            return (row[colName] as T) ?? null;
          }
          return row as T;
        },
        async all<T = unknown>(): Promise<{ results: T[]; success: boolean; meta?: unknown }> {
          const rows = stmt.all(...(boundParams as any[])) as T[];
          return {
            results: rows,
            success: true,
          };
        },
        async run(): Promise<{ success: boolean; meta?: unknown }> {
          const res = stmt.run(...(boundParams as any[]));
          return {
            success: true,
            meta: {
              changes: res.changes,
              last_row_id: res.lastInsertRowid,
            },
          };
        },
        async raw<T = unknown>(): Promise<T[]> {
          const rows = stmt.all(...(boundParams as any[])) as unknown as T[];
          return rows;
        },
      };

      return prepared;
    },
    async exec(query: string) {
      sqliteDb.exec(query);
      return { count: 1, duration: 0 };
    },
    async batch(statements: D1PreparedStatementLike[]): Promise<{ success: boolean; meta?: unknown }[]> {
      const results = [];
      for (const stmt of statements) {
        results.push(await stmt.run());
      }
      return results;
    },
  };
}

/**
 * Adapts either Cloudflare D1 or Node SQLite DatabaseSync into a uniform D1DatabaseLike instance.
 */
export function adaptDatabase(db: D1DatabaseLike | DatabaseSync): D1DatabaseLike {
  if (!db || typeof db !== 'object') {
    throw new Error('Invalid database instance provided to adaptDatabase');
  }

  // Check if it's a node:sqlite DatabaseSync instance
  if ('prepare' in db) {
    try {
      const testStmt = (db as DatabaseSync).prepare('SELECT 1');
      if (typeof (testStmt as { get?: unknown }).get === 'function' && typeof (testStmt as { bind?: unknown }).bind !== 'function') {
        return wrapSqliteDatabase(db as unknown as DatabaseSync);
      }
    } catch {
      // If test prepare failed, fallback to treating as D1DatabaseLike
    }
    return db as D1DatabaseLike;
  }

  throw new Error('Unsupported database object passed to adaptDatabase');
}

export const toD1Database = adaptDatabase;

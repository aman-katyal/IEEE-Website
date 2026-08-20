/**
 * BoilerBooks 3.0 Universal D1 / SQLite Query Helpers
 * Supports Cloudflare D1 (Workers) and node:sqlite / better-sqlite3 transparently.
 */

import type { DatabaseSync } from 'node:sqlite';
import { adaptDatabase, type D1DatabaseLike, type D1PreparedStatementLike } from './adapter';

export interface D1ResultLike<T = unknown> {
  results?: T[];
  success?: boolean;
  meta?: {
    changes?: number;
    last_row_id?: number | bigint;
    [key: string]: unknown;
  };
}

export type { D1DatabaseLike, D1PreparedStatementLike };

/**
 * Rounds a monetary amount to 2 decimal places with EPSILON protection.
 */
export function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Executes a SELECT query and returns typed row results.
 */
export async function queryAll<T = unknown>(
  dbLike: D1DatabaseLike | DatabaseSync,
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  if (!dbLike) {
    throw new Error('Invalid database instance: database is required');
  }

  const db = adaptDatabase(dbLike);
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  const res = await bound.all<T>();
  return res.results ?? [];
}

/**
 * Executes a single-row SELECT query and returns the first row or null.
 */
export async function queryFirst<T = unknown>(
  dbLike: D1DatabaseLike | DatabaseSync,
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await queryAll<T>(dbLike, sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Executes an INSERT / UPDATE / DELETE query and returns the number of changed rows.
 */
export async function executeRun(
  dbLike: D1DatabaseLike | DatabaseSync,
  sql: string,
  params: unknown[] = []
): Promise<{ changes: number }> {
  if (!dbLike) {
    throw new Error('Invalid database instance: database is required');
  }

  const db = adaptDatabase(dbLike);
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  const res = await bound.run();
  const meta = res?.meta as { changes?: number } | undefined;
  const changes = typeof meta?.changes === 'number' ? meta.changes : res?.success ? 1 : 0;
  return { changes };
}

/**
 * Cloudflare D1 Database Backup & Snapshot Restore Utility.
 */

import { queryAll, type D1DatabaseLike } from './query';
import { toD1Database } from './adapter';

export interface DatabaseBackupSnapshot {
  version: string;
  timestamp: string;
  checksum: string;
  data: {
    fiscalYears: unknown[];
    financeCommittees: unknown[];
    committeeBudgets: unknown[];
    budgetCategories: unknown[];
    purchaseRequests: unknown[];
    memberDues: unknown[];
    fundingInflows: unknown[];
    budgetAuditLogs: unknown[];
  };
}

export interface RestoreResult {
  success: boolean;
  restoredTables: string[];
  totalRecordsRestored: number;
}

/**
 * Computes a simple deterministic checksum for data verification.
 */
function computeChecksum(dataStr: string): string {
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {
    hash = (hash << 5) - hash + dataStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Exports all database tables to a structured JSON snapshot.
 */
export async function exportDatabaseBackup(dbLike: D1DatabaseLike): Promise<DatabaseBackupSnapshot> {
  const db = toD1Database(dbLike);

  const [
    fiscalYears,
    financeCommittees,
    committeeBudgets,
    budgetCategories,
    purchaseRequests,
    memberDues,
    fundingInflows,
    budgetAuditLogs,
  ] = await Promise.all([
    queryAll(db, 'SELECT * FROM fiscal_years'),
    queryAll(db, 'SELECT * FROM finance_committees'),
    queryAll(db, 'SELECT * FROM committee_budgets'),
    queryAll(db, 'SELECT * FROM budget_categories'),
    queryAll(db, 'SELECT * FROM purchase_requests'),
    queryAll(db, 'SELECT * FROM member_dues'),
    queryAll(db, 'SELECT * FROM committee_funding_inflows'),
    queryAll(db, 'SELECT * FROM budget_audit_logs'),
  ]);

  const rawData = {
    fiscalYears,
    financeCommittees,
    committeeBudgets,
    budgetCategories,
    purchaseRequests,
    memberDues,
    fundingInflows,
    budgetAuditLogs,
  };

  const serialized = JSON.stringify(rawData);
  const checksum = computeChecksum(serialized);

  return {
    version: '1.0',
    timestamp: new Date().toISOString(),
    checksum,
    data: rawData,
  };
}

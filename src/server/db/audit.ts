/**
 * BoilerBooks 3.0 Banking-Grade Financial Audit Ledger Service
 * Location: src/server/db/audit.ts
 */

import type { DatabaseSync } from 'node:sqlite';
import { adaptDatabase, type D1DatabaseLike } from './adapter';
import { queryAll } from './query';
import type {
  FinancialAuditLedgerEntry,
  FinancialAuditLedgerRow,
  AuditActionType,
} from './types';
import type { AuthSession } from '../auth/types';

export interface CreateAuditEntryPayload {
  fiscalYearId?: string;
  committeeId: string;
  actionType: AuditActionType;
  actorRole: string;
  actorName: string;
  actorEmail?: string | null;
  description: string;
  previousValue?: string | null;
  newValue?: string | null;
  amountDelta?: number;
}

export async function recordAuditEntry(
  dbLike: D1DatabaseLike | DatabaseSync,
  payload: CreateAuditEntryPayload
): Promise<FinancialAuditLedgerEntry> {
  const db = adaptDatabase(dbLike);
  const id = `audit-${crypto.randomUUID()}`;
  const fiscalYearId = payload.fiscalYearId || 'fy25-26';
  const createdAt = new Date().toISOString();
  const amountDelta = payload.amountDelta ?? 0;

  await db
    .prepare(
      `INSERT INTO financial_audit_ledger (
        id, fiscal_year_id, committee_id, action_type,
        actor_role, actor_name, actor_email, description,
        previous_value, new_value, amount_delta, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      fiscalYearId,
      payload.committeeId,
      payload.actionType,
      payload.actorRole,
      payload.actorName,
      payload.actorEmail || null,
      payload.description,
      payload.previousValue || null,
      payload.newValue || null,
      amountDelta,
      createdAt
    )
    .run();

  return {
    id,
    fiscalYearId,
    committeeId: payload.committeeId,
    actionType: payload.actionType,
    actorRole: payload.actorRole,
    actorName: payload.actorName,
    actorEmail: payload.actorEmail || null,
    description: payload.description,
    previousValue: payload.previousValue || null,
    newValue: payload.newValue || null,
    amountDelta,
    createdAt,
  };
}

export async function listAuditEntries(
  dbLike: D1DatabaseLike | DatabaseSync,
  filter: { committeeId?: string; fiscalYearId?: string; limit?: number } = {},
  session: AuthSession
): Promise<FinancialAuditLedgerEntry[]> {
  if (!session) {
    throw new Error('Unauthorized: Active session required');
  }

  const db = adaptDatabase(dbLike);
  const fiscalYearId = filter.fiscalYearId || 'fy25-26';

  let targetCommitteeId = filter.committeeId;
  // If committee lead, enforce isolation to own committee
  if (session.role === 'COMMITTEE_LEAD') {
    targetCommitteeId = session.committeeId;
  }

  const whereClauses: string[] = ['fal.fiscal_year_id = ?'];
  const params: unknown[] = [fiscalYearId];

  if (targetCommitteeId) {
    whereClauses.push('fal.committee_id = ?');
    params.push(targetCommitteeId);
  }

  const limit = filter.limit && filter.limit > 0 ? Math.min(filter.limit, 200) : 100;
  params.push(limit);

  const sql = `
    SELECT 
      fal.*,
      fc.name AS committee_name
    FROM financial_audit_ledger fal
    LEFT JOIN finance_committees fc ON fal.committee_id = fc.id
    WHERE ${whereClauses.join(' AND ')}
    ORDER BY fal.created_at DESC, fal.rowid DESC
    LIMIT ?
  `;

  const rows = await queryAll<FinancialAuditLedgerRow & { committee_name?: string }>(
    db,
    sql,
    params
  );

  return rows.map((r) => ({
    id: r.id,
    fiscalYearId: r.fiscal_year_id,
    committeeId: r.committee_id,
    committeeName: r.committee_name,
    actionType: r.action_type as AuditActionType,
    actorRole: r.actor_role,
    actorName: r.actor_name,
    actorEmail: r.actor_email,
    description: r.description,
    previousValue: r.previous_value,
    newValue: r.new_value,
    amountDelta: Number(r.amount_delta || 0),
    createdAt: r.created_at,
  }));
}

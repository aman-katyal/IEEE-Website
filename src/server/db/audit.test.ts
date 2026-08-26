import { describe, it, expect, beforeEach } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import { recordAuditEntry, listAuditEntries } from './audit';
import type { AuthSession } from '../auth/types';

describe('Banking Audit Ledger Service', () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    db.exec(`
      CREATE TABLE IF NOT EXISTS finance_committees (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        passcode_hash TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        bank_status TEXT NOT NULL DEFAULT 'Active',
        dues_status TEXT NOT NULL DEFAULT 'Active',
        contact_email TEXT
      );

      CREATE TABLE IF NOT EXISTS financial_audit_ledger (
        id TEXT PRIMARY KEY,
        fiscal_year_id TEXT NOT NULL DEFAULT 'fy25-26',
        committee_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        actor_email TEXT,
        description TEXT NOT NULL,
        previous_value TEXT,
        new_value TEXT,
        amount_delta DECIMAL(10, 2) DEFAULT 0.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO finance_committees (id, name, passcode_hash) VALUES
        ('rov', 'Remotely Operated Vehicles', 'hash'),
        ('racing', 'Purdue Electric Racing', 'hash'),
        ('treasurer', 'Executive Treasurer', 'hash');
    `);
  });

  const treasurerSession: AuthSession = {
    committeeId: 'treasurer',
    role: 'TREASURER',
    name: 'Executive Treasurer',
    isAdmin: true,
    exp: 0,
    iat: 0,
  };

  const rovSession: AuthSession = {
    committeeId: 'rov',
    role: 'COMMITTEE_LEAD',
    name: 'ROV Lead',
    isAdmin: false,
    exp: 0,
    iat: 0,
  };

  it('records an audit entry with delta and retrieves it', async () => {
    const entry = await recordAuditEntry(db, {
      fiscalYearId: 'fy25-26',
      committeeId: 'rov',
      actionType: 'BUDGET_ALLOCATION',
      actorRole: 'TREASURER',
      actorName: 'Executive Treasurer',
      description: 'Base allocated budget increased from $0.00 to $3,500.00 (+3,500.00)',
      previousValue: '0',
      newValue: '3500',
      amountDelta: 3500,
    });

    expect(entry.id).toBeDefined();
    expect(entry.committeeId).toBe('rov');
    expect(entry.amountDelta).toBe(3500);

    const logs = await listAuditEntries(db, { fiscalYearId: 'fy25-26' }, treasurerSession);
    expect(logs.length).toBe(1);
    expect(logs[0].actionType).toBe('BUDGET_ALLOCATION');
    expect(logs[0].amountDelta).toBe(3500);
    expect(logs[0].committeeName).toBe('Remotely Operated Vehicles');
  });

  it('enforces RBAC isolation for committee leads', async () => {
    // Record for ROV
    await recordAuditEntry(db, {
      fiscalYearId: 'fy25-26',
      committeeId: 'rov',
      actionType: 'BUDGET_ALLOCATION',
      actorRole: 'TREASURER',
      actorName: 'Executive Treasurer',
      description: 'ROV Allocation',
      amountDelta: 3000,
    });

    // Record for Racing
    await recordAuditEntry(db, {
      fiscalYearId: 'fy25-26',
      committeeId: 'racing',
      actionType: 'BUDGET_ALLOCATION',
      actorRole: 'TREASURER',
      actorName: 'Executive Treasurer',
      description: 'Racing Allocation',
      amountDelta: 5000,
    });

    // ROV lead query
    const rovLogs = await listAuditEntries(db, { fiscalYearId: 'fy25-26' }, rovSession);
    expect(rovLogs.length).toBe(1);
    expect(rovLogs[0].committeeId).toBe('rov');

    // Treasurer query sees all
    const allLogs = await listAuditEntries(db, { fiscalYearId: 'fy25-26' }, treasurerSession);
    expect(allLogs.length).toBe(2);
  });

  it('records requisition lifecycle audits correctly', async () => {
    await recordAuditEntry(db, {
      fiscalYearId: 'fy25-26',
      committeeId: 'rov',
      actionType: 'PURCHASE_SUBMITTED',
      actorRole: 'COMMITTEE_LEAD',
      actorName: 'Alex Rivera',
      description: 'Submitted purchase PR-101 for $249.99',
      amountDelta: -249.99,
    });

    await recordAuditEntry(db, {
      fiscalYearId: 'fy25-26',
      committeeId: 'rov',
      actionType: 'PURCHASE_APPROVED',
      actorRole: 'TREASURER',
      actorName: 'Executive Treasurer',
      description: 'Approved purchase PR-101 for $249.99',
      amountDelta: -249.99,
    });

    const logs = await listAuditEntries(db, { committeeId: 'rov' }, rovSession);
    expect(logs.length).toBe(2);
    expect(logs[0].actionType).toBe('PURCHASE_APPROVED');
    expect(logs[1].actionType).toBe('PURCHASE_SUBMITTED');
  });
});

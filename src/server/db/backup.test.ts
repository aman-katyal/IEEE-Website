import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { exportDatabaseBackup } from './backup';

describe('D1 Database Backup Suite', () => {
  let db: DatabaseSync;
  const migrationPath = path.resolve(__dirname, '../../../migrations/0001_initial_schema.sql');

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    db.exec('PRAGMA foreign_keys = ON;');
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    db.exec(migrationContent);

    db.exec(`
      INSERT INTO fiscal_years (id, name, start_date, end_date, is_active)
      VALUES ('fy25-26', '2025-2026', '2025-07-01', '2026-06-30', 1);

      INSERT INTO committee_budgets (id, fiscal_year_id, committee_id, allocated_amount, notes)
      VALUES ('b-rov-25', 'fy25-26', 'rov', 5000.00, 'ROV Budget');
    `);
  });

  it('exports structured database snapshot with checksum and timestamps', async () => {
    const backup = await exportDatabaseBackup(db);

    expect(backup.version).toBe('1.0');
    expect(backup.checksum).toBeDefined();
    expect(backup.data.fiscalYears.length).toBe(1);
    expect(backup.data.committeeBudgets.length).toBe(1);
    expect(backup.data.financeCommittees.length).toBeGreaterThan(0);
  });
});

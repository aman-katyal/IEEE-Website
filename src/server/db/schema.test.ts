import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  DEFAULT_SEED_COMMITTEES,
  type FiscalYearRow,
  type FinanceCommitteeRow,
  type CommitteeBudgetRow,
  type BudgetCategoryRow,
  type PurchaseRequestRow,
  type MemberDuesRow,
} from './types';

describe('BoilerBooks D1 Schema & Migrations', () => {
  const migrationPath = path.resolve(__dirname, '../../../migrations/0001_initial_schema.sql');
  const schemaPath = path.resolve(__dirname, 'schema.sql');

  it('verifies that migration SQL and schema SQL files exist and match', () => {
    expect(fs.existsSync(migrationPath)).toBe(true);
    expect(fs.existsSync(schemaPath)).toBe(true);

    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');

    // Verify all 6 core tables are declared
    const expectedTables = [
      'fiscal_years',
      'finance_committees',
      'committee_budgets',
      'budget_categories',
      'purchase_requests',
      'member_dues',
    ];

    for (const table of expectedTables) {
      expect(migrationContent).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
      expect(schemaContent).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }

    // Verify indexes exist
    expect(migrationContent).toContain('idx_purchase_requests_fy');
    expect(migrationContent).toContain('idx_purchase_requests_committee');
    expect(migrationContent).toContain('idx_purchase_requests_status');
    expect(migrationContent).toContain('idx_member_dues_email');
    expect(migrationContent).toContain('idx_member_dues_fy');
  });

  describe('SQLite In-Memory Execution', () => {
    let db: DatabaseSync;

    beforeEach(() => {
      db = new DatabaseSync(':memory:');
      db.exec('PRAGMA foreign_keys = ON;');
      const migrationContent = fs.readFileSync(migrationPath, 'utf8');
      db.exec(migrationContent);
    });

    it('populates default seed committees upon migration execution', () => {
      const stmt = db.prepare('SELECT * FROM finance_committees ORDER BY id ASC');
      const rows = stmt.all() as unknown as FinanceCommitteeRow[];

      expect(rows.length).toBe(10);

      const committeeMap = new Map(rows.map((r) => [r.id, r]));

      // Verify admin committees
      expect(committeeMap.get('treasurer')?.is_admin).toBe(1);
      expect(committeeMap.get('treasurer')?.name).toBe('Exec Treasurer Admin');
      expect(committeeMap.get('treasurer')?.bank_status).toBe('Active');
      expect(committeeMap.get('treasurer')?.dues_status).toBe('Active');

      expect(committeeMap.get('president')?.is_admin).toBe(1);
      expect(committeeMap.get('president')?.name).toBe('Exec President Admin');

      // Verify technical & general committees
      const expectedIds = [
        'aesc',
        'cs',
        'embs',
        'learning',
        'mtts',
        'president',
        'racing',
        'rov',
        'social',
        'treasurer',
      ];
      expect(rows.map((r) => r.id).sort()).toEqual(expectedIds.sort());

      // Verify non-admins
      expect(committeeMap.get('rov')?.is_admin).toBe(0);
      expect(committeeMap.get('racing')?.is_admin).toBe(0);
      expect(committeeMap.get('aesc')?.is_admin).toBe(0);
    });

    it('handles fiscal_years table operations', () => {
      db.exec(`
        INSERT INTO fiscal_years (id, name, start_date, end_date, is_active)
        VALUES ('fy25-26', '2025-2026', '2025-07-01', '2026-06-30', 1);
      `);

      const stmt = db.prepare('SELECT * FROM fiscal_years WHERE id = ?');
      const row = stmt.get('fy25-26') as unknown as FiscalYearRow;

      expect(row).toBeDefined();
      expect(row.id).toBe('fy25-26');
      expect(row.name).toBe('2025-2026');
      expect(row.is_active).toBe(1);
      expect(row.created_at).toBeDefined();
    });

    it('enforces UNIQUE(fiscal_year_id, committee_id) constraint in committee_budgets', () => {
      db.exec(`
        INSERT INTO fiscal_years (id, name, start_date, end_date, is_active)
        VALUES ('fy25-26', '2025-2026', '2025-07-01', '2026-06-30', 1);
      `);

      db.exec(`
        INSERT INTO committee_budgets (id, fiscal_year_id, committee_id, allocated_amount, notes)
        VALUES ('b-rov-25', 'fy25-26', 'rov', 5000.00, 'Initial ROV Budget');
      `);

      const getStmt = db.prepare('SELECT * FROM committee_budgets WHERE id = ?');
      const budget = getStmt.get('b-rov-25') as unknown as CommitteeBudgetRow;
      expect(budget.allocated_amount).toBe(5000.0);
      expect(budget.committee_id).toBe('rov');

      // Attempt duplicate allocation for same FY and committee
      expect(() => {
        db.exec(`
          INSERT INTO committee_budgets (id, fiscal_year_id, committee_id, allocated_amount, notes)
          VALUES ('b-rov-25-dup', 'fy25-26', 'rov', 3000.00, 'Duplicate allocation');
        `);
      }).toThrow();
    });

    it('handles budget_categories and links with purchase_requests', () => {
      db.exec(`
        INSERT INTO fiscal_years (id, name, start_date, end_date, is_active)
        VALUES ('fy25-26', '2025-2026', '2025-07-01', '2026-06-30', 1);
      `);

      db.exec(`
        INSERT INTO budget_categories (id, committee_id, name)
        VALUES ('cat-rov-hardware', 'rov', 'Hardware & Parts');
      `);

      const catStmt = db.prepare('SELECT * FROM budget_categories WHERE id = ?');
      const cat = catStmt.get('cat-rov-hardware') as unknown as BudgetCategoryRow;
      expect(cat.name).toBe('Hardware & Parts');
      expect(cat.committee_id).toBe('rov');

      db.exec(`
        INSERT INTO purchase_requests (
          id, fiscal_year_id, committee_id, category_id,
          requester_name, requester_email, vendor_name, total_amount,
          description, status, receipt_r2_key, receipt_filename, receipt_content_type
        ) VALUES (
          'pr-1001', 'fy25-26', 'rov', 'cat-rov-hardware',
          'Alex Boiler', 'aboiler@purdue.edu', 'DigiKey', 142.50,
          'Microcontrollers and sensors for sub', 'PENDING',
          'receipts/fy25-26/rov/rec_1001.pdf', 'invoice_digikey.pdf', 'application/pdf'
        );
      `);

      const prStmt = db.prepare('SELECT * FROM purchase_requests WHERE id = ?');
      const pr = prStmt.get('pr-1001') as unknown as PurchaseRequestRow;
      expect(pr.total_amount).toBe(142.5);
      expect(pr.status).toBe('PENDING');
      expect(pr.requester_name).toBe('Alex Boiler');
      expect(pr.receipt_r2_key).toBe('receipts/fy25-26/rov/rec_1001.pdf');
    });

    it('enforces foreign key constraints when inserting invalid references', () => {
      expect(() => {
        db.exec(`
          INSERT INTO purchase_requests (
            id, fiscal_year_id, committee_id,
            requester_name, requester_email, vendor_name, total_amount,
            description
          ) VALUES (
            'pr-bad', 'nonexistent_fy', 'rov',
            'Alex Boiler', 'aboiler@purdue.edu', 'Vendor', 50.00, 'Test'
          );
        `);
      }).toThrow();
    });

    it('handles member_dues recording and lookup', () => {
      db.exec(`
        INSERT INTO fiscal_years (id, name, start_date, end_date, is_active)
        VALUES ('fy25-26', '2025-2026', '2025-07-01', '2026-06-30', 1);
      `);

      db.exec(`
        INSERT INTO member_dues (
          id, fiscal_year_id, student_name, purdue_email,
          amount_paid, payment_method, payment_date, semester
        ) VALUES (
          'dues-001', 'fy25-26', 'Jane Pete', 'jpete@purdue.edu',
          15.00, 'TooCOOL', '2025-08-25', 'Fall 2025'
        );
      `);

      const duesStmt = db.prepare('SELECT * FROM member_dues WHERE purdue_email = ?');
      const dues = duesStmt.get('jpete@purdue.edu') as unknown as MemberDuesRow;

      expect(dues).toBeDefined();
      expect(dues.student_name).toBe('Jane Pete');
      expect(dues.amount_paid).toBe(15.0);
      expect(dues.payment_method).toBe('TooCOOL');
      expect(dues.semester).toBe('Fall 2025');
    });
  });

  describe('TypeScript Model Definitions & Seed Constant', () => {
    it('verifies DEFAULT_SEED_COMMITTEES constant definition', () => {
      expect(DEFAULT_SEED_COMMITTEES).toHaveLength(10);

      const treasurer = DEFAULT_SEED_COMMITTEES.find((c) => c.id === 'treasurer');
      expect(treasurer).toBeDefined();
      expect(treasurer?.is_admin).toBe(1);

      const president = DEFAULT_SEED_COMMITTEES.find((c) => c.id === 'president');
      expect(president).toBeDefined();
      expect(president?.is_admin).toBe(1);

      const technicalCommittees = ['rov', 'racing', 'aesc', 'embs', 'mtts', 'cs', 'learning', 'social'];
      for (const id of technicalCommittees) {
        const comm = DEFAULT_SEED_COMMITTEES.find((c) => c.id === id);
        expect(comm).toBeDefined();
        expect(comm?.is_admin).toBe(0);
        expect(comm?.bank_status).toBe('Active');
        expect(comm?.dues_status).toBe('Active');
      }
    });

    it('verifies that official BOSO Statement (SOA #04612) and 16 items are seeded in D1 database', () => {
      const db = new DatabaseSync(':memory:');
      const migrationContent = fs.readFileSync(migrationPath, 'utf8');
      db.exec(migrationContent);

      const statementStmt = db.prepare('SELECT * FROM boso_account_statements WHERE soa_number = ?');
      const stmt = statementStmt.get('04612') as Record<string, unknown>;

      expect(stmt).toBeDefined();
      expect(stmt.account_name).toBe('INST ELECTR ELECTN ENGR SFAB');
      expect(stmt.beginning_balance).toBe(11390.55);
      expect(stmt.total_payments).toBe(1062.77);
      expect(stmt.total_credits).toBe(563.13);
      expect(stmt.total_debits).toBe(10145.53);
      expect(stmt.total_transfers_out).toBe(745.38);
      expect(stmt.ending_balance).toBe(0.00);

      const itemsStmt = db.prepare('SELECT * FROM boso_statement_items WHERE soa_number = ? ORDER BY id ASC');
      const items = itemsStmt.all('04612') as Record<string, unknown>[];

      expect(items).toHaveLength(16);

      const payments = items.filter((i) => i.item_type === 'PAYMENT');
      const credits = items.filter((i) => i.item_type === 'CREDIT');
      const debits = items.filter((i) => i.item_type === 'DEBIT');
      const transfers = items.filter((i) => i.item_type === 'TRANSFER_OUT');

      expect(payments).toHaveLength(8);
      expect(credits).toHaveLength(3);
      expect(debits).toHaveLength(4);
      expect(transfers).toHaveLength(1);
    });
  });
});

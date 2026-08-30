import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  parseTooCOOLCSV,
  isValidEmail,
  parseCurrencyAmount,
  parseDateToISO,
  parseCSVToRows,
} from './parser';
import {
  importDuesBatch,
  recordCashPayment,
  searchMemberDues,
  getDuesStats,
  mapRowToMemberDues,
} from './service';
import type { AuthSession } from '../auth/types';
import type { MemberDuesRow } from '../db/types';

describe('BoilerBooks 3.0 Member Dues & TooCOOL CSV Importer', () => {
  let db: DatabaseSync;
  const migrationPath = path.resolve(__dirname, '../../../migrations/0001_initial_schema.sql');

  const treasurerSession: AuthSession = {
    committeeId: 'treasurer',
    role: 'TREASURER',
    name: 'Exec Treasurer Admin',
    isAdmin: true,
    exp: Date.now() + 3600,
    iat: Date.now(),
  };

  const presidentSession: AuthSession = {
    committeeId: 'president',
    role: 'PRESIDENT',
    name: 'Exec President Admin',
    isAdmin: true,
    exp: Date.now() + 3600,
    iat: Date.now(),
  };

  const leadSession: AuthSession = {
    committeeId: 'rov',
    role: 'COMMITTEE_LEAD',
    name: 'ROV Lead',
    isAdmin: false,
    exp: Date.now() + 3600,
    iat: Date.now(),
  };

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    db.exec('PRAGMA foreign_keys = ON;');
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    db.exec(migrationContent);

    // Setup Test Fiscal Year
    db.exec(`
      INSERT INTO fiscal_years (id, name, start_date, end_date, is_active)
      VALUES ('fy25-26', '2025-2026', '2025-07-01', '2026-06-30', 1);
    `);
  });



  describe('importDuesBatch', () => {
    it('ingests parsed dues records into member_dues table for authorized treasurer', async () => {
      const csv = `Student Name,Purdue Email,Amount Paid,Payment Date,Transaction ID
Neil Armstrong,narmstrong@purdue.edu,$15.00,2025-09-01,TXN-1001
Gene Cernan,gcernan@purdue.edu,$15.00,2025-09-02,TXN-1002`;

      const parsed = parseTooCOOLCSV(csv, 'fy25-26', 'Fall 2025');
      const result = await importDuesBatch(db, parsed.validRecords, treasurerSession);

      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(2);
      expect(result.skippedCount).toBe(0);
      expect(result.totalAmountImported).toBe(30.00);
      expect(result.importedRecords).toHaveLength(2);
      expect(result.importedRecords[0].studentName).toBe('Neil Armstrong');
      expect(result.importedRecords[0].paymentMethod).toBe('TooCOOL');

      // Verify in DB
      const rows = db.prepare('SELECT * FROM member_dues').all() as unknown as MemberDuesRow[];
      expect(rows).toHaveLength(2);
    });

    it('allows president session to import dues batch', async () => {
      const records = [
        {
          fiscalYearId: 'fy25-26',
          studentName: 'President Imported',
          purdueEmail: 'pres_import@purdue.edu',
          amountPaid: 15.00,
          paymentDate: '2025-09-05',
          semester: 'Fall 2025',
        },
      ];

      const result = await importDuesBatch(db, records, presidentSession);
      expect(result.importedCount).toBe(1);
    });

    it('skips duplicate records already existing in the database for that semester', async () => {
      // Seed an existing dues record
      db.exec(`
        INSERT INTO member_dues (id, fiscal_year_id, student_name, purdue_email, amount_paid, payment_method, payment_date, semester)
        VALUES ('dues-seed-1', 'fy25-26', 'Existing Member', 'existing@purdue.edu', 15.00, 'TooCOOL', '2025-09-01', 'Fall 2025');
      `);

      const records = [
        {
          fiscalYearId: 'fy25-26',
          studentName: 'Existing Member',
          purdueEmail: 'existing@purdue.edu',
          amountPaid: 15.00,
          paymentDate: '2025-09-01',
          semester: 'Fall 2025',
        },
        {
          fiscalYearId: 'fy25-26',
          studentName: 'New Member',
          purdueEmail: 'new@purdue.edu',
          amountPaid: 15.00,
          paymentDate: '2025-09-02',
          semester: 'Fall 2025',
        },
      ];

      const result = await importDuesBatch(db, records, treasurerSession);

      expect(result.importedCount).toBe(1);
      expect(result.skippedCount).toBe(1);
      expect(result.skippedRecords[0].purdueEmail).toBe('existing@purdue.edu');
      expect(result.skippedRecords[0].reason).toContain('already recorded');
      expect(result.importedRecords[0].studentName).toBe('New Member');
    });

    it('rejects unauthorized committee lead sessions', async () => {
      await expect(
        importDuesBatch(db, [], leadSession)
      ).rejects.toThrow('Unauthorized');
    });

    it('rejects unauthenticated requests without session', async () => {
      await expect(
        importDuesBatch(db, [], null)
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('recordCashPayment', () => {
    it('records an in-person cash payment with treasurer credentials', async () => {
      const result = await recordCashPayment(
        db,
        {
          fiscalYearId: 'fy25-26',
          studentName: 'Walk-In Student',
          purdueEmail: 'walkin@purdue.edu',
          amountPaid: 15.00,
          semester: 'Fall 2025',
          paymentDate: '2025-09-12',
        },
        treasurerSession
      );

      expect(result.id).toBeDefined();
      expect(result.studentName).toBe('Walk-In Student');
      expect(result.purdueEmail).toBe('walkin@purdue.edu');
      expect(result.paymentMethod).toBe('Cash');
      expect(result.amountPaid).toBe(15.00);
      expect(result.semester).toBe('Fall 2025');

      // Verify row in DB
      const row = db.prepare('SELECT * FROM member_dues WHERE id = ?').get(result.id) as unknown as MemberDuesRow;
      expect(row.payment_method).toBe('Cash');
    });

    it('allows cash payment creation from committee lead and rejects when unauthenticated', async () => {
      const recorded = await recordCashPayment(
        db,
        {
          fiscalYearId: 'fy25-26',
          studentName: 'Walk-In',
          purdueEmail: 'walkin@purdue.edu',
          amountPaid: 15.00,
          semester: 'Fall 2025',
        },
        leadSession
      );
      expect(recorded.studentName).toBe('Walk-In');
      expect(recorded.paymentMethod).toBe('Cash');

      await expect(
        recordCashPayment(
          db,
          {
            fiscalYearId: 'fy25-26',
            studentName: 'Walk-In',
            purdueEmail: 'walkin@purdue.edu',
            amountPaid: 15.00,
            semester: 'Fall 2025',
          },
          null
        )
      ).rejects.toThrow('Unauthorized');
    });

    it('validates invalid input fields for cash payment', async () => {
      await expect(
        recordCashPayment(
          db,
          {
            fiscalYearId: 'fy25-26',
            studentName: '',
            purdueEmail: 'walkin@purdue.edu',
            amountPaid: 15.00,
            semester: 'Fall 2025',
          },
          treasurerSession
        )
      ).rejects.toThrow('Student name is required');

      await expect(
        recordCashPayment(
          db,
          {
            fiscalYearId: 'fy25-26',
            studentName: 'Test',
            purdueEmail: 'invalid-email',
            amountPaid: 15.00,
            semester: 'Fall 2025',
          },
          treasurerSession
        )
      ).rejects.toThrow('Valid Purdue email address is required');

      await expect(
        recordCashPayment(
          db,
          {
            fiscalYearId: 'nonexistent-fy',
            studentName: 'Test',
            purdueEmail: 'test@purdue.edu',
            amountPaid: 15.00,
            semester: 'Fall 2025',
          },
          treasurerSession
        )
      ).rejects.toThrow('does not exist');
    });
  });

  describe('searchMemberDues', () => {
    beforeEach(() => {
      db.exec(`
        INSERT INTO member_dues (id, fiscal_year_id, student_name, purdue_email, amount_paid, payment_method, payment_date, semester) VALUES
          ('dues-1', 'fy25-26', 'Alice Johnson', 'ajohnson@purdue.edu', 15.00, 'TooCOOL', '2025-09-01', 'Fall 2025'),
          ('dues-2', 'fy25-26', 'Bob Smith', 'bsmith@purdue.edu', 15.00, 'TooCOOL', '2025-09-02', 'Fall 2025'),
          ('dues-3', 'fy25-26', 'Charlie Brown', 'cbrown@purdue.edu', 15.00, 'Cash', '2025-09-03', 'Fall 2025'),
          ('dues-4', 'fy25-26', 'Alice Wonderland', 'awonder@purdue.edu', 15.00, 'TooCOOL', '2026-01-15', 'Spring 2026');
      `);
    });

    it('allows committee leads to search roster by student name substring', async () => {
      const results = await searchMemberDues(db, 'Alice', 'fy25-26', leadSession);
      expect(results).toHaveLength(2);
      expect(results.map((r) => r.studentName).sort()).toEqual(['Alice Johnson', 'Alice Wonderland'].sort());
    });

    it('allows search by purdue email substring', async () => {
      const results = await searchMemberDues(db, 'bsmith', 'fy25-26', leadSession);
      expect(results).toHaveLength(1);
      expect(results[0].studentName).toBe('Bob Smith');
    });

    it('filters by semester when specified', async () => {
      const results = await searchMemberDues(db, 'Alice', 'fy25-26', leadSession, 'Fall 2025');
      expect(results).toHaveLength(1);
      expect(results[0].studentName).toBe('Alice Johnson');
    });

    it('returns empty array when search query matches no member', async () => {
      const results = await searchMemberDues(db, 'Nonexistent Person', 'fy25-26', leadSession);
      expect(results).toEqual([]);
    });

    it('rejects unauthenticated requests with no session', async () => {
      await expect(
        searchMemberDues(db, 'Alice', 'fy25-26', null)
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('getDuesStats', () => {
    beforeEach(() => {
      db.exec(`
        INSERT INTO member_dues (id, fiscal_year_id, student_name, purdue_email, amount_paid, payment_method, payment_date, semester) VALUES
          ('dues-1', 'fy25-26', 'Alice Johnson', 'ajohnson@purdue.edu', 15.00, 'TooCOOL', '2025-09-01', 'Fall 2025'),
          ('dues-2', 'fy25-26', 'Bob Smith', 'bsmith@purdue.edu', 15.00, 'TooCOOL', '2025-09-02', 'Fall 2025'),
          ('dues-3', 'fy25-26', 'Charlie Brown', 'cbrown@purdue.edu', 15.00, 'Cash', '2025-09-03', 'Fall 2025'),
          ('dues-4', 'fy25-26', 'David Miller', 'dmiller@purdue.edu', 15.00, 'Cash', '2026-01-10', 'Spring 2026'),
          ('dues-5', 'fy25-26', 'Alice Johnson', 'ajohnson@purdue.edu', 15.00, 'TooCOOL', '2026-01-15', 'Spring 2026');
      `);
    });

    it('calculates total revenue, unique member count, and breakdown by semester and payment method', async () => {
      const stats = await getDuesStats(db, 'fy25-26');

      expect(stats.fiscalYearId).toBe('fy25-26');
      expect(stats.totalRevenue).toBe(75.00);
      expect(stats.totalTransactions).toBe(5);
      expect(stats.totalMembersPaid).toBe(4); // ajohnson paid in both semesters -> 4 unique members

      expect(stats.bySemester['Fall 2025']).toEqual({
        semester: 'Fall 2025',
        memberCount: 3,
        totalAmount: 45.00,
        cashCount: 1,
        cashAmount: 15.00,
        toocoolCount: 2,
        toocoolAmount: 30.00,
      });

      expect(stats.bySemester['Spring 2026']).toEqual({
        semester: 'Spring 2026',
        memberCount: 2,
        totalAmount: 30.00,
        cashCount: 1,
        cashAmount: 15.00,
        toocoolCount: 1,
        toocoolAmount: 15.00,
      });

      expect(stats.paymentMethodBreakdown).toEqual({
        toocoolAmount: 45.00,
        toocoolCount: 3,
        cashAmount: 30.00,
        cashCount: 2,
        otherAmount: 0,
        otherCount: 0,
      });
    });

    it('handles empty fiscal year with 0 stats', async () => {
      const stats = await getDuesStats(db, 'fy-empty');
      expect(stats.totalRevenue).toBe(0);
      expect(stats.totalMembersPaid).toBe(0);
      expect(stats.totalTransactions).toBe(0);
      expect(Object.keys(stats.bySemester)).toHaveLength(0);
    });
  });

  describe('vECOrders Database Deduplication', () => {

    it('disregards existing members in the database when importing batches', async () => {
      // First insert an existing member
      await recordCashPayment(
        db,
        {
          fiscalYearId: 'fy25-26',
          studentName: 'Ryan Leviste',
          purdueEmail: 'ryan.leviste@purdue.edu',
          amountPaid: 10,
          semester: 'Spring 2026',
        },
        treasurerSession
      );

      const recordsToImport = [
        {
          fiscalYearId: 'fy25-26',
          studentName: 'Ryan Leviste',
          purdueEmail: 'ryan.leviste@purdue.edu',
          amountPaid: 10,
          semester: 'Spring 2026',
        },
        {
          fiscalYearId: 'fy25-26',
          studentName: 'New Student',
          purdueEmail: 'newstudent@purdue.edu',
          amountPaid: 15,
          semester: 'Spring 2026',
        },
      ];

      const importResult = await importDuesBatch(db, recordsToImport, treasurerSession, { skipDuplicates: true });
      expect(importResult.importedCount).toBe(1);
      expect(importResult.skippedCount).toBe(1);
      expect(importResult.skippedRecords[0].purdueEmail).toBe('ryan.leviste@purdue.edu');
    });

    it('allows technical committee leads to record cash dues payments', async () => {
      const cashRecord = await recordCashPayment(
        db,
        {
          fiscalYearId: 'fy25-26',
          studentName: 'Committee Member',
          purdueEmail: 'committeemember@purdue.edu',
          amountPaid: 15,
          semester: 'Spring 2026',
        },
        leadSession
      );

      expect(cashRecord.studentName).toBe('Committee Member');
      expect(cashRecord.paymentMethod).toBe('Cash');
      expect(cashRecord.amountPaid).toBe(15);
    });
  });

  describe('mapRowToMemberDues', () => {
    it('correctly maps raw snake_case database row to camelCase domain model', () => {
      const row: MemberDuesRow = {
        id: 'dues-99',
        fiscal_year_id: 'fy25-26',
        student_name: 'Test Student',
        purdue_email: 'test@purdue.edu',
        amount_paid: 15.00,
        payment_method: 'TooCOOL',
        payment_date: '2025-09-01',
        semester: 'Fall 2025',
        created_at: '2025-09-01T12:00:00Z',
      };

      const mapped = mapRowToMemberDues(row);
      expect(mapped).toEqual({
        id: 'dues-99',
        fiscalYearId: 'fy25-26',
        studentName: 'Test Student',
        purdueEmail: 'test@purdue.edu',
        amountPaid: 15.00,
        paymentMethod: 'TooCOOL',
        paymentDate: '2025-09-01',
        semester: 'Fall 2025',
        createdAt: '2025-09-01T12:00:00Z',
      });
    });
  });
});

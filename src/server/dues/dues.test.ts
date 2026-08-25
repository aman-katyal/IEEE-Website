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

  describe('CSV Parser Helper Functions', () => {
    it('validates email addresses accurately', () => {
      expect(isValidEmail('purdue_member@purdue.edu')).toBe(true);
      expect(isValidEmail('john.doe@gmail.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@purdue.edu')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('parses currency strings with symbols, spaces, and decimals', () => {
      expect(parseCurrencyAmount('$15.00')).toBe(15.00);
      expect(parseCurrencyAmount(' 15.50 USD ')).toBe(15.50);
      expect(parseCurrencyAmount('20')).toBe(20.00);
      expect(parseCurrencyAmount(15)).toBe(15.00);
      expect(parseCurrencyAmount('$0.00')).toBeNull();
      expect(parseCurrencyAmount('-15.00')).toBeNull();
      expect(parseCurrencyAmount('free')).toBeNull();
    });

    it('normalizes various date formats to YYYY-MM-DD', () => {
      expect(parseDateToISO('2025-09-15')).toBe('2025-09-15');
      expect(parseDateToISO('2025-09-15T14:30:00Z')).toBe('2025-09-15');
      expect(parseDateToISO('09/15/2025')).toBe('2025-09-15');
      expect(parseDateToISO('9/5/25')).toBe('2025-09-05');
      expect(parseDateToISO('')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('parses RFC 4180 CSV rows with quoted fields and embedded commas', () => {
      const csv = `"Student Name","Email","Amount"\n"Doe, John",jdoe@purdue.edu,"$15.00"\n"Smith, ""Jack""",jsmith@purdue.edu,"$15.00"`;
      const rows = parseCSVToRows(csv);
      expect(rows).toHaveLength(3);
      expect(rows[1][0]).toBe('Doe, John');
      expect(rows[1][1]).toBe('jdoe@purdue.edu');
      expect(rows[2][0]).toBe('Smith, "Jack"');
    });
  });

  describe('parseTooCOOLCSV', () => {
    it('parses standard TooCOOL CSV export with clean rows', () => {
      const csv = `Student Name,Purdue Email,Amount Paid,Payment Date,Transaction ID
Neil Armstrong,narmstrong@purdue.edu,$15.00,2025-09-01,TXN-1001
Gene Cernan,gcernan@purdue.edu,$15.00,2025-09-02,TXN-1002
Amelia Earhart,aearhart@purdue.edu,15.00,09/03/2025,TXN-1003`;

      const result = parseTooCOOLCSV(csv, 'fy25-26', 'Fall 2025');

      expect(result.validCount).toBe(3);
      expect(result.errorCount).toBe(0);
      expect(result.duplicateCount).toBe(0);
      expect(result.totalAmount).toBe(45.00);
      expect(result.validRecords[0]).toEqual({
        studentName: 'Neil Armstrong',
        purdueEmail: 'narmstrong@purdue.edu',
        amountPaid: 15.00,
        paymentDate: '2025-09-01',
        transactionId: 'TXN-1001',
        semester: 'Fall 2025',
        fiscalYearId: 'fy25-26',
        rowNumber: 2,
        rawRow: expect.any(Object),
      });
      expect(result.validRecords[2].paymentDate).toBe('2025-09-03');
    });

    it('handles First Name and Last Name separate columns and BOM character', () => {
      const csv = `\uFEFFFirst Name,Last Name,Email Address,Price,Transaction Date
Gus,Grissom,ggrissom@purdue.edu,$15.00,2025-09-10
Roger,Chaffee,rchaffee@purdue.edu,$15.00,2025-09-11`;

      const result = parseTooCOOLCSV(csv, 'fy25-26', 'Fall 2025');

      expect(result.validCount).toBe(2);
      expect(result.validRecords[0].studentName).toBe('Gus Grissom');
      expect(result.validRecords[0].purdueEmail).toBe('ggrissom@purdue.edu');
      expect(result.validRecords[1].studentName).toBe('Roger Chaffee');
    });

    it('identifies malformed rows with invalid emails or missing names', () => {
      const csv = `Student Name,Email,Amount Paid,Date
,missingname@purdue.edu,$15.00,2025-09-01
Valid Student,notanemail,$15.00,2025-09-01
Another Student,valid@purdue.edu,invalid_amt,2025-09-01
Good Student,good@purdue.edu,$15.00,2025-09-01`;

      const result = parseTooCOOLCSV(csv, 'fy25-26', 'Fall 2025');

      expect(result.validCount).toBe(1);
      expect(result.errorCount).toBe(3);
      expect(result.validRecords[0].studentName).toBe('Good Student');
      expect(result.errors[0].reason).toContain('Missing or empty student name');
      expect(result.errors[1].reason).toContain('Invalid or missing email address');
      expect(result.errors[2].reason).toContain('Invalid or non-positive payment amount');
    });

    it('detects duplicate rows inside the CSV file by email and transaction ID', () => {
      const csv = `Student Name,Email,Amount Paid,Date,Transaction ID
Alex Boiler,aboiler@purdue.edu,$15.00,2025-09-01,TXN-2001
Alex Boiler Duplicate,aboiler@purdue.edu,$15.00,2025-09-01,TXN-2002
Different Person,different@purdue.edu,$15.00,2025-09-01,TXN-2001`;

      const result = parseTooCOOLCSV(csv, 'fy25-26', 'Fall 2025');

      expect(result.validCount).toBe(1);
      expect(result.duplicateCount).toBe(2);
      expect(result.duplicates[0].purdueEmail).toBe('aboiler@purdue.edu');
      expect(result.duplicates[0].originalRowNumber).toBe(2);
      expect(result.duplicates[1].transactionId).toBe('TXN-2001');
    });

    it('throws when fiscalYearId or semester are missing', () => {
      expect(() => parseTooCOOLCSV('Name,Email,Amount\nTest,test@purdue.edu,15', '', 'Fall 2025')).toThrow(
        'fiscalYearId is required'
      );
      expect(() => parseTooCOOLCSV('Name,Email,Amount\nTest,test@purdue.edu,15', 'fy25-26', '')).toThrow(
        'semester is required'
      );
    });
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

  describe('vECOrders Excel XML Parser & Deduplication', () => {
    it('parses Excel 2003 XML spreadsheet (vECOrders format) and normalizes names', () => {
      const xmlData = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Sheet1">
    <Table>
      <Row>
        <Cell><Data ss:Type="String">EC Order</Data></Cell>
        <Cell><Data ss:Type="String">Full Name</Data></Cell>
        <Cell><Data ss:Type="String">EC Customer</Data></Cell>
        <Cell><Data ss:Type="String">Order Date</Data></Cell>
        <Cell><Data ss:Type="String">Invoice Number</Data></Cell>
        <Cell><Data ss:Type="String">Order Amount</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">179435</Data></Cell>
        <Cell><Data ss:Type="String">Leviste, Ryan</Data></Cell>
        <Cell><Data ss:Type="String">91866</Data></Cell>
        <Cell><Data ss:Type="String">2026-03-05T19:47:00.000</Data></Cell>
        <Cell><Data ss:Type="String">149766</Data></Cell>
        <Cell><Data ss:Type="String">10</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">178327</Data></Cell>
        <Cell><Data ss:Type="String">Belhadj, Youssef</Data></Cell>
        <Cell><Data ss:Type="String">91535</Data></Cell>
        <Cell><Data ss:Type="String">2026-02-26T13:14:00.000</Data></Cell>
        <Cell><Data ss:Type="String">148861</Data></Cell>
        <Cell><Data ss:Type="String">15</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
</Workbook>`;

      const result = parseTooCOOLCSV(xmlData, 'fy25-26', 'Spring 2026');
      expect(result.validCount).toBe(2);
      expect(result.validRecords[0].studentName).toBe('Ryan Leviste');
      expect(result.validRecords[0].purdueEmail).toBe('ryan.leviste@purdue.edu');
      expect(result.validRecords[0].amountPaid).toBe(10);
      expect(result.validRecords[0].paymentDate).toBe('2026-03-05');
      expect(result.validRecords[0].transactionId).toBe('179435');

      expect(result.validRecords[1].studentName).toBe('Youssef Belhadj');
      expect(result.validRecords[1].amountPaid).toBe(15);
    });

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

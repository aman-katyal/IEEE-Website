import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  generateCOOLBatch,
  markCOOLBatchProcessed,
  escapeCSVField,
  escapeTSVField,
} from './exporter';
import type { AuthSession } from '../auth/types';
import type { PurchaseRequestRow } from '../db/types';

describe('BoilerBooks Purdue COOL / BOSOP Batch Exporter', () => {
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

    // Setup Purchase Requests
    db.exec(`
      INSERT INTO purchase_requests (
        id, fiscal_year_id, committee_id,
        requester_name, requester_email, vendor_name, total_amount,
        description, status, receipt_r2_key, cool_account_number
      ) VALUES 
        ('pr-001', 'fy25-26', 'rov', 'Alex Boiler', 'aboiler@purdue.edu', 'DigiKey', 142.50, 'Microcontrollers and sensors for sub', 'APPROVED', 'receipts/fy25-26/rov/rec_1001.pdf', '01-234-56'),
        ('pr-002', 'fy25-26', 'racing', 'Sarah Racer', 'sracer@purdue.edu', 'Pololu', 350.00, 'Motor controllers, "special edition"', 'APPROVED', 'receipts/fy25-26/racing/rec_1002.png', '01-234-56'),
        ('pr-003', 'fy25-26', 'cs', 'John Code', 'jcode@purdue.edu', 'AWS', 50.00, 'Cloud server hosting', 'PENDING', NULL, NULL),
        ('pr-004', 'fy25-26', 'rov', 'Alex Boiler', 'aboiler@purdue.edu', 'Mouser', 80.00, 'Resistors and caps', 'REIMBURSED', 'receipts/fy25-26/rov/rec_1004.pdf', '01-234-56');
    `);
  });

  describe('Field Escaping Utilities', () => {
    it('escapes CSV fields with quotes, commas, and newlines per RFC 4180', () => {
      expect(escapeCSVField('Simple Text')).toBe('Simple Text');
      expect(escapeCSVField('Text, with comma')).toBe('"Text, with comma"');
      expect(escapeCSVField('Text with "quotes"')).toBe('"Text with ""quotes"""');
      expect(escapeCSVField('Line 1\nLine 2')).toBe('"Line 1\nLine 2"');
      expect(escapeCSVField(123.45)).toBe('123.45');
      expect(escapeCSVField(null)).toBe('');
    });

    it('escapes TSV fields by stripping tabs and newlines', () => {
      expect(escapeTSVField('Single Line')).toBe('Single Line');
      expect(escapeTSVField('Tab\tSeparated\tValues')).toBe('Tab Separated Values');
      expect(escapeTSVField('Multi\r\nLine\nText')).toBe('Multi Line Text');
      expect(escapeTSVField(null)).toBe('');
    });
  });

  describe('generateCOOLBatch', () => {
    it('defaults to generating batch for all APPROVED requests in the fiscal year', async () => {
      const batch = await generateCOOLBatch(db, 'fy25-26');

      expect(batch.fiscalYearId).toBe('fy25-26');
      expect(batch.batchCount).toBe(2);
      expect(batch.totalBatchAmount).toBe(492.50); // 142.50 + 350.00
      expect(batch.formattedTotalAmount).toBe('$492.50');
      expect(batch.items).toHaveLength(2);

      const item1 = batch.items.find((i) => i.id === 'pr-001');
      expect(item1).toBeDefined();
      expect(item1?.requesterName).toBe('Alex Boiler');
      expect(item1?.requesterEmail).toBe('aboiler@purdue.edu');
      expect(item1?.vendorName).toBe('DigiKey');
      expect(item1?.accountNumber).toBe('01-234-56');
      expect(item1?.receiptUrl).toBe('/api/finance/receipts/receipts/fy25-26/rov/rec_1001.pdf');
      expect(item1?.description).toBe('Microcontrollers and sensors for sub');

      const item2 = batch.items.find((i) => i.id === 'pr-002');
      expect(item2).toBeDefined();
      expect(item2?.requesterName).toBe('Sarah Racer');
      expect(item2?.vendorName).toBe('Pololu');
    });

    it('formats human copyable text with itemized blocks and totals', async () => {
      const batch = await generateCOOLBatch(db, 'fy25-26');

      expect(batch.copyableText).toContain('PURDUE COOL / BOSOP BATCH EXPORT');
      expect(batch.copyableText).toContain('Total Items: 2');
      expect(batch.copyableText).toContain('Total Amount: $492.50');
      expect(batch.copyableText).toContain('Requester: Alex Boiler');
      expect(batch.copyableText).toContain('Purdue Email: aboiler@purdue.edu');
      expect(batch.copyableText).toContain('Vendor: DigiKey');
      expect(batch.copyableText).toContain('Account Line: 01-234-56');
      expect(batch.copyableText).toContain('Total Cost: $142.50');
      expect(batch.copyableText).toContain('Receipt: /api/finance/receipts/receipts/fy25-26/rov/rec_1001.pdf');
    });

    it('generates valid TSV tab-delimited output for 1-click clipboard paste', async () => {
      const batch = await generateCOOLBatch(db, 'fy25-26');

      const lines = batch.tabDelimited.split('\n');
      expect(lines.length).toBe(3); // 1 header + 2 rows

      const header = lines[0].split('\t');
      expect(header).toEqual([
        'Requester Name',
        'Purdue Username',
        'Purdue Email',
        'Phone Number',
        'Funding Source',
        'SFAB Line Item',
        'Disbursement Method',
        'Address',
        'Vendor',
        'Account Line',
        'Total Cost',
        'Receipt Link',
        'Description',
      ]);

      const row1 = lines[1].split('\t');
      expect(row1[0]).toBe('Alex Boiler');
      expect(row1[2]).toBe('aboiler@purdue.edu');
      expect(row1[8]).toBe('DigiKey');
      expect(row1[9]).toBe('01-234-56');
      expect(row1[10]).toBe('142.50');
      expect(row1[11]).toBe('/api/finance/receipts/receipts/fy25-26/rov/rec_1001.pdf');
      expect(row1[12]).toBe('Microcontrollers and sensors for sub');
    });

    it('generates valid RFC 4180 CSV export formatting', async () => {
      const batch = await generateCOOLBatch(db, 'fy25-26');

      const lines = batch.csv.split('\n');
      expect(lines.length).toBe(3); // 1 header + 2 rows

      expect(lines[0]).toBe(
        'Requester Name,Purdue Username,Purdue Email,Phone Number,Funding Source,SFAB Line Item,Disbursement Method,Address,Vendor,Account Line,Total Cost,Receipt Link,Description'
      );

      // Row with quotes in description: 'Motor controllers, "special edition"'
      expect(lines[2]).toContain('"Motor controllers, ""special edition"""');
    });

    it('filters batch by custom status, committeeId, and requestIds', async () => {
      // Filter by PENDING status
      const pendingBatch = await generateCOOLBatch(db, 'fy25-26', { status: 'PENDING' });
      expect(pendingBatch.batchCount).toBe(1);
      expect(pendingBatch.items[0].id).toBe('pr-003');

      // Filter by committee
      const rovBatch = await generateCOOLBatch(db, 'fy25-26', {
        status: ['APPROVED', 'REIMBURSED'],
        committeeId: 'rov',
      });
      expect(rovBatch.batchCount).toBe(2);
      expect(rovBatch.items.map((i) => i.id).sort()).toEqual(['pr-001', 'pr-004'].sort());

      // Filter by specific requestIds
      const selectiveBatch = await generateCOOLBatch(db, 'fy25-26', {
        status: ['APPROVED'],
        requestIds: ['pr-002'],
      });
      expect(selectiveBatch.batchCount).toBe(1);
      expect(selectiveBatch.items[0].id).toBe('pr-002');
    });

    it('handles empty batch gracefully', async () => {
      const emptyBatch = await generateCOOLBatch(db, 'fy25-26', {
        committeeId: 'learning',
      });

      expect(emptyBatch.batchCount).toBe(0);
      expect(emptyBatch.totalBatchAmount).toBe(0);
      expect(emptyBatch.items).toHaveLength(0);
      expect(emptyBatch.copyableText).toContain('No matching reimbursement items found.');
    });
  });

  describe('markCOOLBatchProcessed', () => {
    it('updates requests to REIMBURSED status with batchId and timestamp', async () => {
      const result = await markCOOLBatchProcessed(
        db,
        ['pr-001', 'pr-002'],
        'BATCH-2026-08-20-001',
        treasurerSession
      );

      expect(result.success).toBe(true);
      expect(result.batchId).toBe('BATCH-2026-08-20-001');
      expect(result.updatedCount).toBe(2);
      expect(result.requestIds).toEqual(['pr-001', 'pr-002']);

      // Verify database state
      const stmt = db.prepare('SELECT * FROM purchase_requests WHERE id IN (\'pr-001\', \'pr-002\')');
      const rows = stmt.all() as unknown as PurchaseRequestRow[];

      for (const row of rows) {
        expect(row.status).toBe('REIMBURSED');
        expect(row.cool_batch_id).toBe('BATCH-2026-08-20-001');
        expect(row.reimbursed_at).toBeDefined();
      }
    });

    it('rejects unauthorized sessions (non-admin committee lead)', async () => {
      await expect(
        markCOOLBatchProcessed(
          db,
          ['pr-001'],
          'BATCH-TEST',
          leadSession
        )
      ).rejects.toThrow('Forbidden');
    });

    it('rejects unauthenticated calls with null session', async () => {
      await expect(
        markCOOLBatchProcessed(
          db,
          ['pr-001'],
          'BATCH-TEST',
          null
        )
      ).rejects.toThrow('Unauthorized');
    });

    it('handles empty requestIds array cleanly', async () => {
      const result = await markCOOLBatchProcessed(
        db,
        [],
        'BATCH-EMPTY',
        treasurerSession
      );

      expect(result.success).toBe(false);
      expect(result.updatedCount).toBe(0);
    });

    it('throws on missing batchId', async () => {
      await expect(
        markCOOLBatchProcessed(
          db,
          ['pr-001'],
          '',
          treasurerSession
        )
      ).rejects.toThrow('Invalid batchId');
    });
  });
});

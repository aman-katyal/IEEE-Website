import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  createPurchaseRequest,
  listPurchaseRequests,
  getPurchaseRequest,
  updatePurchaseStatus,
  getCommitteeBudgetSummary,
  validatePurchaseRequestFields,
} from './service';
import type { AuthSession } from '../auth/types';

describe('BoilerBooks Purchase Request Engine & Service', () => {
  let db: DatabaseSync;
  const migrationPath = path.resolve(__dirname, '../../../migrations/0001_initial_schema.sql');

  // Test Sessions
  const rovLeadSession: AuthSession = {
    committeeId: 'rov',
    role: 'COMMITTEE_LEAD',
    name: 'ROV Lead',
    isAdmin: false,
    exp: Date.now() + 3600000,
    iat: Date.now(),
  };

  const racingLeadSession: AuthSession = {
    committeeId: 'racing',
    role: 'COMMITTEE_LEAD',
    name: 'Racing Lead',
    isAdmin: false,
    exp: Date.now() + 3600000,
    iat: Date.now(),
  };

  const treasurerSession: AuthSession = {
    committeeId: 'treasurer',
    role: 'TREASURER',
    name: 'Purdue IEEE Treasurer',
    isAdmin: true,
    exp: Date.now() + 3600000,
    iat: Date.now(),
  };

  const presidentSession: AuthSession = {
    committeeId: 'president',
    role: 'PRESIDENT',
    name: 'Purdue IEEE President',
    isAdmin: true,
    exp: Date.now() + 3600000,
    iat: Date.now(),
  };

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    db.exec('PRAGMA foreign_keys = ON;');
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    db.exec(migrationContent);

    // Setup active fiscal year
    db.exec(`
      INSERT INTO fiscal_years (id, name, start_date, end_date, is_active)
      VALUES ('fy25-26', '2025-2026', '2025-07-01', '2026-06-30', 1);
    `);

    // Setup budgets
    db.exec(`
      INSERT INTO committee_budgets (id, fiscal_year_id, committee_id, allocated_amount, notes)
      VALUES 
        ('b-rov-25', 'fy25-26', 'rov', 5000.00, 'ROV FY25-26 Allocated Budget'),
        ('b-racing-25', 'fy25-26', 'racing', 4000.00, 'Racing FY25-26 Allocated Budget'),
        ('b-learning-25', 'fy25-26', 'learning', 0.00, 'Zero budget allocation');
    `);

    // Setup budget categories
    db.exec(`
      INSERT INTO budget_categories (id, committee_id, name)
      VALUES 
        ('cat-rov-hw', 'rov', 'Hardware & Sensors'),
        ('cat-rov-travel', 'rov', 'Competition Travel'),
        ('cat-racing-parts', 'racing', 'Motor & Electronics');
    `);
  });

  describe('Validation of Input Fields', () => {
    it('should validate all required fields strictly', () => {
      expect(() =>
        validatePurchaseRequestFields({
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: '',
          requesterEmail: 'alex@purdue.edu',
          vendorName: 'DigiKey',
          totalAmount: 50.0,
          description: 'Sensors',
        })
      ).toThrow('Requester name is required');

      expect(() =>
        validatePurchaseRequestFields({
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: 'Alex',
          requesterEmail: 'invalid-email',
          vendorName: 'DigiKey',
          totalAmount: 50.0,
          description: 'Sensors',
        })
      ).toThrow('Valid email address is required');

      expect(() =>
        validatePurchaseRequestFields({
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: 'Alex',
          requesterEmail: 'alex@purdue.edu',
          vendorName: '',
          totalAmount: 50.0,
          description: 'Sensors',
        })
      ).toThrow('Vendor name is required');

      expect(() =>
        validatePurchaseRequestFields({
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: 'Alex',
          requesterEmail: 'alex@purdue.edu',
          vendorName: 'DigiKey',
          totalAmount: -10.0,
          description: 'Sensors',
        })
      ).toThrow('Total amount must be a positive number');

      expect(() =>
        validatePurchaseRequestFields({
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: 'Alex',
          requesterEmail: 'alex@purdue.edu',
          vendorName: 'DigiKey',
          totalAmount: 0,
          description: 'Sensors',
        })
      ).toThrow('Total amount must be a positive number');
    });
  });

  describe('createPurchaseRequest', () => {
    it('allows a committee lead to submit a valid purchase request for their committee', async () => {
      const result = await createPurchaseRequest(
        db,
        {
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          categoryId: 'cat-rov-hw',
          requesterName: 'Alex Boiler',
          requesterEmail: 'aboiler@purdue.edu',
          vendorName: 'Mouser Electronics',
          totalAmount: 249.99,
          description: 'Microcontroller boards and breakout chips',
          receiptR2Key: 'receipts/fy25-26/rov/rec_001.pdf',
          receiptFilename: 'mouser_inv.pdf',
          receiptContentType: 'application/pdf',
        },
        rovLeadSession
      );

      expect(result.id).toBeDefined();
      expect(result.fiscalYearId).toBe('fy25-26');
      expect(result.committeeId).toBe('rov');
      expect(result.categoryId).toBe('cat-rov-hw');
      expect(result.categoryName).toBe('Hardware & Sensors');
      expect(result.requesterName).toBe('Alex Boiler');
      expect(result.requesterEmail).toBe('aboiler@purdue.edu');
      expect(result.vendorName).toBe('Mouser Electronics');
      expect(result.totalAmount).toBe(249.99);
      expect(result.status).toBe('PENDING');
      expect(result.receiptR2Key).toBe('receipts/fy25-26/rov/rec_001.pdf');
      expect(result.receiptFilename).toBe('mouser_inv.pdf');
      expect(result.receiptContentType).toBe('application/pdf');
      expect(result.isOverBudget).toBe(false);
      expect(result.budgetWarning).toBeUndefined();
    });

    it('allows a treasurer to submit purchase requests for any committee', async () => {
      const result = await createPurchaseRequest(
        db,
        {
          fiscalYearId: 'fy25-26',
          committeeId: 'racing',
          categoryId: 'cat-racing-parts',
          requesterName: 'Pat Racer',
          requesterEmail: 'pracer@purdue.edu',
          vendorName: 'Grainger',
          totalAmount: 120.0,
          description: 'Motor mounting hardware',
        },
        treasurerSession
      );

      expect(result.committeeId).toBe('racing');
      expect(result.categoryName).toBe('Motor & Electronics');
      expect(result.totalAmount).toBe(120.0);
    });

    it('rejects purchase request submission when committee lead tries to submit for another committee', async () => {
      await expect(
        createPurchaseRequest(
          db,
          {
            fiscalYearId: 'fy25-26',
            committeeId: 'racing', // ROV lead submitting for Racing
            requesterName: 'Alex Boiler',
            requesterEmail: 'aboiler@purdue.edu',
            vendorName: 'DigiKey',
            totalAmount: 50.0,
            description: 'Sensors',
          },
          rovLeadSession
        )
      ).rejects.toThrow('Unauthorized: Committee leads for "rov" cannot create purchase requests for "racing"');
    });

    it('warns when purchase request exceeds remaining committee budget allocation', async () => {
      // ROV has $5,000 allocated. Submit a $6,500 request.
      const result = await createPurchaseRequest(
        db,
        {
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: 'Alex Boiler',
          requesterEmail: 'aboiler@purdue.edu',
          vendorName: 'Heavy Equipment Supply',
          totalAmount: 6500.0,
          description: 'Custom underwater chassis fabrication',
        },
        rovLeadSession
      );

      expect(result.isOverBudget).toBe(true);
      expect(result.budgetWarning).toBeDefined();
      expect(result.budgetWarning).toContain('exceeds committee remaining budget');
      expect(result.status).toBe('PENDING');
    });

    it('warns when committee has no budget allocation ($0.00)', async () => {
      const result = await createPurchaseRequest(
        db,
        {
          fiscalYearId: 'fy25-26',
          committeeId: 'learning',
          requesterName: 'Taylor Student',
          requesterEmail: 'tstudent@purdue.edu',
          vendorName: 'Amazon',
          totalAmount: 45.0,
          description: 'Whiteboard markers for Code Cafe',
        },
        treasurerSession
      );

      expect(result.isOverBudget).toBe(true);
      expect(result.budgetWarning).toContain('has no allocated budget');
    });

    it('rejects submission with non-existent fiscal year or committee', async () => {
      await expect(
        createPurchaseRequest(
          db,
          {
            fiscalYearId: 'nonexistent-fy',
            committeeId: 'rov',
            requesterName: 'Alex',
            requesterEmail: 'alex@purdue.edu',
            vendorName: 'Vendor',
            totalAmount: 50.0,
            description: 'Parts',
          },
          rovLeadSession
        )
      ).rejects.toThrow('Fiscal year "nonexistent-fy" does not exist');

      await expect(
        createPurchaseRequest(
          db,
          {
            fiscalYearId: 'fy25-26',
            committeeId: 'nonexistent-committee',
            requesterName: 'Alex',
            requesterEmail: 'alex@purdue.edu',
            vendorName: 'Vendor',
            totalAmount: 50.0,
            description: 'Parts',
          },
          treasurerSession
        )
      ).rejects.toThrow('Finance committee "nonexistent-committee" does not exist');
    });

    it('rejects submission when category belongs to a different committee', async () => {
      await expect(
        createPurchaseRequest(
          db,
          {
            fiscalYearId: 'fy25-26',
            committeeId: 'rov',
            categoryId: 'cat-racing-parts', // Category belongs to racing!
            requesterName: 'Alex Boiler',
            requesterEmail: 'aboiler@purdue.edu',
            vendorName: 'Mouser',
            totalAmount: 50.0,
            description: 'Parts',
          },
          rovLeadSession
        )
      ).rejects.toThrow('Budget category "cat-racing-parts" does not exist for committee "rov"');
    });
  });

  describe('listPurchaseRequests & RBAC Committee Isolation', () => {
    beforeEach(async () => {
      // Seed 2 ROV requests and 2 Racing requests
      await createPurchaseRequest(
        db,
        {
          id: 'pr-rov-1',
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          categoryId: 'cat-rov-hw',
          requesterName: 'ROV Submitter 1',
          requesterEmail: 'rov1@purdue.edu',
          vendorName: 'Vendor A',
          totalAmount: 100.0,
          description: 'ROV Part 1',
        },
        rovLeadSession
      );

      await createPurchaseRequest(
        db,
        {
          id: 'pr-rov-2',
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          categoryId: 'cat-rov-travel',
          requesterName: 'ROV Submitter 2',
          requesterEmail: 'rov2@purdue.edu',
          vendorName: 'Hotel Vendor',
          totalAmount: 400.0,
          description: 'ROV Travel lodging',
        },
        rovLeadSession
      );

      await createPurchaseRequest(
        db,
        {
          id: 'pr-racing-1',
          fiscalYearId: 'fy25-26',
          committeeId: 'racing',
          categoryId: 'cat-racing-parts',
          requesterName: 'Racing Submitter 1',
          requesterEmail: 'racing1@purdue.edu',
          vendorName: 'Vendor C',
          totalAmount: 75.0,
          description: 'Racing Part 1',
        },
        racingLeadSession
      );

      await createPurchaseRequest(
        db,
        {
          id: 'pr-racing-2',
          fiscalYearId: 'fy25-26',
          committeeId: 'racing',
          categoryId: 'cat-racing-parts',
          requesterName: 'Racing Submitter 2',
          requesterEmail: 'racing2@purdue.edu',
          vendorName: 'Vendor D',
          totalAmount: 150.0,
          description: 'Racing Part 2',
        },
        racingLeadSession
      );
    });

    it('enforces that Committee Leads can only view their own committee purchase requests', async () => {
      const rovList = await listPurchaseRequests(db, {}, rovLeadSession);
      expect(rovList.length).toBe(2);
      expect(rovList.every((r) => r.committeeId === 'rov')).toBe(true);

      const racingList = await listPurchaseRequests(db, {}, racingLeadSession);
      expect(racingList.length).toBe(2);
      expect(racingList.every((r) => r.committeeId === 'racing')).toBe(true);
    });

    it('prevents Committee Lead from bypassing isolation by specifying another committeeId filter', async () => {
      // ROV lead requests with filter committeeId = 'racing'
      const list = await listPurchaseRequests(
        db,
        { committeeId: 'racing' },
        rovLeadSession
      );

      // Must be forced to return only ROV requests
      expect(list.length).toBe(2);
      expect(list.every((r) => r.committeeId === 'rov')).toBe(true);
    });

    it('allows Treasurers and Admins to view all requests and filter by committee', async () => {
      const allList = await listPurchaseRequests(db, {}, treasurerSession);
      expect(allList.length).toBe(4);

      const filteredRacing = await listPurchaseRequests(
        db,
        { committeeId: 'racing' },
        treasurerSession
      );
      expect(filteredRacing.length).toBe(2);
      expect(filteredRacing.every((r) => r.committeeId === 'racing')).toBe(true);

      const filteredRov = await listPurchaseRequests(
        db,
        { committeeId: 'rov' },
        presidentSession
      );
      expect(filteredRov.length).toBe(2);
      expect(filteredRov.every((r) => r.committeeId === 'rov')).toBe(true);
    });

    it('filters by status and fiscalYearId correctly', async () => {
      const list = await listPurchaseRequests(
        db,
        { fiscalYearId: 'fy25-26', status: 'PENDING' },
        treasurerSession
      );
      expect(list.length).toBe(4);

      const emptyList = await listPurchaseRequests(
        db,
        { fiscalYearId: 'fy25-26', status: 'REIMBURSED' },
        treasurerSession
      );
      expect(emptyList.length).toBe(0);
    });
  });

  describe('getPurchaseRequest', () => {
    it('retrieves detailed purchase request with receipt metadata for owner lead', async () => {
      const created = await createPurchaseRequest(
        db,
        {
          id: 'pr-detail-test',
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          categoryId: 'cat-rov-hw',
          requesterName: 'Alex Boiler',
          requesterEmail: 'aboiler@purdue.edu',
          vendorName: 'DigiKey',
          totalAmount: 180.0,
          description: 'Sensors',
          receiptR2Key: 'receipts/fy25-26/rov/rec_test.pdf',
          receiptFilename: 'receipt.pdf',
          receiptContentType: 'application/pdf',
        },
        rovLeadSession
      );

      const record = await getPurchaseRequest(db, created.id, rovLeadSession);
      expect(record).not.toBeNull();
      expect(record?.id).toBe('pr-detail-test');
      expect(record?.categoryName).toBe('Hardware & Sensors');
      expect(record?.receiptR2Key).toBe('receipts/fy25-26/rov/rec_test.pdf');
    });

    it('blocks Committee Lead from viewing requests belonging to other committees', async () => {
      const created = await createPurchaseRequest(
        db,
        {
          id: 'pr-racing-secret',
          fiscalYearId: 'fy25-26',
          committeeId: 'racing',
          requesterName: 'Racing Lead',
          requesterEmail: 'racing@purdue.edu',
          vendorName: 'Vendor',
          totalAmount: 300.0,
          description: 'Confidential race motor',
        },
        racingLeadSession
      );

      // ROV lead tries to fetch Racing's request ID
      await expect(
        getPurchaseRequest(db, created.id, rovLeadSession)
      ).rejects.toThrow('Unauthorized: Cannot access purchase requests of other committees');
    });

    it('allows Treasurer to view any purchase request by ID', async () => {
      const created = await createPurchaseRequest(
        db,
        {
          id: 'pr-racing-public',
          fiscalYearId: 'fy25-26',
          committeeId: 'racing',
          requesterName: 'Racing Lead',
          requesterEmail: 'racing@purdue.edu',
          vendorName: 'Vendor',
          totalAmount: 300.0,
          description: 'Motor',
        },
        racingLeadSession
      );

      const record = await getPurchaseRequest(db, created.id, treasurerSession);
      expect(record).not.toBeNull();
      expect(record?.id).toBe('pr-racing-public');
    });

    it('returns null for non-existent purchase request ID', async () => {
      const record = await getPurchaseRequest(db, 'nonexistent-pr-id', treasurerSession);
      expect(record).toBeNull();
    });
  });

  describe('updatePurchaseStatus & State Transitions', () => {
    it('blocks Committee Leads from updating status', async () => {
      const created = await createPurchaseRequest(
        db,
        {
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: 'Alex Boiler',
          requesterEmail: 'aboiler@purdue.edu',
          vendorName: 'DigiKey',
          totalAmount: 100.0,
          description: 'Sensors',
        },
        rovLeadSession
      );

      await expect(
        updatePurchaseStatus(db, created.id, 'APPROVED', 'Approved by lead', rovLeadSession)
      ).rejects.toThrow('Unauthorized: Only treasurers and administrators can update purchase status');
    });

    it('supports status transition lifecycle: PENDING -> APPROVED -> PURCHASED -> REIMBURSED', async () => {
      const created = await createPurchaseRequest(
        db,
        {
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: 'Alex Boiler',
          requesterEmail: 'aboiler@purdue.edu',
          vendorName: 'DigiKey',
          totalAmount: 200.0,
          description: 'Sensors',
        },
        rovLeadSession
      );

      expect(created.status).toBe('PENDING');

      // 1. PENDING -> APPROVED
      const approved = await updatePurchaseStatus(
        db,
        created.id,
        'APPROVED',
        'Tax-exempt verified; approved for ordering',
        treasurerSession
      );
      expect(approved.status).toBe('APPROVED');
      expect(approved.approvedAt).toBeDefined();
      expect(approved.treasurerNotes).toBe('Tax-exempt verified; approved for ordering');

      // 2. APPROVED -> PURCHASED
      const purchased = await updatePurchaseStatus(
        db,
        created.id,
        'PURCHASED',
        'Order placed on IEEE business card',
        treasurerSession
      );
      expect(purchased.status).toBe('PURCHASED');
      expect(purchased.approvedAt).toBe(approved.approvedAt);

      // 3. PURCHASED -> REIMBURSED
      const reimbursed = await updatePurchaseStatus(
        db,
        created.id,
        'REIMBURSED',
        'COOL Check disbursed',
        treasurerSession,
        'COOL-BATCH-2026-08'
      );
      expect(reimbursed.status).toBe('REIMBURSED');
      expect(reimbursed.reimbursedAt).toBeDefined();
      expect(reimbursed.coolBatchId).toBe('COOL-BATCH-2026-08');
    });

    it('supports direct PENDING -> REJECTED transition', async () => {
      const created = await createPurchaseRequest(
        db,
        {
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: 'Alex Boiler',
          requesterEmail: 'aboiler@purdue.edu',
          vendorName: 'Personal Store',
          totalAmount: 50.0,
          description: 'Non-approved item',
        },
        rovLeadSession
      );

      const rejected = await updatePurchaseStatus(
        db,
        created.id,
        'REJECTED',
        'Sales tax included; please resubmit without sales tax',
        treasurerSession
      );
      expect(rejected.status).toBe('REJECTED');
      expect(rejected.treasurerNotes).toContain('Sales tax included');
    });

    it('rejects invalid status strings or non-existent requests', async () => {
      await expect(
        // @ts-expect-error test invalid status
        updatePurchaseStatus(db, 'pr-123', 'INVALID_STATUS', '', treasurerSession)
      ).rejects.toThrow('Invalid purchase request status');

      await expect(
        updatePurchaseStatus(db, 'nonexistent-id', 'APPROVED', '', treasurerSession)
      ).rejects.toThrow('Purchase request "nonexistent-id" not found');
    });
  });

  describe('getCommitteeBudgetSummary', () => {
    it('accurately tracks allocated, spent, pending, and remaining budgets', async () => {
      // Initial state: $5000 allocated, $0 spent, $0 pending, $5000 remaining
      let summary = await getCommitteeBudgetSummary(db, 'fy25-26', 'rov');
      expect(summary.allocatedAmount).toBe(5000.0);
      expect(summary.spentAmount).toBe(0);
      expect(summary.pendingAmount).toBe(0);
      expect(summary.remainingAmount).toBe(5000.0);
      expect(summary.isOverBudget).toBe(false);

      // Create a $1000 PENDING request
      const pr1 = await createPurchaseRequest(
        db,
        {
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: 'Alex',
          requesterEmail: 'alex@purdue.edu',
          vendorName: 'Vendor 1',
          totalAmount: 1000.0,
          description: 'Sub part',
        },
        rovLeadSession
      );

      summary = await getCommitteeBudgetSummary(db, 'fy25-26', 'rov');
      expect(summary.pendingAmount).toBe(1000.0);
      expect(summary.spentAmount).toBe(0);
      expect(summary.remainingAmount).toBe(4000.0);

      // Approve and reimburse pr1 ($1000 moves to spent)
      await updatePurchaseStatus(db, pr1.id, 'REIMBURSED', 'Paid', treasurerSession);

      summary = await getCommitteeBudgetSummary(db, 'fy25-26', 'rov');
      expect(summary.pendingAmount).toBe(0);
      expect(summary.spentAmount).toBe(1000.0);
      expect(summary.remainingAmount).toBe(4000.0);

      // Create another $4500 PENDING request (exceeds $4000 remaining)
      await createPurchaseRequest(
        db,
        {
          fiscalYearId: 'fy25-26',
          committeeId: 'rov',
          requesterName: 'Alex',
          requesterEmail: 'alex@purdue.edu',
          vendorName: 'Vendor 2',
          totalAmount: 4500.0,
          description: 'Big chassis order',
        },
        rovLeadSession
      );

      summary = await getCommitteeBudgetSummary(db, 'fy25-26', 'rov');
      expect(summary.pendingAmount).toBe(4500.0);
      expect(summary.spentAmount).toBe(1000.0);
      expect(summary.remainingAmount).toBe(-500.0);
      expect(summary.isOverBudget).toBe(true);
    });
  });
});

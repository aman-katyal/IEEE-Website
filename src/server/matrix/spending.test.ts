import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  calculateCommitteeSpending,
  calculateCategoryBreakdown,
  recordCommitteeFundingInflow,
  recordBudgetAdjustmentAudit,
  getBudgetAuditHistory,
  updateCommitteeParameters,
  createCommittee,
  deleteCommittee,
} from './spending';

describe('BoilerBooks Treasurer Master Spending Matrix', () => {
  let db: DatabaseSync;
  const migrationPath = path.resolve(__dirname, '../../../migrations/0001_initial_schema.sql');

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    db.exec('PRAGMA foreign_keys = ON;');
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    db.exec(migrationContent);

    // Setup Test Fiscal Years
    db.exec(`
      INSERT INTO fiscal_years (id, name, start_date, end_date, is_active)
      VALUES 
        ('fy25-26', '2025-2026', '2025-07-01', '2026-06-30', 1),
        ('fy24-25', '2024-2025', '2024-07-01', '2025-06-30', 0);
    `);

    // Setup Committee Budgets
    db.exec(`
      INSERT INTO committee_budgets (id, fiscal_year_id, committee_id, allocated_amount, notes)
      VALUES 
        ('b-rov-25', 'fy25-26', 'rov', 5000.00, 'ROV Underwater Sub Budget'),
        ('b-racing-25', 'fy25-26', 'racing', 4000.00, 'IEEE Racing Budget'),
        ('b-cs-25', 'fy25-26', 'cs', 2000.00, 'Computer Society Software & Servers'),
        ('b-rov-24', 'fy24-25', 'rov', 4500.00, 'Prior Year ROV Budget');
    `);

    // Setup Budget Categories
    db.exec(`
      INSERT INTO budget_categories (id, committee_id, name)
      VALUES 
        ('cat-rov-hw', 'rov', 'Hardware & Sensors'),
        ('cat-rov-travel', 'rov', 'Competition Travel'),
        ('cat-racing-parts', 'racing', 'Motor & Battery');
    `);

    // Setup Purchase Requests for fy25-26
    db.exec(`
      INSERT INTO purchase_requests (
        id, fiscal_year_id, committee_id, category_id,
        requester_name, requester_email, vendor_name, total_amount,
        description, status
      ) VALUES 
        -- ROV requests
        ('pr-rov-1', 'fy25-26', 'rov', 'cat-rov-hw', 'Alex Boiler', 'aboiler@purdue.edu', 'DigiKey', 600.00, 'Microcontrollers', 'APPROVED'),
        ('pr-rov-2', 'fy25-26', 'rov', 'cat-rov-hw', 'Alex Boiler', 'aboiler@purdue.edu', 'Mouser', 400.00, 'Pressure Sensor', 'REIMBURSED'),
        ('pr-rov-3', 'fy25-26', 'rov', 'cat-rov-travel', 'Sam Sub', 'ssub@purdue.edu', 'Delta Air', 500.00, 'Flight tickets', 'PENDING'),
        ('pr-rov-4', 'fy25-26', 'rov', NULL, 'Sam Sub', 'ssub@purdue.edu', 'Target', 150.00, 'Tote storage boxes', 'APPROVED'),
        ('pr-rov-5', 'fy25-26', 'rov', 'cat-rov-hw', 'Alex Boiler', 'aboiler@purdue.edu', 'Amazon', 100.00, 'Defective motor', 'REJECTED'),

        -- Racing requests
        ('pr-rac-1', 'fy25-26', 'racing', 'cat-racing-parts', 'Taylor Speed', 'tspeed@purdue.edu', 'Pololu', 1200.00, 'BLDC Motors', 'APPROVED'),
        ('pr-rac-2', 'fy25-26', 'racing', 'cat-racing-parts', 'Taylor Speed', 'tspeed@purdue.edu', 'HobbyKing', 800.00, 'LiPo Packs', 'REIMBURSED'),

        -- Prior year request (must not affect fy25-26)
        ('pr-old-1', 'fy24-25', 'rov', 'cat-rov-hw', 'Alex Boiler', 'aboiler@purdue.edu', 'DigiKey', 999.00, 'Old parts', 'APPROVED');
    `);
  });

  describe('calculateCommitteeSpending', () => {
    it('accurately aggregates allocated, approved, pending, reimbursed, and remaining spending per committee', async () => {
      const summary = await calculateCommitteeSpending(db, 'fy25-26');

      expect(summary.fiscalYearId).toBe('fy25-26');
      expect(summary.committees).toBeDefined();
      expect(summary.committees.length).toBe(10); // 10 seed committees

      const rov = summary.committees.find((c) => c.committeeId === 'rov');
      expect(rov).toBeDefined();
      expect(rov?.allocatedAmount).toBe(5000.0);
      expect(rov?.approvedAmount).toBe(750.0); // pr-rov-1 (600) + pr-rov-4 (150)
      expect(rov?.reimbursedAmount).toBe(400.0); // pr-rov-2 (400)
      expect(rov?.spentAmount).toBe(1150.0); // approved (750) + reimbursed (400)
      expect(rov?.pendingAmount).toBe(500.0); // pr-rov-3 (500)
      expect(rov?.rejectedAmount).toBe(100.0); // pr-rov-5 (100)
      expect(rov?.remainingAmount).toBe(3850.0); // 5000 - 1150
      expect(rov?.spentPercentage).toBe(23.0); // (1150 / 5000) * 100 = 23%
      expect(rov?.totalRequests).toBe(5);

      const racing = summary.committees.find((c) => c.committeeId === 'racing');
      expect(racing).toBeDefined();
      expect(racing?.allocatedAmount).toBe(4000.0);
      expect(racing?.approvedAmount).toBe(1200.0);
      expect(racing?.reimbursedAmount).toBe(800.0);
      expect(racing?.spentAmount).toBe(2000.0);
      expect(racing?.remainingAmount).toBe(2000.0);
      expect(racing?.spentPercentage).toBe(50.0);
      expect(racing?.totalRequests).toBe(2);

      const cs = summary.committees.find((c) => c.committeeId === 'cs');
      expect(cs).toBeDefined();
      expect(cs?.allocatedAmount).toBe(2000.0);
      expect(cs?.spentAmount).toBe(0.0);
      expect(cs?.remainingAmount).toBe(2000.0);
      expect(cs?.spentPercentage).toBe(0.0);
      expect(cs?.totalRequests).toBe(0);
    });

    it('calculates branch-wide overall spending metrics and totals correctly', async () => {
      const summary = await calculateCommitteeSpending(db, 'fy25-26');

      // Total Allocated: 5000 (ROV) + 4000 (Racing) + 2000 (CS) = 11000.00
      expect(summary.totalAllocated).toBe(11000.0);
      // Total Approved: 750 (ROV) + 1200 (Racing) = 1950.00
      expect(summary.totalApproved).toBe(1950.0);
      // Total Reimbursed: 400 (ROV) + 800 (Racing) = 1200.00
      expect(summary.totalReimbursed).toBe(1200.0);
      // Total Spent: 1950 + 1200 = 3150.00
      expect(summary.totalSpent).toBe(3150.0);
      // Total Pending: 500 (ROV)
      expect(summary.totalPending).toBe(500.0);
      // Total Rejected: 100 (ROV)
      expect(summary.totalRejected).toBe(100.0);
      // Total Remaining: 11000 - 3150 = 7850.00
      expect(summary.totalRemaining).toBe(7850.0);
      // Spent Percentage: (3150 / 11000) * 100 = 28.64%
      expect(summary.spentPercentage).toBe(28.64);
      expect(summary.totalRequests).toBe(7);
    });

    it('handles empty fiscal year with 0 budget and 0 requests', async () => {
      db.exec(`
        INSERT INTO fiscal_years (id, name, start_date, end_date, is_active)
        VALUES ('fy26-27', '2026-2027', '2026-07-01', '2027-06-30', 0);
      `);

      const summary = await calculateCommitteeSpending(db, 'fy26-27');
      expect(summary.totalAllocated).toBe(0);
      expect(summary.totalSpent).toBe(0);
      expect(summary.totalRemaining).toBe(0);
      expect(summary.spentPercentage).toBe(0);
      expect(summary.totalRequests).toBe(0);
    });
  });

  describe('calculateCategoryBreakdown', () => {
    it('aggregates subcategory spending including Uncategorized items for a committee', async () => {
      const breakdown = await calculateCategoryBreakdown(db, 'fy25-26', 'rov');

      expect(breakdown.committeeId).toBe('rov');
      expect(breakdown.committeeName).toBe('Remotely Operated underwater Vehicle');
      expect(breakdown.allocatedAmount).toBe(5000.0);
      expect(breakdown.totalSpent).toBe(1150.0);
      expect(breakdown.totalApproved).toBe(750.0);
      expect(breakdown.totalPending).toBe(500.0);
      expect(breakdown.totalReimbursed).toBe(400.0);
      expect(breakdown.totalRejected).toBe(100.0);
      expect(breakdown.remainingAmount).toBe(3850.0);
      expect(breakdown.spentPercentage).toBe(23.0);

      const hwCategory = breakdown.categories.find((c) => c.categoryId === 'cat-rov-hw');
      expect(hwCategory).toBeDefined();
      expect(hwCategory?.categoryName).toBe('Hardware & Sensors');
      expect(hwCategory?.approvedAmount).toBe(600.0); // pr-rov-1
      expect(hwCategory?.reimbursedAmount).toBe(400.0); // pr-rov-2
      expect(hwCategory?.rejectedAmount).toBe(100.0); // pr-rov-5
      expect(hwCategory?.spentAmount).toBe(1000.0);
      expect(hwCategory?.requestCount).toBe(3);
      // HW spent percentage of committee total spent: (1000 / 1150) * 100 = 86.96%
      expect(hwCategory?.percentageOfCommitteeSpent).toBe(86.96);
      // HW spent percentage of committee allocated budget: (1000 / 5000) * 100 = 20%
      expect(hwCategory?.percentageOfCommitteeBudget).toBe(20.0);

      const travelCategory = breakdown.categories.find((c) => c.categoryId === 'cat-rov-travel');
      expect(travelCategory).toBeDefined();
      expect(travelCategory?.categoryName).toBe('Competition Travel');
      expect(travelCategory?.pendingAmount).toBe(500.0);
      expect(travelCategory?.spentAmount).toBe(0.0);
      expect(travelCategory?.requestCount).toBe(1);

      const uncat = breakdown.categories.find((c) => c.categoryId === null);
      expect(uncat).toBeDefined();
      expect(uncat?.categoryName).toBe('Uncategorized');
      expect(uncat?.approvedAmount).toBe(150.0); // pr-rov-4
      expect(uncat?.spentAmount).toBe(150.0);
      expect(uncat?.percentageOfCommitteeSpent).toBe(13.04); // (150 / 1150) * 100 = 13.04%
      expect(uncat?.requestCount).toBe(1);
    });

    it('returns empty category breakdown for committee with no requests', async () => {
      const breakdown = await calculateCategoryBreakdown(db, 'fy25-26', 'cs');
      expect(breakdown.committeeId).toBe('cs');
      expect(breakdown.allocatedAmount).toBe(2000.0);
      expect(breakdown.totalSpent).toBe(0);
      expect(breakdown.remainingAmount).toBe(2000.0);
      expect(breakdown.categories.length).toBe(0);
    });
  });

  describe('3. Committee Specific Funding Inflows & Grants', () => {
    it('records and persists specific committee funding inflow', async () => {
      const result = await recordCommitteeFundingInflow(db, {
        id: 'inflow-sf-01',
        fiscalYearId: 'fy25-26',
        committeeId: 'rov',
        sourceType: 'SFAB Grant',
        title: 'SFAB Spring 2026 Vehicle Hardware Grant',
        amount: 3500.0,
        referenceNumber: 'SFAB-2026-ROV-01',
        receivedDate: '2026-02-15',
        notes: 'Earmarked for thrusterESC modular upgrade',
        recordedByUserId: 'user-treasurer-01',
      });

      expect(result.id).toBe('inflow-sf-01');
      expect(result.committeeId).toBe('rov');
      expect(result.sourceType).toBe('SFAB Grant');
      expect(result.amount).toBe(3500.0);
      expect(result.referenceNumber).toBe('SFAB-2026-ROV-01');

      // Verify query from SQLite
      const row = db
        .prepare('SELECT * FROM committee_funding_inflows WHERE id = ?')
        .get('inflow-sf-01') as any;

      expect(row).toBeDefined();
      expect(row.title).toBe('SFAB Spring 2026 Vehicle Hardware Grant');
      expect(row.amount).toBe(3500.0);
      expect(row.received_date).toBe('2026-02-15');
    });
  });

  describe('4. Property-Based Double-Entry Ledger Invariants', () => {
    it('maintains total conservation of funds across randomized transaction sequences', async () => {
      // Clear purchase requests
      db.exec('DELETE FROM purchase_requests;');

      const statuses = ['APPROVED', 'REIMBURSED', 'PENDING', 'REJECTED'] as const;
      const committeeIds = ['rov', 'racing', 'cs'] as const;
      const rngAmounts = [12.34, 45.67, 89.01, 100.00, 250.50, 0.99, 15.00];

      // Insert 50 randomized purchase requests
      for (let i = 1; i <= 50; i++) {
        const comm = committeeIds[i % committeeIds.length];
        const status = statuses[i % statuses.length];
        const amount = rngAmounts[i % rngAmounts.length];

        db.exec(`
          INSERT INTO purchase_requests (
            id, fiscal_year_id, committee_id, requester_name, requester_email,
            vendor_name, total_amount, description, status
          ) VALUES (
            'pr-prop-${i}', 'fy25-26', '${comm}', 'Student ${i}', 's${i}@purdue.edu',
            'Vendor ${i}', ${amount}, 'Auto item ${i}', '${status}'
          );
        `);
      }

      const summary = await calculateCommitteeSpending(db, 'fy25-26');

      // Invariant 1: Total Allocated must equal sum of individual committee allocations
      const sumAllocations = summary.committees.reduce((acc, c) => acc + c.allocatedAmount, 0);
      expect(Math.round(summary.totalAllocated * 100)).toBe(Math.round(sumAllocations * 100));

      // Invariant 2: Total Spent must equal Total Approved + Total Reimbursed
      expect(Math.round(summary.totalSpent * 100)).toBe(
        Math.round((summary.totalApproved + summary.totalReimbursed) * 100)
      );

      // Invariant 3: For each committee, Allocated = Spent + Remaining
      for (const comm of summary.committees) {
        expect(Math.round(comm.allocatedAmount * 100)).toBe(
          Math.round((comm.spentAmount + comm.remainingAmount) * 100)
        );
        expect(Math.round(comm.spentAmount * 100)).toBe(
          Math.round((comm.approvedAmount + comm.reimbursedAmount) * 100)
        );
      }

      // Invariant 4: Total Remaining = Total Allocated - Total Spent
      expect(Math.round(summary.totalRemaining * 100)).toBe(
        Math.round((summary.totalAllocated - summary.totalSpent) * 100)
      );
    });
  });

  describe('Budget Audit Trail History', () => {
    it('records and retrieves budget adjustment revisions', async () => {
      const entry = await recordBudgetAdjustmentAudit(db, {
        committeeId: 'rov',
        fiscalYearId: 'fy25-26',
        adjustedBy: 'treasurer@purdueieee.org',
        previousAmount: 5000,
        newAmount: 6500,
        reason: 'Fall Callout Equipment Grants Expansion',
      });

      expect(entry.id).toContain('audit-');
      expect(entry.previousAmount).toBe(5000);
      expect(entry.newAmount).toBe(6500);

      const history = await getBudgetAuditHistory(db, 'rov', 'fy25-26');
      expect(history.length).toBe(1);
      expect(history[0].adjustedBy).toBe('treasurer@purdueieee.org');
      expect(history[0].reason).toBe('Fall Callout Equipment Grants Expansion');
    });
  });

  describe('Committee Lifecycle CRUD (Create, Update Name/Parameters, Delete)', () => {
    it('creates a new committee with initial budget, PIN hash, categories, and audit log', async () => {
      const result = await createCommittee(db, {
        id: 'assistive-tech',
        name: 'Assistive Tech & Bionics',
        allocatedAmount: 3500.0,
        contactEmail: 'assistive-tech@purdueieee.org',
        passcode: 'SecretPasscode123!',
        bankStatus: 'Active',
        duesStatus: 'Active',
        categories: ['Motors & Actuators', 'Sensors & MCU', 'Travel'],
        notes: 'Initial charter grant',
      });

      expect(result.success).toBe(true);
      expect(result.committee.id).toBe('assistive-tech');
      expect(result.committee.name).toBe('Assistive Tech & Bionics');
      expect(result.committee.allocated).toBe(3500.0);

      // Verify committee in database
      const row = db
        .prepare('SELECT id, name, bank_status, dues_status, contact_email FROM finance_committees WHERE id = ?')
        .get('assistive-tech') as any;
      expect(row).toBeDefined();
      expect(row.name).toBe('Assistive Tech & Bionics');
      expect(row.bank_status).toBe('Active');

      // Verify budget in database
      const budget = db
        .prepare('SELECT allocated_amount FROM committee_budgets WHERE committee_id = ?')
        .get('assistive-tech') as any;
      expect(budget).toBeDefined();
      expect(budget.allocated_amount).toBe(3500.0);

      // Verify categories
      const categories = db
        .prepare('SELECT name FROM budget_categories WHERE committee_id = ?')
        .all('assistive-tech') as any[];
      expect(categories.length).toBe(3);
      expect(categories.map((c) => c.name)).toContain('Motors & Actuators');

      // Verify in calculateCommitteeSpending
      const summary = await calculateCommitteeSpending(db, 'fy25-26');
      const found = summary.committees.find((c) => c.committeeId === 'assistive-tech');
      expect(found).toBeDefined();
      expect(found?.committeeName).toBe('Assistive Tech & Bionics');
      expect(found?.allocatedAmount).toBe(3500.0);
    });

    it('updates committee name, budget allocation, and parameters', async () => {
      const updateResult = await updateCommitteeParameters(db, 'fy25-26', 'rov', {
        name: 'Remotely Operated Vehicles (Marine & Sub)',
        allocatedAmount: 7000.0,
        bankStatus: 'Read-Only',
        duesStatus: 'Active',
        contactEmail: 'rov-leads@purdueieee.org',
        categories: ['New Hull', 'Telemetry'],
      });

      expect(updateResult.success).toBe(true);

      const comm = db
        .prepare('SELECT name, bank_status, contact_email FROM finance_committees WHERE id = ?')
        .get('rov') as any;
      expect(comm.name).toBe('Remotely Operated Vehicles (Marine & Sub)');
      expect(comm.bank_status).toBe('Read-Only');
      expect(comm.contactEmail || comm.contact_email).toBe('rov-leads@purdueieee.org');

      const budget = db
        .prepare('SELECT allocated_amount FROM committee_budgets WHERE committee_id = ? AND fiscal_year_id = ?')
        .get('rov', 'fy25-26') as any;
      expect(budget.allocated_amount).toBe(7000.0);

      const categories = db
        .prepare('SELECT name FROM budget_categories WHERE committee_id = ?')
        .all('rov') as any[];
      expect(categories.length).toBe(2);
      expect(categories.map((c) => c.name)).toEqual(['New Hull', 'Telemetry']);
    });

    it('deletes a committee and cleans up dependent budget, category, and purchase records', async () => {
      // First verify 'cs' committee exists
      const beforeRow = db
        .prepare('SELECT id FROM finance_committees WHERE id = ?')
        .get('cs');
      expect(beforeRow).toBeDefined();

      const deleteResult = await deleteCommittee(db, 'cs', 'fy25-26');
      expect(deleteResult.success).toBe(true);

      // Verify deletion from finance_committees
      const afterRow = db
        .prepare('SELECT id FROM finance_committees WHERE id = ?')
        .get('cs');
      expect(afterRow).toBeUndefined();

      // Verify deletion from committee_budgets
      const afterBudget = db
        .prepare('SELECT id FROM committee_budgets WHERE committee_id = ?')
        .get('cs');
      expect(afterBudget).toBeUndefined();

      // Verify deletion from budget_categories
      const afterCats = db
        .prepare('SELECT id FROM budget_categories WHERE committee_id = ?')
        .all('cs');
      expect(afterCats.length).toBe(0);
    });
  });
});

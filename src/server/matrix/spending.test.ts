import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  calculateCommitteeSpending,
  calculateCategoryBreakdown,
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
});

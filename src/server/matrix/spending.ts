/**
 * BoilerBooks 3.0 Treasurer Master Spending Matrix
 * Calculates real-time aggregate spending vs budget allocations across committees and categories.
 */

import { queryAll, queryFirst, roundCurrency, type D1DatabaseLike } from '../db/query';
import type { CommitteeId } from '../db/types';

export interface CommitteeSpendingRow {
  committeeId: CommitteeId;
  committeeName: string;
  allocatedAmount: number;
  spentAmount: number; // approved + reimbursed
  approvedAmount: number;
  pendingAmount: number;
  reimbursedAmount: number;
  rejectedAmount: number;
  remainingAmount: number;
  spentPercentage: number;
  totalRequests: number;
}

export interface BranchSpendingSummary {
  fiscalYearId: string;
  totalAllocated: number;
  totalSpent: number;
  totalApproved: number;
  totalPending: number;
  totalReimbursed: number;
  totalRejected: number;
  totalRemaining: number;
  spentPercentage: number;
  totalRequests: number;
  committees: CommitteeSpendingRow[];
}

export interface CategorySpendingRow {
  categoryId: string | null;
  categoryName: string;
  allocatedAmount?: number;
  spentAmount: number; // approved + reimbursed
  approvedAmount: number;
  pendingAmount: number;
  reimbursedAmount: number;
  rejectedAmount: number;
  totalAmount: number;
  requestCount: number;
  percentageOfCommitteeSpent: number;
  percentageOfCommitteeBudget: number;
}

export interface CommitteeCategoryBreakdown {
  fiscalYearId: string;
  committeeId: string;
  committeeName: string;
  allocatedAmount: number;
  totalSpent: number;
  totalApproved: number;
  totalPending: number;
  totalReimbursed: number;
  totalRejected: number;
  remainingAmount: number;
  spentPercentage: number;
  categories: CategorySpendingRow[];
}

interface RawSpendingRow {
  committee_id: string;
  committee_name: string;
  allocated_amount: number | null;
  approved_amount: number | null;
  pending_amount: number | null;
  reimbursed_amount: number | null;
  rejected_amount: number | null;
  total_requests: number | null;
}

interface RawCategoryRow {
  id: string;
  name: string;
}

interface RawPurchaseRequestItem {
  id: string;
  category_id: string | null;
  total_amount: number;
  status: string;
}

interface RawCommitteeBudget {
  allocated_amount: number;
}

interface RawFinanceCommittee {
  id: string;
  name: string;
}

/**
 * Aggregates total allocated budget, approved spending, pending requests,
 * reimbursed amounts, and remaining balance per committee and branch-wide for a fiscal year.
 */
export async function calculateCommitteeSpending(
  db: D1DatabaseLike,
  fiscalYearId: string
): Promise<BranchSpendingSummary> {
  const sql = `
    SELECT 
      fc.id AS committee_id,
      fc.name AS committee_name,
      COALESCE(cb.allocated_amount, 0.0) AS allocated_amount,
      COALESCE(SUM(CASE WHEN pr.status = 'APPROVED' THEN pr.total_amount ELSE 0 END), 0.0) AS approved_amount,
      COALESCE(SUM(CASE WHEN pr.status = 'PENDING' THEN pr.total_amount ELSE 0 END), 0.0) AS pending_amount,
      COALESCE(SUM(CASE WHEN pr.status = 'REIMBURSED' THEN pr.total_amount ELSE 0 END), 0.0) AS reimbursed_amount,
      COALESCE(SUM(CASE WHEN pr.status = 'REJECTED' THEN pr.total_amount ELSE 0 END), 0.0) AS rejected_amount,
      COUNT(pr.id) AS total_requests
    FROM finance_committees fc
    LEFT JOIN committee_budgets cb 
      ON fc.id = cb.committee_id AND cb.fiscal_year_id = ?
    LEFT JOIN purchase_requests pr 
      ON fc.id = pr.committee_id AND pr.fiscal_year_id = ?
    GROUP BY fc.id, fc.name, cb.allocated_amount
    ORDER BY fc.name ASC;
  `;

  const rows = await queryAll<RawSpendingRow>(db, sql, [fiscalYearId, fiscalYearId]);

  let totalAllocated = 0;
  let totalApproved = 0;
  let totalPending = 0;
  let totalReimbursed = 0;
  let totalRejected = 0;
  let totalRequests = 0;

  const committees: CommitteeSpendingRow[] = rows.map((row) => {
    const allocated = roundCurrency(Number(row.allocated_amount) || 0);
    const approved = roundCurrency(Number(row.approved_amount) || 0);
    const pending = roundCurrency(Number(row.pending_amount) || 0);
    const reimbursed = roundCurrency(Number(row.reimbursed_amount) || 0);
    const rejected = roundCurrency(Number(row.rejected_amount) || 0);
    const spent = roundCurrency(approved + reimbursed);
    const remaining = roundCurrency(allocated - spent);
    const reqCount = Number(row.total_requests) || 0;

    const spentPercentage =
      allocated > 0 ? roundCurrency((spent / allocated) * 100) : 0;

    totalAllocated = roundCurrency(totalAllocated + allocated);
    totalApproved = roundCurrency(totalApproved + approved);
    totalPending = roundCurrency(totalPending + pending);
    totalReimbursed = roundCurrency(totalReimbursed + reimbursed);
    totalRejected = roundCurrency(totalRejected + rejected);
    totalRequests += reqCount;

    return {
      committeeId: row.committee_id as CommitteeId,
      committeeName: row.committee_name,
      allocatedAmount: allocated,
      spentAmount: spent,
      approvedAmount: approved,
      pendingAmount: pending,
      reimbursedAmount: reimbursed,
      rejectedAmount: rejected,
      remainingAmount: remaining,
      spentPercentage,
      totalRequests: reqCount,
    };
  });

  const totalSpent = roundCurrency(totalApproved + totalReimbursed);
  const totalRemaining = roundCurrency(totalAllocated - totalSpent);
  const branchSpentPercentage =
    totalAllocated > 0 ? roundCurrency((totalSpent / totalAllocated) * 100) : 0;

  return {
    fiscalYearId,
    totalAllocated,
    totalSpent,
    totalApproved,
    totalPending,
    totalReimbursed,
    totalRejected,
    totalRemaining,
    spentPercentage: branchSpentPercentage,
    totalRequests,
    committees,
  };
}

/**
 * Aggregates spending across subcategories (Hardware, Travel, General, etc.)
 * for a specific committee and fiscal year.
 */
export async function calculateCategoryBreakdown(
  db: D1DatabaseLike,
  fiscalYearId: string,
  committeeId: string
): Promise<CommitteeCategoryBreakdown> {
  // 1. Fetch Committee info
  const committee = await queryFirst<RawFinanceCommittee>(
    db,
    'SELECT id, name FROM finance_committees WHERE id = ?;',
    [committeeId]
  );

  const committeeName = committee ? committee.name : committeeId;

  // 2. Fetch Budget Allocation
  const budget = await queryFirst<RawCommitteeBudget>(
    db,
    'SELECT allocated_amount FROM committee_budgets WHERE fiscal_year_id = ? AND committee_id = ?;',
    [fiscalYearId, committeeId]
  );

  const allocatedAmount = budget ? roundCurrency(Number(budget.allocated_amount) || 0) : 0;

  // 3. Fetch Configured Categories
  const categories = await queryAll<RawCategoryRow>(
    db,
    'SELECT id, name FROM budget_categories WHERE committee_id = ? ORDER BY name ASC;',
    [committeeId]
  );

  // 4. Fetch Purchase Requests for Committee & FY
  const requests = await queryAll<RawPurchaseRequestItem>(
    db,
    'SELECT id, category_id, total_amount, status FROM purchase_requests WHERE fiscal_year_id = ? AND committee_id = ?;',
    [fiscalYearId, committeeId]
  );

  // 5. Aggregate by Category
  const categoryMap = new Map<
    string | null,
    {
      name: string;
      approved: number;
      pending: number;
      reimbursed: number;
      rejected: number;
      count: number;
    }
  >();

  // Initialize configured categories
  for (const cat of categories) {
    categoryMap.set(cat.id, {
      name: cat.name,
      approved: 0,
      pending: 0,
      reimbursed: 0,
      rejected: 0,
      count: 0,
    });
  }

  // Accumulate request amounts
  for (const req of requests) {
    const total = Number(req.total_amount) || 0;
    const catId = req.category_id && categoryMap.has(req.category_id) ? req.category_id : null;

    if (catId === null) {
      if (!categoryMap.has(null)) {
        categoryMap.set(null, {
          name: 'Uncategorized',
          approved: 0,
          pending: 0,
          reimbursed: 0,
          rejected: 0,
          count: 0,
        });
      }
    }

    const catData = categoryMap.get(catId)!;
    catData.count += 1;

    switch (req.status) {
      case 'APPROVED':
        catData.approved = roundCurrency(catData.approved + total);
        break;
      case 'PENDING':
        catData.pending = roundCurrency(catData.pending + total);
        break;
      case 'REIMBURSED':
        catData.reimbursed = roundCurrency(catData.reimbursed + total);
        break;
      case 'REJECTED':
        catData.rejected = roundCurrency(catData.rejected + total);
        break;
    }
  }

  // Calculate totals
  let totalApproved = 0;
  let totalPending = 0;
  let totalReimbursed = 0;
  let totalRejected = 0;

  const categoryRows: CategorySpendingRow[] = [];

  for (const [catId, data] of categoryMap.entries()) {
    const spent = roundCurrency(data.approved + data.reimbursed);
    const total = roundCurrency(spent + data.pending);

    totalApproved = roundCurrency(totalApproved + data.approved);
    totalPending = roundCurrency(totalPending + data.pending);
    totalReimbursed = roundCurrency(totalReimbursed + data.reimbursed);
    totalRejected = roundCurrency(totalRejected + data.rejected);

    categoryRows.push({
      categoryId: catId,
      categoryName: data.name,
      spentAmount: spent,
      approvedAmount: data.approved,
      pendingAmount: data.pending,
      reimbursedAmount: data.reimbursed,
      rejectedAmount: data.rejected,
      totalAmount: total,
      requestCount: data.count,
      percentageOfCommitteeSpent: 0, // calculated below once totalSpent is known
      percentageOfCommitteeBudget:
        allocatedAmount > 0 ? roundCurrency((spent / allocatedAmount) * 100) : 0,
    });
  }

  const totalSpent = roundCurrency(totalApproved + totalReimbursed);
  const remainingAmount = roundCurrency(allocatedAmount - totalSpent);
  const spentPercentage =
    allocatedAmount > 0 ? roundCurrency((totalSpent / allocatedAmount) * 100) : 0;

  // Enrich with percentageOfCommitteeSpent
  for (const row of categoryRows) {
    row.percentageOfCommitteeSpent =
      totalSpent > 0 ? roundCurrency((row.spentAmount / totalSpent) * 100) : 0;
  }

  return {
    fiscalYearId,
    committeeId,
    committeeName,
    allocatedAmount,
    totalSpent,
    totalApproved,
    totalPending,
    totalReimbursed,
    totalRejected,
    remainingAmount,
    spentPercentage,
    categories: categoryRows,
  };
}

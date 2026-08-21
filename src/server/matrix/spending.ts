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

export interface UpdateCommitteeParametersPayload {
  allocatedAmount?: number;
  notes?: string | null;
  bankStatus?: 'Active' | 'Inactive' | 'Read-Only';
  duesStatus?: 'Active' | 'Inactive';
  contactEmail?: string | null;
  categories?: string[];
}

/**
 * Updates committee budget allocation and organizational settings (bank status, dues status, contact email, categories).
 * Restricted to Branch Treasurer role.
 */
export async function updateCommitteeParameters(
  db: D1DatabaseLike,
  fiscalYearId: string,
  committeeId: string,
  payload: UpdateCommitteeParametersPayload
): Promise<{ success: boolean; message: string }> {
  // 1. Update budget allocation if specified
  if (payload.allocatedAmount !== undefined) {
    const existingBudget = await queryFirst<{ id: string }>(
      db,
      'SELECT id FROM committee_budgets WHERE fiscal_year_id = ? AND committee_id = ?',
      [fiscalYearId, committeeId]
    );

    if (existingBudget) {
      await db
        .prepare('UPDATE committee_budgets SET allocated_amount = ?, notes = ? WHERE id = ?')
        .bind(payload.allocatedAmount, payload.notes || null, existingBudget.id)
        .run();
    } else {
      const budgetId = `cb-${committeeId}-${fiscalYearId}`;
      await db
        .prepare(
          'INSERT INTO committee_budgets (id, fiscal_year_id, committee_id, allocated_amount, notes) VALUES (?, ?, ?, ?, ?)'
        )
        .bind(budgetId, fiscalYearId, committeeId, payload.allocatedAmount, payload.notes || null)
        .run();
    }
  }

  // 2. Update committee operational parameters
  if (
    payload.bankStatus !== undefined ||
    payload.duesStatus !== undefined ||
    payload.contactEmail !== undefined
  ) {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (payload.bankStatus !== undefined) {
      updates.push('bank_status = ?');
      params.push(payload.bankStatus);
    }
    if (payload.duesStatus !== undefined) {
      updates.push('dues_status = ?');
      params.push(payload.duesStatus);
    }
    if (payload.contactEmail !== undefined) {
      updates.push('contact_email = ?');
      params.push(payload.contactEmail);
    }

    if (updates.length > 0) {
      params.push(committeeId);
      await db
        .prepare(`UPDATE finance_committees SET ${updates.join(', ')} WHERE id = ?`)
        .bind(...params)
        .run();
    }
  }

  // 3. Update Categories if provided
  if (payload.categories && Array.isArray(payload.categories)) {
    // Delete existing categories for committee
    await db
      .prepare('DELETE FROM budget_categories WHERE committee_id = ?')
      .bind(committeeId)
      .run();

    // Insert new category set
    for (const cat of payload.categories) {
      if (cat.trim().length > 0) {
        const catId = `cat-${committeeId}-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        await db
          .prepare('INSERT INTO budget_categories (id, committee_id, name) VALUES (?, ?, ?)')
          .bind(catId, committeeId, cat.trim())
          .run();
      }
    }
  }

  return {
    success: true,
    message: `Updated parameters for committee "${committeeId}" successfully.`,
  };
}

export interface CreateFundingInflowPayload {
  fiscalYearId: string;
  committeeId: string;
  sourceType: string;
  title: string;
  amount: number;
  referenceNumber?: string;
  receivedDate?: string;
  notes?: string;
}

/**
 * Records specific funding inflow received by a committee (SFAB grant, corporate sponsor, departmental award).
 */
export async function recordCommitteeFundingInflow(
  db: D1DatabaseLike,
  payload: CreateFundingInflowPayload
): Promise<{ success: boolean; id: string; message: string }> {
  if (!payload.committeeId || !payload.title || typeof payload.amount !== 'number' || payload.amount <= 0) {
    throw new Error('Invalid funding inflow payload: committeeId, title, and positive amount are required.');
  }

  const inflowId = `inflow-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const receivedDate = payload.receivedDate || new Date().toISOString().split('T')[0];

  await db
    .prepare(
      `INSERT INTO committee_funding_inflows (
        id, fiscal_year_id, committee_id, source_type, title, amount, reference_number, received_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      inflowId,
      payload.fiscalYearId,
      payload.committeeId,
      payload.sourceType || 'Other',
      payload.title.trim(),
      roundCurrency(payload.amount),
      payload.referenceNumber?.trim() || null,
      receivedDate,
      payload.notes?.trim() || null
    )
    .run();

  return {
    success: true,
    id: inflowId,
    message: `Successfully recorded $${payload.amount.toFixed(2)} funding for ${payload.committeeId}.`,
  };
}


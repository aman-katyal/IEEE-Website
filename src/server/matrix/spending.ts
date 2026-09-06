/**
 * BoilerBooks 3.0 Treasurer Master Spending Matrix
 * Calculates real-time aggregate spending vs budget allocations across committees and categories.
 */

import { queryAll, queryFirst, roundCurrency, type D1DatabaseLike } from '../db/query';
import { toD1Database } from '../db/adapter';
import { recordAuditEntry } from '../db/audit';
import type { CommitteeId } from '../db/types';
import { hashPin } from '../auth/crypto';

export interface AccountSpendingBreakdown {
  baseAllocated: number;
  inflows: number;
  totalBudget: number;
  spent: number;
  pending: number;
  remaining: number;
  spentPercentage: number;
}

export interface CommitteeSpendingRow {
  committeeId: CommitteeId;
  committeeName: string;
  allocatedAmount: number; // total budget (generalTotal + sfabTotal)
  baseAllocatedAmount?: number; // base general allocation
  generalAllocatedAmount?: number; // base general allocation
  sfabAllocatedAmount?: number; // base SFAB allocation
  totalInflows?: number;
  generalInflows?: number;
  sfabInflows?: number;
  spentAmount: number; // approved + reimbursed
  approvedAmount: number;
  pendingAmount: number;
  reimbursedAmount: number;
  rejectedAmount: number;
  remainingAmount: number;
  spentPercentage: number;
  totalRequests: number;
  general?: AccountSpendingBreakdown;
  sfab?: AccountSpendingBreakdown;
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
  totalGeneralAllocated?: number;
  totalSfabAllocated?: number;
  totalGeneralSpent?: number;
  totalSfabSpent?: number;
  totalGeneralRemaining?: number;
  totalSfabRemaining?: number;
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
  sfab_amount: number | null;
  total_inflows: number | null;
  general_inflows: number | null;
  sfab_inflows: number | null;
  approved_amount: number | null;
  pending_amount: number | null;
  reimbursed_amount: number | null;
  rejected_amount: number | null;
  spent_general: number | null;
  spent_sfab: number | null;
  pending_general: number | null;
  pending_sfab: number | null;
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
 * Separate General vs SFAB grant budgets are calculated along with aggregate totals.
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
      COALESCE(cb.sfab_amount, 0.0) AS sfab_amount,
      COALESCE(inf.total_inflows, 0.0) AS total_inflows,
      COALESCE(inf.general_inflows, 0.0) AS general_inflows,
      COALESCE(inf.sfab_inflows, 0.0) AS sfab_inflows,
      COALESCE(SUM(CASE WHEN pr.status = 'APPROVED' THEN pr.total_amount ELSE 0 END), 0.0) AS approved_amount,
      COALESCE(SUM(CASE WHEN pr.status = 'PENDING' THEN pr.total_amount ELSE 0 END), 0.0) AS pending_amount,
      COALESCE(SUM(CASE WHEN pr.status = 'REIMBURSED' THEN pr.total_amount ELSE 0 END), 0.0) AS reimbursed_amount,
      COALESCE(SUM(CASE WHEN pr.status = 'REJECTED' THEN pr.total_amount ELSE 0 END), 0.0) AS rejected_amount,
      COALESCE(SUM(CASE WHEN pr.status IN ('APPROVED', 'REIMBURSED') AND (pr.funding_source IS NULL OR pr.funding_source != 'SFAB') THEN pr.total_amount ELSE 0 END), 0.0) AS spent_general,
      COALESCE(SUM(CASE WHEN pr.status IN ('APPROVED', 'REIMBURSED') AND pr.funding_source = 'SFAB' THEN pr.total_amount ELSE 0 END), 0.0) AS spent_sfab,
      COALESCE(SUM(CASE WHEN pr.status = 'PENDING' AND (pr.funding_source IS NULL OR pr.funding_source != 'SFAB') THEN pr.total_amount ELSE 0 END), 0.0) AS pending_general,
      COALESCE(SUM(CASE WHEN pr.status = 'PENDING' AND pr.funding_source = 'SFAB' THEN pr.total_amount ELSE 0 END), 0.0) AS pending_sfab,
      COUNT(pr.id) AS total_requests
    FROM finance_committees fc
    LEFT JOIN committee_budgets cb 
      ON fc.id = cb.committee_id AND cb.fiscal_year_id = ?
    LEFT JOIN (
      SELECT 
        committee_id, 
        SUM(amount) AS total_inflows,
        SUM(CASE WHEN source_type != 'SFAB Grant' THEN amount ELSE 0 END) AS general_inflows,
        SUM(CASE WHEN source_type = 'SFAB Grant' THEN amount ELSE 0 END) AS sfab_inflows
      FROM committee_funding_inflows 
      WHERE fiscal_year_id = ? 
      GROUP BY committee_id
    ) inf ON fc.id = inf.committee_id
    LEFT JOIN purchase_requests pr 
      ON fc.id = pr.committee_id AND pr.fiscal_year_id = ?
    GROUP BY fc.id, fc.name, cb.allocated_amount, cb.sfab_amount, inf.total_inflows, inf.general_inflows, inf.sfab_inflows
    ORDER BY fc.name ASC;
  `;

  const rows = await queryAll<RawSpendingRow>(db, sql, [fiscalYearId, fiscalYearId, fiscalYearId]);

  let totalAllocated = 0;
  let totalApproved = 0;
  let totalPending = 0;
  let totalReimbursed = 0;
  let totalRejected = 0;
  let totalRequests = 0;

  let totalGeneralAllocated = 0;
  let totalSfabAllocated = 0;
  let totalGeneralSpent = 0;
  let totalSfabSpent = 0;

  const committees: CommitteeSpendingRow[] = rows.map((row) => {
    const baseAllocated = roundCurrency(Number(row.allocated_amount) || 0);
    const sfabAllocated = roundCurrency(Number(row.sfab_amount) || 0);
    const generalInflows = roundCurrency(Number(row.general_inflows) || 0);
    const sfabInflows = roundCurrency(Number(row.sfab_inflows) || 0);
    const totalInflows = roundCurrency(Number(row.total_inflows) || (generalInflows + sfabInflows));

    const generalBudget = roundCurrency(baseAllocated + generalInflows);
    const sfabBudget = roundCurrency(sfabAllocated + sfabInflows);
    const totalBudget = roundCurrency(generalBudget + sfabBudget);

    const approved = roundCurrency(Number(row.approved_amount) || 0);
    const pending = roundCurrency(Number(row.pending_amount) || 0);
    const reimbursed = roundCurrency(Number(row.reimbursed_amount) || 0);
    const rejected = roundCurrency(Number(row.rejected_amount) || 0);
    const spent = roundCurrency(approved + reimbursed);
    const remaining = roundCurrency(totalBudget - spent);
    const reqCount = Number(row.total_requests) || 0;

    const spentGeneral = roundCurrency(Number(row.spent_general) || 0);
    const spentSfab = roundCurrency(Number(row.spent_sfab) || 0);
    const pendingGeneral = roundCurrency(Number(row.pending_general) || 0);
    const pendingSfab = roundCurrency(Number(row.pending_sfab) || 0);
    const remainingGeneral = roundCurrency(generalBudget - spentGeneral);
    const remainingSfab = roundCurrency(sfabBudget - spentSfab);

    const generalSpentPercentage =
      generalBudget > 0 ? roundCurrency((spentGeneral / generalBudget) * 100) : 0;
    const sfabSpentPercentage =
      sfabBudget > 0 ? roundCurrency((spentSfab / sfabBudget) * 100) : 0;
    const spentPercentage =
      totalBudget > 0 ? roundCurrency((spent / totalBudget) * 100) : 0;

    totalAllocated = roundCurrency(totalAllocated + totalBudget);
    totalApproved = roundCurrency(totalApproved + approved);
    totalPending = roundCurrency(totalPending + pending);
    totalReimbursed = roundCurrency(totalReimbursed + reimbursed);
    totalRejected = roundCurrency(totalRejected + rejected);
    totalRequests += reqCount;

    totalGeneralAllocated = roundCurrency(totalGeneralAllocated + generalBudget);
    totalSfabAllocated = roundCurrency(totalSfabAllocated + sfabBudget);
    totalGeneralSpent = roundCurrency(totalGeneralSpent + spentGeneral);
    totalSfabSpent = roundCurrency(totalSfabSpent + spentSfab);

    return {
      committeeId: row.committee_id as CommitteeId,
      committeeName: row.committee_name,
      allocatedAmount: totalBudget,
      baseAllocatedAmount: baseAllocated,
      generalAllocatedAmount: baseAllocated,
      sfabAllocatedAmount: sfabAllocated,
      totalInflows,
      generalInflows,
      sfabInflows,
      spentAmount: spent,
      approvedAmount: approved,
      pendingAmount: pending,
      reimbursedAmount: reimbursed,
      rejectedAmount: rejected,
      remainingAmount: remaining,
      spentPercentage,
      totalRequests: reqCount,
      general: {
        baseAllocated,
        inflows: generalInflows,
        totalBudget: generalBudget,
        spent: spentGeneral,
        pending: pendingGeneral,
        remaining: remainingGeneral,
        spentPercentage: generalSpentPercentage,
      },
      sfab: {
        baseAllocated: sfabAllocated,
        inflows: sfabInflows,
        totalBudget: sfabBudget,
        spent: spentSfab,
        pending: pendingSfab,
        remaining: remainingSfab,
        spentPercentage: sfabSpentPercentage,
      },
    };
  });

  const totalSpent = roundCurrency(totalApproved + totalReimbursed);
  const totalRemaining = roundCurrency(totalAllocated - totalSpent);
  const branchSpentPercentage =
    totalAllocated > 0 ? roundCurrency((totalSpent / totalAllocated) * 100) : 0;
  const totalGeneralRemaining = roundCurrency(totalGeneralAllocated - totalGeneralSpent);
  const totalSfabRemaining = roundCurrency(totalSfabAllocated - totalSfabSpent);

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
    totalGeneralAllocated,
    totalSfabAllocated,
    totalGeneralSpent,
    totalSfabSpent,
    totalGeneralRemaining,
    totalSfabRemaining,
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

    // ⚡ Bolt: Optimize Map lookups by avoiding .has() followed by .get()
    let catData = req.category_id ? categoryMap.get(req.category_id) : undefined;

    if (!catData) {
      catData = categoryMap.get(null);
      if (!catData) {
        catData = {
          name: 'Uncategorized',
          approved: 0,
          pending: 0,
          reimbursed: 0,
          rejected: 0,
          count: 0,
        };
        categoryMap.set(null, catData);
      }
    }

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
  name?: string;
  allocatedAmount?: number;
  sfabAmount?: number;
  notes?: string | null;
  bankStatus?: 'Active' | 'Inactive' | 'Read-Only';
  duesStatus?: 'Active' | 'Inactive';
  contactEmail?: string | null;
  categories?: string[];
}

/**
 * Updates committee budget allocation and organizational settings (name, bank status, dues status, contact email, categories).
 * Restricted to Branch Treasurer role.
 */
export async function updateCommitteeParameters(
  db: D1DatabaseLike,
  fiscalYearId: string,
  committeeId: string,
  payload: UpdateCommitteeParametersPayload
): Promise<{ success: boolean; message: string }> {
  const d1 = toD1Database(db);

  // 1. Update budget allocation (General and/or SFAB) if specified
  if (payload.allocatedAmount !== undefined || payload.sfabAmount !== undefined) {
    const existingBudget = await queryFirst<{ id: string; allocated_amount: number; sfab_amount: number }>(
      db,
      'SELECT id, allocated_amount, sfab_amount FROM committee_budgets WHERE fiscal_year_id = ? AND committee_id = ?',
      [fiscalYearId, committeeId]
    );
    const prevAllocated = existingBudget?.allocated_amount ?? 0;
    const prevSfab = existingBudget?.sfab_amount ?? 0;
    const newAllocated = payload.allocatedAmount !== undefined ? payload.allocatedAmount : prevAllocated;
    const newSfab = payload.sfabAmount !== undefined ? payload.sfabAmount : prevSfab;
    const generalDelta = newAllocated - prevAllocated;
    const sfabDelta = newSfab - prevSfab;

    if (existingBudget) {
      await d1
        .prepare('UPDATE committee_budgets SET allocated_amount = ?, sfab_amount = ?, notes = COALESCE(?, notes) WHERE id = ?')
        .bind(newAllocated, newSfab, payload.notes || null, existingBudget.id)
        .run();
    } else {
      const budgetId = `cb-${committeeId}-${fiscalYearId}`;
      await d1
        .prepare(
          'INSERT INTO committee_budgets (id, fiscal_year_id, committee_id, allocated_amount, sfab_amount, notes) VALUES (?, ?, ?, ?, ?, ?)'
        )
        .bind(budgetId, fiscalYearId, committeeId, newAllocated, newSfab, payload.notes || null)
        .run();
    }

    if (generalDelta !== 0) {
      await recordBudgetAdjustmentAudit(db, {
        committeeId,
        fiscalYearId,
        adjustedBy: 'Executive Treasurer',
        previousAmount: prevAllocated,
        newAmount: newAllocated,
        reason: payload.notes || undefined,
      });

      const deltaFormatted = generalDelta >= 0
        ? `+$${generalDelta.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : `-$${Math.abs(generalDelta).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

      await recordAuditEntry(db, {
        fiscalYearId,
        committeeId,
        actionType: 'BUDGET_ALLOCATION',
        actorRole: 'TREASURER',
        actorName: 'Executive Treasurer',
        actorEmail: 'treasurer@purdueieee.org',
        description: `Base allocated budget adjusted from $${prevAllocated.toLocaleString('en-US', { minimumFractionDigits: 2 })} to $${newAllocated.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${deltaFormatted})`,
        previousValue: String(prevAllocated),
        newValue: String(newAllocated),
        amountDelta: generalDelta,
      });
    }

    if (sfabDelta !== 0) {
      const deltaFormatted = sfabDelta >= 0
        ? `+$${sfabDelta.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : `-$${Math.abs(sfabDelta).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

      await recordAuditEntry(db, {
        fiscalYearId,
        committeeId,
        actionType: 'BUDGET_ALLOCATION',
        actorRole: 'TREASURER',
        actorName: 'Executive Treasurer',
        actorEmail: 'treasurer@purdueieee.org',
        description: `SFAB allocated budget adjusted from $${prevSfab.toLocaleString('en-US', { minimumFractionDigits: 2 })} to $${newSfab.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${deltaFormatted})`,
        previousValue: String(prevSfab),
        newValue: String(newSfab),
        amountDelta: sfabDelta,
      });
    }
  }

  // 2. Update committee operational parameters (name, bank status, dues status, contact email)
  if (
    payload.name !== undefined ||
    payload.bankStatus !== undefined ||
    payload.duesStatus !== undefined ||
    payload.contactEmail !== undefined
  ) {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (payload.name !== undefined && payload.name.trim().length > 0) {
      const currentComm = await queryFirst<{ name: string }>(
        db,
        'SELECT name FROM finance_committees WHERE id = ?',
        [committeeId]
      );
      const newName = payload.name.trim();
      if (currentComm && currentComm.name !== newName) {
        updates.push('name = ?');
        params.push(newName);

        await recordAuditEntry(db, {
          fiscalYearId,
          committeeId,
          actionType: 'BUDGET_ALLOCATION',
          actorRole: 'TREASURER',
          actorName: 'Executive Treasurer',
          actorEmail: 'treasurer@purdueieee.org',
          description: `Committee name updated from "${currentComm.name}" to "${newName}"`,
          previousValue: currentComm.name,
          newValue: newName,
        });
      }
    }

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
      await d1
        .prepare(`UPDATE finance_committees SET ${updates.join(', ')} WHERE id = ?`)
        .bind(...params)
        .run();
    }
  }

  // 3. Update Categories if provided
  if (payload.categories && Array.isArray(payload.categories)) {
    // Delete existing categories for committee
    await d1
      .prepare('DELETE FROM budget_categories WHERE committee_id = ?')
      .bind(committeeId)
      .run();

    // Insert new category set
    const stmts: any[] = [];
    for (const cat of payload.categories) {
      if (cat.trim().length > 0) {
        const catId = `cat-${committeeId}-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        stmts.push(
          d1
            .prepare('INSERT INTO budget_categories (id, committee_id, name) VALUES (?, ?, ?)')
            .bind(catId, committeeId, cat.trim())
        );
      }
    }

    if (stmts.length > 0) {
      if (typeof (d1 as any).batch === 'function') {
        await (d1 as any).batch(stmts);
      } else {
        for (const stmt of stmts) {
          await stmt.run();
        }
      }
    }
  }

  return {
    success: true,
    message: `Updated parameters for committee "${committeeId}" successfully.`,
  };
}

export interface CreateCommitteePayload {
  id?: string;
  name: string;
  allocatedAmount?: number;
  sfabAmount?: number;
  notes?: string | null;
  bankStatus?: 'Active' | 'Inactive' | 'Read-Only';
  duesStatus?: 'Active' | 'Inactive';
  contactEmail?: string | null;
  categories?: string[];
  passcode?: string;
  fiscalYearId?: string;
}

/**
 * Generates a standardized, secure committee access PIN passcode.
 * Follows the BoilerBooks format: <PREFIX>-<6 uppercase alphanumerics><1 special char><3 digits>-<3 uppercase alphanumerics>
 * e.g., EDS-CPDFFC#160-MSX or ROV-6T5DB6&835-HNT.
 */
export function generateCommitteePasscode(committeeIdOrName: string): string {
  const prefix = (committeeIdOrName || 'COMM')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .padEnd(4, 'X')
    .substring(0, 4);

  const specialChars = ['!', '@', '#', '%', '&', '*'];
  const special = specialChars[Math.floor(Math.random() * specialChars.length)];

  // Character set excluding easily confused characters (O, 0, I, 1)
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let part1 = '';
  for (let i = 0; i < 6; i++) {
    part1 += charset[Math.floor(Math.random() * charset.length)];
  }

  const numPart = Math.floor(100 + Math.random() * 900); // 3 digits

  let part2 = '';
  for (let i = 0; i < 3; i++) {
    part2 += charset[Math.floor(Math.random() * charset.length)];
  }

  return `${prefix}-${part1}${special}${numPart}-${part2}`;
}

/**
 * Creates a new committee with initial budget allocation, categories, and credentials.
 * Automatically generates a standardized BoilerBooks secure passcode.
 * Restricted to Branch Treasurer role.
 */
export async function createCommittee(
  db: D1DatabaseLike,
  payload: CreateCommitteePayload
): Promise<{
  success: boolean;
  passcode: string;
  committee: {
    id: string;
    name: string;
    allocated: number;
    sfabAllocated: number;
    bankStatus: 'Active' | 'Inactive' | 'Read-Only';
    duesStatus: 'Active' | 'Inactive';
    contactEmail: string;
    categories: string[];
    notes: string;
  };
  message: string;
}> {
  if (!payload.name || payload.name.trim().length === 0) {
    throw new Error('Committee name is required.');
  }

  const d1 = toD1Database(db);
  const name = payload.name.trim();
  const rawId = (payload.id && payload.id.trim()) || name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const committeeId = rawId || `comm-${Date.now()}`;
  const fiscalYearId = payload.fiscalYearId || 'fy25-26';
  const allocatedAmount = roundCurrency(Number(payload.allocatedAmount) || 0);
  const sfabAmount = roundCurrency(Number(payload.sfabAmount) || 0);
  const bankStatus = payload.bankStatus || 'Active';
  const duesStatus = payload.duesStatus || 'Active';
  const contactEmail = payload.contactEmail?.trim() || `${committeeId}@purdueieee.org`;

  // Always auto-generate standard BoilerBooks passcode for committee lead
  const passcode = generateCommitteePasscode(committeeId);
  const passcodeHash = await hashPin(passcode);
  const categories = payload.categories && payload.categories.length > 0 ? payload.categories : ['General', 'Hardware'];
  const notes = payload.notes?.trim() || '';

  // Check if committee ID already exists
  const existing = await queryFirst<{ id: string }>(db, 'SELECT id FROM finance_committees WHERE id = ?', [committeeId]);
  if (existing) {
    throw new Error(`Committee with ID "${committeeId}" already exists.`);
  }

  // 1. Insert into finance_committees
  await d1
    .prepare(
      `INSERT INTO finance_committees (id, name, passcode_hash, is_admin, bank_status, dues_status, contact_email)
       VALUES (?, ?, ?, 0, ?, ?, ?)`
    )
    .bind(committeeId, name, passcodeHash, bankStatus, duesStatus, contactEmail)
    .run();

  // 2. Insert budget
  const budgetId = `cb-${committeeId}-${fiscalYearId}`;
  await d1
    .prepare(
      `INSERT INTO committee_budgets (id, fiscal_year_id, committee_id, allocated_amount, sfab_amount, notes)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(budgetId, fiscalYearId, committeeId, allocatedAmount, sfabAmount, notes || null)
    .run();

  // 3. Insert categories
  const catStmts: any[] = [];
  for (const cat of categories) {
    if (cat.trim().length > 0) {
      const catId = `cat-${committeeId}-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      catStmts.push(
        d1
          .prepare('INSERT INTO budget_categories (id, committee_id, name) VALUES (?, ?, ?)')
          .bind(catId, committeeId, cat.trim())
      );
    }
  }

  if (catStmts.length > 0) {
    if (typeof (d1 as any).batch === 'function') {
      await (d1 as any).batch(catStmts);
    } else {
      for (const stmt of catStmts) {
        await stmt.run();
      }
    }
  }

  // 4. Audit Log
  if (allocatedAmount > 0) {
    await recordAuditEntry(db, {
      fiscalYearId,
      committeeId,
      actionType: 'BUDGET_ALLOCATION',
      actorRole: 'TREASURER',
      actorName: 'Executive Treasurer',
      actorEmail: 'treasurer@purdueieee.org',
      description: `Created new technical committee "${name}" (${committeeId}) with initial general budget of $${allocatedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      previousValue: null,
      newValue: String(allocatedAmount),
      amountDelta: allocatedAmount,
    });
  }

  if (sfabAmount > 0) {
    await recordAuditEntry(db, {
      fiscalYearId,
      committeeId,
      actionType: 'BUDGET_ALLOCATION',
      actorRole: 'TREASURER',
      actorName: 'Executive Treasurer',
      actorEmail: 'treasurer@purdueieee.org',
      description: `Allocated initial SFAB grant budget of $${sfabAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} to "${name}" (${committeeId})`,
      previousValue: null,
      newValue: String(sfabAmount),
      amountDelta: sfabAmount,
    });
  }

  return {
    success: true,
    passcode,
    committee: {
      id: committeeId,
      name,
      allocated: allocatedAmount,
      sfabAllocated: sfabAmount,
      bankStatus,
      duesStatus,
      contactEmail,
      categories,
      notes,
    },
    message: `Created committee "${name}" successfully. Generated lead passcode: ${passcode}`,
  };
}

/**
 * Deletes a committee and cleans up its associated budgets, categories, and data.
 * Restricted to Branch Treasurer role.
 */
export async function deleteCommittee(
  db: D1DatabaseLike,
  committeeId: string,
  fiscalYearId: string = 'fy25-26'
): Promise<{ success: boolean; message: string }> {
  const existing = await queryFirst<{ id: string; name: string }>(
    db,
    'SELECT id, name FROM finance_committees WHERE id = ?',
    [committeeId]
  );
  if (!existing) {
    throw new Error(`Committee "${committeeId}" does not exist.`);
  }

  const d1 = toD1Database(db);

  // Retrieve existing budget before deleting child tables to log released allocation accurately
  const existingBudget = await queryFirst<{ allocated_amount: number }>(
    db,
    'SELECT allocated_amount FROM committee_budgets WHERE fiscal_year_id = ? AND committee_id = ?',
    [fiscalYearId, committeeId]
  );
  const releasedBudget = Number(existingBudget?.allocated_amount || 0);

  // Clean up child tables
  await d1.prepare('DELETE FROM purchase_requests WHERE committee_id = ?').bind(committeeId).run();
  await d1.prepare('DELETE FROM committee_funding_inflows WHERE committee_id = ?').bind(committeeId).run();
  await d1.prepare('DELETE FROM budget_categories WHERE committee_id = ?').bind(committeeId).run();
  await d1.prepare('DELETE FROM committee_budgets WHERE committee_id = ?').bind(committeeId).run();
  await d1.prepare('DELETE FROM budget_audit_logs WHERE committee_id = ?').bind(committeeId).run();
  await d1.prepare('DELETE FROM finance_committees WHERE id = ?').bind(committeeId).run();

  await recordAuditEntry(db, {
    fiscalYearId,
    committeeId,
    actionType: 'BUDGET_ALLOCATION',
    actorRole: 'TREASURER',
    actorName: 'Executive Treasurer',
    actorEmail: 'treasurer@purdueieee.org',
    description: releasedBudget > 0
      ? `Deleted committee "${existing.name}" (${committeeId}) and released base budget allocation (-$${releasedBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })})`
      : `Deleted committee "${existing.name}" (${committeeId})`,
    previousValue: existing.name,
    newValue: null,
    amountDelta: releasedBudget > 0 ? -releasedBudget : 0,
  });

  return {
    success: true,
    message: `Committee "${existing.name}" deleted successfully.`,
  };
}

export interface CreateFundingInflowPayload {
  id?: string;
  fiscalYearId: string;
  committeeId: string;
  sourceType?: string;
  title: string;
  amount: number;
  referenceNumber?: string;
  receivedDate?: string;
  notes?: string;
  recordedByUserId?: string;
}

/**
 * Records specific funding inflow received by a committee (SFAB grant, corporate sponsor, departmental award).
 */
export async function recordCommitteeFundingInflow(
  db: D1DatabaseLike,
  payload: CreateFundingInflowPayload
): Promise<{
  success: boolean;
  id: string;
  committeeId: string;
  sourceType: string;
  amount: number;
  referenceNumber: string | null;
  message: string;
}> {
  if (!payload.committeeId || !payload.title || typeof payload.amount !== 'number' || payload.amount <= 0) {
    throw new Error('Invalid funding inflow payload: committeeId, title, and positive amount are required.');
  }

  const d1 = toD1Database(db);
  const inflowId = payload.id || `inflow-${crypto.randomUUID()}`;
  const receivedDate = payload.receivedDate || new Date().toISOString().split('T')[0];
  const sourceType = (payload.sourceType as string) || 'Other';
  const referenceNumber = payload.referenceNumber?.trim() || null;

  await d1
    .prepare(
      `INSERT INTO committee_funding_inflows (
        id, fiscal_year_id, committee_id, source_type, title, amount, reference_number, received_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      inflowId,
      payload.fiscalYearId,
      payload.committeeId,
      sourceType,
      payload.title.trim(),
      roundCurrency(payload.amount),
      referenceNumber,
      receivedDate,
      payload.notes?.trim() || null
    )
    .run();

  await recordAuditEntry(db, {
    fiscalYearId: payload.fiscalYearId || 'fy25-26',
    committeeId: payload.committeeId,
    actionType: 'FUNDING_INFLOW',
    actorRole: 'TREASURER',
    actorName: 'Executive Treasurer',
    actorEmail: 'treasurer@purdueieee.org',
    description: `Recorded funding inflow of $${payload.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} from ${sourceType}: "${payload.title}"`,
    previousValue: null,
    newValue: String(payload.amount),
    amountDelta: payload.amount,
  });

  return {
    success: true,
    id: inflowId,
    committeeId: payload.committeeId,
    sourceType,
    amount: roundCurrency(payload.amount),
    referenceNumber,
    message: `Successfully recorded $${payload.amount.toFixed(2)} funding for ${payload.committeeId}.`,
  };
}

export interface UpdateFundingInflowPayload {
  id: string;
  sourceType?: string;
  title?: string;
  amount?: number;
  referenceNumber?: string | null;
  receivedDate?: string;
  notes?: string | null;
}

/**
 * Updates an existing committee funding inflow/grant and records an audit trail in the banking ledger.
 */
export async function updateCommitteeFundingInflow(
  db: D1DatabaseLike,
  payload: UpdateFundingInflowPayload,
  actorSession?: { role?: string; name?: string; committeeId?: string } | null
): Promise<{ success: boolean; inflow: any; message: string }> {
  const d1 = toD1Database(db);
  const existing = await queryFirst<any>(
    db,
    'SELECT * FROM committee_funding_inflows WHERE id = ?',
    [payload.id]
  );
  if (!existing) {
    throw new Error(`Funding inflow "${payload.id}" not found.`);
  }

  const prevAmount = roundCurrency(Number(existing.amount) || 0);
  const newAmount = payload.amount !== undefined ? roundCurrency(payload.amount) : prevAmount;
  if (newAmount <= 0) {
    throw new Error('Funding inflow amount must be greater than $0.00.');
  }

  const newSourceType = payload.sourceType?.trim() || existing.source_type;
  const newTitle = payload.title !== undefined ? payload.title.trim() : existing.title;
  const newReference =
    payload.referenceNumber !== undefined ? payload.referenceNumber?.trim() || null : existing.reference_number;
  const newDate = payload.receivedDate || existing.received_date;
  const newNotes = payload.notes !== undefined ? payload.notes?.trim() || null : existing.notes;
  const amountDelta = roundCurrency(newAmount - prevAmount);

  await d1
    .prepare(
      `UPDATE committee_funding_inflows
       SET source_type = ?, title = ?, amount = ?, reference_number = ?, received_date = ?, notes = ?
       WHERE id = ?`
    )
    .bind(newSourceType, newTitle, newAmount, newReference, newDate, newNotes, payload.id)
    .run();

  const changeDetails: string[] = [];
  if (newAmount !== prevAmount) {
    changeDetails.push(`amount: $${prevAmount.toFixed(2)} -> $${newAmount.toFixed(2)}`);
  }
  if (newSourceType !== existing.source_type) {
    changeDetails.push(`source: ${existing.source_type} -> ${newSourceType}`);
  }
  if (newTitle !== existing.title) {
    changeDetails.push(`title: "${existing.title}" -> "${newTitle}"`);
  }

  await recordAuditEntry(db, {
    fiscalYearId: existing.fiscal_year_id || 'fy25-26',
    committeeId: existing.committee_id,
    actionType: 'FUNDING_INFLOW_EDITED',
    actorRole: actorSession?.role || 'TREASURER',
    actorName: actorSession?.name || 'Executive Treasurer',
    actorEmail: actorSession?.committeeId === 'treasurer' ? 'treasurer@purdueieee.org' : undefined,
    description: `Edited funding inflow ${payload.id} ("${newTitle}"): ${changeDetails.join(', ') || 'parameters updated'}`,
    previousValue: String(prevAmount),
    newValue: String(newAmount),
    amountDelta,
  });

  return {
    success: true,
    inflow: {
      id: payload.id,
      committeeId: existing.committee_id,
      fiscalYearId: existing.fiscal_year_id,
      sourceType: newSourceType,
      title: newTitle,
      amount: newAmount,
      referenceNumber: newReference,
      receivedDate: newDate,
      notes: newNotes,
    },
    message: `Successfully updated funding inflow ${payload.id}.`,
  };
}

export interface BudgetAuditEntry {
  id: string;
  committeeId: string;
  fiscalYearId: string;
  adjustedBy: string;
  previousAmount: number;
  newAmount: number;
  reason?: string;
  createdAt: string;
}

/**
 * Records an immutable audit trail entry whenever a committee budget allocation is updated.
 */
export async function recordBudgetAdjustmentAudit(
  db: D1DatabaseLike,
  entry: {
    committeeId: string;
    fiscalYearId: string;
    adjustedBy: string;
    previousAmount: number;
    newAmount: number;
    reason?: string;
  }
): Promise<BudgetAuditEntry> {
  const d1 = toD1Database(db);
  const auditId = `audit-${crypto.randomUUID()}`;
  const createdAt = new Date().toISOString();

  await d1
    .prepare(
      `INSERT INTO budget_audit_logs (
        id, committee_id, fiscal_year_id, adjusted_by, previous_amount, new_amount, reason, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      auditId,
      entry.committeeId,
      entry.fiscalYearId,
      entry.adjustedBy,
      roundCurrency(entry.previousAmount),
      roundCurrency(entry.newAmount),
      entry.reason || null,
      createdAt
    )
    .run();

  return {
    id: auditId,
    committeeId: entry.committeeId,
    fiscalYearId: entry.fiscalYearId,
    adjustedBy: entry.adjustedBy,
    previousAmount: roundCurrency(entry.previousAmount),
    newAmount: roundCurrency(entry.newAmount),
    reason: entry.reason,
    createdAt,
  };
}

/**
 * Retrieves budget revision history for a committee.
 */
export async function getBudgetAuditHistory(
  db: D1DatabaseLike,
  committeeId: string,
  fiscalYearId: string
): Promise<BudgetAuditEntry[]> {
  const d1 = toD1Database(db);
  const rows = await queryAll<{
    id: string;
    committee_id: string;
    fiscal_year_id: string;
    adjusted_by: string;
    previous_amount: number;
    new_amount: number;
    reason: string | null;
    created_at: string;
  }>(
    d1,
    `SELECT * FROM budget_audit_logs WHERE committee_id = ? AND fiscal_year_id = ? ORDER BY created_at DESC`,
    [committeeId, fiscalYearId]
  );

  return rows.map((r) => ({
    id: r.id,
    committeeId: r.committee_id,
    fiscalYearId: r.fiscal_year_id,
    adjustedBy: r.adjusted_by,
    previousAmount: Number(r.previous_amount),
    newAmount: Number(r.new_amount),
    reason: r.reason || undefined,
    createdAt: r.created_at,
  }));
}



/**
 * BoilerBooks 3.0 Purchase Request Engine & Service Layer
 * Purdue IEEE Internal Financial Portal
 */

import type { DatabaseSync } from 'node:sqlite';
import { adaptDatabase, type D1DatabaseLike } from '../db/adapter';
import type {
  PurchaseRequest,
  PurchaseRequestRow,
  PurchaseRequestStatus,
  CommitteeBudgetRow,
  FiscalYearRow,
  FinanceCommitteeRow,
} from '../db/types';
import type { AuthSession } from '../auth/types';

export interface CreatePurchaseRequestPayload {
  id?: string;
  fiscalYearId: string;
  committeeId: string;
  categoryId?: string | null;
  fundingSource?: 'SFAB' | 'GENERAL';
  sfabLineItem?: string | null;
  purdueUsername?: string;
  streetAddress?: string;
  phoneNumber?: string;
  disbursementMethod?: 'BOSO_PICKUP' | 'MAIL_ADDRESS' | 'EPAYMENT';
  requesterName: string;
  requesterEmail: string;
  vendorName: string;
  totalAmount: number;
  description: string;
  receiptR2Key?: string | null;
  receiptFilename?: string | null;
  receiptContentType?: string | null;
  coolAccountNumber?: string | null;
}

export interface CreatePurchaseRequestResult extends PurchaseRequest {
  budgetWarning?: string;
  isOverBudget?: boolean;
  remainingBudget?: number;
}

export interface PurchaseRequestFilter {
  committeeId?: string;
  fiscalYearId?: string;
  status?: PurchaseRequestStatus;
  categoryId?: string;
  limit?: number;
  offset?: number;
}

export interface CommitteeBudgetSummaryResult {
  committeeId: string;
  fiscalYearId: string;
  allocatedAmount: number;
  spentAmount: number;
  pendingAmount: number;
  remainingAmount: number;
  isOverBudget: boolean;
}

/**
 * Maps raw database row with optional joined category name to domain PurchaseRequest model
 */
export function mapRowToPurchaseRequest(
  row: PurchaseRequestRow & { category_name?: string | null }
): PurchaseRequest {
  return {
    id: row.id,
    fiscalYearId: row.fiscal_year_id,
    committeeId: row.committee_id,
    categoryId: row.category_id || null,
    categoryName: row.category_name || null,
    fundingSource: row.funding_source || 'GENERAL',
    sfabLineItem: row.sfab_line_item || null,
    purdueUsername: row.purdue_username || '',
    streetAddress: row.street_address || '',
    phoneNumber: row.phone_number || '',
    disbursementMethod: row.disbursement_method || 'BOSO_PICKUP',
    requesterName: row.requester_name,
    requesterEmail: row.requester_email,
    vendorName: row.vendor_name,
    totalAmount: Number(row.total_amount),
    description: row.description,
    status: row.status,
    receiptR2Key: row.receipt_r2_key || null,
    receiptFilename: row.receipt_filename || null,
    receiptContentType: row.receipt_content_type || null,
    coolAccountNumber: row.cool_account_number || null,
    coolBatchId: row.cool_batch_id || null,
    treasurerNotes: row.treasurer_notes || null,
    submittedAt: row.submitted_at,
    approvedAt: row.approved_at || null,
    reimbursedAt: row.reimbursed_at || null,
  };
}

/**
 * Validates requester and purchase request fields
 */
export function validatePurchaseRequestFields(payload: CreatePurchaseRequestPayload): void {
  if (!payload.requesterName || typeof payload.requesterName !== 'string' || payload.requesterName.trim().length === 0) {
    throw new Error('Requester name is required');
  }

  if (!payload.requesterEmail || typeof payload.requesterEmail !== 'string' || payload.requesterEmail.trim().length === 0) {
    throw new Error('Requester email is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.requesterEmail.trim())) {
    throw new Error('Valid email address is required');
  }

  if (!payload.vendorName || typeof payload.vendorName !== 'string' || payload.vendorName.trim().length === 0) {
    throw new Error('Vendor name is required');
  }

  if (
    typeof payload.totalAmount !== 'number' ||
    !Number.isFinite(payload.totalAmount) ||
    payload.totalAmount <= 0
  ) {
    throw new Error('Total amount must be a positive number greater than $0.00');
  }

  if (!payload.description || typeof payload.description !== 'string' || payload.description.trim().length === 0) {
    throw new Error('Description is required');
  }

  if (!payload.fiscalYearId || typeof payload.fiscalYearId !== 'string' || payload.fiscalYearId.trim().length === 0) {
    throw new Error('Fiscal year ID is required');
  }

  if (!payload.committeeId || typeof payload.committeeId !== 'string' || payload.committeeId.trim().length === 0) {
    throw new Error('Committee ID is required');
  }
}

/**
 * Retrieves budget status & remaining calculation for a committee in a given fiscal year
 */
export async function getCommitteeBudgetSummary(
  dbLike: D1DatabaseLike | DatabaseSync,
  fiscalYearId: string,
  committeeId: string
): Promise<CommitteeBudgetSummaryResult> {
  const db = adaptDatabase(dbLike);

  // 1. Get allocated budget
  const budgetRow = await db
    .prepare('SELECT * FROM committee_budgets WHERE fiscal_year_id = ? AND committee_id = ?')
    .bind(fiscalYearId, committeeId)
    .first<CommitteeBudgetRow>();

  const allocatedAmount = budgetRow ? Number(budgetRow.allocated_amount) : 0;

  // 2. Query committed purchases (spent = REIMBURSED / PURCHASED / APPROVED; pending = PENDING)
  const purchasesResult = await db
    .prepare(
      `SELECT status, total_amount FROM purchase_requests 
       WHERE fiscal_year_id = ? AND committee_id = ? AND status != 'REJECTED'`
    )
    .bind(fiscalYearId, committeeId)
    .all<{ status: PurchaseRequestStatus; total_amount: number }>();

  let spentAmount = 0;
  let pendingAmount = 0;

  for (const row of purchasesResult.results || []) {
    const amount = Number(row.total_amount) || 0;
    if (row.status === 'PENDING') {
      pendingAmount += amount;
    } else if (
      row.status === 'APPROVED' ||
      row.status === 'PURCHASED' ||
      row.status === 'REIMBURSED'
    ) {
      spentAmount += amount;
    }
  }

  const remainingAmount = allocatedAmount - (spentAmount + pendingAmount);

  return {
    committeeId,
    fiscalYearId,
    allocatedAmount,
    spentAmount,
    pendingAmount,
    remainingAmount,
    isOverBudget: remainingAmount < 0,
  };
}

/**
 * Submits a new Purchase Request
 * Validates requester fields, enforces committee isolation, checks budget availability,
 * and persists the record to D1 database.
 */
export async function createPurchaseRequest(
  dbLike: D1DatabaseLike | DatabaseSync,
  payload: CreatePurchaseRequestPayload,
  session: AuthSession
): Promise<CreatePurchaseRequestResult> {
  if (!session) {
    throw new Error('Unauthorized: Active session required');
  }

  const db = adaptDatabase(dbLike);

  // Enforce Committee Role Isolation
  if (session.role === 'COMMITTEE_LEAD') {
    if (session.committeeId !== payload.committeeId) {
      throw new Error(
        `Unauthorized: Committee leads for "${session.committeeId}" cannot create purchase requests for "${payload.committeeId}"`
      );
    }
  }

  // Validate payload fields
  validatePurchaseRequestFields(payload);

  // Verify Fiscal Year exists
  const fy = await db
    .prepare('SELECT * FROM fiscal_years WHERE id = ?')
    .bind(payload.fiscalYearId)
    .first<FiscalYearRow>();

  if (!fy) {
    throw new Error(`Fiscal year "${payload.fiscalYearId}" does not exist`);
  }

  // Verify Committee exists
  const committee = await db
    .prepare('SELECT * FROM finance_committees WHERE id = ?')
    .bind(payload.committeeId)
    .first<FinanceCommitteeRow>();

  if (!committee) {
    throw new Error(`Finance committee "${payload.committeeId}" does not exist`);
  }

  // Verify Budget Category if provided
  if (payload.categoryId) {
    const category = await db
      .prepare('SELECT * FROM budget_categories WHERE id = ? AND committee_id = ?')
      .bind(payload.categoryId, payload.committeeId)
      .first<{ id: string; name: string }>();

    if (!category) {
      throw new Error(
        `Budget category "${payload.categoryId}" does not exist for committee "${payload.committeeId}"`
      );
    }
  }

  // Check Committee Budget availability
  const budgetSummary = await getCommitteeBudgetSummary(
    db,
    payload.fiscalYearId,
    payload.committeeId
  );

  let budgetWarning: string | undefined = undefined;
  let isOverBudget = false;

  if (budgetSummary.allocatedAmount === 0) {
    budgetWarning = `Warning: Committee "${payload.committeeId}" has no allocated budget for fiscal year "${payload.fiscalYearId}".`;
    isOverBudget = true;
  } else if (payload.totalAmount > budgetSummary.remainingAmount) {
    const remainingStr = budgetSummary.remainingAmount.toFixed(2);
    const requestedStr = payload.totalAmount.toFixed(2);
    budgetWarning = `Warning: Requested amount ($${requestedStr}) exceeds committee remaining budget ($${remainingStr}).`;
    isOverBudget = true;
  }

  const id = payload.id || `pr-${crypto.randomUUID()}`;
  const submittedAt = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO purchase_requests (
        id, fiscal_year_id, committee_id, category_id,
        funding_source, sfab_line_item, purdue_username, street_address,
        phone_number, disbursement_method, requester_name, requester_email,
        vendor_name, total_amount, description, status, receipt_r2_key,
        receipt_filename, receipt_content_type, cool_account_number, cool_batch_id,
        treasurer_notes, submitted_at, approved_at, reimbursed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, NULL, NULL, ?, NULL, NULL)`
    )
    .bind(
      id,
      payload.fiscalYearId,
      payload.committeeId,
      payload.categoryId || null,
      payload.fundingSource || 'GENERAL',
      payload.sfabLineItem || null,
      (payload.purdueUsername || '').trim(),
      (payload.streetAddress || '').trim(),
      (payload.phoneNumber || '').trim(),
      payload.disbursementMethod || 'BOSO_PICKUP',
      payload.requesterName.trim(),
      payload.requesterEmail.trim().toLowerCase(),
      payload.vendorName.trim(),
      payload.totalAmount,
      payload.description.trim(),
      payload.receiptR2Key || null,
      payload.receiptFilename || null,
      payload.receiptContentType || null,
      payload.coolAccountNumber || null,
      submittedAt
    )
    .run();

  // Fetch the created record with joined category name
  const createdRow = await db
    .prepare(
      `SELECT pr.*, bc.name as category_name 
       FROM purchase_requests pr 
       LEFT JOIN budget_categories bc ON pr.category_id = bc.id 
       WHERE pr.id = ?`
    )
    .bind(id)
    .first<PurchaseRequestRow & { category_name?: string | null }>();

  if (!createdRow) {
    throw new Error('Failed to retrieve created purchase request record');
  }

  const mapped = mapRowToPurchaseRequest(createdRow);

  return {
    ...mapped,
    budgetWarning,
    isOverBudget,
    remainingBudget: budgetSummary.remainingAmount,
  };
}

/**
 * Lists purchase requests with role-based filtering and isolation.
 * COMMITTEE_LEAD can only list requests for their own committee.
 * TREASURER, PRESIDENT, and IT_ADMIN can list requests across all committees or filter.
 */
export async function listPurchaseRequests(
  dbLike: D1DatabaseLike | DatabaseSync,
  filter: PurchaseRequestFilter = {},
  session: AuthSession
): Promise<PurchaseRequest[]> {
  if (!session) {
    throw new Error('Unauthorized: Active session required');
  }

  const db = adaptDatabase(dbLike);

  // Committee Lead Isolation
  let targetCommitteeId = filter.committeeId;
  if (session.role === 'COMMITTEE_LEAD') {
    targetCommitteeId = session.committeeId;
  }

  const whereClauses: string[] = [];
  const params: unknown[] = [];

  if (targetCommitteeId) {
    whereClauses.push('pr.committee_id = ?');
    params.push(targetCommitteeId);
  }

  if (filter.fiscalYearId) {
    whereClauses.push('pr.fiscal_year_id = ?');
    params.push(filter.fiscalYearId);
  }

  if (filter.status) {
    whereClauses.push('pr.status = ?');
    params.push(filter.status);
  }

  if (filter.categoryId) {
    whereClauses.push('pr.category_id = ?');
    params.push(filter.categoryId);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const limitSql = filter.limit && filter.limit > 0 ? `LIMIT ${filter.limit}` : '';
  const offsetSql = filter.offset && filter.offset > 0 ? `OFFSET ${filter.offset}` : '';

  const sql = `
    SELECT pr.*, bc.name as category_name 
    FROM purchase_requests pr 
    LEFT JOIN budget_categories bc ON pr.category_id = bc.id 
    ${whereSql}
    ORDER BY pr.submitted_at DESC
    ${limitSql} ${offsetSql}
  `.trim();

  const result = await db
    .prepare(sql)
    .bind(...params)
    .all<PurchaseRequestRow & { category_name?: string | null }>();

  return (result.results || []).map(mapRowToPurchaseRequest);
}

/**
 * Gets a specific purchase request by ID with receipt metadata.
 * Enforces committee lead ownership validation.
 */
export async function getPurchaseRequest(
  dbLike: D1DatabaseLike | DatabaseSync,
  id: string,
  session: AuthSession
): Promise<PurchaseRequest | null> {
  if (!session) {
    throw new Error('Unauthorized: Active session required');
  }

  if (!id || typeof id !== 'string') {
    return null;
  }

  const db = adaptDatabase(dbLike);

  const row = await db
    .prepare(
      `SELECT pr.*, bc.name as category_name 
       FROM purchase_requests pr 
       LEFT JOIN budget_categories bc ON pr.category_id = bc.id 
       WHERE pr.id = ?`
    )
    .bind(id)
    .first<PurchaseRequestRow & { category_name?: string | null }>();

  if (!row) {
    return null;
  }

  // Check RBAC ownership for Committee Leads
  if (session.role === 'COMMITTEE_LEAD' && row.committee_id !== session.committeeId) {
    throw new Error('Unauthorized: Cannot access purchase requests of other committees');
  }

  return mapRowToPurchaseRequest(row);
}

const ALLOWED_STATUS_TRANSITIONS: Record<PurchaseRequestStatus, PurchaseRequestStatus[]> = {
  PENDING: ['APPROVED', 'PURCHASED', 'REIMBURSED', 'REJECTED'],
  APPROVED: ['PURCHASED', 'REIMBURSED', 'REJECTED', 'PENDING'],
  PURCHASED: ['REIMBURSED', 'REJECTED', 'APPROVED', 'PENDING'],
  REIMBURSED: ['REIMBURSED', 'APPROVED', 'PURCHASED', 'PENDING'],
  REJECTED: ['PENDING', 'APPROVED', 'REJECTED'],
};

/**
 * Updates status of a Purchase Request (e.g. PENDING -> APPROVED -> PURCHASED -> REIMBURSED or REJECTED)
 * Enforces Treasurer / Admin RBAC permission and status transition state machine.
 */
export async function updatePurchaseStatus(
  dbLike: D1DatabaseLike | DatabaseSync,
  id: string,
  newStatus: PurchaseRequestStatus,
  treasurerNotes: string | null | undefined,
  session: AuthSession,
  coolBatchId?: string | null
): Promise<PurchaseRequest> {
  if (!session) {
    throw new Error('Unauthorized: Active session required');
  }

  // Only Treasurer, President, or IT_Admin can change status
  const allowedAdminRoles = ['TREASURER', 'PRESIDENT', 'IT_ADMIN'];
  if (!allowedAdminRoles.includes(session.role)) {
    throw new Error('Unauthorized: Only treasurers and administrators can update purchase status');
  }

  if (!id || typeof id !== 'string') {
    throw new Error('Purchase request ID is required');
  }

  const validStatuses: PurchaseRequestStatus[] = [
    'PENDING',
    'APPROVED',
    'PURCHASED',
    'REIMBURSED',
    'REJECTED',
  ];

  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid purchase request status: "${newStatus}"`);
  }

  const db = adaptDatabase(dbLike);

  // Retrieve current record
  const current = await db
    .prepare('SELECT * FROM purchase_requests WHERE id = ?')
    .bind(id)
    .first<PurchaseRequestRow>();

  if (!current) {
    throw new Error(`Purchase request "${id}" not found`);
  }

  const currentStatus = current.status;
  const allowedNext = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];

  if (currentStatus !== newStatus && !allowedNext.includes(newStatus)) {
    throw new Error(
      `Invalid status transition from "${currentStatus}" to "${newStatus}". Allowed transitions: ${allowedNext.join(', ')}`
    );
  }

  const now = new Date().toISOString();
  let approvedAt = current.approved_at;
  let reimbursedAt = current.reimbursed_at;

  if (newStatus === 'APPROVED' && !approvedAt) {
    approvedAt = now;
  } else if (newStatus === 'REIMBURSED') {
    if (!approvedAt) approvedAt = now;
    reimbursedAt = now;
  } else if (newStatus === 'REJECTED') {
    // Keep or leave timestamps
  }

  const updatedNotes = treasurerNotes !== undefined ? treasurerNotes : current.treasurer_notes;
  const updatedCoolBatchId = coolBatchId !== undefined ? coolBatchId : current.cool_batch_id;

  await db
    .prepare(
      `UPDATE purchase_requests 
       SET status = ?, approved_at = ?, reimbursed_at = ?, treasurer_notes = ?, cool_batch_id = ?
       WHERE id = ?`
    )
    .bind(newStatus, approvedAt, reimbursedAt, updatedNotes, updatedCoolBatchId, id)
    .run();

  const updatedRow = await db
    .prepare(
      `SELECT pr.*, bc.name as category_name 
       FROM purchase_requests pr 
       LEFT JOIN budget_categories bc ON pr.category_id = bc.id 
       WHERE pr.id = ?`
    )
    .bind(id)
    .first<PurchaseRequestRow & { category_name?: string | null }>();

  if (!updatedRow) {
    throw new Error(`Failed to retrieve updated purchase request record for "${id}"`);
  }

  return mapRowToPurchaseRequest(updatedRow);
}

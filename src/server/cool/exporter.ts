/**
 * BoilerBooks 3.0 Purdue COOL / BOSOP Batch Exporter
 * Formats reimbursement submissions for administrative entry into Purdue COOL / BOSOP.
 */

import { queryAll, executeRun, roundCurrency, type D1DatabaseLike } from '../db/query';
import type { PurchaseRequestStatus } from '../db/types';
import type { AuthSession } from '../auth/types';

export interface COOLBatchFilter {
  status?: PurchaseRequestStatus | PurchaseRequestStatus[];
  committeeId?: string;
  requestIds?: string[];
}

export interface COOLBatchItem {
  id: string;
  requesterName: string;
  requesterEmail: string;
  purdueUsername: string;
  phoneNumber: string;
  streetAddress: string;
  disbursementMethod: 'BOSO_PICKUP' | 'MAIL_ADDRESS' | 'EPAYMENT';
  formattedDisbursement: string;
  fundingSource: 'SFAB' | 'GENERAL';
  sfabLineItem: string | null;
  vendorName: string;
  accountNumber: string;
  totalAmount: number;
  formattedAmount: string;
  receiptUrl: string | null;
  description: string;
  committeeId: string;
  committeeName: string;
  status: PurchaseRequestStatus;
  submittedAt: string;
}

export interface COOLBatchExportResult {
  fiscalYearId: string;
  generatedAt: string;
  batchCount: number;
  totalBatchAmount: number;
  formattedTotalAmount: string;
  items: COOLBatchItem[];
  copyableText: string;
  tabDelimited: string;
  csv: string;
}

export interface MarkCOOLBatchResult {
  success: boolean;
  batchId: string;
  updatedCount: number;
  reimbursedAt: string;
  requestIds: string[];
}

interface RawExportRow {
  id: string;
  fiscal_year_id: string;
  committee_id: string;
  committee_name: string | null;
  category_id: string | null;
  funding_source: 'SFAB' | 'GENERAL';
  sfab_line_item: string | null;
  purdue_username: string;
  street_address: string;
  phone_number: string;
  disbursement_method: 'BOSO_PICKUP' | 'MAIL_ADDRESS' | 'EPAYMENT';
  requester_name: string;
  requester_email: string;
  vendor_name: string;
  total_amount: number;
  description: string;
  status: PurchaseRequestStatus;
  receipt_r2_key: string | null;
  receipt_filename: string | null;
  cool_account_number: string | null;
  cool_batch_id: string | null;
  submitted_at: string;
  approved_at: string | null;
  reimbursed_at: string | null;
}

/**
 * Neutralizes formula triggers for CSV/TSV export to prevent CSV formula injection (CWE-1236).
 */
function sanitizeFormulaInjection(value: string): string {
  if (/^[=+\-@\t\r%|]/.test(value)) {
    return `'${value}`;
  }
  return value;
}

/**
 * Escapes a field for CSV format following RFC 4180 with formula injection defense.
 */
export function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) return '';
  let str = String(value);
  str = sanitizeFormulaInjection(str);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Cleans a field for Tab-Delimited TSV paste by removing tabs and newlines and neutralizing formulas.
 */
export function escapeTSVField(value: unknown): string {
  if (value === null || value === undefined) return '';
  let str = String(value).replace(/[\t\r\n]+/g, ' ').trim();
  return sanitizeFormulaInjection(str);
}

/**
 * Builds formatted text representation for human copy/pasting.
 */
export function formatCopyableCOOLBatch(
  fiscalYearId: string,
  generatedAt: string,
  totalAmount: number,
  items: COOLBatchItem[]
): string {
  if (items.length === 0) {
    return `PURDUE COOL / BOSOP BATCH EXPORT\nFiscal Year: ${fiscalYearId} | Generated: ${generatedAt}\nNo matching reimbursement items found.`;
  }

  const header = [
    `PURDUE COOL / BOSOP BATCH EXPORT`,
    `Fiscal Year: ${fiscalYearId} | Generated: ${generatedAt} | Total Items: ${items.length} | Total Amount: $${totalAmount.toFixed(2)}`,
    `================================================================================`,
  ].join('\n');

  const itemBlocks = items.map((item, index) => {
    return [
      `[${index + 1}] Requester: ${item.requesterName} (Purdue ID: ${item.purdueUsername || 'N/A'})`,
      `    Purdue Email: ${item.requesterEmail} | Phone: ${item.phoneNumber || 'N/A'}`,
      `    Funding Source: ${item.fundingSource}${item.fundingSource === 'SFAB' ? ` (Line Item: ${item.sfabLineItem || 'N/A'})` : ''}`,
      `    Disbursement: ${item.formattedDisbursement}`,
      `    Vendor: ${item.vendorName}`,
      `    Account Line: ${item.accountNumber}`,
      `    Total Cost: ${item.formattedAmount}`,
      `    Receipt: ${item.receiptUrl || 'None Attached'}`,
      `    Description: ${item.description}`,
    ].join('\n');
  });

  return `${header}\n\n${itemBlocks.join('\n\n')}\n`;
}

/**
 * Builds TSV tab-delimited string for 1-click clipboard paste.
 */
export function formatTSVCOOLBatch(items: COOLBatchItem[]): string {
  const headers = [
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
  ];

  const rows = items.map((item) =>
    [
      escapeTSVField(item.requesterName),
      escapeTSVField(item.purdueUsername),
      escapeTSVField(item.requesterEmail),
      escapeTSVField(item.phoneNumber),
      escapeTSVField(item.fundingSource),
      escapeTSVField(item.sfabLineItem || 'N/A'),
      escapeTSVField(item.formattedDisbursement),
      escapeTSVField(item.streetAddress),
      escapeTSVField(item.vendorName),
      escapeTSVField(item.accountNumber),
      item.totalAmount.toFixed(2),
      escapeTSVField(item.receiptUrl || ''),
      escapeTSVField(item.description),
    ].join('\t')
  );

  return [headers.join('\t'), ...rows].join('\n');
}

/**
 * Builds CSV string following RFC 4180 for Excel/COOL import.
 */
export function formatCSVCOOLBatch(items: COOLBatchItem[]): string {
  const headers = [
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
  ];

  const rows = items.map((item) =>
    [
      escapeCSVField(item.requesterName),
      escapeCSVField(item.purdueUsername),
      escapeCSVField(item.requesterEmail),
      escapeCSVField(item.phoneNumber),
      escapeCSVField(item.fundingSource),
      escapeCSVField(item.sfabLineItem || 'N/A'),
      escapeCSVField(item.formattedDisbursement),
      escapeCSVField(item.streetAddress),
      escapeCSVField(item.vendorName),
      escapeCSVField(item.accountNumber),
      escapeCSVField(item.totalAmount.toFixed(2)),
      escapeCSVField(item.receiptUrl || ''),
      escapeCSVField(item.description),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Generates formatted Purdue COOL/BOSOP batch export structures.
 */
export async function generateCOOLBatch(
  db: D1DatabaseLike,
  fiscalYearId: string,
  filter?: COOLBatchFilter
): Promise<COOLBatchExportResult> {
  const whereClauses: string[] = ['pr.fiscal_year_id = ?'];
  const params: unknown[] = [fiscalYearId];

  // 1. Status Filter
  if (filter?.status) {
    if (Array.isArray(filter.status) && filter.status.length > 0) {
      const placeholders = filter.status.map(() => '?').join(', ');
      whereClauses.push(`pr.status IN (${placeholders})`);
      params.push(...filter.status);
    } else if (typeof filter.status === 'string') {
      whereClauses.push('pr.status = ?');
      params.push(filter.status);
    }
  } else {
    // Default to APPROVED requests ready for COOL batching
    whereClauses.push("pr.status IN ('APPROVED')");
  }

  // 2. Committee Filter
  if (filter?.committeeId) {
    whereClauses.push('pr.committee_id = ?');
    params.push(filter.committeeId);
  }

  // 3. Explicit Request IDs Filter
  if (filter?.requestIds && filter.requestIds.length > 0) {
    const placeholders = filter.requestIds.map(() => '?').join(', ');
    whereClauses.push(`pr.id IN (${placeholders})`);
    params.push(...filter.requestIds);
  }

  const sql = `
    SELECT 
      pr.id,
      pr.fiscal_year_id,
      pr.committee_id,
      fc.name AS committee_name,
      pr.category_id,
      pr.funding_source,
      pr.sfab_line_item,
      pr.purdue_username,
      pr.street_address,
      pr.phone_number,
      pr.disbursement_method,
      pr.requester_name,
      pr.requester_email,
      pr.vendor_name,
      pr.total_amount,
      pr.description,
      pr.status,
      pr.receipt_r2_key,
      pr.receipt_filename,
      pr.cool_account_number,
      pr.cool_batch_id,
      pr.submitted_at,
      pr.approved_at,
      pr.reimbursed_at
    FROM purchase_requests pr
    LEFT JOIN finance_committees fc ON pr.committee_id = fc.id
    WHERE ${whereClauses.join(' AND ')}
    ORDER BY pr.submitted_at ASC, pr.id ASC;
  `;

  const rows = await queryAll<RawExportRow>(db, sql, params);

  let totalBatchAmount = 0;

  const items: COOLBatchItem[] = rows.map((row) => {
    const amount = roundCurrency(Number(row.total_amount) || 0);
    totalBatchAmount = roundCurrency(totalBatchAmount + amount);

    let receiptUrl: string | null = null;
    if (row.receipt_r2_key) {
      receiptUrl = row.receipt_r2_key.startsWith('http')
        ? row.receipt_r2_key
        : `/api/finance/receipts/${row.receipt_r2_key}`;
    }

    let formattedDisbursement = 'BOSO Office Pickup (Krach 365)';
    if (row.disbursement_method === 'MAIL_ADDRESS') {
      formattedDisbursement = `Mail: ${row.street_address || 'Address on file'}`;
    } else if (row.disbursement_method === 'EPAYMENT') {
      formattedDisbursement = 'E-Payment to Bank Account';
    }

    return {
      id: row.id,
      requesterName: row.requester_name,
      requesterEmail: row.requester_email,
      purdueUsername: row.purdue_username || '',
      phoneNumber: row.phone_number || '',
      streetAddress: row.street_address || '',
      disbursementMethod: row.disbursement_method || 'BOSO_PICKUP',
      formattedDisbursement,
      fundingSource: row.funding_source || 'GENERAL',
      sfabLineItem: row.sfab_line_item || null,
      vendorName: row.vendor_name,
      accountNumber: row.cool_account_number || '01-234-56',
      totalAmount: amount,
      formattedAmount: `$${amount.toFixed(2)}`,
      receiptUrl,
      description: row.description,
      committeeId: row.committee_id,
      committeeName: row.committee_name || row.committee_id,
      status: row.status,
      submittedAt: row.submitted_at,
    };
  });

  const generatedAt = new Date().toISOString();
  const formattedTotalAmount = `$${totalBatchAmount.toFixed(2)}`;

  const copyableText = formatCopyableCOOLBatch(
    fiscalYearId,
    generatedAt,
    totalBatchAmount,
    items
  );
  const tabDelimited = formatTSVCOOLBatch(items);
  const csv = formatCSVCOOLBatch(items);

  return {
    fiscalYearId,
    generatedAt,
    batchCount: items.length,
    totalBatchAmount,
    formattedTotalAmount,
    items,
    copyableText,
    tabDelimited,
    csv,
  };
}

/**
 * Batch updates purchase requests to REIMBURSED with timestamp and batch ID.
 * Requires Treasurer, President, or Admin authorization.
 */
export async function markCOOLBatchProcessed(
  db: D1DatabaseLike,
  requestIds: string[],
  batchId: string,
  session: AuthSession | null
): Promise<MarkCOOLBatchResult> {
  if (!session) {
    throw new Error('Unauthorized: Valid session required');
  }

  const allowedRoles = ['TREASURER', 'PRESIDENT', 'IT_ADMIN'];
  if (!session.isAdmin && !allowedRoles.includes(session.role)) {
    throw new Error('Forbidden: Only Treasurers, Presidents, or IT Admins can process COOL batches');
  }

  if (!Array.isArray(requestIds) || requestIds.length === 0) {
    return {
      success: false,
      batchId,
      updatedCount: 0,
      reimbursedAt: new Date().toISOString(),
      requestIds: [],
    };
  }

  if (!batchId || typeof batchId !== 'string') {
    throw new Error('Invalid batchId: batchId is required');
  }

  const reimbursedAt = new Date().toISOString();
  const placeholders = requestIds.map(() => '?').join(', ');
  const sql = `
    UPDATE purchase_requests
    SET status = 'REIMBURSED',
        reimbursed_at = ?,
        cool_batch_id = ?
    WHERE id IN (${placeholders});
  `;

  const params = [reimbursedAt, batchId, ...requestIds];
  const { changes } = await executeRun(db, sql, params);

  return {
    success: true,
    batchId,
    updatedCount: changes,
    reimbursedAt,
    requestIds,
  };
}

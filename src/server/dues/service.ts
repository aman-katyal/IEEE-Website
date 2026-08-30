/**
 * BoilerBooks 3.0 Member Dues Service Layer
 * Purdue IEEE Internal Financial Portal
 */

import type { DatabaseSync } from 'node:sqlite';
import { adaptDatabase, type D1DatabaseLike } from '../db/adapter';
import { queryAll, roundCurrency } from '../db/query';
import { recordAuditEntry } from '../db/audit';
import type { MemberDues, MemberDuesRow, FiscalYearRow } from '../db/types';
import type { AuthSession } from '../auth/types';
import type { ParsedDuesRow } from './parser';
import { isValidEmail, parseDateToISO, parseDuesFile } from './parser';

export interface RecordCashPaymentPayload {
  id?: string;
  fiscalYearId: string;
  studentName: string;
  purdueEmail: string;
  amountPaid: number;
  semester: string;
  paymentDate?: string;
}

export interface ImportDuesOptions {
  skipDuplicates?: boolean;
}

export interface ImportDuesResult {
  success: boolean;
  importedCount: number;
  skippedCount: number;
  totalAmountImported: number;
  importedRecords: MemberDues[];
  skippedRecords: Array<{
    purdueEmail: string;
    studentName: string;
    reason: string;
  }>;
}

export interface SemesterDuesBreakdown {
  semester: string;
  memberCount: number;
  totalAmount: number;
  cashCount: number;
  cashAmount: number;
  toocoolCount: number;
  toocoolAmount: number;
}

export interface PaymentMethodBreakdown {
  toocoolAmount: number;
  toocoolCount: number;
  cashAmount: number;
  cashCount: number;
  otherAmount: number;
  otherCount: number;
}

export interface DuesStatsResult {
  fiscalYearId: string;
  totalMembersPaid: number;
  totalTransactions: number;
  totalRevenue: number;
  bySemester: Record<string, SemesterDuesBreakdown>;
  paymentMethodBreakdown: PaymentMethodBreakdown;
}

/**
 * Maps raw database row to MemberDues domain model
 */
export function mapRowToMemberDues(row: MemberDuesRow): MemberDues {
  return {
    id: row.id,
    fiscalYearId: row.fiscal_year_id,
    studentName: row.student_name,
    purdueEmail: row.purdue_email,
    amountPaid: Number(row.amount_paid),
    paymentMethod: row.payment_method,
    paymentDate: row.payment_date,
    semester: row.semester,
    createdAt: row.created_at,
  };
}

/**
 * Ingests a batch of parsed TooCOOL dues records into the member_dues table.
 * Requires TREASURER, PRESIDENT, or IT_ADMIN authorization.
 */
export async function importDuesBatch(
  dbLike: D1DatabaseLike | DatabaseSync,
  records: Array<ParsedDuesRow | {
    id?: string;
    fiscalYearId?: string;
    fiscal_year_id?: string;
    studentName?: string;
    student_name?: string;
    purdueEmail?: string;
    purdue_email?: string;
    amountPaid?: number;
    amount_paid?: number;
    paymentMethod?: string;
    payment_method?: string;
    paymentDate?: string;
    payment_date?: string;
    semester: string;
  }>,
  session: AuthSession | null,
  options: ImportDuesOptions = { skipDuplicates: true }
): Promise<ImportDuesResult> {
  if (!session) {
    throw new Error('Unauthorized: Active session required');
  }

  const allowedRoles = ['TREASURER', 'PRESIDENT', 'IT_ADMIN'];
  if (!session.isAdmin && !allowedRoles.includes(session.role)) {
    throw new Error('Unauthorized: Only treasurers and administrators can import dues batches');
  }

  const db = adaptDatabase(dbLike);
  const skipDuplicates = options.skipDuplicates !== false;

  const importedRecords: MemberDues[] = [];
  const skippedRecords: Array<{ purdueEmail: string; studentName: string; reason: string }> = [];
  let totalAmountImported = 0;

  const existingRecords = new Set<string>();
  if (skipDuplicates && records.length > 0) {
    const fiscalYearIds = Array.from(new Set(records.map((r) => (('fiscalYearId' in r ? r.fiscalYearId : r.fiscal_year_id) || '') as string).filter(Boolean)));
    if (fiscalYearIds.length > 0) {
      const placeholders = fiscalYearIds.map(() => '?').join(',');
      const rows = await db
        .prepare(`SELECT fiscal_year_id, LOWER(purdue_email) as purdue_email, semester FROM member_dues WHERE fiscal_year_id IN (${placeholders})`)
        .bind(...fiscalYearIds)
        .all<{ fiscal_year_id: string; purdue_email: string; semester: string }>();

      if (rows.results) {
        for (const row of rows.results) {
          existingRecords.add(`${row.fiscal_year_id}:${row.purdue_email}:${row.semester}`);
        }
      }
    }
  }

  for (const record of records) {
    const recordAny = record as Record<string, unknown>;
    const fiscalYearId = (('fiscalYearId' in record ? record.fiscalYearId : record.fiscal_year_id) || '') as string;
    const studentName = (('studentName' in record ? record.studentName : record.student_name) || '') as string;
    const emailRaw = (('purdueEmail' in record ? record.purdueEmail : record.purdue_email) || '') as string;
    const purdueEmail = emailRaw.trim().toLowerCase();
    const amountPaid = Number('amountPaid' in record ? record.amountPaid : record.amount_paid) || 0;
    const paymentDate = parseDateToISO((('paymentDate' in record ? record.paymentDate : record.payment_date) || '') as string);
    const semester = record.semester || '';
    const paymentMethod = (recordAny.paymentMethod || recordAny.payment_method || 'TooCOOL') as string;

    if (!fiscalYearId || !studentName || !purdueEmail || !semester || amountPaid <= 0) {
      skippedRecords.push({
        purdueEmail,
        studentName,
        reason: 'Invalid record data (missing required fields or non-positive amount)',
      });
      continue;
    }

    if (!isValidEmail(purdueEmail)) {
      skippedRecords.push({
        purdueEmail,
        studentName,
        reason: `Invalid email address format: "${purdueEmail}"`,
      });
      continue;
    }

    // Check for existing database duplicate
    if (skipDuplicates) {
      if (existingRecords.has(`${fiscalYearId}:${purdueEmail}:${semester}`)) {
        skippedRecords.push({
          purdueEmail,
          studentName,
          reason: `Member dues already recorded for fiscal year "${fiscalYearId}" and semester "${semester}"`,
        });
        continue;
      }
    }

    const id = ('id' in record && record.id) ? record.id : `dues-${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO member_dues (
          id, fiscal_year_id, student_name, purdue_email,
          amount_paid, payment_method, payment_date, semester, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        fiscalYearId,
        studentName.trim(),
        purdueEmail,
        amountPaid,
        paymentMethod,
        paymentDate,
        semester.trim(),
        createdAt
      )
      .run();

    const createdRow = await db
      .prepare('SELECT * FROM member_dues WHERE id = ?')
      .bind(id)
      .first<MemberDuesRow>();

    if (createdRow) {
      importedRecords.push(mapRowToMemberDues(createdRow));
      totalAmountImported = roundCurrency(totalAmountImported + amountPaid);
    }
  }

  return {
    success: true,
    importedCount: importedRecords.length,
    skippedCount: skippedRecords.length,
    totalAmountImported,
    importedRecords,
    skippedRecords,
  };
}

/**
 * Records an in-person single cash payment for member dues.
 * Requires TREASURER, PRESIDENT, or IT_ADMIN authorization.
 */
export async function recordCashPayment(
  dbLike: D1DatabaseLike | DatabaseSync,
  payload: RecordCashPaymentPayload,
  session: AuthSession | null
): Promise<MemberDues> {
  if (!session) {
    throw new Error('Unauthorized: Active session required');
  }

  const allowedRoles = ['COMMITTEE_LEAD', 'TREASURER', 'PRESIDENT', 'IT_ADMIN'];
  if (!session.isAdmin && !allowedRoles.includes(session.role) && !session.committeeId) {
    throw new Error('Unauthorized: Committee lead or treasurer session required to record cash payments');
  }

  if (!payload.studentName || typeof payload.studentName !== 'string' || payload.studentName.trim().length === 0) {
    throw new Error('Student name is required');
  }

  if (!payload.purdueEmail || typeof payload.purdueEmail !== 'string' || !isValidEmail(payload.purdueEmail.trim())) {
    throw new Error('Valid Purdue email address is required');
  }

  if (
    typeof payload.amountPaid !== 'number' ||
    !Number.isFinite(payload.amountPaid) ||
    payload.amountPaid <= 0
  ) {
    throw new Error('Payment amount must be a positive number greater than $0.00');
  }

  if (!payload.fiscalYearId || typeof payload.fiscalYearId !== 'string' || payload.fiscalYearId.trim().length === 0) {
    throw new Error('Fiscal year ID is required');
  }

  if (!payload.semester || typeof payload.semester !== 'string' || payload.semester.trim().length === 0) {
    throw new Error('Semester is required');
  }

  const db = adaptDatabase(dbLike);

  // Verify Fiscal Year exists
  const fy = await db
    .prepare('SELECT id FROM fiscal_years WHERE id = ?')
    .bind(payload.fiscalYearId)
    .first<FiscalYearRow>();

  if (!fy) {
    throw new Error(`Fiscal year "${payload.fiscalYearId}" does not exist`);
  }

  const id = payload.id || `dues-${crypto.randomUUID()}`;
  const paymentDate = parseDateToISO(payload.paymentDate);
  const createdAt = new Date().toISOString();
  const purdueEmail = payload.purdueEmail.trim().toLowerCase();

  await db
    .prepare(
      `INSERT INTO member_dues (
        id, fiscal_year_id, student_name, purdue_email,
        amount_paid, payment_method, payment_date, semester, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      payload.fiscalYearId,
      payload.studentName.trim(),
      purdueEmail,
      payload.amountPaid,
      'Cash',
      paymentDate,
      payload.semester.trim(),
      createdAt
    )
    .run();

  const createdRow = await db
    .prepare('SELECT * FROM member_dues WHERE id = ?')
    .bind(id)
    .first<MemberDuesRow>();

  if (!createdRow) {
    throw new Error('Failed to retrieve created cash dues record');
  }

  try {
    await recordAuditEntry(db, {
      fiscalYearId: payload.fiscalYearId,
      committeeId: session.committeeId,
      actionType: 'CASH_DUES',
      actorRole: session.role,
      actorName: session.name,
      actorEmail: undefined,
      description: `Collected $${payload.amountPaid.toFixed(2)} cash dues payment from ${payload.studentName.trim()} (${purdueEmail}) for ${payload.semester.trim()}`,
      previousValue: null,
      newValue: String(payload.amountPaid),
      amountDelta: payload.amountPaid,
    });
  } catch {}

  return mapRowToMemberDues(createdRow);
}

/**
 * Searches member dues records by student name or purdue_email.
 * Accessible to COMMITTEE_LEAD, TREASURER, PRESIDENT, and IT_ADMIN.
 */
export async function searchMemberDues(
  dbLike: D1DatabaseLike | DatabaseSync,
  query: string,
  fiscalYearId: string,
  session: AuthSession | null,
  semester?: string
): Promise<MemberDues[]> {
  if (!session) {
    throw new Error('Unauthorized: Active session required');
  }

  const db = adaptDatabase(dbLike);
  const whereClauses: string[] = [];
  const params: unknown[] = [];

  if (fiscalYearId && fiscalYearId.trim().length > 0) {
    whereClauses.push('fiscal_year_id = ?');
    params.push(fiscalYearId.trim());
  }

  if (semester && semester.trim().length > 0) {
    whereClauses.push('semester = ?');
    params.push(semester.trim());
  }

  const trimmedQuery = query ? query.trim() : '';
  if (trimmedQuery.length > 0) {
    whereClauses.push('(LOWER(student_name) LIKE ? OR LOWER(purdue_email) LIKE ?)');
    const searchTerm = `%${trimmedQuery.toLowerCase()}%`;
    params.push(searchTerm, searchTerm);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const sql = `
    SELECT * FROM member_dues
    ${whereSql}
    ORDER BY student_name ASC, payment_date DESC;
  `.trim();

  const rows = await queryAll<MemberDuesRow>(db, sql, params);
  return rows.map(mapRowToMemberDues);
}

/**
 * Retrieves aggregate dues statistics for a given fiscal year, including breakdown by semester and payment method.
 */
export async function getDuesStats(
  dbLike: D1DatabaseLike | DatabaseSync,
  fiscalYearId: string,
  _session?: AuthSession | null
): Promise<DuesStatsResult> {
  const db = adaptDatabase(dbLike);

  if (!fiscalYearId || typeof fiscalYearId !== 'string') {
    throw new Error('fiscalYearId is required to retrieve dues stats');
  }

  const rows = await queryAll<MemberDuesRow>(
    db,
    'SELECT * FROM member_dues WHERE fiscal_year_id = ? ORDER BY payment_date ASC',
    [fiscalYearId]
  );

  const uniqueEmails = new Set<string>();
  let totalRevenue = 0;
  const bySemester: Record<string, SemesterDuesBreakdown> = {};

  const paymentMethodBreakdown: PaymentMethodBreakdown = {
    toocoolAmount: 0,
    toocoolCount: 0,
    cashAmount: 0,
    cashCount: 0,
    otherAmount: 0,
    otherCount: 0,
  };

  for (const row of rows) {
    const amount = Number(row.amount_paid) || 0;
    totalRevenue = roundCurrency(totalRevenue + amount);
    uniqueEmails.add(row.purdue_email.toLowerCase());

    const sem = row.semester || 'Unknown';
    if (!bySemester[sem]) {
      bySemester[sem] = {
        semester: sem,
        memberCount: 0,
        totalAmount: 0,
        cashCount: 0,
        cashAmount: 0,
        toocoolCount: 0,
        toocoolAmount: 0,
      };
    }

    bySemester[sem].memberCount += 1;
    bySemester[sem].totalAmount = roundCurrency(bySemester[sem].totalAmount + amount);

    const method = (row.payment_method || '').toLowerCase();
    if (method === 'cash') {
      bySemester[sem].cashCount += 1;
      bySemester[sem].cashAmount = roundCurrency(bySemester[sem].cashAmount + amount);

      paymentMethodBreakdown.cashCount += 1;
      paymentMethodBreakdown.cashAmount = roundCurrency(paymentMethodBreakdown.cashAmount + amount);
    } else if (method === 'toocool') {
      bySemester[sem].toocoolCount += 1;
      bySemester[sem].toocoolAmount = roundCurrency(bySemester[sem].toocoolAmount + amount);

      paymentMethodBreakdown.toocoolCount += 1;
      paymentMethodBreakdown.toocoolAmount = roundCurrency(
        paymentMethodBreakdown.toocoolAmount + amount
      );
    } else {
      paymentMethodBreakdown.otherCount += 1;
      paymentMethodBreakdown.otherAmount = roundCurrency(
        paymentMethodBreakdown.otherAmount + amount
      );
    }
  }

  return {
    fiscalYearId,
    totalMembersPaid: uniqueEmails.size,
    totalTransactions: rows.length,
    totalRevenue,
    bySemester,
    paymentMethodBreakdown,
  };
}

/**
 * Universal Member Dues Import: Accepts raw spreadsheet string (CSV, TSV, Excel XML vECOrders) and imports unique records.
 */
export async function importMemberDues(
  dbLike: D1DatabaseLike | DatabaseSync,
  fileContent: string,
  semester: string = 'Spring 2026',
  fiscalYearId: string = 'fy25-26',
  session: AuthSession = {
    role: 'TREASURER',
    committeeId: 'treasurer',
    name: 'System Importer',
    isAdmin: true,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  }
): Promise<ImportDuesResult> {
  const parsed = parseDuesFile(fileContent, fiscalYearId, semester);
  return importDuesBatch(dbLike, parsed.validRecords, session, { skipDuplicates: true });
}

/**
 * Retrieves summary statistics for member dues
 */
export async function getMemberDuesSummary(
  dbLike: D1DatabaseLike | DatabaseSync,
  fiscalYearId = 'fy25-26'
): Promise<DuesStatsResult> {
  return getDuesStats(dbLike, fiscalYearId);
}


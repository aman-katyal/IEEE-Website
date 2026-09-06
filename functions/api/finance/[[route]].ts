// BoilerBooks 3.0 Cloudflare Pages API Gateway
// File: functions/api/finance/[[route]].ts
//
// Security hardening: auth middleware, rate limiting, CORS restriction,
// file upload validation, security headers, sanitized error responses.

import { verifyPin } from '../../../src/server/auth/service';
import { authenticateRequest, createSessionCookie } from '../../../src/server/auth/middleware';
import { pinAuthLimiter } from '../../../src/server/auth/rateLimit';
import type { AuthSession } from '../../../src/server/auth/types';
import {
  createPurchaseRequest,
  getPurchaseRequest,
  listPurchaseRequests,
  updatePurchaseStatus,
} from '../../../src/server/purchase/service';
import {
  calculateCommitteeSpending,
  calculateCategoryBreakdown,
  updateCommitteeParameters,
  createCommittee,
  deleteCommittee,
  recordCommitteeFundingInflow,
} from '../../../src/server/matrix/spending';
import { importMemberDues, searchMemberDues, getMemberDuesSummary, recordCashPayment } from '../../../src/server/dues/service';
import { generateCOOLBatch } from '../../../src/server/cool/exporter';
import { listAuditEntries } from '../../../src/server/db/audit';
import { queryAll } from '../../../src/server/db/query';
import { toD1Database } from '../../../src/server/db/adapter';
import {
  validateReceiptFile,
  generateReceiptKey,
  getMimeType,
  ALLOWED_RECEIPT_EXTENSIONS,
} from '../../../src/server/storage/r2';

export interface PagesContext<Env = any> {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<any>) => void;
  next: () => Promise<Response>;
}

export type PagesFunctionHandler<Env = any> = (context: PagesContext<Env>) => Promise<Response> | Response;

interface Env {
  DB: any;
  RECEIPTS_BUCKET?: any;
  JWT_SECRET?: string;
}

// ---------------------------------------------------------------------------
// Trusted CORS origins
// ---------------------------------------------------------------------------
const TRUSTED_ORIGINS = [
  'https://purdueieee.org',
  'https://www.purdueieee.org',
  'https://purdue-ieee-website.pages.dev',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (TRUSTED_ORIGINS.includes(origin)) return true;
  // Allow localhost in development
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return true;
  return false;
}

function getCorsOrigin(request: Request): string {
  const origin = request.headers.get('Origin');
  return isAllowedOrigin(origin) ? origin! : TRUSTED_ORIGINS[0];
}

// ---------------------------------------------------------------------------
// Security response headers
// ---------------------------------------------------------------------------
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

function jsonResponse(data: unknown, status = 200, request?: Request, extraHeaders?: Record<string, string>) {
  const corsOrigin = request ? getCorsOrigin(request) : TRUSTED_ORIGINS[0];
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Vary': 'Origin',
      ...SECURITY_HEADERS,
      ...(extraHeaders || {}),
    },
  });
}

function errorResponse(message: string, status = 400, request?: Request) {
  return jsonResponse({ success: false, error: message }, status, request);
}

// ---------------------------------------------------------------------------
// Client IP extraction
// ---------------------------------------------------------------------------
function getClientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown';
}

// ---------------------------------------------------------------------------
// Auth helper: returns session or error Response
// ---------------------------------------------------------------------------
async function requireAuth(
  request: Request,
  env: Env,
  allowedRoles?: Array<'TREASURER' | 'COMMITTEE_LEAD' | 'PRESIDENT' | 'IT_ADMIN'>
): Promise<AuthSession | Response> {
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) {
    return errorResponse('Internal Server Error: Missing JWT Secret Configuration', 500, request);
  }
  const session = await authenticateRequest(request, jwtSecret);
  if (!session) {
    return errorResponse('Authentication required. Please provide a valid session token.', 401, request);
  }

  if (allowedRoles && !allowedRoles.includes(session.role as any)) {
    return errorResponse('Insufficient permissions for this operation.', 403, request);
  }

  return session;
}

function isResponse(value: AuthSession | Response): value is Response {
  return value instanceof Response;
}

// ---------------------------------------------------------------------------
// CORS Preflight
// ---------------------------------------------------------------------------
export const onRequestOptions: PagesFunctionHandler = async (context) => {
  const corsOrigin = getCorsOrigin(context.request);
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    },
  });
};

// ---------------------------------------------------------------------------
// Main request handler
// ---------------------------------------------------------------------------
export const onRequest: PagesFunctionHandler<Env> = async (context) => {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const pathParts = (params.route as string[]) || [];
  const route = pathParts.join('/');
  const db = env.DB;

  if (!db) {
    return errorResponse('Cloudflare D1 Database binding "DB" is not available.', 500, request);
  }

  try {
    // -------------------------------------------------------------
    // 1. Auth Endpoints: /api/finance/auth/verify-pin  (PUBLIC — rate-limited)
    // -------------------------------------------------------------
    if (route === 'auth/verify-pin' && request.method === 'POST') {
      const clientIp = getClientIp(request);

      // Rate limit check (#588)
      const rateCheck = pinAuthLimiter.check(clientIp);
      if (!rateCheck.allowed) {
        return errorResponse(
          `Too many authentication attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
          429,
          request
        );
      }

      // Apply exponential delay if approaching limit
      if (rateCheck.delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, rateCheck.delayMs));
      }

      const jwtSecret = env.JWT_SECRET;
      if (!jwtSecret) {
        return errorResponse('Internal Server Error: Missing JWT Secret Configuration', 500, request);
      }
      const body = (await request.json()) as { pin: string; role?: 'committee' | 'treasurer'; committeeId?: string };
      const auth = await verifyPin(db, body.pin, body.role || 'committee', body.committeeId, jwtSecret);

      if (!auth.authenticated || !auth.session) {
        pinAuthLimiter.recordFailure(clientIp);
        return errorResponse(auth.message || 'Invalid credentials', 401, request);
      }

      pinAuthLimiter.recordSuccess(clientIp);
      const extraHeaders: Record<string, string> = {};
      if (auth.session.token) {
        extraHeaders['Set-Cookie'] = createSessionCookie(auth.session.token);
      }
      return jsonResponse(
        { success: true, authenticated: true, session: auth.session },
        200,
        request,
        extraHeaders
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // All endpoints below require authentication
    // ═══════════════════════════════════════════════════════════════

    // -------------------------------------------------------------
    // 2. Spending Matrix: /api/finance/matrix (TREASURER or COMMITTEE_LEAD)
    // -------------------------------------------------------------
    if (route === 'matrix' && request.method === 'GET') {
      const authResult = await requireAuth(request, env);
      if (isResponse(authResult)) return authResult;

      const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
      const summary = await calculateCommitteeSpending(db, fiscalYearId);
      return jsonResponse({ success: true, summary, matrix: summary.committees }, 200, request);
    }

    // Category Breakdown: /api/finance/matrix/:committeeId
    if (pathParts[0] === 'matrix' && pathParts.length === 2 && request.method === 'GET') {
      const authResult = await requireAuth(request, env);
      if (isResponse(authResult)) return authResult;

      const committeeId = pathParts[1];
      const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
      const breakdown = await calculateCategoryBreakdown(db, fiscalYearId, committeeId);
      return jsonResponse({ success: true, breakdown }, 200, request);
    }

    // -------------------------------------------------------------
    // 3. Purchase Requests: /api/finance/purchases
    // -------------------------------------------------------------
    if (route === 'purchases') {
      if (request.method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (isResponse(authResult)) return authResult;
        const session = authResult;

        const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
        const committeeId = url.searchParams.get('committeeId') || undefined;
        const status = url.searchParams.get('status') as any;

        const requests = await listPurchaseRequests(
          db,
          { fiscalYearId, committeeId: committeeId as any, status },
          session
        );
        return jsonResponse({ success: true, requests }, 200, request);
      }

      if (request.method === 'POST') {
        const authResult = await requireAuth(request, env);
        if (isResponse(authResult)) return authResult;
        const session = authResult;

        const payload = await request.json();
        const result = await createPurchaseRequest(db, payload as any, session);
        return jsonResponse(result, 201, request);
      }
    }

    // Single Purchase Detail: GET /api/finance/purchases/:id
    if (pathParts[0] === 'purchases' && pathParts.length === 2 && request.method === 'GET') {
      const authResult = await requireAuth(request, env);
      if (isResponse(authResult)) return authResult;
      const session = authResult;

      const purchaseId = pathParts[1];
      const result = await getPurchaseRequest(db, purchaseId, session);
      if (!result) {
        return errorResponse(`Purchase request ${purchaseId} not found.`, 404, request);
      }
      return jsonResponse({ success: true, request: result }, 200, request);
    }

    // Single Purchase Status: PATCH /api/finance/purchases/:id/status (TREASURER only)
    if (pathParts[0] === 'purchases' && pathParts.length === 3 && pathParts[2] === 'status' && request.method === 'PATCH') {
      const authResult = await requireAuth(request, env, ['TREASURER']);
      if (isResponse(authResult)) return authResult;
      const session = authResult;

      const purchaseId = pathParts[1];
      const body = (await request.json()) as {
        status: 'PENDING' | 'APPROVED' | 'PURCHASED' | 'REIMBURSED' | 'REJECTED';
        treasurerNotes?: string;
        coolAccountNumber?: string;
        coolBatchId?: string;
      };

      const result = await updatePurchaseStatus(
        db,
        purchaseId,
        body.status,
        body.treasurerNotes,
        session,
        body.coolBatchId
      );
      return jsonResponse(result, 200, request);
    }

    // -------------------------------------------------------------
    // 4. Funding Inflows: /api/finance/inflows
    // -------------------------------------------------------------
    if (route === 'inflows') {
      if (request.method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (isResponse(authResult)) return authResult;

        const committeeId = url.searchParams.get('committeeId') || undefined;
        const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
        let query = 'SELECT * FROM committee_funding_inflows WHERE fiscal_year_id = ?';
        const params: unknown[] = [fiscalYearId];
        if (committeeId) {
          query += ' AND committee_id = ?';
          params.push(committeeId);
        }
        query += ' ORDER BY transaction_date DESC';
        const inflows = await queryAll(db, query, params);
        return jsonResponse({ success: true, inflows }, 200, request);
      }

      if (request.method === 'POST') {
        const authResult = await requireAuth(request, env, ['TREASURER']);
        if (isResponse(authResult)) return authResult;

        const payload = await request.json();
        const result = await recordCommitteeFundingInflow(db, payload as any);
        return jsonResponse(result, 201, request);
      }
    }

    // Delete Inflow: DELETE /api/finance/inflows/:id (TREASURER only)
    if (pathParts[0] === 'inflows' && pathParts.length === 2 && request.method === 'DELETE') {
      const authResult = await requireAuth(request, env, ['TREASURER']);
      if (isResponse(authResult)) return authResult;

      const inflowId = pathParts[1];
      const d1 = toD1Database(db);
      await d1.prepare('DELETE FROM committee_funding_inflows WHERE id = ?').bind(inflowId).run();
      return jsonResponse({ success: true, message: `Inflow ${inflowId} deleted successfully.` }, 200, request);
    }

    // -------------------------------------------------------------
    // 5. Committees: /api/finance/committees (TREASURER only for mutations, authenticated for list)
    // -------------------------------------------------------------
    if (route === 'committees') {
      if (request.method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (isResponse(authResult)) return authResult;

        const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
        const rows = await queryAll<any>(
          db,
          `SELECT 
            fc.id,
            fc.name,
            fc.bank_status,
            fc.dues_status,
            fc.contact_email,
            COALESCE(cb.allocated_amount, 0.0) AS allocated,
            cb.notes
          FROM finance_committees fc
          LEFT JOIN committee_budgets cb ON fc.id = cb.committee_id AND cb.fiscal_year_id = ?
          ORDER BY fc.name ASC`,
          [fiscalYearId]
        );

        // Fetch categories for all committees
        const categoriesRows = await queryAll<any>(
          db,
          `SELECT committee_id, name FROM budget_categories ORDER BY name ASC`
        );
        const categoriesByCommittee = new Map<string, string[]>();
        for (const cat of categoriesRows) {
          const list = categoriesByCommittee.get(cat.committee_id) || [];
          list.push(cat.name);
          categoriesByCommittee.set(cat.committee_id, list);
        }

        const committees = rows.map((r) => ({
          id: r.id,
          name: r.name,
          shortName: r.name,
          allocated: Number(r.allocated) || 0,
          bankStatus: r.bank_status || 'Active',
          duesStatus: r.dues_status || 'Active',
          contactEmail: r.contact_email || `${r.id}@purdueieee.org`,
          notes: r.notes || '',
          categories: categoriesByCommittee.get(r.id) || ['General', 'Hardware'],
        }));

        return jsonResponse({ success: true, committees }, 200, request);
      }

      if (request.method === 'POST') {
        const authResult = await requireAuth(request, env, ['TREASURER']);
        if (isResponse(authResult)) return authResult;

        const body = await request.json();
        const result = await createCommittee(db, body as any);
        return jsonResponse(result, 201, request);
      }
    }

    // Committee Parameter / Name Update: PATCH /api/finance/committees/:id/parameters or PATCH /api/finance/committees/:id
    if (
      (pathParts[0] === 'committees' && pathParts.length === 3 && pathParts[2] === 'parameters' && request.method === 'PATCH') ||
      (pathParts[0] === 'committees' && pathParts.length === 2 && request.method === 'PATCH')
    ) {
      const authResult = await requireAuth(request, env, ['TREASURER']);
      if (isResponse(authResult)) return authResult;

      const committeeId = pathParts[1];
      const body = await request.json();
      const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
      const result = await updateCommitteeParameters(db, fiscalYearId, committeeId, body as any);
      return jsonResponse(result, 200, request);
    }

    // Delete Committee: DELETE /api/finance/committees/:id (TREASURER only)
    if (pathParts[0] === 'committees' && pathParts.length === 2 && request.method === 'DELETE') {
      const authResult = await requireAuth(request, env, ['TREASURER']);
      if (isResponse(authResult)) return authResult;

      const committeeId = pathParts[1];
      const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
      const result = await deleteCommittee(db, committeeId, fiscalYearId);
      return jsonResponse(result, 200, request);
    }

    // -------------------------------------------------------------
    // Reset / Purge All Data: POST /api/finance/reset (TREASURER only)
    // -------------------------------------------------------------
    if (route === 'reset' && request.method === 'POST') {
      const authResult = await requireAuth(request, env, ['TREASURER']);
      if (isResponse(authResult)) return authResult;

      const d1 = toD1Database(db);
      await d1.prepare('DELETE FROM purchase_requests').run();
      await d1.prepare('DELETE FROM member_dues').run();
      await d1.prepare('DELETE FROM committee_funding_inflows').run();
      await d1.prepare('DELETE FROM financial_audit_ledger').run();
      try { await d1.prepare('DELETE FROM budget_audit_logs').run(); } catch {}

      return jsonResponse({ success: true, message: 'All financial data and audit logs successfully cleared.' }, 200, request);
    }

    // -------------------------------------------------------------
    // 6. Member Dues Engine: /api/finance/dues
    // -------------------------------------------------------------
    if (route === 'dues') {
      if (request.method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (isResponse(authResult)) return authResult;
        const session = authResult;

        const query = url.searchParams.get('q') || '';
        const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
        if (query) {
          const dues = await searchMemberDues(db, query, fiscalYearId, session);
          return jsonResponse({ success: true, dues }, 200, request);
        }
        const dues = await queryAll(db, 'SELECT * FROM member_dues WHERE fiscal_year_id = ? ORDER BY student_name ASC', [
          fiscalYearId,
        ]);
        const summary = await getMemberDuesSummary(db, fiscalYearId);
        return jsonResponse({ success: true, dues, summary }, 200, request);
      }

      if (request.method === 'POST') {
        const authResult = await requireAuth(request, env, ['TREASURER']);
        if (isResponse(authResult)) return authResult;

        const payload = (await request.json()) as { csvData: string; semester: string; fiscalYearId?: string };
        const result = await importMemberDues(db, payload.csvData, payload.semester || 'Spring 2026', payload.fiscalYearId || 'fy25-26');
        return jsonResponse(result, 200, request);
      }
    }

    // Cash Payment Recording: POST /api/finance/dues/cash (TREASURER only)
    if (route === 'dues/cash' && request.method === 'POST') {
      const authResult = await requireAuth(request, env, ['TREASURER']);
      if (isResponse(authResult)) return authResult;
      const session = authResult;

      const payload = await request.json();
      const result = await recordCashPayment(db, payload as any, session);
      return jsonResponse(result, 201, request);
    }

    // -------------------------------------------------------------
    // 7. Receipts Storage (R2): /api/finance/receipts — secured upload & download
    // -------------------------------------------------------------
    if (route === 'receipts/upload' && request.method === 'POST') {
      const authResult = await requireAuth(request, env);
      if (isResponse(authResult)) return authResult;

      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const committeeId = (formData.get('committeeId') as string) || 'general';
      const fiscalYearId = (formData.get('fiscalYearId') as string) || 'fy25-26';

      if (!file) {
        return errorResponse('No receipt file provided in form data.', 400, request);
      }

      // Validate file using existing r2.ts utilities (#586)
      const validation = validateReceiptFile({
        filename: file.name,
        size: file.size,
        contentType: file.type || undefined,
      });
      if (!validation.valid) {
        return errorResponse(
          validation.error || `Invalid receipt file. Allowed types: ${ALLOWED_RECEIPT_EXTENSIONS.join(', ')}`,
          400,
          request
        );
      }

      // Generate a safe, canonical storage key
      const key = generateReceiptKey(fiscalYearId, committeeId, file.name);
      const contentType = getMimeType(file.name) || file.type || 'application/octet-stream';

      if (env.RECEIPTS_BUCKET) {
        const fileBuffer = await file.arrayBuffer();
        await env.RECEIPTS_BUCKET.put(key, fileBuffer, {
          httpMetadata: {
            contentType,
          },
          customMetadata: {
            originalName: file.name,
            uploadedAt: new Date().toISOString(),
            committeeId,
            fiscalYearId,
          },
        });
      }

      return jsonResponse({
        success: true,
        key,
        name: file.name,
        size: file.size,
        type: contentType,
        url: `/api/finance/receipts/${encodeURIComponent(key)}`,
      }, 200, request);
    }

    // View Receipt: GET /api/finance/receipts/:key
    if (pathParts[0] === 'receipts' && pathParts.length >= 2 && request.method === 'GET') {
      const authResult = await requireAuth(request, env);
      if (isResponse(authResult)) return authResult;

      const key = pathParts.slice(1).join('/');
      if (!env.RECEIPTS_BUCKET) {
        return errorResponse('R2 bucket binding RECEIPTS_BUCKET is not configured.', 503, request);
      }
      const object = await env.RECEIPTS_BUCKET.get(key);
      if (!object) {
        return errorResponse(`Receipt "${key}" not found.`, 404, request);
      }

      const corsOrigin = getCorsOrigin(request);
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      // Security headers for served files (#586)
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('Content-Disposition', `attachment; filename="receipt"`);
      headers.set('Content-Security-Policy', "default-src 'none'");
      headers.set('Access-Control-Allow-Origin', corsOrigin);
      headers.set('Vary', 'Origin');
      return new Response(object.body, { headers });
    }

    // -------------------------------------------------------------
    // 8. COOL TSV Exporter: /api/finance/export/cool (TREASURER only)
    // -------------------------------------------------------------
    if (route === 'export/cool' && request.method === 'GET') {
      const authResult = await requireAuth(request, env, ['TREASURER']);
      if (isResponse(authResult)) return authResult;

      const corsOrigin = getCorsOrigin(request);
      const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
      const exportResult = await generateCOOLBatch(db, fiscalYearId);
      return new Response(exportResult.tabDelimited, {
        headers: {
          'Content-Type': 'text/tab-separated-values; charset=utf-8',
          'Content-Disposition': `attachment; filename="cool_batch_${fiscalYearId}.tsv"`,
          'Access-Control-Allow-Origin': corsOrigin,
          'Vary': 'Origin',
          ...SECURITY_HEADERS,
        },
      });
    }

    // -------------------------------------------------------------
    // 9. Banking Audit Ledger: /api/finance/audit-logs
    // -------------------------------------------------------------
    if (route === 'audit-logs' && request.method === 'GET') {
      const authResult = await requireAuth(request, env);
      if (isResponse(authResult)) return authResult;
      const session = authResult;

      const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
      const committeeId = url.searchParams.get('committeeId') || undefined;

      const entries = await listAuditEntries(
        db,
        { fiscalYearId, committeeId },
        session
      );
      return jsonResponse({ success: true, entries }, 200, request);
    }

    // -------------------------------------------------------------
    // 10. BOSO Account Statements: /api/finance/statements
    // -------------------------------------------------------------
    if (route === 'statements' && request.method === 'GET') {
      const authResult = await requireAuth(request, env);
      if (isResponse(authResult)) return authResult;

      const statements = await queryAll(db, 'SELECT * FROM boso_account_statements ORDER BY soa_number ASC');
      return jsonResponse({ success: true, statements }, 200, request);
    }

    if (pathParts[0] === 'statements' && pathParts.length === 2 && request.method === 'GET') {
      const authResult = await requireAuth(request, env);
      if (isResponse(authResult)) return authResult;

      const soaNumber = pathParts[1];
      const rows = await queryAll(db, 'SELECT * FROM boso_account_statements WHERE soa_number = ?', [soaNumber]);
      if (rows.length === 0) {
        return errorResponse(`BOSO Statement SOA #${soaNumber} not found.`, 404, request);
      }
      const statement = rows[0] as any;
      const items = await queryAll(
        db,
        'SELECT * FROM boso_statement_items WHERE soa_number = ? ORDER BY transaction_date ASC',
        [soaNumber]
      );

      const formatItem = (row: any) => ({
        id: row.id,
        type: row.item_type,
        date: row.transaction_date,
        docOrCheckNumber: row.doc_or_check_number,
        refCode: row.ref_code,
        refNumber: row.ref_number || undefined,
        amount: Number(row.amount),
        clearedDate: row.cleared_date,
        expenseOrIncomeCode: row.expense_or_income_code,
        payeeOrVendor: row.payee_or_vendor || undefined,
      });

      return jsonResponse({
        success: true,
        statement: {
          accountName: statement.account_name,
          soaNumber: statement.soa_number,
          statementPeriod: statement.statement_period,
          organization: statement.organization,
          department: statement.department,
          officeLocation: statement.office_location,
          phone: statement.phone,
          fax: statement.fax,
          website: statement.website,
          beginningBalance: Number(statement.beginning_balance),
          totalPayments: Number(statement.total_payments),
          totalCredits: Number(statement.total_credits),
          totalDebits: Number(statement.total_debits),
          totalTransfersOut: Number(statement.total_transfers_out),
          endingBalance: Number(statement.ending_balance),
          payments: items.filter((i: any) => i.item_type === 'PAYMENT').map(formatItem),
          credits: items.filter((i: any) => i.item_type === 'CREDIT').map(formatItem),
          debits: items.filter((i: any) => i.item_type === 'DEBIT').map(formatItem),
          transfersOut: items.filter((i: any) => i.item_type === 'TRANSFER_OUT').map(formatItem),
        },
      }, 200, request);
    }

    return errorResponse(`Route "/api/finance/${route}" not found.`, 404, request);
  } catch (err) {
    const errorMsg = err instanceof Error ? `${err.message} \nStack: ${err.stack}` : String(err);
    console.error('[BoilerBooks API Error]', errorMsg);
    return errorResponse(`BoilerBooks Fatal Error: ${errorMsg}`, 500, request);
  }
};

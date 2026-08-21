// BoilerBooks 3.0 Cloudflare Pages API Gateway
// File: functions/api/finance/[[route]].ts

import { verifyPin } from '../../../src/server/auth/service';
import {
  createPurchaseRequest,
  getPurchaseRequest,
  listPurchaseRequests,
  updatePurchaseRequestStatus,
  markPurchaseRequestReimbursed,
} from '../../../src/server/purchase/service';
import {
  calculateCommitteeSpending,
  calculateCategoryBreakdown,
  updateCommitteeParameters,
  recordCommitteeFundingInflow,
} from '../../../src/server/matrix/spending';
import { importMemberDues, searchMemberDues, getMemberDuesSummary } from '../../../src/server/dues/service';
import { generateCoolBatchExport } from '../../../src/server/cool/exporter';
import { queryAll } from '../../../src/server/db/query';
import { toD1Database } from '../../../src/server/db/adapter';

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
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ success: false, error: message }, status);
}

export const onRequestOptions: PagesFunctionHandler = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

export const onRequest: PagesFunctionHandler<Env> = async (context) => {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const pathParts = (params.route as string[]) || [];
  const route = pathParts.join('/');
  const db = env.DB;

  if (!db) {
    return errorResponse('Cloudflare D1 Database binding "DB" is not available.', 500);
  }

  try {
    // -------------------------------------------------------------
    // 1. Auth Endpoints: /api/finance/auth/verify-pin
    // -------------------------------------------------------------
    if (route === 'auth/verify-pin' && request.method === 'POST') {
      const body = (await request.json()) as { pin: string; role?: 'committee' | 'treasurer'; committeeId?: string };
      const auth = await verifyPin(db, body.pin, body.role || 'committee', body.committeeId);
      if (!auth.authenticated || !auth.session) {
        return errorResponse(auth.message, 401);
      }
      return jsonResponse({ success: true, session: auth.session });
    }

    // -------------------------------------------------------------
    // 2. Spending Matrix: /api/finance/matrix
    // -------------------------------------------------------------
    if (route === 'matrix' && request.method === 'GET') {
      const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
      const summary = await calculateCommitteeSpending(db, fiscalYearId);
      return jsonResponse({ success: true, summary, matrix: summary.committees });
    }

    // Category Breakdown: /api/finance/matrix/:committeeId
    if (pathParts[0] === 'matrix' && pathParts.length === 2 && request.method === 'GET') {
      const committeeId = pathParts[1];
      const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
      const breakdown = await calculateCategoryBreakdown(db, fiscalYearId, committeeId);
      return jsonResponse({ success: true, breakdown });
    }

    // -------------------------------------------------------------
    // 3. Purchase Requests: /api/finance/purchases
    // -------------------------------------------------------------
    if (route === 'purchases') {
      if (request.method === 'GET') {
        const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
        const committeeId = url.searchParams.get('committeeId') || undefined;
        const status = url.searchParams.get('status') as any;

        const requests = await listPurchaseRequests(db, {
          fiscalYearId,
          committeeId: committeeId as any,
          status,
        });
        return jsonResponse({ success: true, requests });
      }

      if (request.method === 'POST') {
        const payload = await request.json();
        const result = await createPurchaseRequest(db, payload as any);
        return jsonResponse(result, 201);
      }
    }

    // Single Purchase Detail: GET /api/finance/purchases/:id
    if (pathParts[0] === 'purchases' && pathParts.length === 2 && request.method === 'GET') {
      const purchaseId = pathParts[1];
      const result = await getPurchaseRequest(db, purchaseId);
      if (!result) {
        return errorResponse(`Purchase request ${purchaseId} not found.`, 404);
      }
      return jsonResponse({ success: true, request: result });
    }

    // Single Purchase Status: PATCH /api/finance/purchases/:id/status
    if (pathParts[0] === 'purchases' && pathParts.length === 3 && pathParts[2] === 'status' && request.method === 'PATCH') {
      const purchaseId = pathParts[1];
      const body = (await request.json()) as {
        status: 'APPROVED' | 'REJECTED' | 'REIMBURSED';
        treasurerNotes?: string;
        coolAccountNumber?: string;
        coolBatchId?: string;
      };

      if (body.status === 'REIMBURSED') {
        const result = await markPurchaseRequestReimbursed(db, purchaseId, body.coolBatchId);
        return jsonResponse(result);
      }

      const result = await updatePurchaseRequestStatus(
        db,
        purchaseId,
        body.status,
        body.treasurerNotes,
        body.coolAccountNumber
      );
      return jsonResponse(result);
    }

    // -------------------------------------------------------------
    // 4. Funding Inflows: /api/finance/inflows
    // -------------------------------------------------------------
    if (route === 'inflows') {
      if (request.method === 'GET') {
        const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
        const committeeId = url.searchParams.get('committeeId');
        let sql = 'SELECT * FROM committee_funding_inflows WHERE fiscal_year_id = ?';
        const bindings: unknown[] = [fiscalYearId];
        if (committeeId) {
          sql += ' AND committee_id = ?';
          bindings.push(committeeId);
        }
        sql += ' ORDER BY received_date DESC';
        const rows = await queryAll(db, sql, bindings);
        return jsonResponse({ success: true, inflows: rows });
      }

      if (request.method === 'POST') {
        const payload = (await request.json()) as any;
        const result = await recordCommitteeFundingInflow(db, payload);
        return jsonResponse(result, 201);
      }
    }

    // Delete Inflow: DELETE /api/finance/inflows/:id
    if (pathParts[0] === 'inflows' && pathParts.length === 2 && request.method === 'DELETE') {
      const inflowId = pathParts[1];
      const d1 = toD1Database(db);
      await d1.prepare('DELETE FROM committee_funding_inflows WHERE id = ?').bind(inflowId).run();
      return jsonResponse({ success: true, message: `Inflow ${inflowId} deleted successfully.` });
    }

    // -------------------------------------------------------------
    // 5. Member Dues: /api/finance/dues
    // -------------------------------------------------------------
    if (route === 'dues') {
      if (request.method === 'GET') {
        const query = url.searchParams.get('q') || '';
        const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
        if (query) {
          const dues = await searchMemberDues(db, query, fiscalYearId);
          return jsonResponse({ success: true, dues });
        }
        const dues = await queryAll(db, 'SELECT * FROM member_dues WHERE fiscal_year_id = ? ORDER BY student_name ASC', [
          fiscalYearId,
        ]);
        const summary = await getMemberDuesSummary(db, fiscalYearId);
        return jsonResponse({ success: true, dues, summary });
      }

      if (request.method === 'POST') {
        const payload = (await request.json()) as { csvData: string; semester: string; fiscalYearId?: string };
        const result = await importMemberDues(db, payload.csvData, payload.semester, payload.fiscalYearId || 'fy25-26');
        return jsonResponse(result);
      }
    }

    // -------------------------------------------------------------
    // 6. Committee Parameters: PATCH /api/finance/committees/:id/parameters
    // -------------------------------------------------------------
    if (pathParts[0] === 'committees' && pathParts.length === 3 && pathParts[2] === 'parameters' && request.method === 'PATCH') {
      const committeeId = pathParts[1];
      const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
      const body = await request.json();
      const result = await updateCommitteeParameters(db, fiscalYearId, committeeId, body as any);
      return jsonResponse(result);
    }

    // -------------------------------------------------------------
    // 7. Receipts Storage (R2): /api/finance/receipts
    // -------------------------------------------------------------
    if (route === 'receipts/upload' && request.method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const committeeId = (formData.get('committeeId') as string) || 'general';
      const fiscalYearId = (formData.get('fiscalYearId') as string) || 'fy25-26';

      if (!file) {
        return errorResponse('No receipt file provided in form data.', 400);
      }

      const fileExt = file.name.split('.').pop() || 'png';
      const key = `receipts/${fiscalYearId}/${committeeId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      if (env.RECEIPTS_BUCKET) {
        const fileBuffer = await file.arrayBuffer();
        await env.RECEIPTS_BUCKET.put(key, fileBuffer, {
          httpMetadata: {
            contentType: file.type || 'application/octet-stream',
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
        type: file.type,
        url: `/api/finance/receipts/${encodeURIComponent(key)}`,
      });
    }

    // View Receipt: GET /api/finance/receipts/:key
    if (pathParts[0] === 'receipts' && pathParts.length >= 2 && request.method === 'GET') {
      const key = pathParts.slice(1).join('/');
      if (!env.RECEIPTS_BUCKET) {
        return errorResponse('R2 bucket binding RECEIPTS_BUCKET is not configured.', 503);
      }
      const object = await env.RECEIPTS_BUCKET.get(key);
      if (!object) {
        return errorResponse(`Receipt "${key}" not found.`, 404);
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      return new Response(object.body, { headers });
    }

    // -------------------------------------------------------------
    // 8. COOL TSV Exporter: /api/finance/export/cool
    // -------------------------------------------------------------
    if (route === 'export/cool' && request.method === 'GET') {
      const fiscalYearId = url.searchParams.get('fiscalYearId') || 'fy25-26';
      const batchId = url.searchParams.get('batchId') || `COOL-BATCH-${Date.now()}`;
      const exportResult = await generateCoolBatchExport(db, fiscalYearId, batchId);
      return new Response(exportResult.tsvContent, {
        headers: {
          'Content-Type': 'text/tab-separated-values; charset=utf-8',
          'Content-Disposition': `attachment; filename="${exportResult.filename}"`,
        },
      });
    }

    return errorResponse(`Route "/api/finance/${route}" not found.`, 404);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return errorResponse(errorMsg, 500);
  }
};

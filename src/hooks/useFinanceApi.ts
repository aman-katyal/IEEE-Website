/**
 * BoilerBooks 3.0 Real-time Finance API React Hook
 * Interfaces with Cloudflare Pages API gateway (/api/finance/*) with optimistic local fallback.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  REAL_COMMITTEES,
  type AuthSessionData,
  type PurchaseItem,
  type MemberDuesRecord,
  type CommitteeFundingInflow,
  type CommitteeInfo,
  type PurchaseStatus,
  type InflowSourceType,
  type BosoAccountStatement,
  type FinancialAuditLedgerEntry,
  OFFICIAL_BOSO_STATEMENT_SFAB_2026,
} from '../app/components/finance/financeData';

const API_BASE = '/api/finance';

/** Returns Authorization headers if a session token is available */
function getAuthHeaders(): Record<string, string> {
  try {
    const token = localStorage.getItem('boilerbooks_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch {}
  return {};
}

export interface UseFinanceApiState {
  session: AuthSessionData | null;
  purchases: PurchaseItem[];
  memberDues: MemberDuesRecord[];
  committees: CommitteeInfo[];
  fundingInflows: CommitteeFundingInflow[];
  auditLogs: FinancialAuditLedgerEntry[];
  bosoStatement: BosoAccountStatement;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
}

export function useFinanceApi() {
  const [session, setSession] = useState<AuthSessionData | null>(() => {
    try {
      const stored = localStorage.getItem('boilerbooks_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [auditLogs, setAuditLogs] = useState<FinancialAuditLedgerEntry[]>([]);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [memberDues, setMemberDues] = useState<MemberDuesRecord[]>([]);
  const [committees, setCommittees] = useState<CommitteeInfo[]>(REAL_COMMITTEES);
  const [fundingInflows, setFundingInflows] = useState<CommitteeFundingInflow[]>([]);
  const [bosoStatement, setBosoStatement] = useState<BosoAccountStatement>(OFFICIAL_BOSO_STATEMENT_SFAB_2026);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync session authentication to localStorage
  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem('boilerbooks_session', JSON.stringify(session));
      } else {
        localStorage.removeItem('boilerbooks_session');
      }
    } catch {}
  }, [session]);

  // Fetch initial data from Cloudflare API if available
  const refreshData = useCallback(async (fiscalYearId = 'fy25-26') => {
    setIsSyncing(true);
    const authH = getAuthHeaders();
    try {
      // 1. Fetch Spending Matrix
      const matrixRes = await fetch(`${API_BASE}/matrix?fiscalYearId=${fiscalYearId}`, { headers: authH });
      if (matrixRes.ok) {
        const matrixData = await matrixRes.json();
        if (matrixData.matrix && Array.isArray(matrixData.matrix)) {
          setCommittees((prev) =>
            prev.map((c) => {
              const remoteRow = matrixData.matrix.find((r: any) => r.committeeId === c.id);
              if (remoteRow) {
                return {
                  ...c,
                  allocated: remoteRow.allocatedAmount,
                };
              }
              return c;
            })
          );
        }
      }

      // 2. Fetch Purchases
      const purchasesRes = await fetch(`${API_BASE}/purchases?fiscalYearId=${fiscalYearId}`, { headers: authH });
      if (purchasesRes.ok) {
        const purchasesData = await purchasesRes.json();
        if (purchasesData.requests && Array.isArray(purchasesData.requests)) {
          const mapped: PurchaseItem[] = purchasesData.requests.map((r: any) => ({
            id: r.id,
            committeeId: r.committee_id || r.committeeId,
            committeeName: r.committee_name || r.committeeName || r.committee_id,
            requesterName: r.requester_name || r.requesterName,
            requesterEmail: r.requester_email || r.requesterEmail,
            purdueUsername: r.purdue_username || r.purdueUsername || '',
            streetAddress: r.street_address || r.streetAddress || '',
            phoneNumber: r.phone_number || r.phoneNumber || '',
            disbursementMethod: r.disbursement_method || r.disbursementMethod || 'BOSO_PICKUP',
            vendorName: r.vendor_name || r.vendorName,
            totalAmount: Number(r.total_amount || r.totalAmount || 0),
            description: r.description,
            categoryName: r.category_name || r.categoryName || 'General',
            fundingSource: (r.funding_source || r.fundingSource || 'GENERAL') as 'GENERAL' | 'SFAB',
            sfabLineItem: r.sfab_line_item || r.sfabLineItem,
            status: r.status as PurchaseStatus,
            receiptUrl: r.receipt_r2_key ? `/api/finance/receipts/${r.receipt_r2_key}` : undefined,
            submittedAt: r.submitted_at || r.submittedAt || new Date().toISOString(),
            approvedAt: r.approved_at || r.approvedAt,
            reimbursedAt: r.reimbursed_at || r.reimbursedAt,
            treasurerNotes: r.treasurer_notes || r.treasurerNotes,
          }));
          setPurchases(mapped);
        }
      }

      // 3. Fetch Funding Inflows
      const inflowsRes = await fetch(`${API_BASE}/inflows?fiscalYearId=${fiscalYearId}`, { headers: authH });
      if (inflowsRes.ok) {
        const inflowsData = await inflowsRes.json();
        if (inflowsData.inflows && Array.isArray(inflowsData.inflows)) {
          const mappedInflows: CommitteeFundingInflow[] = inflowsData.inflows.map((i: any) => ({
            id: i.id,
            committeeId: i.committee_id || i.committeeId,
            committeeName: i.committee_name || i.committeeName,
            sourceType: (i.source_type || 'Other') as InflowSourceType,
            title: i.title,
            amount: Number(i.amount || 0),
            referenceNumber: i.reference_number || i.referenceNumber,
            receivedDate: i.received_date || i.receivedDate || new Date().toISOString().split('T')[0],
            notes: i.notes,
            createdAt: i.created_at,
          }));
          setFundingInflows(mappedInflows);
        }
      }

      // 4. Fetch Dues
      const duesRes = await fetch(`${API_BASE}/dues?fiscalYearId=${fiscalYearId}`, { headers: authH });
      if (duesRes.ok) {
        const duesData = await duesRes.json();
        if (duesData.dues && Array.isArray(duesData.dues)) {
          const mappedDues: MemberDuesRecord[] = duesData.dues.map((d: any) => ({
            id: d.id,
            studentName: d.student_name || d.studentName,
            purdueEmail: d.purdue_email || d.purdueEmail,
            amountPaid: Number(d.amount || d.amountPaid || 0),
            semester: d.semester || 'Spring 2026',
            status: (d.status === 'Inactive' ? 'Inactive' : 'Active') as 'Active' | 'Inactive',
            paymentMethod: (d.payment_method || d.paymentMethod || 'TooCOOL') as 'TooCOOL' | 'Cash' | 'Card',
            paymentDate: d.payment_date || d.paymentDate || new Date().toISOString().split('T')[0],
          }));
          setMemberDues(mappedDues);
        }
      }

      // 5. Fetch BOSO Statement
      const statementRes = await fetch(`${API_BASE}/statements/04612`, { headers: authH });
      if (statementRes.ok) {
        const statementData = await statementRes.json();
        if (statementData.statement) {
          setBosoStatement(statementData.statement);
        }
      }

      // 6. Fetch Banking Audit Ledger
      const logsRes = await fetch(`${API_BASE}/audit-logs?fiscalYearId=${fiscalYearId}`, { headers: authH });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (logsData.entries && Array.isArray(logsData.entries)) {
          setAuditLogs(logsData.entries);
        }
      } else if (logsRes.status !== 401) {
        const errJson = await logsRes.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || `Audit ledger sync failed: HTTP ${logsRes.status}`);
      }
    } catch (err: any) {
      console.error('[BoilerBooks FATAL ERROR]', err);
      setError(err?.message || 'Failed to sync finance data from server.');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const loginWithPin = async (
    pin: string,
    role: 'COMMITTEE_LEAD' | 'TREASURER',
    committeeId?: string
  ): Promise<{ success: boolean; session?: AuthSessionData; message?: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pin.trim(),
          role: role === 'TREASURER' ? 'treasurer' : 'committee',
          committeeId,
        }),
      });

      const data = await res.json().catch(() => ({}));
      setIsLoading(false);

      if (res.ok && (data.authenticated || data.success) && data.session) {
        const newSession: AuthSessionData = {
          role: data.session.role,
          committeeId: data.session.committeeId,
          committeeName: data.session.committeeName,
          name: data.session.name,
          email: data.session.email,
        };
        setSession(newSession);
        // Store JWT token for authenticated API requests
        if (data.session.token) {
          try { localStorage.setItem('boilerbooks_token', data.session.token); } catch {}
        }
        return { success: true, session: newSession };
      }

      const msg = data.message || 'Invalid authentication PIN. Please verify your passcode.';
      setError(msg);
      return { success: false, message: msg };
    } catch {
      setIsLoading(false);
      const msg = 'Unable to connect to database server. Please check your network connection.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setSession(null);
    try { localStorage.removeItem('boilerbooks_token'); } catch {}
  };

  // Add Purchase with rollback on server failure
  const addPurchase = async (newPurchase: PurchaseItem): Promise<{ success: boolean; error?: string }> => {
    const prevPurchases = purchases;
    setPurchases((prev) => [newPurchase, ...prev]);

    try {
      const res = await fetch(`${API_BASE}/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          id: newPurchase.id,
          fiscalYearId: 'fy25-26',
          committeeId: newPurchase.committeeId,
          fundingSource: newPurchase.fundingSource || 'GENERAL',
          accountType: newPurchase.fundingSource || 'GENERAL',
          sfabLineItem: newPurchase.sfabLineItem,
          requesterName: newPurchase.requesterName,
          payeeName: newPurchase.requesterName,
          requesterEmail: newPurchase.requesterEmail,
          purdueUsername: newPurchase.purdueUsername,
          streetAddress: newPurchase.streetAddress,
          payeeAddress: newPurchase.streetAddress,
          phoneNumber: newPurchase.phoneNumber,
          payeePhone: newPurchase.phoneNumber,
          disbursementMethod: newPurchase.disbursementMethod || 'BOSO_PICKUP',
          paymentPreference: newPurchase.disbursementMethod === 'MAIL_ADDRESS' ? 'CHECK' : 'DIRECT_DEPOSIT',
          category: newPurchase.category,
          totalAmount: newPurchase.totalAmount,
          description: newPurchase.description,
          itemDescription: newPurchase.description,
          businessPurpose: newPurchase.description,
          vendorName: newPurchase.vendorName,
          receiptFilename: newPurchase.receiptFilename || 'receipt.pdf',
          receiptUrl: newPurchase.receiptUrl,
          receiptUrls: newPurchase.receiptUrl ? [newPurchase.receiptUrl] : [],
        }),
      });

      if (!res.ok && res.status >= 400 && res.status !== 404) {
        const errorData = await res.json().catch(() => ({}));
        setPurchases(prevPurchases);
        const err = errorData.error
          ? `${errorData.error} (HTTP ${res.status})`
          : `Failed to create purchase request (HTTP ${res.status})`;
        setError(err);
        return { success: false, error: err };
      }
      return { success: true };
    } catch {
      // Offline fallback: keep optimistic local state
      return { success: true };
    }
  };

  // Update Purchase Status with rollback on server failure
  const updatePurchaseStatus = async (
    id: string,
    status: PurchaseStatus,
    notes?: string,
    coolAccountNumber?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const prevPurchases = purchases;
    setPurchases((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status,
          treasurerNotes: notes !== undefined ? notes : item.treasurerNotes,
          coolAccountNumber: coolAccountNumber !== undefined ? coolAccountNumber : item.coolAccountNumber,
          approvedAt: status === 'APPROVED' ? new Date().toISOString() : item.approvedAt,
          reimbursedAt: status === 'REIMBURSED' ? new Date().toISOString() : item.reimbursedAt,
        };
      })
    );

    try {
      const res = await fetch(`${API_BASE}/purchases/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          status,
          treasurerNotes: notes,
          coolAccountNumber,
        }),
      });

      if (!res.ok && res.status >= 400 && res.status !== 404) {
        setPurchases(prevPurchases);
        const err = `Failed to update status (HTTP ${res.status})`;
        setError(err);
        return { success: false, error: err };
      }
      return { success: true };
    } catch {
      return { success: true };
    }
  };

  // Record In-Person Cash Member Dues
  const recordCashDues = async (record: {
    studentName: string;
    purdueEmail: string;
    amountPaid: number;
    semester?: string;
    committeeId?: string;
    paymentDate?: string;
  }): Promise<{ success: boolean; error?: string; dues?: MemberDuesRecord }> => {
    const semester = record.semester || 'Spring 2026';
    const newRecord: MemberDuesRecord = {
      id: `dues-cash-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentName: record.studentName.trim(),
      purdueEmail: record.purdueEmail.trim().toLowerCase(),
      amountPaid: record.amountPaid,
      paymentMethod: 'Cash',
      paymentDate: record.paymentDate || new Date().toISOString().split('T')[0],
      semester,
      fiscalYear: '2025-2026',
      status: 'Active',
    };

    setMemberDues((prev) => [newRecord, ...prev]);

    try {
      const res = await fetch(`${API_BASE}/dues/cash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          ...record,
          fiscalYearId: 'fy25-26',
          semester,
        }),
      });

      if (!res.ok && res.status >= 400 && res.status !== 404) {
        return { success: false, error: `Failed to record cash payment (HTTP ${res.status})` };
      }
      const data = await res.json();
      return { success: true, dues: data.dues || newRecord };
    } catch {
      return { success: true, dues: newRecord };
    }
  };

  // Import Member Dues with automatic duplicate disregard
  const importMemberDues = async (records: MemberDuesRecord[], fileRaw?: string, semester = 'Spring 2026') => {
    setMemberDues((prev) => {
      const existingKeys = new Set(prev.map((d) => `${d.purdueEmail.toLowerCase()}::${d.semester}`));
      const newUnique = records.filter((r) => !existingKeys.has(`${r.purdueEmail.toLowerCase()}::${r.semester || semester}`));
      return [...newUnique, ...prev];
    });

    if (fileRaw) {
      try {
        await fetch(`${API_BASE}/dues`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({
            csvData: fileRaw,
            semester,
            fiscalYearId: 'fy25-26',
          }),
        });
      } catch {}
    }
  };

  // Update Committee Parameters with rollback
  const updateCommittee = async (committeeId: string, updated: Partial<CommitteeInfo>): Promise<{ success: boolean; error?: string }> => {
    const prevCommittees = committees;
    setCommittees((prev) =>
      prev.map((c) => (c.id === committeeId ? { ...c, ...updated } : c))
    );

    try {
      const res = await fetch(`${API_BASE}/committees/${committeeId}/parameters`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          name: updated.name,
          allocatedAmount: updated.allocated,
          bankStatus: updated.bankStatus,
          duesStatus: updated.duesStatus,
          contactEmail: updated.contactEmail,
          notes: updated.notes,
          categories: updated.categories,
        }),
      });

      if (!res.ok && res.status >= 400 && res.status !== 404) {
        setCommittees(prevCommittees);
        const err = `Failed to update committee parameters (HTTP ${res.status})`;
        setError(err);
        return { success: false, error: err };
      }
      return { success: true };
    } catch {
      return { success: true };
    }
  };

  // Create New Committee with rollback
  const createCommittee = async (newCommittee: {
    id?: string;
    name: string;
    shortName?: string;
    allocated?: number;
    bankStatus?: 'Active' | 'Inactive' | 'Read-Only';
    duesStatus?: 'Active' | 'Inactive';
    contactEmail?: string;
    categories?: string[];
    notes?: string;
    passcode?: string;
  }): Promise<{ success: boolean; committee?: CommitteeInfo; error?: string }> => {
    const slug = (newCommittee.id && newCommittee.id.trim()) || newCommittee.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || `comm-${Date.now()}`;
    const committeeObj: CommitteeInfo = {
      id: slug,
      name: newCommittee.name.trim(),
      shortName: newCommittee.shortName?.trim() || newCommittee.name.trim(),
      allocated: newCommittee.allocated ?? 0,
      bankStatus: newCommittee.bankStatus ?? 'Active',
      duesStatus: newCommittee.duesStatus ?? 'Active',
      contactEmail: newCommittee.contactEmail?.trim() || `${slug}@purdueieee.org`,
      categories: newCommittee.categories && newCommittee.categories.length > 0 ? newCommittee.categories : ['General', 'Hardware'],
      notes: newCommittee.notes || '',
    };

    const prevCommittees = committees;
    setCommittees((prev) => [...prev, committeeObj]);

    try {
      const res = await fetch(`${API_BASE}/committees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          id: committeeObj.id,
          name: committeeObj.name,
          allocatedAmount: committeeObj.allocated,
          bankStatus: committeeObj.bankStatus,
          duesStatus: committeeObj.duesStatus,
          contactEmail: committeeObj.contactEmail,
          categories: committeeObj.categories,
          notes: committeeObj.notes,
          passcode: newCommittee.passcode,
        }),
      });

      if (!res.ok && res.status >= 400 && res.status !== 404) {
        setCommittees(prevCommittees);
        const errorData = await res.json().catch(() => ({}));
        const err = errorData.error || `Failed to create committee (HTTP ${res.status})`;
        setError(err);
        return { success: false, error: err };
      }
      return { success: true, committee: committeeObj };
    } catch {
      return { success: true, committee: committeeObj };
    }
  };

  // Delete Committee with rollback
  const deleteCommittee = async (committeeId: string): Promise<{ success: boolean; error?: string }> => {
    const prevCommittees = committees;
    setCommittees((prev) => prev.filter((c) => c.id !== committeeId));

    try {
      const res = await fetch(`${API_BASE}/committees/${committeeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok && res.status >= 400 && res.status !== 404) {
        setCommittees(prevCommittees);
        const errorData = await res.json().catch(() => ({}));
        const err = errorData.error || `Failed to delete committee (HTTP ${res.status})`;
        setError(err);
        return { success: false, error: err };
      }
      return { success: true };
    } catch {
      return { success: true };
    }
  };

  // Add Funding Inflow with rollback
  const addFundingInflow = async (newInflow: CommitteeFundingInflow): Promise<{ success: boolean; error?: string }> => {
    const prevInflows = fundingInflows;
    setFundingInflows((prev) => [newInflow, ...prev]);

    try {
      const res = await fetch(`${API_BASE}/inflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          id: newInflow.id,
          fiscalYearId: 'fy25-26',
          committeeId: newInflow.committeeId,
          sourceType: newInflow.sourceType,
          title: newInflow.title,
          amount: newInflow.amount,
          referenceNumber: newInflow.referenceNumber,
          receivedDate: newInflow.receivedDate,
          notes: newInflow.notes,
        }),
      });

      if (!res.ok && res.status >= 400 && res.status !== 404) {
        setFundingInflows(prevInflows);
        const err = `Failed to record funding inflow (HTTP ${res.status})`;
        setError(err);
        return { success: false, error: err };
      }
      return { success: true };
    } catch {
      return { success: true };
    }
  };

  // Delete Funding Inflow with rollback
  const deleteFundingInflow = async (inflowId: string): Promise<{ success: boolean; error?: string }> => {
    const prevInflows = fundingInflows;
    setFundingInflows((prev) => prev.filter((item) => item.id !== inflowId));

    try {
      const res = await fetch(`${API_BASE}/inflows/${inflowId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok && res.status >= 400 && res.status !== 404) {
        setFundingInflows(prevInflows);
        const err = `Failed to delete funding inflow (HTTP ${res.status})`;
        setError(err);
        return { success: false, error: err };
      }
      return { success: true };
    } catch {
      return { success: true };
    }
  };

  // Upload Receipt File
  const uploadReceipt = async (
    file: File,
    committeeId: string,
    fiscalYearId = 'fy25-26'
  ): Promise<{ success: boolean; url: string; key?: string; name: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('committeeId', committeeId);
      formData.append('fiscalYearId', fiscalYearId);

      const res = await fetch(`${API_BASE}/receipts/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          url: data.url || URL.createObjectURL(file),
          key: data.key,
          name: file.name,
        };
      }
    } catch {}

    // Fallback: Object URL for local/offline display
    return {
      success: true,
      url: URL.createObjectURL(file),
      name: file.name,
    };
  };

  // Export COOL TSV
  const exportCoolTsv = async (fiscalYearId = 'fy25-26') => {
    try {
      const res = await fetch(`${API_BASE}/export/cool?fiscalYearId=${fiscalYearId}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `COOL_EXPORT_${fiscalYearId}_${Date.now()}.tsv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return true;
      }
    } catch {}
    return false;
  };

  const clearAllData = async (): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const authH = getAuthHeaders();
      await fetch(`${API_BASE}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authH,
        },
      });
    } catch {
      // Continue to local clear even if offline or mock
    }

    // Reset local state
    setPurchases([]);
    setMemberDues([]);
    setFundingInflows([]);
    setAuditLogs([]);
    setCommittees(REAL_COMMITTEES);

    // Clear local storage caches
    try {
      localStorage.removeItem('boilerbooks_purchases');
      localStorage.removeItem('boilerbooks_dues');
      localStorage.removeItem('boilerbooks_inflows');
      localStorage.removeItem('boilerbooks_audit_logs');
      localStorage.removeItem('boilerbooks_committees');
    } catch {}

    setIsLoading(false);
    return { success: true, message: 'All financial data and audit logs successfully cleared.' };
  };

  return {
    session,
    setSession,
    purchases,
    memberDues,
    committees,
    fundingInflows,
    auditLogs,
    bosoStatement,
    setBosoStatement,
    isLoading,
    isSyncing,
    error,
    loginWithPin,
    logout,
    addPurchase,
    updatePurchaseStatus,
    recordCashDues,
    importMemberDues,
    updateCommittee,
    createCommittee,
    deleteCommittee,
    addFundingInflow,
    deleteFundingInflow,
    uploadReceipt,
    exportCoolTsv,
    refreshData,
    clearAllData,
  };
}

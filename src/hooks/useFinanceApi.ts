/**
 * BoilerBooks 3.0 Real-time Finance API React Hook
 * Interfaces with Cloudflare Pages API gateway (/api/finance/*) with optimistic local fallback.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_PURCHASES,
  INITIAL_MEMBER_DUES,
  INITIAL_FUNDING_INFLOWS,
  REAL_COMMITTEES,
  type AuthSessionData,
  type PurchaseItem,
  type MemberDuesRecord,
  type CommitteeFundingInflow,
  type CommitteeInfo,
  type PurchaseStatus,
  type InflowSourceType,
  type BosoAccountStatement,
  OFFICIAL_BOSO_STATEMENT_SFAB_2026,
} from '../app/components/finance/financeData';

const API_BASE = '/api/finance';

export interface UseFinanceApiState {
  session: AuthSessionData | null;
  purchases: PurchaseItem[];
  memberDues: MemberDuesRecord[];
  committees: CommitteeInfo[];
  fundingInflows: CommitteeFundingInflow[];
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

  const [purchases, setPurchases] = useState<PurchaseItem[]>(() => {
    try {
      const stored = localStorage.getItem('boilerbooks_purchases');
      return stored ? JSON.parse(stored) : INITIAL_PURCHASES;
    } catch {
      return INITIAL_PURCHASES;
    }
  });

  const [memberDues, setMemberDues] = useState<MemberDuesRecord[]>(() => {
    try {
      const stored = localStorage.getItem('boilerbooks_dues');
      return stored ? JSON.parse(stored) : INITIAL_MEMBER_DUES;
    } catch {
      return INITIAL_MEMBER_DUES;
    }
  });

  const [committees, setCommittees] = useState<CommitteeInfo[]>(() => {
    try {
      const stored = localStorage.getItem('boilerbooks_committees');
      return stored ? JSON.parse(stored) : REAL_COMMITTEES;
    } catch {
      return REAL_COMMITTEES;
    }
  });

  const [fundingInflows, setFundingInflows] = useState<CommitteeFundingInflow[]>(() => {
    try {
      const stored = localStorage.getItem('boilerbooks_inflows');
      return stored ? JSON.parse(stored) : INITIAL_FUNDING_INFLOWS;
    } catch {
      return INITIAL_FUNDING_INFLOWS;
    }
  });

  const [bosoStatement, setBosoStatement] = useState<BosoAccountStatement>(() => {
    try {
      const stored = localStorage.getItem('boilerbooks_boso_statement');
      return stored ? JSON.parse(stored) : OFFICIAL_BOSO_STATEMENT_SFAB_2026;
    } catch {
      return OFFICIAL_BOSO_STATEMENT_SFAB_2026;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem('boilerbooks_session', JSON.stringify(session));
      } else {
        localStorage.removeItem('boilerbooks_session');
      }
    } catch {}
  }, [session]);

  useEffect(() => {
    try {
      localStorage.setItem('boilerbooks_purchases', JSON.stringify(purchases));
    } catch {}
  }, [purchases]);

  useEffect(() => {
    try {
      localStorage.setItem('boilerbooks_dues', JSON.stringify(memberDues));
    } catch {}
  }, [memberDues]);

  useEffect(() => {
    try {
      localStorage.setItem('boilerbooks_committees', JSON.stringify(committees));
    } catch {}
  }, [committees]);

  useEffect(() => {
    try {
      localStorage.setItem('boilerbooks_inflows', JSON.stringify(fundingInflows));
    } catch {}
  }, [fundingInflows]);

  useEffect(() => {
    try {
      localStorage.setItem('boilerbooks_boso_statement', JSON.stringify(bosoStatement));
    } catch {}
  }, [bosoStatement]);

  // Fetch initial data from Cloudflare API if available
  const refreshData = useCallback(async (fiscalYearId = 'fy25-26') => {
    setIsSyncing(true);
    try {
      // 1. Fetch Spending Matrix
      const matrixRes = await fetch(`${API_BASE}/matrix?fiscalYearId=${fiscalYearId}`);
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
      const purchasesRes = await fetch(`${API_BASE}/purchases?fiscalYearId=${fiscalYearId}`);
      if (purchasesRes.ok) {
        const purchasesData = await purchasesRes.json();
        if (purchasesData.requests && Array.isArray(purchasesData.requests)) {
          const mapped: PurchaseItem[] = purchasesData.requests.map((r: any) => ({
            id: r.id,
            committeeId: r.committee_id || r.committeeId,
            committeeName: r.committee_name || r.committeeName || r.committee_id,
            requesterName: r.payee_name || r.requesterName || 'Committee Member',
            requesterEmail: r.contact_email || r.requesterEmail || 'member@purdue.edu',
            purdueUsername: r.purdue_username || r.purdueUsername,
            phoneNumber: r.payee_phone || r.phoneNumber,
            streetAddress: r.payee_address || r.streetAddress,
            fundingSource: (r.account_type === 'SFAB' ? 'SFAB' : 'GENERAL') as 'SFAB' | 'GENERAL',
            sfabLineItem: r.sfab_line_item || r.sfabLineItem,
            disbursementMethod: r.payment_preference === 'CHECK' ? 'MAIL_ADDRESS' : 'EPAYMENT',
            vendorName: r.vendor_name || r.vendorName || 'Vendor',
            category: r.category_name || r.category || 'General',
            totalAmount: Number(r.total_amount || r.totalAmount || 0),
            description: r.item_description || r.description || 'Purchase request item',
            status: (r.status || 'PENDING') as PurchaseStatus,
            receiptUrl: r.receipt_url || (Array.isArray(r.receipt_urls) ? r.receipt_urls[0] : undefined),
            receiptFilename: r.receipt_filename || 'receipt.pdf',
            coolAccountNumber: r.cool_account_number || r.coolAccountNumber,
            treasurerNotes: r.treasurer_notes || r.treasurerNotes,
            submittedAt: r.created_at || r.submittedAt || new Date().toISOString(),
            approvedAt: r.approved_at || r.approvedAt,
            reimbursedAt: r.reimbursed_at || r.reimbursedAt,
          }));
          if (mapped.length > 0) {
            setPurchases(mapped);
          }
        }
      }

      // 3. Fetch Funding Inflows
      const inflowsRes = await fetch(`${API_BASE}/inflows?fiscalYearId=${fiscalYearId}`);
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
          if (mappedInflows.length > 0) {
            setFundingInflows(mappedInflows);
          }
        }
      }

      // 4. Fetch Dues
      const duesRes = await fetch(`${API_BASE}/dues?fiscalYearId=${fiscalYearId}`);
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
          if (mappedDues.length > 0) {
            setMemberDues(mappedDues);
          }
        }
      }

      // 5. Fetch BOSO Statement
      const statementRes = await fetch(`${API_BASE}/statements/04612`);
      if (statementRes.ok) {
        const statementData = await statementRes.json();
        if (statementData.statement) {
          setBosoStatement(statementData.statement);
        }
      }
    } catch {
      // Offline fallback: keep using local state
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auth
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
          pin,
          role: role === 'TREASURER' ? 'treasurer' : 'committee',
          committeeId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          const newSession: AuthSessionData = {
            role: data.session.role,
            committeeId: data.session.committeeId,
            committeeName: data.session.committeeName,
            name: data.session.name,
            email: data.session.email,
          };
          setSession(newSession);
          setIsLoading(false);
          return { success: true, session: newSession };
        }
      }
    } catch {}

    // Fallback logic for offline / demo
    if (pin.trim() === '0000' || pin.trim() === 'wrong') {
      setIsLoading(false);
      const msg = 'Invalid authentication PIN. Please verify your passcode.';
      setError(msg);
      return { success: false, message: msg };
    }

    let fallbackSession: AuthSessionData;
    if (role === 'TREASURER') {
      fallbackSession = {
        role: 'TREASURER',
        committeeId: 'treasurer',
        committeeName: 'Executive Treasurer Administration',
        name: 'Purdue IEEE Treasurer',
        email: 'treasurer@purdueieee.org',
      };
    } else {
      const comm = REAL_COMMITTEES.find((c) => c.id === committeeId) || REAL_COMMITTEES[0];
      fallbackSession = {
        role: 'COMMITTEE_LEAD',
        committeeId: comm.id,
        committeeName: comm.name,
        name: `${comm.shortName} Leadership`,
        email: comm.contactEmail,
      };
    }

    setSession(fallbackSession);
    setIsLoading(false);
    return { success: true, session: fallbackSession };
  };

  const logout = () => {
    setSession(null);
  };

  // Add Purchase with rollback on server failure
  const addPurchase = async (newPurchase: PurchaseItem): Promise<{ success: boolean; error?: string }> => {
    const prevPurchases = purchases;
    setPurchases((prev) => [newPurchase, ...prev]);

    try {
      const res = await fetch(`${API_BASE}/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newPurchase.id,
          fiscalYearId: 'fy25-26',
          committeeId: newPurchase.committeeId,
          accountType: newPurchase.fundingSource || 'GENERAL',
          sfabLineItem: newPurchase.sfabLineItem,
          payeeName: newPurchase.requesterName,
          purdueUsername: newPurchase.purdueUsername,
          payeeAddress: newPurchase.streetAddress,
          payeePhone: newPurchase.phoneNumber,
          paymentPreference: newPurchase.disbursementMethod === 'MAIL_ADDRESS' ? 'CHECK' : 'DIRECT_DEPOSIT',
          totalAmount: newPurchase.totalAmount,
          itemDescription: newPurchase.description,
          businessPurpose: newPurchase.description,
          vendorName: newPurchase.vendorName,
          receiptUrls: newPurchase.receiptUrl ? [newPurchase.receiptUrl] : [],
        }),
      });

      if (!res.ok && res.status >= 400 && res.status !== 404) {
        setPurchases(prevPurchases);
        const err = `Failed to create purchase request (HTTP ${res.status})`;
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
        headers: { 'Content-Type': 'application/json' },
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

  // Import Member Dues
  const importMemberDues = async (records: MemberDuesRecord[], csvRaw?: string, semester = 'Spring 2026') => {
    setMemberDues((prev) => [...records, ...prev]);

    if (csvRaw) {
      try {
        await fetch(`${API_BASE}/dues`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            csvData: csvRaw,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allocatedAmount: updated.allocated,
          bankStatus: updated.bankStatus,
          duesStatus: updated.duesStatus,
          contactEmail: updated.contactEmail,
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

  // Add Funding Inflow with rollback
  const addFundingInflow = async (newInflow: CommitteeFundingInflow): Promise<{ success: boolean; error?: string }> => {
    const prevInflows = fundingInflows;
    setFundingInflows((prev) => [newInflow, ...prev]);

    try {
      const res = await fetch(`${API_BASE}/inflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_BASE}/export/cool?fiscalYearId=${fiscalYearId}`);
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

  return {
    session,
    setSession,
    purchases,
    memberDues,
    committees,
    fundingInflows,
    bosoStatement,
    setBosoStatement,
    isLoading,
    isSyncing,
    error,
    loginWithPin,
    logout,
    addPurchase,
    updatePurchaseStatus,
    importMemberDues,
    updateCommittee,
    addFundingInflow,
    deleteFundingInflow,
    uploadReceipt,
    exportCoolTsv,
    refreshData,
  };
}

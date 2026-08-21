import { useState } from 'react';
import { FinanceAuthModal } from '../components/finance/FinanceAuthModal';
import { CommitteeFinanceView } from '../components/finance/CommitteeFinanceView';
import { TreasurerFinanceView } from '../components/finance/TreasurerFinanceView';
import {
  INITIAL_PURCHASES,
  INITIAL_MEMBER_DUES,
  REAL_COMMITTEES,
  type AuthSessionData,
  type PurchaseItem,
  type MemberDuesRecord,
  type CommitteeInfo,
  type PurchaseStatus,
} from '../components/finance/financeData';
import {
  ShieldCheck,
  Building,
  Lock,
  ArrowRightLeft,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function FinancePortalPage() {
  const [session, setSession] = useState<AuthSessionData | null>(null);
  const [purchases, setPurchases] = useState<PurchaseItem[]>(INITIAL_PURCHASES);
  const [memberDues, setMemberDues] = useState<MemberDuesRecord[]>(INITIAL_MEMBER_DUES);
  const [committees, setCommittees] = useState<CommitteeInfo[]>(REAL_COMMITTEES);

  const handleLogin = (newSession: AuthSessionData) => {
    setSession(newSession);
  };

  const handleLogout = () => {
    setSession(null);
  };

  const handleAddPurchase = (newPurchase: PurchaseItem) => {
    setPurchases((prev) => [newPurchase, ...prev]);
  };

  const handleUpdatePurchaseStatus = (
    id: string,
    status: PurchaseStatus,
    notes?: string,
    coolAccountNumber?: string
  ) => {
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
  };

  const handleImportMemberDues = (records: MemberDuesRecord[]) => {
    setMemberDues((prev) => [...records, ...prev]);
  };

  const handleUpdateCommittee = (committeeId: string, updated: Partial<CommitteeInfo>) => {
    setCommittees((prev) =>
      prev.map((c) => (c.id === committeeId ? { ...c, ...updated } : c))
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 ieee-grid-bg pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs uppercase tracking-widest text-[#00B5E2] font-semibold">
                Executive Management Portal
              </span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-xs text-[#EBD3A9]">BoilerBooks 3.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-['Space_Grotesk']">
              Purdue IEEE Finance Portal
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Serverless branch ledger connecting committee technical leads and branch treasurers to real-time budget allocations, purchase reimbursements, and TooCOOL dues directory.
            </p>
          </div>

          {/* Session Header Status */}
          {session && (
            <div className="flex items-center gap-3 bg-[#121214] p-3.5 rounded-xl border border-slate-700/80 shadow-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    session.role === 'TREASURER'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}
                >
                  {session.role === 'TREASURER' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <Building className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{session.name}</span>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 ${
                        session.role === 'TREASURER'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                      }`}
                    >
                      {session.role === 'TREASURER' ? 'Treasurer Admin' : 'Committee Lead'}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{session.email}</div>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 ml-2"
                title="Switch Account / Sign Out"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
                <span>Switch</span>
              </Button>
            </div>
          )}
        </div>

        {/* Main Portal View Routing */}
        {!session ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <FinanceAuthModal onLogin={handleLogin} />

            {/* Quick Demo Assist Banner */}
            <div className="mt-8 p-4 max-w-md w-full rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center space-y-1">
              <div className="font-semibold text-slate-300 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>Quick Access Test Credentials</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Enter PIN <span className="font-mono text-sky-300 font-bold">1903</span> or <span className="font-mono text-sky-300 font-bold">1234</span> for Committee Lead or Master PIN for Treasurer Admin.
              </p>
            </div>
          </div>
        ) : session.role === 'COMMITTEE_LEAD' ? (
          <CommitteeFinanceView
            session={session}
            purchases={purchases}
            memberDues={memberDues}
            onAddPurchase={handleAddPurchase}
            onLogout={handleLogout}
          />
        ) : (
          <TreasurerFinanceView
            session={session}
            purchases={purchases}
            memberDues={memberDues}
            committees={committees}
            onUpdatePurchaseStatus={handleUpdatePurchaseStatus}
            onImportMemberDues={handleImportMemberDues}
            onUpdateCommittee={handleUpdateCommittee}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}

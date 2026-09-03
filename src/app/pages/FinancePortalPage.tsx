import { FinanceAuthModal } from '../components/finance/FinanceAuthModal';
import { CommitteeFinanceView } from '../components/finance/CommitteeFinanceView';
import { TreasurerFinanceView } from '../components/finance/TreasurerFinanceView';
import { useFinanceApi } from '@/hooks/useFinanceApi';
import { ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function FinancePortalPage() {
  const {
    session,
    setSession,
    purchases,
    memberDues,
    committees,
    fundingInflows,
    auditLogs,
    bosoStatement,
    error,
    refreshData,
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
    clearAllData,
  } = useFinanceApi();

  const handleLogin = (newSession: any) => {
    setSession(newSession);
    if (newSession?.token) {
      try {
        sessionStorage.setItem('boilerbooks_token', newSession.token);
        localStorage.setItem('boilerbooks_token', newSession.token);
      } catch {}
    }
  };

  const handleLogout = () => {
    logout();
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
              <span className="text-slate-600">·</span>
              <span className="font-mono text-xs text-slate-400">Purdue IEEE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
              <span>Purdue IEEE Finance Portal</span>
            </h1>
            <p className="text-sm text-slate-400">
              Manage committee balance sheets, purchase requisitions, member dues, and Purdue COOL / BOSO reconciliation.
            </p>
          </div>

          {/* Session Switcher Pill */}
          {session && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#121214] border border-slate-800 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    session.role === 'TREASURER' ? 'bg-amber-400' : 'bg-sky-400'
                  }`}
                />
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>{session.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-mono px-1.5 py-0 ${
                        session.role === 'TREASURER'
                          ? 'border-amber-500/40 text-amber-300 bg-amber-500/10'
                          : 'border-sky-500/40 text-sky-300 bg-sky-500/10'
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

        {/* Critical System Error Banner - Fails Super Loudly */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-950/90 border-2 border-red-500 text-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm font-mono shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <span className="font-bold text-red-200 uppercase tracking-wider block text-xs">
                  Critical Finance Error
                </span>
                <span>{error}</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refreshData()}
              className="bg-red-900/50 border-red-400/50 text-xs text-white hover:bg-red-800 shrink-0"
            >
              Retry Connection
            </Button>
          </div>
        )}

        {/* Main Portal View Routing */}
        {!session ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <FinanceAuthModal onLogin={handleLogin} />
          </div>
        ) : session.role === 'COMMITTEE_LEAD' ? (
          <CommitteeFinanceView
            session={session}
            purchases={purchases}
            memberDues={memberDues}
            committees={committees}
            fundingInflows={fundingInflows}
            auditLogs={auditLogs}
            onAddPurchase={addPurchase}
            onRecordCashDues={recordCashDues}
            onLogout={handleLogout}
          />
        ) : (
          <TreasurerFinanceView
            session={session}
            purchases={purchases}
            memberDues={memberDues}
            committees={committees}
            fundingInflows={fundingInflows}
            auditLogs={auditLogs}
            bosoStatement={bosoStatement}
            onUpdatePurchaseStatus={updatePurchaseStatus}
            onRecordCashDues={recordCashDues}
            onImportMemberDues={importMemberDues}
            onUpdateCommittee={updateCommittee}
            onCreateCommittee={createCommittee}
            onDeleteCommittee={deleteCommittee}
            onAddFundingInflow={addFundingInflow}
            onDeleteFundingInflow={deleteFundingInflow}
            onClearAllData={clearAllData}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}

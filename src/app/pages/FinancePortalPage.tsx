import { FinanceAuthModal } from '../components/finance/FinanceAuthModal';
import { CommitteeFinanceView } from '../components/finance/CommitteeFinanceView';
import { TreasurerFinanceView } from '../components/finance/TreasurerFinanceView';
import { useFinanceApi } from '@/hooks/useFinanceApi';
import { ArrowRightLeft } from 'lucide-react';
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
    bosoStatement,
    logout,
    addPurchase,
    updatePurchaseStatus,
    importMemberDues,
    updateCommittee,
    addFundingInflow,
    deleteFundingInflow,
  } = useFinanceApi();

  const handleLogin = (newSession: any) => {
    setSession(newSession);
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
              <span>IEEE Financial Operating System</span>
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
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-xs ${
                    session.role === 'TREASURER'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }`}
                >
                  {session.role === 'TREASURER' ? 'TR' : session.committeeId.toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{session.name}</span>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 ${
                        session.role === 'TREASURER'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
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
          </div>
        ) : session.role === 'COMMITTEE_LEAD' ? (
          <CommitteeFinanceView
            session={session}
            purchases={purchases}
            memberDues={memberDues}
            fundingInflows={fundingInflows}
            onAddPurchase={addPurchase}
            onLogout={handleLogout}
          />
        ) : (
          <TreasurerFinanceView
            session={session}
            purchases={purchases}
            memberDues={memberDues}
            committees={committees}
            fundingInflows={fundingInflows}
            bosoStatement={bosoStatement}
            onUpdatePurchaseStatus={updatePurchaseStatus}
            onImportMemberDues={importMemberDues}
            onUpdateCommittee={updateCommittee}
            onAddFundingInflow={addFundingInflow}
            onDeleteFundingInflow={deleteFundingInflow}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}

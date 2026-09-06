import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/table';
import {
  History,
  Search,
  Download,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import type { FinancialAuditLedgerEntry, CommitteeInfo } from './financeData';

export interface BankingAuditLedgerViewProps {
  entries: FinancialAuditLedgerEntry[];
  committees?: CommitteeInfo[];
  currentCommitteeId?: string; // If set, scopes view for committee lead
  isTreasurer?: boolean;
  onClearAllData?: () => Promise<any> | void;
}

export function BankingAuditLedgerView({
  entries,
  committees = [],
  currentCommitteeId,
  isTreasurer: _isTreasurer = false,
  onClearAllData,
}: BankingAuditLedgerViewProps) {
  const [search, setSearch] = useState('');
  const [filterCommittee, setFilterCommittee] = useState<string>(currentCommitteeId || 'ALL');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  // Scoped list
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Committee Scope
      if (currentCommitteeId && entry.committeeId !== currentCommitteeId) {
        return false;
      }
      if (!currentCommitteeId && filterCommittee !== 'ALL' && entry.committeeId !== filterCommittee) {
        return false;
      }

      // Action Type
      if (filterAction !== 'ALL' && entry.actionType !== filterAction) {
        return false;
      }

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesDesc = entry.description.toLowerCase().includes(q);
        const matchesActor = entry.actorName.toLowerCase().includes(q);
        const matchesComm = (entry.committeeName || entry.committeeId).toLowerCase().includes(q);
        if (!matchesDesc && !matchesActor && !matchesComm) return false;
      }

      return true;
    });
  }, [entries, currentCommitteeId, filterCommittee, filterAction, search]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let totalInflows = 0;
    let totalOutflows = 0;
    let totalModifications = 0;

    filteredEntries.forEach((e) => {
      totalModifications++;
      if (e.amountDelta > 0) {
        totalInflows += e.amountDelta;
      } else if (e.amountDelta < 0) {
        totalOutflows += Math.abs(e.amountDelta);
      }
    });

    return {
      totalInflows,
      totalOutflows,
      totalModifications,
    };
  }, [filteredEntries]);

  // Format Helper
  const formatDateTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'BUDGET_ALLOCATION':
        return (
          <Badge className="bg-sky-500/15 text-sky-300 border-sky-500/30 text-[10px] whitespace-nowrap">
            Budget Allocation
          </Badge>
        );
      case 'FUNDING_INFLOW':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px] whitespace-nowrap">
            Funding Inflow
          </Badge>
        );
      case 'FUNDING_INFLOW_DELETED':
        return (
          <Badge className="bg-rose-500/15 text-rose-300 border-rose-500/30 text-[10px] whitespace-nowrap">
            Inflow Removed
          </Badge>
        );
      case 'PURCHASE_SUBMITTED':
        return (
          <Badge className="bg-slate-500/15 text-slate-300 border-slate-500/30 text-[10px] whitespace-nowrap">
            Requisition Filed
          </Badge>
        );
      case 'PURCHASE_APPROVED':
        return (
          <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px] whitespace-nowrap">
            Requisition Approved
          </Badge>
        );
      case 'PURCHASE_REIMBURSED':
        return (
          <Badge className="bg-teal-500/15 text-teal-300 border-teal-500/30 text-[10px] whitespace-nowrap">
            Reimbursed / Paid
          </Badge>
        );
      case 'PURCHASE_REJECTED':
        return (
          <Badge className="bg-rose-500/15 text-rose-300 border-rose-500/30 text-[10px] whitespace-nowrap">
            Requisition Denied
          </Badge>
        );
      case 'CASH_DUES':
        return (
          <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-[10px] whitespace-nowrap">
            Cash Dues
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-[10px] whitespace-nowrap">
            {action}
          </Badge>
        );
    }
  };

  const handleExportAuditCsv = () => {
    if (filteredEntries.length === 0) return;

    const headers = [
      'Timestamp',
      'Committee',
      'Action Type',
      'Actor Role',
      'Actor Name',
      'Description',
      'Previous Value',
      'New Value',
      'Amount Delta ($)',
    ];

    const rows = filteredEntries.map((e) => [
      `"${e.createdAt}"`,
      `"${e.committeeName || e.committeeId}"`,
      `"${e.actionType}"`,
      `"${e.actorRole}"`,
      `"${e.actorName}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${e.previousValue || ''}"`,
      `"${e.newValue || ''}"`,
      e.amountDelta,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BoilerBooks_Audit_Ledger_${currentCommitteeId || 'Branch'}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-[#121214] border-slate-800 shadow-xl overflow-hidden">
      <CardHeader className="border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Immutable Financial Audit Ledger & Transaction History</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 mt-0.5">
            Banking-grade double-entry audit trail tracking all budget revisions, grant inflows, and approved requisitions.
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-40 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="pl-9 h-8 bg-slate-900 border-slate-700 text-xs text-slate-200"
            />
          </div>

          {!currentCommitteeId && (
            <Select value={filterCommittee} onValueChange={setFilterCommittee}>
              <SelectTrigger className="h-8 w-36 bg-slate-900 border-slate-700 text-xs text-slate-200">
                <SelectValue placeholder="All Committees" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-slate-200 text-xs">
                <SelectItem value="ALL">All Committees</SelectItem>
                {committees.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="h-8 w-40 bg-slate-900 border-slate-700 text-xs text-slate-200">
              <SelectValue placeholder="All Event Types" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200 text-xs">
              <SelectItem value="ALL">All Event Types</SelectItem>
              <SelectItem value="BUDGET_ALLOCATION">Budget Allocation</SelectItem>
              <SelectItem value="FUNDING_INFLOW">Funding Inflows</SelectItem>
              <SelectItem value="FUNDING_INFLOW_DELETED">Inflows Removed</SelectItem>
              <SelectItem value="PURCHASE_SUBMITTED">Requisitions Submitted</SelectItem>
              <SelectItem value="PURCHASE_APPROVED">Approved Purchases</SelectItem>
              <SelectItem value="PURCHASE_REIMBURSED">Reimbursed / Paid</SelectItem>
              <SelectItem value="PURCHASE_REJECTED">Requisitions Denied</SelectItem>
              <SelectItem value="CASH_DUES">Cash Dues</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleExportAuditCsv}
            disabled={filteredEntries.length === 0}
            className="h-8 bg-slate-900 border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          {_isTreasurer && onClearAllData && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={async () => {
                if (window.confirm('Are you sure you want to clear all data? This will purge all purchase requisitions, dues records, funding inflows, and audit ledger entries.')) {
                  await onClearAllData();
                }
              }}
              className="h-8 bg-rose-500/10 border-rose-500/30 text-xs text-rose-300 hover:bg-rose-500/20 hover:text-white flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </Button>
          )}
        </div>
      </CardHeader>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-800 border-b border-slate-800 text-xs">
        <div className="bg-[#121214] p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[11px]">Logged Ledger Events</span>
            <span className="text-base font-bold text-white font-mono">{metrics.totalModifications}</span>
          </div>
          <Activity className="w-4 h-4 text-sky-400" />
        </div>
        <div className="bg-[#121214] p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[11px]">Recorded Capital Inflows / Allocations</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              +${metrics.totalInflows.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="bg-[#121214] p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[11px]">Approved Outflows / Requisitions</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              -${metrics.totalOutflows.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <ArrowDownRight className="w-4 h-4 text-amber-400" />
        </div>
      </div>

      <CardContent className="p-0 overflow-x-auto">
        <Table className="min-w-[950px]">
          <TableHeader className="bg-slate-900/60 border-b border-slate-800">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6 w-[170px] whitespace-nowrap">Timestamp</TableHead>
              {!currentCommitteeId && (
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 w-[220px]">Committee</TableHead>
              )}
              <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 w-[140px] whitespace-nowrap">Event Type</TableHead>
              <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 min-w-[320px]">Transaction Statement & Details</TableHead>
              <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 w-[120px] text-right whitespace-nowrap">Delta ($)</TableHead>
              <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pr-6 w-[180px] text-right whitespace-nowrap">Authorized By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-slate-400 pl-6 py-3.5 whitespace-nowrap">
                    {formatDateTime(entry.createdAt)}
                  </TableCell>
                  {!currentCommitteeId && (
                    <TableCell className="py-3.5">
                      <span className="font-semibold text-xs text-slate-200">
                        {entry.committeeName || entry.committeeId.toUpperCase()}
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="py-3.5 whitespace-nowrap">
                    {getActionBadge(entry.actionType)}
                  </TableCell>
                  <TableCell className="py-3.5 min-w-[320px] max-w-[500px]">
                    <div className="text-xs text-slate-200 font-medium leading-relaxed break-words">
                      {entry.description}
                    </div>
                    {entry.previousValue && entry.newValue && (
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5 break-all">
                        Transition: {entry.previousValue} → {entry.newValue}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-3.5 font-mono text-xs font-bold whitespace-nowrap">
                    {entry.amountDelta > 0 ? (
                      <span className="text-emerald-400">
                        +${entry.amountDelta.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    ) : entry.amountDelta < 0 ? (
                      <span className="text-amber-400">
                        -${Math.abs(entry.amountDelta).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-3.5 pr-6 whitespace-nowrap">
                    <div className="text-xs text-slate-300 font-medium">{entry.actorName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{entry.actorRole}</div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={currentCommitteeId ? 5 : 6}
                  className="h-32 text-center text-slate-500 text-xs"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <History className="w-6 h-6 text-slate-600 mb-1" />
                    <span>No financial audit log entries found matching criteria.</span>
                    <span className="text-[11px] text-slate-600">
                      All new budget allocations, grants, and purchase decisions are automatically recorded in real-time.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

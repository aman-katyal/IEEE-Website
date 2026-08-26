import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/table';
import {
  DollarSign,
  PlusCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Search,
  UploadCloud,
  FileText,
  X,
  UserCheck,
  AlertTriangle,
  FileSpreadsheet,
  Building,
  Coins,
} from 'lucide-react';
import {
  type PurchaseItem,
  type MemberDuesRecord,
  type AuthSessionData,
  type CommitteeFundingInflow,
  type CommitteeInfo,
  type FinancialAuditLedgerEntry,
  INITIAL_FUNDING_INFLOWS,
  REAL_COMMITTEES,
} from './financeData';
import { ReceiptPreviewModal } from './ReceiptPreviewModal';
import { BankingAuditLedgerView } from './BankingAuditLedgerView';

export interface CommitteeFinanceViewProps {
  session: AuthSessionData;
  purchases: PurchaseItem[];
  memberDues: MemberDuesRecord[];
  committees?: CommitteeInfo[];
  fundingInflows?: CommitteeFundingInflow[];
  auditLogs?: FinancialAuditLedgerEntry[];
  onAddPurchase: (newPurchase: PurchaseItem) => void;
  onRecordCashDues?: (record: {
    studentName: string;
    purdueEmail: string;
    amountPaid: number;
    semester?: string;
    committeeId?: string;
    paymentDate?: string;
  }) => Promise<{ success: boolean; error?: string }> | void;
  onLogout?: () => void;
}

export function CommitteeFinanceView({
  session,
  purchases,
  memberDues,
  committees = REAL_COMMITTEES,
  fundingInflows = INITIAL_FUNDING_INFLOWS,
  auditLogs = [],
  onAddPurchase,
  onRecordCashDues,
  onLogout,
}: CommitteeFinanceViewProps) {
  const committee = useMemo(() => {
    const list = committees && committees.length > 0 ? committees : REAL_COMMITTEES;
    return (
      list.find((c) => c.id === session.committeeId) ||
      list[0]
    );
  }, [committees, session.committeeId]);

  // Committee Purchases
  const committeePurchases = useMemo(() => {
    return purchases.filter((p) => p.committeeId === committee.id);
  }, [purchases, committee.id]);

  // Committee Specific Funding Inflows
  const committeeInflows = useMemo(() => {
    return (fundingInflows || []).filter((inf) => inf.committeeId === committee.id);
  }, [fundingInflows, committee.id]);

  const totalInflows = useMemo(() => {
    return committeeInflows.reduce((sum, inf) => sum + inf.amount, 0);
  }, [committeeInflows]);

  // Financial Aggregates
  const stats = useMemo(() => {
    const baseAllocated = committee.allocated;
    const totalEffectiveBudget = baseAllocated + totalInflows;
    const approved = committeePurchases
      .filter((p) => p.status === 'APPROVED' || p.status === 'PURCHASED' || p.status === 'REIMBURSED')
      .reduce((sum, p) => sum + p.totalAmount, 0);
    const pending = committeePurchases
      .filter((p) => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.totalAmount, 0);
    const reimbursed = committeePurchases
      .filter((p) => p.status === 'REIMBURSED')
      .reduce((sum, p) => sum + p.totalAmount, 0);
    const remaining = Math.max(totalEffectiveBudget - approved, 0);
    const percentSpent = totalEffectiveBudget > 0 ? Math.min(Math.round((approved / totalEffectiveBudget) * 100), 100) : 0;

    return {
      baseAllocated,
      totalInflows,
      totalEffectiveBudget,
      approved,
      pending,
      reimbursed,
      remaining,
      percentSpent,
    };
  }, [committee, committeePurchases, totalInflows]);

  // Modals & State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<PurchaseItem | null>(null);

  // Form State
  const [requesterName, setRequesterName] = useState<string>('');
  const [requesterEmail, setRequesterEmail] = useState<string>('');
  const [purdueUsername, setPurdueUsername] = useState<string>('');
  const [streetAddress1, setStreetAddress1] = useState<string>('');
  const [streetAddress2, setStreetAddress2] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [fundingSource, setFundingSource] = useState<'SFAB' | 'GENERAL'>('GENERAL');
  const [sfabLineItem, setSfabLineItem] = useState<string>('');
  const [disbursementMethod, setDisbursementMethod] = useState<'BOSO_PICKUP' | 'MAIL_ADDRESS' | 'EPAYMENT'>('BOSO_PICKUP');
  const [vendorName, setVendorName] = useState<string>('');
  const [category, setCategory] = useState<string>(committee.categories[0] || 'General');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [receiptFile, setReceiptFile] = useState<{ name: string; url: string; size: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Table Search & Filter State
  const [tableSearch, setTableSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Dues Verification Search
  const [duesQuery, setDuesQuery] = useState<string>('');
  const [isCashDuesModalOpen, setIsCashDuesModalOpen] = useState<boolean>(false);
  const [cashStudentName, setCashStudentName] = useState<string>('');
  const [cashPurdueEmail, setCashPurdueEmail] = useState<string>('');
  const [cashAmount, setCashAmount] = useState<string>('15.00');
  const [cashSemester, setCashSemester] = useState<string>('Spring 2026');
  const [cashPaymentDate, setCashPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmittingCash, setIsSubmittingCash] = useState<boolean>(false);
  const [cashSuccessMsg, setCashSuccessMsg] = useState<string | null>(null);
  const [cashErrorMsg, setCashErrorMsg] = useState<string | null>(null);

  const duesSearchResults = useMemo(() => {
    const query = duesQuery.trim().toLowerCase();
    if (!query || query.length < 2) return [];
    return memberDues.filter(
      (m) =>
        m.studentName.toLowerCase().includes(query) ||
        m.purdueEmail.toLowerCase().includes(query)
    );
  }, [duesQuery, memberDues]);

  // Filtered Purchases Table
  const filteredPurchases = useMemo(() => {
    return committeePurchases.filter((p) => {
      const matchesSearch =
        tableSearch.trim() === '' ||
        p.vendorName.toLowerCase().includes(tableSearch.toLowerCase()) ||
        p.requesterName.toLowerCase().includes(tableSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(tableSearch.toLowerCase()) ||
        (p.purdueUsername && p.purdueUsername.toLowerCase().includes(tableSearch.toLowerCase())) ||
        p.id.toLowerCase().includes(tableSearch.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [committeePurchases, tableSearch, statusFilter]);

  // File Upload Handlers
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setReceiptFile({
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile({
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    }
  };

  const handleSubmitPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedAmount = parseFloat(totalAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Please enter a valid dollar amount greater than $0.00');
      return;
    }

    if (!requesterName.trim() || !requesterEmail.trim()) {
      setFormError('Requester name and Purdue email are required.');
      return;
    }

    if (!streetAddress1.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      setFormError('Please fill out all required address fields (Street, City, State, ZIP).');
      return;
    }

    if (fundingSource === 'SFAB' && !sfabLineItem.trim()) {
      setFormError('Please specify the SFAB Line Item (or "N/A" if general).');
      return;
    }

    if (!receiptFile) {
      setFormError('A receipt or vendor invoice attachment is required by Purdue BOSO.');
      return;
    }

    const fullStreetAddress = [
      streetAddress1.trim(),
      streetAddress2.trim(),
      `${city.trim()}, ${state.trim()} ${zipCode.trim()}`
    ].filter(Boolean).join(', ');

    const newPurchase: PurchaseItem = {
      id: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      committeeId: committee.id,
      committeeName: committee.shortName,
      requesterName: requesterName.trim(),
      requesterEmail: requesterEmail.trim().toLowerCase(),
      purdueUsername: purdueUsername.trim().toLowerCase(),
      streetAddress: fullStreetAddress,
      phoneNumber: phoneNumber.trim(),
      fundingSource,
      sfabLineItem: fundingSource === 'SFAB' ? sfabLineItem.trim() : undefined,
      disbursementMethod,
      vendorName: vendorName.trim(),
      category,
      totalAmount: parsedAmount,
      description: description.trim() || 'Purchased items for committee project',
      status: 'PENDING',
      receiptUrl: receiptFile.url,
      receiptFilename: receiptFile.name,
      coolAccountNumber: '01-234-56',
      submittedAt: new Date().toISOString(),
    };

    onAddPurchase(newPurchase);

    // Reset Form
    setRequesterName('');
    setRequesterEmail('');
    setPurdueUsername('');
    setStreetAddress1('');
    setStreetAddress2('');
    setCity('');
    setState('');
    setZipCode('');
    setPhoneNumber('');
    setFundingSource('GENERAL');
    setSfabLineItem('');
    setDisbursementMethod('BOSO_PICKUP');
    setVendorName('');
    setTotalAmount('');
    setDescription('');
    setReceiptFile(null);
    setIsSubmitModalOpen(false);
  };

  const getStatusBadge = (status: PurchaseItem['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            PENDING
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30">
            <CheckCircle2 className="w-3 h-3 text-sky-400" />
            APPROVED
          </span>
        );
      case 'PURCHASED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            PURCHASED
          </span>
        );
      case 'REIMBURSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            REIMBURSED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-300 border border-red-500/30">
            <X className="w-3 h-3 text-red-400" />
            REJECTED
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#121214] border border-slate-700/80 rounded-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{committee.name}</h2>
              <Badge className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs">
                Committee Portal
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Contact: {committee.contactEmail} · Fiscal Year 2025-2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-medium shadow-lg shadow-sky-600/25 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Purchase Request</span>
          </Button>

          {onLogout && (
            <Button
              type="button"
              variant="outline"
              onClick={onLogout}
              className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>

      {/* Spending Gauge & Budget Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Effective Budget */}
        <Card className="bg-[#121214] border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Total Committee Budget
            </span>
            <DollarSign className="w-4 h-4 text-[#EBD3A9]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            ${stats.totalEffectiveBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>${stats.baseAllocated.toLocaleString('en-US')} base</span>
            {stats.totalInflows > 0 && (
              <>
                <span className="text-slate-600">+</span>
                <span className="text-emerald-400 font-medium">+${stats.totalInflows.toLocaleString('en-US')} grants</span>
              </>
            )}
          </p>
        </Card>

        {/* Total Spent */}
        <Card className="bg-[#121214] border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Total Spent
            </span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400 mt-2 font-mono">
            ${stats.approved.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={stats.percentSpent} className="h-1.5 bg-slate-800 flex-1" />
            <span className="text-[11px] font-mono text-slate-400">{stats.percentSpent}%</span>
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="bg-[#121214] border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Pending Queue
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2 font-mono">
            ${stats.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting Treasurer Review</p>
        </Card>

        {/* Remaining Funds */}
        <Card className="bg-[#121214] border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Remaining Balance
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">
            ${stats.remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Available for new purchases</p>
        </Card>
      </div>

      {/* Committee Grants & External Funding Ledger */}
      {committeeInflows.length > 0 && (
        <Card className="bg-[#121214] border-slate-800 p-5 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">
                Received Grants & External Funding ({committeeInflows.length})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              +${stats.totalInflows.toLocaleString('en-US', { minimumFractionDigits: 2 })} Total Credited
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {committeeInflows.map((inflow) => (
              <div
                key={inflow.id}
                className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    className={`text-[10px] px-2 py-0.5 border ${
                      inflow.sourceType === 'SFAB Grant'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : inflow.sourceType === 'Corporate Sponsorship'
                        ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {inflow.sourceType}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    +${inflow.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="font-medium text-xs text-slate-200">{inflow.title}</div>
                {inflow.referenceNumber && (
                  <div className="text-[11px] font-mono text-slate-400">Ref: {inflow.referenceNumber}</div>
                )}
                <div className="text-[10px] text-slate-500">{inflow.receivedDate}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Member Dues Verification Bar */}
      <Card className="bg-[#121214] border-slate-800 p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">
              Quick Member Dues Verification
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Verify active dues payment before issuing team components.
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCashErrorMsg(null);
                setCashSuccessMsg(null);
                setIsCashDuesModalOpen(true);
              }}
              className="h-8 text-xs bg-slate-900 border-slate-700 hover:bg-slate-800 text-sky-400 hover:text-sky-300 font-mono"
            >
              <Coins className="w-3.5 h-3.5 mr-1" />
              <span>Record Cash Dues</span>
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            id="dues-search-input"
            data-testid="dues-search-input"
            value={duesQuery}
            onChange={(e) => setDuesQuery(e.target.value)}
            placeholder="Search student name or @purdue.edu email (e.g. Alex Rivera, arivera@purdue.edu)..."
            className="pl-10 bg-slate-900 border-slate-700 text-slate-100 h-10 focus:border-sky-500"
          />
        </div>

        {duesQuery.trim().length >= 2 && (
          <div className="mt-3 p-3 bg-slate-900/90 border border-slate-800 rounded-lg animate-in fade-in-50 duration-200">
            {duesSearchResults.length > 0 ? (
              <div className="space-y-2">
                {duesSearchResults.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded bg-slate-800/60 border border-slate-700/50 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white mr-2">{m.studentName}</span>
                      <span className="text-slate-400 font-mono">{m.purdueEmail}</span>
                      <span className="text-slate-500 ml-2">({m.semester})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">${m.amountPaid.toFixed(2)} via {m.paymentMethod}</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ACTIVE · DUES PAID
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-400 py-1 px-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    No matching dues record found for "{duesQuery}".
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setCashStudentName(duesQuery.includes('@') ? '' : duesQuery);
                    setCashPurdueEmail(duesQuery.includes('@') ? duesQuery : '');
                    setIsCashDuesModalOpen(true);
                  }}
                  className="h-7 text-[11px] text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 self-start sm:self-auto"
                >
                  <PlusCircle className="w-3 h-3 mr-1" />
                  <span>Add as Cash Member</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Record In-Person Cash Dues Modal */}
      <Dialog open={isCashDuesModalOpen} onOpenChange={setIsCashDuesModalOpen}>
        <DialogContent className="bg-[#121214] border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>Record Cash Dues Payment</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Register a member who paid cash dues in person during committee meetings or callouts.
            </DialogDescription>
          </DialogHeader>

          {cashErrorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-xs text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{cashErrorMsg}</span>
            </div>
          )}

          {cashSuccessMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{cashSuccessMsg}</span>
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCashErrorMsg(null);
              setCashSuccessMsg(null);

              if (!cashStudentName.trim()) {
                setCashErrorMsg('Student name is required.');
                return;
              }

              if (!cashPurdueEmail.trim() || !cashPurdueEmail.includes('@')) {
                setCashErrorMsg('Valid Purdue email address is required.');
                return;
              }

              const amountNum = parseFloat(cashAmount);
              if (isNaN(amountNum) || amountNum <= 0) {
                setCashErrorMsg('Please enter a valid dues amount.');
                return;
              }

              setIsSubmittingCash(true);
              try {
                if (onRecordCashDues) {
                  await onRecordCashDues({
                    studentName: cashStudentName.trim(),
                    purdueEmail: cashPurdueEmail.trim().toLowerCase(),
                    amountPaid: amountNum,
                    semester: cashSemester,
                    committeeId: committee.id,
                    paymentDate: cashPaymentDate,
                  });
                }
                setCashSuccessMsg(`Recorded $${amountNum.toFixed(2)} cash dues payment for ${cashStudentName.trim()}!`);
                setCashStudentName('');
                setCashPurdueEmail('');
                setTimeout(() => {
                  setIsCashDuesModalOpen(false);
                  setCashSuccessMsg(null);
                }, 1200);
              } catch (err: any) {
                setCashErrorMsg(err?.message || 'Failed to record cash dues payment.');
              } finally {
                setIsSubmittingCash(false);
              }
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Student Full Name *</Label>
              <Input
                required
                value={cashStudentName}
                onChange={(e) => setCashStudentName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="bg-slate-900 border-slate-700 text-slate-100 h-9 text-xs focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Purdue Email (@purdue.edu) *</Label>
              <Input
                required
                type="email"
                value={cashPurdueEmail}
                onChange={(e) => setCashPurdueEmail(e.target.value)}
                placeholder="e.g. arivera@purdue.edu"
                className="bg-slate-900 border-slate-700 text-slate-100 h-9 text-xs focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Amount Paid ($) *</Label>
                <Select value={cashAmount} onValueChange={setCashAmount}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 h-9 text-xs">
                    <SelectValue placeholder="Select amount" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <SelectItem value="10.00">$10.00 (Single Semester)</SelectItem>
                    <SelectItem value="15.00">$15.00 (Annual Dues)</SelectItem>
                    <SelectItem value="20.00">$20.00 (Special Rate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Semester *</Label>
                <Select value={cashSemester} onValueChange={setCashSemester}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 h-9 text-xs">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                    <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                    <SelectItem value="Annual 2025-2026">Annual 2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Payment Date</Label>
              <Input
                type="date"
                value={cashPaymentDate}
                onChange={(e) => setCashPaymentDate(e.target.value)}
                className="bg-slate-900 border-slate-700 text-slate-100 h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCashDuesModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingCash}
                className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
              >
                {isSubmittingCash ? 'Recording...' : 'Save Cash Dues'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Committee Purchase History Table */}
      <Card className="bg-[#121214] border-slate-800 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-sky-400" />
              <span>Purchase & Reimbursement History</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              All purchase requests and reimbursement disbursements submitted for {committee.shortName}.
            </CardDescription>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Filter requests..."
                className="pl-9 h-8 bg-slate-900 border-slate-700 text-xs text-slate-200"
              />
            </div>

            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
              <SelectTrigger className="h-8 w-36 bg-slate-900 border-slate-700 text-xs text-slate-200">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-slate-200 text-xs">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="PURCHASED">Purchased</SelectItem>
                <SelectItem value="REIMBURSED">Reimbursed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-900/60 border-b border-slate-800">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6">Req ID</TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Requester</TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Vendor / Item</TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Category</TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Amount</TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center">Status</TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-sky-400 pl-6 py-3.5 font-medium">
                      {item.id}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="font-medium text-xs text-slate-200">{item.requesterName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.requesterEmail}</div>
                    </TableCell>
                    <TableCell className="py-3.5 max-w-[260px]">
                      <div className="font-semibold text-xs text-slate-100">{item.vendorName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{item.description}</div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-white">
                      ${item.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      {item.receiptUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-600">None</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                    <p className="text-sm font-medium">No purchase requests matching current filter.</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Click "New Purchase Request" above to submit an expense for reimbursement.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Committee Banking Audit Ledger & Revision History */}
      <BankingAuditLedgerView
        entries={auditLogs}
        currentCommitteeId={committee.id}
        committees={committees}
        isTreasurer={false}
      />

      {/* New Purchase Request Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent
          className="max-w-2xl bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-sky-400" />
              <span>Submit New Purchase Request · {committee.shortName}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Submit an itemized expense for treasurer review and Purdue COOL / BOSOP reimbursement.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitPurchase} className="space-y-4 py-2">
            {/* BOSO & Amazon Guidance Notice */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-1.5">
              <div className="font-semibold flex items-center gap-1.5 text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Purdue BOSO & Reimbursement Guidelines</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-amber-200/90 space-y-1 pl-1">
                <li>
                  <strong>Group by invoice:</strong> Submit requests per vendor/invoice (do not submit individual items on separate forms).
                </li>
                <li>
                  <strong>Amazon Purchases:</strong> Uploaded invoice/receipt <strong>MUST state DELIVERED</strong> for BOSO check clearance.
                </li>
              </ul>
            </div>

            {/* Requester Identity & Purdue Career Alias */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-1">
                <Label htmlFor="req-name" className="text-xs font-medium text-slate-300">
                  Name (First Last) *
                </Label>
                <Input
                  id="req-name"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <Label htmlFor="req-username" className="text-xs font-medium text-slate-300">
                  Purdue Username *
                </Label>
                <Input
                  id="req-username"
                  value={purdueUsername}
                  onChange={(e) => setPurdueUsername(e.target.value)}
                  placeholder="e.g. arivera"
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9 font-mono"
                  required
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <Label htmlFor="req-email" className="text-xs font-medium text-slate-300">
                  Purdue Email Address *
                </Label>
                <Input
                  id="req-email"
                  type="email"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  placeholder="e.g. arivera@purdue.edu"
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  required
                />
              </div>
            </div>

            {/* Contact Phone & Mailing Address */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <Label htmlFor="req-phone" className="text-xs font-medium text-slate-300">
                    Phone (XXX-XXX-XXXX) *
                  </Label>
                  <Input
                    id="req-phone"
                    name="tel"
                    type="tel"
                    autoComplete="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 765-555-0199"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="req-street1" className="text-xs font-medium text-slate-300">
                    Street Address *
                  </Label>
                  <Input
                    id="req-street1"
                    name="address-line1"
                    autoComplete="address-line1"
                    value={streetAddress1}
                    onChange={(e) => setStreetAddress1(e.target.value)}
                    placeholder="e.g. 123 University St"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="space-y-1 sm:col-span-4">
                  <Label htmlFor="req-street2" className="text-xs font-medium text-slate-300">
                    Apt / Suite / Unit
                  </Label>
                  <Input
                    id="req-street2"
                    name="address-line2"
                    autoComplete="address-line2"
                    value={streetAddress2}
                    onChange={(e) => setStreetAddress2(e.target.value)}
                    placeholder="e.g. Apt 4B (Optional)"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  />
                </div>

                <div className="space-y-1 sm:col-span-4">
                  <Label htmlFor="req-city" className="text-xs font-medium text-slate-300">
                    City *
                  </Label>
                  <Input
                    id="req-city"
                    name="address-level2"
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. West Lafayette"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="req-state" className="text-xs font-medium text-slate-300">
                    State *
                  </Label>
                  <Input
                    id="req-state"
                    name="address-level1"
                    autoComplete="address-level1"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. IN"
                    maxLength={20}
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="req-zip" className="text-xs font-medium text-slate-300">
                    ZIP Code *
                  </Label>
                  <Input
                    id="req-zip"
                    name="postal-code"
                    autoComplete="postal-code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g. 47906"
                    maxLength={10}
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Funding Source & SFAB Line Item */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2.5">
              <Label className="text-xs font-medium text-slate-300">
                Which IEEE Account to get money from? *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFundingSource('GENERAL')}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left flex items-center justify-between transition-all ${
                    fundingSource === 'GENERAL'
                      ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">GENERAL</div>
                    <div className="text-[10px] text-slate-400">Branch & Committee Budget</div>
                  </div>
                  {fundingSource === 'GENERAL' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setFundingSource('SFAB')}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left flex items-center justify-between transition-all ${
                    fundingSource === 'SFAB'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">SFAB Grant</div>
                    <div className="text-[10px] text-slate-400">Student Fee Advisory Board</div>
                  </div>
                  {fundingSource === 'SFAB' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </button>
              </div>

              {fundingSource === 'SFAB' ? (
                <div className="space-y-1 animate-in fade-in-50 duration-200">
                  <Label htmlFor="sfab-line-item" className="text-xs font-medium text-amber-300">
                    If SFAB, which line item? *
                  </Label>
                  <Input
                    id="sfab-line-item"
                    value={sfabLineItem}
                    onChange={(e) => setSfabLineItem(e.target.value)}
                    placeholder="e.g. Line Item 3.1 Motors & ESCs"
                    className="bg-slate-900 border-amber-500/50 text-slate-100 text-xs h-9"
                    required
                  />
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">Charged against committee general operating budget.</p>
              )}
            </div>

            {/* Check Disbursement Method Selection */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
              <Label className="text-xs font-medium text-slate-300">
                How would you like to receive your check? *
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDisbursementMethod('BOSO_PICKUP')}
                  className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                    disbursementMethod === 'BOSO_PICKUP'
                      ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>Pick up from BOSO</span>
                    {disbursementMethod === 'BOSO_PICKUP' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Krach 365 (Fastest & Safest)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDisbursementMethod('EPAYMENT')}
                  className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                    disbursementMethod === 'EPAYMENT'
                      ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>E-Payment</span>
                    {disbursementMethod === 'EPAYMENT' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Electronic Bank Transfer Email</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDisbursementMethod('MAIL_ADDRESS')}
                  className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                    disbursementMethod === 'MAIL_ADDRESS'
                      ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>Mail to Address</span>
                    {disbursementMethod === 'MAIL_ADDRESS' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Sent to mailing address</div>
                </button>
              </div>
            </div>

            {/* Vendor, Category, Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-1">
                <Label htmlFor="vendor" className="text-xs font-medium text-slate-300">
                  Vendor / Store Name *
                </Label>
                <Input
                  id="vendor"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. DigiKey, Amazon, McMaster"
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <Label htmlFor="req-category" className="text-xs font-medium text-slate-300">
                  Budget Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="req-category" className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                    {committee.categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 sm:col-span-1">
                <Label htmlFor="amount" className="text-xs font-medium text-slate-300">
                  Total Amount ($) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9 font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc" className="text-xs font-medium text-slate-300">
                Item Description & Technical Justification
              </Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what was purchased and how it benefits the committee's technical projects..."
                className="bg-slate-900 border-slate-700 text-slate-100 text-xs min-h-[70px]"
              />
            </div>

            {/* Receipt Dropzone */}
            <div className="space-y-1.5">
              <Label htmlFor="receipt-file-input" className="text-xs font-medium text-slate-300">
                Receipt Attachment (PDF or Image) *
              </Label>

              {receiptFile ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs">
                  <div className="flex items-center gap-2 text-sky-300 truncate">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="font-semibold truncate">{receiptFile.name}</span>
                    <span className="text-slate-400 font-mono">({receiptFile.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReceiptFile(null)}
                    className="text-slate-400 hover:text-red-400 p-1"
                    aria-label="Remove receipt file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? 'border-sky-400 bg-sky-500/10'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  }`}
                  onClick={() => document.getElementById('receipt-file-input')?.click()}
                >
                  <input
                    id="receipt-file-input"
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-200">
                    Click to browse or drag and drop receipt file
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports PNG, JPG, WEBP, or PDF up to 25 MB
                  </p>
                </div>
              )}
            </div>

            {formError && (
              <div role="alert" className="p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-xs text-red-300">
                {formError}
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-slate-800 flex items-center justify-between sm:justify-between">
              <span className="text-[11px] text-slate-500">
                Processed via BoilerBooks 3.0 Private R2 storage
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="bg-slate-900 border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-md"
                >
                  Submit Request
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Receipt Preview Modal */}
      {previewItem && (
        <ReceiptPreviewModal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          receiptUrl={previewItem.receiptUrl}
          receiptFilename={previewItem.receiptFilename}
          requesterName={previewItem.requesterName}
          vendorName={previewItem.vendorName}
          totalAmount={previewItem.totalAmount}
          description={previewItem.description}
        />
      )}
    </div>
  );
}

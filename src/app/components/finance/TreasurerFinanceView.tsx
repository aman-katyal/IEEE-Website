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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import {
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  UploadCloud,
  FileText,
  Search,
  Users,
  MessageSquare,
} from 'lucide-react';
import {
  type PurchaseItem,
  type MemberDuesRecord,
  type AuthSessionData,
  REAL_COMMITTEES,
  type PurchaseStatus,
} from './financeData';
import { ReceiptPreviewModal } from './ReceiptPreviewModal';

export interface TreasurerFinanceViewProps {
  session: AuthSessionData;
  purchases: PurchaseItem[];
  memberDues: MemberDuesRecord[];
  onUpdatePurchaseStatus: (
    id: string,
    status: PurchaseStatus,
    notes?: string,
    coolAccountNumber?: string
  ) => void;
  onImportMemberDues: (records: MemberDuesRecord[]) => void;
  onLogout?: () => void;
}

export function TreasurerFinanceView({
  session: _session,
  purchases,
  memberDues,
  onUpdatePurchaseStatus,
  onImportMemberDues,
  onLogout,
}: TreasurerFinanceViewProps) {
  // Master Spending Matrix Data Calculation
  const matrixData = useMemo(() => {
    return REAL_COMMITTEES.map((comm) => {
      const commPurchases = purchases.filter((p) => p.committeeId === comm.id);
      const allocated = comm.allocated;
      const approved = commPurchases
        .filter((p) => p.status === 'APPROVED' || p.status === 'PURCHASED' || p.status === 'REIMBURSED')
        .reduce((sum, p) => sum + p.totalAmount, 0);
      const pending = commPurchases
        .filter((p) => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.totalAmount, 0);
      const reimbursed = commPurchases
        .filter((p) => p.status === 'REIMBURSED')
        .reduce((sum, p) => sum + p.totalAmount, 0);
      const remaining = Math.max(allocated - approved, 0);
      const percentSpent = allocated > 0 ? Math.min(Math.round((approved / allocated) * 100), 100) : 0;

      return {
        ...comm,
        approved,
        pending,
        reimbursed,
        remaining,
        percentSpent,
        totalRequests: commPurchases.length,
      };
    });
  }, [purchases]);

  // Branch-Wide Totals
  const branchTotals = useMemo(() => {
    const totalAllocated = matrixData.reduce((sum, c) => sum + c.allocated, 0);
    const totalSpent = matrixData.reduce((sum, c) => sum + c.approved, 0);
    const totalPending = matrixData.reduce((sum, c) => sum + c.pending, 0);
    const totalRemaining = matrixData.reduce((sum, c) => sum + c.remaining, 0);
    const totalRequests = purchases.length;
    const branchPercentSpent =
      totalAllocated > 0 ? Math.min(Math.round((totalSpent / totalAllocated) * 100), 100) : 0;

    return {
      totalAllocated,
      totalSpent,
      totalPending,
      totalRemaining,
      totalRequests,
      branchPercentSpent,
    };
  }, [matrixData, purchases]);

  // Pending Approvals Queue
  const pendingRequests = useMemo(() => {
    return purchases.filter((p) => p.status === 'PENDING');
  }, [purchases]);

  // Approved Requests for COOL Batching
  const approvedRequestsForCOOL = useMemo(() => {
    return purchases.filter((p) => p.status === 'APPROVED');
  }, [purchases]);

  // Modals State
  const [isCOOLExporterOpen, setIsCOOLExporterOpen] = useState<boolean>(false);
  const [isDuesImporterOpen, setIsDuesImporterOpen] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<PurchaseItem | null>(null);
  const [notesModalItem, setNotesModalItem] = useState<PurchaseItem | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');
  const [accountNumberInput, setAccountNumberInput] = useState<string>('');

  // COOL Exporter Clipboard & Download Feedback
  const [copiedCOOL, setCopiedCOOL] = useState<boolean>(false);

  // TooCOOL Importer State
  const [importedCsvData, setImportedCsvData] = useState<MemberDuesRecord[]>([]);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDraggingCsv, setIsDraggingCsv] = useState<boolean>(false);

  // Dues Directory Search & Filter
  const [duesSearch, setDuesSearch] = useState<string>('');
  const [duesSemesterFilter, setDuesSemesterFilter] = useState<string>('ALL');

  const filteredDuesDirectory = useMemo(() => {
    return memberDues.filter((d) => {
      const matchesQuery =
        duesSearch.trim() === '' ||
        d.studentName.toLowerCase().includes(duesSearch.toLowerCase()) ||
        d.purdueEmail.toLowerCase().includes(duesSearch.toLowerCase());
      const matchesSemester =
        duesSemesterFilter === 'ALL' || d.semester === duesSemesterFilter;
      return matchesQuery && matchesSemester;
    });
  }, [memberDues, duesSearch, duesSemesterFilter]);

  // Handle Approvals
  const handleApprove = (item: PurchaseItem) => {
    onUpdatePurchaseStatus(item.id, 'APPROVED');
  };

  const handleReject = (item: PurchaseItem) => {
    onUpdatePurchaseStatus(item.id, 'REJECTED');
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesModalItem) return;
    onUpdatePurchaseStatus(
      notesModalItem.id,
      notesModalItem.status,
      notesInput.trim(),
      accountNumberInput.trim() || undefined
    );
    setNotesModalItem(null);
  };

  const openNotesModal = (item: PurchaseItem) => {
    setNotesModalItem(item);
    setNotesInput(item.treasurerNotes || '');
    setAccountNumberInput(item.coolAccountNumber || '01-234-56');
  };

  // Generate COOL Formatted Text
  const generatedCOOLText = useMemo(() => {
    if (approvedRequestsForCOOL.length === 0) {
      return 'PURDUE COOL / BOSOP BATCH EXPORT\nNo approved purchase requests currently pending reimbursement transfer.';
    }

    const total = approvedRequestsForCOOL.reduce((sum, r) => sum + r.totalAmount, 0);
    const dateStr = new Date().toLocaleDateString('en-US');

    const header = [
      '================================================================================',
      `PURDUE COOL / BOSOP REIMBURSEMENT BATCH EXPORT`,
      `Date: ${dateStr} | Total Count: ${approvedRequestsForCOOL.length} | Total Sum: $${total.toFixed(2)}`,
      '================================================================================',
    ].join('\n');

    const body = approvedRequestsForCOOL
      .map((item, idx) => {
        return [
          `[${idx + 1}] Req ID: ${item.id} | Committee: ${item.committeeName}`,
          `    Student: ${item.requesterName} <${item.requesterEmail}>`,
          `    Vendor: ${item.vendorName}`,
          `    Account Line: ${item.coolAccountNumber || '01-234-56'}`,
          `    Amount: $${item.totalAmount.toFixed(2)}`,
          `    Receipt: ${item.receiptFilename || 'Digital Attachment Verified'}`,
          `    Notes: ${item.treasurerNotes || 'None'}`,
          `    Description: ${item.description}`,
        ].join('\n');
      })
      .join('\n\n');

    return `${header}\n\n${body}\n`;
  }, [approvedRequestsForCOOL]);

  // Copy COOL text to clipboard
  const handleCopyCOOLText = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(generatedCOOLText).catch(() => {});
    }
    setCopiedCOOL(true);
    setTimeout(() => setCopiedCOOL(false), 2000);
  };

  // Download COOL CSV
  const handleDownloadCOOLCsv = () => {
    if (approvedRequestsForCOOL.length === 0) return;

    const headers = [
      'Request ID',
      'Committee',
      'Student Requester',
      'Purdue Email',
      'Vendor',
      'Account Line',
      'Total Amount',
      'Receipt Filename',
      'Description',
      'Submitted Date',
    ];

    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;

    const rows = approvedRequestsForCOOL.map((r) => [
      escapeCsv(r.id),
      escapeCsv(r.committeeName),
      escapeCsv(r.requesterName),
      escapeCsv(r.requesterEmail),
      escapeCsv(r.vendorName),
      escapeCsv(r.coolAccountNumber || '01-234-56'),
      r.totalAmount.toFixed(2),
      escapeCsv(r.receiptFilename || ''),
      escapeCsv(r.description),
      escapeCsv(r.submittedAt),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `purdue-cool-batch-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mark all approved as reimbursed
  const handleBatchMarkReimbursed = () => {
    approvedRequestsForCOOL.forEach((item) => {
      onUpdatePurchaseStatus(item.id, 'REIMBURSED', 'Batch processed in Purdue COOL');
    });
    setIsCOOLExporterOpen(false);
  };

  // CSV Parsing for TooCOOL Dues
  const handleParseCsv = (content: string, filename: string) => {
    setImportError(null);
    try {
      const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        setImportError('CSV file appears empty or missing data rows.');
        return;
      }

      // Simple header detection & parsing
      const parsedRecords: MemberDuesRecord[] = [];
      const dataLines = lines.slice(1); // skip header

      dataLines.forEach((line, idx) => {
        const parts = line.split(',').map((p) => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 2) {
          const name = parts[0] || `Student ${idx + 1}`;
          const email = parts[1] || `user${idx + 1}@purdue.edu`;
          const amount = parts[2] ? parseFloat(parts[2]) : 15.0;
          const method = (parts[3] as any) || 'TooCOOL';
          const sem = parts[4] || 'Spring 2026';

          parsedRecords.push({
            id: `DUES-${Math.floor(1000 + Math.random() * 9000)}`,
            studentName: name,
            purdueEmail: email,
            amountPaid: isNaN(amount) ? 15.0 : amount,
            paymentMethod: ['TooCOOL', 'Cash', 'Card'].includes(method) ? method : 'TooCOOL',
            paymentDate: new Date().toISOString().split('T')[0],
            semester: sem,
            status: 'Active',
          });
        }
      });

      if (parsedRecords.length === 0) {
        setImportError('Could not parse any valid student dues records from CSV.');
        return;
      }

      setImportedCsvData(parsedRecords);
      setImportFileName(filename);
    } catch {
      setImportError('Failed to parse CSV file. Ensure valid RFC 4180 format.');
    }
  };

  const handleCsvFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingCsv(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        handleParseCsv(event.target?.result as string, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleCsvFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        handleParseCsv(event.target?.result as string, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleExecuteDuesImport = () => {
    if (importedCsvData.length === 0) return;
    onImportMemberDues(importedCsvData);
    setImportedCsvData([]);
    setImportFileName(null);
    setIsDuesImporterOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#121214] border border-slate-700/80 rounded-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Executive Treasurer Console</h2>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
                Master Administration
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Purdue IEEE BoilerBooks 3.0 · Cloudflare D1 & R2 Financial Ledger
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => setIsCOOLExporterOpen(true)}
            className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-medium shadow-md flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Purdue COOL Batch Exporter ({approvedRequestsForCOOL.length})</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDuesImporterOpen(true)}
            className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-sky-400" />
            <span>Import TooCOOL Dues</span>
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

      {/* Branch Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Branch Budget */}
        <Card className="bg-[#121214] border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Branch Total Budget
            </span>
            <DollarSign className="w-4 h-4 text-[#EBD3A9]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            ${branchTotals.totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 8 Technical Committees</p>
        </Card>

        {/* Total Spent */}
        <Card className="bg-[#121214] border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Disbursed & Approved
            </span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400 mt-2 font-mono">
            ${branchTotals.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={branchTotals.branchPercentSpent} className="h-1.5 bg-slate-800 flex-1" />
            <span className="text-[11px] font-mono text-slate-400">
              {branchTotals.branchPercentSpent}%
            </span>
          </div>
        </Card>

        {/* Pending Approval Requests */}
        <Card className="bg-[#121214] border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Pending Queue Total
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2 font-mono">
            ${branchTotals.totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-amber-400/80 mt-1">
            {pendingRequests.length} requests awaiting your review
          </p>
        </Card>

        {/* Total Branch Remaining */}
        <Card className="bg-[#121214] border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Remaining Balance
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">
            ${branchTotals.totalRemaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Available branch-wide surplus</p>
        </Card>
      </div>

      {/* Main Tabs: Pending Approvals | Master Spending Matrix | Dues Directory */}
      <Tabs defaultValue="approvals" className="w-full">
        <TabsList className="bg-slate-900/90 border border-slate-800 p-1 rounded-lg">
          <TabsTrigger
            value="approvals"
            className="data-[state=active]:bg-sky-600 data-[state=active]:text-white text-slate-300 text-xs px-4"
          >
            Pending Approvals ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger
            value="matrix"
            className="data-[state=active]:bg-sky-600 data-[state=active]:text-white text-slate-300 text-xs px-4"
          >
            Master Spending Matrix
          </TabsTrigger>
          <TabsTrigger
            value="dues"
            className="data-[state=active]:bg-sky-600 data-[state=active]:text-white text-slate-300 text-xs px-4"
          >
            Dues Directory ({memberDues.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Pending Approvals Queue */}
        <TabsContent value="approvals" className="mt-4 space-y-4">
          <Card className="bg-[#121214] border-slate-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800 px-6 py-4">
              <CardTitle className="text-base font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>Pending Purchase Approvals Queue</span>
                </span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  {pendingRequests.length} pending items
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Review receipts, verify Purdue sales tax exemption status, and approve or reject submissions.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-900/60 border-b border-slate-800">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6">Req ID</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Committee</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Requester</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Vendor / Item</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Amount</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center">Receipt</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                      >
                        <TableCell className="font-mono text-xs text-sky-400 pl-6 py-3.5 font-medium">
                          {item.id}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className="font-semibold text-xs text-slate-200">{item.committeeName}</span>
                          <div className="text-[11px] text-slate-500">{item.category}</div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <div className="font-medium text-xs text-slate-200">{item.requesterName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{item.requesterEmail}</div>
                        </TableCell>
                        <TableCell className="py-3.5 max-w-[240px]">
                          <div className="font-semibold text-xs text-slate-100">{item.vendorName}</div>
                          <div className="text-[11px] text-slate-400 truncate">{item.description}</div>
                        </TableCell>
                        <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-amber-400">
                          ${item.totalAmount.toFixed(2)}
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
                        <TableCell className="text-right py-3.5 pr-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => openNotesModal(item)}
                              className="h-8 px-2 text-slate-400 hover:text-white hover:bg-slate-800"
                              title="Add / Edit Notes"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleReject(item)}
                              className="h-8 px-2.5 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Reject
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleApprove(item)}
                              className="h-8 px-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400/60 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-300">Approvals Queue is Clear</p>
                        <p className="text-xs text-slate-500 mt-1">
                          No purchase requests are currently awaiting treasurer sign-off.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Master Spending Matrix */}
        <TabsContent value="matrix" className="mt-4 space-y-4">
          <Card className="bg-[#121214] border-slate-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800 px-6 py-4">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-400" />
                <span>Technical Committees Master Spending Matrix</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Comparative budget overview, allocated capital, pending liabilities, and remaining balances per committee.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-900/60 border-b border-slate-800">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6">Committee</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Allocated</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Spent / Disbursed</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Pending</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Remaining</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center w-48">% Spent</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center pr-6">Requests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matrixData.map((c) => (
                    <TableRow
                      key={c.id}
                      className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell className="pl-6 py-3.5">
                        <div className="font-semibold text-xs text-white">{c.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{c.contactEmail}</div>
                      </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs font-medium text-slate-200">
                        ${c.allocated.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-sky-400">
                        ${c.approved.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs text-amber-400">
                        ${c.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-emerald-400">
                        ${c.remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center py-3.5">
                        <div className="flex items-center gap-2 px-2">
                          <Progress
                            value={c.percentSpent}
                            className={`h-2 flex-1 ${
                              c.percentSpent > 90
                                ? 'bg-red-950 text-red-500'
                                : c.percentSpent > 70
                                ? 'bg-amber-950 text-amber-500'
                                : 'bg-slate-800'
                            }`}
                          />
                          <span className="text-[11px] font-mono text-slate-300 w-10 text-right">
                            {c.percentSpent}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-3.5 font-mono text-xs text-slate-400 pr-6">
                        {c.totalRequests}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Member Dues Directory */}
        <TabsContent value="dues" className="mt-4 space-y-4">
          <Card className="bg-[#121214] border-slate-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  <span>Student Member Dues Directory</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Real-time dues payment records imported from Purdue TooCOOL and direct cash payments.
                </CardDescription>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-48 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={duesSearch}
                    onChange={(e) => setDuesSearch(e.target.value)}
                    placeholder="Search by student name or email..."
                    className="pl-9 h-8 bg-slate-900 border-slate-700 text-xs text-slate-200"
                  />
                </div>

                <Select value={duesSemesterFilter} onValueChange={setDuesSemesterFilter}>
                  <SelectTrigger className="h-8 w-36 bg-slate-900 border-slate-700 text-xs text-slate-200">
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200 text-xs">
                    <SelectItem value="ALL">All Semesters</SelectItem>
                    <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                    <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-900/60 border-b border-slate-800">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6">Record ID</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Student Name</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Purdue Email</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Semester</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Payment Method</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Amount</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDuesDirectory.length > 0 ? (
                    filteredDuesDirectory.map((record) => (
                      <TableRow
                        key={record.id}
                        className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                      >
                        <TableCell className="font-mono text-xs text-slate-400 pl-6 py-3">
                          {record.id}
                        </TableCell>
                        <TableCell className="font-semibold text-xs text-white py-3">
                          {record.studentName}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-300 py-3">
                          {record.purdueEmail}
                        </TableCell>
                        <TableCell className="text-xs text-slate-300 py-3">
                          {record.semester}
                        </TableCell>
                        <TableCell className="text-xs text-slate-300 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                            {record.paymentMethod}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-white py-3">
                          ${record.amountPaid.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center py-3 pr-6">
                          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px]">
                            ACTIVE
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                        No member dues records matching your search query.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Purdue COOL Batch Exporter Modal */}
      <Dialog open={isCOOLExporterOpen} onOpenChange={setIsCOOLExporterOpen}>
        <DialogContent
          className="max-w-3xl bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-sky-400" />
              <span>Purdue COOL / BOSOP Batch Exporter</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Generates formatted data for administrative entry into Purdue University COOL / BOSO financial system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs">
              <div>
                <span className="font-semibold text-white">Batch Ready:</span>{' '}
                <span className="text-sky-300">{approvedRequestsForCOOL.length} Approved Requests</span>
              </div>
              <div className="font-mono text-sm font-bold text-white">
                Total: $
                {approvedRequestsForCOOL
                  .reduce((sum, r) => sum + r.totalAmount, 0)
                  .toFixed(2)}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="cool-preview-text" className="text-xs font-medium text-slate-300">
                  Formatted Purdue COOL Batch Text (1-Click Clipboard Copy)
                </Label>
                <button
                  type="button"
                  onClick={handleCopyCOOLText}
                  className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
                >
                  {copiedCOOL ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                id="cool-preview-text"
                readOnly
                value={generatedCOOLText}
                rows={10}
                className="w-full font-mono text-[11px] p-3 rounded-lg bg-[#0a0a0c] border border-slate-700 text-slate-300 focus:outline-none select-all"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadCOOLCsv}
                disabled={approvedRequestsForCOOL.length === 0}
                className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Download COOL CSV</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCOOLExporterOpen(false)}
                  className="bg-slate-900 border-slate-700 text-slate-300"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleBatchMarkReimbursed}
                  disabled={approvedRequestsForCOOL.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark All as Reimbursed</span>
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* TooCOOL Dues Importer Modal */}
      <Dialog open={isDuesImporterOpen} onOpenChange={setIsDuesImporterOpen}>
        <DialogContent
          className="max-w-2xl bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-sky-400" />
              <span>Import Purdue TooCOOL Dues CSV</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Batch ingest student membership dues exported from Purdue TooCOOL.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingCsv(true);
              }}
              onDragLeave={() => setIsDraggingCsv(false)}
              onDrop={handleCsvFileDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDraggingCsv
                  ? 'border-sky-400 bg-sky-500/10'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
              }`}
              onClick={() => document.getElementById('dues-csv-input')?.click()}
            >
              <input
                id="dues-csv-input"
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleCsvFileInput}
              />
              <FileSpreadsheet className="w-8 h-8 text-sky-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-200">
                Click to browse or drop TooCOOL .csv export file here
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Accepts standard TooCOOL CSV format (Student Name, Purdue Email, Amount, Method, Semester)
              </p>
            </div>

            {importError && (
              <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-xs text-red-300">
                {importError}
              </div>
            )}

            {importedCsvData.length > 0 && (
              <div className="space-y-2 p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    Parsed {importedCsvData.length} records from {importFileName}
                  </span>
                  <span className="text-emerald-400 font-mono">Ready to Ingest</span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-[11px]">
                  {importedCsvData.slice(0, 5).map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded bg-slate-800/40 text-slate-300">
                      <span>{rec.studentName} ({rec.purdueEmail})</span>
                      <span className="font-mono text-white">${rec.amountPaid.toFixed(2)}</span>
                    </div>
                  ))}
                  {importedCsvData.length > 5 && (
                    <div className="text-center text-[10px] text-slate-500 pt-1">
                      + {importedCsvData.length - 5} more records
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-slate-800 flex items-center justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDuesImporterOpen(false)}
                className="bg-slate-900 border-slate-700 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleExecuteDuesImport}
                disabled={importedCsvData.length === 0}
                className="bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-md"
              >
                Import {importedCsvData.length} Records
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Notes / Account Line Modal */}
      {notesModalItem && (
        <Dialog open={!!notesModalItem} onOpenChange={(open) => !open && setNotesModalItem(null)}>
          <DialogContent
            className="max-w-md bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6"
          >
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>Treasurer Notes & Account Line · {notesModalItem.id}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Update BOSO account line number and feedback for {notesModalItem.requesterName}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveNotes} className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="account-line" className="text-xs font-medium text-slate-300">
                  Purdue BOSO Account Line
                </Label>
                <Input
                  id="account-line"
                  value={accountNumberInput}
                  onChange={(e) => setAccountNumberInput(e.target.value)}
                  placeholder="01-234-56"
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs font-mono h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="treasurer-notes" className="text-xs font-medium text-slate-300">
                  Treasurer Audit Notes
                </Label>
                <Textarea
                  id="treasurer-notes"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Tax-exempt verified, direct deposit pending in COOL..."
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs min-h-[80px]"
                />
              </div>

              <DialogFooter className="pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNotesModalItem(null)}
                  className="bg-slate-900 border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-sky-600 hover:bg-sky-500 text-white font-medium"
                >
                  Save Notes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

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

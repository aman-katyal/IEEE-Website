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
  Settings2,
  Plus,
  PlusCircle,
  Coins,
  Trash2,
  X,
} from 'lucide-react';
import {
  type PurchaseItem,
  type MemberDuesRecord,
  type AuthSessionData,
  type CommitteeInfo,
  type CommitteeFundingInflow,
  type InflowSourceType,
  INITIAL_FUNDING_INFLOWS,
  REAL_COMMITTEES,
  type PurchaseStatus,
} from './financeData';
import { ReceiptPreviewModal } from './ReceiptPreviewModal';
import { formatCurrencyUSD } from '@/lib/formatters';

export interface TreasurerFinanceViewProps {
  session: AuthSessionData;
  purchases: PurchaseItem[];
  memberDues: MemberDuesRecord[];
  committees?: CommitteeInfo[];
  fundingInflows?: CommitteeFundingInflow[];
  onUpdatePurchaseStatus: (
    id: string,
    status: PurchaseStatus,
    notes?: string,
    coolAccountNumber?: string
  ) => void;
  onImportMemberDues: (records: MemberDuesRecord[]) => void;
  onUpdateCommittee?: (committeeId: string, updated: Partial<CommitteeInfo>) => void;
  onAddFundingInflow?: (inflow: CommitteeFundingInflow) => void;
  onDeleteFundingInflow?: (id: string) => void;
  onLogout?: () => void;
}

export function TreasurerFinanceView({
  session: _session,
  purchases,
  memberDues,
  committees,
  fundingInflows = INITIAL_FUNDING_INFLOWS,
  onUpdatePurchaseStatus,
  onImportMemberDues,
  onUpdateCommittee,
  onAddFundingInflow,
  onDeleteFundingInflow,
  onLogout,
}: TreasurerFinanceViewProps) {
  const activeCommittees = useMemo(() => {
    return committees && committees.length > 0 ? committees : REAL_COMMITTEES;
  }, [committees]);

  // Master Spending Matrix Data Calculation (Base Allocated + Inflow Grants)
  const matrixData = useMemo(() => {
    return activeCommittees.map((comm) => {
      const commPurchases = purchases.filter((p) => p.committeeId === comm.id);
      const commInflows = (fundingInflows || []).filter((inf) => inf.committeeId === comm.id);
      const totalInflows = commInflows.reduce((sum, inf) => sum + inf.amount, 0);
      const baseAllocated = comm.allocated;
      const totalBudget = baseAllocated + totalInflows;

      const approved = commPurchases
        .filter((p) => p.status === 'APPROVED' || p.status === 'PURCHASED' || p.status === 'REIMBURSED')
        .reduce((sum, p) => sum + p.totalAmount, 0);
      const pending = commPurchases
        .filter((p) => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.totalAmount, 0);
      const reimbursed = commPurchases
        .filter((p) => p.status === 'REIMBURSED')
        .reduce((sum, p) => sum + p.totalAmount, 0);
      const remaining = Math.max(totalBudget - approved, 0);
      const percentSpent = totalBudget > 0 ? Math.min(Math.round((approved / totalBudget) * 100), 100) : 0;

      return {
        ...comm,
        baseAllocated,
        totalInflows,
        inflowsCount: commInflows.length,
        totalBudget,
        approved,
        pending,
        reimbursed,
        remaining,
        percentSpent,
        totalRequests: commPurchases.length,
      };
    });
  }, [activeCommittees, purchases, fundingInflows]);

  // Branch-Wide Totals
  const branchTotals = useMemo(() => {
    const totalAllocated = matrixData.reduce((sum, c) => sum + c.baseAllocated, 0);
    const totalInflows = (fundingInflows || []).reduce((sum, inf) => sum + inf.amount, 0);
    const totalBranchBudget = totalAllocated + totalInflows;
    const totalSpent = matrixData.reduce((sum, c) => sum + c.approved, 0);
    const totalPending = matrixData.reduce((sum, c) => sum + c.pending, 0);
    const totalRemaining = matrixData.reduce((sum, c) => sum + c.remaining, 0);
    const totalRequests = purchases.length;
    const branchPercentSpent =
      totalBranchBudget > 0 ? Math.min(Math.round((totalSpent / totalBranchBudget) * 100), 100) : 0;

    return {
      totalAllocated,
      totalInflows,
      totalBranchBudget,
      totalSpent,
      totalPending,
      totalRemaining,
      totalRequests,
      branchPercentSpent,
    };
  }, [matrixData, purchases, fundingInflows]);

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

  // Committee Parameters Editing Modal State
  const [editingCommittee, setEditingCommittee] = useState<CommitteeInfo | null>(null);
  const [editAllocated, setEditAllocated] = useState<string>('');
  const [editBankStatus, setEditBankStatus] = useState<'Active' | 'Inactive' | 'Read-Only'>('Active');
  const [editDuesStatus, setEditDuesStatus] = useState<'Active' | 'Inactive'>('Active');
  const [editContactEmail, setEditContactEmail] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editCategories, setEditCategories] = useState<string[]>([]);
  const [newCategoryText, setNewCategoryText] = useState<string>('');

  const handleOpenEditCommittee = (c: CommitteeInfo) => {
    setEditingCommittee(c);
    setEditAllocated(String(c.allocated));
    setEditBankStatus(c.bankStatus || 'Active');
    setEditDuesStatus(c.duesStatus || 'Active');
    setEditContactEmail(c.contactEmail || '');
    setEditNotes(c.notes || '');
    setEditCategories([...(c.categories || [])]);
    setNewCategoryText('');
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryText.trim();
    if (trimmed && !editCategories.includes(trimmed)) {
      setEditCategories((prev) => [...prev, trimmed]);
      setNewCategoryText('');
    }
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setEditCategories((prev) => prev.filter((cat) => cat !== catToRemove));
  };

  const handleSaveCommittee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommittee) return;
    const parsedAllocated = parseFloat(editAllocated);
    if (isNaN(parsedAllocated) || parsedAllocated < 0) return;

    if (onUpdateCommittee) {
      onUpdateCommittee(editingCommittee.id, {
        allocated: parsedAllocated,
        bankStatus: editBankStatus,
        duesStatus: editDuesStatus,
        contactEmail: editContactEmail.trim(),
        notes: editNotes.trim(),
        categories: editCategories,
      });
    }
    setEditingCommittee(null);
  };

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

  // Specific Funding Inflows State & Handlers
  const [isInflowModalOpen, setIsInflowModalOpen] = useState<boolean>(false);
  const [inflowCommitteeId, setInflowCommitteeId] = useState<string>('rov');
  const [inflowSourceType, setInflowSourceType] = useState<InflowSourceType>('SFAB Grant');
  const [inflowTitle, setInflowTitle] = useState<string>('');
  const [inflowAmount, setInflowAmount] = useState<string>('');
  const [inflowRefNumber, setInflowRefNumber] = useState<string>('');
  const [inflowDate, setInflowDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [inflowNotes, setInflowNotes] = useState<string>('');

  // Inflows Tab Filters
  const [inflowFilterCommittee, setInflowFilterCommittee] = useState<string>('ALL');
  const [inflowFilterSource, setInflowFilterSource] = useState<string>('ALL');
  const [inflowSearch, setInflowSearch] = useState<string>('');

  const filteredInflows = useMemo(() => {
    return (fundingInflows || []).filter((item) => {
      const matchesCommittee =
        inflowFilterCommittee === 'ALL' || item.committeeId === inflowFilterCommittee;
      const matchesSource =
        inflowFilterSource === 'ALL' || item.sourceType === inflowFilterSource;
      const query = inflowSearch.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.referenceNumber && item.referenceNumber.toLowerCase().includes(query)) ||
        (item.committeeName && item.committeeName.toLowerCase().includes(query)) ||
        (item.notes && item.notes.toLowerCase().includes(query));
      return matchesCommittee && matchesSource && matchesSearch;
    });
  }, [fundingInflows, inflowFilterCommittee, inflowFilterSource, inflowSearch]);

  const handleOpenInflowModal = (defaultCommId?: string) => {
    if (defaultCommId) {
      setInflowCommitteeId(defaultCommId);
    }
    setInflowTitle('');
    setInflowAmount('');
    setInflowRefNumber('');
    setInflowNotes('');
    setInflowDate(new Date().toISOString().split('T')[0]);
    setIsInflowModalOpen(true);
  };

  const handleSaveInflow = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(inflowAmount);
    if (!inflowTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const targetCommittee = activeCommittees.find((c) => c.id === inflowCommitteeId);
    const newInflow: CommitteeFundingInflow = {
      id: `INFLOW-${Date.now().toString().slice(-4)}`,
      committeeId: inflowCommitteeId,
      committeeName: targetCommittee?.shortName || targetCommittee?.name || inflowCommitteeId,
      sourceType: inflowSourceType,
      title: inflowTitle.trim(),
      amount: parsedAmount,
      referenceNumber: inflowRefNumber.trim() || undefined,
      receivedDate: inflowDate || new Date().toISOString().split('T')[0],
      notes: inflowNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    if (onAddFundingInflow) {
      onAddFundingInflow(newInflow);
    }

    setIsInflowModalOpen(false);
  };

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
      `Date: ${dateStr} | Total Count: ${approvedRequestsForCOOL.length} | Total Sum: ${formatCurrencyUSD(total)}`,
      '================================================================================',
    ].join('\n');

    const body = approvedRequestsForCOOL
      .map((item, idx) => {
        let disbursementLabel = 'BOSO Office Pickup (Krach 365)';
        if (item.disbursementMethod === 'MAIL_ADDRESS') {
          disbursementLabel = `Mail to Address (${item.streetAddress || 'Address on file'})`;
        } else if (item.disbursementMethod === 'EPAYMENT') {
          disbursementLabel = 'E-Payment to Bank Account';
        }

        return [
          `[${idx + 1}] Req ID: ${item.id} | Committee: ${item.committeeName}`,
          `    Student: ${item.requesterName} (Purdue ID: ${item.purdueUsername || 'N/A'}) <${item.requesterEmail}> | Phone: ${item.phoneNumber || 'N/A'}`,
          `    Funding Source: ${item.fundingSource || 'GENERAL'}${item.fundingSource === 'SFAB' ? ` (SFAB Line: ${item.sfabLineItem || 'N/A'})` : ''}`,
          `    Disbursement: ${disbursementLabel}`,
          `    Vendor: ${item.vendorName}`,
          `    Account Line: ${item.coolAccountNumber || '01-234-56'}`,
          `    Amount: ${formatCurrencyUSD(item.totalAmount)}`,
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
      'Purdue Username',
      'Purdue Email',
      'Phone Number',
      'Funding Source',
      'SFAB Line Item',
      'Disbursement Method',
      'Mailing Address',
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
      escapeCsv(r.purdueUsername || ''),
      escapeCsv(r.requesterEmail),
      escapeCsv(r.phoneNumber || ''),
      escapeCsv(r.fundingSource || 'GENERAL'),
      escapeCsv(r.sfabLineItem || 'N/A'),
      escapeCsv(r.disbursementMethod || 'BOSO_PICKUP'),
      escapeCsv(r.streetAddress || ''),
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
    URL.revokeObjectURL(url);
  };

  // Download Master Spending Matrix CSV
  const handleExportMatrixCsv = () => {
    if (matrixData.length === 0) return;

    const headers = [
      'Committee ID',
      'Committee Name',
      'Base Allocated',
      'Grants and Inflows',
      'Total Budget',
      'Spent and Disbursed',
      'Pending Amount',
      'Remaining Balance',
      'Percent Spent',
      'Total Requests',
    ];

    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;

    const rows = matrixData.map((c) => [
      escapeCsv(c.id),
      escapeCsv(c.name),
      c.baseAllocated.toFixed(2),
      c.totalInflows.toFixed(2),
      c.totalBudget.toFixed(2),
      c.approved.toFixed(2),
      c.pending.toFixed(2),
      c.remaining.toFixed(2),
      `${c.percentSpent.toFixed(1)}%`,
      c.totalRequests.toString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `purdue-ieee-spending-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            onClick={() => handleOpenInflowModal()}
            className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium shadow-md flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Specific Funds / Grant</span>
          </Button>

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
        {/* Total Branch Capital */}
        <Card className="bg-[#121214] border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Total Branch Capital
            </span>
            <DollarSign className="w-4 h-4 text-[#EBD3A9]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            {formatCurrencyUSD(branchTotals.totalBranchBudget)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>{formatCurrencyUSD(branchTotals.totalAllocated, { decimals: 0 })} base</span>
            <span className="text-slate-600">+</span>
            <span className="text-emerald-400 font-medium">+{formatCurrencyUSD(branchTotals.totalInflows, { decimals: 0 })} grants</span>
          </p>
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
            {formatCurrencyUSD(branchTotals.totalSpent)}
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
            {formatCurrencyUSD(branchTotals.totalPending)}
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
            {formatCurrencyUSD(branchTotals.totalRemaining)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Available branch-wide surplus</p>
        </Card>
      </div>

      {/* Main Tabs: Pending Approvals | Master Spending Matrix | Grants & Inflows | Dues Directory */}
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
            value="inflows"
            className="data-[state=active]:bg-sky-600 data-[state=active]:text-white text-slate-300 text-xs px-4"
          >
            Grants & Inflows ({fundingInflows.length})
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
                          {formatCurrencyUSD(item.totalAmount)}
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
            <CardHeader className="border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-sky-400" />
                  <span>Technical Committees Master Spending Matrix</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Comparative budget overview, base capital, specific grants & inflows, liabilities, and surplus per committee.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportMatrixCsv}
                  className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Export Matrix CSV</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleOpenInflowModal()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Record Inflow / Grant</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-900/60 border-b border-slate-800">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6">Committee</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Base Allocated</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Grants / Inflows</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Total Budget</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Spent / Disbursed</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Pending</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Remaining</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center w-36">% Spent</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center">Reqs</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right pr-6">Manage</TableHead>
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
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>{c.contactEmail}</span>
                          <span className="text-slate-600">·</span>
                          <span className={`text-[10px] ${c.bankStatus === 'Inactive' ? 'text-red-400' : c.bankStatus === 'Read-Only' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {c.bankStatus || 'Active'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs font-medium text-slate-300">
                        {formatCurrencyUSD(c.baseAllocated)}
                      </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs">
                        {c.totalInflows > 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            +{formatCurrencyUSD(c.totalInflows)}
                          </span>
                        ) : (
                          <span className="text-slate-600">$0.00</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-white">
                        {formatCurrencyUSD(c.totalBudget)}
                      </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-sky-400">
                        {formatCurrencyUSD(c.approved)}
                      </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs text-amber-400">
                        {formatCurrencyUSD(c.pending)}
                      </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-emerald-400">
                        {formatCurrencyUSD(c.remaining)}
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
                      <TableCell className="text-center py-3.5 font-mono text-xs text-slate-400">
                        {c.totalRequests}
                      </TableCell>
                      <TableCell className="text-right py-3.5 pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenInflowModal(c.id)}
                            className="h-7 px-2 text-xs bg-slate-900 border-slate-700 text-emerald-400 hover:text-white hover:bg-slate-800 inline-flex items-center gap-1"
                            title={`Add Inflow for ${c.shortName}`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>Inflow</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditCommittee(c)}
                            className="h-7 px-2 text-xs bg-slate-900 border-slate-700 text-sky-400 hover:text-white hover:bg-slate-800 inline-flex items-center gap-1"
                            title={`Edit ${c.shortName} Budget & Parameters`}
                          >
                            <Settings2 className="w-3 h-3" />
                            <span>Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Specific Funding & Grants Inflows */}
        <TabsContent value="inflows" className="mt-4 space-y-4">
          <Card className="bg-[#121214] border-slate-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  <span>Committee Specific Funding & Grants Ledger</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Track external grants (SFAB), corporate sponsorships, departmental awards, and prize money credited to committees.
                </CardDescription>
              </div>

              {/* Inflow Action & Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-40 sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={inflowSearch}
                    onChange={(e) => setInflowSearch(e.target.value)}
                    placeholder="Search grants or references..."
                    className="pl-9 h-8 bg-slate-900 border-slate-700 text-xs text-slate-200"
                  />
                </div>

                <Select value={inflowFilterCommittee} onValueChange={setInflowFilterCommittee}>
                  <SelectTrigger className="h-8 w-36 bg-slate-900 border-slate-700 text-xs text-slate-200">
                    <SelectValue placeholder="All Committees" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200 text-xs">
                    <SelectItem value="ALL">All Committees</SelectItem>
                    {activeCommittees.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.shortName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={inflowFilterSource} onValueChange={setInflowFilterSource}>
                  <SelectTrigger className="h-8 w-40 bg-slate-900 border-slate-700 text-xs text-slate-200">
                    <SelectValue placeholder="All Source Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200 text-xs">
                    <SelectItem value="ALL">All Source Types</SelectItem>
                    <SelectItem value="SFAB Grant">SFAB Grant</SelectItem>
                    <SelectItem value="Corporate Sponsorship">Corporate Sponsorship</SelectItem>
                    <SelectItem value="Department Allocation">Department Allocation</SelectItem>
                    <SelectItem value="Competition Prize">Competition Prize</SelectItem>
                    <SelectItem value="Donation">Donation</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleOpenInflowModal()}
                  className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Record Inflow</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-900/60 border-b border-slate-800">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6">Inflow ID</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Committee</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Source Type</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Grant / Title</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Reference / Code</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">Date</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">Amount</TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInflows.length > 0 ? (
                    filteredInflows.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                      >
                        <TableCell className="font-mono text-xs text-emerald-400 pl-6 py-3.5 font-medium">
                          {item.id}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className="font-semibold text-xs text-slate-200">
                            {item.committeeName || item.committeeId.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <Badge
                            className={`text-[10px] px-2 py-0.5 border ${
                              item.sourceType === 'SFAB Grant'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : item.sourceType === 'Corporate Sponsorship'
                                ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                                : item.sourceType === 'Department Allocation'
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {item.sourceType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3.5 max-w-[280px]">
                          <div className="font-medium text-xs text-slate-100">{item.title}</div>
                          {item.notes && (
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.notes}</div>
                          )}
                        </TableCell>
                        <TableCell className="py-3.5 font-mono text-xs text-slate-400">
                          {item.referenceNumber || 'N/A'}
                        </TableCell>
                        <TableCell className="py-3.5 font-mono text-xs text-slate-400">
                          {item.receivedDate}
                        </TableCell>
                        <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-emerald-400">
                          +{formatCurrencyUSD(item.amount)}
                        </TableCell>
                        <TableCell className="text-right py-3.5 pr-6">
                          {onDeleteFundingInflow && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteFundingInflow(item.id)}
                              className="h-7 w-7 p-0 text-slate-500 hover:text-red-400 hover:bg-red-950/40"
                              title="Delete inflow record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                        <Coins className="w-8 h-8 text-emerald-400/60 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-300">No Funding Inflows Found</p>
                        <p className="text-xs text-slate-500 mt-1">
                          No specific grants or corporate sponsorships match the active filters.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Member Dues Directory */}
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
                          {formatCurrencyUSD(record.amountPaid)}
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
                      <span className="font-mono text-white">{formatCurrencyUSD(rec.amountPaid)}</span>
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

      {/* Edit Committee Budget & Parameters Modal */}
      {editingCommittee && (
        <Dialog
          open={!!editingCommittee}
          onOpenChange={(open) => !open && setEditingCommittee(null)}
        >
          <DialogContent className="max-w-xl bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-sky-400" />
                <span>Edit Parameters · {editingCommittee.name}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Update allocated budget capital, operational bank status, member dues policy, and spending categories.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveCommittee} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-allocated" className="text-xs font-medium text-slate-300">
                    Allocated Budget Capital ($) *
                  </Label>
                  <Input
                    id="edit-allocated"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editAllocated}
                    onChange={(e) => setEditAllocated(e.target.value)}
                    placeholder="10000.00"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs font-mono h-9"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-email" className="text-xs font-medium text-slate-300">
                    Official Contact Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editContactEmail}
                    onChange={(e) => setEditContactEmail(e.target.value)}
                    placeholder="committee@purdueieee.org"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  />
                </div>
              </div>

              {/* Status Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-300">
                    Bank Operational Status
                  </Label>
                  <Select
                    value={editBankStatus}
                    onValueChange={(val: 'Active' | 'Inactive' | 'Read-Only') => setEditBankStatus(val)}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                      <SelectItem value="Active">Active (Reimbursements Open)</SelectItem>
                      <SelectItem value="Read-Only">Read-Only (View Only)</SelectItem>
                      <SelectItem value="Inactive">Inactive (Frozen)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-300">
                    Member Dues Requirement
                  </Label>
                  <Select
                    value={editDuesStatus}
                    onValueChange={(val: 'Active' | 'Inactive') => setEditDuesStatus(val)}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                      <SelectItem value="Active">Active (Requires Paid Dues)</SelectItem>
                      <SelectItem value="Inactive">Inactive (Exempt / Open)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Budget Categories Manager */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-300">
                  Approved Budget Categories ({editCategories.length})
                </Label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg min-h-[44px]">
                  {editCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-sky-400 hover:text-red-400 p-0.5"
                        title={`Remove ${cat}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {editCategories.length === 0 && (
                    <span className="text-xs text-slate-500 italic py-1">No categories assigned.</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    value={newCategoryText}
                    onChange={(e) => setNewCategoryText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                    placeholder="Add new budget category (e.g. Avionics & Telemetry)..."
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCategory}
                    disabled={!newCategoryText.trim()}
                    className="h-8 bg-slate-900 border-slate-700 text-sky-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>

              {/* Budget Allocation Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-notes" className="text-xs font-medium text-slate-300">
                  Treasurer Budget Allocation Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Notes on committee spending guidelines, SFAB funding earmarks, or rollover allocations..."
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs min-h-[70px]"
                />
              </div>

              <DialogFooter className="pt-3 border-t border-slate-800 flex items-center justify-between sm:justify-between">
                <span className="text-[11px] text-slate-500">
                  Updates apply across the finance portal and D1 database.
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCommittee(null)}
                    className="bg-slate-900 border-slate-700 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-sky-600 hover:bg-sky-500 text-white font-medium"
                  >
                    Save Parameters
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Record Specific Committee Funding / Grant Modal */}
      {isInflowModalOpen && (
        <Dialog
          open={isInflowModalOpen}
          onOpenChange={(open) => !open && setIsInflowModalOpen(false)}
        >
          <DialogContent className="max-w-lg bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                <span>Record Specific Committee Funding & Grants</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Credit external grants (SFAB), corporate sponsorships, departmental awards, or prize money directly to a committee's available budget.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveInflow} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-300">
                    Recipient Committee *
                  </Label>
                  <Select
                    value={inflowCommitteeId}
                    onValueChange={setInflowCommitteeId}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs max-h-64">
                      {activeCommittees.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.shortName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-300">
                    Funding Source Type *
                  </Label>
                  <Select
                    value={inflowSourceType}
                    onValueChange={(val: InflowSourceType) => setInflowSourceType(val)}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                      <SelectItem value="SFAB Grant">SFAB Grant (Student Fee Advisory Board)</SelectItem>
                      <SelectItem value="Corporate Sponsorship">Corporate Sponsorship (Lockheed, TI, etc.)</SelectItem>
                      <SelectItem value="Department Allocation">Department Allocation (ECE, ME, AAE)</SelectItem>
                      <SelectItem value="Competition Prize">Competition Prize & Awards</SelectItem>
                      <SelectItem value="Donation">Alumni / Donor Gift</SelectItem>
                      <SelectItem value="Other">Other Miscellaneous Inflow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inflow-title" className="text-xs font-medium text-slate-300">
                  Grant / Sponsorship Title *
                </Label>
                <Input
                  id="inflow-title"
                  value={inflowTitle}
                  onChange={(e) => setInflowTitle(e.target.value)}
                  placeholder="e.g. SFAB Spring 2026 Vehicle Hardware Grant or Lockheed EV Sponsor"
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="inflow-amount" className="text-xs font-medium text-slate-300">
                    Amount ($) *
                  </Label>
                  <Input
                    id="inflow-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={inflowAmount}
                    onChange={(e) => setInflowAmount(e.target.value)}
                    placeholder="3500.00"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs font-mono h-9"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="inflow-date" className="text-xs font-medium text-slate-300">
                    Received Date *
                  </Label>
                  <Input
                    id="inflow-date"
                    type="date"
                    value={inflowDate}
                    onChange={(e) => setInflowDate(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inflow-ref" className="text-xs font-medium text-slate-300">
                  Grant Reference / PO # / Code (Optional)
                </Label>
                <Input
                  id="inflow-ref"
                  value={inflowRefNumber}
                  onChange={(e) => setInflowRefNumber(e.target.value)}
                  placeholder="e.g. SFAB-2026-ROV-01 or PO-98124"
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs font-mono h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inflow-notes" className="text-xs font-medium text-slate-300">
                  Notes & Earmark Details
                </Label>
                <Textarea
                  id="inflow-notes"
                  value={inflowNotes}
                  onChange={(e) => setInflowNotes(e.target.value)}
                  placeholder="Earmarked equipment specifications, donor conditions, or rollover schedule..."
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs min-h-[70px]"
                />
              </div>

              <DialogFooter className="pt-3 border-t border-slate-800 flex items-center justify-between sm:justify-between">
                <span className="text-[11px] text-slate-500">
                  Increases committee's total effective budget immediately.
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsInflowModalOpen(false)}
                    className="bg-slate-900 border-slate-700 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Credit Funding Inflow</span>
                  </Button>
                </div>
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

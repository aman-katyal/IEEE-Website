import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
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
  ChevronDown,
  ChevronUp,
  X,
  Key,
  Pencil,
} from "lucide-react";
import {
  type PurchaseItem,
  type MemberDuesRecord,
  type AuthSessionData,
  type CommitteeInfo,
  type CommitteeFundingInflow,
  type InflowSourceType,
  type BosoAccountStatement,
  type FinancialAuditLedgerEntry,
  INITIAL_FUNDING_INFLOWS,
  REAL_COMMITTEES,
  type PurchaseStatus,
  OFFICIAL_BOSO_STATEMENT_SFAB_2026,
} from "./financeData";
import { ReceiptPreviewModal } from "./ReceiptPreviewModal";
import { BosoCoolStatementView } from "./BosoCoolStatementView";
import { BankingAuditLedgerView } from "./BankingAuditLedgerView";
import { parseDuesFile } from "@/server/dues/parser";
import { exportToExcelXml, type ExcelSheet } from "@/lib/excelUtils";
import { calculateSpendingVelocity } from "@/lib/budgetUtils";

export interface TreasurerFinanceViewProps {
  session: AuthSessionData;
  purchases: PurchaseItem[];
  memberDues: MemberDuesRecord[];
  committees?: CommitteeInfo[];
  fundingInflows?: CommitteeFundingInflow[];
  auditLogs?: FinancialAuditLedgerEntry[];
  bosoStatement?: BosoAccountStatement;
  onUpdatePurchaseStatus: (
    id: string,
    status: PurchaseStatus,
    notes?: string,
    coolAccountNumber?: string,
  ) => void;
  onRecordCashDues?: (record: {
    studentName: string;
    purdueEmail: string;
    amountPaid: number;
    semester?: string;
    committeeId?: string;
    paymentDate?: string;
  }) => Promise<{ success: boolean; error?: string }> | void;
  onImportMemberDues: (
    records: MemberDuesRecord[],
    fileRaw?: string,
    semester?: string,
  ) => void;
  onUpdateCommittee: (
    committeeId: string,
    updated: Partial<CommitteeInfo>,
  ) => void;
  onCreateCommittee?: (newCommittee: {
    id?: string;
    name: string;
    allocated?: number;
    sfabAllocated?: number;
    bankStatus?: "Active" | "Inactive" | "Read-Only";
    duesStatus?: "Active" | "Inactive";
    contactEmail?: string;
    categories?: string[];
    notes?: string;
    passcode?: string;
  }) => Promise<{
    success: boolean;
    committee?: CommitteeInfo;
    passcode?: string;
    error?: string;
  }> | void;
  onDeleteCommittee?: (
    committeeId: string,
  ) => Promise<{ success: boolean; error?: string }> | void;
  onAddFundingInflow: (newInflow: CommitteeFundingInflow) => void;
  onUpdateFundingInflow?: (
    id: string,
    updated: Partial<CommitteeFundingInflow>,
  ) => Promise<{ success: boolean; error?: string }> | void;
  onDeleteFundingInflow?: (id: string) => void;
  onUpdatePurchase?: (
    id: string,
    updated: Partial<PurchaseItem>,
  ) => Promise<{ success: boolean; error?: string }> | void;
  onClearAllData?: () => Promise<{ success: boolean; message?: string }> | void;
  onLogout?: () => void;
}

export function TreasurerFinanceView({
  session: _session,
  purchases,
  memberDues,
  committees,
  fundingInflows = INITIAL_FUNDING_INFLOWS,
  auditLogs = [],
  bosoStatement = OFFICIAL_BOSO_STATEMENT_SFAB_2026,
  onUpdatePurchaseStatus,
  onUpdatePurchase,
  onImportMemberDues,
  onUpdateCommittee,
  onCreateCommittee,
  onDeleteCommittee,
  onAddFundingInflow,
  onUpdateFundingInflow,
  onDeleteFundingInflow,
  onClearAllData,
  onLogout,
}: TreasurerFinanceViewProps) {
  const activeCommittees = useMemo(() => {
    return committees && committees.length > 0 ? committees : REAL_COMMITTEES;
  }, [committees]);

  const purchasesByCommittee = useMemo(() => {
    const map = new Map<string, PurchaseItem[]>();
    for (const p of purchases) {
      const arr = map.get(p.committeeId) ?? [];
      arr.push(p);
      map.set(p.committeeId, arr);
    }
    return map;
  }, [purchases]);

  const inflowsByCommittee = useMemo(() => {
    const map = new Map<string, CommitteeFundingInflow[]>();
    for (const inf of fundingInflows || []) {
      const arr = map.get(inf.committeeId) ?? [];
      arr.push(inf);
      map.set(inf.committeeId, arr);
    }
    return map;
  }, [fundingInflows]);

  // Master Spending Matrix Data Calculation (General Operating + SFAB Grants)
  const matrixData = useMemo(() => {
    return activeCommittees.map((comm) => {
      const commPurchases = purchasesByCommittee.get(comm.id) ?? [];
      const commInflows = inflowsByCommittee.get(comm.id) ?? [];

      const generalInflows = commInflows
        .filter((inf) => inf.sourceType !== "SFAB Grant")
        .reduce((sum, inf) => sum + inf.amount, 0);
      const sfabInflows = commInflows
        .filter((inf) => inf.sourceType === "SFAB Grant")
        .reduce((sum, inf) => sum + inf.amount, 0);
      const totalInflows = generalInflows + sfabInflows;

      const baseAllocated = comm.allocated;
      const sfabAllocated = comm.sfabAllocated ?? 0;

      const generalBudget = baseAllocated + generalInflows;
      const sfabBudget = sfabAllocated + sfabInflows;
      const totalBudget = generalBudget + sfabBudget;

      let generalApproved = 0;
      let generalPending = 0;
      let generalReimbursed = 0;
      let sfabApproved = 0;
      let sfabPending = 0;
      let sfabReimbursed = 0;

      for (const p of commPurchases) {
        const isSfab = p.fundingSource === "SFAB";
        const isApproved =
          p.status === "APPROVED" ||
          p.status === "PURCHASED" ||
          p.status === "REIMBURSED";
        const isPending = p.status === "PENDING";
        const isReimbursed = p.status === "REIMBURSED";

        if (isSfab) {
          if (isApproved) sfabApproved += p.totalAmount;
          if (isPending) sfabPending += p.totalAmount;
          if (isReimbursed) sfabReimbursed += p.totalAmount;
        } else {
          if (isApproved) generalApproved += p.totalAmount;
          if (isPending) generalPending += p.totalAmount;
          if (isReimbursed) generalReimbursed += p.totalAmount;
        }
      }

      const approved = generalApproved + sfabApproved;
      const pending = generalPending + sfabPending;
      const reimbursed = generalReimbursed + sfabReimbursed;

      const generalRemaining = Math.max(generalBudget - generalApproved, 0);
      const sfabRemaining = Math.max(sfabBudget - sfabApproved, 0);
      const remaining = Math.max(totalBudget - approved, 0);

      const generalPercentSpent =
        generalBudget > 0
          ? Math.min(Math.round((generalApproved / generalBudget) * 100), 100)
          : 0;
      const sfabPercentSpent =
        sfabBudget > 0
          ? Math.min(Math.round((sfabApproved / sfabBudget) * 100), 100)
          : 0;
      const percentSpent =
        totalBudget > 0
          ? Math.min(Math.round((approved / totalBudget) * 100), 100)
          : 0;

      return {
        ...comm,
        baseAllocated,
        sfabAllocated,
        generalInflows,
        sfabInflows,
        totalInflows,
        inflowsCount: commInflows.length,
        generalBudget,
        sfabBudget,
        totalBudget,
        generalApproved,
        sfabApproved,
        approved,
        generalPending,
        sfabPending,
        pending,
        generalReimbursed,
        sfabReimbursed,
        reimbursed,
        generalRemaining,
        sfabRemaining,
        remaining,
        generalPercentSpent,
        sfabPercentSpent,
        percentSpent,
        totalRequests: commPurchases.length,
      };
    });
  }, [activeCommittees, purchasesByCommittee, inflowsByCommittee]);

  // Branch-Wide Totals (General Operating + SFAB Grants)
  const branchTotals = useMemo(() => {
    let totalAllocated = 0;
    let totalSfabAllocated = 0;
    let totalSpent = 0;
    let totalGeneralSpent = 0;
    let totalSfabSpent = 0;
    let totalPending = 0;
    let totalGeneralPending = 0;
    let totalSfabPending = 0;
    let totalRemaining = 0;
    let totalGeneralRemaining = 0;
    let totalSfabRemaining = 0;

    for (const c of matrixData) {
      totalAllocated += c.baseAllocated;
      totalSfabAllocated += c.sfabAllocated;
      totalSpent += c.approved;
      totalGeneralSpent += c.generalApproved;
      totalSfabSpent += c.sfabApproved;
      totalPending += c.pending;
      totalGeneralPending += c.generalPending;
      totalSfabPending += c.sfabPending;
      totalRemaining += c.remaining;
      totalGeneralRemaining += c.generalRemaining;
      totalSfabRemaining += c.sfabRemaining;
    }

    const totalGeneralInflows = (fundingInflows || [])
      .filter((inf) => inf.sourceType !== "SFAB Grant")
      .reduce((sum, inf) => sum + inf.amount, 0);
    const totalSfabInflows = (fundingInflows || [])
      .filter((inf) => inf.sourceType === "SFAB Grant")
      .reduce((sum, inf) => sum + inf.amount, 0);
    const totalInflows = totalGeneralInflows + totalSfabInflows;

    const totalGeneralBudget = totalAllocated + totalGeneralInflows;
    const totalSfabBudget = totalSfabAllocated + totalSfabInflows;
    const totalBranchBudget = totalGeneralBudget + totalSfabBudget;

    const totalRequests = purchases.length;
    const branchPercentSpent =
      totalBranchBudget > 0
        ? Math.min(Math.round((totalSpent / totalBranchBudget) * 100), 100)
        : 0;

    return {
      totalAllocated,
      totalSfabAllocated,
      totalGeneralInflows,
      totalSfabInflows,
      totalInflows,
      totalGeneralBudget,
      totalSfabBudget,
      totalBranchBudget,
      totalSpent,
      totalGeneralSpent,
      totalSfabSpent,
      totalPending,
      totalGeneralPending,
      totalSfabPending,
      totalRemaining,
      totalGeneralRemaining,
      totalSfabRemaining,
      totalRequests,
      branchPercentSpent,
    };
  }, [matrixData, purchases, fundingInflows]);

  // Pending Approvals Queue
  const pendingRequests = useMemo(() => {
    return purchases.filter((p) => p.status === "PENDING");
  }, [purchases]);

  // Approved Requests for COOL Batching
  const approvedRequestsForCOOL = useMemo(() => {
    return purchases.filter((p) => p.status === "APPROVED");
  }, [purchases]);

  // Expanded committee rows for inline inflows viewing
  const [expandedCommittees, setExpandedCommittees] = useState<Set<string>>(
    new Set(),
  );

  const toggleExpandCommittee = (commId: string) => {
    setExpandedCommittees((prev) => {
      const next = new Set(prev);
      if (next.has(commId)) {
        next.delete(commId);
      } else {
        next.add(commId);
      }
      return next;
    });
  };

  // Compliance sub-tab state (Audit Ledger vs BOSO Statement)
  const [complianceSubTab, setComplianceSubTab] = useState<"audit" | "boso">(
    "audit",
  );

  // Modals State
  const [isCOOLExporterOpen, setIsCOOLExporterOpen] = useState<boolean>(false);
  const [isDuesImporterOpen, setIsDuesImporterOpen] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<PurchaseItem | null>(null);
  const [notesModalItem, setNotesModalItem] = useState<PurchaseItem | null>(
    null,
  );
  const [notesInput, setNotesInput] = useState<string>("");
  const [accountNumberInput, setAccountNumberInput] = useState<string>("");

  // Master Spending Matrix Account Filter
  const [matrixAccountFilter, setMatrixAccountFilter] = useState<
    "ALL" | "GENERAL" | "SFAB"
  >("ALL");

  // Committee Parameters Editing Modal State
  const [editingCommittee, setEditingCommittee] =
    useState<CommitteeInfo | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editAllocated, setEditAllocated] = useState<string>("");
  const [editSfabAllocated, setEditSfabAllocated] = useState<string>("0.00");
  const [editBankStatus, setEditBankStatus] = useState<
    "Active" | "Inactive" | "Read-Only"
  >("Active");
  const [editDuesStatus, setEditDuesStatus] = useState<"Active" | "Inactive">(
    "Active",
  );
  const [editContactEmail, setEditContactEmail] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [editCategories, setEditCategories] = useState<string[]>([]);
  const [newCategoryText, setNewCategoryText] = useState<string>("");

  // Committee Deletion State
  const [deletingCommittee, setDeletingCommittee] =
    useState<CommitteeInfo | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);

  // Add New Committee Modal State
  const [isAddCommitteeModalOpen, setIsAddCommitteeModalOpen] =
    useState<boolean>(false);
  const [addName, setAddName] = useState<string>("");
  const [addId, setAddId] = useState<string>("");
  const [addAllocated, setAddAllocated] = useState<string>("1000");
  const [addSfabAllocated, setAddSfabAllocated] = useState<string>("0.00");
  const [addBankStatus, setAddBankStatus] = useState<
    "Active" | "Inactive" | "Read-Only"
  >("Active");
  const [addDuesStatus, setAddDuesStatus] = useState<"Active" | "Inactive">(
    "Active",
  );
  const [addContactEmail, setAddContactEmail] = useState<string>("");
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    id: string;
    passcode: string;
  } | null>(null);
  const [copiedPasscode, setCopiedPasscode] = useState<boolean>(false);
  const [addNotes, setAddNotes] = useState<string>("");
  const [addCategories, setAddCategories] = useState<string[]>([
    "General",
    "Hardware",
  ]);
  const [newAddCategoryText, setNewAddCategoryText] = useState<string>("");
  const [isSubmittingAddCommittee, setIsSubmittingAddCommittee] =
    useState<boolean>(false);

  const handleOpenEditCommittee = (c: CommitteeInfo) => {
    setEditingCommittee(c);
    setEditName(c.name || "");
    setEditAllocated(String(c.allocated));
    setEditSfabAllocated(String(c.sfabAllocated ?? 0));
    setEditBankStatus(c.bankStatus || "Active");
    setEditDuesStatus(c.duesStatus || "Active");
    setEditContactEmail(c.contactEmail || "");
    setEditNotes(c.notes || "");
    setEditCategories([...(c.categories || [])]);
    setNewCategoryText("");
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryText.trim();
    if (trimmed && !editCategories.includes(trimmed)) {
      setEditCategories((prev) => [...prev, trimmed]);
      setNewCategoryText("");
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
    const parsedSfabAllocated = parseFloat(editSfabAllocated);
    const finalSfabAllocated =
      isNaN(parsedSfabAllocated) || parsedSfabAllocated < 0
        ? 0
        : parsedSfabAllocated;

    if (onUpdateCommittee) {
      onUpdateCommittee(editingCommittee.id, {
        name: editName.trim() || editingCommittee.name,
        allocated: parsedAllocated,
        sfabAllocated: finalSfabAllocated,
        bankStatus: editBankStatus,
        duesStatus: editDuesStatus,
        contactEmail: editContactEmail.trim(),
        notes: editNotes.trim(),
        categories: editCategories,
      });
    }
    setEditingCommittee(null);
  };

  const handleConfirmDeleteCommittee = async () => {
    if (!deletingCommittee) return;
    setIsDeletingLoading(true);
    try {
      if (onDeleteCommittee) {
        await onDeleteCommittee(deletingCommittee.id);
      }
      setDeletingCommittee(null);
      if (editingCommittee?.id === deletingCommittee.id) {
        setEditingCommittee(null);
      }
    } finally {
      setIsDeletingLoading(false);
    }
  };

  const handleSaveNewCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    const parsedAllocated = parseFloat(addAllocated) || 0;
    const parsedSfabAllocated = parseFloat(addSfabAllocated) || 0;
    const derivedId =
      addId.trim() ||
      addName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") ||
      `comm-${Date.now()}`;

    setIsSubmittingAddCommittee(true);
    try {
      let createResult: any = null;
      if (onCreateCommittee) {
        createResult = await onCreateCommittee({
          id: derivedId,
          name: addName.trim(),
          allocated: parsedAllocated,
          sfabAllocated: parsedSfabAllocated,
          bankStatus: addBankStatus,
          duesStatus: addDuesStatus,
          contactEmail: addContactEmail.trim() || `${derivedId}@purdueieee.org`,
          categories: addCategories,
          notes: addNotes.trim(),
        });
      }
      setIsAddCommitteeModalOpen(false);
      if (createResult?.passcode) {
        setCreatedCredentials({
          name: createResult.committee?.name || addName.trim(),
          id: createResult.committee?.id || derivedId,
          passcode: createResult.passcode,
        });
      }
      setAddName("");
      setAddId("");
      setAddAllocated("1000");
      setAddSfabAllocated("0.00");
      setAddBankStatus("Active");
      setAddDuesStatus("Active");
      setAddContactEmail("");
      setAddNotes("");
      setAddCategories(["General", "Hardware"]);
    } finally {
      setIsSubmittingAddCommittee(false);
    }
  };

  // COOL Exporter Clipboard & Download Feedback
  const [copiedCOOL, setCopiedCOOL] = useState<boolean>(false);

  // TooCOOL Importer State
  const [importedCsvData, setImportedCsvData] = useState<MemberDuesRecord[]>(
    [],
  );
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDraggingCsv, setIsDraggingCsv] = useState<boolean>(false);

  // Dues Directory Search & Filter
  const [duesSearch, setDuesSearch] = useState<string>("");
  const [duesSemesterFilter, setDuesSemesterFilter] = useState<string>("ALL");

  const filteredDuesDirectory = useMemo(() => {
    return memberDues.filter((d) => {
      const matchesQuery =
        duesSearch.trim() === "" ||
        d.studentName.toLowerCase().includes(duesSearch.toLowerCase()) ||
        d.purdueEmail.toLowerCase().includes(duesSearch.toLowerCase());
      const matchesSemester =
        duesSemesterFilter === "ALL" || d.semester === duesSemesterFilter;
      return matchesQuery && matchesSemester;
    });
  }, [memberDues, duesSearch, duesSemesterFilter]);

  // Specific Funding Inflows State & Handlers
  const [isInflowModalOpen, setIsInflowModalOpen] = useState<boolean>(false);
  const [inflowCommitteeId, setInflowCommitteeId] = useState<string>("rov");
  const [inflowSourceType, setInflowSourceType] =
    useState<InflowSourceType>("SFAB Grant");
  const [inflowTitle, setInflowTitle] = useState<string>("");
  const [inflowAmount, setInflowAmount] = useState<string>("");
  const [inflowRefNumber, setInflowRefNumber] = useState<string>("");
  const [inflowDate, setInflowDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [inflowNotes, setInflowNotes] = useState<string>("");

  const handleOpenInflowModal = (defaultCommId?: string) => {
    if (defaultCommId) {
      setInflowCommitteeId(defaultCommId);
    }
    setInflowTitle("");
    setInflowAmount("");
    setInflowRefNumber("");
    setInflowNotes("");
    setInflowDate(new Date().toISOString().split("T")[0]);
    setIsInflowModalOpen(true);
  };

  const handleSaveInflow = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(inflowAmount);
    if (!inflowTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const targetCommittee = activeCommittees.find(
      (c) => c.id === inflowCommitteeId,
    );
    const newInflow: CommitteeFundingInflow = {
      id: `INFLOW-${Date.now().toString().slice(-4)}`,
      committeeId: inflowCommitteeId,
      committeeName:
        targetCommittee?.shortName ||
        targetCommittee?.name ||
        inflowCommitteeId,
      sourceType: inflowSourceType,
      title: inflowTitle.trim(),
      amount: parsedAmount,
      referenceNumber: inflowRefNumber.trim() || undefined,
      receivedDate: inflowDate || new Date().toISOString().split("T")[0],
      notes: inflowNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    if (onAddFundingInflow) {
      onAddFundingInflow(newInflow);
    }

    setIsInflowModalOpen(false);
  };

  // Edit Inflow State & Handlers
  const [editingInflow, setEditingInflow] = useState<CommitteeFundingInflow | null>(null);
  const [editInflowSourceType, setEditInflowSourceType] = useState<InflowSourceType>("SFAB Grant");
  const [editInflowTitle, setEditInflowTitle] = useState<string>("");
  const [editInflowAmount, setEditInflowAmount] = useState<string>("");
  const [editInflowRefNumber, setEditInflowRefNumber] = useState<string>("");
  const [editInflowDate, setEditInflowDate] = useState<string>("");
  const [editInflowNotes, setEditInflowNotes] = useState<string>("");
  const [isSubmittingInflowEdit, setIsSubmittingInflowEdit] = useState(false);
  const [editInflowError, setEditInflowError] = useState("");

  const handleOpenEditInflow = (inf: CommitteeFundingInflow) => {
    setEditingInflow(inf);
    setEditInflowSourceType(inf.sourceType);
    setEditInflowTitle(inf.title);
    setEditInflowAmount(String(inf.amount));
    setEditInflowRefNumber(inf.referenceNumber || "");
    setEditInflowDate(inf.receivedDate || "");
    setEditInflowNotes(inf.notes || "");
    setEditInflowError("");
  };

  const handleSaveEditInflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInflow || !onUpdateFundingInflow) return;
    const parsedAmount = parseFloat(editInflowAmount);
    if (!editInflowTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setEditInflowError("Please enter a valid title and positive dollar amount");
      return;
    }
    setIsSubmittingInflowEdit(true);
    try {
      const res = await onUpdateFundingInflow(editingInflow.id, {
        sourceType: editInflowSourceType,
        title: editInflowTitle.trim(),
        amount: Math.round(parsedAmount * 100) / 100,
        referenceNumber: editInflowRefNumber.trim() || undefined,
        receivedDate: editInflowDate || undefined,
        notes: editInflowNotes.trim() || undefined,
      });
      if (res && !res.success) {
        setEditInflowError(res.error || "Failed to update funding inflow");
        setIsSubmittingInflowEdit(false);
        return;
      }
      setEditingInflow(null);
    } catch (err: any) {
      setEditInflowError(err.message || "Failed to update funding inflow");
    } finally {
      setIsSubmittingInflowEdit(false);
    }
  };

  // Edit Purchase Requisition State & Handlers
  const [editingPurchase, setEditingPurchase] = useState<PurchaseItem | null>(null);
  const [editPurchaseVendor, setEditPurchaseVendor] = useState("");
  const [editPurchaseAmount, setEditPurchaseAmount] = useState("");
  const [editPurchaseDesc, setEditPurchaseDesc] = useState("");
  const [editPurchaseCategory, setEditPurchaseCategory] = useState("");
  const [editPurchaseFundingSource, setEditPurchaseFundingSource] = useState<"GENERAL" | "SFAB">("GENERAL");
  const [editPurchaseSfabLine, setEditPurchaseSfabLine] = useState("");
  const [editPurchaseDisbursement, setEditPurchaseDisbursement] = useState<string>("Zelle");
  const [editPurchaseReqName, setEditPurchaseReqName] = useState("");
  const [editPurchaseReqEmail, setEditPurchaseReqEmail] = useState("");
  const [editPurchasePurdueUser, setEditPurchasePurdueUser] = useState("");
  const [editPurchaseStreet, setEditPurchaseStreet] = useState("");
  const [editPurchasePhone, setEditPurchasePhone] = useState("");
  const [editPurchaseStatus, setEditPurchaseStatus] = useState<PurchaseStatus>("PENDING");
  const [editPurchaseCoolNumber, setEditPurchaseCoolNumber] = useState("");
  const [editPurchaseTreasurerNotes, setEditPurchaseTreasurerNotes] = useState("");
  const [isSubmittingPurchaseEdit, setIsSubmittingPurchaseEdit] = useState(false);
  const [editPurchaseError, setEditPurchaseError] = useState("");

  const handleOpenEditPurchase = (item: PurchaseItem) => {
    setEditingPurchase(item);
    setEditPurchaseVendor(item.vendorName || "");
    setEditPurchaseAmount(String(item.totalAmount));
    setEditPurchaseDesc(item.description || "");
    setEditPurchaseCategory(item.category || "Parts & Materials");
    setEditPurchaseFundingSource(item.fundingSource === "SFAB" ? "SFAB" : "GENERAL");
    setEditPurchaseSfabLine(item.sfabLineItem || "");
    setEditPurchaseDisbursement(item.disbursementMethod || "Zelle");
    setEditPurchaseReqName(item.requesterName || "");
    setEditPurchaseReqEmail(item.requesterEmail || "");
    setEditPurchasePurdueUser(item.purdueUsername || "");
    setEditPurchaseStreet(item.streetAddress || "");
    setEditPurchasePhone(item.phoneNumber || "");
    setEditPurchaseStatus(item.status);
    setEditPurchaseCoolNumber(item.coolAccountNumber || "");
    setEditPurchaseTreasurerNotes(item.treasurerNotes || "");
    setEditPurchaseError("");
  };

  const handleSaveEditPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPurchase || !onUpdatePurchase) return;
    const parsedAmount = parseFloat(editPurchaseAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setEditPurchaseError("Please enter a valid dollar amount greater than $0.00");
      return;
    }
    if (!editPurchaseVendor.trim()) {
      setEditPurchaseError("Vendor / Merchant name is required");
      return;
    }
    setIsSubmittingPurchaseEdit(true);
    try {
      const res = await onUpdatePurchase(editingPurchase.id, {
        vendorName: editPurchaseVendor.trim(),
        totalAmount: Math.round(parsedAmount * 100) / 100,
        description: editPurchaseDesc.trim(),
        category: editPurchaseCategory,
        fundingSource: editPurchaseFundingSource,
        sfabLineItem: editPurchaseFundingSource === "SFAB" ? editPurchaseSfabLine.trim() : undefined,
        disbursementMethod: editPurchaseDisbursement as any,
        requesterName: editPurchaseReqName.trim(),
        requesterEmail: editPurchaseReqEmail.trim(),
        purdueUsername: editPurchasePurdueUser.trim(),
        streetAddress: editPurchaseStreet.trim(),
        phoneNumber: editPurchasePhone.trim(),
        status: editPurchaseStatus,
        coolAccountNumber: editPurchaseCoolNumber.trim() || undefined,
        treasurerNotes: editPurchaseTreasurerNotes.trim() || undefined,
      });
      if (res && !res.success) {
        setEditPurchaseError(res.error || "Failed to update purchase requisition");
        setIsSubmittingPurchaseEdit(false);
        return;
      }
      setEditingPurchase(null);
    } catch (err: any) {
      setEditPurchaseError(err.message || "Failed to update purchase requisition");
    } finally {
      setIsSubmittingPurchaseEdit(false);
    }
  };

  // Handle Approvals
  const handleApprove = (item: PurchaseItem) => {
    onUpdatePurchaseStatus(item.id, "APPROVED");
  };

  const handleReject = (item: PurchaseItem) => {
    onUpdatePurchaseStatus(item.id, "REJECTED");
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesModalItem) return;
    onUpdatePurchaseStatus(
      notesModalItem.id,
      notesModalItem.status,
      notesInput.trim(),
      accountNumberInput.trim() || undefined,
    );
    setNotesModalItem(null);
  };

  const openNotesModal = (item: PurchaseItem) => {
    setNotesModalItem(item);
    setNotesInput(item.treasurerNotes || "");
    setAccountNumberInput(item.coolAccountNumber || "01-234-56");
  };

  // Generate COOL Formatted Text
  const generatedCOOLText = useMemo(() => {
    if (approvedRequestsForCOOL.length === 0) {
      return "PURDUE COOL / BOSOP REIMBURSEMENT BATCH EXPORT\nNo approved purchase requests currently pending reimbursement transfer.";
    }

    const total = approvedRequestsForCOOL.reduce(
      (sum, r) => sum + r.totalAmount,
      0,
    );
    const dateStr = new Date().toLocaleDateString("en-US");

    const header = [
      "================================================================================",
      `PURDUE COOL / BOSOP REIMBURSEMENT BATCH EXPORT`,
      `Date: ${dateStr} | Total Count: ${approvedRequestsForCOOL.length} | Total Sum: $${total.toFixed(2)}`,
      "================================================================================",
    ].join("\n");

    const body = approvedRequestsForCOOL
      .map((item, idx) => {
        let disbursementLabel = "BOSO Office Pickup (Krach 365)";
        if (item.disbursementMethod === "MAIL_ADDRESS") {
          disbursementLabel = `Mail to Address (${item.streetAddress || "Address on file"})`;
        } else if (item.disbursementMethod === "EPAYMENT") {
          disbursementLabel = "E-Payment to Bank Account";
        }

        return [
          `[${idx + 1}] Req ID: ${item.id} | Committee: ${item.committeeName}`,
          `    Student: ${item.requesterName} (Purdue ID: ${item.purdueUsername || "N/A"}) <${item.requesterEmail}> | Phone: ${item.phoneNumber || "N/A"}`,
          `    Funding Source: ${item.fundingSource || "GENERAL"}${item.fundingSource === "SFAB" ? ` (SFAB Line: ${item.sfabLineItem || "N/A"})` : ""}`,
          `    Disbursement: ${disbursementLabel}`,
          `    Vendor: ${item.vendorName}`,
          `    Account Line: ${item.coolAccountNumber || "01-234-56"}`,
          `    Amount: $${item.totalAmount.toFixed(2)}`,
          `    Receipt: ${item.receiptFilename || "Digital Attachment Verified"}`,
          `    Notes: ${item.treasurerNotes || "None"}`,
          `    Description: ${item.description}`,
        ].join("\n");
      })
      .join("\n\n");

    return `${header}\n\n${body}\n`;
  }, [approvedRequestsForCOOL]);

  // Copy COOL text to clipboard
  const handleCopyCOOLText = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(generatedCOOLText).catch(() => {});
    }
    setCopiedCOOL(true);
    setTimeout(() => setCopiedCOOL(false), 2000);
  };

  // Download COOL CSV
  const handleDownloadCOOLCsv = () => {
    if (approvedRequestsForCOOL.length === 0) return;

    const headers = [
      "Request ID",
      "Committee",
      "Student Requester",
      "Purdue Username",
      "Purdue Email",
      "Phone Number",
      "Funding Source",
      "SFAB Line Item",
      "Disbursement Method",
      "Mailing Address",
      "Vendor",
      "Account Line",
      "Total Amount",
      "Receipt Filename",
      "Description",
      "Submitted Date",
    ];

    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;

    const rows = approvedRequestsForCOOL.map((r) => [
      escapeCsv(r.id),
      escapeCsv(r.committeeName),
      escapeCsv(r.requesterName),
      escapeCsv(r.purdueUsername || ""),
      escapeCsv(r.requesterEmail),
      escapeCsv(r.phoneNumber || ""),
      escapeCsv(r.fundingSource || "GENERAL"),
      escapeCsv(r.sfabLineItem || "N/A"),
      escapeCsv(r.disbursementMethod || "BOSO_PICKUP"),
      escapeCsv(r.streetAddress || ""),
      escapeCsv(r.vendorName),
      escapeCsv(r.coolAccountNumber || "01-234-56"),
      r.totalAmount.toFixed(2),
      escapeCsv(r.receiptFilename || ""),
      escapeCsv(r.description),
      escapeCsv(r.submittedAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `purdue-cool-batch-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download Master Spending Matrix CSV
  const handleExportMatrixExcel = () => {
    if (matrixData.length === 0) return;

    const headers = [
      "Committee ID",
      "Committee Name",
      "General Base Allocated",
      "SFAB Allocated",
      "General Inflows",
      "SFAB Inflows",
      "Total Inflows",
      "General Budget",
      "SFAB Budget",
      "Total Budget",
      "General Spent",
      "SFAB Spent",
      "Total Spent",
      "General Pending",
      "SFAB Pending",
      "Total Pending",
      "General Remaining",
      "SFAB Remaining",
      "Total Remaining",
      "Percent Spent",
      "Total Requests",
      "Runway Weeks",
      "Status",
    ];

    const rows = matrixData.map((c) => {
      // ⚡ Bolt: Use pre-computed Map for O(1) committee purchases lookup instead of O(N) full array filter
      const velocity = calculateSpendingVelocity(
        (purchasesByCommittee.get(c.id) || [])
          .filter(
            (p) =>
              p.status === "APPROVED" ||
              p.status === "PURCHASED" ||
              p.status === "REIMBURSED",
          )
          .map((p) => ({ date: p.submittedAt, amount: p.totalAmount })),
        c.totalBudget,
      );
      return [
        c.id,
        c.name,
        c.baseAllocated,
        c.sfabAllocated,
        c.generalInflows,
        c.sfabInflows,
        c.totalInflows,
        c.generalBudget,
        c.sfabBudget,
        c.totalBudget,
        c.generalApproved,
        c.sfabApproved,
        c.approved,
        c.generalPending,
        c.sfabPending,
        c.pending,
        c.generalRemaining,
        c.sfabRemaining,
        c.remaining,
        c.percentSpent,
        c.totalRequests,
        velocity.runwayWeeks,
        velocity.status,
      ];
    });

    const sheets: ExcelSheet[] = [
      {
        name: "Spending Matrix",
        headers,
        rows,
      },
    ];

    exportToExcelXml(
      `purdue-ieee-spending-matrix-${new Date().toISOString().split("T")[0]}.xlsx`,
      sheets,
    );
  };

  const handleExportMatrixCsv = () => {
    if (matrixData.length === 0) return;

    const headers = [
      "Committee ID",
      "Committee Name",
      "General Base Allocated",
      "SFAB Allocated",
      "General Inflows",
      "SFAB Inflows",
      "Total Inflows",
      "General Budget",
      "SFAB Budget",
      "Total Budget",
      "General Spent",
      "SFAB Spent",
      "Total Spent",
      "General Pending",
      "SFAB Pending",
      "Total Pending",
      "General Remaining",
      "SFAB Remaining",
      "Total Remaining",
      "Percent Spent",
      "Total Requests",
    ];

    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;

    const rows = matrixData.map((c) => [
      escapeCsv(c.id),
      escapeCsv(c.name),
      c.baseAllocated.toFixed(2),
      c.sfabAllocated.toFixed(2),
      c.generalInflows.toFixed(2),
      c.sfabInflows.toFixed(2),
      c.totalInflows.toFixed(2),
      c.generalBudget.toFixed(2),
      c.sfabBudget.toFixed(2),
      c.totalBudget.toFixed(2),
      c.generalApproved.toFixed(2),
      c.sfabApproved.toFixed(2),
      c.approved.toFixed(2),
      c.generalPending.toFixed(2),
      c.sfabPending.toFixed(2),
      c.pending.toFixed(2),
      c.generalRemaining.toFixed(2),
      c.sfabRemaining.toFixed(2),
      c.remaining.toFixed(2),
      `${c.percentSpent.toFixed(1)}%`,
      c.totalRequests.toString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `purdue-ieee-spending-matrix-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Mark all approved as reimbursed
  const handleBatchMarkReimbursed = () => {
    approvedRequestsForCOOL.forEach((item) => {
      onUpdatePurchaseStatus(
        item.id,
        "REIMBURSED",
        "Batch processed in Purdue COOL",
      );
    });
    setIsCOOLExporterOpen(false);
  };

  // CSV & Excel XML Parsing for TooCOOL / vECOrders Dues
  const [skippedCount, setSkippedCount] = useState<number>(0);
  const [rawFileContent, setRawFileContent] = useState<string>("");

  const handleParseCsv = (content: string, filename: string) => {
    setImportError(null);
    setRawFileContent(content);
    try {
      const parsed = parseDuesFile(content, "fy25-26", "Spring 2026");
      if (parsed.validRecords.length === 0) {
        setImportError(
          parsed.errors.length > 0
            ? `Could not parse valid records: ${parsed.errors[0].reason}`
            : "File appears empty or missing valid student dues data.",
        );
        return;
      }

      // Check against existing memberDues in database to disregard existing
      const existingKeys = new Set(
        memberDues.map((d) => `${d.purdueEmail.toLowerCase()}::${d.semester}`),
      );

      const uniqueNewRecords: MemberDuesRecord[] = [];
      let skipped = 0;

      parsed.validRecords.forEach((r: any, idx: number) => {
        const key = `${r.purdueEmail.toLowerCase()}::${r.semester}`;
        if (existingKeys.has(key)) {
          skipped++;
        } else {
          uniqueNewRecords.push({
            id: r.transactionId
              ? `DUES-${r.transactionId}`
              : `DUES-${Date.now()}-${idx}`,
            studentName: r.studentName,
            purdueEmail: r.purdueEmail,
            amountPaid: r.amountPaid,
            paymentMethod: "TooCOOL",
            paymentDate: r.paymentDate,
            semester: r.semester,
            fiscalYear: "2025-2026",
            status: "Active",
          });
        }
      });

      setSkippedCount(skipped);
      setImportedCsvData(uniqueNewRecords);
      setImportFileName(filename);
    } catch (err: any) {
      setImportError(
        err?.message ||
          "Failed to parse file. Please ensure valid CSV or Excel format.",
      );
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
    if (importedCsvData.length === 0 && skippedCount === 0) return;
    onImportMemberDues(importedCsvData, rawFileContent, "Spring 2026");
    setImportedCsvData([]);
    setImportFileName(null);
    setRawFileContent("");
    setSkippedCount(0);
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
              <h2 className="text-xl font-bold text-white">
                Executive Treasurer Console
              </h2>
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
            <span>
              Purdue COOL Batch Exporter ({approvedRequestsForCOOL.length})
            </span>
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

          {onClearAllData && (
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                if (
                  window.confirm(
                    "Are you sure you want to clear all data? This will purge all purchase requisitions, member dues, and banking audit ledger entries.",
                  )
                ) {
                  await onClearAllData();
                }
              }}
              className="bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:text-white flex items-center gap-2"
              title="Clear all transaction data, dues, and audit ledger entries"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear All Data</span>
            </Button>
          )}

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
            $
            {branchTotals.totalBranchBudget.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-sky-400">Gen: ${branchTotals.totalGeneralBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              <span className="text-amber-400">SFAB: ${branchTotals.totalSfabBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              ${(branchTotals.totalAllocated + branchTotals.totalSfabAllocated).toLocaleString("en-US")} base + ${branchTotals.totalInflows.toLocaleString("en-US")} grants
            </p>
          </div>
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
            $
            {branchTotals.totalSpent.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono text-[10px]">
            <span className="text-sky-300">Gen: ${branchTotals.totalGeneralSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span className="text-amber-300">SFAB: ${branchTotals.totalSfabSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <Progress
              value={branchTotals.branchPercentSpent}
              className="h-1.5 bg-slate-800 flex-1"
            />
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
            $
            {branchTotals.totalPending.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono text-[10px]">
            <span className="text-sky-300">Gen: ${branchTotals.totalGeneralPending.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span className="text-amber-300">SFAB: ${branchTotals.totalSfabPending.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
          <p className="text-[10px] text-amber-400/80 mt-1">
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
            $
            {branchTotals.totalRemaining.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono text-[10px]">
            <span className="text-sky-300">Gen: ${branchTotals.totalGeneralRemaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span className="text-amber-300">SFAB: ${branchTotals.totalSfabRemaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Available branch-wide surplus
          </p>
        </Card>
      </div>

      {/* Main Tabs: Pending Approvals | Master Spending Matrix | Dues Directory | Audit Ledger & BOSO */}
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
          <TabsTrigger
            value="compliance"
            className="data-[state=active]:bg-sky-600 data-[state=active]:text-white text-slate-300 text-xs px-4"
          >
            Audit Ledger & BOSO ({auditLogs.length})
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
                Review receipts, verify Purdue sales tax exemption status, and
                approve or reject submissions.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-900/60 border-b border-slate-800">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6">
                      Req ID
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                      Committee
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                      Requester
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                      Vendor / Item
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">
                      Amount
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center">
                      Receipt
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right pr-6">
                      Actions
                    </TableHead>
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
                          <span className="font-semibold text-xs text-slate-200">
                            {item.committeeName}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-slate-500">
                              {item.category}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span
                              className={`text-[10px] font-mono px-1 rounded border ${
                                item.fundingSource === "SFAB"
                                  ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                  : "bg-sky-500/10 text-sky-300 border-sky-500/20"
                              }`}
                            >
                              {item.fundingSource === "SFAB" ? "SFAB" : "General"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <div className="font-medium text-xs text-slate-200">
                            {item.requesterName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {item.requesterEmail}
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 max-w-[240px]">
                          <div className="font-semibold text-xs text-slate-100">
                            {item.vendorName}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {item.description}
                          </div>
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
                            <span className="text-[11px] text-slate-600">
                              None
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-3.5 pr-6">
                          <div className="flex items-center justify-end gap-1.5">
                            {onUpdatePurchase && (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenEditPurchase(item)}
                                className="h-8 px-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800"
                                title="Edit Requisition Details"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            )}
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
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-slate-500"
                      >
                        <CheckCircle2 className="w-8 h-8 text-emerald-400/60 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-300">
                          Approvals Queue is Clear
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          No purchase requests are currently awaiting treasurer
                          sign-off.
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
                  Comparative budget overview, base capital, specific grants &
                  inflows, liabilities, and surplus per committee.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                {/* Account Toggle Filter */}
                <div className="inline-flex p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setMatrixAccountFilter("ALL")}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      matrixAccountFilter === "ALL"
                        ? "bg-slate-800 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Combined
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatrixAccountFilter("GENERAL")}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      matrixAccountFilter === "GENERAL"
                        ? "bg-sky-950 text-sky-300 border border-sky-800/60 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatrixAccountFilter("SFAB")}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      matrixAccountFilter === "SFAB"
                        ? "bg-amber-950 text-amber-300 border border-amber-800/60 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    SFAB
                  </button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportMatrixCsv}
                  className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>CSV</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportMatrixExcel}
                  className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Excel</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsAddCommitteeModalOpen(true)}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Committee</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleOpenInflowModal()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Record Inflow</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-900/60 border-b border-slate-800">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6">
                      Committee
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">
                      {matrixAccountFilter === "GENERAL"
                        ? "General Base"
                        : matrixAccountFilter === "SFAB"
                          ? "SFAB Base"
                          : "Base Allocated"}
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">
                      {matrixAccountFilter === "GENERAL"
                        ? "General Inflows"
                        : matrixAccountFilter === "SFAB"
                          ? "SFAB Grants"
                          : "Grants / Inflows"}
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">
                      {matrixAccountFilter === "GENERAL"
                        ? "General Budget"
                        : matrixAccountFilter === "SFAB"
                          ? "SFAB Budget"
                          : "Total Budget"}
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">
                      {matrixAccountFilter === "GENERAL"
                        ? "General Spent"
                        : matrixAccountFilter === "SFAB"
                          ? "SFAB Spent"
                          : "Spent / Disbursed"}
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">
                      {matrixAccountFilter === "GENERAL"
                        ? "General Pending"
                        : matrixAccountFilter === "SFAB"
                          ? "SFAB Pending"
                          : "Pending"}
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">
                      Remaining
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center w-36">
                      % Spent
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center">
                      Reqs
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">
                      Runway
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right pr-6">
                      Manage
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matrixData.map((c) => {
                    const rowBaseAllocated =
                      matrixAccountFilter === "GENERAL"
                        ? c.baseAllocated
                        : matrixAccountFilter === "SFAB"
                          ? c.sfabAllocated
                          : c.baseAllocated + c.sfabAllocated;
                    const rowInflows =
                      matrixAccountFilter === "GENERAL"
                        ? c.generalInflows
                        : matrixAccountFilter === "SFAB"
                          ? c.sfabInflows
                          : c.totalInflows;
                    const rowBudget =
                      matrixAccountFilter === "GENERAL"
                        ? c.generalBudget
                        : matrixAccountFilter === "SFAB"
                          ? c.sfabBudget
                          : c.totalBudget;
                    const rowSpent =
                      matrixAccountFilter === "GENERAL"
                        ? c.generalApproved
                        : matrixAccountFilter === "SFAB"
                          ? c.sfabApproved
                          : c.approved;
                    const rowPending =
                      matrixAccountFilter === "GENERAL"
                        ? c.generalPending
                        : matrixAccountFilter === "SFAB"
                          ? c.sfabPending
                          : c.pending;
                    const rowRemaining =
                      matrixAccountFilter === "GENERAL"
                        ? c.generalRemaining
                        : matrixAccountFilter === "SFAB"
                          ? c.sfabRemaining
                          : c.remaining;
                    const rowPercentSpent =
                      matrixAccountFilter === "GENERAL"
                        ? c.generalPercentSpent
                        : matrixAccountFilter === "SFAB"
                          ? c.sfabPercentSpent
                          : c.percentSpent;

                    return (
                      <React.Fragment key={c.id}>
                        <TableRow
                          className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                        >
                        <TableCell className="pl-6 py-3.5">
                          <div className="font-semibold text-xs text-white">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                            <span>{c.contactEmail}</span>
                            <span className="text-slate-600">·</span>
                            <span
                              className={`text-[10px] ${c.bankStatus === "Inactive" ? "text-red-400" : c.bankStatus === "Read-Only" ? "text-amber-400" : "text-emerald-400"}`}
                            >
                              {c.bankStatus || "Active"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-3.5 font-mono text-xs">
                          <div className="font-medium text-slate-200">
                            $
                            {rowBaseAllocated.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          {matrixAccountFilter === "ALL" && (
                            <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                              <span className="text-sky-400/90">G: ${c.baseAllocated.toLocaleString("en-US")}</span>
                              <span>·</span>
                              <span className="text-amber-400/90">S: ${c.sfabAllocated.toLocaleString("en-US")}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-3.5 font-mono text-xs">
                          {rowInflows > 0 ? (
                            <div>
                              <button
                                type="button"
                                onClick={() => toggleExpandCommittee(c.id)}
                                className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/20 transition-colors"
                                title="Click to toggle committee grants & inflows"
                              >
                                <span>
                                  +$
                                  {rowInflows.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                                {expandedCommittees.has(c.id) ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                              {matrixAccountFilter === "ALL" && (
                                <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                                  <span className="text-sky-400/80">G: ${c.generalInflows.toLocaleString("en-US")}</span>
                                  <span>·</span>
                                  <span className="text-amber-400/80">S: ${c.sfabInflows.toLocaleString("en-US")}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600">$0.00</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-white">
                          <div>
                            $
                            {rowBudget.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          {matrixAccountFilter === "ALL" && (
                            <div className="text-[10px] font-normal text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                              <span className="text-sky-400/80">G: ${c.generalBudget.toLocaleString("en-US")}</span>
                              <span>·</span>
                              <span className="text-amber-400/80">S: ${c.sfabBudget.toLocaleString("en-US")}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-sky-400">
                          <div>
                            $
                            {rowSpent.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          {matrixAccountFilter === "ALL" && (
                            <div className="text-[10px] font-normal text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                              <span className="text-sky-300">G: ${c.generalApproved.toLocaleString("en-US")}</span>
                              <span>·</span>
                              <span className="text-amber-300">S: ${c.sfabApproved.toLocaleString("en-US")}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-3.5 font-mono text-xs text-amber-400">
                          <div>
                            $
                            {rowPending.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          {matrixAccountFilter === "ALL" && (
                            <div className="text-[10px] font-normal text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                              <span className="text-sky-300/80">G: ${c.generalPending.toLocaleString("en-US")}</span>
                              <span>·</span>
                              <span className="text-amber-300/80">S: ${c.sfabPending.toLocaleString("en-US")}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-3.5 font-mono text-xs font-bold text-emerald-400">
                          <div>
                            $
                            {rowRemaining.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          {matrixAccountFilter === "ALL" && (
                            <div className="text-[10px] font-normal text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                              <span className="text-emerald-300/80">G: ${c.generalRemaining.toLocaleString("en-US")}</span>
                              <span>·</span>
                              <span className="text-amber-300/80">S: ${c.sfabRemaining.toLocaleString("en-US")}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center py-3.5">
                          <div className="flex items-center gap-2 px-2">
                            <Progress
                              value={rowPercentSpent}
                              className={`h-2 flex-1 ${
                                rowPercentSpent > 90
                                  ? "bg-red-950 text-red-500"
                                  : rowPercentSpent > 70
                                    ? "bg-amber-950 text-amber-500"
                                    : "bg-slate-800"
                              }`}
                            />
                            <span className="text-[11px] font-mono text-slate-300 w-10 text-right">
                              {rowPercentSpent}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-3.5 font-mono text-xs text-slate-400">
                          {c.totalRequests}
                        </TableCell>
                      <TableCell className="text-right py-3.5 font-mono text-xs">
                        {(() => {
                          // Pre-computed Map for O(1) committee purchases lookup
                          const velocity = calculateSpendingVelocity(
                            (purchasesByCommittee.get(c.id) || [])
                              .filter(
                                (p) =>
                                  p.status === "APPROVED" ||
                                  p.status === "PURCHASED" ||
                                  p.status === "REIMBURSED",
                              )
                              .map((p) => ({
                                date: p.submittedAt,
                                amount: p.totalAmount,
                              })),
                            c.totalBudget,
                          );
                          return (
                            <>
                              {velocity.runwayWeeks}w ·{" "}
                              <span
                                className={
                                  velocity.status === "On Track"
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }
                              >
                                {velocity.status}
                              </span>
                            </>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-right py-3.5 pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => toggleExpandCommittee(c.id)}
                            className="h-7 px-2 text-xs bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 inline-flex items-center gap-1"
                            title={`Toggle Inflows for ${c.shortName}`}
                          >
                            <span>Inflows ({c.inflowsCount})</span>
                            {expandedCommittees.has(c.id) ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenInflowModal(c.id)}
                            className="h-7 px-2 text-xs bg-slate-900 border-slate-700 text-emerald-400 hover:text-white hover:bg-slate-800 inline-flex items-center gap-1"
                            title={`Add Inflow for ${c.shortName}`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
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
                          {onDeleteCommittee && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingCommittee(c)}
                              className="h-7 px-2 text-xs bg-slate-900 border-slate-700 text-red-400 hover:text-white hover:bg-red-900/60 inline-flex items-center gap-1"
                              title={`Delete ${c.shortName}`}
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Inline Committee Inflows Drawer */}
                    {expandedCommittees.has(c.id) && (
                      <TableRow className="bg-slate-950/70 border-b border-slate-800">
                        <TableCell colSpan={10} className="p-4 pl-8">
                          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Coins className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                                  {c.shortName} Funding Inflows & Grants Ledger
                                </span>
                                <Badge className="text-[10px] bg-emerald-500/10 text-emerald-300 border-emerald-500/20 font-mono">
                                  {(inflowsByCommittee.get(c.id) || []).length} Records
                                </Badge>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleOpenInflowModal(c.id)}
                                className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Record Inflow for {c.shortName}</span>
                              </Button>
                            </div>

                            {(inflowsByCommittee.get(c.id) || []).length > 0 ? (
                              <div className="overflow-x-auto rounded border border-slate-800">
                                <Table>
                                  <TableHeader className="bg-slate-950/80 text-[11px] font-mono">
                                    <TableRow className="border-slate-800">
                                      <TableHead className="py-2 pl-3">Inflow ID</TableHead>
                                      <TableHead className="py-2">Source</TableHead>
                                      <TableHead className="py-2">Title / Description</TableHead>
                                      <TableHead className="py-2">Reference</TableHead>
                                      <TableHead className="py-2">Date</TableHead>
                                      <TableHead className="py-2 text-right">Amount</TableHead>
                                      <TableHead className="py-2 text-right pr-3">Action</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {(inflowsByCommittee.get(c.id) || []).map((inf) => (
                                      <TableRow key={inf.id} className="border-slate-800/60 text-xs">
                                        <TableCell className="font-mono text-emerald-400 py-2 pl-3">
                                          {inf.id}
                                        </TableCell>
                                        <TableCell className="py-2">
                                          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                                            {inf.sourceType}
                                          </span>
                                        </TableCell>
                                        <TableCell className="py-2 font-medium text-slate-200">
                                          {inf.title}
                                          {inf.notes && (
                                            <span className="block text-[10px] text-slate-500 truncate max-w-xs">
                                              {inf.notes}
                                            </span>
                                          )}
                                        </TableCell>
                                        <TableCell className="font-mono text-slate-400 py-2 text-[11px]">
                                          {inf.referenceNumber || "N/A"}
                                        </TableCell>
                                        <TableCell className="font-mono text-slate-400 py-2 text-[11px]">
                          {inf.receivedDate}
                                        </TableCell>
                                        <TableCell className="font-mono font-bold text-emerald-400 text-right py-2">
                                          +${inf.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right py-2 pr-3">
                                          <div className="flex items-center justify-end gap-1">
                                            {onUpdateFundingInflow && (
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenEditInflow(inf)}
                                                className="h-6 w-6 p-0 text-slate-400 hover:text-sky-400 hover:bg-sky-950/40"
                                                title={`Edit ${inf.title}`}
                                              >
                                                <Pencil className="w-3.5 h-3.5" />
                                              </Button>
                                            )}
                                            {onDeleteFundingInflow && (
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDeleteFundingInflow(inf.id)}
                                                className="h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                                                title={`Delete ${inf.title}`}
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </Button>
                                            )}
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-slate-500 text-xs italic">
                                No funding inflows or grants currently recorded for {c.name}.
                              </div>
                            )}

                            {/* Requisitions for this committee */}
                            <div className="pt-2 border-t border-slate-800/80 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-sky-400" />
                                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                                    {c.shortName} Purchase Requisitions Ledger
                                  </span>
                                  <Badge className="text-[10px] bg-sky-500/10 text-sky-300 border-sky-500/20 font-mono">
                                    {(purchasesByCommittee.get(c.id) || []).length} Requisitions
                                  </Badge>
                                </div>
                              </div>

                              {(purchasesByCommittee.get(c.id) || []).length > 0 ? (
                                <div className="overflow-x-auto rounded border border-slate-800">
                                  <Table>
                                    <TableHeader className="bg-slate-950/80 text-[11px] font-mono">
                                      <TableRow className="border-slate-800">
                                        <TableHead className="py-2 pl-3">Req ID</TableHead>
                                        <TableHead className="py-2">Requester</TableHead>
                                        <TableHead className="py-2">Vendor / Purpose</TableHead>
                                        <TableHead className="py-2">Account</TableHead>
                                        <TableHead className="py-2 text-right">Amount</TableHead>
                                        <TableHead className="py-2 text-center">Status</TableHead>
                                        <TableHead className="py-2 text-center">Receipt</TableHead>
                                        <TableHead className="py-2 text-right pr-3">Action</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {(purchasesByCommittee.get(c.id) || []).map((req) => (
                                        <TableRow key={req.id} className="border-slate-800/60 text-xs">
                                          <TableCell className="font-mono text-sky-400 py-2 pl-3">
                                            {req.id}
                                          </TableCell>
                                          <TableCell className="py-2">
                                            <div className="font-medium text-slate-200">{req.requesterName}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">{req.requesterEmail}</div>
                                          </TableCell>
                                          <TableCell className="py-2 max-w-[200px]">
                                            <div className="font-medium text-slate-200">{req.vendorName}</div>
                                            <div className="text-[10px] text-slate-400 truncate">{req.description}</div>
                                          </TableCell>
                                          <TableCell className="py-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                                              req.fundingSource === "SFAB"
                                                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                                : "bg-sky-500/10 text-sky-300 border-sky-500/30"
                                            }`}>
                                              {req.fundingSource === "SFAB" ? "SFAB" : "General"}
                                            </span>
                                          </TableCell>
                                          <TableCell className="font-mono font-bold text-slate-100 text-right py-2">
                                            ${req.totalAmount.toFixed(2)}
                                          </TableCell>
                                          <TableCell className="text-center py-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                                              req.status === "APPROVED" || req.status === "REIMBURSED"
                                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                                : req.status === "REJECTED"
                                                ? "bg-red-500/15 text-red-300 border-red-500/30"
                                                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                            }`}>
                                              {req.status}
                                            </span>
                                          </TableCell>
                                          <TableCell className="text-center py-2">
                                            {req.receiptUrl ? (
                                              <button
                                                type="button"
                                                onClick={() => setPreviewItem(req)}
                                                className="inline-flex items-center gap-0.5 text-xs text-sky-400 hover:text-sky-300 hover:underline"
                                              >
                                                <FileText className="w-3 h-3" />
                                                <span>View</span>
                                              </button>
                                            ) : (
                                              <span className="text-[10px] text-slate-600">None</span>
                                            )}
                                          </TableCell>
                                          <TableCell className="text-right py-2 pr-3">
                                            {onUpdatePurchase && (
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenEditPurchase(req)}
                                                className="h-6 w-6 p-0 text-slate-400 hover:text-sky-400 hover:bg-sky-950/40"
                                                title={`Edit Requisition ${req.id}`}
                                              >
                                                <Pencil className="w-3.5 h-3.5" />
                                              </Button>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              ) : (
                                <div className="text-center py-3 text-slate-500 text-xs italic">
                                  No purchase requisitions recorded for {c.name}.
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    </React.Fragment>
                  );
                })}
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
                  Real-time dues payment records imported from Purdue TooCOOL
                  and direct cash payments.
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

                <Select
                  value={duesSemesterFilter}
                  onValueChange={setDuesSemesterFilter}
                >
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
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6">
                      Record ID
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                      Student Name
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                      Purdue Email
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                      Semester
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                      Payment Method
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">
                      Amount
                    </TableHead>
                    <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center pr-6">
                      Status
                    </TableHead>
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
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-slate-500"
                      >
                        No member dues records matching your search query.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Audit Ledger & Official BOSO Reconciliation */}
        <TabsContent value="compliance" className="mt-4 space-y-4">
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg w-fit">
            <Button
              type="button"
              variant={complianceSubTab === "audit" ? "default" : "ghost"}
              size="sm"
              onClick={() => setComplianceSubTab("audit")}
              className={`h-7 px-3 text-xs ${
                complianceSubTab === "audit"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Banking Audit Ledger ({auditLogs.length})
            </Button>
            <Button
              type="button"
              variant={complianceSubTab === "boso" ? "default" : "ghost"}
              size="sm"
              onClick={() => setComplianceSubTab("boso")}
              className={`h-7 px-3 text-xs ${
                complianceSubTab === "boso"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              BOSO Statement (SOA #04612)
            </Button>
          </div>

          {complianceSubTab === "audit" ? (
            <BankingAuditLedgerView
              entries={auditLogs}
              committees={activeCommittees}
              isTreasurer={true}
              onClearAllData={onClearAllData}
            />
          ) : (
            <BosoCoolStatementView
              statement={bosoStatement || OFFICIAL_BOSO_STATEMENT_SFAB_2026}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Purdue COOL Batch Exporter Modal */}
      <Dialog open={isCOOLExporterOpen} onOpenChange={setIsCOOLExporterOpen}>
        <DialogContent className="max-w-3xl bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-sky-400" />
              <span>Purdue COOL / BOSOP Batch Exporter</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Generates formatted data for administrative entry into Purdue
              University COOL / BOSO financial system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs">
              <div>
                <span className="font-semibold text-white">Batch Ready:</span>{" "}
                <span className="text-sky-300">
                  {approvedRequestsForCOOL.length} Approved Requests
                </span>
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
                <Label
                  htmlFor="cool-preview-text"
                  className="text-xs font-medium text-slate-300"
                >
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

      {/* TooCOOL / vECOrders Dues Importer Modal */}
      <Dialog open={isDuesImporterOpen} onOpenChange={setIsDuesImporterOpen}>
        <DialogContent className="max-w-2xl bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-sky-400" />
              <span>Import Purdue TooCOOL / vECOrders Dues File</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Batch ingest membership dues exported from Purdue TooCOOL
              (supports .xls XML, .xlsx, and .csv formats).
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
                  ? "border-sky-400 bg-sky-500/10"
                  : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
              }`}
              onClick={() => document.getElementById("dues-csv-input")?.click()}
            >
              <input
                id="dues-csv-input"
                type="file"
                accept=".csv,.xls,.xlsx,.xml,.tsv,text/csv,application/vnd.ms-excel"
                className="hidden"
                onChange={handleCsvFileInput}
              />
              <FileSpreadsheet className="w-8 h-8 text-sky-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-200">
                Click to browse or drop TooCOOL / vECOrders (.xls / .csv) file
                here
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports vECOrders XML spreadsheets and TooCOOL exports with
                automatic name formatting and duplicate protection
              </p>
            </div>

            {importError && (
              <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-xs text-red-300">
                {importError}
              </div>
            )}

            {(importedCsvData.length > 0 || skippedCount > 0) && (
              <div className="space-y-2 p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    File:{" "}
                    <span className="font-mono text-slate-300">
                      {importFileName}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    {skippedCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-amber-500/10 text-amber-300 border-amber-500/30"
                      >
                        {skippedCount} Existing Disregarded
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-mono"
                    >
                      {importedCsvData.length} New to Ingest
                    </Badge>
                  </div>
                </div>

                {importedCsvData.length > 0 ? (
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-[11px]">
                    {importedCsvData.slice(0, 5).map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-1.5 rounded bg-slate-800/40 text-slate-300"
                      >
                        <span>
                          {rec.studentName} ({rec.purdueEmail})
                        </span>
                        <span className="font-mono text-white">
                          ${rec.amountPaid.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {importedCsvData.length > 5 && (
                      <div className="text-center text-[10px] text-slate-500 pt-1">
                        + {importedCsvData.length - 5} more new records
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic py-1">
                    All {skippedCount} members in this file are already recorded
                    in the database.
                  </div>
                )}
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
                Import {importedCsvData.length} New Members
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Notes / Account Line Modal */}
      {notesModalItem && (
        <Dialog
          open={!!notesModalItem}
          onOpenChange={(open) => !open && setNotesModalItem(null)}
        >
          <DialogContent className="max-w-md bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>
                  Treasurer Notes & Account Line · {notesModalItem.id}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Update BOSO account line number and feedback for{" "}
                {notesModalItem.requesterName}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveNotes} className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="account-line"
                  className="text-xs font-medium text-slate-300"
                >
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
                <Label
                  htmlFor="treasurer-notes"
                  className="text-xs font-medium text-slate-300"
                >
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
                Update committee name, allocated budget capital, operational
                bank status, member dues policy, and spending categories.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveCommittee} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label
                    htmlFor="edit-name"
                    className="text-xs font-medium text-slate-300"
                  >
                    Committee Name *
                  </Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Aerial Robotics"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="edit-allocated"
                      className="text-xs font-medium text-slate-300"
                    >
                      General Operating Budget ($) *
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
                    <Label
                      htmlFor="edit-sfab-allocated"
                      className="text-xs font-medium text-slate-300"
                    >
                      SFAB Grant Budget ($)
                    </Label>
                    <Input
                      id="edit-sfab-allocated"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editSfabAllocated}
                      onChange={(e) => setEditSfabAllocated(e.target.value)}
                      placeholder="0.00"
                      className="bg-slate-900 border-slate-700 text-slate-100 text-xs font-mono h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-email"
                    className="text-xs font-medium text-slate-300"
                  >
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
                    onValueChange={(val: "Active" | "Inactive" | "Read-Only") =>
                      setEditBankStatus(val)
                    }
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                      <SelectItem value="Active">
                        Active (Reimbursements Open)
                      </SelectItem>
                      <SelectItem value="Read-Only">
                        Read-Only (View Only)
                      </SelectItem>
                      <SelectItem value="Inactive">
                        Inactive (Frozen)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-300">
                    Member Dues Requirement
                  </Label>
                  <Select
                    value={editDuesStatus}
                    onValueChange={(val: "Active" | "Inactive") =>
                      setEditDuesStatus(val)
                    }
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                      <SelectItem value="Active">
                        Active (Requires Paid Dues)
                      </SelectItem>
                      <SelectItem value="Inactive">
                        Inactive (Exempt / Open)
                      </SelectItem>
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
                    <span className="text-xs text-slate-500 italic py-1">
                      No categories assigned.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    value={newCategoryText}
                    onChange={(e) => setNewCategoryText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
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
                <Label
                  htmlFor="edit-notes"
                  className="text-xs font-medium text-slate-300"
                >
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
                <div>
                  {onDeleteCommittee && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeletingCommittee(editingCommittee);
                      }}
                      className="bg-red-950/80 border border-red-800/80 hover:bg-red-900 text-red-300 text-xs flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Committee</span>
                    </Button>
                  )}
                </div>
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

      {/* Delete Committee Confirmation Dialog */}
      {deletingCommittee && (
        <Dialog
          open={!!deletingCommittee}
          onOpenChange={(open) => !open && setDeletingCommittee(null)}
        >
          <DialogContent className="max-w-md bg-[#121214] text-slate-100 border border-red-900/60 shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-red-400 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                <span>Delete Committee: {deletingCommittee.name}?</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-300 pt-2 leading-relaxed">
                Are you sure you want to delete{" "}
                <strong className="text-white">{deletingCommittee.name}</strong>{" "}
                (
                <span className="font-mono text-sky-400">
                  {deletingCommittee.id}
                </span>
                )? This will permanently remove its budget allocations,
                subcategories, and associated financial records from the
                database.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeletingCommittee(null)}
                className="bg-slate-900 border-slate-700 text-slate-300"
                disabled={isDeletingLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleConfirmDeleteCommittee}
                disabled={isDeletingLoading}
                className="bg-red-600 hover:bg-red-500 text-white font-medium"
              >
                {isDeletingLoading ? "Deleting..." : "Confirm Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add New Committee Modal */}
      {isAddCommitteeModalOpen && (
        <Dialog
          open={isAddCommitteeModalOpen}
          onOpenChange={(open) => !open && setIsAddCommitteeModalOpen(false)}
        >
          <DialogContent className="max-w-xl bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <span>Create New Technical Committee</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Add a new technical committee to Purdue IEEE BoilerBooks 3.0
                with initial budget allocation and credentials.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveNewCommittee} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label
                    htmlFor="add-name"
                    className="text-xs font-medium text-slate-300"
                  >
                    Committee Name *
                  </Label>
                  <Input
                    id="add-name"
                    value={addName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAddName(val);
                      if (
                        !addId ||
                        addId ===
                          addName
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "-")
                            .replace(/-+/g, "-")
                      ) {
                        setAddId(
                          val
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "-")
                            .replace(/-+/g, "-")
                            .replace(/^-|-$/g, ""),
                        );
                      }
                    }}
                    placeholder="e.g. Assistive Technology & Bionics"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="add-id"
                    className="text-xs font-medium text-slate-300"
                  >
                    Identifier / Slug *
                  </Label>
                  <Input
                    id="add-id"
                    value={addId}
                    onChange={(e) =>
                      setAddId(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                      )
                    }
                    placeholder="e.g. assistive-tech"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs font-mono h-9"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="add-allocated"
                      className="text-xs font-medium text-slate-300"
                    >
                      Initial General Budget ($) *
                    </Label>
                    <Input
                      id="add-allocated"
                      type="number"
                      step="0.01"
                      min="0"
                      value={addAllocated}
                      onChange={(e) => setAddAllocated(e.target.value)}
                      placeholder="1000.00"
                      className="bg-slate-900 border-slate-700 text-slate-100 text-xs font-mono h-9"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="add-sfab-allocated"
                      className="text-xs font-medium text-slate-300"
                    >
                      Initial SFAB Budget ($)
                    </Label>
                    <Input
                      id="add-sfab-allocated"
                      type="number"
                      step="0.01"
                      min="0"
                      value={addSfabAllocated}
                      onChange={(e) => setAddSfabAllocated(e.target.value)}
                      placeholder="0.00"
                      className="bg-slate-900 border-slate-700 text-slate-100 text-xs font-mono h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="add-email"
                    className="text-xs font-medium text-slate-300"
                  >
                    Contact Email
                  </Label>
                  <Input
                    id="add-email"
                    type="email"
                    value={addContactEmail}
                    onChange={(e) => setAddContactEmail(e.target.value)}
                    placeholder="committee@purdueieee.org"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-slate-300">
                      Lead PIN Passcode
                    </Label>
                    <span className="text-[10px] text-sky-400 font-medium">
                      Auto-Generated by System
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-700/80 rounded-md text-xs text-slate-300">
                    <Key className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-400 flex-1">
                      Standard BoilerBooks format generated upon creation
                    </span>
                    <span className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 px-1.5 py-0.5 rounded">
                      PBKDF2-SHA256
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-300">
                    Bank Operational Status
                  </Label>
                  <Select
                    value={addBankStatus}
                    onValueChange={(val: "Active" | "Inactive" | "Read-Only") =>
                      setAddBankStatus(val)
                    }
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                      <SelectItem value="Active">
                        Active (Reimbursements Open)
                      </SelectItem>
                      <SelectItem value="Read-Only">
                        Read-Only (View Only)
                      </SelectItem>
                      <SelectItem value="Inactive">
                        Inactive (Frozen)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-300">
                    Member Dues Requirement
                  </Label>
                  <Select
                    value={addDuesStatus}
                    onValueChange={(val: "Active" | "Inactive") =>
                      setAddDuesStatus(val)
                    }
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                      <SelectItem value="Active">
                        Active (Requires Paid Dues)
                      </SelectItem>
                      <SelectItem value="Inactive">
                        Inactive (Exempt / Open)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Budget Categories Manager */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-300">
                  Initial Budget Categories ({addCategories.length})
                </Label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg min-h-[44px]">
                  {addCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setAddCategories((prev) =>
                            prev.filter((c) => c !== cat),
                          )
                        }
                        className="text-sky-400 hover:text-red-400 p-0.5"
                        title={`Remove ${cat}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    value={newAddCategoryText}
                    onChange={(e) => setNewAddCategoryText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const trimmed = newAddCategoryText.trim();
                        if (trimmed && !addCategories.includes(trimmed)) {
                          setAddCategories((prev) => [...prev, trimmed]);
                          setNewAddCategoryText("");
                        }
                      }
                    }}
                    placeholder="Add category (e.g. Microcontrollers, Travel)..."
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-8"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const trimmed = newAddCategoryText.trim();
                      if (trimmed && !addCategories.includes(trimmed)) {
                        setAddCategories((prev) => [...prev, trimmed]);
                        setNewAddCategoryText("");
                      }
                    }}
                    disabled={!newAddCategoryText.trim()}
                    className="h-8 bg-slate-900 border-slate-700 text-sky-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="add-notes"
                  className="text-xs font-medium text-slate-300"
                >
                  Initial Allocation Notes
                </Label>
                <Textarea
                  id="add-notes"
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  placeholder="Charter notes, lab workspace details, faculty advisor..."
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs min-h-[60px]"
                />
              </div>

              <DialogFooter className="pt-3 border-t border-slate-800 flex items-center justify-between sm:justify-between">
                <span className="text-[11px] text-slate-500">
                  New committee will be immediately available across
                  BoilerBooks.
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddCommitteeModalOpen(false)}
                    className="bg-slate-900 border-slate-700 text-slate-300"
                    disabled={isSubmittingAddCommittee}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingAddCommittee || !addName.trim()}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-medium flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      {isSubmittingAddCommittee
                        ? "Creating..."
                        : "Create Committee"}
                    </span>
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Committee Created & Generated Credentials Modal */}
      {createdCredentials && (
        <Dialog
          open={!!createdCredentials}
          onOpenChange={(open) => {
            if (!open) {
              setCreatedCredentials(null);
              setCopiedPasscode(false);
            }
          }}
        >
          <DialogContent className="max-w-md bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Committee Created Successfully</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                A standardized, cryptographically secure BoilerBooks PIN passcode
                has been generated for <strong className="text-slate-200">{createdCredentials.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Generated Lead Access PIN</span>
                  <Badge className="bg-sky-500/15 text-sky-300 border-sky-500/30 text-[10px]">
                    Auto-Generated
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-sm text-sky-300 font-semibold tracking-wide select-all">
                  <span>{createdCredentials.passcode}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(createdCredentials.passcode);
                      setCopiedPasscode(true);
                      setTimeout(() => setCopiedPasscode(false), 3000);
                    }}
                    className="h-7 px-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    {copiedPasscode ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1 bg-amber-500/10 border border-amber-500/20 p-3 rounded-md">
                <span className="font-semibold text-amber-300 block">Security Notice</span>
                <span>
                  Please share this passcode securely with the committee lead. They will use this PIN passcode to log into BoilerBooks, manage their budget, and submit purchase requisitions.
                </span>
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-slate-800">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setCreatedCredentials(null);
                  setCopiedPasscode(false);
                }}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium"
              >
                Done
              </Button>
            </DialogFooter>
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
                Credit external grants (SFAB), corporate sponsorships,
                departmental awards, or prize money directly to a committee's
                available budget.
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
                    onValueChange={(val: InflowSourceType) =>
                      setInflowSourceType(val)
                    }
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                      <SelectItem value="SFAB Grant">
                        SFAB Grant (Student Fee Advisory Board)
                      </SelectItem>
                      <SelectItem value="Corporate Sponsorship">
                        Corporate Sponsorship (Lockheed, TI, etc.)
                      </SelectItem>
                      <SelectItem value="Department Allocation">
                        Department Allocation (ECE, ME, AAE)
                      </SelectItem>
                      <SelectItem value="Competition Prize">
                        Competition Prize & Awards
                      </SelectItem>
                      <SelectItem value="Donation">
                        Alumni / Donor Gift
                      </SelectItem>
                      <SelectItem value="Other">
                        Other Miscellaneous Inflow
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="inflow-title"
                  className="text-xs font-medium text-slate-300"
                >
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
                  <Label
                    htmlFor="inflow-amount"
                    className="text-xs font-medium text-slate-300"
                  >
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
                  <Label
                    htmlFor="inflow-date"
                    className="text-xs font-medium text-slate-300"
                  >
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
                <Label
                  htmlFor="inflow-ref"
                  className="text-xs font-medium text-slate-300"
                >
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
                <Label
                  htmlFor="inflow-notes"
                  className="text-xs font-medium text-slate-300"
                >
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

      {/* Edit Committee Funding Inflow Modal */}
      {editingInflow && (
        <Dialog
          open={!!editingInflow}
          onOpenChange={(open) => !open && setEditingInflow(null)}
        >
          <DialogContent className="max-w-lg bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-sky-400" />
                <span>Edit Funding Inflow · {editingInflow.committeeName}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Modify recorded funding inflow details. All changes will be immutably recorded in the financial audit ledger with delta reconciliation.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEditInflow} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">
                  Funding Source Type *
                </Label>
                <Select
                  value={editInflowSourceType}
                  onValueChange={(val: InflowSourceType) =>
                    setEditInflowSourceType(val)
                  }
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                    <SelectItem value="SFAB Grant">
                      SFAB Grant (Student Fee Advisory Board)
                    </SelectItem>
                    <SelectItem value="Corporate Sponsorship">
                      Corporate Sponsorship (Lockheed, TI, etc.)
                    </SelectItem>
                    <SelectItem value="Department Allocation">
                      Department Allocation (ECE, ME, AAE)
                    </SelectItem>
                    <SelectItem value="Competition Prize">
                      Competition Prize & Awards
                    </SelectItem>
                    <SelectItem value="Donation">
                      Alumni / Donor Gift
                    </SelectItem>
                    <SelectItem value="Other">
                      Other Miscellaneous Inflow
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-inflow-title"
                  className="text-xs font-medium text-slate-300"
                >
                  Grant / Sponsorship Title *
                </Label>
                <Input
                  id="edit-inflow-title"
                  value={editInflowTitle}
                  onChange={(e) => setEditInflowTitle(e.target.value)}
                  placeholder="e.g. SFAB Spring 2026 Vehicle Hardware Grant"
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-inflow-amount"
                    className="text-xs font-medium text-slate-300"
                  >
                    Amount ($) *
                  </Label>
                  <Input
                    id="edit-inflow-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={editInflowAmount}
                    onChange={(e) => setEditInflowAmount(e.target.value)}
                    placeholder="3500.00"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs font-mono h-9"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-inflow-date"
                    className="text-xs font-medium text-slate-300"
                  >
                    Received Date
                  </Label>
                  <Input
                    id="edit-inflow-date"
                    type="date"
                    value={editInflowDate}
                    onChange={(e) => setEditInflowDate(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-inflow-ref"
                  className="text-xs font-medium text-slate-300"
                >
                  Grant Reference / PO # / Code (Optional)
                </Label>
                <Input
                  id="edit-inflow-ref"
                  value={editInflowRefNumber}
                  onChange={(e) => setEditInflowRefNumber(e.target.value)}
                  placeholder="e.g. SFAB-2026-ROV-01"
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs font-mono h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-inflow-notes"
                  className="text-xs font-medium text-slate-300"
                >
                  Notes & Earmark Details
                </Label>
                <Textarea
                  id="edit-inflow-notes"
                  value={editInflowNotes}
                  onChange={(e) => setEditInflowNotes(e.target.value)}
                  placeholder="Earmarked equipment specifications, donor conditions..."
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs min-h-[70px]"
                />
              </div>

              {editInflowError && (
                <div
                  role="alert"
                  className="p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-xs text-red-300"
                >
                  {editInflowError}
                </div>
              )}

              <DialogFooter className="pt-3 border-t border-slate-800 flex items-center justify-between sm:justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  ID: {editingInflow.id}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingInflow(null)}
                    className="bg-slate-900 border-slate-700 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingInflowEdit}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-medium flex items-center gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{isSubmittingInflowEdit ? "Saving..." : "Save Inflow Changes"}</span>
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Purchase Requisition Modal (Treasurer) */}
      {editingPurchase && (
        <Dialog
          open={!!editingPurchase}
          onOpenChange={(open) => !open && setEditingPurchase(null)}
        >
          <DialogContent className="max-w-2xl bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-sky-400" />
                <span>Edit Purchase Requisition · {editingPurchase.id}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Update requisition details, funding source, reimbursement parameters, or review status. Modifications are logged to the audit ledger.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEditPurchase} className="space-y-4 py-2">
              {/* Requester Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <Label htmlFor="tp-req-name" className="text-xs font-medium text-slate-300">
                    Requester Name *
                  </Label>
                  <Input
                    id="tp-req-name"
                    value={editPurchaseReqName}
                    onChange={(e) => setEditPurchaseReqName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <Label htmlFor="tp-req-user" className="text-xs font-medium text-slate-300">
                    Purdue Username
                  </Label>
                  <Input
                    id="tp-req-user"
                    value={editPurchasePurdueUser}
                    onChange={(e) => setEditPurchasePurdueUser(e.target.value)}
                    placeholder="e.g. arivera"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9 font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <Label htmlFor="tp-req-email" className="text-xs font-medium text-slate-300">
                    Requester Email *
                  </Label>
                  <Input
                    id="tp-req-email"
                    type="email"
                    value={editPurchaseReqEmail}
                    onChange={(e) => setEditPurchaseReqEmail(e.target.value)}
                    placeholder="arivera@purdue.edu"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>
              </div>

              {/* Vendor & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="tp-vendor" className="text-xs font-medium text-slate-300">
                    Vendor / Merchant *
                  </Label>
                  <Input
                    id="tp-vendor"
                    value={editPurchaseVendor}
                    onChange={(e) => setEditPurchaseVendor(e.target.value)}
                    placeholder="e.g. McMaster-Carr"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="tp-amount" className="text-xs font-medium text-slate-300">
                    Total Amount ($) *
                  </Label>
                  <Input
                    id="tp-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={editPurchaseAmount}
                    onChange={(e) => setEditPurchaseAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Category, Budget Account, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="tp-category" className="text-xs font-medium text-slate-300">
                    Category
                  </Label>
                  <Input
                    id="tp-category"
                    value={editPurchaseCategory}
                    onChange={(e) => setEditPurchaseCategory(e.target.value)}
                    placeholder="e.g. Parts & Materials"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="tp-source" className="text-xs font-medium text-slate-300">
                    Budget Account
                  </Label>
                  <Select
                    value={editPurchaseFundingSource}
                    onValueChange={(val: "GENERAL" | "SFAB") => setEditPurchaseFundingSource(val)}
                  >
                    <SelectTrigger
                      id="tp-source"
                      className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    >
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                      <SelectItem value="GENERAL">General Operating Budget</SelectItem>
                      <SelectItem value="SFAB">SFAB Grant Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="tp-status" className="text-xs font-medium text-slate-300">
                    Requisition Status
                  </Label>
                  <Select
                    value={editPurchaseStatus}
                    onValueChange={(val: PurchaseStatus) => setEditPurchaseStatus(val)}
                  >
                    <SelectTrigger
                      id="tp-status"
                      className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-xs">
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="APPROVED">APPROVED</SelectItem>
                      <SelectItem value="REJECTED">REJECTED</SelectItem>
                      <SelectItem value="REIMBURSED">REIMBURSED</SelectItem>
                      <SelectItem value="PURCHASED">PURCHASED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* SFAB Line Item if SFAB */}
              {editPurchaseFundingSource === "SFAB" && (
                <div className="space-y-1 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <Label htmlFor="tp-sfab-line" className="text-xs font-medium text-amber-300">
                    SFAB Approved Line Item Name / ID
                  </Label>
                  <Input
                    id="tp-sfab-line"
                    value={editPurchaseSfabLine}
                    onChange={(e) => setEditPurchaseSfabLine(e.target.value)}
                    placeholder="e.g. Microcontroller dev boards & sensors"
                    className="bg-slate-900 border-amber-500/40 text-slate-100 text-xs h-9 font-mono"
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="tp-desc" className="text-xs font-medium text-slate-300">
                  Item Description & Purpose
                </Label>
                <Textarea
                  id="tp-desc"
                  value={editPurchaseDesc}
                  onChange={(e) => setEditPurchaseDesc(e.target.value)}
                  placeholder="Item details and technical purpose..."
                  rows={2}
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs"
                />
              </div>

              {/* Accounting & Treasurer Review Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="tp-cool-num" className="text-xs font-medium text-slate-300">
                    Purdue COOL Account Line Number
                  </Label>
                  <Input
                    id="tp-cool-num"
                    value={editPurchaseCoolNumber}
                    onChange={(e) => setEditPurchaseCoolNumber(e.target.value)}
                    placeholder="e.g. 01-234-56"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tp-treasurer-notes" className="text-xs font-medium text-slate-300">
                    Treasurer Audit Notes
                  </Label>
                  <Input
                    id="tp-treasurer-notes"
                    value={editPurchaseTreasurerNotes}
                    onChange={(e) => setEditPurchaseTreasurerNotes(e.target.value)}
                    placeholder="e.g. Tax-exempt verified, direct deposit pending"
                    className="bg-slate-900 border-slate-700 text-slate-100 text-xs h-9"
                  />
                </div>
              </div>

              {editPurchaseError && (
                <div
                  role="alert"
                  className="p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-xs text-red-300"
                >
                  {editPurchaseError}
                </div>
              )}

              <DialogFooter className="pt-3 border-t border-slate-800 flex items-center justify-between sm:justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Committee: {editingPurchase.committeeName}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPurchase(null)}
                    className="bg-slate-900 border-slate-700 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingPurchaseEdit}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-md disabled:opacity-50"
                  >
                    {isSubmittingPurchaseEdit ? "Saving..." : "Save Changes"}
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

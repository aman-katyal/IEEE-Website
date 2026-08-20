/**
 * BoilerBooks 3.0 Database Models and Types
 * Cloudflare D1 (SQLite) Schema Definitions
 */

// Status Enums & Unions
export type PurchaseRequestStatus = 'PENDING' | 'APPROVED' | 'PURCHASED' | 'REIMBURSED' | 'REJECTED';
export type BankStatus = 'Active' | 'Inactive' | 'Read-Only';
export type DuesStatus = 'Active' | 'Inactive';
export type PaymentMethod = 'TooCOOL' | 'Cash' | 'Card' | 'Other';

export type DefaultCommitteeId =
  | 'treasurer'
  | 'president'
  | 'rov'
  | 'racing'
  | 'aesc'
  | 'embs'
  | 'mtts'
  | 'cs'
  | 'learning'
  | 'social';

export type CommitteeId = DefaultCommitteeId | (string & {});

// Raw Database Row Interfaces (SQLite representation)

export interface FiscalYearRow {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: number; // 0 or 1 in SQLite
  created_at: string;
}

export interface FinanceCommitteeRow {
  id: string;
  name: string;
  passcode_hash: string;
  is_admin: number; // 0 or 1 in SQLite
  bank_status: BankStatus;
  dues_status: DuesStatus;
  contact_email: string | null;
}

export interface CommitteeBudgetRow {
  id: string;
  fiscal_year_id: string;
  committee_id: string;
  allocated_amount: number;
  notes: string | null;
}

export interface BudgetCategoryRow {
  id: string;
  committee_id: string;
  name: string;
}

export interface PurchaseRequestRow {
  id: string;
  fiscal_year_id: string;
  committee_id: string;
  category_id: string | null;
  requester_name: string;
  requester_email: string;
  vendor_name: string;
  total_amount: number;
  description: string;
  status: PurchaseRequestStatus;
  receipt_r2_key: string | null;
  receipt_filename: string | null;
  receipt_content_type: string | null;
  cool_account_number: string | null;
  cool_batch_id: string | null;
  treasurer_notes: string | null;
  submitted_at: string;
  approved_at: string | null;
  reimbursed_at: string | null;
}

export interface MemberDuesRow {
  id: string;
  fiscal_year_id: string;
  student_name: string;
  purdue_email: string;
  amount_paid: number;
  payment_method: string;
  payment_date: string;
  semester: string;
  created_at: string;
}

// Domain Model Types (TypeScript ergonomics with boolean flags)

export interface FiscalYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface FinanceCommittee {
  id: string;
  name: string;
  passcodeHash: string;
  isAdmin: boolean;
  bankStatus: BankStatus;
  duesStatus: DuesStatus;
  contactEmail: string | null;
}

export interface CommitteeBudget {
  id: string;
  fiscalYearId: string;
  committeeId: string;
  allocatedAmount: number;
  notes: string | null;
  committeeName?: string;
  fiscalYearName?: string;
}

export interface BudgetCategory {
  id: string;
  committeeId: string;
  name: string;
}

export interface PurchaseRequest {
  id: string;
  fiscalYearId: string;
  committeeId: string;
  categoryId: string | null;
  categoryName?: string | null;
  requesterName: string;
  requesterEmail: string;
  vendorName: string;
  totalAmount: number;
  description: string;
  status: PurchaseRequestStatus;
  receiptR2Key: string | null;
  receiptFilename: string | null;
  receiptContentType: string | null;
  coolAccountNumber: string | null;
  coolBatchId: string | null;
  treasurerNotes: string | null;
  submittedAt: string;
  approvedAt: string | null;
  reimbursedAt: string | null;
}

export interface MemberDues {
  id: string;
  fiscalYearId: string;
  studentName: string;
  purdueEmail: string;
  amountPaid: number;
  paymentMethod: string;
  paymentDate: string;
  semester: string;
  createdAt: string;
}

// Aggregate / View Types

export interface CommitteeBudgetSummary {
  committeeId: string;
  committeeName: string;
  fiscalYearId: string;
  allocatedAmount: number;
  spentAmount: number;
  pendingAmount: number;
  remainingAmount: number;
}

export interface COOLBatchExportItem {
  id: string;
  requesterName: string;
  requesterEmail: string;
  vendorName: string;
  totalAmount: number;
  coolAccountNumber: string | null;
  description: string;
}

// Input DTOs (Data Transfer Objects for Inserts and Updates)

export interface CreateFiscalYearInput {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active?: number;
}

export interface CreateFinanceCommitteeInput {
  id: string;
  name: string;
  passcode_hash: string;
  is_admin?: number;
  bank_status?: BankStatus;
  dues_status?: DuesStatus;
  contact_email?: string | null;
}

export interface CreateCommitteeBudgetInput {
  id: string;
  fiscal_year_id: string;
  committee_id: string;
  allocated_amount: number;
  notes?: string | null;
}

export interface CreateBudgetCategoryInput {
  id: string;
  committee_id: string;
  name: string;
}

export interface CreatePurchaseRequestInput {
  id: string;
  fiscal_year_id: string;
  committee_id: string;
  category_id?: string | null;
  requester_name: string;
  requester_email: string;
  vendor_name: string;
  total_amount: number;
  description: string;
  status?: PurchaseRequestStatus;
  receipt_r2_key?: string | null;
  receipt_filename?: string | null;
  receipt_content_type?: string | null;
  cool_account_number?: string | null;
  cool_batch_id?: string | null;
  treasurer_notes?: string | null;
}

export interface UpdatePurchaseRequestStatusInput {
  id: string;
  status: PurchaseRequestStatus;
  approved_at?: string | null;
  reimbursed_at?: string | null;
  treasurer_notes?: string | null;
  cool_batch_id?: string | null;
}

export interface CreateMemberDuesInput {
  id: string;
  fiscal_year_id: string;
  student_name: string;
  purdue_email: string;
  amount_paid: number;
  payment_method: string;
  payment_date: string;
  semester: string;
}

// Default Seed Committee Definitions
export interface SeedCommittee {
  id: DefaultCommitteeId;
  name: string;
  passcode_hash: string;
  is_admin: number;
  bank_status: BankStatus;
  dues_status: DuesStatus;
  contact_email: string;
}

export const DEFAULT_SEED_COMMITTEES: readonly SeedCommittee[] = [
  {
    id: 'treasurer',
    name: 'Exec Treasurer Admin',
    passcode_hash: '',
    is_admin: 1,
    bank_status: 'Active',
    dues_status: 'Active',
    contact_email: 'treasurer@purdueieee.org',
  },
  {
    id: 'president',
    name: 'Exec President Admin',
    passcode_hash: '',
    is_admin: 1,
    bank_status: 'Active',
    dues_status: 'Active',
    contact_email: 'president@purdueieee.org',
  },
  {
    id: 'rov',
    name: 'Remotely Operated underwater Vehicle',
    passcode_hash: '',
    is_admin: 0,
    bank_status: 'Active',
    dues_status: 'Active',
    contact_email: 'rov@purdueieee.org',
  },
  {
    id: 'racing',
    name: 'IEEE Racing',
    passcode_hash: '',
    is_admin: 0,
    bank_status: 'Active',
    dues_status: 'Active',
    contact_email: 'racing@purdueieee.org',
  },
  {
    id: 'aesc',
    name: 'Aerial Robotics / Drone Team',
    passcode_hash: '',
    is_admin: 0,
    bank_status: 'Active',
    dues_status: 'Active',
    contact_email: 'aesc@purdueieee.org',
  },
  {
    id: 'embs',
    name: 'Engineering in Medicine and Biology',
    passcode_hash: '',
    is_admin: 0,
    bank_status: 'Active',
    dues_status: 'Active',
    contact_email: 'embs@purdueieee.org',
  },
  {
    id: 'mtts',
    name: 'Microwave Theory and Techniques',
    passcode_hash: '',
    is_admin: 0,
    bank_status: 'Active',
    dues_status: 'Active',
    contact_email: 'mtts@purdueieee.org',
  },
  {
    id: 'cs',
    name: 'Computer Society',
    passcode_hash: '',
    is_admin: 0,
    bank_status: 'Active',
    dues_status: 'Active',
    contact_email: 'cs@purdueieee.org',
  },
  {
    id: 'learning',
    name: 'Learning & Code Cafe',
    passcode_hash: '',
    is_admin: 0,
    bank_status: 'Active',
    dues_status: 'Active',
    contact_email: 'learning@purdueieee.org',
  },
  {
    id: 'social',
    name: 'Social & Growth',
    passcode_hash: '',
    is_admin: 0,
    bank_status: 'Active',
    dues_status: 'Active',
    contact_email: 'social@purdueieee.org',
  },
] as const;

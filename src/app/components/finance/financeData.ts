/**
 * BoilerBooks 3.0 Finance Portal Data & Store
 * Purdue University IEEE Student Branch
 */

export type PurchaseStatus = 'PENDING' | 'APPROVED' | 'PURCHASED' | 'REIMBURSED' | 'REJECTED';

export interface CommitteeInfo {
  id: string;
  name: string;
  shortName: string;
  allocated: number;
  contactEmail: string;
  bankStatus?: 'Active' | 'Inactive' | 'Read-Only';
  duesStatus?: 'Active' | 'Inactive';
  notes?: string;
  categories: string[];
}

export interface PurchaseItem {
  id: string;
  committeeId: string;
  committeeName: string;
  requesterName: string;
  requesterEmail: string;
  purdueUsername?: string;
  phoneNumber?: string;
  streetAddress?: string;
  fundingSource?: 'SFAB' | 'GENERAL';
  sfabLineItem?: string;
  disbursementMethod?: 'BOSO_PICKUP' | 'MAIL_ADDRESS' | 'EPAYMENT';
  vendorName: string;
  category: string;
  totalAmount: number;
  description: string;
  status: PurchaseStatus;
  receiptUrl?: string;
  receiptFilename?: string;
  coolAccountNumber?: string;
  treasurerNotes?: string;
  submittedAt: string;
  approvedAt?: string;
  reimbursedAt?: string;
}

export interface MemberDuesRecord {
  id: string;
  studentName: string;
  purdueEmail: string;
  amountPaid: number;
  paymentMethod: 'TooCOOL' | 'Cash' | 'Card';
  paymentDate: string;
  semester: string;
  fiscalYear?: string;
  transactionId?: string;
  status: 'Active' | 'Inactive';
}

export type InflowSourceType =
  | 'SFAB Grant'
  | 'Corporate Sponsorship'
  | 'Department Allocation'
  | 'Competition Prize'
  | 'Donation'
  | 'Other';

export interface CommitteeFundingInflow {
  id: string;
  committeeId: string;
  committeeName?: string;
  sourceType: InflowSourceType;
  title: string;
  amount: number;
  referenceNumber?: string;
  receivedDate: string;
  notes?: string;
  createdAt?: string;
}

export interface AuthSessionData {
  role: 'COMMITTEE_LEAD' | 'TREASURER';
  committeeId: string;
  committeeName: string;
  name: string;
  email: string;
}

export const REAL_COMMITTEES: CommitteeInfo[] = [
  {
    id: 'general',
    name: 'General IEEE Branch',
    shortName: 'General IEEE',
    allocated: 0,
    contactEmail: 'treasurer@purdueieee.org',
    categories: ['Administrative & Office', 'Swag & Marketing', 'Branch Banquets', 'National Dues', 'General'],
  },
  {
    id: 'rov',
    name: 'Remotely Operated underwater Vehicle (ROV)',
    shortName: 'ROV',
    allocated: 0,
    contactEmail: 'rov@purdueieee.org',
    categories: ['Hardware & Thrusters', 'Electronics & Sensors', 'Tools & Fabrication', 'Travel & Competition', 'General'],
  },
  {
    id: 'racing',
    name: 'IEEE Racing (EV Go-Kart)',
    shortName: 'Racing',
    allocated: 0,
    contactEmail: 'racing@purdueieee.org',
    categories: ['Powertrain & Batteries', 'Chassis & Suspension', 'Safety Gear', 'Track Registration', 'General'],
  },
  {
    id: 'aesc',
    name: 'Aerial Robotics (AESS Drone Team)',
    shortName: 'AESS',
    allocated: 0,
    contactEmail: 'aesc@purdueieee.org',
    categories: ['Motors & ESCs', 'Carbon Fiber & Frames', 'Flight Controllers', 'Competition Travel', 'General'],
  },
  {
    id: 'embs',
    name: 'Engineering in Medicine & Biology Society (EMBS)',
    shortName: 'EMBS',
    allocated: 0,
    contactEmail: 'embs@purdueieee.org',
    categories: ['Bio-Sensors & Electrodes', 'Prototyping Materials', 'Workshops & Outreach', 'General'],
  },
  {
    id: 'mtts',
    name: 'Microwave Theory & Techniques Society (MTT-S)',
    shortName: 'MTT-S',
    allocated: 0,
    contactEmail: 'mtts@purdueieee.org',
    categories: ['RF Components & Antennas', 'PCB Fabrication', 'Test & Measurement', 'General'],
  },
  {
    id: 'cs',
    name: 'Computer Society',
    shortName: 'Computer Society',
    allocated: 0,
    contactEmail: 'cs@purdueieee.org',
    categories: ['Server & Cloud Hosting', 'Hackathons & Contests', 'Hardware Dev Kits', 'Workshops', 'General'],
  },
  {
    id: 'smc',
    name: 'Systems, Man, and Cybernetics (SMC)',
    shortName: 'SMC',
    allocated: 0,
    contactEmail: 'smc@purdueieee.org',
    categories: ['Control Systems', 'Sensors & Actuators', 'Workshops & Competitions', 'General'],
  },
  {
    id: 'learning',
    name: 'Learning & Code Cafe',
    shortName: 'Learning',
    allocated: 0,
    contactEmail: 'learning@purdueieee.org',
    categories: ['Microcontroller Kits', 'Soldering Supplies', 'Workshop Refreshments', 'General'],
  },
  {
    id: 'infra',
    name: 'Infrastructure & Web Dev',
    shortName: 'Infrastructure',
    allocated: 0,
    contactEmail: 'infra@purdueieee.org',
    categories: ['Cloud Services', 'Lab Equipment', 'Network Hardware', 'General'],
  },
  {
    id: 'events',
    name: 'Branch Events & Growth',
    shortName: 'Events',
    allocated: 0,
    contactEmail: 'events@purdueieee.org',
    categories: ['Social Events', 'Banquet & Awards', 'Callouts & Swag', 'General'],
  },
  {
    id: 'ir',
    name: 'Industrial Relations & Corporate Partnerships',
    shortName: 'Industrial Relations',
    allocated: 0,
    contactEmail: 'ir@purdueieee.org',
    categories: ['Company Info Sessions', 'Resume Book Hosting', 'Sponsorship Events', 'General'],
  },
  {
    id: 'involvement',
    name: 'Member Involvement',
    shortName: 'Member Involvement',
    allocated: 0,
    contactEmail: 'involvement@purdueieee.org',
    categories: ['Callouts & Socials', 'Mentorship & Workshops', 'Member Retention', 'Swag & Apparel', 'General'],
  },
  {
    id: 'operations',
    name: 'Operations',
    shortName: 'Operations',
    allocated: 0,
    contactEmail: 'operations@purdueieee.org',
    categories: ['Lab Management & Supplies', 'Inventory & Storage', 'Equipment Maintenance', 'Safety & PPE', 'General'],
  },
];

export const INITIAL_PURCHASES: PurchaseItem[] = [];

export const INITIAL_MEMBER_DUES: MemberDuesRecord[] = [];

export const INITIAL_FUNDING_INFLOWS: CommitteeFundingInflow[] = [];

export interface BosoStatementItem {
  id: string;
  type: 'PAYMENT' | 'CREDIT' | 'DEBIT' | 'TRANSFER_OUT';
  date: string;
  docOrCheckNumber: string;
  refCode: string;
  refNumber?: string;
  amount: number;
  clearedDate: string;
  expenseOrIncomeCode: string;
  payeeOrVendor?: string;
}

export interface BosoAccountStatement {
  accountName: string;
  soaNumber: string;
  statementPeriod: string;
  organization: string;
  department: string;
  officeLocation: string;
  phone: string;
  fax: string;
  website: string;
  beginningBalance: number;
  totalPayments: number;
  totalCredits: number;
  totalDebits: number;
  totalTransfersOut: number;
  endingBalance: number;
  payments: BosoStatementItem[];
  credits: BosoStatementItem[];
  debits: BosoStatementItem[];
  transfersOut: BosoStatementItem[];
}

export const OFFICIAL_BOSO_STATEMENT_SFAB_2026: BosoAccountStatement = {
  accountName: 'INST ELECTR ELECTN ENGR SFAB',
  soaNumber: '04612',
  statementPeriod: 'From 6/1/2025 thru 8/31/2026',
  organization: 'Purdue University W. Lafayette',
  department: 'Business Office for Student Organizations (BOSO)',
  officeLocation: 'Krach Leadership Center, (KRCH) RM 365, 1198 Third Street, West Lafayette, IN 47907',
  phone: '(765) 494-6724',
  fax: '(765) 496-2208',
  website: 'https://www.purdue.edu/treasurer/finance/business',
  beginningBalance: 0.00,
  totalPayments: 0.00,
  totalCredits: 0.00,
  totalDebits: 0.00,
  totalTransfersOut: 0.00,
  endingBalance: 0.00,
  payments: [],
  credits: [],
  debits: [],
  transfersOut: [],
};

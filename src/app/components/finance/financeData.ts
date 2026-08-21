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
  categories: string[];
}

export interface PurchaseItem {
  id: string;
  committeeId: string;
  committeeName: string;
  requesterName: string;
  requesterEmail: string;
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
  status: 'Active' | 'Inactive';
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
    id: 'rov',
    name: 'Remotely Operated underwater Vehicle (ROV)',
    shortName: 'ROV',
    allocated: 12000,
    contactEmail: 'rov@purdueieee.org',
    categories: ['Hardware & Thrusters', 'Electronics & Sensors', 'Tools & Fabrication', 'Travel & Competition', 'General'],
  },
  {
    id: 'racing',
    name: 'IEEE Racing (EV Go-Kart)',
    shortName: 'Racing',
    allocated: 10500,
    contactEmail: 'racing@purdueieee.org',
    categories: ['Powertrain & Batteries', 'Chassis & Suspension', 'Safety Gear', 'Track Registration', 'General'],
  },
  {
    id: 'aesc',
    name: 'Aerial Robotics (AESC Drone Team)',
    shortName: 'Aerial Robotics',
    allocated: 8500,
    contactEmail: 'aesc@purdueieee.org',
    categories: ['Motors & ESCs', 'Carbon Fiber & Frames', 'Flight Controllers', 'Competition Travel', 'General'],
  },
  {
    id: 'embs',
    name: 'Engineering in Medicine & Biology Society (EMBS)',
    shortName: 'EMBS',
    allocated: 6000,
    contactEmail: 'embs@purdueieee.org',
    categories: ['Bio-Sensors & Electrodes', 'Prototyping Materials', 'Workshops & Outreach', 'General'],
  },
  {
    id: 'mtts',
    name: 'Microwave Theory & Techniques Society (MTT-S)',
    shortName: 'MTT-S',
    allocated: 5500,
    contactEmail: 'mtts@purdueieee.org',
    categories: ['RF Components & Antennas', 'PCB Fabrication', 'Test & Measurement', 'General'],
  },
  {
    id: 'cs',
    name: 'Computer Society',
    shortName: 'Computer Society',
    allocated: 4500,
    contactEmail: 'cs@purdueieee.org',
    categories: ['Server & Cloud Hosting', 'Hackathons & Contests', 'Hardware Dev Kits', 'Workshops', 'General'],
  },
  {
    id: 'learning',
    name: 'Learning & Code Cafe',
    shortName: 'Learning',
    allocated: 3500,
    contactEmail: 'learning@purdueieee.org',
    categories: ['Microcontroller Kits', 'Soldering Supplies', 'Workshop Refreshments', 'General'],
  },
  {
    id: 'social',
    name: 'Social & Member Growth',
    shortName: 'Social',
    allocated: 3000,
    contactEmail: 'social@purdueieee.org',
    categories: ['Social Events', 'Banquet & Awards', 'Recruitment & Swag', 'General'],
  },
];

export const INITIAL_PURCHASES: PurchaseItem[] = [
  {
    id: 'PR-2026-001',
    committeeId: 'rov',
    committeeName: 'ROV',
    requesterName: 'Alex Rivera',
    requesterEmail: 'arivera@purdue.edu',
    vendorName: 'Blue Robotics',
    category: 'Hardware & Thrusters',
    totalAmount: 1489.50,
    description: 'T200 Thrusters (4x) and Basic ESCs for subsea vehicle propulsion overhaul',
    status: 'APPROVED',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    receiptFilename: 'blue_robotics_invoice_1092.pdf',
    coolAccountNumber: '01-234-56',
    treasurerNotes: 'Tax-exempt confirmed. Ready for COOL batching.',
    submittedAt: '2026-02-10T14:32:00Z',
    approvedAt: '2026-02-12T09:15:00Z',
  },
  {
    id: 'PR-2026-002',
    committeeId: 'racing',
    committeeName: 'Racing',
    requesterName: 'Marcus Vance',
    requesterEmail: 'mvance@purdue.edu',
    vendorName: 'EV Power Solutions',
    category: 'Powertrain & Batteries',
    totalAmount: 2340.00,
    description: 'Custom LiFePO4 battery modules & battery management system',
    status: 'PENDING',
    receiptUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    receiptFilename: 'ev_battery_quote_receipt.pdf',
    coolAccountNumber: '01-234-57',
    submittedAt: '2026-02-18T11:20:00Z',
  },
  {
    id: 'PR-2026-003',
    committeeId: 'aesc',
    committeeName: 'Aerial Robotics',
    requesterName: 'Elena Rostova',
    requesterEmail: 'erostov@purdue.edu',
    vendorName: 'GetFPV',
    category: 'Motors & ESCs',
    totalAmount: 642.75,
    description: 'Brushless drone motors, telemetry modules, and high-discharge LiPo packs',
    status: 'PENDING',
    receiptUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    receiptFilename: 'getfpv_receipt_4421.pdf',
    coolAccountNumber: '01-234-58',
    submittedAt: '2026-02-19T16:45:00Z',
  },
  {
    id: 'PR-2026-004',
    committeeId: 'rov',
    committeeName: 'ROV',
    requesterName: 'Sarah Lin',
    requesterEmail: 'slin44@purdue.edu',
    vendorName: 'McMaster-Carr',
    category: 'Tools & Fabrication',
    totalAmount: 385.20,
    description: 'Anodized aluminum structural brackets and titanium fasteners',
    status: 'REIMBURSED',
    receiptUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    receiptFilename: 'mcmaster_fasteners_receipt.pdf',
    coolAccountNumber: '01-234-56',
    treasurerNotes: 'COOL check #8921 processed by BOSO',
    submittedAt: '2026-01-15T10:00:00Z',
    approvedAt: '2026-01-16T14:00:00Z',
    reimbursedAt: '2026-01-28T16:30:00Z',
  },
  {
    id: 'PR-2026-005',
    committeeId: 'cs',
    committeeName: 'Computer Society',
    requesterName: 'David Chen',
    requesterEmail: 'dchen92@purdue.edu',
    vendorName: 'AWS / Cloud Services',
    category: 'Server & Cloud Hosting',
    totalAmount: 189.00,
    description: 'Quarterly GPU compute allocation for IEEE project hosting and workshop instances',
    status: 'APPROVED',
    receiptUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    receiptFilename: 'aws_invoice_jan2026.pdf',
    coolAccountNumber: '01-234-60',
    treasurerNotes: 'Verified against executive cloud budget',
    submittedAt: '2026-02-05T08:30:00Z',
    approvedAt: '2026-02-07T11:00:00Z',
  },
  {
    id: 'PR-2026-006',
    committeeId: 'mtts',
    committeeName: 'MTT-S',
    requesterName: 'Priya Patel',
    requesterEmail: 'ppatel@purdue.edu',
    vendorName: 'JLCPCB',
    category: 'PCB Fabrication',
    totalAmount: 215.50,
    description: 'Rogers 4350B high frequency 4-layer RF test boards',
    status: 'PURCHASED',
    receiptUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    receiptFilename: 'jlcpcb_rf_order_99.pdf',
    coolAccountNumber: '01-234-59',
    submittedAt: '2026-02-01T13:10:00Z',
    approvedAt: '2026-02-03T15:20:00Z',
  },
];

export const INITIAL_MEMBER_DUES: MemberDuesRecord[] = [
  {
    id: 'DUES-001',
    studentName: 'Alex Rivera',
    purdueEmail: 'arivera@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-12',
    semester: 'Spring 2026',
    status: 'Active',
  },
  {
    id: 'DUES-002',
    studentName: 'Marcus Vance',
    purdueEmail: 'mvance@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-14',
    semester: 'Spring 2026',
    status: 'Active',
  },
  {
    id: 'DUES-003',
    studentName: 'Elena Rostova',
    purdueEmail: 'erostov@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'Card',
    paymentDate: '2026-01-15',
    semester: 'Spring 2026',
    status: 'Active',
  },
  {
    id: 'DUES-004',
    studentName: 'Sarah Lin',
    purdueEmail: 'slin44@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-16',
    semester: 'Spring 2026',
    status: 'Active',
  },
  {
    id: 'DUES-005',
    studentName: 'David Chen',
    purdueEmail: 'dchen92@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-18',
    semester: 'Spring 2026',
    status: 'Active',
  },
  {
    id: 'DUES-006',
    studentName: 'Priya Patel',
    purdueEmail: 'ppatel@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'Cash',
    paymentDate: '2026-01-20',
    semester: 'Spring 2026',
    status: 'Active',
  },
  {
    id: 'DUES-007',
    studentName: 'Jason Wu',
    purdueEmail: 'jwu312@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-22',
    semester: 'Spring 2026',
    status: 'Active',
  },
];

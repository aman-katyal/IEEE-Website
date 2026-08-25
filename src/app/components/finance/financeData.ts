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
    allocated: 15000,
    contactEmail: 'treasurer@purdueieee.org',
    categories: ['Administrative & Office', 'Swag & Marketing', 'Branch Banquets', 'National Dues', 'General'],
  },
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
    name: 'Aerial Robotics (AESS Drone Team)',
    shortName: 'AESS',
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
    id: 'smc',
    name: 'Systems, Man, and Cybernetics (SMC)',
    shortName: 'SMC',
    allocated: 4000,
    contactEmail: 'smc@purdueieee.org',
    categories: ['Control Systems', 'Sensors & Actuators', 'Workshops & Competitions', 'General'],
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
    id: 'infra',
    name: 'Infrastructure & Web Dev',
    shortName: 'Infrastructure',
    allocated: 3000,
    contactEmail: 'infra@purdueieee.org',
    categories: ['Cloud Services', 'Lab Equipment', 'Network Hardware', 'General'],
  },
  {
    id: 'events',
    name: 'Branch Events & Growth',
    shortName: 'Events',
    allocated: 3000,
    contactEmail: 'events@purdueieee.org',
    categories: ['Social Events', 'Banquet & Awards', 'Callouts & Swag', 'General'],
  },
  {
    id: 'ir',
    name: 'Industrial Relations & Corporate Partnerships',
    shortName: 'Industrial Relations',
    allocated: 3000,
    contactEmail: 'ir@purdueieee.org',
    categories: ['Company Info Sessions', 'Resume Book Hosting', 'Sponsorship Events', 'General'],
  },
  {
    id: 'involvement',
    name: 'Member Involvement',
    shortName: 'Member Involvement',
    allocated: 3500,
    contactEmail: 'involvement@purdueieee.org',
    categories: ['Callouts & Socials', 'Mentorship & Workshops', 'Member Retention', 'Swag & Apparel', 'General'],
  },
  {
    id: 'operations',
    name: 'Operations',
    shortName: 'Operations',
    allocated: 4000,
    contactEmail: 'operations@purdueieee.org',
    categories: ['Lab Management & Supplies', 'Inventory & Storage', 'Equipment Maintenance', 'Safety & PPE', 'General'],
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
    id: 'DUES-179435',
    studentName: 'Ryan Leviste',
    purdueEmail: 'ryan.leviste@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-03-05',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-179387',
    studentName: 'Mathias Ufer',
    purdueEmail: 'mathias.ufer@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-03-05',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-178527',
    studentName: 'Melinda Liu',
    purdueEmail: 'melinda.liu@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-27',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-178327',
    studentName: 'Youssef Belhadj',
    purdueEmail: 'youssef.belhadj@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-26',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-176808',
    studentName: 'Alaqmar Bohori',
    purdueEmail: 'alaqmar.bohori@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-14',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-176716',
    studentName: 'Ashish Singh Dhillon',
    purdueEmail: 'ashish.dhillon@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-13',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-176574',
    studentName: 'Gabriela Mayorga',
    purdueEmail: 'gabriela.mayorga@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-12',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-176510',
    studentName: 'Sourish Manthati',
    purdueEmail: 'sourish.manthati@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-11',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-175846',
    studentName: 'Nuraly Sermagambet',
    purdueEmail: 'nuraly.sermagambet@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-07',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-175671',
    studentName: 'Anupama Khanwale',
    purdueEmail: 'anupama.khanwale@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-06',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-175544',
    studentName: 'Arvind Rao',
    purdueEmail: 'arvind.rao@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-05',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-175150',
    studentName: 'Justin Liu',
    purdueEmail: 'justin.liu@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-03',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-174907',
    studentName: 'Eelin Yang',
    purdueEmail: 'eelin.yang@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-02-02',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-174302',
    studentName: 'Sarim Khan',
    purdueEmail: 'sarim.khan@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-29',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-174303',
    studentName: 'Ella Chiang',
    purdueEmail: 'ella.chiang@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-29',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-174211',
    studentName: 'Karson Ho',
    purdueEmail: 'karson.ho@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-29',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-174126',
    studentName: 'Nurdaulet Aba',
    purdueEmail: 'nurdaulet.aba@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-28',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-174117',
    studentName: 'Sarddar Konurbayev',
    purdueEmail: 'sarddar.konurbayev@purdue.edu',
    amountPaid: 15.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-28',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
  {
    id: 'DUES-173761',
    studentName: 'Shruti Senthilnathan',
    purdueEmail: 'shruti.senthilnathan@purdue.edu',
    amountPaid: 10.00,
    paymentMethod: 'TooCOOL',
    paymentDate: '2026-01-26',
    semester: 'Spring 2026',
    fiscalYear: '2025-2026',
    status: 'Active',
  },
];

export const INITIAL_FUNDING_INFLOWS: CommitteeFundingInflow[] = [
  {
    id: 'INFLOW-001',
    committeeId: 'rov',
    committeeName: 'ROV',
    sourceType: 'SFAB Grant',
    title: 'SFAB Spring 2026 Vehicle Hardware Grant',
    amount: 3500.00,
    referenceNumber: 'SFAB-2026-ROV-01',
    receivedDate: '2026-01-10',
    notes: 'Approved by SFAB for autonomous underwater thrusters and pressure housing fabrication.',
  },
  {
    id: 'INFLOW-002',
    committeeId: 'racing',
    committeeName: 'Racing',
    sourceType: 'Corporate Sponsorship',
    title: 'Lockheed Martin EV Powertrain Sponsorship',
    amount: 2500.00,
    referenceNumber: 'LM-SPONSOR-2026',
    receivedDate: '2026-01-18',
    notes: 'Corporate grant towards EV Go-Kart high-voltage battery modules.',
  },
  {
    id: 'INFLOW-003',
    committeeId: 'aesc',
    committeeName: 'AESS',
    sourceType: 'Department Allocation',
    title: 'AAE Department Aerial Avionics Earmark',
    amount: 1500.00,
    referenceNumber: 'AAE-PURDUE-442',
    receivedDate: '2026-01-25',
    notes: 'Aeronautics & Astronautics department grant for drone telemetry and flight controllers.',
  },
  {
    id: 'INFLOW-004',
    committeeId: 'cs',
    committeeName: 'Computer Society',
    sourceType: 'Corporate Sponsorship',
    title: 'Texas Instruments Hackathon Co-Sponsorship',
    amount: 1000.00,
    referenceNumber: 'TI-GR-9021',
    receivedDate: '2026-02-02',
    notes: 'Hackathon workshops and microcontroller dev boards.',
  },
  {
    id: 'INFLOW-005',
    committeeId: 'operations',
    committeeName: 'Operations',
    sourceType: 'Donation',
    title: 'Alumni Lab Tooling Equipment Donation',
    amount: 800.00,
    referenceNumber: 'DONATION-ALUM-88',
    receivedDate: '2026-02-05',
    notes: 'Designated for general soldering stations and lab safety equipment overhaul.',
  },
];

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
  statementPeriod: 'From 6/1/2026 thru 8/31/2026',
  organization: 'Purdue University W. Lafayette',
  department: 'Business Office for Student Organizations (BOSO)',
  officeLocation: 'Krach Leadership Center, (KRCH) RM 365, 1198 Third Street, West Lafayette, IN 47907',
  phone: '(765) 494-6724',
  fax: '(765) 496-2208',
  website: 'https://www.purdue.edu/treasurer/finance/business',
  beginningBalance: 11390.55,
  totalPayments: 1062.77,
  totalCredits: 563.13,
  totalDebits: 10145.53,
  totalTransfersOut: 745.38,
  endingBalance: 0.00,
  payments: [
    {
      id: 'PAY-001',
      type: 'PAYMENT',
      date: '06/01/26',
      docOrCheckNumber: '372271',
      refCode: 'U8583858',
      refNumber: 'SFAB 25-26',
      amount: 161.34,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Equipment $4999 or Less',
      payeeOrVendor: 'Underground Printing',
    },
    {
      id: 'PAY-002',
      type: 'PAYMENT',
      date: '06/11/26',
      docOrCheckNumber: 'E331454',
      refCode: 'Amazon',
      amount: 7.48,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Equipment $4999 or Less',
      payeeOrVendor: 'Brendon Hayes',
    },
    {
      id: 'PAY-003',
      type: 'PAYMENT',
      date: '06/11/26',
      docOrCheckNumber: 'E331454',
      refCode: 'Amazon',
      amount: 13.90,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Equipment $4999 or Less',
      payeeOrVendor: 'Brendon Hayes',
    },
    {
      id: 'PAY-004',
      type: 'PAYMENT',
      date: '06/11/26',
      docOrCheckNumber: 'E331454',
      refCode: 'eBay',
      amount: 294.25,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Equipment $4999 or Less',
      payeeOrVendor: 'Brendon Hayes',
    },
    {
      id: 'PAY-005',
      type: 'PAYMENT',
      date: '06/11/26',
      docOrCheckNumber: 'E331454',
      refCode: 'Amazon',
      amount: 9.62,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Equipment $4999 or Less',
      payeeOrVendor: 'Brendon Hayes',
    },
    {
      id: 'PAY-006',
      type: 'PAYMENT',
      date: '06/11/26',
      docOrCheckNumber: 'E331454',
      refCode: 'Amazon',
      amount: 16.04,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Equipment $4999 or Less',
      payeeOrVendor: 'Brendon Hayes',
    },
    {
      id: 'PAY-007',
      type: 'PAYMENT',
      date: '06/26/26',
      docOrCheckNumber: 'E331903',
      refCode: 'Reissue E316419',
      refNumber: '0626073',
      amount: 304.61,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Equipment $4999 or Less',
      payeeOrVendor: 'Tai Hsu',
    },
    {
      id: 'PAY-008',
      type: 'PAYMENT',
      date: '06/26/26',
      docOrCheckNumber: 'E331903',
      refCode: 'Reissue E316419',
      refNumber: '0626073',
      amount: 255.53,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Supplies',
      payeeOrVendor: 'Tai Hsu',
    },
  ],
  credits: [
    {
      id: 'CRD-001',
      type: 'CREDIT',
      date: '06/03/26',
      docOrCheckNumber: '0626015',
      refCode: 'AMAZON.COM, INC',
      refNumber: '120534537',
      amount: 2.99,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Supplies',
      payeeOrVendor: 'AMAZON.COM, INC',
    },
    {
      id: 'CRD-002',
      type: 'CREDIT',
      date: '06/23/26',
      docOrCheckNumber: '0626073',
      refCode: 'Void E316419',
      refNumber: 'T Hsu',
      amount: 304.61,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Equipment $4999 or Less',
      payeeOrVendor: 'T Hsu (Voided)',
    },
    {
      id: 'CRD-003',
      type: 'CREDIT',
      date: '06/23/26',
      docOrCheckNumber: '0626073',
      refCode: 'Void E316419',
      refNumber: 'T Hsu',
      amount: 255.53,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Supplies',
      payeeOrVendor: 'T Hsu (Voided)',
    },
  ],
  debits: [
    {
      id: 'DEB-001',
      type: 'DEBIT',
      date: '06/03/26',
      docOrCheckNumber: '0626014',
      refCode: 'MCMASTER-CARR S',
      refNumber: '120534538',
      amount: 88.03,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Supplies',
      payeeOrVendor: 'MCMASTER-CARR',
    },
    {
      id: 'DEB-002',
      type: 'DEBIT',
      date: '06/03/26',
      docOrCheckNumber: '0626014',
      refCode: 'OSH Park',
      refNumber: '120534538',
      amount: 48.80,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Supplies',
      payeeOrVendor: 'OSH Park',
    },
    {
      id: 'DEB-003',
      type: 'DEBIT',
      date: '06/03/26',
      docOrCheckNumber: '0626011',
      refCode: 'EUROS',
      refNumber: '1902614125',
      amount: 8999.51,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Event Expense',
      payeeOrVendor: 'EUROS Event Expense',
    },
    {
      id: 'DEB-004',
      type: 'DEBIT',
      date: '06/03/26',
      docOrCheckNumber: '0626017',
      refCode: 'AMAZON.COM, INC',
      refNumber: '120534538',
      amount: 1009.19,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Supplies',
      payeeOrVendor: 'AMAZON.COM, INC',
    },
  ],
  transfersOut: [
    {
      id: 'TRF-001',
      type: 'TRANSFER_OUT',
      date: '07/10/26',
      docOrCheckNumber: '26874',
      refCode: 'Unused SFAB',
      refNumber: 'FY 25-26',
      amount: 745.38,
      clearedDate: '08/17/26',
      expenseOrIncomeCode: 'Transfer',
      payeeOrVendor: 'Unused SFAB (Fiscal Year Closeout Sweep)',
    },
  ],
};


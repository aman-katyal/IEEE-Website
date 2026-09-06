-- BoilerBooks 3.0 Database Schema Migration
-- Migration: 0001_initial_schema.sql
-- Target: Cloudflare D1 (SQLite)

-- 1. Fiscal Years Table
CREATE TABLE IF NOT EXISTS fiscal_years (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Finance Committees Table
CREATE TABLE IF NOT EXISTS finance_committees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    passcode_hash TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    bank_status TEXT NOT NULL DEFAULT 'Active',
    dues_status TEXT NOT NULL DEFAULT 'Active',
    contact_email TEXT
);

-- 3. Committee Budgets Table
CREATE TABLE IF NOT EXISTS committee_budgets (
    id TEXT PRIMARY KEY,
    fiscal_year_id TEXT NOT NULL REFERENCES fiscal_years(id) ON DELETE CASCADE,
    committee_id TEXT NOT NULL REFERENCES finance_committees(id) ON DELETE CASCADE,
    allocated_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    UNIQUE(fiscal_year_id, committee_id)
);

-- 4. Budget Categories Table
CREATE TABLE IF NOT EXISTS budget_categories (
    id TEXT PRIMARY KEY,
    committee_id TEXT NOT NULL REFERENCES finance_committees(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- 5. Purchase Requests Table
CREATE TABLE IF NOT EXISTS purchase_requests (
    id TEXT PRIMARY KEY,
    fiscal_year_id TEXT NOT NULL REFERENCES fiscal_years(id) ON DELETE RESTRICT,
    committee_id TEXT NOT NULL REFERENCES finance_committees(id) ON DELETE RESTRICT,
    category_id TEXT REFERENCES budget_categories(id) ON DELETE SET NULL,
    funding_source TEXT NOT NULL DEFAULT 'GENERAL',
    sfab_line_item TEXT,
    purdue_username TEXT NOT NULL DEFAULT '',
    street_address TEXT NOT NULL DEFAULT '',
    phone_number TEXT NOT NULL DEFAULT '',
    disbursement_method TEXT NOT NULL DEFAULT 'BOSO_PICKUP',
    requester_name TEXT NOT NULL,
    requester_email TEXT NOT NULL,
    vendor_name TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    receipt_r2_key TEXT,
    receipt_filename TEXT,
    receipt_content_type TEXT,
    cool_account_number TEXT,
    cool_batch_id TEXT,
    treasurer_notes TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    reimbursed_at DATETIME
);

-- 6. Member Dues Table
CREATE TABLE IF NOT EXISTS member_dues (
    id TEXT PRIMARY KEY,
    fiscal_year_id TEXT NOT NULL REFERENCES fiscal_years(id) ON DELETE RESTRICT,
    student_name TEXT NOT NULL,
    purdue_email TEXT NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_date DATE NOT NULL,
    semester TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Committee Funding Inflows Table (Grants, Sponsorships, SFAB Allocations, Department Awards)
CREATE TABLE IF NOT EXISTS committee_funding_inflows (
    id TEXT PRIMARY KEY,
    fiscal_year_id TEXT NOT NULL REFERENCES fiscal_years(id) ON DELETE RESTRICT,
    committee_id TEXT NOT NULL REFERENCES finance_committees(id) ON DELETE RESTRICT,
    source_type TEXT NOT NULL DEFAULT 'Other',
    title TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reference_number TEXT,
    received_date DATE NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Budget Audit Logs Table (Tracks revisions to committee allocations and grants)
CREATE TABLE IF NOT EXISTS budget_audit_logs (
    id TEXT PRIMARY KEY,
    committee_id TEXT NOT NULL,
    fiscal_year_id TEXT NOT NULL,
    adjusted_by TEXT NOT NULL,
    previous_amount DECIMAL(10, 2) NOT NULL,
    new_amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8b. Comprehensive Financial Audit Ledger
CREATE TABLE IF NOT EXISTS financial_audit_ledger (
    id TEXT PRIMARY KEY,
    fiscal_year_id TEXT NOT NULL DEFAULT 'fy25-26',
    committee_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_email TEXT,
    description TEXT NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    amount_delta DECIMAL(10, 2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. BOSO Account Statements Table
CREATE TABLE IF NOT EXISTS boso_account_statements (
    soa_number TEXT PRIMARY KEY,
    account_name TEXT NOT NULL,
    statement_period TEXT NOT NULL,
    organization TEXT NOT NULL,
    department TEXT NOT NULL,
    office_location TEXT NOT NULL,
    phone TEXT,
    fax TEXT,
    website TEXT,
    beginning_balance DECIMAL(10, 2) NOT NULL,
    total_payments DECIMAL(10, 2) NOT NULL,
    total_credits DECIMAL(10, 2) NOT NULL,
    total_debits DECIMAL(10, 2) NOT NULL,
    total_transfers_out DECIMAL(10, 2) NOT NULL,
    ending_balance DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. BOSO Statement Items Table
CREATE TABLE IF NOT EXISTS boso_statement_items (
    id TEXT PRIMARY KEY,
    soa_number TEXT NOT NULL REFERENCES boso_account_statements(soa_number) ON DELETE CASCADE,
    item_type TEXT NOT NULL, -- 'PAYMENT', 'CREDIT', 'DEBIT', 'TRANSFER_OUT'
    transaction_date DATE NOT NULL,
    doc_or_check_number TEXT NOT NULL,
    ref_code TEXT NOT NULL,
    ref_number TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    cleared_date DATE NOT NULL,
    expense_or_income_code TEXT NOT NULL,
    payee_or_vendor TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Query Performance & Lookups
CREATE INDEX IF NOT EXISTS idx_committee_budgets_fy ON committee_budgets(fiscal_year_id);
CREATE INDEX IF NOT EXISTS idx_committee_budgets_committee ON committee_budgets(committee_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_committee ON budget_categories(committee_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_fy ON purchase_requests(fiscal_year_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_committee ON purchase_requests(committee_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX IF NOT EXISTS idx_member_dues_email ON member_dues(purdue_email);
CREATE INDEX IF NOT EXISTS idx_member_dues_fy ON member_dues(fiscal_year_id);
CREATE INDEX IF NOT EXISTS idx_inflows_committee ON committee_funding_inflows(committee_id);
CREATE INDEX IF NOT EXISTS idx_inflows_fy ON committee_funding_inflows(fiscal_year_id);
CREATE INDEX IF NOT EXISTS idx_budget_audit_committee ON budget_audit_logs(committee_id);
CREATE INDEX IF NOT EXISTS idx_boso_items_soa ON boso_statement_items(soa_number);
CREATE INDEX IF NOT EXISTS idx_boso_items_type ON boso_statement_items(item_type);

-- Default Seed Committees
INSERT OR IGNORE INTO finance_committees (id, name, passcode_hash, is_admin, bank_status, dues_status, contact_email) VALUES
    ('treasurer', 'Exec Treasurer Admin', '', 1, 'Active', 'Active', 'treasurer@purdueieee.org'),
    ('president', 'Exec President Admin', '', 1, 'Active', 'Active', 'president@purdueieee.org'),
    ('rov', 'Remotely Operated underwater Vehicle', '', 0, 'Active', 'Active', 'rov@purdueieee.org'),
    ('racing', 'IEEE Racing', '', 0, 'Active', 'Active', 'racing@purdueieee.org'),
    ('aesc', 'Aerial Robotics / Drone Team', '', 0, 'Active', 'Active', 'aesc@purdueieee.org'),
    ('embs', 'Engineering in Medicine and Biology', '', 0, 'Active', 'Active', 'embs@purdueieee.org'),
    ('mtts', 'Microwave Theory and Techniques', '', 0, 'Active', 'Active', 'mtts@purdueieee.org'),
    ('cs', 'Computer Society', '', 0, 'Active', 'Active', 'cs@purdueieee.org'),
    ('eds', 'Electron Devices Society (EDS)', '', 0, 'Active', 'Active', 'eds@purdueieee.org'),
    ('learning', 'Learning & Code Cafe', '', 0, 'Active', 'Active', 'learning@purdueieee.org'),
    ('social', 'Social & Growth', '', 0, 'Active', 'Active', 'social@purdueieee.org');

-- Seed Official BOSO Statement (SOA #04612)
INSERT OR IGNORE INTO boso_account_statements (
    soa_number, account_name, statement_period, organization, department, office_location, phone, fax, website, beginning_balance, total_payments, total_credits, total_debits, total_transfers_out, ending_balance
) VALUES (
    '04612', 'INST ELECTR ELECTN ENGR SFAB', 'From 6/1/2026 thru 8/31/2026', 'Purdue University W. Lafayette', 'Business Office for Student Organizations (BOSO)', 'Krach Leadership Center, (KRCH) RM 365, 1198 Third Street, West Lafayette, IN 47907', '(765) 494-6724', '(765) 496-2208', 'https://www.purdue.edu/treasurer/finance/business', 11390.55, 1062.77, 563.13, 10145.53, 745.38, 0.00
);

INSERT OR IGNORE INTO boso_statement_items (
    id, soa_number, item_type, transaction_date, doc_or_check_number, ref_code, ref_number, amount, cleared_date, expense_or_income_code, payee_or_vendor
) VALUES
    ('PAY-001', '04612', 'PAYMENT', '2026-06-01', '372271', 'U8583858', 'SFAB 25-26', 161.34, '2026-07-13', 'Equipment $4999 or Less', 'Underground Printing'),
    ('PAY-002', '04612', 'PAYMENT', '2026-06-11', 'E331454', 'Amazon', NULL, 7.48, '2026-07-13', 'Equipment $4999 or Less', 'Brendon Hayes'),
    ('PAY-003', '04612', 'PAYMENT', '2026-06-11', 'E331454', 'Amazon', NULL, 13.90, '2026-07-13', 'Equipment $4999 or Less', 'Brendon Hayes'),
    ('PAY-004', '04612', 'PAYMENT', '2026-06-11', 'E331454', 'eBay', NULL, 294.25, '2026-07-13', 'Equipment $4999 or Less', 'Brendon Hayes'),
    ('PAY-005', '04612', 'PAYMENT', '2026-06-11', 'E331454', 'Amazon', NULL, 9.62, '2026-07-13', 'Equipment $4999 or Less', 'Brendon Hayes'),
    ('PAY-006', '04612', 'PAYMENT', '2026-06-11', 'E331454', 'Amazon', NULL, 16.04, '2026-07-13', 'Equipment $4999 or Less', 'Brendon Hayes'),
    ('PAY-007', '04612', 'PAYMENT', '2026-06-26', 'E331903', 'Reissue E316419', '0626073', 304.61, '2026-07-13', 'Equipment $4999 or Less', 'Tai Hsu'),
    ('PAY-008', '04612', 'PAYMENT', '2026-06-26', 'E331903', 'Reissue E316419', '0626073', 255.53, '2026-07-13', 'Supplies', 'Tai Hsu'),
    ('CRD-001', '04612', 'CREDIT', '2026-06-03', '0626015', 'AMAZON.COM, INC', '120534537', 2.99, '2026-07-13', 'Supplies', 'AMAZON.COM, INC'),
    ('CRD-002', '04612', 'CREDIT', '2026-06-23', '0626073', 'Void E316419', 'T Hsu', 304.61, '2026-07-13', 'Equipment $4999 or Less', 'T Hsu (Voided)'),
    ('CRD-003', '04612', 'CREDIT', '2026-06-23', '0626073', 'Void E316419', 'T Hsu', 255.53, '2026-07-13', 'Supplies', 'T Hsu (Voided)'),
    ('DEB-001', '04612', 'DEBIT', '2026-06-03', '0626014', 'MCMASTER-CARR S', '120534538', 88.03, '2026-07-13', 'Supplies', 'MCMASTER-CARR'),
    ('DEB-002', '04612', 'DEBIT', '2026-06-03', '0626014', 'OSH Park', '120534538', 48.80, '2026-07-13', 'Supplies', 'OSH Park'),
    ('DEB-003', '04612', 'DEBIT', '2026-06-03', '0626011', 'EUROS', '1902614125', 8999.51, '2026-07-13', 'Event Expense', 'EUROS Event Expense'),
    ('DEB-004', '04612', 'DEBIT', '2026-06-03', '0626017', 'AMAZON.COM, INC', '120534538', 1009.19, '2026-07-13', 'Supplies', 'AMAZON.COM, INC'),
    ('TRF-001', '04612', 'TRANSFER_OUT', '2026-07-10', '26874', 'Unused SFAB', 'FY 25-26', 745.38, '2026-08-17', 'Transfer', 'Unused SFAB (Fiscal Year Closeout Sweep)');


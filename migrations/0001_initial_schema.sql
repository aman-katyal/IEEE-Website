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
    ('learning', 'Learning & Code Cafe', '', 0, 'Active', 'Active', 'learning@purdueieee.org'),
    ('social', 'Social & Growth', '', 0, 'Active', 'Active', 'social@purdueieee.org');

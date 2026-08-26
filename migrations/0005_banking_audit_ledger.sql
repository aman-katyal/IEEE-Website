-- BoilerBooks 3.0 Comprehensive Financial Audit Ledger
-- Migration: 0005_banking_audit_ledger.sql

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

CREATE INDEX IF NOT EXISTS idx_audit_ledger_committee ON financial_audit_ledger(committee_id, fiscal_year_id);
CREATE INDEX IF NOT EXISTS idx_audit_ledger_created ON financial_audit_ledger(created_at DESC);

-- BoilerBooks 3.0 SFAB & General Budget Separation
-- Migration: 0006_sfab_budget_separation.sql

ALTER TABLE committee_budgets ADD COLUMN sfab_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

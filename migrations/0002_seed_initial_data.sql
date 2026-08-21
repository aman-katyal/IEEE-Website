-- BoilerBooks 3.0 Initial Seed Migration for Purdue IEEE
-- Migration: 0002_seed_initial_data.sql

-- 1. Active Fiscal Year (2025-2026)
INSERT OR IGNORE INTO fiscal_years (id, name, start_date, end_date, is_active)
VALUES ('fy25-26', 'Fiscal Year 2025-2026', '2025-07-01', '2026-06-30', 1);

-- 2. Finance Committees Roster
INSERT OR IGNORE INTO finance_committees (id, name, passcode_hash, is_admin, bank_status, dues_status, contact_email) VALUES
('treasurer', 'Executive Treasurer', '1903', 1, 'Active', 'Active', 'treasurer@purdueieee.org'),
('general', 'General IEEE Branch', '1903', 0, 'Active', 'Active', 'executive@purdueieee.org'),
('rov', 'Remotely Operated underwater Vehicle (ROV)', '1903', 0, 'Active', 'Active', 'rov@purdueieee.org'),
('racing', 'IEEE Racing (Formula Electric / EV)', '1903', 0, 'Active', 'Active', 'racing@purdueieee.org'),
('cs', 'IEEE Computer Society', '1903', 0, 'Active', 'Active', 'cs@purdueieee.org'),
('embs', 'Engineering in Medicine & Biology Society (EMBS)', '1903', 0, 'Active', 'Active', 'embs@purdueieee.org'),
('mtts', 'Microwave Theory and Technology Society (MTT-S)', '1903', 0, 'Active', 'Active', 'mtts@purdueieee.org'),
('aess', 'Aerospace & Electronic Systems Society (AESS)', '1903', 0, 'Active', 'Active', 'aess@purdueieee.org'),
('learning', 'Learning Committee (Hands-on Workshops)', '1903', 0, 'Active', 'Active', 'learning@purdueieee.org'),
('infrastructure', 'Infrastructure & Lab Tooling', '1903', 0, 'Active', 'Active', 'infra@purdueieee.org'),
('events', 'Social & Branch Events', '1903', 0, 'Active', 'Active', 'events@purdueieee.org'),
('industrial-relations', 'Industrial Relations (IR & Corporate)', '1903', 0, 'Active', 'Active', 'ir@purdueieee.org'),
('member-involvement', 'Member Involvement & Mentorship', '1903', 0, 'Active', 'Active', 'membership@purdueieee.org'),
('operations', 'Operations & Facilities', '1903', 0, 'Active', 'Active', 'ops@purdueieee.org');

-- 3. Committee Annual Baseline Budget Allocations (FY 2025-2026)
INSERT OR IGNORE INTO committee_budgets (id, fiscal_year_id, committee_id, allocated_amount, notes) VALUES
('cb-rov-fy25-26', 'fy25-26', 'rov', 12000.00, 'RoboSub MATE competition baseline budget'),
('cb-racing-fy25-26', 'fy25-26', 'racing', 14000.00, 'EV powertrain, battery cells, chassis allocation'),
('cb-cs-fy25-26', 'fy25-26', 'cs', 5000.00, 'Compute instances, hackathons, open source bounties'),
('cb-embs-fy25-26', 'fy25-26', 'embs', 4500.00, 'Bio-sensing PCB fabrication, sensors, test gear'),
('cb-mtts-fy25-26', 'fy25-26', 'mtts', 4000.00, 'RF vector network analyzer parts, radar design'),
('cb-aess-fy25-26', 'fy25-26', 'aess', 5500.00, 'Avionics, telemetry transmitters, rocketry telemetry'),
('cb-learning-fy25-26', 'fy25-26', 'learning', 3000.00, 'Soldering kits, microcontroller workshop consumables'),
('cb-infra-fy25-26', 'fy25-26', 'infrastructure', 8000.00, 'B14 lab 3D printers, server racks, CNC maintenance'),
('cb-events-fy25-26', 'fy25-26', 'events', 4000.00, 'General callouts, banquets, networking dinners'),
('cb-ir-fy25-26', 'fy25-26', 'industrial-relations', 6000.00, 'Sponsor networking summit, travel, marketing'),
('cb-member-involvement-fy25-26', 'fy25-26', 'member-involvement', 3500.00, 'Mentorship mixers, onboarding, cohort retreats'),
('cb-operations-fy25-26', 'fy25-26', 'operations', 4000.00, 'Storage logistics, equipment transport, PPE supplies'),
('cb-general-fy25-26', 'fy25-26', 'general', 16500.00, 'Branch executive operations and reserve pool');

-- 4. Standard Budget Categories
INSERT OR IGNORE INTO budget_categories (id, committee_id, name) VALUES
('cat-rov-hardware', 'rov', 'Vehicle Hardware & Thrusters'),
('cat-rov-pcb', 'rov', 'Sensors & Custom PCBs'),
('cat-rov-travel', 'rov', 'Competition Travel & Logistics'),
('cat-racing-powertrain', 'racing', 'Powertrain & Inverters'),
('cat-racing-chassis', 'racing', 'Chassis & Aerodynamics'),
('cat-cs-cloud', 'cs', 'Cloud Hosting & GPUs'),
('cat-learning-kits', 'learning', 'Soldering & Workshop Parts'),
('cat-infra-tools', 'infrastructure', 'Lab Tools & 3D Filament');

-- 5. Committee Specific Funding Inflows (SFAB & Corporate Grants)
INSERT OR IGNORE INTO committee_funding_inflows (id, fiscal_year_id, committee_id, source_type, title, amount, reference_number, received_date, notes) VALUES
('inflow-rov-sfab', 'fy25-26', 'rov', 'SFAB Grant', 'SFAB Spring 2026 Vehicle Hardware Grant', 3500.00, 'SFAB-2026-ROV-01', '2026-01-10', 'Earmarked for heavy-payload thrusters and enclosure seals'),
('inflow-racing-ti', 'fy25-26', 'racing', 'Corporate Sponsorship', 'Texas Instruments EV Telemetry Grant', 2500.00, 'TI-SPON-2026-01', '2026-01-15', 'Custom battery management ICs and instrumentation sponsorship'),
('inflow-aess-ece', 'fy25-26', 'aess', 'Department Allocation', 'ECE Department Avionics Equipment Award', 1500.00, 'ECE-ALLOC-2026-AESS', '2026-01-20', 'High-altitude ballooning GPS and telemetry transceivers'),
('inflow-learning-don', 'fy25-26', 'learning', 'Donation', 'Alumni Workshop Kit Fund', 800.00, 'ALUM-DON-2026-LEARN', '2026-01-22', 'Consumables donation for fresh solder stations in EE 014'),
('inflow-cs-comp', 'fy25-26', 'cs', 'Competition Prize', 'HackPurdue Innovation Prize Money', 1000.00, 'HACKPURDUE-PRIZE-2026', '2026-02-01', 'First place hardware hack prize credited to CS budget pool');

-- BoilerBooks 3.0 Initial Seed Migration for Purdue IEEE
-- Migration: 0002_seed_initial_data.sql

-- 1. Active Fiscal Year (2025-2026)
INSERT OR IGNORE INTO fiscal_years (id, name, start_date, end_date, is_active)
VALUES ('fy25-26', 'Fiscal Year 2025-2026', '2025-07-01', '2026-06-30', 1);

-- 2. Finance Committees Roster (PBKDF2-SHA256 Hashed Passcodes)
INSERT OR IGNORE INTO finance_committees (id, name, passcode_hash, is_admin, bank_status, dues_status, contact_email) VALUES
('treasurer', 'Executive Treasurer', 'pbkdf2:sha256:100000:f38c7ce916391eba077055be6b5e0980:45fd7c35da0ea33929010975bcbacdc44de18d7ae3ed8bdcff806b0357ecc3ab', 1, 'Active', 'Active', 'treasurer@purdueieee.org'),
('general', 'General IEEE Branch', 'pbkdf2:sha256:100000:c5c42d810eefa93ac190bdf3a57e2dac:717e74a035f845a7a85e5c5d3313b2dcba94d5be5459a86670e18ae5e0652f8d', 0, 'Active', 'Active', 'executive@purdueieee.org'),
('rov', 'Remotely Operated underwater Vehicle (ROV)', 'pbkdf2:sha256:100000:974ca56c8644bde3a35c41ee329510b9:0cacadf3c5ea7311d64390f25ce29ce3066a49d44fa3614dae7694ca751467db', 0, 'Active', 'Active', 'rov@purdueieee.org'),
('racing', 'IEEE Racing (Formula Electric / EV)', 'pbkdf2:sha256:100000:37d72f1d0c034ad7185a1a2c19c908b3:6e57e3123ec079dd935ba5e7be2542cd3be0c5d5e0693bb065abbf3e964e9902', 0, 'Active', 'Active', 'racing@purdueieee.org'),
('cs', 'IEEE Computer Society', 'pbkdf2:sha256:100000:95fccdbb237d0db116b4d9a03cc9affe:3bb0a3d04dcb85eefa63e82ebb117916aa55b529f2b581d2296ce1cde3d635df', 0, 'Active', 'Active', 'cs@purdueieee.org'),
('embs', 'Engineering in Medicine & Biology Society (EMBS)', 'pbkdf2:sha256:100000:3eb549ffb13821f8ca1fc61646524eb0:9388dd811d9f0e24868c099882a48464c134c2b223991eb3f67538cc18939839', 0, 'Active', 'Active', 'embs@purdueieee.org'),
('mtts', 'Microwave Theory and Technology Society (MTT-S)', 'pbkdf2:sha256:100000:ad1b5800094e6a76ac8b6b3c600d41f3:daa8dde871db31c2fae175d99da9bb4d77a3c58627ea75a761e9f1e96754f242', 0, 'Active', 'Active', 'mtts@purdueieee.org'),
('aess', 'Aerospace & Electronic Systems Society (AESS)', 'pbkdf2:sha256:100000:979b6bdddf59ac748c15fc55eaba37f6:5cbe713c7f638fd9132bd7946575fec6f7c53daeac2a42bacdc8bdb94d6cfc6f', 0, 'Active', 'Active', 'aess@purdueieee.org'),
('learning', 'Learning Committee (Hands-on Workshops)', 'pbkdf2:sha256:100000:697e7f995e6afd6f8ba1cda45948c9e7:0b520c98345a471d5f874d4391edd5863f5279d34c18f1d0f06cd43b5efa4dc5', 0, 'Active', 'Active', 'learning@purdueieee.org'),
('infrastructure', 'Infrastructure & Lab Tooling', 'pbkdf2:sha256:100000:155ac28a73550d451229ecd548131055:5f7dc08265c6fc43031d6272f4e1d9aca379401add9db09ad6f47c643ed91d5e', 0, 'Active', 'Active', 'infra@purdueieee.org'),
('events', 'Social & Branch Events', 'pbkdf2:sha256:100000:a0f9b100b02a7bbc82e894e3ca8d59e0:14b136793f2e2dc72e5c554adf2365bf45e68af52fb7e3dbae1493a3772cf38d', 0, 'Active', 'Active', 'events@purdueieee.org'),
('industrial-relations', 'Industrial Relations (IR & Corporate)', 'pbkdf2:sha256:100000:4a67ffba5a1145c37b20756127147d38:b7d260818253853176e55af4a4cf23680a13cabe454062ee19251b7b925ad5c2', 0, 'Active', 'Active', 'ir@purdueieee.org'),
('member-involvement', 'Member Involvement & Mentorship', 'pbkdf2:sha256:100000:832d601ef18b8f7b61dfac3c86d25889:828b1b5f54a6a740389a9476c2160406a55097e4d5157ecd23a0efcbcbbf2bf4', 0, 'Active', 'Active', 'membership@purdueieee.org'),
('operations', 'Operations & Facilities', 'pbkdf2:sha256:100000:3772c0ebb184cec728c171bed380ca58:653e606820fa29d7d797d08feeb2a5a3b8e9a906932cf3c961fada720b184942', 0, 'Active', 'Active', 'ops@purdueieee.org');

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

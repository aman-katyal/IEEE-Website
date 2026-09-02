-- BoilerBooks 3.0 Initial Seed Migration for Purdue IEEE
-- Migration: 0002_seed_initial_data.sql

-- 1. Active Fiscal Year (2025-2026)
INSERT OR IGNORE INTO fiscal_years (id, name, start_date, end_date, is_active)
VALUES ('fy25-26', 'Fiscal Year 2025-2026', '2025-07-01', '2026-06-30', 1);

-- 2. Finance Committees Roster (PBKDF2-SHA256 Hashed Passcodes)
INSERT OR IGNORE INTO finance_committees (id, name, passcode_hash, is_admin, bank_status, dues_status, contact_email) VALUES
('treasurer', 'Executive Treasurer', 'pbkdf2:sha256:100000:88f9df83fc9f85246ae06b5531faaa80:2741d251f50c409801e6e91f7ee6eca08b46a5978d067c9fa0d66ff6c9ed572d', 1, 'Active', 'Active', 'treasurer@purdueieee.org'),
('president', 'Executive President', 'pbkdf2:sha256:100000:915020c2babff923d0edd1029615d01a:5a6de93bef1312f69a9c928a7aadf4c214f2b7e4bf7cbb02b0357a38f507809a', 1, 'Active', 'Active', 'president@purdueieee.org'),
('general', 'General IEEE Branch', 'pbkdf2:sha256:100000:f7935a999d34f0a281519a463096f64a:c63a460c45de893fb657516f0814158df0f65a877be1a3ef48682e1dd8b7e408', 0, 'Active', 'Active', 'executive@purdueieee.org'),
('rov', 'Remotely Operated underwater Vehicle (ROV)', 'pbkdf2:sha256:100000:5aaa7c102a33820902cfaffe605dc3df:1c908bd5348bca792d6fd27c63aaa4105d1f4699dc434dc48da20bd3a8189c5b', 0, 'Active', 'Active', 'rov@purdueieee.org'),
('racing', 'IEEE Racing (Formula Electric / EV)', 'pbkdf2:sha256:100000:850118348dc4552dce367d2828f6246b:45f92138e962d3f98611f6a9a9f6381052847bbf9d9d823373512e8a6f64d9aa', 0, 'Active', 'Active', 'racing@purdueieee.org'),
('aess', 'Aerospace & Electronic Systems Society (AESS)', 'pbkdf2:sha256:100000:52ec754ebc1315c2b9b45d0a2f7690d5:4babf0411807a8e59e8ce7e8ffda7ca1f566d6c3109b9c0c361efa395d695885', 0, 'Active', 'Active', 'aess@purdueieee.org'),
('aesc', 'Aerial Robotics (AESC)', 'pbkdf2:sha256:100000:7f8cb19e357bb0514c98cfa278d30814:01c6a0f2180c5ba82d6653fd9bc54534cb92991b8518515fa04832265e1a3264', 0, 'Active', 'Active', 'aesc@purdueieee.org'),
('cs', 'IEEE Computer Society', 'pbkdf2:sha256:100000:afed31391b14ad3b2c6319ccf6d3d2c3:b029335d4a8426de795947e0b20ce6459224b01f79137867f4faad3dff4e09ec', 0, 'Active', 'Active', 'cs@purdueieee.org'),
('embs', 'Engineering in Medicine & Biology Society (EMBS)', 'pbkdf2:sha256:100000:6f80f7c73b1ae4dd8dff9e6d85b9d63b:b65a3f34948e60328585c0fc4179eda8c7fe12768e87145ef55c59ed6c8556f2', 0, 'Active', 'Active', 'embs@purdueieee.org'),
('mtts', 'Microwave Theory and Technology Society (MTT-S)', 'pbkdf2:sha256:100000:73421b66d1bf70374364b74bb5c8611a:b2854107f037a633294ca3fa345653f119a25169a10b8a305c73d3d4301bc745', 0, 'Active', 'Active', 'mtts@purdueieee.org'),
('eds', 'Electron Devices Society (EDS)', 'pbkdf2:sha256:100000:e4e6fc1c78196be6a819d224adbd2aa9:996ee6bb151ef872816d66483a573a9610511e71748b81da5c74bc4a56bfc3a7', 0, 'Active', 'Active', 'eds@purdueieee.org'),
('smc', 'Systems, Man & Cybernetics (SMC)', 'pbkdf2:sha256:100000:bb2c38c5e730960041172fb4f1c538da:662c5a2fa3e817f760e2df8271dafa3e017da3caf7528172914b22f30f2ba41f', 0, 'Active', 'Active', 'smc@purdueieee.org'),
('software-sat', 'Software Saturdays', 'pbkdf2:sha256:100000:f6683f90da63f530cd89771156a35580:58087e19cdc18a7233ab6d5aa7b03764c0c0e0f6b6356a30507c6f6f1b9b8401', 0, 'Active', 'Active', 'software-saturdays@purdueieee.org'),
('learning', 'Learning Committee (Hands-on Workshops)', 'pbkdf2:sha256:100000:c0257ae24c841e65ed389ea705f6b7e6:12b78b2f0fc8a43725439848bd39356425bd09e0327f939215d1ae55a257ab8e', 0, 'Active', 'Active', 'learning@purdueieee.org'),
('infrastructure', 'Infrastructure & Lab Tooling', 'pbkdf2:sha256:100000:0fd263d6394ce7d90fea253f279a8e9c:889a40f2f30324ec9ec7bfd465aad8651d4835bdd0908e673062b074e55bc5de', 0, 'Active', 'Active', 'infra@purdueieee.org'),
('events', 'Social & Branch Events', 'pbkdf2:sha256:100000:290d010576c1306d0391ad7e8d80e03c:ffd1c099467b562f92c0c1693a09989ebe1c2691d9a841de54b36daff5537fc8', 0, 'Active', 'Active', 'events@purdueieee.org'),
('social', 'Social Committee', 'pbkdf2:sha256:100000:dcd9a92d7732f56061283e554deb3553:32b48184b2959128a6070af21448944dc2e4efc7c5023e1ba7ad8dfc0bbf57ec', 0, 'Active', 'Active', 'social@purdueieee.org'),
('industrial-relations', 'Industrial Relations (IR & Corporate)', 'pbkdf2:sha256:100000:ffee11b85aca3ab371e3090596168dd8:23806da0cd3d77f4c7db1b61631733a09a4372ef970ad20abf6ed0ccf967e0c5', 0, 'Active', 'Active', 'ir@purdueieee.org'),
('member-involvement', 'Member Involvement & Mentorship', 'pbkdf2:sha256:100000:46d7c46deee359a71ac1e38fe6b978a7:5ab030d8e5c02b4c22d6eba5e70b7ea95f7abaffa602f0067252c2b9f91ded0d', 0, 'Active', 'Active', 'membership@purdueieee.org'),
('operations', 'Operations & Facilities', 'pbkdf2:sha256:100000:5e216e97bbeda2d479084277b46e38da:5fb7ed7fd31c316c2249cb81d2593ba9d49b5573ca581d36c09d08fbb5c4ae73', 0, 'Active', 'Active', 'ops@purdueieee.org');

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

-- BoilerBooks 3.0 Migration: 0003_seed_toocool_vecorders.sql
-- Ingests initial TooCOOL / vECOrders semester membership dues records with duplicate protection

INSERT OR IGNORE INTO member_dues (id, fiscal_year_id, student_name, purdue_email, amount_paid, payment_method, payment_date, semester)
VALUES
  ('dues-179435', 'fy25-26', 'Ryan Leviste', 'ryan.leviste@purdue.edu', 10.00, 'TooCOOL', '2026-03-05', 'Spring 2026'),
  ('dues-179387', 'fy25-26', 'Mathias Ufer', 'mathias.ufer@purdue.edu', 10.00, 'TooCOOL', '2026-03-05', 'Spring 2026'),
  ('dues-178527', 'fy25-26', 'Melinda Liu', 'melinda.liu@purdue.edu', 10.00, 'TooCOOL', '2026-02-27', 'Spring 2026'),
  ('dues-178327', 'fy25-26', 'Youssef Belhadj', 'youssef.belhadj@purdue.edu', 15.00, 'TooCOOL', '2026-02-26', 'Spring 2026'),
  ('dues-176808', 'fy25-26', 'Alaqmar Bohori', 'alaqmar.bohori@purdue.edu', 10.00, 'TooCOOL', '2026-02-14', 'Spring 2026'),
  ('dues-176716', 'fy25-26', 'Ashish Singh Dhillon', 'ashish.dhillon@purdue.edu', 10.00, 'TooCOOL', '2026-02-13', 'Spring 2026'),
  ('dues-176574', 'fy25-26', 'Gabriela Mayorga', 'gabriela.mayorga@purdue.edu', 10.00, 'TooCOOL', '2026-02-12', 'Spring 2026'),
  ('dues-176510', 'fy25-26', 'Sourish Manthati', 'sourish.manthati@purdue.edu', 10.00, 'TooCOOL', '2026-02-11', 'Spring 2026'),
  ('dues-175846', 'fy25-26', 'Nuraly Sermagambet', 'nuraly.sermagambet@purdue.edu', 15.00, 'TooCOOL', '2026-02-07', 'Spring 2026'),
  ('dues-175671', 'fy25-26', 'Anupama Khanwale', 'anupama.khanwale@purdue.edu', 15.00, 'TooCOOL', '2026-02-06', 'Spring 2026'),
  ('dues-175544', 'fy25-26', 'Arvind Rao', 'arvind.rao@purdue.edu', 10.00, 'TooCOOL', '2026-02-05', 'Spring 2026'),
  ('dues-175150', 'fy25-26', 'Justin Liu', 'justin.liu@purdue.edu', 15.00, 'TooCOOL', '2026-02-03', 'Spring 2026'),
  ('dues-174907', 'fy25-26', 'Eelin Yang', 'eelin.yang@purdue.edu', 15.00, 'TooCOOL', '2026-02-02', 'Spring 2026'),
  ('dues-174302', 'fy25-26', 'Sarim Khan', 'sarim.khan@purdue.edu', 10.00, 'TooCOOL', '2026-01-29', 'Spring 2026'),
  ('dues-174303', 'fy25-26', 'Ella Chiang', 'ella.chiang@purdue.edu', 10.00, 'TooCOOL', '2026-01-29', 'Spring 2026'),
  ('dues-174211', 'fy25-26', 'Karson Ho', 'karson.ho@purdue.edu', 10.00, 'TooCOOL', '2026-01-29', 'Spring 2026'),
  ('dues-174126', 'fy25-26', 'Nurdaulet Aba', 'nurdaulet.aba@purdue.edu', 10.00, 'TooCOOL', '2026-01-28', 'Spring 2026'),
  ('dues-174117', 'fy25-26', 'Sarddar Konurbayev', 'sarddar.konurbayev@purdue.edu', 15.00, 'TooCOOL', '2026-01-28', 'Spring 2026'),
  ('dues-173761', 'fy25-26', 'Shruti Senthilnathan', 'shruti.senthilnathan@purdue.edu', 10.00, 'TooCOOL', '2026-01-26', 'Spring 2026');

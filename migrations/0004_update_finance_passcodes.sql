-- BoilerBooks 3.0 Migration: 0004_update_finance_passcodes.sql
-- Updates finance committee authentication passcodes with cryptographic PBKDF2-SHA256 hashes

UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:36f7064042465dc501494cc1828b6071:b29d8ec3b49428e617570eec54058bc6e5094cfc6a97c7af88658d32ba966a07' WHERE id = 'treasurer';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:782a6e7ffe01f100d9fccf0a0e328cf2:52a27c6d68c31dcd46c26050869ceb2f60e6432b9ca2b0352fe1ebb9a149bc54' WHERE id = 'general';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:2cf3d438b1543a522e6d67f19c96169c:4329f38d27fadae1f7c1024e4e4b4accca45ba50b1b5df0b58dbc5e9a345cf5b' WHERE id = 'rov';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:411b8d3d419f6397c8bd0fbaa2d3edda:004cf318ce0b0beabd00b630cb170c68e1a70bae685b5fa1c51376f46a1cb2f1' WHERE id = 'racing';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:c9e3b5bbef80bf89e438c80af54a9c49:6636afcb842c740fd7f26bbcee63a793bd2e9be4c7d021e4b749169897c8921d' WHERE id = 'cs';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:b4628de2957ef5c1e49b6bb29b07938c:0b9c18361a9aabab74c81a5668ce146953ab694bc693c186094bc97e0c80d419' WHERE id = 'embs';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:aa00198334b9eb635be18ccb88af088b:60eaa8c91e2f90e5671dbcc3579e46fc63978a2bb28653d6355c71eb21512b96' WHERE id = 'mtts';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:e04a0abfa319d5ec3bb084051d59972a:7c8208b3ae6d83bf52303575d907f6f0c4c56bf91a768c0dee6eed0878f45146' WHERE id = 'aess';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:e564910ce6319c3f7a1e508d5647d45f:3ecb50311727e095d885e292779ac6361059725c151a743ee627d6ea5cecc80a' WHERE id = 'learning';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:f0620ca77477bc948a633764944681dd:52d1627b963abbe1119076c6fcfc5d126c07c05c312982820a7baeff60b584f8' WHERE id = 'infrastructure';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:a7abb7f01d3b784dcf0a8b7a406eff9e:2679f3d5d95f0c01262346ca2a2a873d490717f4a2d286a7cbaeefd73a31f7e1' WHERE id = 'events';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:cde661de8b2c6d5fa3b9e4df3bc6d27e:6b72428d2e3d9ce5a76b72a972c936f2546da03c95a4246fc0e65a8ef830999d' WHERE id = 'industrial-relations';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:6560b56c6bf6506701685cde362496df:594aa1d2cc230fa6923482500632c99577171c5e192ad58cf8ba815c783e1f75' WHERE id = 'member-involvement';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:d194ba55a3458877ab26d70619bfd22e:042bff98007016117c5a05ac3d820de5ed7a60618ddcc49743343e901ce83224' WHERE id = 'operations';

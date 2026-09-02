-- BoilerBooks 3.0 Migration: 0004_update_finance_passcodes.sql
-- Synchronized PBKDF2-SHA256 hashed passcodes matching boilerbooks_credentials.md
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:88f9df83fc9f85246ae06b5531faaa80:2741d251f50c409801e6e91f7ee6eca08b46a5978d067c9fa0d66ff6c9ed572d' WHERE id = 'treasurer';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:915020c2babff923d0edd1029615d01a:5a6de93bef1312f69a9c928a7aadf4c214f2b7e4bf7cbb02b0357a38f507809a' WHERE id = 'president';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:5aaa7c102a33820902cfaffe605dc3df:1c908bd5348bca792d6fd27c63aaa4105d1f4699dc434dc48da20bd3a8189c5b' WHERE id = 'rov';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:850118348dc4552dce367d2828f6246b:45f92138e962d3f98611f6a9a9f6381052847bbf9d9d823373512e8a6f64d9aa' WHERE id = 'racing';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:52ec754ebc1315c2b9b45d0a2f7690d5:4babf0411807a8e59e8ce7e8ffda7ca1f566d6c3109b9c0c361efa395d695885' WHERE id = 'aess';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:7f8cb19e357bb0514c98cfa278d30814:01c6a0f2180c5ba82d6653fd9bc54534cb92991b8518515fa04832265e1a3264' WHERE id = 'aesc';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:afed31391b14ad3b2c6319ccf6d3d2c3:b029335d4a8426de795947e0b20ce6459224b01f79137867f4faad3dff4e09ec' WHERE id = 'cs';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:6f80f7c73b1ae4dd8dff9e6d85b9d63b:b65a3f34948e60328585c0fc4179eda8c7fe12768e87145ef55c59ed6c8556f2' WHERE id = 'embs';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:73421b66d1bf70374364b74bb5c8611a:b2854107f037a633294ca3fa345653f119a25169a10b8a305c73d3d4301bc745' WHERE id = 'mtts';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:e4e6fc1c78196be6a819d224adbd2aa9:996ee6bb151ef872816d66483a573a9610511e71748b81da5c74bc4a56bfc3a7' WHERE id = 'eds';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:bb2c38c5e730960041172fb4f1c538da:662c5a2fa3e817f760e2df8271dafa3e017da3caf7528172914b22f30f2ba41f' WHERE id = 'smc';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:f6683f90da63f530cd89771156a35580:58087e19cdc18a7233ab6d5aa7b03764c0c0e0f6b6356a30507c6f6f1b9b8401' WHERE id = 'software-sat';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:c0257ae24c841e65ed389ea705f6b7e6:12b78b2f0fc8a43725439848bd39356425bd09e0327f939215d1ae55a257ab8e' WHERE id = 'learning';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:f7935a999d34f0a281519a463096f64a:c63a460c45de893fb657516f0814158df0f65a877be1a3ef48682e1dd8b7e408' WHERE id = 'general';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:0fd263d6394ce7d90fea253f279a8e9c:889a40f2f30324ec9ec7bfd465aad8651d4835bdd0908e673062b074e55bc5de' WHERE id = 'infrastructure';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:290d010576c1306d0391ad7e8d80e03c:ffd1c099467b562f92c0c1693a09989ebe1c2691d9a841de54b36daff5537fc8' WHERE id = 'events';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:dcd9a92d7732f56061283e554deb3553:32b48184b2959128a6070af21448944dc2e4efc7c5023e1ba7ad8dfc0bbf57ec' WHERE id = 'social';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:ffee11b85aca3ab371e3090596168dd8:23806da0cd3d77f4c7db1b61631733a09a4372ef970ad20abf6ed0ccf967e0c5' WHERE id = 'industrial-relations';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:46d7c46deee359a71ac1e38fe6b978a7:5ab030d8e5c02b4c22d6eba5e70b7ea95f7abaffa602f0067252c2b9f91ded0d' WHERE id = 'member-involvement';
UPDATE finance_committees SET passcode_hash = 'pbkdf2:sha256:100000:5e216e97bbeda2d479084277b46e38da:5fb7ed7fd31c316c2249cb81d2593ba9d49b5573ca581d36c09d08fbb5c4ae73' WHERE id = 'operations';

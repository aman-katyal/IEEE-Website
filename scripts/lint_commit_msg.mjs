import fs from "fs";

const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  console.log("ℹ️ No commit message file passed, checking git HEAD commit...");
  process.exit(0);
}

const msg = fs.readFileSync(commitMsgFile, "utf-8").trim();

// Ignore merge commits, squash commits, or automated fixups
if (msg.startsWith("Merge ") || msg.startsWith("Revert ") || msg.startsWith("v")) {
  process.exit(0);
}

const conventionalRegex = /^(feat|fix|refactor|docs|style|test|chore|perf|revert|ci|build|a11y|ux)(\([a-z0-9-_\/.]+\))?:\s.+/i;

if (!conventionalRegex.test(msg)) {
  console.error("\n❌ INVALID COMMIT MESSAGE FORMAT:");
  console.error(`   "${msg}"\n`);
  console.error("Conventional commit format required (Rule 12):");
  console.error("   <type>(<scope>): <short description> (#issue)");
  console.error("\nAllowed types: feat, fix, refactor, docs, style, test, chore, perf, revert, ci, build, a11y, ux");
  console.error("Examples:");
  console.error("   feat(finance): add export to CSV button (#280)");
  console.error("   fix(styles): resolve contrast on light mode text (#289)\n");
  process.exit(1);
}

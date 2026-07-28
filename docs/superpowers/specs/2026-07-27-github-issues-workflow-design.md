# Design Specification: GitHub Issues Task & Bug Tracking Workflow

**Date:** 2026-07-27  
**Status:** Approved  
**Target Repository:** `aman-katyal/IEEE-Website`  

---

## 1. Overview & Purpose
Establish a streamlined GitHub Issues workflow for tracking TODOs, features, maintenance tasks, and bug fixes for the Purdue IEEE Website codebase. This workflow seamlessly connects GitHub Issues, Git branch management, commit hooks, and AI assistant skills into an integrated process.

---

## 2. System Architecture & Components

```
aman-katyal/IEEE-Website/
├── .github/
│   └── ISSUE_TEMPLATE/
│       ├── config.yml           # Issue template configuration
│       ├── bug_report.yml       # Structured bug report form
│       ├── feature_request.yml  # Feature proposal form
│       └── task.yml             # General task / TODO form
├── .agents/
│   └── skills/
│       └── github-issues/
│           └── SKILL.md         # Assistant skill for gh issue management
├── scripts/
│   └── issue-start.ps1          # PowerShell helper to start work on an issue
└── .git/hooks/
    └── prepare-commit-msg       # Git hook auto-prefixing commit messages with [#<issue-id>]
```

---

## 3. Component Details

### 3.1. Issue Templates (`.github/ISSUE_TEMPLATE/`)
- **`bug_report.yml`**: Form with fields for steps to reproduce, expected vs actual behavior, and severity (`Critical`, `High`, `Medium`, `Low`). Auto-applies label `bug`.
- **`feature_request.yml`**: Form for problem statement, proposed solution, and visual UI impacts. Auto-applies label `enhancement`.
- **`task.yml`**: Form for developer tasks, technical refactoring, or maintenance items with checkboxes for completion criteria. Auto-applies label `task`.
- **`config.yml`**: Enforces structured form templates and directs general support to discussions or contact links.

### 3.2. Git Commit Hook (`.git/hooks/prepare-commit-msg`)
- Automatically runs when `git commit` is invoked.
- Extracts the numeric issue ID from branch names formatted as `issue-<ID>-<slug>`, `fix/<ID>-<slug>`, `feature/<ID>-<slug>`, or `task/<ID>-<slug>`.
- If a valid issue ID is found and the commit message header does not already start with `[#<ID>]`, prepends `[#<ID>] ` to the commit subject.

### 3.3. Start Issue Helper Script (`scripts/issue-start.ps1`)
- **Usage:** `npm run issue:start -- <issue-id>` or `.\scripts\issue-start.ps1 <issue-id>`
- **Behavior:**
  1. Executes `gh issue view <issue-id> --json number,title`.
  2. Converts the issue title to a clean URL-friendly slug.
  3. Checks out a new branch named `issue-<number>-<slug>` from `master`.
  4. Displays a summary of the active task branch.

### 3.4. Assistant Skill (`.agents/skills/github-issues/SKILL.md`)
- Defines standard operational procedures for Antigravity:
  - **Triage & List:** Query open issues using `gh issue list`.
  - **Create Issues:** File new bugs or tasks discovered during development using `gh issue create`.
  - **Start Development:** Run `npm run issue:start -- <id>` to switch to an issue-specific branch.
  - **Close Issues:** Close issues upon PR merge or resolution using `gh issue close <id> --comment "..."`.

---

## 4. Verification & Testing
- Test GitHub issue creation via `gh issue create`.
- Verify `scripts/issue-start.ps1` creates correctly formatted `issue-<id>-<slug>` branches.
- Verify `prepare-commit-msg` git hook automatically prefixes commit messages with `[#<id>]`.
- Verify full test suite (`npm test -- --run`) and build (`npm run build`) pass cleanly.

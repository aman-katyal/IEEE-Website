# GitHub Issues Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a complete end-to-end GitHub Issues task and bug tracking workflow incorporating GitHub forms, a `prepare-commit-msg` git hook, a task-start script, and an assistant skill.

**Architecture:** Create `.github/ISSUE_TEMPLATE/` forms for bugs, features, and tasks; implement a PowerShell helper `scripts/issue-start.ps1` to automate `issue-<id>-<slug>` branch checkouts; add a Git commit hook to auto-prefix commit subjects with `[#<id>]`; and define an AI assistant skill in `.agents/skills/github-issues/SKILL.md`.

**Tech Stack:** GitHub CLI (`gh`), Git hooks, PowerShell / Bash, Markdown, YAML.

## Global Constraints

- Never hardcode credentials or API keys.
- Preserve all existing tests and scripts.
- Scripts must be Windows pwsh compatible.

---

### Task 1: Create GitHub Issue Templates (`.github/ISSUE_TEMPLATE/`)

**Files:**
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Create: `.github/ISSUE_TEMPLATE/feature_request.yml`
- Create: `.github/ISSUE_TEMPLATE/task.yml`
- Create: `.github/ISSUE_TEMPLATE/config.yml`

**Interfaces:**
- Consumes: GitHub Issue Forms YAML schema
- Produces: Structured issue entry forms in GitHub UI with labels (`bug`, `enhancement`, `task`)

- [ ] **Step 1: Create bug_report.yml**

```yaml
name: Bug Report
description: Report a bug or error on the Purdue IEEE Website
title: "[BUG]: "
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to report a bug! Please fill out the details below.
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: Clear and concise description of what the bug is.
      placeholder: "e.g., Committee card padding is squished on mobile viewport"
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: How can we reproduce this behavior?
      placeholder: |
        1. Go to '/committees'
        2. Click on 'ROV'
        3. Resize screen to 375px
    validations:
      required: true
  - type: dropdown
    id: severity
    attributes:
      label: Severity / Priority
      options:
        - "P1 - Critical (Crash or Broken Functionality)"
        - "P2 - Medium (UI or Component Degraded)"
        - "P3 - Low (Minor Styling / Polish)"
    validations:
      required: true
```

- [ ] **Step 2: Create feature_request.yml**

```yaml
name: Feature Request
description: Propose a new feature or improvement for the website
title: "[FEATURE]: "
labels: ["enhancement"]
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem Statement / Rationale
      description: Is your feature request related to a problem or missing capability?
      placeholder: "Describe the need for this feature..."
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: Describe the solution or user experience you would like to see.
      placeholder: "Describe how it should work..."
    validations:
      required: true
```

- [ ] **Step 3: Create task.yml**

```yaml
name: Maintenance Task / TODO
description: Track a maintenance task, refactoring, or test suite addition
title: "[TASK]: "
labels: ["task"]
body:
  - type: textarea
    id: description
    attributes:
      label: Task Summary
      description: Overview of what needs to be done.
      placeholder: "e.g., Add unit tests for Navbar component"
    validations:
      required: true
  - type: textarea
    id: acceptance_criteria
    attributes:
      label: Acceptance Criteria
      description: Checklist of items that complete this task.
      placeholder: "- [ ] Test desktop navbar\n- [ ] Test mobile menu"
    validations:
      required: true
```

- [ ] **Step 4: Create config.yml**

```yaml
blank_issues_enabled: false
contact_links:
  - name: Purdue IEEE Discord
    url: https://discord.gg/sPPQequ9ws
    about: Ask questions or discuss branch activities on Discord
```

- [ ] **Step 5: Commit Issue Templates**

```bash
git add .github/ISSUE_TEMPLATE/
git commit -m "feat(github): add issue templates for bugs, features, and tasks"
```

---

### Task 2: Create Start Task Helper Script & npm Script

**Files:**
- Create: `scripts/issue-start.ps1`
- Modify: `package.json`

**Interfaces:**
- Consumes: Issue ID parameter (e.g. `42`), `gh issue view` CLI command
- Produces: Checked out Git branch named `issue-<id>-<slug>`

- [ ] **Step 1: Create scripts/issue-start.ps1**

```powershell
param (
    [Parameter(Mandatory=$true)]
    [string]$IssueId
)

$ErrorActionPreference = "Stop"

Write-Host "Fetching GitHub Issue #$IssueId..." -ForegroundColor Cyan

# Query issue title using GitHub CLI
$jsonOutput = gh issue view $IssueId --json number,title | ConvertFrom-Json

if (-not $jsonOutput) {
    Write-Error "Failed to fetch Issue #$IssueId. Ensure gh CLI is authenticated."
    exit 1
}

# Slugify title
$cleanTitle = $jsonOutput.title -replace '[^\w\s-]', '' -replace '\s+', '-'
$slug = $cleanTitle.ToLower()
if ($slug.Length -gt 35) {
    $slug = $slug.Substring(0, 35).TrimEnd('-')
}

$branchName = "issue-$IssueId-$slug"

Write-Host "Creating and checking out branch '$branchName'..." -ForegroundColor Green
git checkout master
git pull origin master
git checkout -b $branchName

Write-Host "Successfully checked out branch '$branchName' for Issue #$IssueId!" -ForegroundColor Green
```

- [ ] **Step 2: Add issue:start script to package.json**

Add `"issue:start": "pwsh ./scripts/issue-start.ps1"` under `"scripts"` in `package.json`.

- [ ] **Step 3: Commit helper script**

```bash
git add scripts/issue-start.ps1 package.json
git commit -m "feat(scripts): add issue-start script for automated branch creation"
```

---

### Task 3: Create Git Commit Hook (`.git/hooks/prepare-commit-msg`)

**Files:**
- Create: `.git/hooks/prepare-commit-msg`

**Interfaces:**
- Consumes: Current branch name via `git rev-parse --abbrev-ref HEAD`
- Produces: Auto-prefixed commit message subject `[#<id>] <original message>`

- [ ] **Step 1: Create .git/hooks/prepare-commit-msg**

```bash
#!/bin/sh

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

# Extract issue number from branch name (e.g. issue-42-fix-nav -> 42)
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
ISSUE_ID=$(echo "$BRANCH_NAME" | grep -oE '[0-9]+' | head -n 1)

if [ -n "$ISSUE_ID" ]; then
    # Read existing message
    ORIGINAL_MSG=$(cat "$COMMIT_MSG_FILE")
    
    # Check if message already contains [#<id>]
    case "$ORIGINAL_MSG" in
        *"[#$ISSUE_ID]"*) ;;
        *)
            echo "[#$ISSUE_ID] $ORIGINAL_MSG" > "$COMMIT_MSG_FILE"
            ;;
    esac
fi
```

- [ ] **Step 2: Make hook executable & verify**

```bash
chmod +x .git/hooks/prepare-commit-msg
```

- [ ] **Step 3: Commit hook setup**

```bash
git add .git/hooks/prepare-commit-msg
git commit -m "feat(git): add prepare-commit-msg hook to auto-prefix issue IDs"
```

---

### Task 4: Create Assistant Skill (`.agents/skills/github-issues/SKILL.md`)

**Files:**
- Create: `.agents/skills/github-issues/SKILL.md`

**Interfaces:**
- Consumes: User requests regarding issues, TODOs, or tasks
- Produces: Clear instructions for using `gh issue` CLI, `issue-start.ps1`, and managing task lifecycles

- [ ] **Step 1: Create .agents/skills/github-issues/SKILL.md**

```markdown
---
name: github-issues
description: Manage GitHub Issues, create issue-linked branches, and execute task tracking workflows for the IEEE Website.
---

# GitHub Issues Management Skill

Use this skill when triaging, creating, starting, or resolving GitHub Issues for task tracking and bug fixes.

## Common Workflows

### 1. View Open Issues & Tasks
```bash
gh issue list --state open
```

### 2. File a New Bug or Task Issue
```bash
gh issue create --title "[BUG]: Description" --body "Steps to reproduce..." --label "bug"
```

### 3. Start Work on an Issue
```bash
npm run issue:start -- <issue-id>
```
This automatically fetches the issue title and checks out `issue-<id>-<slug>`.

### 4. Commit Changes
The Git hook (`prepare-commit-msg`) automatically prepends `[#<issue-id>]` to commit messages on issue branches.

### 5. Close / Resolve Issue
```bash
gh issue close <issue-id> --comment "Resolved and merged in master."
```
```

- [ ] **Step 2: Commit skill file**

```bash
git add .agents/skills/github-issues/SKILL.md
git commit -m "feat(skills): add github-issues skill definition"
```

---

### Task 5: Final Verification & Test Suite Execution

- [ ] **Step 1: Run full test suite**

Run: `npm test -- --run`
Expected: 140/140 unit tests PASS.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds cleanly.

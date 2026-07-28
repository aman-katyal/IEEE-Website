---
name: github-issues
description: Manage GitHub Issues, create issue-linked branches, and execute task tracking workflows for the IEEE Website.
---

# GitHub Issues Management Skill

Use this skill when triaging, creating, starting, or resolving GitHub Issues for task tracking and bug fixes for the Purdue IEEE Website.

## Overview & Core Workflow

1. **GitHub Issues** serve as the single source of truth for TODOs, bugs, maintenance items, and feature requests.
2. **Issue Forms** in `.github/ISSUE_TEMPLATE/` structure new reports with labels (`bug`, `enhancement`, `task`).
3. **Task Branch Helper**: `npm run issue:start -- <issue-id>` (or `.\scripts\issue-start.ps1 <id>`) creates and checks out `issue-<id>-<slug>`.
4. **Git Commit Hook**: `.git/hooks/prepare-commit-msg` automatically prefixes commit subjects with `[#<issue-id>]` on issue branches.

## Directives & Commands

### 1. View & List Open Issues
```bash
# List all open issues
gh issue list --state open

# Filter by label
gh issue list --label bug
gh issue list --label enhancement
```

### 2. View Specific Issue Details
```bash
gh issue view <issue-id>
```

### 3. File a New Bug or Task Issue
```bash
# Create a bug issue
gh issue create --title "[BUG]: Description" --body "Steps to reproduce..." --label "bug"

# Create a feature request
gh issue create --title "[FEATURE]: Description" --body "Rationale and proposed solution..." --label "enhancement"

# Create a task
gh issue create --title "[TASK]: Description" --body "Acceptance criteria..." --label "task"
```

### 4. Start Work on an Issue
```bash
npm run issue:start -- <issue-id>
```
*Creates branch `issue-<id>-<slug>` from `master`.*

### 5. Commit Changes
Make changes and commit. The git hook automatically prepends `[#<issue-id>]` to the commit subject.

### 6. Close / Resolve Issue
```bash
gh issue close <issue-id> --comment "Resolved and merged in PR #X / master."
```

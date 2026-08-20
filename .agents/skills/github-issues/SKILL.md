---
name: github-issues
description: Use when requesting changes, features, bug fixes, or task tracking — checks for duplicates, brainstorms and assigns standardized labels, interviews user on underspecified requirements, creates structured issues, and handles task branches.
---

# GitHub Issues — Spec, Label & Lifecycle Skill

Use this skill whenever changes, features, bug fixes, or UI modifications are requested. It ensures crystal-clear specs, a consistent label taxonomy, zero duplicates, and structured tracking across the project lifecycle.

---

## 🏷️ Label Taxonomy (Canonical System)

Labels are organized into **four dimensions** using a prefix system. Always apply **one label per dimension** when relevant.

### Dimension 1 — `type:` (What kind of work is it?)

| Label | Color | When to use |
|---|---|---|
| `type:bug` | `#d73a4a` 🔴 | Unexpected behavior, broken UI, runtime errors |
| `type:feature` | `#0075ca` 🔵 | Net-new capability or page section |
| `type:task` | `#6f42c1` 🟣 | Cleanup, removal, refactor, config change |
| `type:ui-ux` | `#e8b4b8` 🩷 | Visual polish, layout, spacing, typography |
| `type:a11y` | `#f9a825` 🟡 | Accessibility: contrast, ARIA, keyboard, WCAG |
| `type:docs` | `#bfd4f2` 🩵 | README, comments, schema docs, SKILL files |
| `type:chore` | `#d4c5f9` 🪻 | Dependency bumps, CI, tooling, scripts |

### Dimension 2 — `priority:` (How urgent?)

| Label | Color | Meaning |
|---|---|---|
| `priority:critical` | `#b60205` 🔴 | Site-breaking, launch blocker |
| `priority:high` | `#e05d00` 🟠 | Must fix before next release |
| `priority:medium` | `#fde078` 🟡 | Should fix this sprint |
| `priority:low` | `#c2e0c6` 🟢 | Nice to have, no deadline |

### Dimension 3 — `status:` (Where is it in the workflow?)

| Label | Color | Meaning |
|---|---|---|
| `status:triage` | `#ededed` ⚪ | Default on creation — needs scoping |
| `status:ready` | `#0e8a16` 🟢 | Spec complete, ready to implement |
| `status:in-progress` | `#9BCC65` 🍏 | Actively being worked on |
| `status:blocked` | `#d93f0b` 🔴 | Waiting on decision, asset, or dependency |
| `status:awaiting-review` | `#e99695` 🩺 | Implemented, merged — ONLY when subjective/external human sign-off is needed |
| `status:wontfix` | `#ffffff` ⬜ | Explicitly out of scope, closed |

> **⚡ Direct Issue Closing Policy:** When an issue is implemented and verified by automated browser tests, visual checks, or unit tests, **directly close the issue** with `gh_tool issue close <N>` (or via python `gh.close_issue`) with a completion comment. Do NOT leave self-verified issues in `status:awaiting-review`.

### Dimension 4 — `area:` (Which part of the codebase?)

| Label | Color | Scope |
|---|---|---|
| `area:home` | `#7985CB` 💙 | Home page / BentoHero / Events / Marquee |
| `area:committees` | `#A0855B` 🟤 | Committee pages and committee hover cards |
| `area:about` | `#cfd3d7` 🩶 | About page content |
| `area:partners` | `#1f883d` 💚 | Partners / Sponsors page |
| `area:nav` | `#8b5cf6` 🔮 | Navbar, footer, routing |
| `area:cms` | `#f59e0b` 🟠 | Sanity Studio schema or GROQ queries |
| `area:styles` | `#ec4899` 🩷 | CSS variables, Tailwind tokens, theme |
| `area:infra` | `#0d1117` 🖤 | Cloudflare, Wrangler, build config, Vite |

> **Legacy labels still in use (kept for compatibility):**
> - `bug`, `enhancement`, `blocked`, `awaiting-verification`, `documentation` — remap to the new system when touching an issue.
> - `decap-cms/*` labels — CMS-managed, do not remove.

---

## 🧠 Label Brainstorm Protocol

Before assigning labels, **think through all four dimensions** for each issue:

```
BRAINSTORM CHECKLIST:
[ ] type:     — Is this fixing something broken? New functionality? Pure polish? Chore?
[ ] priority: — Would the site ship without this? Is a release blocked?
[ ] status:   — Is the spec complete? Blocked on anything?
[ ] area:     — Which page/component/subsystem does this touch?

MULTI-LABEL RULE: Apply the MOST SPECIFIC label per dimension.
Never stack two type: labels. Prefer area: over nothing.
```

**Label Decision Tree:**

```
Is it broken / not working as expected?
  └─ YES → type:bug
  └─ NO
      ├─ Is it removing / cleaning / refactoring existing code?
      │    └─ YES → type:task
      ├─ Is it purely visual (spacing, color, copy)?
      │    └─ YES → type:ui-ux
      ├─ Is it an accessibility / contrast / ARIA fix?
      │    └─ YES → type:a11y
      ├─ Is it a wholly new feature or page section?
      │    └─ YES → type:feature
      └─ Otherwise → type:chore
```

---

## 🔧 Deterministic Enforcement via `gh_tool`

Before filing any issue, **always** run the classifier first:

```bash
# From .agents/tools/
python -m gh_tool issue suggest-labels --title "<full issue title>"
python -m gh_tool issue suggest-labels --title "..." --body "..." --json
```

Treat the returned `labels` array as **ground truth**. Do not override `type:` or
`area:` values without an explicit user instruction.

After implementation is merged, lint the issue:
```bash
python -m gh_tool issue lint --number <id>
```

To migrate all open issues to canonical labels at any time:
```bash
python -m gh_tool issue port --dry-run  # preview
python -m gh_tool issue port            # apply
```

To ensure canonical labels exist on the repo:
```bash
python -m gh_tool label sync
```

See [`.agents/tools/gh_tool/README.md`](.agents/tools/gh_tool/README.md) for full reference.

---

## 🔁 Complete Task Lifecycle Workflow

```
User Request
    │
    ▼
1. Duplicate Check ──── Found? ──── YES → Reference/update existing issue
    │ NO
    ▼
2. Brainstorm Labels (all 4 dimensions)
    │
    ▼
3. Is Spec Fully Defined?
    │ NO / Ambiguous
    ▼
4. Interactive Spec Interview (ask_question)
    │
    ▼
5. File Structured GitHub Issue w/ canonical labels
    │
    ▼
6. Create Branch & Dispatch Subagents
    │
    ▼
7. Implement → Merge → Update Labels → Close Issue
```

---

## Step-by-Step Protocol

### Step 1: Duplicate & Prior Task Check

```bash
# Broad search across open and closed issues
gh issue list --state all --search "<keyword1> <keyword2>"

# Search by label dimension
gh issue list --label "area:home" --state open
gh issue list --label "type:bug" --state open
```

- If a match exists: reference it, add a comment if the scope changed, do not create a duplicate.
- If a closed issue regressed: reopen it with a comment explaining the regression.

---

### Step 2: Brainstorm Labels

Before writing a single word of the issue body, run through the **Label Brainstorm Checklist** above. Confirm:
- `type:` — exactly one
- `priority:` — exactly one (default `priority:medium` if uncertain)
- `status:` — start at `status:triage` unless spec is already complete → use `status:ready`
- `area:` — one or more if the issue spans multiple subsystems

---

### Step 3: Interactive Spec Interview

If any aspect of the request is underspecified or ambiguous, **do not make assumptions on non-trivial decisions**. Use `ask_question` to clarify:

1. **Visual & Styling**: layout, spacing, colors, breakpoints, dark mode behavior
2. **Behavioral Logic**: hover states, error/loading states, animation timing
3. **Scope & Exclusions**: what's explicitly in vs. out
4. **CMS / Data Model**: hardcoded vs. Sanity-driven, new schema fields needed?
5. **Priority signal**: "Is this blocking a launch or a soft launch?"

---

### Step 4: Structured Issue Creation

Use the appropriate format and **always include canonical labels from all applicable dimensions**:

```bash
# ── Format 1: Task / Cleanup / Removal ──────────────────────────────────
gh issue create \
  --title "[TASK]: <Actionable concise title>" \
  --body "## Description
<Context and rationale — why does this matter?>

## Requested Changes
- <Specific change item 1>
- <Specific change item 2>

## Acceptance Criteria
- [ ] <Verifiable criterion 1>
- [ ] <Verifiable criterion 2>" \
  --label "type:task,priority:medium,status:ready,area:<subsystem>"

# ── Format 2: Bug Fix ────────────────────────────────────────────────────
gh issue create \
  --title "[BUG]: <Component/Page>: <Concise description>" \
  --body "## Steps to Reproduce
1. <Step 1>
2. <Step 2>

## Expected vs Actual Behavior
- **Expected**: ...
- **Actual**: ...

## Acceptance Criteria
- [ ] Bug is resolved and verified locally." \
  --label "type:bug,priority:high,status:triage,area:<subsystem>"

# ── Format 3: Feature ────────────────────────────────────────────────────
gh issue create \
  --title "[FEATURE]: <Short capability name>" \
  --body "## Description
<What this enables and why it's valuable>

## User Story
As a <user type>, I want <capability> so that <outcome>.

## Requested Changes
- <Specific implementation item 1>
- <Specific implementation item 2>

## Acceptance Criteria
- [ ] <Verifiable criterion 1>
- [ ] <Verifiable criterion 2>

## Design Notes
<Wireframe, reference link, or layout description if applicable>" \
  --label "type:feature,priority:medium,status:triage,area:<subsystem>"

# ── Format 4: UI/UX Polish ───────────────────────────────────────────────
gh issue create \
  --title "[UI/UX]: <Component>: <Concise visual change>" \
  --body "## Description
<Current state and what feels off>

## Requested Changes
- <Visual change 1>
- <Visual change 2>

## Acceptance Criteria
- [ ] Visual criterion — responsive at mobile/tablet/desktop
- [ ] No regressions on dark mode" \
  --label "type:ui-ux,priority:low,status:ready,area:<subsystem>"
```

---

### Step 5: Issue Branch & Task Execution

```bash
# Start a linked branch from the issue ID
npm run issue:start -- <issue-id>
# PowerShell fallback:
pwsh ./scripts/issue-start.ps1 <issue-id>
```

**When multiple independent issues exist:** dispatch parallel subagents with isolated workspace branches, one per issue. Each subagent receives the issue body as its spec.

**AI agent safety rules:**
- Commit immediately after every discrete change or task (`git commit -m "<type>(<scope>): <desc> (#<id>)"`).
- Draft changes; do not force-push to master without a PR review.
- Check for an existing open PR for the same issue before creating a new branch.
- Ensure idempotency: if a branch already exists, check it out rather than creating a duplicate.

---

### Step 6: Label Lifecycle — Update as Work Progresses

Update labels to reflect current state as work moves through the pipeline:

```bash
# Mark in-progress when you start the branch
gh issue edit <id> --add-label "status:in-progress" --remove-label "status:ready"

# Mark blocked if you hit a dependency
gh issue edit <id> --add-label "status:blocked" --remove-label "status:in-progress"

# Mark awaiting-review after merge to master
gh issue edit <id> --add-label "status:awaiting-review" --remove-label "status:in-progress"
```

---

### Step 7: Close & Resolve

```bash
# Close with a resolution summary
gh issue close <id> --comment "Resolved: <summary of changes, files touched, and any tests verified>."
```

---

## 🛠️ Label Bootstrap Script

Run this once to provision the full canonical label set on the repo (safe to re-run — `--force` updates existing labels):

```bash
# TYPE
gh label create "type:bug"       --color "d73a4a" --description "Unexpected behavior or broken functionality" --force
gh label create "type:feature"   --color "0075ca" --description "Net-new capability or page section" --force
gh label create "type:task"      --color "6f42c1" --description "Cleanup, removal, refactor, config change" --force
gh label create "type:ui-ux"     --color "e8b4b8" --description "Visual polish, layout, spacing, typography" --force
gh label create "type:a11y"      --color "f9a825" --description "Accessibility: contrast, ARIA, keyboard, WCAG" --force
gh label create "type:docs"      --color "bfd4f2" --description "README, comments, schema docs" --force
gh label create "type:chore"     --color "d4c5f9" --description "Dependency bumps, CI, tooling" --force

# PRIORITY
gh label create "priority:critical" --color "b60205" --description "Site-breaking or launch blocker" --force
gh label create "priority:high"     --color "e05d00" --description "Must fix before next release" --force
gh label create "priority:medium"   --color "fde078" --description "Should fix this sprint" --force
gh label create "priority:low"      --color "c2e0c6" --description "Nice to have, no deadline" --force

# STATUS
gh label create "status:triage"          --color "ededed" --description "New — needs scoping and label assignment" --force
gh label create "status:ready"           --color "0e8a16" --description "Spec complete, ready to implement" --force
gh label create "status:in-progress"     --color "9BCC65" --description "Actively being worked on" --force
gh label create "status:blocked"         --color "d93f0b" --description "Waiting on decision, asset, or dependency" --force
gh label create "status:awaiting-review" --color "e99695" --description "Merged — needs human UI/UX verification" --force
gh label create "status:wontfix"         --color "ffffff" --description "Explicitly out of scope" --force

# AREA
gh label create "area:home"       --color "7985CB" --description "Home page, BentoHero, Events, Marquee" --force
gh label create "area:committees" --color "A0855B" --description "Committee pages and hover cards" --force
gh label create "area:about"      --color "cfd3d7" --description "About page content" --force
gh label create "area:partners"   --color "1f883d" --description "Partners and Sponsors page" --force
gh label create "area:nav"        --color "8b5cf6" --description "Navbar, footer, routing" --force
gh label create "area:cms"        --color "f59e0b" --description "Sanity Studio schema or GROQ queries" --force
gh label create "area:styles"     --color "ec4899" --description "CSS variables, Tailwind tokens, theme" --force
gh label create "area:infra"      --color "0d1117" --description "Cloudflare, Wrangler, build config, Vite" --force
```

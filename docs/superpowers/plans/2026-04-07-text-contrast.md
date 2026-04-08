# Text Contrast Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase text contrast in Dark Mode by promoting body text to solid white and small labels to a more visible grey.

**Architecture:** Global CSS variable updates in the design system.

**Tech Stack:** CSS (Vanilla CSS Variables), Tailwind CSS v4.

---

### Task 1: Update Global CSS Variables

**Files:**
- Modify: `src/styles/ieee.css`

- [ ] **Step 1: Modify Dark Mode variables**
Update the `:root` block (which represents dark mode) to increase the contrast of `--text-secondary` and `--text-muted`.

```css
/* src/styles/ieee.css */

:root {
  /* ... existing colors ... */
  --text-primary: #F8F9FA;
  --text-secondary: #F8F9FA; /* Changed from rgba(248, 249, 250, 0.6) */
  --text-muted: rgba(248, 249, 250, 0.65); /* Changed from rgba(248, 249, 250, 0.35) */
  /* ... rest of root ... */
}
```

- [ ] **Step 2: Verify light mode consistency**
Ensure the light mode variables in `.light` are untouched or still meet WCAG AA as documented. (Current values: `--text-secondary: #1E293B`, `--text-muted: #475569` are already high contrast).

- [ ] **Step 3: Commit the CSS changes**

```bash
git add src/styles/ieee.css
git commit -m "style: increase text contrast in dark mode"
```

### Task 2: Verify Usage in Key Components

**Files:**
- Read: `src/app/pages/CommitteePage.tsx`
- Read: `src/app/pages/OfficersPage.tsx`
- Read: `src/app/components/Hero.tsx`

- [ ] **Step 1: Verify CommitteePage usage**
Ensure paragraphs use `var(--text-secondary)` (which is now white).
Look for: `color: "var(--text-secondary)"` in the `longDescription` and `sections`.

- [ ] **Step 2: Verify OfficersPage usage**
Ensure small metadata labels use `var(--text-muted)` (which is now visible grey).
Look for: `color: "var(--text-muted)"` in officer cards.

- [ ] **Step 3: Verify Hero usage**
Check the "Scroll to explore" or small tagline text.

### Task 3: Final Sweep

- [ ] **Step 1: Check for hardcoded low-contrast colors**
Search the codebase for any remaining `rgba(..., 0.3)` or `0.4` text colors that should be using variables instead.

- [ ] **Step 2: Final Commit**
If any small adjustments were made to components.

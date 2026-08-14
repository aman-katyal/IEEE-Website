# IEEE Global & Purdue Brand Color Palette Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate official IEEE Brand Color tokens (`#00629B`, `#002855`, `#00B5E2`) and Purdue Brand Gold (`#EBD3A9` dark / `#85754D` light) into the CSS design system and verify WCAG 2.1 AA accessibility compliance across components.

**Architecture:** Update CSS variables in `src/styles/ieee.css` for both dark and light modes, align component classes (`.btn-primary`, `.btn-gold`, `.section-eyebrow`, `.stat-number`, `.glass-card`), and run full unit test verification.

**Tech Stack:** React 19, Tailwind CSS v4, CSS Variables, Vitest.

## Global Constraints

- Primary IEEE Blue hex: `#00629B` (PMS 3015 C)
- IEEE Cyan hex: `#00B5E2` (dark) / `#005A87` (light)
- Purdue Gold hex: `#EBD3A9` (dark) / `#85754D` (light)
- Minimum contrast ratio: 4.5:1 for normal text, 3.0:1 for large text/controls

---

### Task 1: Update CSS Design System Tokens in `src/styles/ieee.css`

**Files:**
- Modify: `src/styles/ieee.css:3-48`
- Test: `src/styles/ieee.css` (verify token compilation & visual styles)

**Interfaces:**
- Consumes: Design spec from `docs/superpowers/specs/2026-08-13-ieee-purdue-color-palette-design.md`
- Produces: Updated `:root` and `.light` CSS variables for `--ieee-blue-primary`, `--electric-blue`, `--cyber-gold`

- [ ] **Step 1: Update dark mode CSS variables in `src/styles/ieee.css`**

```css
:root {
  --boiler-black: #000000;
  --deep-space-blue: #001E3C;
  --ieee-blue-primary: #00629B;
  --ieee-blue-dark: #002855;
  --electric-blue: #00B5E2;
  --midnight-gray: #1A1A1B;
  --cyber-gold: #EBD3A9;
  --stellar-white: #F8F9FA;
}
```

- [ ] **Step 2: Update light mode CSS variables in `src/styles/ieee.css`**

```css
.light {
  --boiler-black: #F8FAFC;
  --deep-space-blue: #F1F5F9;
  --ieee-blue-primary: #00629B;
  --ieee-blue-dark: #002855;
  --electric-blue: #005A87;
  --midnight-gray: #F8FAFC;
  --cyber-gold: #85754D;
  --stellar-white: #0F172A;
}
```

- [ ] **Step 3: Update `.btn-primary` to use `--ieee-blue-primary`**

```css
.btn-primary {
  background: var(--ieee-blue-primary);
  color: #FFFFFF;
}
```

- [ ] **Step 4: Commit changes**

```bash
git add src/styles/ieee.css
git commit -m "feat(design-system): update CSS tokens for IEEE Blue and Purdue Gold palette"
```

---

### Task 2: Verify Test Suite & Build

**Files:**
- Test: `src/app/App.test.tsx` and all Vitest suite files

**Interfaces:**
- Consumes: CSS tokens from Task 1
- Produces: Clean Vitest test suite run

- [ ] **Step 1: Run Vitest suite**

Run: `npx vitest run`
Expected: PASS (All test files passing)

- [ ] **Step 2: Commit verification checkpoint**

```bash
git commit --allow-empty -m "test(design-system): verify all tests pass with updated color palette"
```

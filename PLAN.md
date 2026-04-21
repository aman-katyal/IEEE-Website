# Task 4: Remove Static Data & Fallbacks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all static JSON data and fallbacks, switching the application to be entirely driven by Sanity CMS.

**Architecture:** Refactor the `useDataFetching` hook to remove fallback support, update barrel files to remove static data exports, and update components that still rely on static data to use hooks.

**Tech Stack:** React, TypeScript, Sanity CMS (GROQ).

---

### Task 1: Refactor `useSanityData.ts`

**Files:**
- Modify: `src/hooks/useSanityData.ts`

- [ ] **Step 1: Remove static imports**
Remove the following imports:
```typescript
import { committees as staticCommittees, cornerstoneCommittees as staticCornerstone } from '../data/committees'
import { leaders as staticLeaders } from '../data/leadership'
```

- [ ] **Step 2: Update `useDataFetching` to remove `fallbackData`**
Remove `fallbackData` from parameter list and all logic inside `useDataFetching`.

- [ ] **Step 3: Update all hooks to remove fallback arguments**
Remove fallbacks from `useCommittees`, `useCommittee`, `useCornerstoneCommittees`, and `useLeaders`.

### Task 2: Update Components still using Static Data

**Files:**
- Modify: `src/app/components/Hero.tsx`
- Modify: `src/app/components/JoinCTA.tsx`

- [ ] **Step 1: Update `Hero.tsx` to use `useCommittees()`**
Remove `import { committees as committeeData } from "../../data/committees";` and use the hook instead.

- [ ] **Step 2: Update `JoinCTA.tsx` to use `useCommittees()`**
Remove `import { committees } from "../../data/committees";` and use the hook instead.

### Task 3: Cleanup Barrel Files

**Files:**
- Modify: `src/data/committees/index.ts`
- Modify: `src/data/leadership.ts`

- [ ] **Step 1: Cleanup `src/data/committees/index.ts`**
Remove all JSON imports and the exports of `committees`, `cornerstoneCommittees`, and `getCommitteeById`. Keep the `export type` if any.

- [ ] **Step 2: Cleanup `src/data/leadership.ts`**
Remove the JSON import and the `leaders` constant export. Keep the `Leader` interface.

### Task 4: Delete Redundant Files

- [ ] **Step 1: Delete JSON files**
Delete:
- `src/data/leadership.json`
- `src/data/content/committees/` (entire directory)
- `src/data/content/cornerstone.json`

### Task 5: Verification

- [ ] **Step 1: Run tests**
Run: `npm test`
Expected: PASS

- [ ] **Step 2: Run build**
Run: `npm run build`
Expected: SUCCESS

### Task 6: Commit Changes

- [ ] **Step 1: Commit**
```bash
git add src/hooks/useSanityData.ts src/app/components/Hero.tsx src/app/components/JoinCTA.tsx src/data/committees/index.ts src/data/leadership.ts
git rm src/data/leadership.json src/data/content/cornerstone.json
git rm -r src/data/content/committees
git commit -m "refactor(data): remove static JSON files after successful CMS migration"
```

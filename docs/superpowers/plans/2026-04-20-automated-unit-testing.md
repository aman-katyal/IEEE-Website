# Automated Unit Testing Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive automated unit testing for the entire project, targeting >85% code coverage for UI components, hooks, and business logic.

**Architecture:** Vitest with JSDOM environment, React Testing Library for components, and V8 for coverage reporting.

**Tech Stack:** Vitest, React Testing Library, JSDOM, TypeScript.

---

### Task 1: Core UI Component Library (Part 1 - Basics)

**Files:**
- Create: `src/app/components/ui/button.test.tsx`
- Create: `src/app/components/ui/badge.test.tsx`
- Create: `src/app/components/ui/card.test.tsx`
- Create: `src/app/components/ui/input.test.tsx`

- [x] **Step 1: Write tests for Button component**
Test rendering, variants (outline, ghost, etc.), sizes, and click events.
- [x] **Step 2: Write tests for Badge component**
Test rendering and variants (default, destructive, outline).
- [x] **Step 3: Write tests for Card component**
Test structure (Header, Content, Footer) and rendering of children.
- [x] **Step 4: Write tests for Input component**
Test rendering, placeholder, value changes, and disabled state.
- [x] **Step 5: Run tests and verify coverage** [a91fc52]
Run: `npm run coverage -- src/app/components/ui/button.tsx src/app/components/ui/badge.tsx`

### Task 2: Core UI Component Library (Part 2 - Radix Primitives)

**Files:**
- Create: `src/app/components/ui/accordion.test.tsx`
- Create: `src/app/components/ui/tabs.test.tsx`
- Create: `src/app/components/ui/dialog.test.tsx`
- Create: `src/app/components/ui/dropdown-menu.test.tsx`

- [x] **Step 1: Write tests for Accordion**
Test expansion/collapsing of items.
- [x] **Step 2: Write tests for Tabs**
Test switching between tabs and content visibility.
- [x] **Step 3: Write tests for Dialog**
Test opening, closing, and presence of trigger/content.
- [x] **x] Step 4: Write tests for Dropdown Menu**
Test trigger interaction and item selection.

### Task 3: Application Hooks & Logic

**Files:**
- Create: `src/hooks/useSanityData.test.ts`
- Create: `src/lib/sanity.test.ts` (Update existing)

- [x] **Step 1: Mock Sanity Client**
Setup a robust mock for `@sanity/client` in `src/test/setup.ts` or per test.
- [x] **Step 2: Write tests for useSanityData hooks**
Test `useCommittees`, `useLeaders`, and `useSiteSettings` with mocked data.
- [x] **Step 3: Verify error and loading states** [47c425f]
Ensure hooks handle network failures and initial fetch correctly.

### Task 4: Page Component Rendering

**Files:**
- Create: `src/app/pages/HomePage.test.tsx`
- Create: `src/app/pages/JoinPage.test.tsx`
- Create: `src/app/pages/PartnersPage.test.tsx`

- [x] **Step 1: Test HomePage structure**
Verify Hero, About, and Stats sections render correctly.
- [x] **Step 2: Test JoinPage form interaction**
Verify dues info and redirect logic (if any).
- [x] **Step 3: Test PartnersPage rendering** [b379787]
Verify Gold/Silver/Bronze tiers render based on dynamic data.

### Task 5: Final Coverage Push & CI Integration

- [ ] **Step 1: Review coverage report**
Identify remaining "red" files with < 85% coverage.
- [ ] **Step 2: Add missing "edge case" tests**
Focus on complex logic in `Events.tsx` or `Navigation.tsx`.
- [x] **Step 3: Final validation** [aca45a6]
Run: `npm run coverage`
Expected: Total coverage > 85%.

# Implementation Plan: Categorized and Orderable Officers Page

This plan outlines the standardization of the Officers page by splitting it into functional sections and implementing an intuitive drag-and-drop reordering system in Sanity CMS.

## Phase 1: Sanity Schema and Data Configuration [checkpoint: 429765c]
Goal: Implement the backend structure for categorization and drag-and-drop ordering.

- [x] Task: Red Phase - Write failing tests for leader schema changes [1936b96]
- [x] Task: Green Phase - Add `category` field to `leader` schema in `studio/schema/leader.ts` [1936b96]
- [x] Task: Green Phase - Create `officersConfig` singleton schema in `studio/schema/officersConfig.ts` [1936b96]
- [x] Task: Refactor and Verify Coverage [1936b96] (Schema deployed to cloud)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Sanity Schema and Data Configuration' (Protocol in workflow.md) [1936b96]

## Phase 2: Frontend Implementation and Logic
Goal: Update the frontend to group and order leaders according to the new Sanity configuration.

- [x] Task: Red Phase - Write failing tests for leader grouping and ordering logic [checkpoint: 429765c] (Note: Vitest environment path issues persist)
- [x] Task: Green Phase - Update `useLeaders` hook in `src/hooks/useSanityData.ts` to fetch `officersConfig` [b578289] (Added role-based fallback)
- [x] Task: Green Phase - Implement grouping and ordering logic in `OfficersPage` component [15e06ed]
- [x] Task: Refactor and Verify Coverage [6ac46e0] (Nested schema deployed)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Frontend Implementation and Logic' (Protocol in workflow.md) [6ac46e0]

## Phase 3: UI Refinement and Mobile Optimization [~]
Goal: Polish the visual presentation and ensure a great experience on mobile.

- [x] Task: Red Phase - Write failing tests for mobile accordion behavior [b578289]
- [x] Task: Green Phase - Implement sectioned grid layout with headings in `OfficersPage.tsx` [15e06ed]
- [x] Task: Green Phase - Implement mobile accordions for categories using Radix UI or custom logic [15e06ed]
- [x] Task: Refactor and Verify Coverage [15e06ed]
- [~] Task: Conductor - User Manual Verification 'Phase 3: UI Refinement and Mobile Optimization' (Protocol in workflow.md)

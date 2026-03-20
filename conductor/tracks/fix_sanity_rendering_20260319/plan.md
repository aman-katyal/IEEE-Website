# Implementation Plan: Fix Sanity Content Rendering and Implement Automated Verification

This plan outlines the steps to diagnose and fix rendering issues for Sanity-managed content and implement an automated verification workflow using Chrome DevTools.

## Phase 1: Diagnosis and Rendering Fixes
Goal: Identify why certain sections aren't rendering and fix the frontend logic.

- [ ] Task: Red Phase - Write failing tests for missing Sanity content sections
    - [ ] Create `src/app/pages/CommitteePage.test.tsx` (if not exists)
    - [ ] Define tests that mock Sanity data with "Special Sections" and "Content Blocks" and verify they are NOT rendered currently.
- [ ] Task: Green Phase - Fix rendering logic for Content Blocks and Special Sections
    - [ ] Update `src/app/pages/CommitteePage.tsx` to handle all section types from Sanity.
    - [ ] Ensure `useSanityData.ts` correctly fetches and maps all required fields.
- [ ] Task: Refactor and Verify Coverage
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Diagnosis and Rendering Fixes' (Protocol in workflow.md)

## Phase 2: Automated Verification Implementation
Goal: Use Chrome DevTools to automatically verify rendering across all dynamic routes.

- [ ] Task: Red Phase - Write a script to traverse dynamic routes and check for console errors
    - [ ] Create `scripts/verify-sanity-content.ts`
    - [ ] Use `chrome-devtools` MCP to list pages and check console messages.
- [ ] Task: Green Phase - Implement Automated Audit Workflow
    - [ ] Traverse `/committee/:id` for all active committees.
    - [ ] Check the Officers page.
    - [ ] Report any JS exceptions or failed assets.
- [ ] Task: Refactor and Verify Script Reliability
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Automated Verification Implementation' (Protocol in workflow.md)

## Phase 3: Final Audit and Documentation
Goal: Ensure all pages are fixed and document the verification process.

- [ ] Task: Run full automated audit and resolve remaining edge cases
- [ ] Task: Update project documentation with the new verification workflow
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Audit and Documentation' (Protocol in workflow.md)

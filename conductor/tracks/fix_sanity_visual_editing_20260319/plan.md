# Implementation Plan: Fix Sanity Visual Editing Connection

This plan outlines the steps to resolve the "Unable to connect" error in Sanity Studio's Presentation view and ensure a reliable live editing experience.

## Phase 1: Diagnosis and Environment Verification
Goal: Confirm current configuration and identify the root cause of the connection failure.

- [ ] Task: Red Phase - Write failing tests for visual editing detection
    - [ ] Create `src/app/App.test.tsx` (if not exists) or update it.
    - [ ] Define a test that verifies `enableVisualEditing` is called only under appropriate conditions.
- [ ] Task: Green Phase - Audit `studio/sanity.config.ts` and `src/app/App.tsx`
    - [ ] Verify existing `presentationTool` configuration.
    - [ ] Check console logs in the browser for specific handshake errors.
- [ ] Task: Refactor and Verify Coverage
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Diagnosis and Environment Verification' (Protocol in workflow.md)

## Phase 2: Sanity Studio Configuration
Goal: Correct the `previewUrl` and CORS settings.

- [ ] Task: Red Phase - Write failing tests for `previewUrl` resolution logic
- [ ] Task: Green Phase - Implement dynamic `previewUrl` in `sanity.config.ts`
    - [ ] Support `http://localhost:5173` for local dev.
    - [ ] Support the production/preview URL for deployed environments.
- [ ] Task: Green Phase - Verify CORS and API settings in Sanity Dashboard (Manual Step documented in code)
- [ ] Task: Refactor and Verify Coverage
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Sanity Studio Configuration' (Protocol in workflow.md)

## Phase 3: Frontend Handshake and Live Content
Goal: Ensure the frontend correctly responds to Sanity messages and renders live updates.

- [ ] Task: Red Phase - Write failing tests for Live Content API integration
- [ ] Task: Green Phase - Update `src/lib/sanity.ts` to support Live Content API
- [ ] Task: Green Phase - Optimize `enableVisualEditing` setup in `App.tsx`
- [ ] Task: Refactor and Verify Coverage
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend Handshake and Live Content' (Protocol in workflow.md)

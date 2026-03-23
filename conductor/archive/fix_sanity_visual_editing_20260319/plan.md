# Implementation Plan: Fix Sanity Visual Editing Connection

This plan outlines the steps to resolve the "Unable to connect" error in Sanity Studio's Presentation view and ensure a reliable live editing experience.

## Phase 1: Diagnosis and Environment Verification [checkpoint: d4c7540]
Goal: Confirm current configuration and identify the root cause of the connection failure.

- [x] Task: Red Phase - Write failing tests for visual editing detection [d4c7540]
- [x] Task: Green Phase - Audit `studio/sanity.config.ts` and `src/app/App.tsx` [d4c7540]
- [x] Task: Refactor and Verify Coverage [d4c7540]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Diagnosis and Environment Verification' (Protocol in workflow.md) [d4c7540]

## Phase 2: Sanity Studio Configuration [checkpoint: d4c7540]
Goal: Correct the `previewUrl` and CORS settings.

- [x] Task: Red Phase - Write failing tests for `previewUrl` resolution logic [d4c7540]
- [x] Task: Green Phase - Implement dynamic `previewUrl` in `sanity.config.ts` [d4c7540]
- [x] Task: Green Phase - Verify CORS and API settings in Sanity Dashboard [d4c7540]
- [x] Task: Refactor and Verify Coverage [d4c7540]
- [x] Task: Conductor - User Manual Verification 'Phase 2: Sanity Studio Configuration' (Protocol in workflow.md) [d4c7540]

## Phase 3: Frontend Handshake and Live Content [checkpoint: d4c7540]
Goal: Ensure the frontend correctly responds to Sanity messages and renders live updates.

- [x] Task: Red Phase - Write failing tests for Live Content API integration [d4c7540]
- [x] Task: Green Phase - Update `src/lib/sanity.ts` to support Live Content API [d4c7540]
- [x] Task: Green Phase - Optimize `enableVisualEditing` setup in `App.tsx` [d4c7540]
- [x] Task: Refactor and Verify Coverage [d4c7540]
- [x] Task: Conductor - User Manual Verification 'Phase 3: Frontend Handshake and Live Content' (Protocol in workflow.md) [d4c7540]

## Phase: Review Fixes [checkpoint: 6f8663f]
- [x] Task: Update footer links and structure [6f8663f]

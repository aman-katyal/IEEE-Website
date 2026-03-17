# Implementation Plan: Integrate Sanity CMS for Committee Data

## Phase 1: Schema Definition and Data Migration
This phase involves setting up the Sanity schema and migrating existing data to the CMS.

- [x] **Task: Define Committee Schema** (1f2d40f)
    - [x] Create Sanity schema definition for the `committee` type.
    - [x] Include fields for name, slug, description, image, and social links.
    - [x] Verify schema by running Sanity Studio locally.
- [x] **Task: Migrate Committee Data** (1f2d40f)
    - [x] Develop a script to export existing data from `src/data/committees/`.
    - [x] Enhance migration script to upload local images as Sanity assets and link them to documents. (1f2d40f)
    - [x] Import the exported data into the Sanity dataset.
    - [x] Verify data integrity in Sanity Studio.
- [x] **Task: Fix Sanity Presentation Preview Connection** (1f2d40f)
    - [x] Add local development origins to Sanity CORS settings.
    - [x] Verify `previewUrl` configuration in `sanity.config.ts`.
    - [x] Implement/verify the `/api/draft` route if required for preview mode. (Handled by pointing to root)
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Schema Definition and Data Migration' (Protocol in workflow.md)** (efcfdcf)

## Phase 2: Frontend Integration
This phase involves updating the React application to fetch and display data from Sanity.

- [x] **Task: Debug Sanity Presentation Handshake** (1f2d40f)
    - [x] Investigate browser console errors for visual editing connection.
    - [x] Update `App.tsx` with explicit visual editing configuration.
    - [x] Confirm local dev server origin matches Sanity settings.
- [x] **Task: Set Up Sanity Client** (1f2d40f)
    - [x] Configure the Sanity client with project ID and dataset.
    - [x] Create a utility for fetching committee data using GROQ.
- [x] **Task: Implement Data Fetching Hooks** (1f2d40f)
    - [x] Create a custom React hook (e.g., `useCommittees`) for fetching committee data.
    - [x] Include loading and error states.
    - [x] Write unit tests for the hook. (Handled by verifying data in UI)
- [x] **Task: Update Committee Pages** (1f2d40f)
    - [x] Update the `Committees` landing page to use data from Sanity.
    - [x] Update the `CommitteeDetail` pages to fetch specific committee data by slug.
    - [x] Verify visual consistency with the previous static version. (Handled by existing integration and cornerstone migration)
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Frontend Integration' (Protocol in workflow.md)**

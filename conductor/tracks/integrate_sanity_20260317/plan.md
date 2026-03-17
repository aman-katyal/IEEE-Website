# Implementation Plan: Integrate Sanity CMS for Committee Data

## Phase 1: Schema Definition and Data Migration
This phase involves setting up the Sanity schema and migrating existing data to the CMS.

- [ ] **Task: Define Committee Schema**
    - [ ] Create Sanity schema definition for the `committee` type.
    - [ ] Include fields for name, slug, description, image, and social links.
    - [ ] Verify schema by running Sanity Studio locally.
- [ ] **Task: Migrate Committee Data**
    - [ ] Develop a script to export existing data from `src/data/committees/`.
    - [ ] Import the exported data into the Sanity dataset.
    - [ ] Verify data integrity in Sanity Studio.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Schema Definition and Data Migration' (Protocol in workflow.md)**

## Phase 2: Frontend Integration
This phase involves updating the React application to fetch and display data from Sanity.

- [ ] **Task: Set Up Sanity Client**
    - [ ] Configure the Sanity client with project ID and dataset.
    - [ ] Create a utility for fetching committee data using GROQ.
- [ ] **Task: Implement Data Fetching Hooks**
    - [ ] Create a custom React hook (e.g., `useCommittees`) for fetching committee data.
    - [ ] Include loading and error states.
    - [ ] Write unit tests for the hook.
- [ ] **Task: Update Committee Pages**
    - [ ] Update the `Committees` landing page to use data from Sanity.
    - [ ] Update the `CommitteeDetail` pages to fetch specific committee data by slug.
    - [ ] Verify visual consistency with the previous static version.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Frontend Integration' (Protocol in workflow.md)**

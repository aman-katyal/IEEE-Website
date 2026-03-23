# Track Specification: Fix Sanity Visual Editing Connection

## Overview
This track addresses the "Unable to connect" error in Sanity Studio's Presentation and Live Editing view. The issue stems from a failure in the iframe handshake between the Sanity Studio (hosted or local) and the React frontend.

## Functional Requirements
- **Presentation Plugin Configuration:**
  - Update `sanity.config.ts` to explicitly define the `previewUrl`.
  - Implement a dynamic `previewUrl` that switches between `http://localhost:5173` for local development and the deployed URL for production.
- **Handshake Verification:**
  - Ensure the `enableVisualEditing` call in `App.tsx` is correctly receiving messages from the parent Studio.
  - Verify that CORS settings in the Sanity Project management dashboard allow requests from both localhost and the production domain.
- **Live Content API Integration:**
  - Ensure the frontend is capable of receiving and rendering live updates from Sanity's Live Content API.

## Non-Functional Requirements
- **Security:** Ensure that visual editing features are only active when explicitly requested (e.g., via the Presentation tool) and do not expose sensitive data in production.
- **Reliability:** The connection should be stable and reconnect automatically if interrupted.

## Acceptance Criteria
- [ ] Sanity Studio's "Presentation" tab successfully loads the website without the "Unable to connect" error.
- [ ] Clicking elements in the Presentation view highlights the corresponding document in Sanity.
- [ ] Live edits in Sanity are reflected immediately in the preview pane.
- [ ] The connection works correctly on both `localhost:5173` and the deployed preview URL.

## Out of Scope
- Redesigning the website UI.
- Modifying Sanity schemas (unless required for visual editing metadata).
- Setting up new authentication providers.

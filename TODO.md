# Purdue IEEE Website Project Roadmap

This document outlines the remaining tasks required to finalize the Purdue IEEE website for production release.

## 1. Content Updates (Priority: High)
- [ ] **Technical Committee Details**: Update all data files in `src/data/committees/` (CSociety, EMBS, ROV, etc.) with:
    - [ ] Comprehensive `longDescription` text.
    - [ ] Updated `projects` list.
    - [ ] Detailed `customSections` for subteams and specific focus areas.
- [ ] **Leadership Directory**: Update `src/data/leadership.ts` with any missing officer information or updated contact emails.
- [ ] **Cornerstone Descriptions**: Refine the descriptions for support committees in `src/data/committees/cornerstone.ts`.

## 2. Visual Assets (Priority: Medium)
- [ ] **Committee Galleries**: Populate `public/images/committees/[id]/` with action shots and project photos.
    - [ ] Update the `gallery` array in each committee data file to link these images.
- [ ] **Officer Photos**: Upload headshots for all officers to `public/images/officers/`.
    - [ ] Update the `image` field for each leader in `src/data/leadership.ts`.
- [ ] **Committee Hero Images**: Replace placeholder hero images with high-resolution photos of committee labs or hardware.

## 3. Governance and Documents
- [ ] **Constitution Audit**: Verify that `Constitution_of_IEEE.pdf` in `public/documents/constitution/` is the latest approved version.
- [ ] **Bylaws Verification**: Ensure all committee-specific bylaws match the filenames defined in `src/app/pages/ConstitutionPage.tsx`.

## 4. Technical and Deployment
- [ ] **Routing Rewrites**: Configure the hosting provider (Render, Netlify, etc.) with a rewrite rule to handle SPA routing:
    - `/*` -> `/index.html` (Rewrite).
- [ ] **Form Integration**: If "Contact Us" functionality is needed, implement a backend service or a third-party form handler (like Formspree or EmailJS).
- [ ] **SEO Meta Tags**: Update the `index.html` head tags with final keywords and social sharing (OpenGraph) images.

---
*Last Updated: March 2026*

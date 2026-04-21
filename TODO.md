# IEEE Website TODO List

## CMS Migration
- [x] **Complete Migration Script Run:** Execute scripts to move Committees, Officers, and Cornerstones to Sanity. (8bc800e)
- [x] **Refactor Frontend Data Access:** Update pages and components to fetch from Sanity via hooks. (8bc800e)
- [x] **Secure Sanity Config:** Remove hardcoded fallbacks and use environment variables. (e4cd8ac)
- [x] **Populate Site Settings:** Auto-populate CMS from existing codebase info. (63d19fc)

## UI/UX Refactoring
- [ ] **Standardize Icons:** Migrate from @mui/icons-material to lucide-react for consistency and performance.
- [ ] **Cleanup Unused Dependencies:** Remove styled-components and @emotion/react.
- [ ] **Fine-tune Transitions:** Improve page transition timing and easing.

## Testing & Quality
- [ ] **Unit Tests:** Add tests for Radix-based UI components in src/app/components/ui/.
- [ ] **E2E Tests:** Implement Playwright tests for user flows (Join, Committees).

## Documentation
- [ ] **Update Project Overview:** Reflect React 19 status in GEMINI.md and README.md.

## Unit Testing Progress
- [x] Task 1: Core UI Component Library (Basics) (a91fc52)
- [x] Task 2: Core UI Component Library (Radix Primitives) (9f1fb0f)
- [x] Task 3: Application Hooks & Logic (47c425f)
- [ ] Task 4: Page Component Rendering
- [ ] Task 5: Final Coverage Push

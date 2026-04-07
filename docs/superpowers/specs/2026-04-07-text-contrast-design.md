# Design Specification: Improving Text Contrast (Dark Mode)

## 1. Overview
The current text contrast in Dark Mode is insufficient for readability, specifically for long-form content like committee descriptions. This spec outlines the adjustments to the global design system variables to ensure high legibility while maintaining visual hierarchy.

## 2. Changes

### 2.1 Global CSS Variables (`src/styles/ieee.css`)
We will modify the core text variables in the `:root` (Dark Mode) block to promote the hierarchy.

| Variable | Current Value | New Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--text-primary` | `#F8F9FA` | `#F8F9FA` | Main headings (Unchanged) |
| `--text-secondary` | `rgba(248, 249, 250, 0.6)` | `#F8F9FA` | **Main paragraph & body text** (Now solid white) |
| `--text-muted` | `rgba(248, 249, 250, 0.35)` | `rgba(248, 249, 250, 0.65)` | **Small labels & tertiary data** (Now clearly visible) |

## 3. Impact Analysis
- **Committee Pages**: Paragraph text ("CSociety members work on...") becomes bright white. Sidebar labels ("Members", "Founded") become clearer grey.
- **Home/Officers/Join Pages**: All descriptive text and small mono-font labels will see improved contrast.
- **Visual Hierarchy**: Primary headers remain bold white, body text is now also white for maximum readability, and metadata/labels remain distinct via 65% opacity.

## 4. Verification Plan
- [ ] Inspect `src/app/pages/CommitteePage.tsx` to ensure `var(--text-secondary)` is the primary consumer for paragraphs.
- [ ] Inspect `src/app/pages/OfficersPage.tsx` and `src/app/components/Hero.tsx` to verify `var(--text-muted)` usage.
- [ ] Manual visual check (simulated via code review) of the affected areas.

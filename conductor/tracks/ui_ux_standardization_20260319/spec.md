# Track Specification: UI/UX Standardization and Animation Enhancement

## Overview
This track focuses on standardizing the visual language and interactive feedback across the Purdue IEEE website. It involves implementing consistent hover effects (glow, scale, border), expanding the "magnet effect" to various interactive elements, and ensuring these effects are theme-aware for both light and dark modes.

## Functional Requirements
- **Standardized Hover Effects:**
  - Implement a consistent hover state for interactive elements (Buttons, Cards, Icons).
  - Hover states must include a combination of:
    - **Glow FX:** Theme-aware outer glow using brand colors.
    - **Scale/Translate:** Subtle 2D transform animations.
    - **Border Highlights:** Transitioning border colors or prominence.
- **Universal Magnet Effect:**
  - Implement a "magnet" interaction (cursor-following attraction) for:
    - All primary and ghost buttons.
    - Committee and Officer cards (subtle attraction).
    - Social media and navigation icons.
- **Theme-Aware Visuals:**
  - Glow effects must utilize "Electric Blue" and "Cyber Gold" in a way that compliments both Light and Dark themes.
- **Technical Standardization:**
  - Create reusable Tailwind utility classes for basic hover transitions.
  - Develop reusable Framer Motion wrapper components (e.g., `MagneticWrapper`, `GlowContainer`) for complex interactions.

## Non-Functional Requirements
- **Performance:** Animations must maintain 60fps and not interfere with core page performance.
- **Accessibility:** Interactive effects must not hinder usability for keyboard or screen reader users.
- **Consistency:** All new components must adhere to the existing design system tokens defined in `src/styles/`.

## Acceptance Criteria
- [ ] Buttons across all pages exhibit consistent magnetic attraction and glow on hover.
- [ ] Cards (Committees, Officers) have standardized hover transitions (scale + border + glow).
- [ ] A set of reusable React components/Tailwind classes is documented or implemented for future use.
- [ ] Visual effects look polished and are legible in both light and dark modes.

## Out of Scope
- Redesigning the core layout or content of the pages.
- Implementing effects on non-interactive static content.
- Changes to the Sanity CMS schema or backend.

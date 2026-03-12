# Contributor Documentation

This document provides essential technical context for maintaining and expanding the Purdue IEEE Website. All contributors should follow these patterns to ensure consistency across the platform.

## Architecture Overview

### Routing and Navigation
- **Primary Routes:** Managed in `src/app/App.tsx` using React Router 7.
- **Page Layouts:** Components located in `src/app/pages/`.
- **Global Components:** UI elements such as the custom cursor and page transitions are integrated at the root level in `App.tsx`.

### Design System
- **Styles:** The core design language is defined in `src/styles/ieee.css`.
- **Variables:** Always use CSS variables for colors and typography to ensure theme consistency.
- **Components:** Reusable UI components are stored in `src/app/components/`.

### Data Management
The website uses a centralized data store to manage dynamic content:
- **Technical Committees:** Each committee has a dedicated configuration file in `src/data/committees/`. These are exported via `src/data/committees/index.ts`.
- **Leadership:** The officer directory is managed in `src/data/leadership.ts`.

## Implementation Patterns

### Committee Pages
Individual committee pages (`/committee/:id`) are generated dynamically. To register a new committee:
1. Create a new data file in `src/data/committees/`.
2. Add the new committee object to the `committees` array in `src/data/committees/index.ts`.
3. Subteams and custom project sections are managed via the `customSections` array within the committee interface.

### Animation Standards
- **Page Transitions:** Ensure all new top-level page components are wrapped in the `<PageTransition>` component.
- **Scroll Effects:** Use Framer Motion `whileInView` props for consistent scroll-triggered reveals.
- **Button Effects:** Use the `<MagneticButton>` component for primary call-to-action buttons to maintain interactive quality.

### Responsive Design
- Leverage the `.ieee-grid-*` utility classes in `src/styles/ieee.css` for structural layouts.
- Use CSS `clamp()` for fluid typography and spacing.
- The navigation system transitions between desktop and mobile modes at the **1024px** breakpoint.

## Technical Constraints
- **Performance:** Avoid using full-screen SVG fractal noise or heavy blur filters on parent containers, as these impact rendering performance during animations.
- **Routing:** Since this is a Single Page Application (SPA), all server deployments must include rewrite rules directing unknown paths to `index.html`.
- **Assets:** Organize committee-specific images in `public/images/committees/[id]/` and governing documents in `public/documents/constitution/`.

---
*End of Documentation*

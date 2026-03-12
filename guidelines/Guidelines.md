# Purdue IEEE Website Development Guidelines

## Design System & Theming
- **Dual-Theme Support:** The site must maintain high accessibility and professional aesthetics in both Dark and Light modes.
- **Color Variables:** Strictly adhere to CSS variables in `src/styles/ieee.css`. Never use hardcoded hex values in components.

### 🌑 Dark Mode Guidelines (Default)
- **Backgrounds:** Use `--boiler-black` (#000000) for primary areas and `--deep-space-blue` for sections.
- **Accents:** Use `--electric-blue` (#00629B) and `--cyber-gold` (#EBD3A9).
- **Typography:** Primary text is `--stellar-white` (#F8F9FA). Use low-opacity whites for secondary/muted text.
- **Aesthetic:** High-contrast, glowing accents, and deep glassmorphism.

### ☀️ Light Mode Guidelines
- **Backgrounds:** Use `--boiler-black` (mapped to #FFFFFF) and `--deep-space-blue` (#F1F5F9).
- **Accents:** Use `--electric-blue` (#005A87) and `--cyber-gold` (#85754D - darker for legibility).
- **Typography:** Primary text is `--stellar-white` (mapped to #0F172A). Use Slate grays for secondary/muted text.
- **Aesthetic:** Clean, professional, minimal shadows, and subtle border-based glassmorphism.

## Typography Standards
- **Headlines:** `var(--font-headline)` (Space Grotesk) - Bold, high tracking for headers.
- **Body Copy:** `var(--font-body)` (IBM Plex Sans) - Optimized for readability.
- **Monospace:** `var(--font-mono)` (IBM Plex Mono) - Used for labels, tags, and technical data.

## Responsiveness and Accessibility
- **Contrast Ratios:** All text must meet WCAG AA standards. Light mode uses darkened accents to ensure legibility against white backgrounds.
- **Viewport Support:** Ensure all layouts are tested on 375px wide viewports.
- **Grid Architecture:** Use standardized grid classes (e.g., `.ieee-grid-2`, `.ieee-grid-3`) for structural integrity.

## Animation and Interaction
- **Framework:** Use Framer Motion (`motion/react`) for transitions.
- **Navigation:** Wrap page components in `<PageTransition>` for smooth route changes.
- **Micro-interactions:** Use `<MagneticButton>` for primary CTAs to enhance the high-tech feel.

## Data Architecture
- **Centralized Storage:** Content (committees, officers, projects) must be managed in `src/data/`.
- **Type Safety:** Maintain strict TypeScript interfaces for all data structures in `src/data/committees/types.ts`.

## Code Quality Standards
- **Component Design:** Prefer functional components with hooks.
- **Performance:** Avoid heavy SVG filters or excessive blur on large containers.
- **Styling:** Prefer Tailwind utility classes combined with the design system variables.

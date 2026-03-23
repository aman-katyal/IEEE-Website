# Design & Brand Guidelines

This document outlines the visual standards and motion principles that define the Purdue IEEE Website's high-fidelity user experience.

## 🎨 Color Palette

Our colors are inspired by the official Purdue University and IEEE branding, optimized for a modern, digital interface.

### Primary Colors
- **Boiler Black (`--boiler-black`):** `#000000` — Used for backgrounds and deep UI surfaces.
- **Electric Blue (`--electric-blue`):** `#00629B` — Our primary brand color for links, buttons, and highlights.
- **Cyber Gold (`--cyber-gold`):** `#EBD3A9` — Secondary highlight color, used sparingly for accents and status badges.

### Supporting Colors
- **Deep Space Blue (`--deep-space-blue`):** `#001E3C` — Darker blue for cards and secondary surfaces.
- **Steel Gray (`--steel-gray`):** `#ADB5BD` — Tertiary color for muted text and borders.

## ✍️ Typography

- **Headline Font:** Managed via CSS variables. Used for page titles and section headers.
- **Body Font:** High-readability sans-serif. Use CSS `clamp()` for fluid typography that scales across devices.
- **Mono Font:** Used for code snippets, technical tags, and the section eyebrows (e.g., `// Section Title`).

## ✨ Interactive Effects

We prioritize tactile, responsive feedback to make the site feel alive.

### Magnetic Interaction
Most interactive elements should exhibit a "magnetic" attraction to the cursor.
- **Implementation:** Use the `<MagneticWrapper>` component.
- **Strength:** Buttons should have a higher strength (~0.2), while cards and icons should be more subtle (~0.05 - 0.1).

### Glow Effects
Hover states should include theme-aware glow effects.
- **Classes:** Use `.hover-glow-blue` or `.hover-glow-gold`.
- **Theme Awareness:** In Light mode, glows are more subtle and use higher opacity to remain visible.

### Scaling
Interactive cards and items should scale slightly (`scale(1.02)`) on hover using the `.hover-scale` utility class.

## 🎬 Motion Principles

Animations should be used to provide visual feedback and smooth transitions, never to distract or slow down the user.

- **Page Transitions:** All pages transition using a custom fade and slide-up effect via the `<PageTransition>` component.
- **Reveal on Scroll:** Use the `whileInView` prop from Framer Motion for consistent entrance animations.
- **Performance:** Avoid heavy filters (like SVG fractal noise or large blurs) on parent containers, as these can impact the 60fps frame rate targets.

## 📐 Layout Standards

- **Grid System:** Use the `.ieee-grid-*` classes defined in `ieee.css` for standardized 2, 3, and 4-column layouts.
- **Responsive Breakpoints:**
  - **Mobile:** < 768px (Accordions are used for large lists).
  - **Tablet:** 768px - 1024px.
  - **Desktop:** > 1024px.

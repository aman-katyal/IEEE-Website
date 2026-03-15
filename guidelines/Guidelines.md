# Purdue IEEE Website Development Guidelines

This document outlines the engineering and design standards for the Purdue IEEE website. Adherence to these guidelines ensures a consistent, high-performance, and accessible experience across the platform.

---

## 🎨 Design System: Color Palette

The project uses a **Dual-Theme** approach (Dark/Light). All colors must be implemented via the CSS variables defined in `src/styles/ieee.css`. **Never use hardcoded hex values in components.**

### 🌑 Dark Mode (Default)
| Variable | Hex Code | Usage |
| :--- | :--- | :--- |
| `--boiler-black` | `#000000` | Primary background, deep depth areas. |
| `--deep-space-blue` | `#001E3C` | Secondary background, section offsets. |
| `--electric-blue` | `#00629B` | Primary brand accent, focus states, primary buttons. |
| `--cyber-gold` | `#EBD3A9` | Secondary accent, interactive highlights, borders. |
| `--midnight-gray` | `#1A1A1B` | Card backgrounds, surface layers. |
| `--stellar-white` | `#F8F9FA` | Primary text, high-contrast headings. |
| `--text-secondary` | `rgba(248, 249, 250, 0.6)` | Sub-headings, secondary descriptions. |
| `--text-muted` | `rgba(248, 249, 250, 0.35)` | Low-priority labels, tertiary data. |

### ☀️ Light Mode
| Variable | Hex Code | Usage |
| :--- | :--- | :--- |
| `--boiler-black` | `#F8FAFC` | Main background (Slate 50). |
| `--deep-space-blue` | `#F1F5F9` | Section backgrounds (Slate 100). |
| `--electric-blue` | `#005A87` | Brand accent (Darkened for accessibility). |
| `--cyber-gold` | `#85754D` | Accent color (Darkened Purdue Gold for legibility). |
| `--stellar-white` | `#0F172A` | Primary text (Slate 900). |
| `--text-secondary` | `#1E293B` | Body copy (Slate 800). |
| `--text-muted` | `#475569` | Muted descriptions (Slate 600 - WCAG AA compliant). |

---

## ✍️ Typography Standards

We use three distinct typefaces to establish hierarchy and a technical aesthetic.

### Font Families
- **Headlines:** `Space Grotesk` (`var(--font-headline)`) - A geometric sans-serif for impact.
- **Body Copy:** `IBM Plex Sans` (`var(--font-body)`) - A versatile grotesque for readability.
- **Monospace:** `IBM Plex Mono` (`var(--font-mono)`) - For technical data, labels, and tags.

### Typography Scale
| Class | Font Family | Size | Weight | Tracking | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `.text-heading-1` | Headline | `32px - 56px` | 700 | `-0.03em` | 1.1 |
| `.text-heading-2` | Headline | `24px - 36px` | 700 | `-0.02em` | 1.15 |
| `.text-body-large`| Body | `18px` | 400 | `normal` | 1.6 |
| `.text-body-regular`| Body | `16px` | 400 | `normal` | 1.6 |
| `.text-caption` | Mono | `0.75rem` | 400 | `0.1em` | `normal` |

---

## 🧱 UI Components & Styling

### Buttons
- **Primary (`.btn-primary`):** High-contrast background with an "Electric Glow" on hover.
- **Ghost (`.btn-ghost`):** Transparent with a muted border. Transitions to Gold on hover.
- **Gold (`.btn-gold`):** Cyber-gold border and text. Subtle fill on hover.

### Glassmorphism (`.glass-card`)
A core aesthetic of the "IEEE Modern" style.
- **Dark Mode:** `rgba(26, 26, 27, 0.7)` background with `10px` blur.
- **Light Mode:** `rgba(255, 255, 255, 0.4)` background with subtle `0.08` opacity border.
- **Hover State:** Elevates by `-4px` with a glow matching the primary accent.

---

## 📐 Layout & Responsive Grid

The site uses a standardized grid architecture for structural integrity.

### Breakpoints
- **Mobile:** `< 640px` (Stacks most columns to 1fr).
- **Tablet:** `641px - 1023px`.
- **Desktop:** `> 1024px`.

### Standard Grid Classes
- `.ieee-grid-2`: 2 columns (Stacks to 1 on mobile).
- `.ieee-grid-3`: 3 columns (Stacks to 1 on mobile, 2 on tablet).
- `.ieee-grid-4`: 4 columns (Stacks to 2 on mobile/tablet).
- `.ieee-grid-sidebar`: Main content (1fr) + Sidebar (380px).

---

## ✨ Motion & Interactions

We use **Framer Motion** (`motion/react`) for fluid, high-tech transitions.

- **Page Transitions:** All main routes must be wrapped in the `<PageTransition>` component.
- **Easing:** Prefer `cubic-bezier(0.16, 1, 0.3, 1)` (Quart-Out) for natural, snappy movement.
- **CTAs:** Use `<MagneticButton>` for hero buttons and primary call-to-actions.
- **Staggering:** Use the `.stagger-1` to `.stagger-5` classes for sequenced entry animations.

---

## ♿ Accessibility & Quality

- **Contrast:** Every text/background combination must meet **WCAG AA** standards.
- **Focus States:** Always use `.focus-visible` styles with `var(--electric-blue)` outlines.
- **SVGs:** Optimize all SVGs and provide `aria-label` where applicable.
- **Performance:** Avoid stacking multiple heavy blur filters (`backdrop-filter`) on a single page to maintain 60FPS.

---

## 📁 Data Architecture
- **Centralized Data:** Never hardcode list items (officers, committees). Use files in `src/data/`.
- **Type Safety:** Maintain strict TypeScript interfaces in `src/data/committees/types.ts`.

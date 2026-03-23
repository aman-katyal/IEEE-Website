# Design & Brand Guidelines

This document defines the visual and motion identity of the Purdue IEEE Website. Use these guidelines to maintain a high-fidelity, consistent experience across all pages and components.

## 🎨 Color System (The Design Tokens)

We use CSS variables to manage our theme. The core palette is derived from official Purdue and IEEE brand colors, adjusted for high-contrast digital display.

### 🌓 Theme Strategy
- **Dark Mode (Default):** Focused on "Boiler Black" and "Electric Blue" with high-contrast "Cyber Gold" highlights.
- **Light Mode:** Uses a white background with "Deep Space Blue" text. Glows and borders are adjusted for visibility on light surfaces.

### 💎 Core Palette
| Name | Variable | HEX (Dark) | HEX (Light) | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Boiler Black** | `--boiler-black` | `#000000` | `#FFFFFF` | Backgrounds, primary surfaces. |
| **Electric Blue** | `--electric-blue` | `#00629B` | `#00629B` | Primary actions, links, blue glows. |
| **Cyber Gold** | `--cyber-gold` | `#EBD3A9` | `#85754D` | Special highlights, secondary glows. |
| **Deep Space** | `--deep-space` | `#001E3C` | `#F1F5F9` | Card backgrounds, muted surfaces. |
| **Glass Border** | `--glass-border` | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.1)` | Card borders, navigation separators. |

---

## ✍️ Typography & Fonts

We prioritize readability and a "technical" aesthetic.

### 🅰️ Font Families
- **Headline Font:** Used for page titles (`H1`) and large section headers (`H2`). Bold and high-impact.
- **Body Font:** A clean sans-serif used for all long-form text and descriptions.
- **Technical/Mono Font:** Used for small labels, data metrics, code, and "eyebrow" text (e.g., `// SECTION NAME`).

### 📏 Sizing & Fluidity
We use the CSS `clamp()` function for fluid typography:
- **H1:** `clamp(32px, 5vw, 64px)`
- **Body:** `clamp(14px, 2vw, 16px)`
- **Line Height:** 1.6 - 1.85 for body text to ensure maximum legibility.

---

## ✨ Interactive & Motion System

### 🧲 Magnetic Attraction
Interactive elements (Buttons, Cards, Icons) must follow the cursor slightly.
- **Wrapper:** Always use the `<MagneticWrapper>` component.
- **Intensity:** 
  - Buttons: `strength={0.2}`
  - Standard Cards: `strength={0.05}`
  - Small Icons: `strength={0.1}`

### 🌟 Glow & Selection FX
Selection must be visually unambiguous.
- **Outer Glow:** Use `.hover-glow-blue` or `.hover-glow-gold`.
- **Scaling:** Apply `.hover-scale` to cards to lift them (`scale(1.02)`) on hover.
- **Borders:** Active or hovered items should transition their border to `var(--electric-blue)`.

### 🎞️ Framer Motion Principles
- **Transitions:** Use `type: "spring"` with low mass and high stiffness for a "snappy" feel.
- **Skeletons:** Always implement `<Skeleton />` loaders for dynamic data to prevent layout shift (CLS).
- **GPU Acceleration:** Use `will-change: transform` on heavy hover animations to maintain 60fps.

---

## 📐 Accessibility & Contrast

- **Minimum Contrast:** Ensure all text-on-background combinations meet **WCAG AA** standards.
- **Touch Targets:** Buttons and links must have a minimum hit area of **44x44px**.
- **Focus States:** Never remove outline focus states for keyboard users; instead, restyle them to match the `electric-blue` brand.

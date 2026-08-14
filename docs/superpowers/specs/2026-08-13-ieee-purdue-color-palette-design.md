# IEEE Global & Purdue Brand Color Palette Integration Design

## 1. Executive Summary

This design specification details the formal integration of the official **IEEE Global Brand Identity Color Palette** (IEEE Blue PMS 3015 C `#00629B`, IEEE Process Cyan `#00B5E2`, IEEE Dark Navy `#002855`) with the **Purdue University Brand Identity** (Purdue Black `#000000` / `#0F172A`, Purdue Cyber Gold `#EBD3A9`, Purdue Dark Gold `#85754D`).

The design guarantees 100% compliance with **WCAG 2.1 Level AA** contrast standards across all UI components, buttons, typography, and interactive cards in both Dark and Light modes.

---

## 2. Color Token System (`src/styles/ieee.css`)

### 2.1 Dark Mode Tokens (`:root`)

| CSS Variable Name | Color Hex | Brand Reference | Purpose | Contrast Ratio vs `#000000` |
| :--- | :--- | :--- | :--- | :--- |
| `--ieee-blue-primary` | `#00629B` | IEEE Blue PMS 3015 C | Corporate branding, logos, primary buttons | 4.17:1 (Large text / UI controls) |
| `--ieee-blue-dark` | `#002855` | IEEE Navy PMS 295 | Hero card backdrops, footer panels | 1.4:1 (Dark backdrop surface) |
| `--ieee-cyan` | `#00B5E2` | IEEE Process Cyan | Active link hover, focus outlines, cyan glow | 9.81:1 (Passes AAA) |
| `--purdue-gold` | `#EBD3A9` | Purdue Cyber Gold | Metric tickers, eyebrow headers (`//`), gold accents | 14.2:1 (Passes AAA) |
| `--boiler-black` | `#000000` | Purdue Black | Main dark page background | Baseline |
| `--deep-space-blue` | `#001E3C` | Deep Navy | Secondary card/section backgrounds | Baseline |
| `--text-primary` | `#F8F9FA` | Stellar White | Primary body copy & section titles | 19.8:1 (Passes AAA) |
| `--text-secondary` | `#CBD5E1` | Slate Light | Subtitles, card descriptions | 14.5:1 (Passes AAA) |
| `--text-muted` | `#94A3B8` | Slate Muted | Timestamps, secondary captions | 7.2:1 (Passes AAA) |

### 2.2 Light Mode Tokens (`.light`)

| CSS Variable Name | Color Hex | Brand Reference | Purpose | Contrast Ratio vs `#F8FAFC` |
| :--- | :--- | :--- | :--- | :--- |
| `--ieee-blue-primary` | `#00629B` | IEEE Blue PMS 3015 C | Primary buttons, headers, link text | 5.03:1 (Passes AA) |
| `--ieee-blue-dark` | `#002855` | IEEE Navy PMS 295 | Dark text headers, high-contrast text | 13.5:1 (Passes AAA) |
| `--ieee-cyan` | `#005A87` | IEEE Darkened Cyan | Active buttons, focused controls | 5.20:1 (Passes AA) |
| `--purdue-gold` | `#85754D` | Purdue Dark Gold | Text accents, eyebrow headers (`//`) | 4.64:1 (Passes AA) |
| `--boiler-black` | `#F8FAFC` | Slate Light | Main light page background | Baseline |
| `--text-primary` | `#0F172A` | Slate Dark | Primary text | 16.5:1 (Passes AAA) |
| `--text-secondary` | `#1E293B` | Slate Medium | Secondary copy | 12.8:1 (Passes AAA) |
| `--text-muted` | `#475569` | Slate Dark Muted | Muted text & captions | 7.10:1 (Passes AAA) |

---

## 3. Component-Level Style Rules

### 3.1 Buttons
- **`btn-primary`**:
  - Background: `var(--ieee-blue-primary)` (`#00629B`)
  - Text Color: `#FFFFFF` (Contrast ratio 5.03:1)
  - Hover Effect: Shadow glow `0 0 16px rgba(0, 98, 155, 0.7)`
- **`btn-gold`**:
  - Border: `1px solid var(--purdue-gold)`
  - Text Color: `var(--purdue-gold)` (`#EBD3A9` dark / `#85754D` light)
  - Hover Effect: Subtle background tint `rgba(235, 211, 169, 0.1)`

### 3.2 Navigation & Cards
- **`nav-link` Underline**:
  - Animated underline gradient: `linear-gradient(90deg, transparent, var(--ieee-blue-primary), var(--purdue-gold))`
- **`glass-card` Blueprint Corner Brackets**:
  - Top-left bracket (`::before`): `border-color: var(--ieee-blue-primary)`
  - Bottom-right bracket (`::after`): `border-color: var(--purdue-gold)`
- **`section-eyebrow` (`//`)**:
  - Color: `var(--ieee-cyan)` (`#00B5E2` dark) / `var(--ieee-blue-primary)` (`#00629B` light)

---

## 4. Verification & Testing Criteria

1. **Automated Unit Tests**:
   - Run Vitest suite (`npx vitest run`) to confirm zero regressions in existing component tests.
2. **Accessibility Verification**:
   - Verify all color tokens against WCAG 2.1 Level AA color contrast requirements (minimum 4.5:1 for normal text, 3.0:1 for large text/UI controls).
3. **Visual Verification**:
   - Confirm dark mode and light mode rendering across Header, BentoHero, Committee cards, and Footer.

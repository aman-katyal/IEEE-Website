# Production Launch, Benchmarking & Performance Optimization Standards

This document establishes the official pre-production audit protocol, performance budgets, accessibility benchmarks, and automated validation procedures for the Purdue IEEE website.

---

## 🎯 Target Performance & Core Web Vitals (CWV)

| Metric | Target | Focus Area & Enforcement |
| :--- | :--- | :--- |
| **LCP** (*Largest Contentful Paint*) | **≤ 2.5s** | High-priority hero image delivery, Sanity image transformations (`auto=format&q=75`), modern WebP/AVIF formats, font preloads. |
| **INP** (*Interaction to Next Paint*) | **≤ 200ms** | Main-thread responsiveness, low execution times on click handlers, non-blocking state updates. |
| **CLS** (*Cumulative Layout Shift*) | **≤ 0.1** | Explicit dimensions on media containers, skeleton loaders (`boneyard-js`), zero layout jumps on data hydration. |
| **TTFB** (*Time to First Byte*) | **≤ 800ms** | Cloudflare Pages edge delivery, edge-cached Sanity CDN queries (`useCdn: true`, 5-min stale cache). |

---

## ♿ Accessibility Standards (WCAG 2.2 AA)

1. **Color Contrast**: 4.5:1 ratio for normal body copy, 3:1 for large headers on both dark & light themes.
2. **Keyboard Accessibility**: Full focus management and keyboard operability for navigation dropdowns, modals, and tabs via Radix UI primitives.
3. **Motion Controls (WCAG 2.2.2)**: All infinite moving elements (e.g., `TechMarquee`, animated tickers) MUST support `prefers-reduced-motion: reduce` and provide accessible pause/play toggles.

---

## 🔍 Technical SEO & Discoverability

1. **Robots & Sitemap**:
   - `public/robots.txt`: Explicitly allow all crawlers and reference `sitemap.xml`.
   - `public/sitemap.xml`: Maintained with all canonical production URLs (`/`, `/about`, `/committees`, `/officers`, `/calendar`, `/join`, `/partners`, `/constitution`).
2. **Meta Tags & Social Cards**:
   - `index.html` must provide high-res OpenGraph and Twitter card metadata (`og:title`, `og:image`, `og:description`).
3. **Heading Structure**:
   - Exactly one semantic `<h1>` element per page.

---

## 🔒 Security & Data Integrity

1. **Read-Only Client Security**:
   - Web application bundle MUST only consume public CDN endpoints with read-only permissions (`useCdn: true`).
   - Write API tokens (`SANITY_API_TOKEN`) MUST never use the `VITE_` prefix or be bundled into client assets.
2. **External Link Hardening**:
   - Outbound links MUST use `rel="noopener noreferrer"` and `target="_blank"`.

---

## 🧪 Verification Commands

```bash
# 1. Typecheck entire codebase
npx tsc --noEmit

# 2. Run unit & component tests
npm run test

# 3. Production bundle compilation & image optimization
npm run build

# 4. End-to-end browser user flows
npx playwright test --project=chromium

# 5. Sanity CMS dataset & schema health audit
python .agents/tools/audit_sanity.py
```

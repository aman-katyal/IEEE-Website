#!/usr/bin/env python3
"""
scripts/create_30_issues.py - Batch create 30 canonical, high-value GitHub issues for Purdue IEEE Website.
"""

import os
import sys
import subprocess
from pathlib import Path

# Add .agents/tools to sys.path so we can import gh_tool
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / ".agents" / "tools"))

from gh_tool.gh import create_issue, list_issues
from gh_tool.classifier import classify_all
from gh_tool.validator import validate_issue

ISSUES_DATA = [
    # --- Group 1: BoilerBooks 3.0 & Financial Architecture (6 issues) ---
    {
        "title": "[FEATURE]: Add CSV and Excel spreadsheet export for Treasurer transaction ledgers",
        "priority": "medium",
        "status": "ready",
        "body": """## Problem Statement
Currently, treasurers can view and copy the raw Purdue COOL text batch, but cannot export transaction ledgers or committee balance matrices into standard CSV/XLSX spreadsheets for external audits and financial reporting.

## Proposed Solution
Add an 'Export to CSV' and 'Export to Excel' action button to the Treasurer Master Spending Matrix and Purchases Ledger in `TreasurerFinanceView.tsx`. Use client-side blob generation to download clean, formatted spreadsheets containing all transaction dates, committee IDs, categories, vendor names, amounts, and statuses.

## Acceptance Criteria
- [ ] 'Export CSV' button in Treasurer Master Spending Matrix table
- [ ] 'Export CSV' button in Purchases Ledger table
- [ ] Exports contain clean column headers: Transaction ID, Date, Committee, Category, Vendor, Amount, Status, Receipt URL
- [ ] Unit tests in `TreasurerFinanceView.test.tsx` verify export triggering
"""
    },
    {
        "title": "[FEATURE]: Add multi-receipt attachment support and preview modal in BoilerBooks purchase requests",
        "priority": "medium",
        "status": "ready",
        "body": """## Problem Statement
When committees submit complex reimbursement requests involving multiple itemized receipts (e.g. DigiKey, McMaster-Carr, Amazon), the current form only accepts a single file attachment, forcing leads to merge PDFs manually.

## Proposed Solution
Update `BosoReimbursementFormModal.tsx` and Cloudflare `/api/finance/purchases/upload` to accept multiple file attachments (up to 5 receipts/invoices). Store file metadata arrays in Cloudflare D1 and add an inline carousel preview modal so treasurers can review receipts directly within the portal.

## Acceptance Criteria
- [ ] Multi-file dropzone supports up to 5 image/PDF files simultaneously
- [ ] File metadata stored as JSON array in `receipt_urls`
- [ ] Image/PDF preview modal for treasurers with zoom and pan capabilities
- [ ] Unit tests for multi-file dropzone in `BosoReimbursementFormModal.test.tsx`
"""
    },
    {
        "title": "[FEATURE]: Add automatic budget threshold email alerts when committee spending reaches 85%",
        "priority": "low",
        "status": "ready",
        "body": """## Problem Statement
Committee leads and treasurers lack proactive notifications when committee spending nears allocated limits, leading to potential accidental overspending during project crunch periods.

## Proposed Solution
Create a Cloudflare Worker background cron or post-approval trigger that checks committee remaining balances. When total spending exceeds 85% of allocated funds (or exceeds 100%), automatically trigger an alert email to the treasurer and committee leadership via Mailgun or Resend API.

## Acceptance Criteria
- [ ] Automatic threshold calculation upon reimbursement approval
- [ ] Email notification sent when spending reaches 85% and 100%
- [ ] Visual indicator / warning banner in `CommitteeFinanceView.tsx` when over 85%
- [ ] Unit tests verify threshold calculation logic
"""
    },
    {
        "title": "[FEATURE]: Support multi-category itemized line items in BoilerBooks purchase requests",
        "priority": "medium",
        "status": "ready",
        "body": """## Problem Statement
A single purchase from a distributor like Amazon or McMaster-Carr often contains items across multiple categories (e.g., Hardware, Consumables, Safety Equipment, Shipping). The current portal only assigns one category per purchase.

## Proposed Solution
Add an dynamic line-item builder in `BosoReimbursementFormModal.tsx` allowing requesters to split an invoice into multiple line items with distinct categories and costs. Calculate the overall purchase total dynamically and store line items in a relational `purchase_items` D1 table.

## Acceptance Criteria
- [ ] Requesters can add/remove line items with Category, Description, and Amount
- [ ] Running subtotal and tax calculation validated against receipt total
- [ ] Master Spending Matrix accurately attributes split line items to category totals
- [ ] Unit test coverage in `purchase.test.ts`
"""
    },
    {
        "title": "[UI/UX]: Add pagination and date-range filtering to Treasurer master transaction table",
        "priority": "medium",
        "status": "ready",
        "body": """## Current State
The Treasurer Master Spending Matrix renders all purchase requests in a single uninterrupted table. As transaction counts grow across the academic year, the DOM node count will impact scrolling performance.

## Requested Changes
Implement client-side pagination (15 / 30 / 50 rows per page) and a date-range picker filter (e.g. 'This Month', 'Fall 2025', 'Spring 2026', 'Custom') to quickly isolate transactions.

## Acceptance Criteria
- [ ] Pagination controls with next, previous, and page size selector
- [ ] Date-range dropdown filtering transactions by semester or custom dates
- [ ] Clean empty state when no transactions match active date filter
- [ ] Unit test in `TreasurerFinanceView.test.tsx` verifying pagination logic
"""
    },
    {
        "title": "[CHORE]: Implement rate-limiting and audit logging on /api/finance/auth/verify-pin Cloudflare endpoint",
        "priority": "high",
        "status": "ready",
        "body": """## Description
To protect committee and treasurer PINs against automated brute-force attempts on Cloudflare Workers, we need rate-limiting and audit logging on `/api/finance/auth/verify-pin`.

## Requested Changes
1. Implement Cloudflare Rate Limiting binding (max 5 failed attempts per IP per 15 minutes).
2. Return HTTP 429 Too Many Requests with `Retry-After` header when limit is exceeded.
3. Log failed authentication attempts with timestamp and obfuscated committee ID in Cloudflare D1 `auth_audit_log` table.

## Acceptance Criteria
- [ ] Rate limiting triggers on 5 consecutive invalid PIN attempts
- [ ] HTTP 429 error returned with clear user-facing lockout message
- [ ] D1 audit log table populated on auth failures
- [ ] Unit tests for rate limiter middleware
"""
    },

    # --- Group 2: Accessibility & WCAG 2.2 AA Compliance (5 issues) ---
    {
        "title": "[A11Y]: Add Skip to Main Content keyboard shortcut link across all routes",
        "priority": "high",
        "status": "ready",
        "body": """## Issue Description
Keyboard and screen reader users must tab through the entire navigation bar and social links before reaching the primary page content, failing WCAG 2.2 AA Guideline 2.4.1 (Bypass Blocks).

## Requested Changes
Add a visually hidden 'Skip to main content' anchor at the top of `Layout.tsx` that receives focus on first Tab press and scrolls directly to `<main id=\"main-content\">`.

## Acceptance Criteria
- [ ] 'Skip to main content' button appears on first Tab press
- [ ] Pressing Enter shifts focus smoothly to `<main id=\"main-content\">`
- [ ] Styled with high-contrast Cyber Gold focus ring
- [ ] Unit test in `Layout.test.tsx` verifies link rendering and target
"""
    },
    {
        "title": "[A11Y]: Implement focus trapping and ESC key dismissal in custom Dialog and Modal components",
        "priority": "high",
        "status": "ready",
        "body": """## Issue Description
Several modals (such as `BosoReimbursementFormModal.tsx` and `RecordInflowModal.tsx`) do not strictly trap keyboard focus within the dialog, allowing users to tab out into background obscured page elements.

## Requested Changes
Wrap all custom modal overlays with Radix UI `Dialog.Root` or `FocusScope` with `trapped={true}`. Ensure `ESC` key dismisses the active modal and returns focus to the trigger button.

## Acceptance Criteria
- [ ] Tab and Shift+Tab cycle exclusively within open modal content
- [ ] ESC key cleanly closes the active modal
- [ ] Focus returns to triggering button upon dismissal
- [ ] Automated keyboard navigation tests in Vitest
"""
    },
    {
        "title": "[A11Y]: Ensure all committee and project icons have descriptive aria-label attributes for screen readers",
        "priority": "medium",
        "status": "ready",
        "body": """## Issue Description
Decorative and functional SVG icons across committee project cards, officer social links, and the hero telemetry rack lack consistent `aria-hidden=\"true\"` or descriptive `aria-label` attributes.

## Requested Changes
Audit all Lucide icon usages across `src/app/components/`. Add `aria-hidden=\"true\"` to decorative icons and explicit `aria-label` or `<VisuallyHidden>` text to standalone icon buttons.

## Acceptance Criteria
- [ ] Zero unlabelled interactive icon buttons reported by axe / accessibility tree
- [ ] All decorative icons marked with `aria-hidden=\"true\"`
- [ ] Social links have descriptive text (e.g. \"Visit Purdue IEEE on GitHub\")
- [ ] Unit test validation in `CommitteeProjects.test.tsx`
"""
    },
    {
        "title": "[A11Y]: Audit color contrast on muted subheadings in light mode to meet 4.5:1 WCAG AA standard",
        "priority": "medium",
        "status": "ready",
        "body": """## Issue Description
In light mode (`.light`), some secondary metadata text using `var(--text-muted)` measures below the required 4.5:1 contrast ratio against light backgrounds (`#F8FAFC`).

## Requested Changes
Update `--text-muted` and `--text-secondary` light mode token definitions in `src/styles/ieee.css` and `src/styles/theme.css` to darker slate shades (`#334155` and `#475569`) ensuring a minimum 5.0:1 contrast ratio across all light mode cards and tables.

## Acceptance Criteria
- [ ] Contrast ratio for all text exceeds 4.5:1 (normal text) and 3.0:1 (large text) in light mode
- [ ] Automated contrast audit passes in Playwright
- [ ] Verified visually in both dark and light modes
"""
    },
    {
        "title": "[A11Y]: Add aria-live polite announcements on dynamic filter updates in CommitteesPage",
        "priority": "low",
        "status": "ready",
        "body": """## Issue Description
When users toggle between 'All Committees', 'Technical Committees', and 'Cornerstone Committees' on `/committees`, screen readers do not announce the updated count of displayed committees.

## Requested Changes
Add an `aria-live=\"polite\"` region in `CommitteesPage.tsx` announcing the filtered count (e.g. \"Showing 9 technical committees\").

## Acceptance Criteria
- [ ] Screen readers announce filtered result count upon toggle change
- [ ] `aria-live=\"polite\"` and `aria-atomic=\"true\"` configured on container
- [ ] Unit test in `CommitteesPage.test.tsx` checks live region updates
"""
    },

    # --- Group 3: Performance, Web Vitals & Caching (5 issues) ---
    {
        "title": "[TASK]: Implement Service Worker with stale-while-revalidate caching for Sanity images and CDN assets",
        "priority": "medium",
        "status": "ready",
        "body": """## Description
Sanity CDN images and static assets are repeatedly fetched over the network on subsequent page visits. A lightweight Service Worker with stale-while-revalidate strategy will speed up subsequent page transitions and provide offline resilience.

## Requested Changes
1. Register a lightweight Service Worker caching `cdn.sanity.io` image responses with cache expiry.
2. Cache static font files and SVG logos.
3. Configure cache cleanup on service worker activation.

## Acceptance Criteria
- [ ] Subsequent visits load cached Sanity images in < 50ms
- [ ] Cache size limited to 50MB with LRU eviction
- [ ] Cloudflare Pages build succeeds with SW registration
"""
    },
    {
        "title": "[TASK]: Preload critical Space Grotesk and IBM Plex Sans font files in index.html",
        "priority": "high",
        "status": "ready",
        "body": """## Description
Font loading causes minor layout shifts (CLS) and FOIT (Flash of Invisible Text) during initial render before Google Fonts stylesheets load.

## Requested Changes
Add `<link rel=\"preload\" as=\"font\" type=\"font/woff2\" crossorigin>` tags in `index.html` for primary weights of Space Grotesk and IBM Plex Sans, accompanied by `font-display: swap` in `@font-face` definitions.

## Acceptance Criteria
- [ ] Font files preloaded before CSS bundle execution
- [ ] Zero layout shift (CLS < 0.05) on initial load
- [ ] Production build verified in `index.html`
"""
    },
    {
        "title": "[FEATURE]: Add Core Web Vitals (LCP, FID/INP, CLS) reporting hook to Cloudflare Analytics",
        "priority": "low",
        "status": "ready",
        "body": """## Problem Statement
We currently lack production telemetry on real-world Core Web Vitals (Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift) across student mobile and desktop devices.

## Proposed Solution
Create a lightweight React hook `useWebVitals()` using the `web-vitals` library that samples performance metrics and beacons them to a Cloudflare Worker analytics endpoint (`/api/analytics/vitals`).

## Acceptance Criteria
- [ ] Collects LCP, INP, CLS, FCP, and TTFB metrics
- [ ] Uses `navigator.sendBeacon` for non-blocking reporting
- [ ] No performance overhead on main rendering loop
- [ ] Unit tests for `useWebVitals()` hook
"""
    },
    {
        "title": "[TASK]: Lazy load Lucide React icon imports or optimize bundle chunk tree",
        "priority": "medium",
        "status": "ready",
        "body": """## Description
Lucide React icons currently contribute to the initial main JS bundle chunk. Optimizing icon tree-shaking will reduce the initial bundle footprint.

## Requested Changes
Configure Vite tree-shaking or explicit subpath imports (e.g., `lucide-react/dist/esm/icons/...`) or dynamic icon wrappers for rarely used icons in admin/portal views.

## Acceptance Criteria
- [ ] Main bundle size reduced by at least 15kB
- [ ] Production build passes without module resolution issues
- [ ] All icon components render correctly across pages
"""
    },
    {
        "title": "[FEATURE]: Implement route prefetching on hover for main navigation links",
        "priority": "low",
        "status": "ready",
        "body": """## Problem Statement
Route transitions to `/committees`, `/officers`, and `/finance` wait for chunk download on click, causing a 100-200ms latency before page render.

## Proposed Solution
Add an `onMouseEnter` / `onFocus` prefetch trigger to `<NavLink>` in `Navigation.tsx` that initiates dynamic `import()` of target page chunks before the user finishes clicking.

## Acceptance Criteria
- [ ] Route chunks preloaded on link hover/focus
- [ ] Instantaneous page transition on click (< 50ms)
- [ ] No redundant downloads if route is already cached
"""
    },

    # --- Group 4: Sanity CMS Studio & Schema Engineering (5 issues) ---
    {
        "title": "[FEATURE]: Add Sanity document badge showing last modified timestamp and editor user",
        "priority": "low",
        "status": "ready",
        "body": """## Problem Statement
When multiple officers edit content in Sanity Studio, it is difficult to see at a glance who made recent updates and when a committee page was last modified.

## Proposed Solution
Create a custom Sanity document badge component (`LastUpdatedBadge.tsx`) in `studio/` displaying the relative last modified time (e.g. 'Updated 2 days ago') and publishing author in the document header.

## Acceptance Criteria
- [ ] Document badge displayed on all document types (committee, leader, aboutPage, partner)
- [ ] Displays human-readable relative time string
- [ ] Studio builds and deploys cleanly via `npx sanity deploy`
"""
    },
    {
        "title": "[FEATURE]: Add custom Sanity visual preview component for Committee page color themes",
        "priority": "medium",
        "status": "ready",
        "body": """## Problem Statement
When configuring committee theme colors (e.g., Cyber Gold, Electric Blue, Emerald Green, Crimson Red), content editors in Sanity Studio must publish and inspect the live website to see how the palette renders.

## Proposed Solution
Create a custom React preview component (`ThemeColorPreview.tsx`) in `studio/schema/objects/` that renders a live miniature card preview showing the selected accent color, gradient borders, and contrast against dark backgrounds.

## Acceptance Criteria
- [ ] Live preview updates in real-time as editor selects color options
- [ ] Displays simulated button, badge, and card header
- [ ] Studio unit tests in `studio/schema/` pass
"""
    },
    {
        "title": "[FEATURE]: Add committee meeting schedules (day, time, room) schema and UI rendering",
        "priority": "high",
        "status": "ready",
        "body": """## Problem Statement
Incoming students looking to join technical committees need to know regular meeting times and room locations (e.g. 'Tuesdays 6:30 PM @ EE 129'). This information is currently scattered.

## Proposed Solution
1. Add `meetingSchedule` object field to `studio/schema/committee.ts` with fields: `dayOfWeek`, `time`, `location`, `frequency`, and `notes`.
2. Update `src/data/committees/types.ts` and GROQ projection in `useSanityData.ts`.
3. Render a 'Meeting Schedule' info chip in `CommitteeDetailPage.tsx` and committee hover cards.

## Acceptance Criteria
- [ ] Sanity schema supports structured meeting times and locations
- [ ] Committee detail page dynamically renders meeting schedule chip
- [ ] Fallback handling when meeting schedule is omitted (zero mock text)
- [ ] Unit test in `CommitteeDetailPage.test.tsx`
"""
    },
    {
        "title": "[FEATURE]: Support custom Discord invite links and committee linktrees in Sanity schema",
        "priority": "medium",
        "status": "ready",
        "body": """## Problem Statement
Several committees maintain dedicated committee Discord channels, Linktrees, and Notion wikis. Currently, the website hardcodes or omits these unique URLs.

## Proposed Solution
Add an array of `resourceLinks` in `studio/schema/committee.ts` (title, URL, icon platform: discord, github, notion, linktree, website) and project them in `CommitteeDetailPage.tsx`.

## Acceptance Criteria
- [ ] Sanity schema allows arbitrary named resource links per committee
- [ ] Clean social icon rendering in committee detail hero section
- [ ] Safe external link attributes (`rel=\"noopener noreferrer\"`)
- [ ] Unit tests for resource link list rendering
"""
    },
    {
        "title": "[CHORE]: Add schema validation rule ensuring committee slugs match sanitized lowercase names",
        "priority": "medium",
        "status": "ready",
        "body": """## Description
To prevent broken routing from manual typos in Sanity Studio (e.g., uppercase letters or spaces in committee slug IDs), add a strict slug validation rule.

## Requested Changes
Update `slug` field validation in `studio/schema/committee.ts` with regex ensuring slug matches `^[a-z0-9-]+$` and does not contain leading/trailing dashes.

## Acceptance Criteria
- [ ] Slugs with uppercase letters or invalid characters trigger Sanity validation error
- [ ] Automatic slug generation from committee name produces clean kebab-case
- [ ] Unit test in `studio/schema/leader.test.ts` validates slug rule
"""
    },

    # --- Group 5: UI Polish, Micro-interactions & Toast System (5 issues) ---
    {
        "title": "[UI/UX]: Implement global Toast notification system via Radix UI Toast for copied links and PIN alerts",
        "priority": "medium",
        "status": "ready",
        "body": """## Current State
When users copy COOL batch text, copy committee URLs, or encounter network errors, alerts are handled via browser `alert()` or inline text banners.

## Requested Changes
Implement a polished Radix UI Toast provider (`ToastProvider`, `useToast`) with Cyber Gold / Electric Blue styling, smooth Framer Motion entry, and auto-dismissal after 3.5s.

## Acceptance Criteria
- [ ] Toast notifications for 'Copied to clipboard', 'Settings Saved', and 'Network Error'
- [ ] Accessible with `role=\"status\"` and screen reader announcements
- [ ] Positioned at bottom-right on desktop, bottom-center on mobile
- [ ] Unit test in `Toast.test.tsx`
"""
    },
    {
        "title": "[UI/UX]: Add subtle magnetic physics fallback and smooth spring animations to mobile CTA buttons",
        "priority": "low",
        "status": "ready",
        "body": """## Current State
`MagneticButton.tsx` and `MagneticWrapper.tsx` provide delightful desktop hover physics, but are inactive on mobile touch devices.

## Requested Changes
Add subtle active scale micro-interactions (`whileTap={{ scale: 0.96 }}`) on mobile devices when pointer is touch, maintaining consistent tactile feedback across devices.

## Acceptance Criteria
- [ ] Clean tap animation on touch devices without layout disruption
- [ ] Framer Motion spring physics with `damping: 15`
- [ ] Performance test passes in `MagneticButton.perf.test.tsx`
"""
    },
    {
        "title": "[UI/UX]: Add back-to-top floating scroll button with progressive scroll indicator",
        "priority": "low",
        "status": "ready",
        "body": """## Current State
On long pages such as `/constitution`, `/officers`, and `/committees`, returning to the top navigation requires extensive scrolling on mobile.

## Requested Changes
Add a floating back-to-top button that appears when user scrolls past 400px, featuring a circular SVG progress indicator showing page scroll percentage.

## Acceptance Criteria
- [ ] Button fades in smoothly after scrolling 400px down
- [ ] Clicking scrolls smoothly to `window.scrollTo({ top: 0, behavior: 'smooth' })`
- [ ] Circular ring displays current scroll percentage
- [ ] Respects `prefers-reduced-motion`
"""
    },
    {
        "title": "[UI/UX]: Standardize all modal backdrop blur and entry animations with Radix UI and Framer Motion",
        "priority": "medium",
        "status": "ready",
        "body": """## Current State
Different dialogs across the application use slight variations of backdrop blur (`backdrop-blur-sm` vs `backdrop-blur-md`) and custom opacity transitions.

## Requested Changes
Create a unified `ModalOverlay` and `ModalContent` wrapper ensuring all modals share identical backdrop blur (`backdrop-blur-md bg-black/60`), spring entry animations, and border tokens.

## Acceptance Criteria
- [ ] Consistent backdrop blur and timing across all finance and detail modals
- [ ] Smooth entry scale (0.95 -> 1.0) and exit animation
- [ ] Zero backdrop glitching during rapid open/close
"""
    },
    {
        "title": "[UI/UX]: Add breadcrumbs navigation component on committee and resource detail pages",
        "priority": "medium",
        "status": "ready",
        "body": """## Current State
When deep-linking to a committee page (e.g. `/committees/rov`), users lack a clear breadcrumb trail to navigate back to the parent committees directory.

## Requested Changes
Add an accessible `<Breadcrumbs>` component at the top of detail pages rendering `Home > Committees > ROV` with structured Schema.org JSON-LD breadcrumb metadata.

## Acceptance Criteria
- [ ] Breadcrumbs render on all committee detail pages
- [ ] Uses semantic `<nav aria-label=\"Breadcrumbs\">` and `<ol>` tags
- [ ] JSON-LD breadcrumb schema embedded in document head for SEO
- [ ] Unit test in `Breadcrumbs.test.tsx`
"""
    },

    # --- Group 6: Testing, CI/CD & Developer Experience (4 issues) ---
    {
        "title": "[FEATURE]: Add Playwright E2E visual regression snapshots for Finance Portal treasurer and committee views",
        "priority": "medium",
        "status": "ready",
        "body": """## Problem Statement
Visual styling regressions in the Finance Portal (spending matrix, inflow modals, reimbursement forms) can go unnoticed without automated visual regression snapshots.

## Proposed Solution
Add Playwright visual regression tests (`tests/e2e/finance-portal.spec.ts`) capturing pixel-level snapshots of authenticated Committee Lead and Treasurer views across desktop (1280px) and mobile (375px) viewports.

## Acceptance Criteria
- [ ] Playwright visual regression suite runs locally via `npx playwright test`
- [ ] Covers Login Modal, Committee View, and Treasurer Matrix
- [ ] Masks dynamic dates to prevent false-positive diffs
"""
    },
    {
        "title": "[FEATURE]: Add unit tests for BoilerBooks PIN hashing and PBKDF2 authentication utilities",
        "priority": "high",
        "status": "ready",
        "body": """## Problem Statement
The CLI PIN setting script and Web Crypto PBKDF2 hashing routines in `src/server/auth/` require dedicated unit tests validating edge cases (passphrase lengths, salt generations, iteration counts).

## Proposed Solution
Add comprehensive Vitest unit tests in `src/server/auth/crypto.test.ts` verifying key derivation, salt randomness, timing-safe comparison, and error handling for malformed hashes.

## Acceptance Criteria
- [ ] 100% test coverage on PBKDF2 hash generation and verification functions
- [ ] Timing-safe comparison validation
- [ ] Tests execute in < 200ms in `npm test`
"""
    },
    {
        "title": "[CHORE]: Add visual bundle size analyzer (rollup-plugin-visualizer) to npm run build:analyze",
        "priority": "low",
        "status": "ready",
        "body": """## Description
To keep production JavaScript bundles under strict budget limits, developers need a visual treemap showing exact module contributions to client chunks.

## Requested Changes
Install `rollup-plugin-visualizer` and configure an optional `npm run build:analyze` script generating an interactive `dist/stats.html` bundle map.

## Acceptance Criteria
- [ ] `npm run build:analyze` produces `stats.html` bundle treemap
- [ ] No impact on standard production `npm run build`
- [ ] Package added to devDependencies
"""
    },
    {
        "title": "[CHORE]: Add git commit linting and conventional commit validation hook via standard CLI tooling",
        "priority": "medium",
        "status": "ready",
        "body": """## Description
To ensure all repository commits consistently adhere to conventional commit standards (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`) per `GEMINI.md` Rule 12, add a local commit-msg validation check.

## Requested Changes
Add a lightweight PowerShell/Bash pre-commit/commit-msg hook validating commit message prefixes before commits are finalized.

## Acceptance Criteria
- [ ] Rejects commits missing conventional prefix (`feat:`, `fix:`, `refactor:`, etc.)
- [ ] Helpful CLI error message guiding developers on expected format
- [ ] Works seamlessly across Windows pwsh and Unix shells
"""
    },
]

from gh_tool.gh import create_issue, list_issues
from gh_tool.classifier import classify_all

def main():
    print(f"🚀 Starting batch creation of {len(ISSUES_DATA)} canonical GitHub issues...\n")
    
    # Get existing issues to verify no duplicates
    existing = list_issues("all")
    print(f"Found {len(existing)} existing issues in repository.\n")

    created_count = 0
    for idx, item in enumerate(ISSUES_DATA, 1):
        title = item["title"]
        body = item["body"].strip()
        priority = item["priority"]
        status = item["status"]

        print(f"[{idx}/{len(ISSUES_DATA)}] Creating: {title} ...")

        labels_dict = classify_all(title, body)
        type_lbl = labels_dict["type"]["label"]
        area_lbl = labels_dict["area"]["label"]
        pri_lbl = f"priority:{priority}" if priority else labels_dict["priority"]["label"]
        stat_lbl = f"status:{status}" if status else labels_dict["status"]["label"]

        labels_list = [type_lbl, pri_lbl, stat_lbl, area_lbl]

        # Create issue
        created = create_issue(title, body, labels_list)
        if created and created.get("number"):
            created_count += 1
            print(f"    ✅ Issue #{created.get('number')}: {created.get('url')}")
            print(f"       Labels: {', '.join(labels_list)}\n")
        else:
            print(f"    ❌ Failed to create issue: {title}\n")

    print(f"\n🎉 Successfully created {created_count} / {len(ISSUES_DATA)} GitHub issues!")

if __name__ == "__main__":
    main()

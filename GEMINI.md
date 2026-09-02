




# Purdue IEEE Website - Project Overview

This is the official website for the **Purdue University IEEE Student Branch**, built as a modern, high-performance React application. It serves as an informational hub for technical committees, leadership, and resources for the branch.

## 🚀 Tech Stack

- **Framework:** React 19 with Vite
- **Language:** TypeScript
- **Routing:** React Router 7 (Client-side routing)
- **Styling:** 
  - **Tailwind CSS v4** for utility-first styling.
  - **CSS Variables** (`src/styles/theme.css`, `src/styles/ieee.css`) for the design system.
  - **Radix UI** primitives for accessible components.
- **Animations:** **Framer Motion** (`motion/react`) for page transitions and interactive elements.
- **Theme Management:** `next-themes` for Dark/Light mode support.
- **Icons:** `lucide-react`.

## 📂 Project Structure

- `src/app/pages/`: Contains full-page components (Home, Committees, About, etc.).
- `src/app/components/`: Modular, reusable UI components.
- `src/app/components/ui/`: Low-level, accessible UI primitives based on Radix UI.
- `src/data/`: Centralized TypeScript interfaces, routes, and calendar configs.
  - `committees/types.ts`: Detailed TS typings for technical committee schemas.
  - `leadership.ts`: Types for branch officer and leader roles.
- `studio/`: Custom Sanity Studio schema configurations and CMS document desk rules.
- `src/styles/`: Global styles and design system tokens.
- `public/documents/`: Governance documents (Constitution, Bylaws) and other resources.
- `public/images/`: Organized static image assets.

## 🛠️ Building and Running

### Development
To start the local development server:
```bash
npm install
npm run dev
```

### Production
To generate a production build:
```bash
npm run build
```
The output will be in the `dist` directory.
### Cloudflare Pages Deployment
The project is configured for serverless deployment on **Cloudflare Pages**.

To deploy to Cloudflare Pages:
1. Deploy the compiled assets:
   ```bash
   npx wrangler deploy
   ```
2. The deployment directory (`dist/`) is read and uploaded automatically.

## 📜 Development Conventions

1.  **Functional Components:** Use functional components with hooks.
2.  **TypeScript:** Maintain strict typing throughout the codebase, especially for data structures in `src/data/`.
3.  **Strict CMS-Driven Content & Zero Hardcoding (MANDATORY):**
    - **Zero In-Component Static Data Arrays**: NEVER declare hardcoded data arrays, milestone lists, feature cards, or mock text directly inside `.tsx` components or data files.
    - **Schema-First Workflow**: For every new content section (timelines, quotes, cards, archives):
      1. Define the Sanity schema (`studio/schema/`) and deploy/register in `schemaTypes`.
      2. Declare TypeScript interfaces in `src/data/sanity-types.ts`.
      3. Fetch via GROQ projection in `src/hooks/useSanityData.ts`.
      4. Conditionally render in UI only when populated from CMS (`data?.field && data.field.length > 0`).
    - If CMS returns `null` or empty arrays, render nothing or clean empty state—never hardcoded fallback content.
4.  **Accessibility:** Utilize Radix UI primitives in `src/app/components/ui/` to ensure high accessibility standards.
5.  **Styling:** Prefer Tailwind CSS utility classes. For complex or brand-specific styling, use the pre-defined CSS variables in `src/styles/`.
6.  **Page Transitions:** Use the `<PageTransition>` component (wrapper around Framer Motion) for smooth navigation between routes.
7.  **Responsive Design:** Ensure all components are mobile-friendly using Tailwind's responsive prefixes.
8.  **Sanity Image URL Safety:** Before appending query parameters (e.g., `?w=1400`) to Sanity CDN URLs in components, inspect `url.includes('?')` to prevent generating malformed double-query parameters.
9.  **TypeScript 7.0 Alignment:** Keep `tsconfig.json` free of deprecated options like `baseUrl` or `ignoreDeprecations`. Use explicit relative path aliases (`"@/*": ["./src/*"]`).
10. **Sanity Studio Schema Workflow:** Whenever schemas in `studio/schema/` are modified, always build (`cd studio && npm run build`) and deploy the updated studio to Sanity (`npx sanity deploy`).
11. **Strict GitHub Issue & PR Workflow (MANDATORY):**
    - **NEVER** run bare/raw `gh issue create`, `gh issue list`, `gh pr create` commands directly.
    - **ALWAYS** execute commands via the repository Python tool: `python -m gh_tool <issue|pr|label> ...` (under `.agents/tools/`) or via `npm run issue:*` / `npm run pr:*` scripts.
    - All issues MUST adhere to the 4-dimension label taxonomy (`type:`, `priority:`, `status:`, `area:`) and required Markdown template sections validated by `python -m gh_tool issue lint`.
12. **Atomic Commits After Every Change (MANDATORY):**
    - Create a git commit immediately after completing every discrete change, bugfix, or sub-task.
    - Use clear, conventional commit messages (e.g., `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`, `chore: ...`) referencing the relevant issue number (e.g., `fix(committees): resolve image path (#72)`).
    - Never leave accumulated uncommitted edits across multiple tasks.
13. **Branch Pruning & Cleanup (MANDATORY):**
    - Always delete local and remote branches immediately upon merging PRs or closing issues (`git branch -d <branch>`, `git remote prune origin`, `npm run branch:prune`).
    - Keep git workspace clean with zero stale feature branches lingering after completion.
14. **Direct Issue Closing & Visual Screenshot Verification (MANDATORY):**
    - For any visual, styling, layout, or interactive UI issue, the agent **MUST** capture and inspect a Playwright browser screenshot (including hover/active states) before closing.
    - For issues conclusively verified independently via screenshot, unit tests, and build checks, **directly close the issue** with a completion comment detailing the verification.
    - Only leave in `status:awaiting-review` if human verification/copy sign-off is genuinely required.
15. **Production Benchmarks & Optimization Checklist (MANDATORY):**
    - Adhere strictly to the targets in `PRODUCTION_STANDARDS.md` (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, WCAG 2.2 AA accessibility, zero bundle secrets, canonical SEO metadata).
    - Always validate changes through the 5-step suite (`tsc`, `vitest`, `vite build`, `playwright`, `audit_sanity.py`).
16. **Zero Mock / Fake Status Indicators (MANDATORY):**
    - All committees and branches on the website are active by default. Never introduce hardcoded mock operational statuses (e.g. "RUNNING", "STABLE", "ACTIVE", "ONLINE") or fake status indicator dots.
    - When deprecating status fields, ensure complete removal across all components, hero bento grids, and ticker racks.
17. **Proactive Issue Creation (MANDATORY):**
    - After conducting a codebase audit or identifying new actionable tasks, bugs, or feature ideas, the agent MUST proactively summarize them and explicitly offer to batch-create the corresponding GitHub issues.
    - If the user approves, leverage the `github-issues` skill (using `python -m gh_tool issue create` or `npm run issue:create`) to instantly file them with canonical labels.
18. **Periodic Progress Checkpoints (MANDATORY):**
    - When executing batches of tasks or working through multiple issues, provide a structured check-in every 1–2 issues.
    - Summarize completed changes, verification results (`tsc`, `vitest`, `vite build`), and next intended actions before proceeding.
19. **Standardized Tooling Over Ad-hoc Scripts (MANDATORY):**
    - **NEVER** write one-off scratch, runner, or temporary data scripts anywhere (in `scripts/`, workspace roots, or internal scratch folders) for API queries, CMS mutations, database operations, issue management, or builds.
    - **ALWAYS** invoke existing repository tooling (`python -m gh_tool`, `npm run issue:*`, `npm run pr:*`, `npm run branch:prune`) or execute direct inline commands (`node --input-type=module -e "..."`, `npx wrangler`, `npx sanity`) without creating files on disk.
    - For batch issue creation, **ALWAYS** use native batch tooling: `python -m gh_tool issue create --batch <file.json|->` or `npm run issue:create -- --batch <file.json>`. Never author ad-hoc `.py` batch creation scripts.
20. **Zero GitHub Actions / Workflows (MANDATORY):**
    - **NEVER** create, commit, or configure `.github/workflows/` files.
    - All compilation, test suites, bundle builds, PR linting, and issue validation MUST run 100% locally via CLI (`npx tsc`, `npm test`, `npm run build`, `python -m gh_tool`).
21. **Cloudflare Pages Functions Build Verification (MANDATORY):**
    - Whenever modifications are made to `functions/` (Cloudflare Pages API gateway) or backend services in `src/server/`, the agent MUST execute `npx wrangler pages functions build` alongside `npx tsc --noEmit && npm test && npm run build` to verify Cloudflare Worker bundling succeeds before committing.
    - Redundant `_redirects` SPA rewrite rules must never be committed alongside `wrangler.jsonc` `"not_found_handling": "single-page-application"` to prevent Cloudflare redirect loops.
22. **Continuous Self-Improvement of Repository Tooling & Skills (MANDATORY):**
    - When encountering limitations, friction, papercuts, or missing capabilities in repository tooling (`.agents/tools/`, `scripts/`) or skills (`.agents/skills/`), the agent MUST proactively diagnose and enhance the tooling or skill directly rather than relying on brittle manual workarounds.
    - Examples include: fixing output buffering in CLI tools, expanding classification heuristics in `gh_tool`, refining error messages, or documenting newly discovered edge cases in relevant `SKILL.md` runbooks.
    - Any tooling or skill modification must be accompanied by clean verification (`tsc`, unit tests, or test dry-runs) and an atomic git commit.

## 🏛️ Three Tiers of Customization

To maintain strict codebase hygiene and prevent context bloating, repository knowledge is structured across three distinct tiers:

1. **Tier 1 — Invariant Rules (`GEMINI.md`):**
   * High-level, non-negotiable constraints injected on every prompt (e.g. Zero GitHub Actions, atomic commits, strict typing).
   * Kept strictly concise, high-signal, and free of procedural code/scripts.
2. **Tier 2 — Modular Skills (`.agents/skills/<name>/SKILL.md`):**
   * Step-by-step procedures, cheatsheets, and domain-specific workflows loaded dynamically only when relevant (e.g. `github-issues`, `boilerbooks-finance`, `ui-ux-testing`).
3. **Tier 3 — Deterministic Tools (`.agents/tools/` & `scripts/`):**
   * Tested, executable Python/CLI scripts (e.g. `gh_tool`, `audit_sanity.py`, migration runners) ensuring consistent execution without ad-hoc guesswork.

## 📁 Key Files

- `src/app/App.tsx`: Main routing and theme provider setup.
- `src/app/components/Layout.tsx`: Common layout wrapper (Header, Footer, Navigation).
- `src/hooks/useSanityData.ts`: React hooks used to query optimized dataset payloads from Sanity.
- `studio/schema/`: Local definitions for Sanity CMS document and object types.
- `vite.config.ts`: Vite configuration with Tailwind CSS v4 and image optimizer plugins.
- `PRODUCTION_STANDARDS.md`: Official production launch, benchmarking, and optimization reference.

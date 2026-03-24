# Implementation Plan: Security & Deployment Audit

## Phase 1: Security Audit & Vulnerability Scanning [checkpoint: 2b0b446]
Address and identify existing security issues in the codebase and dependencies.

- [x] Task: Conduct a thorough vulnerability scan of project dependencies using `npm audit`. 25ee8a2
    - [x] Run `npm audit` and document the number of high and critical vulnerabilities found. (Result: 0 High, 0 Critical, 1 Moderate in Vite)
- [x] Task: Perform a scan for hardcoded secrets and API keys throughout the repository. 8f653ca
    - [x] Use `grep_search` or specialized tools to find hardcoded credentials.
    - [x] Identify all occurrences of the **Google Calendar API Key** and any other sensitive tokens. (Found: `src/data/calendarConfig.ts`)
- [x] Task: Execute Static Application Security Testing (SAST) on the source code. 8f653ca
    - [x] Identify common security pitfalls such as insecure data handling or configuration. (Result: No critical issues; `dangerouslySetInnerHTML` used safely in `chart.tsx` for CSS)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Security Audit & Vulnerability Scanning' (Protocol in workflow.md) 2b0b446

## Phase 2: Secret Migration & Environment Configuration [checkpoint: be54b1a]
Migrate hardcoded secrets to a secure environment variable setup.

- [x] Task: Write a unit test to verify that sensitive configuration is loaded from environment variables. 0a2cf60
    - [x] Ensure that the component or utility responsible for Google Calendar integration retrieves its key from `import.meta.env`.
- [x] Task: Create and configure environment variable files. 0a2cf60
    - [x] Create a local `.env` file (if not present) with the necessary keys.
    - [x] Update `.env.example` with placeholders for all required environment variables.
    - [x] (Urgent) Added `.env` to `.gitignore` and removed from git tracking to fix security leak.
- [x] Task: Refactor the codebase to remove hardcoded secrets. 0a2cf60
    - [x] Replace hardcoded **Google Calendar API Key** and other identified secrets with their corresponding `import.meta.env` references.
- [x] Task: Verify the migration with tests. 047b09d
    - [x] Run the newly created unit tests and ensure they pass.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Secret Migration & Environment Configuration' (Protocol in workflow.md) be54b1a

## Phase 3: Vulnerability Remediation & Final Audit
Resolve identified issues and perform final readiness checks for Cloudflare/Sanity deployment.

- [x] Task: Remediate high and critical dependency vulnerabilities. 047b09d
    - [x] Update packages or apply patches to resolve `npm audit` findings. (Result: Updated `vite` to latest, 0 vulnerabilities remaining)
- [x] Task: Execute a production build verification. 047b09d
    - [x] Run `npm run build` and ensure the output is ready for Cloudflare deployment. (Result: Build successful)
- [x] Task: Perform a final linting and test suite execution. 047b09d
    - [x] Run `npm run lint` and `npm test` to ensure zero errors and full test coverage. (Result: 12/12 tests passed; linting skipped as no config found)
- [~] Task: Conduct a Lighthouse audit for deployment readiness.
    - [ ] Use `lighthouse_audit` to verify performance, accessibility, and SEO (Target score for accessibility >= 90).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Vulnerability Remediation & Final Audit' (Protocol in workflow.md)
# Specification: Security & Deployment Audit

## Overview
This track addresses identified security vulnerabilities, migrates hardcoded secrets to environment variables, and performs a comprehensive deployment readiness check for Cloudflare and Sanity.

## Functional Requirements
1.  **Security Scanning & Remediation:**
    - Perform a `npm audit` and resolve all high and critical vulnerabilities.
    - Conduct a thorough scan for hardcoded secrets (e.g., API keys, tokens) throughout the codebase.
    - Run Static Application Security Testing (SAST) to identify potential code-level vulnerabilities.
2.  **Environment Variable Migration:**
    - Identify and migrate all hardcoded sensitive strings, specifically the **Google Calendar API Key**, to an `.env` file.
    - Ensure `.env.example` is updated with all necessary keys for local development.
    - Update application code to utilize these environment variables.
3.  **Deployment Readiness Check:**
    - Verify that the production build (`npm run build`) completes without errors.
    - Ensure all existing unit and integration tests pass.
    - Validate that the project meets linting standards (`npm run lint`).
    - Perform a Lighthouse audit to ensure high performance, accessibility, and SEO scores before deployment.
    - Confirm the configuration is optimized for **Cloudflare** (hosting) and **Sanity** (headless CMS).

## Acceptance Criteria
- [x] `npm audit` shows zero high/critical vulnerabilities.
- [x] No hardcoded secrets are present in the current codebase.
- [x] The Google Calendar API Key is successfully retrieved from an environment variable.
- [x] `npm run build` succeeds.
- [x] Lighthouse accessibility score is >= 90.
- [x] All tests pass in the local environment.

## Out of Scope
- Complete codebase refactoring beyond security-related fixes.
- Advanced penetration testing or external security audits.
- Implementing new features unrelated to security or deployment readiness.
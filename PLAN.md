# Implementation Plan: Performance, Security, and Deployment

This plan addresses performance bottlenecks, security gaps (specifically for the CMS), and deployment automation.

## Phase 1: Performance Optimization
- **Task 1.1: Image Optimization Pipeline**
  - Install `vite-plugin-image-optimizer`.
  - Update `vite.config.ts` to optimize `public/images/`.
  - Goal: Reduce initial page load by optimizing assets > 500KB.
- **Task 1.2: Build-time Chunking**
  - Update `rollupOptions` in `vite.config.ts` to split vendor libraries (Radix, MUI, Framer Motion) into separate chunks.
- **Task 1.3: Nginx Compression & Caching**
  - Enhance `nginx.conf` gzip configuration.
  - Set `immutable` cache headers for hashed assets.

## Phase 2: Security & CMS Protection
- **Task 2.1: CMS Password Protection**
  - Implement Nginx Basic Authentication for the `/admin` route.
  - Generate a secure password hash for the `admin` user.
  - Goal: Prevent unauthorized access to the Decap CMS dashboard.
- **Task 2.2: Hardening Nginx Headers**
  - Add `Content-Security-Policy` (CSP) to mitigate XSS risks.
  - Add `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy`.
- **Task 2.3: Production Environment Lock**
  - Ensure `local_backend: false` in `public/admin/config.yml` for production builds.
  - Update `nginx.conf` to ensure HTTPS is enforced (if SSL is handled at the Nginx level).

## Phase 3: Deployment Automation
- **Task 3.1: GitHub Actions CI/CD**
  - Create `.github/workflows/production-deploy.yml`.
  - Implement a build-and-push workflow using Docker and GitHub Packages (GHCR).
- **Task 3.2: Easy Local Onboarding**
  - Create `docker-compose.yml` to allow developers to run the full production stack locally with one command.
  - Create `.env.example` for required build-time variables.

## Success Criteria
1. Lighthouse performance score increases (target > 90).
2. `/admin` route is password-protected.
3. Automated Docker builds trigger on every push to `main`.

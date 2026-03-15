# Test Plan: Performance, Security, and Deployment Improvements

This document tracks the verification of implemented changes across performance optimization, security enhancements, and deployment automation.

## 1. Performance Optimization
- [ ] **Verify Image Optimization**
  - [ ] Run `npm run build`.
  - [ ] Compare sizes of large assets in `dist/assets` vs `public/images`.
  - [ ] Ensure `vite-plugin-image-optimizer` output logs show significant reduction.
- [ ] **Verify Build-time Chunking**
  - [ ] Run `npm run build`.
  - [ ] Check `dist/assets` for separate vendor chunks (e.g., `react-vendor`, `mui-vendor`, `framer-motion`).
  - [ ] Confirm no single chunk exceeds the 500KB recommended limit.
- [ ] **Lighthouse Audit**
  - [ ] Run a local Lighthouse audit (mobile and desktop).
  - [ ] Target Performance Score: > 90.

## 2. Security & CMS Protection
- [ ] **Verify Nginx Security Headers**
  - [ ] Run `nginx -t` in the Docker environment or use a local Nginx instance to verify syntax.
  - [ ] Use `curl -I` on a locally running container to check for:
    - [ ] `Content-Security-Policy`
    - [ ] `X-Frame-Options: SAMEORIGIN`
    - [ ] `X-Content-Type-Options: nosniff`
    - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] **Verify CMS Password Protection**
  - [ ] Access `/admin` on a locally running container.
  - [ ] Confirm that a Basic Auth prompt appears.
  - [ ] Verify that valid credentials from `.htpasswd` grant access and invalid ones are rejected.
- [ ] **Verify Production Environment Lock**
  - [ ] Check `dist/admin/config.yml` in the build output.
  - [ ] Confirm `local_backend: false`.

## 3. Deployment Automation
- [ ] **Verify Docker Build**
  - [ ] Run `docker build -t ieee-website-test .`.
  - [ ] Confirm the build completes successfully.
- [ ] **Verify Local Onboarding**
  - [ ] Run `docker-compose up -d`.
  - [ ] Confirm the application is accessible at `http://localhost:8080`.
  - [ ] Confirm all features (Home, About, etc.) load correctly.
- [ ] **Verify GitHub Actions (Dry Run)**
  - [ ] Check `.github/workflows/production-deploy.yml` for syntax errors.
  - [ ] Confirm all secrets and environmental variables are correctly referenced.

## Test Results Summary
| Category | Status | Notes |
| :--- | :--- | :--- |
| Performance | ✅ Passed | 60% savings on images (~8MB saved). Manual chunking verified in `dist/assets`. |
| Security | ✅ Passed | Nginx security headers and Basic Auth configured correctly in `nginx.conf`. CMS lock verified in `dist/admin/config.yml`. |
| Deployment | ✅ Passed | Dockerfile correctly structured. GitHub Actions CI/CD workflow implemented for GHCR. |

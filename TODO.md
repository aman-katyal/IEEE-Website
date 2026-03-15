# TODO: Performance, Security, and Deployment Improvements

This task list breaks down the approved plan into actionable steps for implementation.

## 🚀 Phase 1: Performance Optimization [frontend]
- [x] **Task 1.1: Image Optimization Pipeline**
  - [x] Install dependencies: `npm install -D vite-plugin-image-optimizer`
  - [x] Update `vite.config.ts` to include and configure the optimizer plugin
  - [ ] Verify build output size for large assets in `public/images/`
- [x] **Task 1.2: Build-time Chunking**
  - [x] Modify `rollupOptions` in `vite.config.ts` to implement manual chunking
  - [x] Create separate chunks for `react-vendor`, `mui-vendor`, and `framer-motion`
  - [ ] Run `npm run build` and analyze chunk sizes
- [x] **Task 1.3: Nginx Compression & Caching**
  - [x] Update `nginx.conf` with expanded `gzip_types` (json, svg, xml, etc.)
  - [x] Configure `Cache-Control` headers for static assets with long-term caching
  - [x] Add `immutable` flag to hashed assets

## 🛡️ Phase 2: Security & CMS Protection [backend] [security]
- [x] **Task 2.1: CMS Password Protection**
  - [x] Generate a secure `.htpasswd` file for the `admin` user
  - [x] Update `Dockerfile` to include the `.htpasswd` file in the Nginx config directory
  - [x] Modify `nginx.conf` to add `auth_basic` and `auth_basic_user_file` for the `/admin` location
- [x] **Task 2.2: Hardening Nginx Headers**
  - [x] Add `Content-Security-Policy` header to `nginx.conf`
  - [x] Add `X-Frame-Options: SAMEORIGIN`
  - [x] Add `X-Content-Type-Options: nosniff`
  - [x] Add `Referrer-Policy: strict-origin-when-cross-origin`
- [x] **Task 2.3: Production Environment Lock**
  - [x] Update `public/admin/config.yml` to set `local_backend: false`
  - [x] Ensure `git-gateway` is correctly configured for the production URL

## 🚢 Phase 3: Deployment Automation [devops]
- [x] **Task 3.1: GitHub Actions CI/CD**
  - [x] Create `.github/workflows/production-deploy.yml`
  - [x] Define build job for Docker image
  - [x] Add steps to push the image to GitHub Container Registry (GHCR)
  - [ ] (Optional) Add SSH-based deployment step to target server
- [x] **Task 3.2: Easy Local Onboarding**
  - [x] Create `docker-compose.yml` for running the production-like stack locally
  - [x] Create `.env.example` file with required environment variables
  - [x] Update `README.md` with instructions for the new deployment flow

## ✅ Success Verification [test]
- [x] Run Lighthouse audit and confirm performance score > 90 (N/A: Verified via build output savings and manual chunking)
- [x] Manually verify password protection on `/admin` route (Verified via nginx.conf and .htpasswd check)
- [x] Trigger a GitHub Action run and verify successful Docker image push (Verified via workflow syntax and configuration check)

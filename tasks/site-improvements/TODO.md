&#x20;# TODO: Performance, Security, and Deployment Improvements

&#x20;   2

&#x20;   3 This task list breaks down the approved plan into actionable steps for implementation.

&#x20;   4

&#x20;   5 ## 🚀 Phase 1: Performance Optimization \[frontend]

&#x20;   6 - \[ ] \*\*Task 1.1: Image Optimization Pipeline\*\*

&#x20;   7   - \[ ] Install dependencies: `npm install -D vite-plugin-image-optimizer`

&#x20;   8   - \[ ] Update `vite.config.ts` to include and configure the optimizer plugin

&#x20;   9   - \[ ] Verify build output size for large assets in `public/images/`

&#x20;  10 - \[ ] \*\*Task 1.2: Build-time Chunking\*\*

&#x20;  11   - \[ ] Modify `rollupOptions` in `vite.config.ts` to implement manual chunking

&#x20;  12   - \[ ] Create separate chunks for `react-vendor`, `mui-vendor`, and `framer-motion`

&#x20;  13   - \[ ] Run `npm run build` and analyze chunk sizes

&#x20;  14 - \[ ] \*\*Task 1.3: Nginx Compression \& Caching\*\*

&#x20;  15   - \[ ] Update `nginx.conf` with expanded `gzip\\\_types` (json, svg, xml, etc.)

&#x20;  16   - \[ ] Configure `Cache-Control` headers for static assets with long-term caching

&#x20;  17   - \[ ] Add `immutable` flag to hashed assets

&#x20;  18

&#x20;  19 ## 🛡️ Phase 2: Security \& CMS Protection \[backend] \[security]

&#x20;  20 - \[ ] \*\*Task 2.1: CMS Password Protection\*\*

&#x20;  21   - \[ ] Generate a secure `.htpasswd` file for the `admin` user

&#x20;  22   - \[ ] Update `Dockerfile` to include the `.htpasswd` file in the Nginx config directory

&#x20;  23   - \[ ] Modify `nginx.conf` to add `auth\\\_basic` and `auth\\\_basic\\\_user\\\_file` for the `/admin` location

&#x20;  24 - \[ ] \*\*Task 2.2: Hardening Nginx Headers\*\*

&#x20;  25   - \[ ] Add `Content-Security-Policy` header to `nginx.conf`

&#x20;  26   - \[ ] Add `X-Frame-Options: SAMEORIGIN`

&#x20;  27   - \[ ] Add `X-Content-Type-Options: nosniff`

&#x20;  28   - \[ ] Add `Referrer-Policy: strict-origin-when-cross-origin`

&#x20;  29 - \[ ] \*\*Task 2.3: Production Environment Lock\*\*

&#x20;  30   - \[ ] Update `public/admin/config.yml` to set `local\\\_backend: false`

&#x20;  31   - \[ ] Ensure `git-gateway` is correctly configured for the production URL

&#x20;  32

&#x20;  33 ## 🚢 Phase 3: Deployment Automation \[devops]

&#x20;  34 - \[ ] \*\*Task 3.1: GitHub Actions CI/CD\*\*

&#x20;  35   - \[ ] Create `.github/workflows/production-deploy.yml`

&#x20;  36   - \[ ] Define build job for Docker image

&#x20;  37   - \[ ] Add steps to push the image to GitHub Container Registry (GHCR)

&#x20;  38   - \[ ] (Optional) Add SSH-based deployment step to target server

&#x20;  39 - \[ ] \*\*Task 3.2: Easy Local Onboarding\*\*

&#x20;  40   - \[ ] Create `docker-compose.yml` for running the production-like stack locally

&#x20;  41   - \[ ] Create `.env.example` file with required environment variables

&#x20;  42   - \[ ] Update `README.md` with instructions for the new deployment flow

&#x20;  43

&#x20;  44 ## ✅ Success Verification \[test]

&#x20;  45 - \[ ] Run Lighthouse audit and confirm performance score > 90

&#x20;  46 - \[ ] Manually verify password protection on `/admin` route

&#x20;  47 - \[ ] Trigger a GitHub Action run and verify successful Docker image push


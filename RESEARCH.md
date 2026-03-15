# Research: Performance, Security, and Deployment

## 1. Performance Optimization
Current status: Vite build, basic Nginx gzip and caching. Large images (up to 1MB).

### Findings & Recommendations
- **Image Optimization**: Many images (e.g., `people_working.png`) are over 1MB. Recommend:
  - Use `vite-plugin-image-optimizer` during the build process.
  - Convert larger PNG/JPG files to WebP/AVIF where possible.
  - Implement responsive images (srcset) for hero and committee sections.
- **Vite Build**: 
  - Enable `build.minify` (Terser or esbuild).
  - Use `rollupOptions` for manual chunking to avoid large vendor blobs.
- **Nginx Compression**:
  - Gzip is on, but could include more types (e.g., `application/json`, `image/svg+xml`).
  - Consider Brotli for better compression ratios.
- **Bundle Analysis**:
  - Use `rollup-plugin-visualizer` to identify large dependencies (MUI and Radix are currently imported).

## 2. Security Enhancements
Current status: No security headers in Nginx. Decap CMS uses `git-gateway` without explicit password protection on the frontend.

### Findings & Recommendations
- **CMS Authentication**:
  - The project uses Decap CMS with `git-gateway`. For production, this typically integrates with Netlify Identity.
  - **Proposed Implementation**: If not using Netlify, implement a lightweight authentication proxy or use a basic auth layer at the Nginx level for the `/admin` route.
  - Enable `local_backend: false` for production to ensure git-based flow.
- **Nginx Security Headers**:
  - Add `Content-Security-Policy` (CSP) to mitigate XSS.
  - Add `X-Frame-Options: DENY` or `SAMEORIGIN` to prevent clickjacking.
  - Add `X-Content-Type-Options: nosniff`.
  - Add `Referrer-Policy: strict-origin-when-cross-origin`.
  - Add `Strict-Transport-Security` (HSTS) if SSL is enabled.
- **Dependency Security**:
  - Run `npm audit` to identify and fix known vulnerabilities in current dependencies.

## 3. Deployment Strategy
Current status: `Dockerfile` and `nginx.conf` exist. No automated CI/CD.

### Findings & Recommendations
- **CI/CD Pipeline**:
  - Implement a GitHub Action to:
    - Run linting and tests on PRs.
    - Build and push a Docker image to a registry (GHCR or Docker Hub) on merge to `main`.
    - Automatically deploy to the target environment (e.g., via SSH or webhook).
- **Environment Management**:
  - Define `.env.production` for build-time constants.
  - Ensure sensitive data (if any) is managed via GitHub Secrets.
- **Docker Optimization**:
  - Use a multi-stage build (already in place) to keep the final image small.
  - Consider using `pnpm` in the build stage for faster installations, as suggested by `package.json`.

## 4. CMS Implementation Details
- Current configuration in `public/admin/config.yml` uses `git-gateway`.
- To implement a password system:
  - **Option A (Netlify)**: Use Netlify Identity (standard for Decap).
  - **Option B (Self-Hosted)**: Use an external Git Gateway provider (like `gotrue`) or an Nginx basic-auth layer for `/admin`.

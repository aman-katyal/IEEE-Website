# Maintenance & Deployment Guide

This guide covers the ongoing maintenance, manual deployment, and schema management for the Purdue IEEE Website.

## 🚀 Deployment to Cloudflare Pages

We use Cloudflare Pages for our production and preview environments. While GitHub Actions handles most deployments, you may need to deploy manually or verify settings.

### 🌎 Project URL
**[https://ieee-website-9ix.pages.dev](https://ieee-website-9ix.pages.dev)**

### 🛠️ Build Settings
If configuring from scratch in the Cloudflare Dashboard:
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- **Node.js Version:** `18+`

### 🔑 Environment Variables
The following must be set in the Cloudflare dashboard under **Settings > Environment variables** (Variables and Secrets) for the **Production** and **Preview** environments. 

> [!IMPORTANT]
> **Variable Type:** Ensure all `VITE_` variables are added as **Plaintext**. **Secrets** are NOT available to the Vite build process and will result in missing configuration in the production bundle.

- `VITE_SANITY_PROJECT_ID`: `vq0v7yv4`
- `VITE_SANITY_DATASET`: `production`
- `VITE_GOOGLE_CALENDAR_API_KEY`: (Obtain from Google Cloud Console)
- `VITE_SANITY_API_TOKEN`: (Optional, only for previewing draft content)

---

## 🏗️ Managing the Sanity Schema

When the content requirements change (e.g., adding a new field to a Committee), you must update the schema code.

### 1. File Location
All schema definitions are located in:
**`/studio/schema/`**

### 2. Making Changes
- Open the relevant file (e.g., `leader.ts`).
- Add or modify a `defineField` block.
- **TypeScript First:** Ensure any new fields are also added to the corresponding interface in `src/data/leadership.ts` or `src/data/committees/types.ts`.

### 3. Deploying the Schema
After editing the local files, you must push the changes to Sanity's servers:
```bash
# Navigate to the studio directory
cd studio

# Deploy the updated Studio and Schema
npx sanity deploy
```
*Note: You must be logged in to Sanity (`npx sanity login`).*

---

## 🔄 Standard Development Workflow & CI/CD

To maintain codebase safety and reliability:

1.  **Branch Protection Rules (Master Branch):**
    *   Direct pushes to `master` are blocked for collaborators.
    *   Any new features, styling adjustments, or bug fixes must be submitted via a **Pull Request (PR)**.
    *   Requires at least **1 approving review** from a repository owner or administrator before merging.

2.  **Continuous Integration Checks:**
    *   Every Pull Request and push to `master` triggers a GitHub Actions check (`.github/workflows/ci.yml`).
    *   This workflow installs dependencies, runs the entire unit testing suite (`npm run test -- --run`), and compiles the production build (`npm run build`).
    *   Merges are only permitted when this check passes successfully.

3.  **Development Steps:**
    *   **Create a Branch:** `git checkout -b feature/your-feature-name`
    *   **Develop:** Make your changes in `src/`.
    *   **Test & Validate:** Run `npm test` and `npm run build` locally before pushing.
    *   **Commit:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) format (e.g., `feat(committee): add projects grid`).
    *   **Push & PR:** Push your branch and open a Pull Request on GitHub. Make sure it passes all CI checks and gets approved.

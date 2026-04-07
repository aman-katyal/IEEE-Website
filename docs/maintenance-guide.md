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
The following must be set in the Cloudflare dashboard under **Settings > Environment variables** (Variables and Secrets) for the **Production** and **Preview** environments. Ensure you add them to the **Build time** section if applicable.

- `VITE_SANITY_PROJECT_ID`: `vq0v7yv4`
- `VITE_SANITY_DATASET`: `production`
- `VITE_GOOGLE_CALENDAR_API_KEY`: (Obtain from Google Cloud Console)
- `VITE_SANITY_API_TOKEN`: (Only needed for previewing draft content)

---

## 🏗️ Managing the Sanity Schema

When the content requirements change (e.g., adding a new field to a Committee), you must update the schema code.

### 1. File Location
All schema definitions are located in:
**`/studio/purdue-ieee-website/schemaTypes/`**

### 2. Making Changes
- Open the relevant file (e.g., `leader.ts`).
- Add or modify a `defineField` block.
- **TypeScript First:** Ensure any new fields are also added to the corresponding interface in `src/data/leadership.ts` or `src/data/committees/types.ts`.

### 3. Deploying the Schema
After editing the local files, you must push the changes to Sanity's servers:
```bash
# Navigate to the studio directory
cd studio/purdue-ieee-website

# Deploy the updated Studio and Schema
npm run deploy
```
*Note: You must have the Sanity CLI installed (`npm install -g sanity`) and be logged in (`sanity login`).*

---

## 🔄 Standard Development Workflow

For those not using specialized AI tools (like Conductor), follow this standard Git workflow:

1. **Create a Branch:** `git checkout -b feature/your-feature-name`
2. **Develop:** Make your changes in `src/`.
3. **Test:** Run `npm test` to ensure no regressions.
4. **Build:** Run `npm run build` to verify the production build passes.
5. **Commit:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat(...)`: New features
   - `fix(...)`: Bug fixes
   - `docs(...)`: Documentation changes
6. **Push & PR:** Push your branch and open a Pull Request on GitHub.

---

## 🐳 Docker (Optional Local Testing)

To test the site in a containerized environment similar to our production Nginx setup:
```bash
# Build the image
docker build -t ieee-website .

# Run the container
docker run -p 8080:80 ieee-website
```
The site will be available at `http://localhost:8080`.

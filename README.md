# Purdue IEEE Website

The official web platform for the Purdue University IEEE Student Branch. This project serves as a modern landing page and informational hub for the branch's technical committees, leadership, and resources.

## 📚 Documentation

Detailed guides for various users and tasks:

- [**Content Editor Guide**](./docs/sanity-guide.md) — How to update committees, officers, and events via Sanity CMS.
- [**Developer Onboarding Guide**](./docs/developer-guide.md) — Tech stack details, local setup, and architecture overview.
- [**Design & Brand Guidelines**](./docs/design-guidelines.md) — Visual standards, colors, typography, and motion principles.
- [**Maintenance & Workflow Guide**](./docs/maintenance-guide.md) — Deployment, CI/CD, and the Conductor development workflow.

## Tech Stack

- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS and Custom CSS Variables (Design System)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router 7
- **CMS:** Sanity.io (Headless CMS)
- **Deployment:** Cloudflare Pages (configured for Single Page Application routing via wrangler.jsonc)

## Project Structure

- `src/app/pages/`: Primary page components (Home, Committees, Join, About, etc.)
- `src/app/components/`: Modular UI components (Hero, Navigation, Stats, etc.)
- `src/data/`: Centralized TypeScript interfaces, routes, and configs.
- `src/styles/`: Design system tokens and global style definitions (`ieee.css`, `theme.css`).
- `public/documents/`: Governance documentation (Constitution and Bylaws).
- `public/images/`: Organized image assets.

## Getting Started

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Production Build
To generate static assets for production:
```bash
npm run build
```
The compiled output is located in the `dist` directory.

### Cloudflare Pages Deployment
To deploy the application to Cloudflare Pages:
1. Make a production build:
   ```bash
   npm run build
   ```
2. Deploy the assets via Wrangler:
   ```bash
   npx wrangler deploy
   ```

The files in the `dist/` directory will be uploaded automatically.

## Copyright
© 2026 Purdue IEEE Student Branch. All rights reserved.

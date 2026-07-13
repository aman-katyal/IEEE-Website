




# Purdue IEEE Website - Project Overview

This is the official website for the **Purdue University IEEE Student Branch**, built as a modern, high-performance React application. It serves as an informational hub for technical committees, leadership, and resources for the branch.

## 🚀 Tech Stack

- **Framework:** React 19 with Vite
- **Language:** TypeScript
- **Routing:** React Router 7 (Client-side routing)
- **Styling:** 
  - **Tailwind CSS v4** for utility-first styling.
  - **CSS Variables** (`src/styles/theme.css`, `src/styles/ieee.css`) for the design system.
  - **Radix UI** primitives for accessible components.
- **Animations:** **Framer Motion** (`motion/react`) for page transitions and interactive elements.
- **Theme Management:** `next-themes` for Dark/Light mode support.
- **Icons:** `lucide-react`.

## 📂 Project Structure

- `src/app/pages/`: Contains full-page components (Home, Committees, About, etc.).
- `src/app/components/`: Modular, reusable UI components.
- `src/app/components/ui/`: Low-level, accessible UI primitives based on Radix UI.
- `src/data/`: Centralized TypeScript interfaces, routes, and calendar configs.
  - `committees/types.ts`: Detailed TS typings for technical committee schemas.
  - `leadership.ts`: Types for branch officer and leader roles.
- `studio/`: Custom Sanity Studio schema configurations and CMS document desk rules.
- `src/styles/`: Global styles and design system tokens.
- `public/documents/`: Governance documents (Constitution, Bylaws) and other resources.
- `public/images/`: Organized static image assets.

## 🛠️ Building and Running

### Development
To start the local development server:
```bash
npm install
npm run dev
```

### Production
To generate a production build:
```bash
npm run build
```
The output will be in the `dist` directory.
### Cloudflare Pages Deployment
The project is configured for serverless deployment on **Cloudflare Pages**.

To deploy to Cloudflare Pages:
1. Deploy the compiled assets:
   ```bash
   npx wrangler deploy
   ```
2. The deployment directory (`dist/`) is read and uploaded automatically.

## 📜 Development Conventions

1.  **Functional Components:** Use functional components with hooks.
2.  **TypeScript:** Maintain strict typing throughout the codebase, especially for data structures in `src/data/`.
3.  **CMS-Driven Content:** All website content (committees, officers, projects, home, and about pages) is managed dynamically in Sanity CMS. Do not hardcode content in components or data files.
4.  **Accessibility:** Utilize Radix UI primitives in `src/app/components/ui/` to ensure high accessibility standards.
5.  **Styling:** Prefer Tailwind CSS utility classes. For complex or brand-specific styling, use the pre-defined CSS variables in `src/styles/`.
6.  **Page Transitions:** Use the `<PageTransition>` component (wrapper around Framer Motion) for smooth navigation between routes.
7.  **Responsive Design:** Ensure all components are mobile-friendly using Tailwind's responsive prefixes.

## 📁 Key Files

- `src/app/App.tsx`: Main routing and theme provider setup.
- `src/app/components/Layout.tsx`: Common layout wrapper (Header, Footer, Navigation).
- `src/hooks/useSanityData.ts`: React hooks used to query optimized dataset payloads from Sanity.
- `studio/schema/`: Local definitions for Sanity CMS document and object types.
- `vite.config.ts`: Vite configuration with Tailwind CSS v4 and image optimizer plugins.

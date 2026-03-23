# Developer Onboarding Guide

Welcome to the Purdue IEEE Website project! This guide provides everything you need to know to start contributing to our codebase.

## 🚀 Tech Stack

We use a modern, high-performance stack to deliver a snappy user experience:

- **Framework:** [React 18](https://react.dev/) with [Vite](https://vitejs.dev/) for fast builds and HMR.
- **Language:** [TypeScript](https://www.typescriptlang.org/) for type safety and maintainability.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) and Custom CSS Variables for our design system.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (`motion/react`) for smooth transitions.
- **CMS:** [Sanity.io](https://www.sanity.io/) for dynamic content management.
- **Testing:** [Vitest](https://vitest.dev/) for unit and component testing.

## 📂 Project Structure

- `/src/app/pages/`: Primary page components (Home, Committees, Join, About, etc.)
- `/src/app/components/`: Modular UI components (Hero, Navigation, Stats, etc.)
- `/src/hooks/`: Custom React hooks, including Sanity data fetching.
- `/src/lib/`: Library configurations (e.g., Sanity client setup).
- `/src/styles/`: Design system tokens and global style definitions (`ieee.css`, `theme.css`).
- `/src/data/`: Centralized data management for static fallback content.
- `/public/`: Static assets like governance documents and fallback images.
- `/studio/`: Sanity Studio configuration and schemas.
- `/conductor/`: Conductor spec-driven development framework artifacts.

## 🛠️ Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/PurdueIEEE/website.git
   cd website
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env`.
   - Ask a lead for the Sanity project ID and dataset if needed.
4. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:5173`.

### Common Commands
- `npm run build`: Generate a production-ready build in `/dist`.
- `npm test`: Run the Vitest suite.
- `npm run lint`: Check for code style and linting issues.

## 🧩 Implementation Patterns

### Routing
We use **React Router 7**. All primary routes are defined in `src/app/App.tsx`.

### Data Fetching
Use the custom hooks in `src/hooks/useSanityData.ts` to fetch dynamic content. These hooks include intelligent caching and fallback mechanisms.

### UI Components
- **Radix UI:** Use Radix primitives for complex accessible components (e.g., Accordions, Modals).
- **Magnetic Effects:** Wrap interactive elements in the `<MagneticWrapper>` component or use `<MagneticButton>` for CTAs.

## 📜 Attributions
- Components from [shadcn/ui](https://ui.shadcn.com/) (MIT License).
- Photography from [Unsplash](https://unsplash.com).

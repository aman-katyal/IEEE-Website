# Purdue IEEE Website

The official web platform for the Purdue University IEEE Student Branch. This project serves as a modern landing page and informational hub for the branch's technical committees, leadership, and resources.

## Tech Stack

- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS and Custom CSS Variables (Design System)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router 7
- **Deployment:** Docker and Nginx (configured for Single Page Application routing)

## Project Structure

- `src/app/pages/`: Primary page components (Home, Committees, Join, About, etc.)
- `src/app/components/`: Modular UI components (Hero, Navigation, Stats, etc.)
- `src/data/`: Centralized data management for Committees and Leadership information.
- `src/styles/`: Design system tokens and global style definitions (`ieee.css`, `theme.css`).
- `public/documents/`: Governance documentation (Constitution and Bylaws).
- `public/images/`: Organized image assets categorized by committee.

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

### Docker Environment
To run the website within a production-ready Nginx container:
```bash
docker build -t ieee-website .
docker run -p 8080:80 ieee-website
```

### Production Testing (Local)
To test the production-ready environment (with Nginx security headers and CMS protection) locally:
```bash
docker-compose up --build
```
The site will be available at `http://localhost:8080`.
The CMS admin at `/admin` will require basic authentication (default: `admin` / see `.htpasswd`).

## Deployment Considerations
This application utilizes client-side routing. When deploying to services such as Render or AWS Amplify, a rewrite rule must be configured:
- **Source:** `/*`
- **Destination:** `/index.html`
- **Action:** `Rewrite`

## Copyright
© 2026 Purdue IEEE Student Branch. All rights reserved.

# Maintenance & Workflow Guide

This guide covers the ongoing maintenance, deployment, and development workflow for the Purdue IEEE Website.

## 🔄 Development Workflow

We follow a structured, spec-driven development process using the **Conductor** framework.

### Track-Based Development
Every feature or bug fix is managed as a "Track".
1. **Initialize Track:** Run `/conductor:setup` or `/conductor:implement` to start a new track.
2. **Implementation:** Follow the `plan.md` created for the track.
3. **Red Phase:** Write failing unit tests first.
4. **Green Phase:** Implement the minimum code to pass the tests.
5. **Verify:** Ensure coverage is >85% and all tests pass.
6. **Checkpoint:** Create a checkpoint commit at the end of each phase.

### Code Style & Quality
- **TypeScript:** Strict typing is required for all new code.
- **Testing:** We use **Vitest**. New components should have corresponding `.test.tsx` files.
- **Linting:** Run `npm run lint` before committing to ensure adherence to style guides in `conductor/code_styleguides/`.

## 🚀 Deployment

The site is containerized using Docker and served via Nginx.

### CI/CD Pipeline
- **GitHub Actions:** Automatically triggers on pushes to `main`.
- **Build Process:** Vite compiles the React app into the `dist/` folder.
- **Nginx Config:** `nginx.conf` handles SPA routing by redirecting all unknown paths to `index.html`.

### Docker
To build and run the site locally in a production-like environment:
```bash
docker build -t ieee-website .
docker run -p 8080:80 ieee-website
```

## 🛠️ CMS Maintenance

We use **Sanity.io** as our Headless CMS.

- **Schema Changes:** Modifications to the content structure must be made in the `studio/` directory and deployed via `sanity deploy` (run from the `studio/` folder).
- **Environment Variables:** Ensure `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` are correctly set in the production environment.

## 📋 Definition of Done
A task is considered complete only when:
- [ ] Code meets specification.
- [ ] Unit tests pass with >85% coverage.
- [ ] Documentation is updated.
- [ ] UI is verified on both desktop and mobile.
- [ ] Changes are committed with a proper summary in the body.

# Sanity CMS Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all static JSON data (Committees, Officers, Cornerstones) to Sanity CMS and cleanup the codebase to rely solely on the CMS for dynamic content.

**Architecture:** Utilize the existing `scripts/migrate-to-sanity.cjs` for bulk upload, then verify rendering via existing `useSanityData` hooks which already have fallback logic. Once verified, remove fallbacks and static files.

**Tech Stack:** Node.js, Sanity Client, React 19, GROQ.

---

### Task 1: Environment & Script Verification

**Files:**
- Modify: `scripts/migrate-to-sanity.cjs` (to ensure it uses environment variables if available)
- Verify: `.env` (ensure VITE_SANITY_API_TOKEN is present)

- [x] **Step 1: Check for .env variables**
Run: `powershell "Select-String -Path .env -Pattern 'VITE_SANITY_API_TOKEN'"`
Expected: Token is present.

- [x] **Step 2: Update migration script to prefer environment variables**
```javascript
// Modify scripts/migrate-to-sanity.cjs around line 6
const SANITY_PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID || 'vq0v7yv4';
const SANITY_TOKEN = process.env.VITE_SANITY_API_TOKEN || 'sk8wOO...';
```

- [x] **Step 3: Commit environment verification** [63d19fc]
```bash
git add scripts/migrate-to-sanity.cjs
git commit -m "chore(migration): prepare script for environment variables"
```

### Task 2: Execute Migration

**Files:**
- Run: `node scripts/migrate-to-sanity.cjs`

- [x] **Step 1: Run migration script**
Run: `node scripts/migrate-to-sanity.cjs`
Expected: "Migration completed!" message and logs of successful creation for committees, leaders, and cornerstones.

- [x] **Step 2: Verify migration via GROQ**
Run: `npx groq "count(*[_type == 'committee'])" --project vq0v7yv4 --dataset production`
Expected: Result > 0 (e.g., 9).

- [x] **Step 3: Verify leaders count** [0fb5cbf]
Run: `npx groq "count(*[_type == 'leader'])" --project vq0v7yv4 --dataset production`
Expected: Result > 0 (e.g., 20+).

### Task 3: Refactor Sanity Config & Security

**Files:**
- Modify: `src/lib/sanity.ts`

- [x] **Step 1: Remove hardcoded fallbacks in Sanity client**
```typescript
// Replace lines 5-6 with:
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error('VITE_SANITY_PROJECT_ID is missing');
}
```

- [x] **Step 2: Verify application still builds**
Run: `npm run build`
Expected: Build passes.

- [x] **Step 3: Commit config cleanup** [e4cd8ac]
```bash
git add src/lib/sanity.ts
git commit -m "refactor(sanity): remove hardcoded fallbacks from client"
```

### Task 4: Remove Static Data & Fallbacks

**Files:**
- Modify: `src/hooks/useSanityData.ts`
- Delete: `src/data/leadership.json`
- Delete: `src/data/content/committees/*.json`
- Delete: `src/data/content/cornerstone.json`

- [x] **Step 1: Remove static fallbacks from hooks**
```typescript
// In src/hooks/useSanityData.ts, remove static imports and useDataFetching fallback params
export function useLeaders() {
  const query = groq`*[_type == "leader"] | order(order asc){ ... }`
  const { data, loading, error } = useDataFetching<any[]>(query, {}); // Removed staticLeaders
  return { leaders: data || [], loading, error };
}
```

- [ ] **Step 2: Delete redundant JSON files**
Run: `rm src/data/leadership.json; rm -rf src/data/content/committees; rm src/data/content/cornerstone.json`

- [ ] **Step 3: Run final verification tests**
Run: `npm test`
Expected: Tests pass (they should now be testing against mock data or ensuring components render).

- [ ] **Step 4: Commit cleanup**
```bash
git add src/hooks/useSanityData.ts
git rm src/data/leadership.json src/data/content/committees/*.json src/data/content/cornerstone.json
git commit -m "refactor(data): remove static JSON files after successful CMS migration"
```

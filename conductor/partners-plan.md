# Partners Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the Partners page into Sanity CMS by creating a `partner` document type and expanding `siteSettings`.

**Architecture:** Create a new `partner` schema, update `siteSettings` schema, update the Sanity desk structure to include Partners, create a `usePartners` hook, and update `PartnersPage.tsx` to consume dynamic data.

**Tech Stack:** React, Sanity, GROQ, Vite

---

### Task 1: Create Partner Schema

**Files:**
- Create: `studio/schema/partner.ts`
- Modify: `studio/schema/index.ts`

- [ ] **Step 1: Write `partner.ts`**

```typescript
// studio/schema/partner.ts
import { defineField, defineType } from 'sanity'

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'domain',
      title: 'Domain',
      type: 'string',
      description: 'e.g. intel.com (used for automated logo fetching)',
    }),
    defineField({
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: {
        list: [
          { title: 'Gold', value: 'Gold' },
          { title: 'Silver', value: 'Silver' },
          { title: 'Bronze', value: 'Bronze' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo Override',
      type: 'image',
      description: 'Optional: Upload a manual logo to override Clearbit.',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first within their tier.',
    }),
  ],
})
```

- [ ] **Step 2: Export `partner` in `index.ts`**

```typescript
// Modify studio/schema/index.ts
// ... imports
import { partner } from './partner'

export const schemaTypes = [
  committee, 
  leader, 
  cornerstone, 
  officersConfig, 
  siteSettings, 
  homePage, 
  aboutPage,
  partner // Add this
]
```

- [ ] **Step 3: Commit changes**

```bash
git add studio/schema/partner.ts studio/schema/index.ts
git commit -m "feat(sanity): add partner schema"
```

---

### Task 2: Update Site Settings Schema & Desk

**Files:**
- Modify: `studio/schema/siteSettings.ts`
- Modify: `studio/sanity.config.ts`

- [ ] **Step 1: Update `siteSettings.ts`**

Add these fields to the end of the `fields` array in `studio/schema/siteSettings.ts`:

```typescript
    // Partners Page Content
    defineField({
      name: 'partnersHeroTitle',
      title: 'Partners Hero Title',
      type: 'string',
    }),
    defineField({
      name: 'partnersHeroSubtitle',
      title: 'Partners Hero Subtitle',
      type: 'text',
    }),
    defineField({
      name: 'partnersProspectusFile',
      title: 'Partners Prospectus PDF',
      type: 'file',
    }),
```

- [ ] **Step 2: Update Desk Structure in `sanity.config.ts`**

Add the `partner` document type to the list in `deskTool` items (it's not a singleton).

```typescript
// ... inside S.list().items([...])
            S.documentTypeListItem("partner").title("Partners"),
// ...
```

- [ ] **Step 3: Deploy to Sanity**

Run: `cd studio && npx sanity deploy`

- [ ] **Step 4: Commit changes**

```bash
git add studio/schema/siteSettings.ts studio/sanity.config.ts
git commit -m "feat(sanity): add partners fields to siteSettings and update desk"
```

---

### Task 3: Update Frontend Hooks

**Files:**
- Modify: `src/hooks/useSanityData.ts`

- [ ] **Step 1: Update `SiteSettings` interface**

```typescript
export interface SiteSettings {
  // ... existing
  partnersHeroTitle?: string;
  partnersHeroSubtitle?: string;
  partnersProspectusUrl?: string;
}
```

- [ ] **Step 2: Update `useSiteSettings` query**

Add the prospectus URL de-reference:

```typescript
// ... inside query
    "partnersProspectusUrl": partnersProspectusFile.asset->url
// ...
```

- [ ] **Step 3: Create `Partner` interface and `usePartners` hook**

Add to the end of `src/hooks/useSanityData.ts`:

```typescript
export interface Partner {
  name: string;
  domain?: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  logoUrl?: string;
  order?: number;
}

export function usePartners() {
  const query = groq`*[_type == "partner"] | order(order asc){
    ...,
    "logoUrl": logo.asset->url
  }`;
  const { data, loading, error } = useDataFetching<Partner[]>(query);
  return { partners: data || [], loading, error };
}
```

- [ ] **Step 4: Commit changes**

```bash
git add src/hooks/useSanityData.ts
git commit -m "feat(web): add usePartners hook and update site settings"
```

---

### Task 4: Integrate Partners Page

**Files:**
- Modify: `src/app/pages/PartnersPage.tsx`

- [ ] **Step 1: Update `PartnersPage.tsx` logic**

```typescript
import { usePartners, useSiteSettings } from "../../hooks/useSanityData";

export function PartnersPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { partners: sanityPartners, loading: partnersLoading } = usePartners();

  const loading = settingsLoading || partnersLoading;

  // Fallbacks
  const heroTitle = settings?.partnersHeroTitle || "Empowering the next generation of innovators";
  const heroSubtitle = settings?.partnersHeroSubtitle || "Our partners provide the resources, mentorship, and opportunities that allow our members to push the boundaries of what's possible in engineering.";
  const prospectusUrl = settings?.partnersProspectusUrl || "/documents/constitution/Constitution_of_IEEE.pdf";

  const staticPartners = [
    { name: "Texas Instruments", domain: "ti.com", tier: "Gold" },
    // ... rest of them
  ];

  const partners = sanityPartners.length > 0 ? sanityPartners : staticPartners;

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--boiler-black)", color: "var(--text-primary)" }}>Loading...</div>;
  }
  
  // Update JSX to use heroTitle, heroSubtitle, and prospectusUrl
  // Update PartnerCard to use logoUrl if it exists, otherwise Clearbit
```

- [ ] **Step 2: Update `PartnerCard` component**

```tsx
function PartnerCard({ partner, isLight }: { partner: any, isLight: boolean }) {
  const logoSrc = partner.logoUrl || `https://logo.clearbit.com/${partner.domain}`;
  // ...
```

- [ ] **Step 3: Commit changes**

```bash
git add src/app/pages/PartnersPage.tsx
git commit -m "feat(web): dynamic partners page with sanity"
```

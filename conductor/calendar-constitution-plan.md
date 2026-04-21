# Calendar & Constitution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Calendar and Constitution page data into Sanity via the `siteSettings` singleton.

**Architecture:** Expand the existing `siteSettings` Sanity schema with new fields for calendar URLs and constitution document uploads. Update the `useSiteSettings` hook to fetch these fields and update the respective page components.

**Tech Stack:** React, Sanity, GROQ, Vite

---

### Task 1: Update Sanity Schema

**Files:**
- Modify: `studio/schema/siteSettings.ts`

- [ ] **Step 1: Update `siteSettings.ts` fields**

```typescript
// studio/schema/siteSettings.ts
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // Existing fields (discordUrl, duesDescription, duesBenefits, duesOptions, paymentUrl)
    // ...
    
    // Calendar Data
    defineField({
      name: 'calendarUrl',
      title: 'Google Calendar Embed URL',
      type: 'url',
      description: 'The URL for the Google Calendar embed.',
    }),
    defineField({
      name: 'calendarId',
      title: 'Google Calendar ID',
      type: 'string',
      description: 'The direct Google Calendar ID (used in the subscribe link).',
    }),
    
    // Constitution Data
    defineField({
      name: 'branchConstitution',
      title: 'Branch Constitution',
      type: 'object',
      fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'pdfFile', title: 'PDF File', type: 'file' },
      ],
    }),
    defineField({
      name: 'committeeBylaws',
      title: 'Committee Bylaws',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'pdfFile', title: 'PDF File', type: 'file' },
          ],
        },
      ],
    }),
  ],
})
```

- [ ] **Step 2: Deploy to Sanity**

Run: `cd studio && npx sanity deploy`

- [ ] **Step 3: Commit changes**

```bash
git add studio/schema/siteSettings.ts
git commit -m "feat(sanity): add calendar and constitution fields to siteSettings"
```

---

### Task 2: Update Frontend Data Hook

**Files:**
- Modify: `src/hooks/useSanityData.ts`

- [ ] **Step 1: Update `SiteSettings` interface**

```typescript
export interface SiteSettings {
  // Existing fields
  discordUrl?: string;
  duesDescription?: string;
  duesBenefits?: string[];
  duesOptions?: {
    name: string;
    subtitle: string;
    price: string;
  }[];
  paymentUrl?: string;
  
  // New fields
  calendarUrl?: string;
  calendarId?: string;
  branchConstitution?: {
    name: string;
    description: string;
    pdfUrl: string;
  };
  committeeBylaws?: {
    name: string;
    pdfUrl: string;
  }[];
}
```

- [ ] **Step 2: Update the `useSiteSettings` hook GROQ query**

```typescript
export function useSiteSettings() {
  const query = groq`*[_type == "siteSettings"][0]{
    ...,
    branchConstitution{
      ...,
      "pdfUrl": pdfFile.asset->url
    },
    committeeBylaws[]{
      ...,
      "pdfUrl": pdfFile.asset->url
    }
  }`;
  const { data, loading, error } = useDataFetching<SiteSettings>(query);
  return { settings: data, loading, error };
}
```

- [ ] **Step 3: Commit changes**

```bash
git add src/hooks/useSanityData.ts
git commit -m "feat(web): update useSiteSettings hook for calendar and constitution data"
```

---

### Task 3: Integrate Calendar Page

**Files:**
- Modify: `src/app/pages/CalendarPage.tsx`

- [ ] **Step 1: Use `useSiteSettings` in `CalendarPage.tsx`**

Replace hardcoded URLs and IDs with the data from the hook.

```typescript
import { useSiteSettings } from "../../hooks/useSanityData";

export function CalendarPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { settings, loading } = useSiteSettings();
  
  // Use the Sanity settings or fall back to the existing hardcoded values
  const calendarId = settings?.calendarId || "7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1@group.calendar.google.com";
  const calendarBaseUrl = settings?.calendarUrl || `https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=America%2FIndiana%2FIndianapolis&color=%2300629B`;
  const subscribeUrl = `https://calendar.google.com/calendar/u/0/r?cid=${calendarId}`;

  // ... (use loading state similarly to Join Page)
```

- [ ] **Step 2: Commit changes**

```bash
git add src/app/pages/CalendarPage.tsx
git commit -m "feat(web): dynamic calendar page with sanity"
```

---

### Task 4: Integrate Constitution Page

**Files:**
- Modify: `src/app/pages/ConstitutionPage.tsx`

- [ ] **Step 1: Use `useSiteSettings` in `ConstitutionPage.tsx`**

Map over the dynamic `branchConstitution` and `committeeBylaws`.

```typescript
import { useSiteSettings } from "../../hooks/useSanityData";

export function ConstitutionPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, loading } = useSiteSettings();

  // ... (use loading state similarly)
  
  // Replace the hardcoded `coreDocs` and `committeeBylaws` assignments
  const coreDocs = settings?.branchConstitution ? [settings.branchConstitution] : [
    { name: "Purdue IEEE Constitution", description: "The foundational governing document of the Purdue IEEE Student Branch.", pdfUrl: "/documents/constitution/Constitution_of_IEEE.pdf" },
  ];

  const bylaws = settings?.committeeBylaws || [
    { name: "CSociety Bylaws", pdfUrl: "/documents/constitution/csociety_bylaws.pdf" },
    // ...
  ];
```

- [ ] **Step 2: Commit changes**

```bash
git add src/app/pages/ConstitutionPage.tsx
git commit -m "feat(web): dynamic constitution page with sanity"
```

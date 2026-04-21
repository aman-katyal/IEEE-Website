# Join Page Sanity Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Join Page static content to Sanity CMS via a new `siteSettings` singleton document.

**Architecture:** A new Sanity `document` type will be defined for global site settings. A corresponding React hook with a GROQ query will fetch these settings and populate the `JoinPage.tsx` component.

**Tech Stack:** React, Tailwind CSS, Sanity v3 (deskTool), GROQ, Vite

---

### Task 1: Create Sanity Schema

**Files:**
- Create: `studio/schema/siteSettings.ts`
- Modify: `studio/schema/index.ts`
- Modify: `studio/sanity.config.ts`

- [ ] **Step 1: Write `siteSettings.ts`**

```typescript
// studio/schema/siteSettings.ts
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'discordUrl',
      title: 'Discord Invite URL',
      type: 'url',
    }),
    defineField({
      name: 'duesDescription',
      title: 'Dues Description',
      type: 'text',
      description: 'Text explaining the dues payment process.',
    }),
    defineField({
      name: 'duesBenefits',
      title: 'Dues Benefits',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'duesOptions',
      title: 'Dues Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'subtitle', title: 'Subtitle', type: 'string' },
            { name: 'price', title: 'Price', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'paymentUrl',
      title: 'TooCool Payment URL',
      type: 'url',
    }),
  ],
})
```

- [ ] **Step 2: Export schema in `index.ts`**

```typescript
// Modify studio/schema/index.ts
import { committee } from './committee'
import { leader } from './leader'
import { cornerstone } from './cornerstone'
import { officersConfig } from './officersConfig'
import { siteSettings } from './siteSettings'

export const schemaTypes = [committee, leader, cornerstone, officersConfig, siteSettings]
```

- [ ] **Step 3: Define Singleton Desk Structure in `sanity.config.ts`**

```typescript
// Modify studio/sanity.config.ts
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schema'

// Define the singleton document types
const singletonActions = new Set(["publish", "discardChanges", "restore"])
const singletonTypes = new Set(["officersConfig", "siteSettings"])

export default defineConfig({
  name: 'default',
  title: 'Purdue IEEE CMS',

  projectId: 'vq0v7yv4',
  dataset: 'production',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Our singleton type has a list item with a custom child
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("Officers Config")
              .id("officersConfig")
              .child(
                S.document()
                  .schemaType("officersConfig")
                  .documentId("officersConfig")
              ),
            // Regular document types
            S.documentTypeListItem("committee").title("Committees"),
            S.documentTypeListItem("cornerstone").title("Cornerstone Committees"),
            S.documentTypeListItem("leader").title("Leaders"),
          ]),
    }),
    presentationTool({
      previewUrl: {
        origin: (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
          ? 'http://localhost:5173' 
          : 'https://ieee-website-9ix.pages.dev',
        previewMode: {
          enable: '/', // Match the frontend's preview route
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
    // Filter out singleton types from the global "New document" menu options
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
```

- [ ] **Step 4: Verify typecheck**

Run: `cd studio && npm run build` (or `tsc --noEmit`) to verify syntax errors. 
Note: Ensure there are no errors before committing.

- [ ] **Step 5: Commit changes**

```bash
git add studio/schema/siteSettings.ts studio/schema/index.ts studio/sanity.config.ts
git commit -m "feat(sanity): add siteSettings singleton schema and custom desk structure"
```

---

### Task 2: Frontend Data Hook

**Files:**
- Modify: `src/hooks/useSanityData.ts`

- [ ] **Step 1: Write `SiteSettings` interface and `useSiteSettings` hook**

Add the following to the end of `src/hooks/useSanityData.ts`:

```typescript
export interface SiteSettings {
  discordUrl?: string;
  duesDescription?: string;
  duesBenefits?: string[];
  duesOptions?: {
    name: string;
    subtitle: string;
    price: string;
  }[];
  paymentUrl?: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const query = `*[_type == "siteSettings"][0]`;
        const result = await client.fetch(query);
        setSettings(result);
      } catch (error) {
        console.error("Error fetching site settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run build` or `tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit changes**

```bash
git add src/hooks/useSanityData.ts
git commit -m "feat(web): add useSiteSettings hook for fetching global configuration"
```

---

### Task 3: Join Page Integration

**Files:**
- Modify: `src/app/pages/JoinPage.tsx`

- [ ] **Step 1: Import the hook**

In `src/app/pages/JoinPage.tsx`, add the import:
```typescript
import { useSiteSettings } from "../../hooks/useSanityData";
```

- [ ] **Step 2: Update the JoinPage component logic**

Replace the hardcoded strings with the hook data. Also add a fallback or loading state.

```typescript
// Replace the top of the JoinPage component function with:
export function JoinPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const defaultDuesBenefits = [
    "Access to industry networks and exclusive company info sessions",
    "Trip expense coverage for committee competitions and social events",
    "Free food at General Assemblies",
    "Recognition for contributed work with final projects",
  ];

  const duesBenefits = settings?.duesBenefits || defaultDuesBenefits;
  const discordUrl = settings?.discordUrl || "https://discord.gg/sPPQequ9ws";
  const paymentUrl = settings?.paymentUrl || "https://www.toocoolpurdue.com/TooCOOLPurdueWL/vECItemCatalogOrganizationItems/OrganizationItemsGallery.aspx";
  const duesDescription = settings?.duesDescription || "Purdue IEEE Student Branch requires payment of dues for membership. To pay, follow the link below and search for \"IEEE\" in the catalog search box. Payment gives access to:";
  const defaultOptions = [
    { name: "Standard Membership", subtitle: "Local dues only", price: "$10" },
    { name: "Membership + Shirt", subtitle: "Support the branch & gear up", price: "$15" }
  ];
  const duesOptions = settings?.duesOptions || defaultOptions;

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--boiler-black)", color: "var(--text-primary)" }}>Loading...</div>;
  }
```

- [ ] **Step 3: Update the JSX bindings**

Replace the hardcoded JSX. 

For the Discord link:
```tsx
<a href={discordUrl} target="_blank" ... >
```

For the dues description:
```tsx
<p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "24px" }}>
  {duesDescription}
</p>
```

For the dues options mapping (replace the two hardcoded options):
```tsx
<div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
  {duesOptions.map((option, idx) => (
    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "16px" }}>
      <div>
        <span style={{ display: "block", color: "var(--text-primary)", fontWeight: 600 }}>{option.name}</span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", opacity: isLight ? 1 : 0.8 }}>{option.subtitle}</span>
      </div>
      <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--electric-blue)" }}>{option.price}</span>
    </div>
  ))}
</div>
```

For the TooCool link:
```tsx
<a href={paymentUrl} target="_blank" ...>
```

- [ ] **Step 4: Verify Vite build / test**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add src/app/pages/JoinPage.tsx
git commit -m "feat(web): integrate sanity siteSettings into Join Page"
```
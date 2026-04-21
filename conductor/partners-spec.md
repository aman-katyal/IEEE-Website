# Partners Page Sanity Migration Specification

## 1. Background & Motivation
This specification details the migration of the Partners Page (`PartnersPage.tsx`) to Sanity CMS. To support dynamic management of corporate partners and their respective tiers, we will introduce a new `partner` document type and expand the `siteSettings` singleton for page-level metadata.

## 2. Scope
The scope of this project includes:
- Creating a new `partner` document type in Sanity.
- Updating the `siteSettings` singleton to include Partners Page hero content and the prospectus PDF.
- Creating a `usePartners` hook and updating `useSiteSettings` to fetch the new data.
- Updating `src/app/pages/PartnersPage.tsx` to pull dynamic data.

## 3. Proposed Solution

### 3.1. Sanity Schemas

#### 3.1.1. Partner Document (`studio/schema/partner.ts`)
- `name`: String (The company name)
- `domain`: String (The company domain, e.g., `intel.com`)
- `tier`: String (Selection: "Gold", "Silver", "Bronze")
- `logo`: Image (Optional override for the automated Clearbit logo)
- `order`: Number (For manual sorting within tiers)

#### 3.1.2. Site Settings Update (`studio/schema/siteSettings.ts`)
- `partnersHeroTitle`: String
- `partnersHeroSubtitle`: Text
- `partnersProspectusFile`: File (Upload for the prospectus PDF)

### 3.2. Frontend Integration (`src/hooks/useSanityData.ts`)

#### 3.2.1. `usePartners` Hook
- Query: `*[_type == "partner"] | order(order asc)`
- Returns: An array of partners with their tier, domain, and optional logo URL.

#### 3.2.2. `useSiteSettings` Update
- Add `partnersHeroTitle`, `partnersHeroSubtitle`, and `partnersProspectusUrl` (de-referenced from the asset) to the returned settings.

### 3.3. Partners Page Integration (`src/app/pages/PartnersPage.tsx`)
- Import and execute `usePartners` and `useSiteSettings`.
- Use dynamic hero content and prospectus link.
- Filter and render the partners from Sanity, grouped by their tier (Gold, Silver, Bronze).
- Maintain the Clearbit logo integration as the default, with the Sanity `logo` field as an override.

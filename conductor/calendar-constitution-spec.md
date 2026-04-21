# Calendar & Constitution Sanity Migration Specification

## 1. Background & Motivation
This specification details the migration of the Calendar (`CalendarPage.tsx`) and Constitution (`ConstitutionPage.tsx`) pages. Following the "Centralized Configuration" approach, their data will be integrated into the existing `siteSettings` Sanity singleton.

## 2. Scope
The scope of this project is strictly limited to:
- Updating the `siteSettings` singleton schema in Sanity Studio to include Calendar and Constitution data.
- Updating the `useSiteSettings` React hook to fetch these new fields.
- Updating `src/app/pages/CalendarPage.tsx` and `src/app/pages/ConstitutionPage.tsx` to pull dynamic data from Sanity.
- Uploading initial PDFs (Constitution and Bylaws) to Sanity.

## 3. Proposed Solution

### 3.1. Sanity Schema Update (`studio/schema/siteSettings.ts`)
The `siteSettings` schema will be expanded with the following fields:
- **Calendar Data:**
  - `calendarUrl`: URL for the Google Calendar embed.
  - `calendarId`: String for the public Google Calendar ID.
- **Constitution Data:**
  - `branchConstitution`: An object containing:
    - `name`: String (e.g., "Purdue IEEE Constitution")
    - `description`: Text (description of the doc)
    - `pdfFile`: File (upload field for the PDF)
  - `committeeBylaws`: An array of objects. Each object will contain:
    - `name`: String (e.g., "CSociety Bylaws")
    - `pdfFile`: File (upload field for the PDF)

### 3.2. Frontend Integration (`src/hooks/useSanityData.ts`)
The `SiteSettings` interface and `useSiteSettings` hook will be updated:
- Add `calendarUrl`, `calendarId`, `branchConstitution`, and `committeeBylaws` to the `SiteSettings` interface.
- Update the GROQ query in `useSiteSettings` to de-reference the PDF files:
  ```groq
  *[_type == "siteSettings"][0]{
    ...,
    branchConstitution{
      ...,
      "pdfUrl": pdfFile.asset->url
    },
    committeeBylaws[]{
      ...,
      "pdfUrl": pdfFile.asset->url
    }
  }
  ```

### 3.3. Calendar Page Integration (`src/app/pages/CalendarPage.tsx`)
- Import and execute `useSiteSettings`.
- Use `settings.calendarUrl` as the source for the calendar `<iframe>`.
- Use `settings.calendarId` for the "Subscribe to Calendar" link.

### 3.4. Constitution Page Integration (`src/app/pages/ConstitutionPage.tsx`)
- Import and execute `useSiteSettings`.
- Replace hardcoded `coreDocs` and `committeeBylaws` arrays with data from Sanity.
- Ensure the "View PDF" and external links point to the `pdfUrl` from Sanity.

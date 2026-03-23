# Track Specification: Categorized and Orderable Officers Page

## Overview
This track focuses on standardizing the Officers page by splitting it into functional sections and implementing an intuitive drag-and-drop reordering system in Sanity CMS. This will allow for easier management of leadership hierarchies and better visual organization.

## Functional Requirements
- **Sanity Schema Updates:**
  - **Leader Schema:**
    - Add a `category` field (Executive, Technical, Operations, Member Involvement).
    - *Optional:* Keep the `order` field as a fallback, or deprecate it in favor of the new configuration.
  - **Officers Configuration (Singleton):**
    - Create a new singleton document `officersConfig`.
    - Define four array fields, one for each category (e.g., `executiveOrder`, `technicalOrder`, etc.).
    - Each array will contain **References** to `leader` documents.
    - Sanity's native array interface will allow editors to **drag-and-drop** these references to change the display order.
- **Frontend Logic:**
  - Update `OfficersPage` to fetch the `officersConfig` and use the order of references to render the leaders in their respective sections.
  - Implement fallback logic if a leader is not explicitly ordered in the configuration.
- **UI/UX Enhancements:**
  - **Sectioned Grid:** Visual headings for each category.
  - **Mobile Accordions:** Collapsible sections on mobile devices.
  - **Preserve Effects:** Maintain magnetic and glow effects.

## Non-Functional Requirements
- **Ease of Use:** Reducing the cognitive load for content editors by providing a visual ordering interface.
- **Data Consistency:** Ensuring that all published leaders are accounted for in the ordering configuration.

## Acceptance Criteria
- [ ] Editors can drag-and-drop officer references in Sanity to reorder them within categories.
- [ ] The Officers page displays leaders in the exact order defined in Sanity.
- [ ] Mobile users see collapsed sections by default or can easily toggle them.

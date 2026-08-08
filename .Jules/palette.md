## 2024-07-29 - Improve Filter Button Group Accessibility
**Learning:** Filter button groups require a role of "group" and an aria-label to contextualize the grouping for screen readers. Individual toggle buttons need aria-pressed for their state, and standalone text like "All" must be contextualized using aria-label (e.g., "Show all committees").
**Action:** Always wrap lists of filter/toggle buttons in an explicit group role with an accessible name, ensure aria-pressed is tied to the selected state, and review labels for isolated terms that lack context.
## 2024-08-08 - Added role and aria-label to committee view mode toggle
**Learning:** Found a group of toggle buttons for 'Technical Committees', 'Involvement', and 'Operations' lacking a grouping role, which makes it harder for screen readers to understand the buttons are related choices.
**Action:** Always wrap segmented controls or groups of related filter buttons in a container with `role="group"` and an `aria-label` to provide context.

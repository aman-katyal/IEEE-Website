## 2024-07-29 - Improve Filter Button Group Accessibility
**Learning:** Filter button groups require a role of "group" and an aria-label to contextualize the grouping for screen readers. Individual toggle buttons need aria-pressed for their state, and standalone text like "All" must be contextualized using aria-label (e.g., "Show all committees").
**Action:** Always wrap lists of filter/toggle buttons in an explicit group role with an accessible name, ensure aria-pressed is tied to the selected state, and review labels for isolated terms that lack context.

## 2026-08-07 - Committee View Mode Toggle Accessibility
**Learning:** Filter/view mode toggle button groups lack screen reader context without proper roles. Adding `role="group"` and a descriptive `aria-label` to the wrapping container ensures users navigating with assistive technologies understand the purpose of the button grouping.
**Action:** When implementing view toggles or filter button clusters, ensure the container has `role="group"` and a descriptive `aria-label`.

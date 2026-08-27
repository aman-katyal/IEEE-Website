## 2024-07-29 - Improve Filter Button Group Accessibility
**Learning:** Filter button groups require a role of "group" and an aria-label to contextualize the grouping for screen readers. Individual toggle buttons need aria-pressed for their state, and standalone text like "All" must be contextualized using aria-label (e.g., "Show all committees").
**Action:** Always wrap lists of filter/toggle buttons in an explicit group role with an accessible name, ensure aria-pressed is tied to the selected state, and review labels for isolated terms that lack context.

## 2026-08-11 - Contextualize Event Action Links
**Learning:** Generic links like 'Add' or 'Add to Google Calendar' within lists of events can lose meaning when read out of context by screen readers or accessed via an element list.
**Action:** Always provide explicit `aria-label` attributes that incorporate unique identifying details (like `event.title`) for repeated interaction links within lists or cards.

## 2026-08-13 - ARIA Group Role on Committee Toggle Buttons
**Learning:** Filter button groups in React lack accessibility roles and labels for context.
**Action:** Always wrap the container in `role="group"` with a descriptive `aria-label`, and use `aria-pressed` on the individual toggle buttons. Standalone text like 'All' must be contextualized using `aria-label`.
## 2024-08-27 - Contextualize Filter Buttons
**Learning:** Generic visually hidden labels or text-only tags like "Payments" or "Credits" inside a filter button group can lose context when read by screen readers. Furthermore, attempting to use the visible text within an aria-label requires keeping the visible text exact, or WCAG 2.5.3 issues (Label in Name) may arise for voice control users.
**Action:** Always verify that `aria-label` includes the exact visible text as a substring (e.g., `aria-label="Show Debits transactions"` rather than `aria-label="Show debit transactions"` if the visible text is "Debits") when contextualizing isolated filter toggle buttons.

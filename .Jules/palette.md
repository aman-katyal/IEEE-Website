## 2024-07-29 - Improve Filter Button Group Accessibility
**Learning:** Filter button groups require a role of "group" and an aria-label to contextualize the grouping for screen readers. Individual toggle buttons need aria-pressed for their state, and standalone text like "All" must be contextualized using aria-label (e.g., "Show all committees").
**Action:** Always wrap lists of filter/toggle buttons in an explicit group role with an accessible name, ensure aria-pressed is tied to the selected state, and review labels for isolated terms that lack context.

## 2026-08-11 - Contextualize Event Action Links
**Learning:** Generic links like 'Add' or 'Add to Google Calendar' within lists of events can lose meaning when read out of context by screen readers or accessed via an element list.
**Action:** Always provide explicit `aria-label` attributes that incorporate unique identifying details (like `event.title`) for repeated interaction links within lists or cards.

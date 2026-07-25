# Bolt's Journal
## 2026-07-20 - Found potential context provider optimization
**Learning:** Found that `useSiteSettings` is called in multiple components (`JoinCTA`, `BentoHero`, `Footer`, `Navigation`, `PartnersPage`, `JoinPage`, `CalendarPage`, `ConstitutionPage`), causing redundant fetches or cache hits across the tree, and each hook maintains its own state (`data`, `loading`, `error`) which can lead to multiple re-renders. A global context similar to `HomePageContext` would prevent this.
**Action:** Can extract `useSiteSettings` into a context provider.

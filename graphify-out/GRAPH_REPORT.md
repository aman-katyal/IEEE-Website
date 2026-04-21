# Graph Report - .  (2026-04-11)

## Corpus Check
- Large corpus: 268 files · ~892,413 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 642 nodes · 633 edges · 134 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Purdue IEEE Student Branch` - 23 edges
2. `useDataFetching()` - 12 edges
3. `useSanityData` - 11 edges
4. `Sanity CMS` - 9 edges
5. `Purdue IEEE Website` - 7 edges
6. `Purdue IEEE Design Guidelines` - 7 edges
7. `Software Saturdays` - 7 edges
8. `Captain` - 6 edges
9. `Website Schema Index` - 6 edges
10. `g()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Jonah Femrite` --conceptually_related_to--> `Purdue IEEE Student Branch`  [INFERRED]
  images\officers\jonah_femrite.png → public\documents\constitution\Constitution_of_IEEE.pdf
- `Jonathon Reilly` --conceptually_related_to--> `Purdue IEEE Student Branch`  [INFERRED]
  images\officers\jonathon_reilly.png → public\documents\constitution\Constitution_of_IEEE.pdf
- `Lee Haglid` --conceptually_related_to--> `Purdue IEEE Student Branch`  [INFERRED]
  images\officers\lee_haglid.png → public\documents\constitution\Constitution_of_IEEE.pdf
- `Mason Fleming` --conceptually_related_to--> `Purdue IEEE Student Branch`  [INFERRED]
  images\officers\mason_fleming.png → public\documents\constitution\Constitution_of_IEEE.pdf
- `Max Vallone` --conceptually_related_to--> `Purdue IEEE Student Branch`  [INFERRED]
  images\officers\max_vallone.png → public\documents\constitution\Constitution_of_IEEE.pdf

## Hyperedges (group relationships)
- **Sanity Integration Flow** — site_settings_schema, use_site_settings_hook, join_page, calendar_page, constitution_page, partners_page [INFERRED 0.85]
- **Project Testing Infrastructure** — playwright_config, vitest_config, purdue_ieee_website [EXTRACTED 1.00]
- **Sanity Content Ecosystem** — sanity_cms, groq, visual_editing, officers_config [INFERRED 0.90]
- **Modern Frontend Stack** — react_18, vite, tailwind_css_v4, framer_motion [INFERRED 0.95]
- **Performance & Snappiness Flow** — custom_cursor, skeleton_loaders, track_performance_snappiness [INFERRED 0.85]
- **Documentation Track** — spec_project_doc, sanity_guide, developer_guide, design_guidelines, maintenance_guide [EXTRACTED 0.90]
- **Project Style Guides** — general_styleguide, html_css_styleguide, js_styleguide, ts_styleguide [INFERRED 0.85]
- **Istanbul Coverage UI Scripts** — block_navigation, prettify, sorter [INFERRED 0.90]
- **IEEE Logo Assets** — img_logo_svg, img_logo_clean, img_pieee_logo_v3 [INFERRED 0.90]
- **IEEE Officer Portraits** — img_officer_aiyan, img_officer_al, img_officer_aman, img_officer_aniket, img_officer_daniel, img_officer_dishan [INFERRED 0.95]
- **IEEE General Activities** — img_soldering, img_circuits, img_corp_partner, img_club_callout, img_ieee_whole_team [INFERRED 0.85]
- **Officers of Purdue IEEE** — jonah_femrite, jonathon_reilly, lee_haglid, mason_fleming, max_vallone, officer_2, rhea_virk, ryan_baker, ryan_wans, saishri_bagde, shidan_wan, sia_gupta, soumil_verma, su_park, tarakanath_peddi [INFERRED 0.90]
- **Purdue IEEE Technical Committees** — ieee_computer_society, ieee_embs, ieee_smc, ieee_mtts, ieee_racing [EXTRACTED 1.00]
- **ROV Technical Team Leads** — rov_bylaws_technical_team_lead, rov_bylaws_electrical_team_lead, rov_bylaws_mechanical_team_lead, rov_bylaws_software_team_lead [EXTRACTED 1.00]
- **Software Saturdays Mentors** — swsat_bylaws_volunteer_mentor, swsat_bylaws_employed_mentor [EXTRACTED 1.00]
- **Purdue IEEE Logos** — image_logo_svg, image_logo_clean, image_pieee_logo_v3 [INFERRED 0.90]
- **Purdue IEEE Officers** — person_alpamys_sultanbek, person_aiyan_alam, person_max_vallone, person_aman_katyal, person_daniel_ng, person_saishri_bagde, person_jonathon_reilly, person_shidan_wan, person_su_park, person_soumil_verma, person_tarakanath_peddi, person_dishan_bhattacharya, person_mason_fleming, person_ryan_wans, person_sia_gupta, person_rhea_virk, person_lee_haglid, person_jonah_femrite, person_aniket_iyer, person_ryan_baker [INFERRED 0.85]
- **Radix-based UI Primitives** — ui_accordion, ui_alert_dialog, ui_alert, ui_aspect_ratio, ui_avatar, ui_badge [EXTRACTED 1.00]
- **Home Page Core Sections** — hero, cornerstone_committees, events, join_cta, stats, tech_marquee [INFERRED 0.95]
- **Interactive Motion System** — magnetic_button, page_transition, ux_effects [INFERRED 0.90]
- **Overlay UI Components** — ui_dialog, ui_drawer, ui_dropdown_menu, ui_context_menu, ui_menubar, ui_hover_card, ui_command [INFERRED 0.90]
- **Form Control System** — ui_form, ui_label, ui_input, ui_checkbox, ui_input_otp [INFERRED 0.95]
- **Navigational Affordances** — ui_breadcrumb, ui_pagination, ui_navigation_menu [INFERRED 0.85]
- **Sidebar Architectural Pattern** — ui_sidebar, ui_use_mobile, ui_sheet, ui_tooltip [EXTRACTED 0.95]
- **Floating Overlay Components** — ui_popover, ui_tooltip, ui_select, ui_sheet [INFERRED 0.90]
- **IEEE Organizational Mission Pillars** — concept_excellence, concept_technical_growth, concept_professional_success [EXTRACTED 1.00]
- **Sanity Data Fetching Flow** — lib_sanity, hooks_usesanitydata, pages_officerspage, pages_partnerspage, pages_joinpage [EXTRACTED 1.00]
- **Committee Management Pattern** — data_committees_types, data_committees_index, pages_committeepage, pages_committeespage [EXTRACTED 1.00]
- **Global Site Settings Distribution** — hooks_usesanitydata, pages_calendarpage, pages_constitutionpage, pages_joinpage, pages_partnerspage [INFERRED 0.90]
- **Sanity Singleton Types** — schema_officers_config, schema_home_page, schema_about_page [EXTRACTED 1.00]
- **IEEE Schema System** — schema_about_page, schema_committee, schema_cornerstone, schema_home_page, schema_leader, schema_officers_config, schema_partner [EXTRACTED 1.00]
- **Site Reliability and Performance Flow** — concept_performance_optimization, concept_security_hardening, todo_site_improvements [EXTRACTED 0.95]
- **Site Configuration and Metadata System** — sitesettings_schema, concept_dues_management, concept_governance_docs [EXTRACTED 1.00]
- **Verification and Testing Suite** — tests_example, tests_core_flows, todo_site_improvements [INFERRED 0.85]

## Communities

### Community 0 - "UI Components (Radix UI)"
Cohesion: 0.02
Nodes (2): CarouselNext(), useCarousel()

### Community 1 - "Pages and Data Hooks"
Cohesion: 0.06
Nodes (15): Track: Fix Sanity Visual Editing Connection, getCacheKey(), prefetchData(), useAboutPage(), useCommittee(), useCommittees(), useCornerstoneCommittees(), useDataFetching() (+7 more)

### Community 2 - "IEEE Officers and Portraits"
Cohesion: 0.06
Nodes (34): Jonah Femrite (Image), Jonathon Reilly (Image), Lee Haglid (Image), Mason Fleming (Image), Max Vallone (Image), Rhea Virk (Image), Ryan Baker (Image), Ryan Wans (Image) (+26 more)

### Community 3 - "Forms and Navigation Primitives"
Cohesion: 0.07
Nodes (2): SidebarMenuButton(), useSidebar()

### Community 4 - "ROV and Software Saturdays Teams"
Cohesion: 0.08
Nodes (26): ROV Pool Test Racing, ROV Pool Test, ROV Team Photo, Captain, Electrical Team Lead, IEEE Executive Committee, IEEE Treasurer, MATE Center International ROV Competition (+18 more)

### Community 5 - "Constitution and Governance"
Cohesion: 0.1
Nodes (25): Constitution of IEEE, IEEE Computer Society Chapter, IEEE EMBS Chapter, IEEE Executive Committee, IEEE MTT-S Chapter, IEEE Racing Team, IEEE SMC Chapter, Technical Goal (+17 more)

### Community 6 - "Layout and Branding"
Cohesion: 0.1
Nodes (6): GROQ, IeeePurdueLogo, JoinCTA, MagneticButton, ThemeToggle, UXEffects

### Community 7 - "Infrastructure and Configuration"
Cohesion: 0.13
Nodes (8): Cloudflare PagesFunction Type, Logo Processing Script, Product Guidelines, Purdue IEEE Website, Tech Stack, onRequest(), Vite, Development Workflow

### Community 8 - "Project Roadmap and Rationale"
Cohesion: 0.15
Nodes (15): Product Definition, Tech Stack, Custom Cursor, Framer Motion, officersConfig (Sanity Singleton), Rationale for Performance Targets, Rationale for Sanity Integration, React 18 (+7 more)

### Community 9 - "Sanity Integration and Data Flow"
Cohesion: 0.14
Nodes (15): Sanity Fallback Pattern, CALENDAR_CONFIG, Committee Data Barrel, Committee Types, Leaders Data, useGoogleCalendarEvents, useSanityData, Sanity Client Config (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.27
Nodes (11): addSortIndicators(), enableUI(), getNthColumn(), getTable(), getTableBody(), getTableHeader(), loadColumns(), loadData() (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.21
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 0.35
Nodes (8): a(), B(), D(), g(), i(), k(), Q(), y()

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 0.22
Nodes (4): fmtDay(), fmtYear(), buildAddToCalendarUrl(), parseEvent()

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (11): Glow & Selection FX, MagneticWrapper Component, Design & Brand Guidelines, Developer Onboarding Guide, Maintenance & Deployment Guide, Text Contrast Improvement Implementation Plan, UI/UX Standardization Plan, Content Editor Guide (Sanity CMS) (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (9): Centralized Data Architecture, Dual Theme (Dark/Light), Framer Motion Animations, Glassmorphism UI, Standardized Grid Layout, Typography Standards, WCAG AA Accessibility, Purdue IEEE Design Guidelines (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.36
Nodes (4): FormControl(), FormDescription(), FormMessage(), useFormField()

### Community 20 - "Community 20"
Cohesion: 0.25
Nodes (8): Calendar Page, Constitution Page, Join Page, Sanity Partner Schema, Partners Page, Sanity Site Settings Schema, usePartners Hook, useSiteSettings Hook

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (8): About Us Page Schema, Committee Schema, Cornerstone Committee Schema, Home Page Schema, Website Schema Index, Leader/Officer Schema, Officers Configuration Schema, Leader Schema Test

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (8): Dues and Benefits Management, Branch Governance Documents, Frontend Performance Optimization, Security and CMS Protection, Site Settings Sanity Schema, Purdue IEEE Core E2E Tests, Playwright Example Tests, Site Improvements Roadmap

### Community 23 - "Community 23"
Cohesion: 0.29
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (7): Popover Component, Separator Component, Sheet (Drawer) Component, Sidebar Component, Skeleton Loader Component, Tooltip Component, useIsMobile Hook

### Community 26 - "Community 26"
Cohesion: 0.7
Nodes (4): goToNext(), goToPrevious(), makeCurrent(), toggleClass()

### Community 27 - "Community 27"
Cohesion: 0.4
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 0.4
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 0.4
Nodes (5): App, BackToTop Component, src/app/App.test.tsx, src/main.tsx, @sanity/visual-editing

### Community 30 - "Community 30"
Cohesion: 0.4
Nodes (5): Breadcrumb System, Button Component, Calendar Component, Carousel System, Pagination Component

### Community 31 - "Community 31"
Cohesion: 0.4
Nodes (5): Excellence in Engineering, Purdue IEEE Heritage (Est. 1903), Professional Success & Alumni Impact, Technical and Professional Growth, About Us Page

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 0.5
Nodes (4): CommitteeCard Component, Committees Component, useCommittees, Committee Type

### Community 34 - "Community 34"
Cohesion: 0.5
Nodes (4): Form Orchestration, Input Component, OTP Input System, Label Component

### Community 35 - "Community 35"
Cohesion: 0.67
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 0.67
Nodes (2): IntersectionObserverMock, ResizeObserverMock

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (3): Project Workflow, Rationale for TDD Workflow, Test-Driven Development Workflow

### Community 38 - "Community 38"
Cohesion: 0.67
Nodes (3): Purdue IEEE Logo PNG, Purdue IEEE Logo SVG, Purdue IEEE Logo JPG

### Community 39 - "Community 39"
Cohesion: 0.67
Nodes (3): Command Palette, Dialog/Modal System, Drawer Component

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (3): Sanity Studio Documentation, Sanity Studio Configuration, Legacy Schema Index

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 2.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (2): Security & Deployment Audit Plan, Security & Deployment Audit Spec

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (2): Racing ROV Pool Test, ROV Pool Test

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (2): IEEE Whole Team Photo, Officer Aman Katyal

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (2): Robots.txt, Sitemap XML URL

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (2): About Component, useHomePage

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (2): Context Menu System, Dropdown Menu System

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (2): Menubar System, Navigation Menu System

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (2): Radio Group Component, Toggle Group Component

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (1): Chart System

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (0): 

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (1): Tailwind CSS v4

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (1): General Code Style Principles

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (1): Google HTML/CSS Style Guide

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (1): Google JavaScript Style Guide

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (1): Google TypeScript Style Guide

### Community 64 - "Community 64"
Cohesion: 1.0
Nodes (1): Coverage Report Favicon

### Community 65 - "Community 65"
Cohesion: 1.0
Nodes (1): Table Sorting Arrows Sprite

### Community 66 - "Community 66"
Cohesion: 1.0
Nodes (1): AESC People Working

### Community 67 - "Community 67"
Cohesion: 1.0
Nodes (1): AESC Team Image

### Community 68 - "Community 68"
Cohesion: 1.0
Nodes (1): ROV Whole Team Picture

### Community 69 - "Community 69"
Cohesion: 1.0
Nodes (1): People Soldering

### Community 70 - "Community 70"
Cohesion: 1.0
Nodes (1): Corporate Partner Info Session

### Community 71 - "Community 71"
Cohesion: 1.0
Nodes (1): People Doing Circuits

### Community 72 - "Community 72"
Cohesion: 1.0
Nodes (1): People Spelling IEEE

### Community 73 - "Community 73"
Cohesion: 1.0
Nodes (1): Club Callout Presentation

### Community 74 - "Community 74"
Cohesion: 1.0
Nodes (1): IEEE Logo Clean

### Community 75 - "Community 75"
Cohesion: 1.0
Nodes (1): PIEEE Logo v3

### Community 76 - "Community 76"
Cohesion: 1.0
Nodes (1): Officer Aiyan Alam

### Community 77 - "Community 77"
Cohesion: 1.0
Nodes (1): Officer Al Sultanbek

### Community 78 - "Community 78"
Cohesion: 1.0
Nodes (1): Officer Aniket Iyer

### Community 79 - "Community 79"
Cohesion: 1.0
Nodes (1): Officer Daniel Ng

### Community 80 - "Community 80"
Cohesion: 1.0
Nodes (1): Officer Dishan Bhattacharya

### Community 81 - "Community 81"
Cohesion: 1.0
Nodes (1): IEEE Learning Committee

### Community 82 - "Community 82"
Cohesion: 1.0
Nodes (1): AESC Working Session

### Community 83 - "Community 83"
Cohesion: 1.0
Nodes (1): AESC Team Photo

### Community 84 - "Community 84"
Cohesion: 1.0
Nodes (1): Soldering Activity

### Community 85 - "Community 85"
Cohesion: 1.0
Nodes (1): ASML Corporate Partner Session

### Community 86 - "Community 86"
Cohesion: 1.0
Nodes (1): IEEE Whole Team Photo

### Community 87 - "Community 87"
Cohesion: 1.0
Nodes (1): Circuits Activity

### Community 88 - "Community 88"
Cohesion: 1.0
Nodes (1): People Spelling IEEE

### Community 89 - "Community 89"
Cohesion: 1.0
Nodes (1): Club Callout Presentation

### Community 90 - "Community 90"
Cohesion: 1.0
Nodes (1): Aiyan Alam

### Community 91 - "Community 91"
Cohesion: 1.0
Nodes (1): Al Sultanbek

### Community 92 - "Community 92"
Cohesion: 1.0
Nodes (1): Aman Katyal

### Community 93 - "Community 93"
Cohesion: 1.0
Nodes (1): Aniket Iyer

### Community 94 - "Community 94"
Cohesion: 1.0
Nodes (1): Daniel Ng

### Community 95 - "Community 95"
Cohesion: 1.0
Nodes (1): Dishan Bhattacharya

### Community 96 - "Community 96"
Cohesion: 1.0
Nodes (1): src/app/App.tsx

### Community 97 - "Community 97"
Cohesion: 1.0
Nodes (1): src/app/components/About.tsx

### Community 98 - "Community 98"
Cohesion: 1.0
Nodes (1): src/app/components/BackToTop.tsx

### Community 99 - "Community 99"
Cohesion: 1.0
Nodes (1): src/app/components/Committees.tsx

### Community 100 - "Community 100"
Cohesion: 1.0
Nodes (1): Officer 2 (Image)

### Community 101 - "Community 101"
Cohesion: 1.0
Nodes (1): CornerstoneCommittees

### Community 102 - "Community 102"
Cohesion: 1.0
Nodes (1): PageTransition

### Community 103 - "Community 103"
Cohesion: 1.0
Nodes (1): TechMarquee

### Community 104 - "Community 104"
Cohesion: 1.0
Nodes (1): ImageWithFallback

### Community 105 - "Community 105"
Cohesion: 1.0
Nodes (1): Accordion

### Community 106 - "Community 106"
Cohesion: 1.0
Nodes (1): AlertDialog

### Community 107 - "Community 107"
Cohesion: 1.0
Nodes (1): Alert

### Community 108 - "Community 108"
Cohesion: 1.0
Nodes (1): AspectRatio

### Community 109 - "Community 109"
Cohesion: 1.0
Nodes (1): Avatar

### Community 110 - "Community 110"
Cohesion: 1.0
Nodes (1): Badge

### Community 111 - "Community 111"
Cohesion: 1.0
Nodes (1): Card Layout System

### Community 112 - "Community 112"
Cohesion: 1.0
Nodes (1): Checkbox Component

### Community 113 - "Community 113"
Cohesion: 1.0
Nodes (1): Collapsible System

### Community 114 - "Community 114"
Cohesion: 1.0
Nodes (1): Hover Card Component

### Community 115 - "Community 115"
Cohesion: 1.0
Nodes (1): Magnetic Interaction Wrapper

### Community 116 - "Community 116"
Cohesion: 1.0
Nodes (1): Progress Component

### Community 117 - "Community 117"
Cohesion: 1.0
Nodes (1): Resizable Panels Component

### Community 118 - "Community 118"
Cohesion: 1.0
Nodes (1): Scroll Area Component

### Community 119 - "Community 119"
Cohesion: 1.0
Nodes (1): Select Component

### Community 120 - "Community 120"
Cohesion: 1.0
Nodes (1): Slider Component

### Community 121 - "Community 121"
Cohesion: 1.0
Nodes (1): Sonner Toaster Component

### Community 122 - "Community 122"
Cohesion: 1.0
Nodes (1): Switch Component

### Community 123 - "Community 123"
Cohesion: 1.0
Nodes (1): Table Component

### Community 124 - "Community 124"
Cohesion: 1.0
Nodes (1): Tabs Component

### Community 125 - "Community 125"
Cohesion: 1.0
Nodes (1): Textarea Component

### Community 126 - "Community 126"
Cohesion: 1.0
Nodes (1): Toggle Component

### Community 127 - "Community 127"
Cohesion: 1.0
Nodes (1): Class Merger Utility (cn)

### Community 128 - "Community 128"
Cohesion: 1.0
Nodes (1): CommitteesPage

### Community 129 - "Community 129"
Cohesion: 1.0
Nodes (1): Bones Registry

### Community 130 - "Community 130"
Cohesion: 1.0
Nodes (1): IntersectionObserver Mock

### Community 131 - "Community 131"
Cohesion: 1.0
Nodes (1): ResizeObserver Mock

### Community 132 - "Community 132"
Cohesion: 1.0
Nodes (1): Sanity CLI Configuration

### Community 133 - "Community 133"
Cohesion: 1.0
Nodes (1): Partner Schema

## Knowledge Gaps
- **230 isolated node(s):** `IntersectionObserverMock`, `ResizeObserverMock`, `Logo Processing Script`, `Sanity Site Settings Schema`, `Calendar Page` (+225 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 41`** (2 nodes): `process_logo.py`, `process_logo()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (2 nodes): `ImageWithFallback.tsx`, `ImageWithFallback()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (2 nodes): `sonner.tsx`, `Toaster()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (2 nodes): `main.tsx`, `registry.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (2 nodes): `sanity-config.test.ts`, `getPreviewUrl()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (2 nodes): `Security & Deployment Audit Plan`, `Security & Deployment Audit Spec`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (2 nodes): `Racing ROV Pool Test`, `ROV Pool Test`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (2 nodes): `IEEE Whole Team Photo`, `Officer Aman Katyal`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (2 nodes): `Robots.txt`, `Sitemap XML URL`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (2 nodes): `About Component`, `useHomePage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (2 nodes): `Context Menu System`, `Dropdown Menu System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (2 nodes): `Menubar System`, `Navigation Menu System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (2 nodes): `Radio Group Component`, `Toggle Group Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `Chart System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `aspect-ratio.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `OfficersPage.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `OfficersPageMobile.test.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `sanity.cli.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `Tailwind CSS v4`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `General Code Style Principles`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `Google HTML/CSS Style Guide`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `Google JavaScript Style Guide`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `Google TypeScript Style Guide`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `Coverage Report Favicon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `Table Sorting Arrows Sprite`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `AESC People Working`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (1 nodes): `AESC Team Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (1 nodes): `ROV Whole Team Picture`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (1 nodes): `People Soldering`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (1 nodes): `Corporate Partner Info Session`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 71`** (1 nodes): `People Doing Circuits`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (1 nodes): `People Spelling IEEE`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (1 nodes): `Club Callout Presentation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (1 nodes): `IEEE Logo Clean`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (1 nodes): `PIEEE Logo v3`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (1 nodes): `Officer Aiyan Alam`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (1 nodes): `Officer Al Sultanbek`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (1 nodes): `Officer Aniket Iyer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (1 nodes): `Officer Daniel Ng`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (1 nodes): `Officer Dishan Bhattacharya`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (1 nodes): `IEEE Learning Committee`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (1 nodes): `AESC Working Session`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (1 nodes): `AESC Team Photo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (1 nodes): `Soldering Activity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (1 nodes): `ASML Corporate Partner Session`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (1 nodes): `IEEE Whole Team Photo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (1 nodes): `Circuits Activity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (1 nodes): `People Spelling IEEE`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (1 nodes): `Club Callout Presentation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `Aiyan Alam`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (1 nodes): `Al Sultanbek`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (1 nodes): `Aman Katyal`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (1 nodes): `Aniket Iyer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (1 nodes): `Daniel Ng`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (1 nodes): `Dishan Bhattacharya`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (1 nodes): `src/app/App.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (1 nodes): `src/app/components/About.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (1 nodes): `src/app/components/BackToTop.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 99`** (1 nodes): `src/app/components/Committees.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 100`** (1 nodes): `Officer 2 (Image)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 101`** (1 nodes): `CornerstoneCommittees`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 102`** (1 nodes): `PageTransition`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 103`** (1 nodes): `TechMarquee`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 104`** (1 nodes): `ImageWithFallback`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 105`** (1 nodes): `Accordion`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 106`** (1 nodes): `AlertDialog`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 107`** (1 nodes): `Alert`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 108`** (1 nodes): `AspectRatio`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 109`** (1 nodes): `Avatar`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 110`** (1 nodes): `Badge`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 111`** (1 nodes): `Card Layout System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 112`** (1 nodes): `Checkbox Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 113`** (1 nodes): `Collapsible System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 114`** (1 nodes): `Hover Card Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 115`** (1 nodes): `Magnetic Interaction Wrapper`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 116`** (1 nodes): `Progress Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 117`** (1 nodes): `Resizable Panels Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 118`** (1 nodes): `Scroll Area Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 119`** (1 nodes): `Select Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 120`** (1 nodes): `Slider Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (1 nodes): `Sonner Toaster Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 122`** (1 nodes): `Switch Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 123`** (1 nodes): `Table Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 124`** (1 nodes): `Tabs Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 125`** (1 nodes): `Textarea Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 126`** (1 nodes): `Toggle Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 127`** (1 nodes): `Class Merger Utility (cn)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 128`** (1 nodes): `CommitteesPage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 129`** (1 nodes): `Bones Registry`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 130`** (1 nodes): `IntersectionObserver Mock`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 131`** (1 nodes): `ResizeObserver Mock`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 132`** (1 nodes): `Sanity CLI Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 133`** (1 nodes): `Partner Schema`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Visual Editing` connect `Pages and Data Hooks` to `Project Roadmap and Rationale`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Sanity CMS` connect `Project Roadmap and Rationale` to `Pages and Data Hooks`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `Purdue IEEE Student Branch` (e.g. with `Jonah Femrite` and `Jonathon Reilly`) actually correct?**
  _`Purdue IEEE Student Branch` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `useSanityData` (e.g. with `Sanity Fallback Pattern` and `HomePage`) actually correct?**
  _`useSanityData` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `IntersectionObserverMock`, `ResizeObserverMock`, `Logo Processing Script` to the rest of the system?**
  _230 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components (Radix UI)` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Pages and Data Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
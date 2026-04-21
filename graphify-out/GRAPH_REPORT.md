# Graph Report - .  (2026-04-20)

## Corpus Check
- Large corpus: 288 files · ~926,965 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 409 nodes · 320 edges · 142 communities detected
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Purdue IEEE Student Branch` - 23 edges
2. `Vitest` - 22 edges
3. `useDataFetching()` - 12 edges
4. `Sanity Data Fetching Hooks` - 11 edges
5. `Sanity CMS` - 9 edges
6. `Purdue IEEE Design Guidelines` - 7 edges
7. `Software Saturdays` - 7 edges
8. `Website Schema Index` - 6 edges
9. `Captain` - 6 edges
10. `Sidebar Component` - 5 edges

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
- **Istanbul Coverage UI Scripts** — block_navigation, prettify, sorter [INFERRED 0.90]
- **Interactive Motion System** — magnetic_button, page_transition, ux_effects [INFERRED 0.90]
- **Radix-based UI Primitives** — ui_accordion, ui_alert_dialog, ui_alert, ui_aspect_ratio, ui_avatar, ui_badge [EXTRACTED 1.00]
- **Overlay UI Components** — ui_dialog, ui_drawer, ui_dropdown_menu, ui_context_menu, ui_menubar, ui_hover_card, ui_command [INFERRED 0.90]
- **Form Control System** — ui_form, ui_label, ui_input, ui_checkbox, ui_input_otp [INFERRED 0.95]
- **Navigational Affordances** — ui_breadcrumb, ui_pagination, ui_navigation_menu [INFERRED 0.85]
- **Sidebar Architectural Pattern** — ui_sidebar, ui_use_mobile, ui_sheet, ui_tooltip [EXTRACTED 0.95]
- **Floating Overlay Components** — ui_popover, ui_tooltip, ui_select, ui_sheet [INFERRED 0.90]
- **IEEE Organizational Mission Pillars** — concept_excellence, concept_technical_growth, concept_professional_success [EXTRACTED 1.00]
- **Sanity Singleton Types** — schema_officers_config, schema_home_page, schema_about_page [EXTRACTED 1.00]
- **IEEE Schema System** — schema_about_page, schema_committee, schema_cornerstone, schema_home_page, schema_leader, schema_officers_config, schema_partner [EXTRACTED 1.00]
- **Verification and Testing Suite** — tests_example, tests_core_flows, todo_site_improvements [INFERRED 0.85]
- **Project Testing Infrastructure** — playwright_config, vitest_config, purdue_ieee_website [EXTRACTED 1.00]
- **Sanity Integration Flow** — site_settings_schema, use_site_settings_hook, join_page, calendar_page, constitution_page, partners_page [INFERRED 0.85]
- **Sanity Content Ecosystem** — sanity_cms, groq, visual_editing, officers_config [INFERRED 0.90]
- **Modern Frontend Stack** — react_18, vite, tailwind_css_v4, framer_motion [INFERRED 0.95]
- **Performance & Snappiness Flow** — custom_cursor, skeleton_loaders, track_performance_snappiness [INFERRED 0.85]
- **Documentation Track** — spec_project_doc, sanity_guide, developer_guide, design_guidelines, maintenance_guide [EXTRACTED 0.90]
- **Project Style Guides** — general_styleguide, html_css_styleguide, js_styleguide, ts_styleguide [INFERRED 0.85]
- **Site Reliability and Performance Flow** — concept_performance_optimization, concept_security_hardening, todo_site_improvements [EXTRACTED 0.95]
- **ROV Technical Team Leads** — rov_bylaws_technical_team_lead, rov_bylaws_electrical_team_lead, rov_bylaws_mechanical_team_lead, rov_bylaws_software_team_lead [EXTRACTED 1.00]
- **Software Saturdays Mentors** — swsat_bylaws_volunteer_mentor, swsat_bylaws_employed_mentor [EXTRACTED 1.00]
- **Purdue IEEE Officers** — person_alpamys_sultanbek, person_aiyan_alam, person_max_vallone, person_aman_katyal, person_daniel_ng, person_saishri_bagde, person_jonathon_reilly, person_shidan_wan, person_su_park, person_soumil_verma, person_tarakanath_peddi, person_dishan_bhattacharya, person_mason_fleming, person_ryan_wans, person_sia_gupta, person_rhea_virk, person_lee_haglid, person_jonah_femrite, person_aniket_iyer, person_ryan_baker [INFERRED 0.85]
- **Sanity CMS Integration Layer** — use_sanity_data_hook, sanity_client, hero_component, join_cta_component, partners_page [EXTRACTED 1.00]
- **Build and Test Infrastructure** — vite_config, vitest_config [INFERRED 0.95]
- **Sanity Content Types** — studio_schema_committee, studio_schema_leader, studio_schema_cornerstone, studio_schema_officersConfig, studio_schema_siteSettings, studio_schema_homePage, studio_schema_aboutPage, studio_schema_partner [EXTRACTED 1.00]
- **Sanity Migration Ecosystem** — calendar_constitution_spec, sanity_cms_migration_plan, site_settings_schema, use_sanity_data_hook, migrate_to_sanity_script [INFERRED 0.85]

## Communities

### Community 0 - "Leadership & Officers"
Cohesion: 0.06
Nodes (34): Jonah Femrite (Image), Jonathon Reilly (Image), Lee Haglid (Image), Mason Fleming (Image), Max Vallone (Image), Rhea Virk (Image), Ryan Baker (Image), Ryan Wans (Image) (+26 more)

### Community 1 - "Sanity CMS Integration"
Cohesion: 0.07
Nodes (6): Automated Unit Testing Plan, React Testing Library, IntersectionObserverMock, PointerEvent, ResizeObserverMock, Vitest

### Community 2 - "Leadership & Officers"
Cohesion: 0.1
Nodes (25): Constitution of IEEE, IEEE Computer Society Chapter, IEEE EMBS Chapter, IEEE Executive Committee, IEEE MTT-S Chapter, IEEE Racing Team, IEEE SMC Chapter, Technical Goal (+17 more)

### Community 3 - "Sanity CMS Integration"
Cohesion: 0.12
Nodes (21): Calendar & Constitution Sanity Migration Specification, Calendar Page, Committee Data Barrel, Constitution Page, Hero Component, IEEE Mission Statement, Join CTA Component, Join Page (+13 more)

### Community 4 - "Sanity CMS Integration"
Cohesion: 0.18
Nodes (14): GROQ, getCacheKey(), prefetchData(), useAboutPage(), useCommittee(), useCommittees(), useCornerstoneCommittees(), useDataFetching() (+6 more)

### Community 5 - "Sanity CMS Integration"
Cohesion: 0.19
Nodes (0): 

### Community 6 - "Sanity CMS Integration"
Cohesion: 0.13
Nodes (17): Product Definition, Tech Stack, Custom Cursor, Framer Motion, officersConfig (Sanity Singleton), Rationale for Performance Targets, Rationale for Sanity Integration, React 18 (+9 more)

### Community 7 - "Sanity CMS Integration"
Cohesion: 0.18
Nodes (11): Glow & Selection FX, MagneticWrapper Component, Design & Brand Guidelines, Developer Onboarding Guide, Maintenance & Deployment Guide, Text Contrast Improvement Implementation Plan, UI/UX Standardization Plan, Content Editor Guide (Sanity CMS) (+3 more)

### Community 8 - "Technical Committees"
Cohesion: 0.18
Nodes (11): Captain, Electrical Team Lead, IEEE Executive Committee, IEEE Treasurer, MATE Center International ROV Competition, Mechanical Team Lead, Project Group Head, ROV Team (+3 more)

### Community 9 - "Technical Committees"
Cohesion: 0.18
Nodes (11): Attendee, Software Saturdays Chair, Computer Society, Employed Mentor, Executive Committee of Purdue IEEE Student Branch, Faculty Advisor, IEEE President, Purdue University College of Engineering (+3 more)

### Community 10 - "UI Component Library"
Cohesion: 0.22
Nodes (9): Centralized Data Architecture, Dual Theme (Dark/Light), Framer Motion Animations, Glassmorphism UI, Standardized Grid Layout, Typography Standards, WCAG AA Accessibility, Purdue IEEE Design Guidelines (+1 more)

### Community 11 - "Testing Infrastructure"
Cohesion: 0.29
Nodes (8): About Us Page Schema, Committee Schema, Cornerstone Committee Schema, Home Page Schema, Website Schema Index, Leader/Officer Schema, Officers Configuration Schema, Leader Schema Test

### Community 12 - "UI Component Library"
Cohesion: 0.29
Nodes (7): Popover Component, Separator Component, Sheet (Drawer) Component, Sidebar Component, Skeleton Loader Component, Tooltip Component, useIsMobile Hook

### Community 13 - "Testing Infrastructure"
Cohesion: 0.33
Nodes (3): Rationale: Asset Optimization Strategy, Rationale: Code Splitting Strategy, Vite

### Community 14 - "Testing Infrastructure"
Cohesion: 0.4
Nodes (5): Footer, IeeePurdueLogo, Layout, Navigation, ThemeToggle

### Community 15 - "Technical Committees"
Cohesion: 0.33
Nodes (6): Committee Document Schema, Image Style Object, Metric Object, Common Content Sections, Social Link Object, Global Site Settings Schema

### Community 16 - "Sanity CMS Integration"
Cohesion: 0.4
Nodes (5): App, BackToTop Component, src/app/App.test.tsx, src/main.tsx, @sanity/visual-editing

### Community 17 - "UI Component Library"
Cohesion: 0.4
Nodes (5): Breadcrumb System, Button Component, Calendar Component, Carousel System, Pagination Component

### Community 18 - "Excellence in Engineering"
Cohesion: 0.4
Nodes (5): Excellence in Engineering, Purdue IEEE Heritage (Est. 1903), Professional Success & Alumni Impact, Technical and Professional Growth, About Us Page

### Community 19 - "UI Component Library"
Cohesion: 0.4
Nodes (5): Playwright Configuration, Logo Processing Script, Product Guidelines, Purdue IEEE Website, Development Workflow

### Community 20 - "UI Component Library"
Cohesion: 0.5
Nodes (4): CommitteeCard Component, Committees Component, useCommittees, Committee Type

### Community 21 - "UI Component Library"
Cohesion: 0.5
Nodes (4): Form Orchestration, Input Component, OTP Input System, Label Component

### Community 22 - "UI Component Library"
Cohesion: 0.67
Nodes (3): Command Palette, Dialog/Modal System, Drawer Component

### Community 23 - "CALENDAR_CONFIG"
Cohesion: 0.67
Nodes (3): CALENDAR_CONFIG, useGoogleCalendarEvents, CalendarPage

### Community 24 - "Testing Infrastructure"
Cohesion: 0.67
Nodes (3): Project Workflow, Rationale for TDD Workflow, Test-Driven Development Workflow

### Community 25 - "Frontend Performance Optimization"
Cohesion: 0.67
Nodes (3): Frontend Performance Optimization, Security and CMS Protection, Site Improvements Roadmap

### Community 26 - "Cloudflare PagesFunction Type"
Cohesion: 1.0
Nodes (2): Cloudflare PagesFunction Type, onRequest Function

### Community 27 - "UI Component Library"
Cohesion: 1.0
Nodes (2): About Component, useHomePage

### Community 28 - "PageTransition.tsx"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Context Menu System"
Cohesion: 1.0
Nodes (2): Context Menu System, Dropdown Menu System

### Community 30 - "Menubar System"
Cohesion: 1.0
Nodes (2): Menubar System, Navigation Menu System

### Community 31 - "UI Component Library"
Cohesion: 1.0
Nodes (2): Radio Group Component, Toggle Group Component

### Community 32 - "Technical Committees"
Cohesion: 1.0
Nodes (2): Committee Types, CommitteePage

### Community 33 - "Sanity CMS Integration"
Cohesion: 1.0
Nodes (2): Sanity Studio Documentation, Sanity Studio Configuration

### Community 34 - "Testing Infrastructure"
Cohesion: 1.0
Nodes (2): Purdue IEEE Core E2E Tests, Playwright Example Tests

### Community 35 - "Security & Deployment Audit Plan"
Cohesion: 1.0
Nodes (2): Security & Deployment Audit Plan, Security & Deployment Audit Spec

### Community 36 - "Robots.txt"
Cohesion: 1.0
Nodes (2): Robots.txt, Sitemap XML URL

### Community 37 - "Testing Infrastructure"
Cohesion: 1.0
Nodes (2): Racing ROV Pool Test, ROV Pool Test

### Community 38 - "Leadership & Officers"
Cohesion: 1.0
Nodes (2): IEEE Whole Team Photo, Officer Aman Katyal

### Community 39 - "Leadership & Officers"
Cohesion: 1.0
Nodes (2): Officer (Leader) Document Schema, Officers Ordering Configuration

### Community 40 - "About Page Schema"
Cohesion: 1.0
Nodes (2): About Page Schema, About Page Section Object

### Community 41 - "Andrew Fewell"
Cohesion: 1.0
Nodes (2): Andrew Fewell, Andrew Fewell Photo

### Community 42 - "Chart System"
Cohesion: 1.0
Nodes (1): Chart System

### Community 43 - "block-navigation.js"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "prettify.js"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "sorter.js"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "src/app/App.tsx"
Cohesion: 1.0
Nodes (1): src/app/App.tsx

### Community 47 - "UI Component Library"
Cohesion: 1.0
Nodes (1): src/app/components/About.tsx

### Community 48 - "UI Component Library"
Cohesion: 1.0
Nodes (1): src/app/components/BackToTop.tsx

### Community 49 - "UI Component Library"
Cohesion: 1.0
Nodes (1): src/app/components/Committees.tsx

### Community 50 - "Technical Committees"
Cohesion: 1.0
Nodes (1): CornerstoneCommittees

### Community 51 - "Events"
Cohesion: 1.0
Nodes (1): Events

### Community 52 - "Stats"
Cohesion: 1.0
Nodes (1): Stats

### Community 53 - "TechMarquee"
Cohesion: 1.0
Nodes (1): TechMarquee

### Community 54 - "ImageWithFallback"
Cohesion: 1.0
Nodes (1): ImageWithFallback

### Community 55 - "Accordion"
Cohesion: 1.0
Nodes (1): Accordion

### Community 56 - "AlertDialog"
Cohesion: 1.0
Nodes (1): AlertDialog

### Community 57 - "Alert"
Cohesion: 1.0
Nodes (1): Alert

### Community 58 - "AspectRatio"
Cohesion: 1.0
Nodes (1): AspectRatio

### Community 59 - "Avatar"
Cohesion: 1.0
Nodes (1): Avatar

### Community 60 - "Badge"
Cohesion: 1.0
Nodes (1): Badge

### Community 61 - "Card Layout System"
Cohesion: 1.0
Nodes (1): Card Layout System

### Community 62 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Checkbox Component

### Community 63 - "Collapsible System"
Cohesion: 1.0
Nodes (1): Collapsible System

### Community 64 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Hover Card Component

### Community 65 - "Magnetic Interaction Wrapper"
Cohesion: 1.0
Nodes (1): Magnetic Interaction Wrapper

### Community 66 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Progress Component

### Community 67 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Resizable Panels Component

### Community 68 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Scroll Area Component

### Community 69 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Select Component

### Community 70 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Slider Component

### Community 71 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Sonner Toaster Component

### Community 72 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Switch Component

### Community 73 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Table Component

### Community 74 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Tabs Component

### Community 75 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Textarea Component

### Community 76 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Toggle Component

### Community 77 - "Class Merger Utility (cn)"
Cohesion: 1.0
Nodes (1): Class Merger Utility (cn)

### Community 78 - "Technical Committees"
Cohesion: 1.0
Nodes (1): CommitteesPage

### Community 79 - "ConstitutionPage"
Cohesion: 1.0
Nodes (1): ConstitutionPage

### Community 80 - "HomePage"
Cohesion: 1.0
Nodes (1): HomePage

### Community 81 - "JoinPage"
Cohesion: 1.0
Nodes (1): JoinPage

### Community 82 - "Leadership & Officers"
Cohesion: 1.0
Nodes (1): OfficersPage

### Community 83 - "Bones Registry"
Cohesion: 1.0
Nodes (1): Bones Registry

### Community 84 - "Leadership & Officers"
Cohesion: 1.0
Nodes (0): 

### Community 85 - "Sanity CMS Integration"
Cohesion: 1.0
Nodes (0): 

### Community 86 - "Tailwind CSS v4"
Cohesion: 1.0
Nodes (1): Tailwind CSS v4

### Community 87 - "General Code Style Principles"
Cohesion: 1.0
Nodes (1): General Code Style Principles

### Community 88 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Google HTML/CSS Style Guide

### Community 89 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Google JavaScript Style Guide

### Community 90 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Google TypeScript Style Guide

### Community 91 - "Technical Committees"
Cohesion: 1.0
Nodes (1): IEEE Learning Committee

### Community 92 - "IEEE Treasurer"
Cohesion: 1.0
Nodes (1): IEEE Treasurer

### Community 93 - "Coverage Report Favicon"
Cohesion: 1.0
Nodes (1): Coverage Report Favicon

### Community 94 - "Table Sorting Arrows Sprite"
Cohesion: 1.0
Nodes (1): Table Sorting Arrows Sprite

### Community 95 - "AESC People Working"
Cohesion: 1.0
Nodes (1): AESC People Working

### Community 96 - "AESC Team Image"
Cohesion: 1.0
Nodes (1): AESC Team Image

### Community 97 - "ROV Whole Team Picture"
Cohesion: 1.0
Nodes (1): ROV Whole Team Picture

### Community 98 - "People Soldering"
Cohesion: 1.0
Nodes (1): People Soldering

### Community 99 - "Corporate Partner Info Session"
Cohesion: 1.0
Nodes (1): Corporate Partner Info Session

### Community 100 - "UI Component Library"
Cohesion: 1.0
Nodes (1): People Doing Circuits

### Community 101 - "People Spelling IEEE"
Cohesion: 1.0
Nodes (1): People Spelling IEEE

### Community 102 - "Club Callout Presentation"
Cohesion: 1.0
Nodes (1): Club Callout Presentation

### Community 103 - "IEEE Logo Clean"
Cohesion: 1.0
Nodes (1): IEEE Logo Clean

### Community 104 - "PIEEE Logo v3"
Cohesion: 1.0
Nodes (1): PIEEE Logo v3

### Community 105 - "Leadership & Officers"
Cohesion: 1.0
Nodes (1): Officer Aiyan Alam

### Community 106 - "Leadership & Officers"
Cohesion: 1.0
Nodes (1): Officer Al Sultanbek

### Community 107 - "Leadership & Officers"
Cohesion: 1.0
Nodes (1): Officer Aniket Iyer

### Community 108 - "Leadership & Officers"
Cohesion: 1.0
Nodes (1): Officer Daniel Ng

### Community 109 - "Leadership & Officers"
Cohesion: 1.0
Nodes (1): Officer Dishan Bhattacharya

### Community 110 - "AESC Working Session"
Cohesion: 1.0
Nodes (1): AESC Working Session

### Community 111 - "AESC Team Photo"
Cohesion: 1.0
Nodes (1): AESC Team Photo

### Community 112 - "Testing Infrastructure"
Cohesion: 1.0
Nodes (1): ROV Pool Test Racing

### Community 113 - "Testing Infrastructure"
Cohesion: 1.0
Nodes (1): ROV Pool Test

### Community 114 - "ROV Team Photo"
Cohesion: 1.0
Nodes (1): ROV Team Photo

### Community 115 - "Soldering Activity"
Cohesion: 1.0
Nodes (1): Soldering Activity

### Community 116 - "ASML Corporate Partner Session"
Cohesion: 1.0
Nodes (1): ASML Corporate Partner Session

### Community 117 - "IEEE Whole Team Photo"
Cohesion: 1.0
Nodes (1): IEEE Whole Team Photo

### Community 118 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Circuits Activity

### Community 119 - "People Spelling IEEE"
Cohesion: 1.0
Nodes (1): People Spelling IEEE

### Community 120 - "Club Callout Presentation"
Cohesion: 1.0
Nodes (1): Club Callout Presentation

### Community 121 - "Purdue IEEE Logo SVG"
Cohesion: 1.0
Nodes (1): Purdue IEEE Logo SVG

### Community 122 - "Purdue IEEE Logo PNG"
Cohesion: 1.0
Nodes (1): Purdue IEEE Logo PNG

### Community 123 - "Purdue IEEE Logo JPG"
Cohesion: 1.0
Nodes (1): Purdue IEEE Logo JPG

### Community 124 - "Aiyan Alam"
Cohesion: 1.0
Nodes (1): Aiyan Alam

### Community 125 - "Al Sultanbek"
Cohesion: 1.0
Nodes (1): Al Sultanbek

### Community 126 - "Aman Katyal"
Cohesion: 1.0
Nodes (1): Aman Katyal

### Community 127 - "Aniket Iyer"
Cohesion: 1.0
Nodes (1): Aniket Iyer

### Community 128 - "Daniel Ng"
Cohesion: 1.0
Nodes (1): Daniel Ng

### Community 129 - "Dishan Bhattacharya"
Cohesion: 1.0
Nodes (1): Dishan Bhattacharya

### Community 130 - "Leadership & Officers"
Cohesion: 1.0
Nodes (1): Officer 2 (Image)

### Community 131 - "UI Component Library"
Cohesion: 1.0
Nodes (1): Page Transition Component

### Community 132 - "Sanity CMS Integration"
Cohesion: 1.0
Nodes (1): Sanity Client

### Community 133 - "Sanity CMS Integration"
Cohesion: 1.0
Nodes (1): Sanity Preview Client

### Community 134 - "urlFor Image Utility"
Cohesion: 1.0
Nodes (1): urlFor Image Utility

### Community 135 - "Technical Committees"
Cohesion: 1.0
Nodes (1): Cornerstone Committee Document Schema

### Community 136 - "Home Page Schema"
Cohesion: 1.0
Nodes (1): Home Page Schema

### Community 137 - "Partner/Sponsor Document Schema"
Cohesion: 1.0
Nodes (1): Partner/Sponsor Document Schema

### Community 138 - "Image Optimization Pipeline Rationale"
Cohesion: 1.0
Nodes (1): Image Optimization Pipeline Rationale

### Community 139 - "CMS Basic Auth Rationale"
Cohesion: 1.0
Nodes (1): CMS Basic Auth Rationale

### Community 140 - "Switch to CMS-driven Architecture"
Cohesion: 1.0
Nodes (1): Switch to CMS-driven Architecture

### Community 141 - "Tailwind CSS v4 Strategy"
Cohesion: 1.0
Nodes (1): Tailwind CSS v4 Strategy

## Knowledge Gaps
- **256 isolated node(s):** `Playwright Configuration`, `Logo Processing Script`, `onRequest Function`, `Cloudflare PagesFunction Type`, `src/main.tsx` (+251 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Cloudflare PagesFunction Type`** (2 nodes): `Cloudflare PagesFunction Type`, `onRequest Function`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (2 nodes): `About Component`, `useHomePage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PageTransition.tsx`** (2 nodes): `PageTransition.tsx`, `PageTransition()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Context Menu System`** (2 nodes): `Context Menu System`, `Dropdown Menu System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Menubar System`** (2 nodes): `Menubar System`, `Navigation Menu System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (2 nodes): `Radio Group Component`, `Toggle Group Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Technical Committees`** (2 nodes): `Committee Types`, `CommitteePage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sanity CMS Integration`** (2 nodes): `Sanity Studio Documentation`, `Sanity Studio Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Testing Infrastructure`** (2 nodes): `Purdue IEEE Core E2E Tests`, `Playwright Example Tests`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Security & Deployment Audit Plan`** (2 nodes): `Security & Deployment Audit Plan`, `Security & Deployment Audit Spec`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Robots.txt`** (2 nodes): `Robots.txt`, `Sitemap XML URL`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Testing Infrastructure`** (2 nodes): `Racing ROV Pool Test`, `ROV Pool Test`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leadership & Officers`** (2 nodes): `IEEE Whole Team Photo`, `Officer Aman Katyal`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leadership & Officers`** (2 nodes): `Officer (Leader) Document Schema`, `Officers Ordering Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `About Page Schema`** (2 nodes): `About Page Schema`, `About Page Section Object`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Andrew Fewell`** (2 nodes): `Andrew Fewell`, `Andrew Fewell Photo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chart System`** (1 nodes): `Chart System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `block-navigation.js`** (1 nodes): `block-navigation.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `prettify.js`** (1 nodes): `prettify.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `sorter.js`** (1 nodes): `sorter.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `src/app/App.tsx`** (1 nodes): `src/app/App.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `src/app/components/About.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `src/app/components/BackToTop.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `src/app/components/Committees.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Technical Committees`** (1 nodes): `CornerstoneCommittees`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Events`** (1 nodes): `Events`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Stats`** (1 nodes): `Stats`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TechMarquee`** (1 nodes): `TechMarquee`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ImageWithFallback`** (1 nodes): `ImageWithFallback`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Accordion`** (1 nodes): `Accordion`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AlertDialog`** (1 nodes): `AlertDialog`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Alert`** (1 nodes): `Alert`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AspectRatio`** (1 nodes): `AspectRatio`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Avatar`** (1 nodes): `Avatar`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Badge`** (1 nodes): `Badge`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Card Layout System`** (1 nodes): `Card Layout System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Checkbox Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Collapsible System`** (1 nodes): `Collapsible System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Hover Card Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Magnetic Interaction Wrapper`** (1 nodes): `Magnetic Interaction Wrapper`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Progress Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Resizable Panels Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Scroll Area Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Select Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Slider Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Sonner Toaster Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Switch Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Table Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Tabs Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Textarea Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Toggle Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Class Merger Utility (cn)`** (1 nodes): `Class Merger Utility (cn)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Technical Committees`** (1 nodes): `CommitteesPage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ConstitutionPage`** (1 nodes): `ConstitutionPage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `HomePage`** (1 nodes): `HomePage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `JoinPage`** (1 nodes): `JoinPage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leadership & Officers`** (1 nodes): `OfficersPage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Bones Registry`** (1 nodes): `Bones Registry`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leadership & Officers`** (1 nodes): `leadership.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sanity CMS Integration`** (1 nodes): `sanity.cli.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind CSS v4`** (1 nodes): `Tailwind CSS v4`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `General Code Style Principles`** (1 nodes): `General Code Style Principles`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Google HTML/CSS Style Guide`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Google JavaScript Style Guide`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Google TypeScript Style Guide`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Technical Committees`** (1 nodes): `IEEE Learning Committee`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `IEEE Treasurer`** (1 nodes): `IEEE Treasurer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Coverage Report Favicon`** (1 nodes): `Coverage Report Favicon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Table Sorting Arrows Sprite`** (1 nodes): `Table Sorting Arrows Sprite`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AESC People Working`** (1 nodes): `AESC People Working`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AESC Team Image`** (1 nodes): `AESC Team Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ROV Whole Team Picture`** (1 nodes): `ROV Whole Team Picture`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `People Soldering`** (1 nodes): `People Soldering`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Corporate Partner Info Session`** (1 nodes): `Corporate Partner Info Session`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `People Doing Circuits`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `People Spelling IEEE`** (1 nodes): `People Spelling IEEE`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Club Callout Presentation`** (1 nodes): `Club Callout Presentation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `IEEE Logo Clean`** (1 nodes): `IEEE Logo Clean`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PIEEE Logo v3`** (1 nodes): `PIEEE Logo v3`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leadership & Officers`** (1 nodes): `Officer Aiyan Alam`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leadership & Officers`** (1 nodes): `Officer Al Sultanbek`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leadership & Officers`** (1 nodes): `Officer Aniket Iyer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leadership & Officers`** (1 nodes): `Officer Daniel Ng`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leadership & Officers`** (1 nodes): `Officer Dishan Bhattacharya`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AESC Working Session`** (1 nodes): `AESC Working Session`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AESC Team Photo`** (1 nodes): `AESC Team Photo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Testing Infrastructure`** (1 nodes): `ROV Pool Test Racing`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Testing Infrastructure`** (1 nodes): `ROV Pool Test`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ROV Team Photo`** (1 nodes): `ROV Team Photo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Soldering Activity`** (1 nodes): `Soldering Activity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ASML Corporate Partner Session`** (1 nodes): `ASML Corporate Partner Session`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `IEEE Whole Team Photo`** (1 nodes): `IEEE Whole Team Photo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Circuits Activity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `People Spelling IEEE`** (1 nodes): `People Spelling IEEE`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Club Callout Presentation`** (1 nodes): `Club Callout Presentation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Purdue IEEE Logo SVG`** (1 nodes): `Purdue IEEE Logo SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Purdue IEEE Logo PNG`** (1 nodes): `Purdue IEEE Logo PNG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Purdue IEEE Logo JPG`** (1 nodes): `Purdue IEEE Logo JPG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Aiyan Alam`** (1 nodes): `Aiyan Alam`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Al Sultanbek`** (1 nodes): `Al Sultanbek`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Aman Katyal`** (1 nodes): `Aman Katyal`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Aniket Iyer`** (1 nodes): `Aniket Iyer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Daniel Ng`** (1 nodes): `Daniel Ng`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dishan Bhattacharya`** (1 nodes): `Dishan Bhattacharya`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leadership & Officers`** (1 nodes): `Officer 2 (Image)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Component Library`** (1 nodes): `Page Transition Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sanity CMS Integration`** (1 nodes): `Sanity Client`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sanity CMS Integration`** (1 nodes): `Sanity Preview Client`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `urlFor Image Utility`** (1 nodes): `urlFor Image Utility`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Technical Committees`** (1 nodes): `Cornerstone Committee Document Schema`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home Page Schema`** (1 nodes): `Home Page Schema`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Partner/Sponsor Document Schema`** (1 nodes): `Partner/Sponsor Document Schema`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Image Optimization Pipeline Rationale`** (1 nodes): `Image Optimization Pipeline Rationale`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CMS Basic Auth Rationale`** (1 nodes): `CMS Basic Auth Rationale`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Switch to CMS-driven Architecture`** (1 nodes): `Switch to CMS-driven Architecture`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind CSS v4 Strategy`** (1 nodes): `Tailwind CSS v4 Strategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Vitest` connect `Sanity CMS Integration` to `Sanity CMS Integration`, `Testing Infrastructure`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `Navigation` connect `Testing Infrastructure` to `Sanity CMS Integration`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `Purdue IEEE Student Branch` (e.g. with `Jonah Femrite` and `Jonathon Reilly`) actually correct?**
  _`Purdue IEEE Student Branch` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Sanity Data Fetching Hooks` (e.g. with `Leader Data Interface` and `Calendar Page`) actually correct?**
  _`Sanity Data Fetching Hooks` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Playwright Configuration`, `Logo Processing Script`, `onRequest Function` to the rest of the system?**
  _256 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Leadership & Officers` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Sanity CMS Integration` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
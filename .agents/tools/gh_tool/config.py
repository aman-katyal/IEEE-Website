"""
config.py - Single source of truth for the gh_tool taxonomy.
All label names, keyword maps, heuristic signals, and body templates live here.
"""

from __future__ import annotations

# -- Label taxonomy -----------------------------------------------------------

TYPE_LABELS: list[str] = [
    "type:bug", "type:feature", "type:task", "type:ui-ux",
    "type:a11y", "type:docs", "type:chore",
]

PRIORITY_LABELS: list[str] = [
    "priority:critical", "priority:high", "priority:medium", "priority:low",
]

STATUS_LABELS: list[str] = [
    "status:triage", "status:ready", "status:in-progress",
    "status:blocked", "status:awaiting-review", "status:wontfix",
]

AREA_LABELS: list[str] = [
    "area:home", "area:committees", "area:about", "area:partners",
    "area:nav", "area:cms", "area:styles", "area:infra",
]

ALL_CANONICAL_LABELS: list[str] = TYPE_LABELS + PRIORITY_LABELS + STATUS_LABELS + AREA_LABELS

LEGACY_LABELS: set[str] = {
    "bug", "enhancement", "blocked", "awaiting-verification",
    "documentation", "duplicate", "good first issue", "help wanted",
    "invalid", "question", "wontfix",
}

SYSTEM_LABELS: set[str] = {
    "decap-cms/draft", "decap-cms/pending_publish", "decap-cms/pending_review",
}

# -- Label colors for bootstrap -----------------------------------------------

LABEL_META: dict[str, dict] = {
    "type:bug":              {"color": "d73a4a", "description": "Unexpected behavior or broken functionality"},
    "type:feature":          {"color": "0075ca", "description": "Net-new capability or page section"},
    "type:task":             {"color": "6f42c1", "description": "Cleanup, removal, refactor, config change"},
    "type:ui-ux":            {"color": "e8b4b8", "description": "Visual polish, layout, spacing, typography"},
    "type:a11y":             {"color": "f9a825", "description": "Accessibility: contrast, ARIA, keyboard, WCAG"},
    "type:docs":             {"color": "bfd4f2", "description": "README, comments, schema docs"},
    "type:chore":            {"color": "d4c5f9", "description": "Dependency bumps, CI, tooling"},
    "priority:critical":     {"color": "b60205", "description": "Site-breaking or launch blocker"},
    "priority:high":         {"color": "e05d00", "description": "Must fix before next release"},
    "priority:medium":       {"color": "fde078", "description": "Should fix this sprint"},
    "priority:low":          {"color": "c2e0c6", "description": "Nice to have, no deadline"},
    "status:triage":         {"color": "ededed", "description": "New - needs scoping and label assignment"},
    "status:ready":          {"color": "0e8a16", "description": "Spec complete, ready to implement"},
    "status:in-progress":    {"color": "9BCC65", "description": "Actively being worked on"},
    "status:blocked":        {"color": "d93f0b", "description": "Waiting on decision, asset, or dependency"},
    "status:awaiting-review":{"color": "e99695", "description": "Merged - needs human UI/UX verification"},
    "status:wontfix":        {"color": "ffffff", "description": "Explicitly out of scope"},
    "area:home":             {"color": "7985CB", "description": "Home page, BentoHero, Events, Marquee"},
    "area:committees":       {"color": "A0855B", "description": "Committee pages and hover cards"},
    "area:about":            {"color": "cfd3d7", "description": "About page content"},
    "area:partners":         {"color": "1f883d", "description": "Partners and Sponsors page"},
    "area:nav":              {"color": "8b5cf6", "description": "Navbar, footer, routing"},
    "area:cms":              {"color": "f59e0b", "description": "Sanity Studio schema or GROQ queries"},
    "area:styles":           {"color": "ec4899", "description": "CSS variables, Tailwind tokens, theme"},
    "area:infra":            {"color": "0d1117", "description": "Cloudflare, Wrangler, build config, Vite"},
}

# -- Type classifier ----------------------------------------------------------

# Ordered: first prefix match wins (case-insensitive check done in classifier)
TITLE_PREFIX_MAP: list[tuple[str, str]] = [
    (r"^\[BUG\]",     "type:bug"),
    (r"^\[FEATURE\]", "type:feature"),
    (r"^\[TASK\]",    "type:task"),
    (r"^\[UI/UX\]",   "type:ui-ux"),
    (r"^\[A11Y\]",    "type:a11y"),
    (r"^\[DOCS\]",    "type:docs"),
    (r"^\[CHORE\]",   "type:chore"),
]

# Fallback keyword scoring when no prefix found
TYPE_KEYWORDS: dict[str, list[str]] = {
    "type:bug":     ["broken", "fix", "error", "crash", "missing", "fails", "regression"],
    "type:feature": ["add", "new", "implement", "create", "introduce", "enable"],
    "type:task":    ["remove", "clean", "refactor", "delete", "update", "rename", "migrate"],
    "type:ui-ux":   ["style", "layout", "spacing", "color", "visual", "typography", "polish"],
    "type:a11y":    ["accessibility", "contrast", "aria", "wcag", "screen reader", "keyboard"],
    "type:docs":    ["document", "readme", "comment", "guide", "explain"],
    "type:chore":   ["dependency", "upgrade", "ci", "pipeline", "tooling", "build"],
}

# -- Area classifier ----------------------------------------------------------
# Each entry: (keyword_phrase, weight). Phrase match is case-insensitive substring.
# Area with highest accumulated score wins.

AREA_KEYWORDS: dict[str, list[tuple[str, float]]] = {
    "area:home": [
        ("bentohero", 2.0), ("bento", 1.8), ("home page", 2.0), ("home", 1.0),
        ("events section", 2.0), ("events.tsx", 2.0), ("live from google calendar", 2.5),
        ("upcoming events", 1.5), ("lab status rack", 2.0), ("marquee", 1.3),
        ("dues", 1.5), ("join section", 1.5), ("discord schedule", 1.5),
        ("hero", 1.2), ("telemetry", 1.5),
    ],
    "area:committees": [
        ("committee page", 2.0), ("committee", 1.8), ("hover card", 2.2),
        ("hover preview", 1.8), ("rov", 2.0), ("project card", 1.5),
        ("chair", 1.2), ("lab rack", 1.5), ("date founded", 1.8),
        ("member involvement", 1.8), ("focus area", 1.5), ("contact link", 1.2),
        ("meeting schedule", 1.5),
    ],
    "area:partners": [
        ("partners page", 2.2), ("sponsor", 2.0), ("partner", 1.8), ("logo", 1.5),
        ("corporate", 1.5), ("gold partner", 2.2), ("tier list", 1.8),
        ("clickable logo", 1.8), ("company", 1.0),
    ],
    "area:nav": [
        ("navbar", 2.2), ("navigation", 2.0), ("dropdown", 1.8), ("footer", 1.8),
        ("routing", 1.2), ("mobile nav", 1.8), ("theme toggle", 1.5),
        ("nav menu", 1.8),
    ],
    "area:cms": [
        ("sanity", 2.0), ("schema", 2.0), ("groq", 2.2), ("studio", 1.8),
        ("fieldgroup", 2.2), ("status & badges", 2.5), ("statuscolor", 2.0),
        ("statusbg", 2.0), ("shieldcheck", 1.8), ("committee.ts", 2.2),
        ("sanity cms", 2.2), ("sanity studio", 2.0),
    ],
    "area:styles": [
        ("dark mode", 2.2), ("light mode", 2.2), ("theme toggle", 2.0),
        ("forced theme", 2.2), ("next-themes", 1.8), ("themeprovider", 1.8),
        ("css variable", 1.8), ("tailwind", 1.5), ("font", 1.0),
        ("typography", 1.5), ("color palette", 1.5), ("theme.css", 2.0),
    ],
    "area:about": [
        ("about page", 2.2), ("quote block", 2.2), ("author name", 1.8),
        ("section header", 1.5), ("anchor", 1.2), ("about", 1.0),
    ],
    "area:infra": [
        ("cloudflare", 2.2), ("wrangler", 2.2), ("vite", 1.8), ("build", 1.0),
        ("deploy", 1.5), ("github actions", 2.2), ("ci pipeline", 2.0),
        ("wrangler.toml", 2.2), ("vite.config", 2.0),
    ],
}

# -- Priority heuristics ------------------------------------------------------

PRIORITY_SIGNALS: dict[str, list[str]] = {
    "priority:critical": [
        "site down", "broken build", "crash", "white screen",
        "launch blocker", "data loss", "security vulnerability",
    ],
    "priority:high": [
        "broken", "missing image", "missing asset", "accessibility",
        "wcag", "dark mode enforce", "light mode remov",
    ],
    "priority:low": [
        "nice to have", "polish", "cleanup", "cosmetic",
        "clarify", "tooltip", "standardize", "remove",
    ],
    # default -> priority:medium
}

# -- Status heuristics --------------------------------------------------------

STATUS_SIGNALS: dict[str, list[str]] = {
    "status:blocked": [
        "blocked", "awaiting human", "waiting on", "needs officer",
        "officer decision", "pending asset", "discord bot",
    ],
    "status:awaiting-review": [
        "awaiting-verification",  # triggers when this legacy label is present
    ],
    # status:ready -> when body passes validation AND no block signals
    # default -> status:triage
}

# -- Body format requirements -------------------------------------------------
# Uses keyword phrases (not exact headers) so the validator accepts BOTH:
#   a) GitHub Issue Form output  →  "### 📋 Steps to Reproduce"
#   b) Hand-written bodies       →  "## Steps to Reproduce"
# The validator does case-insensitive substring match against heading text
# after stripping leading emoji.

REQUIRED_SECTION_KEYWORDS: dict[str, list[str]] = {
    "type:bug": [
        "steps to reproduce",
        "expected vs actual",
        "acceptance criteria",
    ],
    "type:task": [
        "description",
        "requested changes",
        "acceptance criteria",
    ],
    "type:feature": [
        "problem statement",
        "proposed solution",
        "acceptance criteria",
    ],
    "type:ui-ux": [
        "current state",
        "requested changes",
        "acceptance criteria",
    ],
    "type:a11y": [
        "issue description",
        "requested changes",
        "acceptance criteria",
    ],
    "type:docs": [
        "description",
        "requested changes",
    ],
    "type:chore": [
        "description",
    ],
}

# Legacy alias kept so existing code referencing REQUIRED_SECTIONS still works
REQUIRED_SECTIONS = REQUIRED_SECTION_KEYWORDS

# -- PR body template ---------------------------------------------------------

PR_TEMPLATE: str = """\
## Summary
{summary}

## Related Issue
Closes #{issue_number}

## Changes Made
{changes}

## Checklist
- [ ] Tested locally in dark mode
- [ ] Responsive at mobile (375px), tablet (768px), desktop (1280px)
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] Sanity schema changes reflected in studio (if applicable)
"""

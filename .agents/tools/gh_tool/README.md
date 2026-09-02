# gh_tool — Deterministic GitHub Issue & PR Management

A Python CLI plugin providing a **hard constraint layer** on top of the
`github-issues` and `github-prs` agent skills. Same input → same output, every time.

## Quick Reference

```bash
# From .agents/tools/
python -m gh_tool issue suggest-labels --title "[TASK]: Remove live badge"
python -m gh_tool issue suggest-labels --title "..." --json
python -m gh_tool issue port --dry-run
python -m gh_tool issue port
python -m gh_tool issue lint
python -m gh_tool issue lint --number 156
python -m gh_tool label sync --dry-run
python -m gh_tool label sync
```

## Commands (Phase 1)

| Command | What it does |
|---|---|
| `issue suggest-labels` | Deterministic label suggestion from title + body |
| `issue port` | Bulk-add missing canonical labels to all open issues |
| `issue lint` | Audit open issues for format/label violations |
| `label sync` | Create any missing canonical labels on the repo |

## How the Classifier Works

**Type** (100% deterministic): regex on title prefix `[BUG]`, `[TASK]`, etc.

**Area** (keyword scoring): each area has a weighted phrase list; highest
accumulated score wins. Title matches count 2x vs body matches.

**Priority** (heuristic): signal keywords override; default = `priority:medium`.

**Status** (heuristic): blocked signals → `status:blocked`; legacy
`awaiting-verification` label → `status:awaiting-review`; body valid → `status:ready`;
otherwise `status:triage`.

## File Structure

```
.agents/tools/gh_tool/
  __init__.py      package marker
  __main__.py      enables `python -m gh_tool`
  cli.py           argument parser + command dispatch
  classifier.py    deterministic label inference engine
  validator.py     issue/PR body format enforcer
  gh.py            thin subprocess wrapper around gh CLI
  config.py        taxonomy constants, keyword maps, templates
  README.md        this file
```

## Integration with Skills

The `github-issues` skill now calls `suggest-labels` before every `gh issue create`.
The returned JSON is treated as **ground truth** — type/area values are not overridden
without explicit user instruction.

After implementation, lint with:
```bash
python -m gh_tool issue lint --number <id>
```

## Roadmap

- **Phase 2**: `issue create` (wrapped with validation) + body section enforcer
- **Phase 3**: `duplicate.py` — TF-IDF cosine similarity duplicate scorer
- **Phase 4**: `pr create` + `pr lint` — PR workflow with auto issue linkage
- **Phase 5**: GitHub Actions automation (lint on issue open/PR open events)

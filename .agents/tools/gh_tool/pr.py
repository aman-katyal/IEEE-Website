"""
pr.py - PR creation with auto issue linkage, label inheritance, and format validation.
Phase 4 of gh_tool. Wraps gh CLI for all PR operations.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from .config import PR_TEMPLATE, TYPE_LABELS, AREA_LABELS
from .validator import validate_pr_body, ValidationResult
from . import gh


@dataclass
class PRSpec:
    """Fully-resolved spec for a PR before creation."""
    title: str
    body: str
    labels: list[str]
    base: str
    issue_number: int | None
    closes_issue: bool
    body_valid: bool
    violations: list


def build_pr_title(issue_title: str) -> str:
    """
    Derive a PR title from an issue title.
    '[TASK]: Remove live badge' -> '[TASK]: Remove live badge'
    Strips trailing whitespace/punctuation.
    """
    return issue_title.strip().rstrip(".")


def build_pr_body(
    issue_number: int,
    summary: str,
    changes: str | None = None,
) -> str:
    """Fill PR_TEMPLATE with the provided values."""
    changes_text = changes or "- See issue description for full change list."
    return PR_TEMPLATE.format(
        summary=summary,
        issue_number=issue_number,
        changes=changes_text,
    )


def inherit_labels_from_issue(issue_labels: list[str]) -> list[str]:
    """
    Copy type: and area: labels from the source issue onto the PR.
    Does not copy status: or priority: (those are issue-lifecycle labels).
    """
    inherited = [
        l for l in issue_labels
        if l.startswith("type:") or l.startswith("area:")
    ]
    return inherited


def resolve_pr_spec(
    issue_number: int,
    summary: str,
    changes: str | None = None,
    base: str = "master",
    extra_labels: list[str] | None = None,
) -> PRSpec:
    """
    Fetch the linked issue, inherit labels, build body, validate.
    Returns a fully-resolved PRSpec ready to pass to create_pr().
    """
    issue = gh.get_issue(issue_number)
    issue_label_names = [l["name"] if isinstance(l, dict) else l for l in issue.get("labels", [])]
    issue_title = issue["title"]

    pr_title = build_pr_title(issue_title)
    pr_body = build_pr_body(issue_number, summary, changes)
    labels = inherit_labels_from_issue(issue_label_names)
    if extra_labels:
        labels += [l for l in extra_labels if l not in labels]

    validation = validate_pr_body(pr_body, pr_number=None)

    return PRSpec(
        title=pr_title,
        body=pr_body,
        labels=labels,
        base=base,
        issue_number=issue_number,
        closes_issue=True,
        body_valid=validation.valid,
        violations=validation.violations,
    )


def create_pr(spec: PRSpec, dry_run: bool = False) -> dict:
    """Submit the PR to GitHub. Raises if body is invalid."""
    if not spec.body_valid:
        msgs = [v.detail for v in spec.violations]
        raise ValueError(f"PR body validation failed:\n" + "\n".join(f"  - {m}" for m in msgs))
    return gh.create_pr(spec.title, spec.body, spec.labels, spec.base, dry_run=dry_run)


def lint_pr(pr_number: int) -> ValidationResult:
    """
    Validate a PR's body, title prefix, and labels.
    Returns ValidationResult with any violations.
    """
    from .validator import Violation
    pr = gh.get_pr(pr_number)
    result = validate_pr_body(pr.get("body") or "", pr_number=pr_number)

    # Check title prefix
    title = pr.get("title", "")
    from .validator import validate_title
    title_result = validate_title(title, pr_number)
    result.violations.extend(title_result.violations)
    if not title_result.valid:
        result.valid = False

    # Check label coverage
    label_names = [l["name"] if isinstance(l, dict) else l for l in pr.get("labels", [])]
    has_type = any(l.startswith("type:") for l in label_names)
    has_area = any(l.startswith("area:") for l in label_names)
    if not has_type:
        result.violations.append(Violation(pr_number, "labels", "missing-type-label",
            "PR has no type: label. Inherit from source issue."))
        result.valid = False
    if not has_area:
        result.violations.append(Violation(pr_number, "labels", "missing-area-label",
            "PR has no area: label. Inherit from source issue."))
        result.valid = False

    # Check mergeability
    mergeable = pr.get("mergeable")
    if mergeable == "CONFLICTING":
        result.violations.append(Violation(pr_number, "merge", "has-conflicts",
            "PR has merge conflicts — resolve before merging."))
        result.valid = False

    return result

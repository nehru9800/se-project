
"""Transparent project evaluation metrics for FinTech SDLC."""
from datetime import datetime, timezone
from typing import Any


def percentage(numerator: int, denominator: int) -> float:
    return round(numerator * 100 / denominator, 1) if denominator else 0.0


def calculate_project_metrics(project_id: str, store: Any) -> dict:
    project = store.projects.get(project_id)
    if not project:
        raise KeyError(project_id)

    requirements = store.requirements.get(project_id, []) or []
    mappings = store.compliance_mappings.get(project_id, []) or []
    risks = store.risks.get(project_id, []) or []
    traceability = store.traceability.get(project_id, []) or []
    approvals = [
        item for item in store.approvals
        if item.get("project_id") == project_id
    ]

    total = len(requirements)

    required_fields = (
        "statement",
        "source",
        "categories",
        "acceptance_criteria",
    )

    populated = sum(
        bool(requirement.get(field))
        for requirement in requirements
        for field in required_fields
    )

    completeness = percentage(
        populated,
        total * len(required_fields),
    )

    vague_terms = (
        "fast",
        "easy",
        "simple",
        "user friendly",
        "appropriate",
        "as soon as possible",
    )

    testable = 0
    ambiguous = 0
    conflicted = 0

    for requirement in requirements:
        criteria = requirement.get("acceptance_criteria") or []
        criteria_text = " ".join(map(str, criteria)).lower()

        if criteria and not any(term in criteria_text for term in vague_terms):
            testable += 1

        issues = requirement.get("quality_issues") or []

        if any(
            isinstance(issue, dict)
            and "ambigu" in str(issue.get("issue_type", "")).lower()
            for issue in issues
        ):
            ambiguous += 1

        if requirement.get("conflicts_with"):
            conflicted += 1

    mapped_ids = {
        str(item.get("requirement_id"))
        for item in mappings
        if item.get("requirement_id")
    }
    mapped_ids.update(
        str(item.get("item_id"))
        for item in mappings
        if item.get("item_id")
    )

    compliance_covered = sum(
        1 for requirement in requirements
        if (
            str(requirement.get("id")) in mapped_ids
            or requirement.get("compliance_status")
            in {"Mapped", "Compliant", "Partial Compliance"}
        )
    )

    trace_ids = {
        str(item.get("requirement_id"))
        for item in traceability
        if item.get("requirement_id")
    }

    traceability_covered = sum(
        1 for requirement in requirements
        if str(requirement.get("id")) in trace_ids
    )

    resolved = sum(
        1 for item in approvals
        if item.get("status") in {
            "Approved",
            "Rejected",
            "Changes Requested",
        }
    )

    critical_risks = sum(
        1 for risk in risks
        if str(risk.get("severity", "")).lower() == "critical"
    )

    high_risks = sum(
        1 for risk in risks
        if str(risk.get("severity", "")).lower() == "high"
    )

    metrics = {
        "requirement_completeness": completeness,
        "acceptance_criteria_testability": percentage(testable, total),
        "compliance_coverage": percentage(compliance_covered, total),
        "traceability_coverage": percentage(traceability_covered, total),
        "ambiguity_rate": percentage(ambiguous, total),
        "conflict_rate": percentage(conflicted, total),
        "approval_resolution_rate": percentage(resolved, len(approvals)),
    }

    readiness = round(
        metrics["requirement_completeness"] * 0.25
        + metrics["acceptance_criteria_testability"] * 0.20
        + metrics["compliance_coverage"] * 0.20
        + metrics["traceability_coverage"] * 0.20
        + metrics["approval_resolution_rate"] * 0.15,
        1,
    )

    return {
        "project_id": project_id,
        "project_name": project.get("name", project_id),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "readiness_score": readiness,
        "readiness_label": (
            "Strong" if readiness >= 80
            else "Developing" if readiness >= 60
            else "Needs Attention"
        ),
        "sample_size": {
            "requirements": total,
            "compliance_mappings": len(mappings),
            "traceability_links": len(traceability),
            "risks": len(risks),
            "approvals": len(approvals),
        },
        "metrics": metrics,
        "quality_indicators": {
            "ambiguous_requirements": ambiguous,
            "conflicted_requirements": conflicted,
            "critical_risks": critical_risks,
            "high_risks": high_risks,
            "pending_approvals": sum(
                1 for item in approvals
                if item.get("status") == "Pending"
            ),
        },
        "limitations": [
            "These are operational quality indicators, not AI model accuracy.",
            "Testability uses a heuristic and requires human review.",
            "Compliance mapping does not establish legal compliance.",
            "A zero score may mean the project has no recorded data.",
        ],
    }


def calculate_benchmark(store: Any, project_ids: list[str] | None = None) -> dict:
    selected_ids = (
        project_ids
        if project_ids is not None
        else list(store.projects.keys())
    )

    results = [
        calculate_project_metrics(project_id, store)
        for project_id in selected_ids
        if project_id in store.projects
    ]

    if not results:
        return {
            "project_count": 0,
            "average_readiness_score": 0.0,
            "projects": [],
        }

    average = round(
        sum(item["readiness_score"] for item in results) / len(results),
        1,
    )

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "project_count": len(results),
        "average_readiness_score": average,
        "projects": [
            {
                "project_id": item["project_id"],
                "project_name": item["project_name"],
                "readiness_score": item["readiness_score"],
                "readiness_label": item["readiness_label"],
                "requirements": item["sample_size"]["requirements"],
            }
            for item in results
        ],
        "note": "Descriptive project comparison, not a ground-truth AI benchmark.",
    }

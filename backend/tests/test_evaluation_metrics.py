from types import SimpleNamespace

from agents.evaluation_metrics import calculate_project_metrics, calculate_benchmark


def make_store():
    return SimpleNamespace(
        projects={"P-1": {"name": "Loan Platform"}},
        requirements={"P-1": [
            {"id": "R-1", "statement": "System shall respond within 2 seconds", "source": "Workshop",
             "categories": ["Performance"], "acceptance_criteria": ["95% of requests complete within 2 seconds"],
             "quality_issues": [], "conflicts_with": [], "compliance_status": "Mapped"},
            {"id": "R-2", "statement": "System should be fast", "source": "Interview",
             "categories": ["Functional"], "acceptance_criteria": ["It should be fast"],
             "quality_issues": [{"issue_type": "Ambiguity", "status": "Open"}],
             "conflicts_with": ["R-1"], "compliance_status": "Needs Human Review"},
        ]},
        compliance_mappings={"P-1": [{"requirement_id": "R-1"}]},
        risks={"P-1": [{"severity": "Critical"}, {"severity": "High"}]},
        traceability={"P-1": [{"requirement_id": "R-1"}]},
        approvals=[{"project_id": "P-1", "status": "Approved"}, {"project_id": "P-1", "status": "Pending"}],
    )


def test_project_metrics_are_bounded_and_explain_sample_size():
    result = calculate_project_metrics("P-1", make_store())
    assert result["sample_size"]["requirements"] == 2
    assert result["metrics"]["requirement_completeness"] == 100.0
    assert result["metrics"]["compliance_coverage"] == 50.0
    assert result["metrics"]["traceability_coverage"] == 50.0
    assert result["quality_indicators"]["ambiguous_requirements"] == 1
    assert 0 <= result["readiness_score"] <= 100
    assert result["limitations"]


def test_unknown_project_raises_key_error():
    try:
        calculate_project_metrics("missing", make_store())
        assert False, "Expected KeyError"
    except KeyError:
        pass


def test_benchmark_aggregates_projects():
    result = calculate_benchmark(make_store())
    assert result["project_count"] == 1
    assert result["projects"][0]["project_id"] == "P-1"

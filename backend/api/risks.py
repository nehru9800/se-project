from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any
from database.store import DataStore
from schemas.risk import RiskItem, RiskSummary

router = APIRouter(prefix="/projects/{project_id}/risks", tags=["Risks"])

@router.get("", response_model=RiskSummary)
def get_risk_summary(project_id: str):
    store = DataStore.get_instance()
    risks = store.risks.get(project_id, [])

    total = len(risks)
    crit = sum(1 for r in risks if r.get("severity") == "Critical")
    high = sum(1 for r in risks if r.get("severity") == "High")
    med = sum(1 for r in risks if r.get("severity") == "Medium")
    low = sum(1 for r in risks if r.get("severity") == "Low")

    # Risk score out of 100
    avg_severity = sum(r.get("severity_score", 0) for r in risks) / max(1, total)
    overall_score = round((avg_severity / 25.0) * 100, 1)

    return RiskSummary(
        project_id=project_id,
        total_risks=total,
        critical_count=crit,
        high_count=high,
        medium_count=med,
        low_count=low,
        risk_score=overall_score,
        risks=[RiskItem(**r) for r in risks]
    )

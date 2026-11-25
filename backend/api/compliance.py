from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any, Optional
from database.store import DataStore
from schemas.compliance import ComplianceMapping, ComplianceReport

router = APIRouter(prefix="/projects/{project_id}/compliance", tags=["Compliance"])

@router.get("", response_model=ComplianceReport)
def get_compliance_report(project_id: str):
    store = DataStore.get_instance()
    mappings = store.compliance_mappings.get(project_id, [])

    total = len(mappings)
    compliant = sum(1 for m in mappings if m.get("status") == "Compliant")
    gaps = sum(1 for m in mappings if m.get("status") == "Compliance Gap")
    pending = sum(1 for m in mappings if m.get("approval_status") == "Pending")
    score = round((compliant / max(1, total)) * 100, 1)

    return ComplianceReport(
        project_id=project_id,
        total_controls=total,
        compliant_count=compliant,
        gap_count=gaps,
        pending_approval_count=pending,
        overall_compliance_score=score,
        mappings=[ComplianceMapping(**m) for m in mappings]
    )

@router.post("/{mapping_id}/approve")
def approve_compliance_mapping(
    project_id: str,
    mapping_id: str,
    officer_name: str = Body("Elena Rostova", embed=True),
    decision: str = Body("Approved", embed=True),
    notes: Optional[str] = Body("", embed=True)
):
    store = DataStore.get_instance()
    mappings = store.compliance_mappings.get(project_id, [])
    for m in mappings:
        if m.get("id") == mapping_id:
            m["approval_status"] = decision
            m["approved_by"] = officer_name
            if notes:
                m["compliance_gap_notes"] = notes

            store.log_audit(
                action="Compliance Mapping Approved",
                user_name=officer_name,
                user_role="Compliance Officer",
                project_id=project_id,
                agent_name="Compliance Agent",
                input_summary=f"Review of control {m.get('control_id')} for {m.get('requirement_id')}",
                output_summary=f"Decision: {decision}. Notes: {notes}",
                decision=decision
            )
            return {"status": "success", "mapping": ComplianceMapping(**m)}

    raise HTTPException(status_code=404, detail="Compliance mapping not found")

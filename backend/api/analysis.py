from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, Optional
from database.store import DataStore
from agents.langgraph_workflow import run_langgraph_pipeline

router = APIRouter(prefix="/projects/{project_id}/analyze", tags=["AI Analysis"])

@router.post("")
def trigger_analysis(
    project_id: str,
    user_name: str = Body("Lead Analyst", embed=True),
    user_role: str = Body("Business Analyst", embed=True)
):
    store = DataStore.get_instance()
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    result = run_langgraph_pipeline(project_id, user_name, user_role)
    #result = CoordinatorAgent.run_full_pipeline(project_id, user_name, user_role)
    return result

@router.get("/stages")
def get_pipeline_stages(project_id: str):
    store = DataStore.get_instance()
    project = store.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    reqs = store.requirements.get(project_id, [])
    comp = store.compliance_mappings.get(project_id, [])
    risks = store.risks.get(project_id, [])
    sdlc = store.sdlc_recommendations.get(project_id)
    pending_appr = [a for a in store.approvals if a.get("project_id") == project_id and a.get("status") == "Pending"]

    stages = [
        {"name": "Input Gathering", "status": "Completed", "detail": f"{len(reqs)} requirements collected"},
        {"name": "Requirement Extraction", "status": "Completed", "detail": "Atomic IEEE statement normalization"},
        {"name": "Multi-Label Classification", "status": "Completed", "detail": "Classified into 10 financial taxonomies"},
        {"name": "Quality & Ambiguity Analysis", "status": "Needs Review" if any(r.get("quality_issues") for r in reqs) else "Completed", "detail": "Ambiguity and SLA testability scan"},
        {"name": "Conflict Detection", "status": "Needs Review" if any(r.get("conflicts_with") for r in reqs) else "Completed", "detail": "Operational and policy contradiction checks"},
        {"name": "RAG Compliance Mapping", "status": "Needs Review" if any(c.get("status") == "Compliance Gap" for c in comp) else "Completed", "detail": "Grounding against GLBA, CFPB, SOX"},
        {"name": "Security & Privacy", "status": "Completed", "detail": "STRIDE threat modeling & encryption check"},
        {"name": "Risk Analysis", "status": "Completed", "detail": f"5x5 matrix ({len(risks)} risks assessed)"},
        {"name": "Validation", "status": "Completed", "detail": "Traceability and testability indices computed"},
        {"name": "SDLC Decision Engine", "status": "Completed" if sdlc else "Pending", "detail": sdlc.get("recommended_model", "Pending") if sdlc else "Pending"},
        {"name": "Human Approval Gates", "status": "Pending" if pending_appr else "Completed", "detail": f"{len(pending_appr)} items awaiting human signoff"}
    ]

    return {
        "project_id": project_id,
        "current_stage": project.get("current_pipeline_stage", "Requirement Gathering"),
        "stages": stages
    }

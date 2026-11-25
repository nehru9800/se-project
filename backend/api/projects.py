from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
from database.store import DataStore
from schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from rules.sdlc_engine import FinTechSDLCRuleEngine
from schemas.project import ProjectFactors

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def list_projects():
    store = DataStore.get_instance()
    projects = []
    for p in store.projects.values():
        reqs = store.requirements.get(p["id"], [])
        p_copy = dict(p)
        p_copy["total_requirements"] = len(reqs)
        p_copy["approved_requirements"] = sum(1 for r in reqs if r.get("approval_status") == "Approved")
        projects.append(ProjectResponse(**p_copy))
    return projects

@router.post("", response_model=ProjectResponse)
def create_project(payload: ProjectCreate):
    store = DataStore.get_instance()
    new_id = f"proj-{uuid.uuid4().hex[:8]}"
    now = datetime.now().isoformat()

    project_data = payload.model_dump()
    project_data["id"] = new_id
    project_data["status"] = "In Progress"
    project_data["current_pipeline_stage"] = "Requirement Gathering"
    project_data["created_at"] = now
    project_data["updated_at"] = now
    project_data["owner"] = "Lead Business Analyst"
    project_data["total_requirements"] = 0
    project_data["approved_requirements"] = 0
    project_data["compliance_score"] = 0.0
    project_data["risk_score"] = 0.0

    store.projects[new_id] = project_data
    store.requirements[new_id] = []
    store.documents[new_id] = []
    store.compliance_mappings[new_id] = []
    store.risks[new_id] = []
    store.traceability[new_id] = []

    # Run initial SDLC evaluation based on factors
    factors = payload.factors
    rec = FinTechSDLCRuleEngine.evaluate(new_id, factors)
    store.sdlc_recommendations[new_id] = rec.model_dump()

    store.log_audit(
        action="Project Created",
        user_name="Lead Business Analyst",
        user_role="Business Analyst",
        project_id=new_id,
        agent_name="Coordinator Agent",
        input_summary=f"Created financial project: {payload.name} ({payload.financial_domain})",
        output_summary=f"Initialized workspace with initial recommended SDLC: {rec.recommended_model}"
    )

    return ProjectResponse(**project_data)

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str):
    store = DataStore.get_instance()
    project = store.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    reqs = store.requirements.get(project_id, [])
    p_copy = dict(project)
    p_copy["total_requirements"] = len(reqs)
    p_copy["approved_requirements"] = sum(1 for r in reqs if r.get("approval_status") == "Approved")
    return ProjectResponse(**p_copy)

@router.post("/{project_id}/reset-demo")
def reset_demo_project(project_id: str):
    store = DataStore.get_instance()
    store.seed_demo_data()
    return {"status": "success", "message": "Demo project data reloaded successfully."}

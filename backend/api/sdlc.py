from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, Optional
from database.store import DataStore
from schemas.sdlc import SDLCRecommendation
from schemas.project import ProjectFactors
from rules.sdlc_engine import FinTechSDLCRuleEngine

router = APIRouter(prefix="/projects/{project_id}/sdlc", tags=["SDLC Decision"])

@router.get("", response_model=SDLCRecommendation)
def get_sdlc_recommendation(project_id: str):
    store = DataStore.get_instance()
    project = store.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    rec = store.sdlc_recommendations.get(project_id)
    if not rec:
        factors = ProjectFactors(**project.get("factors", {}))
        rec_obj = FinTechSDLCRuleEngine.evaluate(project_id, factors)
        store.sdlc_recommendations[project_id] = rec_obj.model_dump()
        rec = store.sdlc_recommendations[project_id]

    return SDLCRecommendation(**rec)

@router.post("/evaluate", response_model=SDLCRecommendation)
def reevaluate_sdlc(project_id: str, factors: ProjectFactors):
    store = DataStore.get_instance()
    project = store.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project["factors"] = factors.model_dump()
    rec_obj = FinTechSDLCRuleEngine.evaluate(project_id, factors)
    store.sdlc_recommendations[project_id] = rec_obj.model_dump()

    store.log_audit(
        action="SDLC Factors Adjusted & Recalculated",
        user_name="Project Manager",
        user_role="Project Manager",
        project_id=project_id,
        agent_name="SDLC Selection Agent",
        input_summary=f"Recalculated with factors: Reg={factors.regulatory_criticality}, Sec={factors.security_criticality}, Vol={factors.requirement_volatility}",
        output_summary=f"New Recommendation: {rec_obj.recommended_model} ({rec_obj.model_scores[0].score}/100)"
    )

    return rec_obj

@router.post("/decision")
def record_sdlc_decision(
    project_id: str,
    decision: str = Body(..., embed=True), # "Approved", "Rejected", "Modified"
    user_name: str = Body("Project Manager", embed=True),
    user_role: str = Body("Project Manager", embed=True),
    comments: Optional[str] = Body("", embed=True),
    selected_model: Optional[str] = Body(None, embed=True)
):
    store = DataStore.get_instance()
    rec = store.sdlc_recommendations.get(project_id)
    if not rec:
        raise HTTPException(status_code=404, detail="SDLC recommendation not found")

    rec["approval_status"] = decision
    rec["approved_by"] = f"{user_name} ({user_role})"
    rec["approval_comments"] = comments
    if selected_model:
        rec["recommended_model"] = selected_model
        # Regenerate workflow for modified model
        wf = FinTechSDLCRuleEngine._generate_workflow(selected_model)
        rec["generated_workflow"] = [w.model_dump() for w in wf]

    store.log_audit(
        action=f"SDLC Decision: {decision}",
        user_name=user_name,
        user_role=user_role,
        project_id=project_id,
        agent_name="Human Approval Agent",
        input_summary=f"Decision on SDLC model: {rec['recommended_model']}",
        output_summary=f"Status: {decision}. Comments: {comments}",
        decision=decision
    )

    return {"status": "success", "recommendation": SDLCRecommendation(**rec)}

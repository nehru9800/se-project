from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
from database.store import DataStore
from schemas.requirement import RequirementCreate, RequirementResponse, RequirementUpdate
from agents.analysis_agents import ClassificationAgent, ClarificationAgent, ComplianceAgent

router = APIRouter(prefix="/projects/{project_id}/requirements", tags=["Requirements"])

@router.get("", response_model=List[RequirementResponse])
def get_requirements(
    project_id: str,
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    risk: Optional[str] = Query(None),
    compliance: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    store = DataStore.get_instance()
    reqs = store.requirements.get(project_id, [])

    filtered = reqs
    if category and category != "All":
        filtered = [r for r in filtered if category in r.get("categories", [])]
    if priority and priority != "All":
        filtered = [r for r in filtered if r.get("priority") == priority]
    if risk and risk != "All":
        filtered = [r for r in filtered if r.get("risk_level") == risk]
    if compliance and compliance != "All":
        filtered = [r for r in filtered if r.get("compliance_status") == compliance]
    if status and status != "All":
        filtered = [r for r in filtered if r.get("status") == status]
    if search:
        s = search.lower()
        filtered = [
            r for r in filtered
            if s in r.get("statement", "").lower()
            or s in r.get("id", "").lower()
            or s in r.get("source", "").lower()
        ]

    return [RequirementResponse(**r) for r in filtered]

@router.post("", response_model=RequirementResponse)
def create_requirement(project_id: str, payload: RequirementCreate):
    store = DataStore.get_instance()
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")

    existing = store.requirements.get(project_id, [])
    new_id = f"FR-REQ-{len(existing)+101}"
    now = datetime.now().isoformat()

    req_data = payload.model_dump()
    req_data["id"] = new_id
    req_data["project_id"] = project_id
    req_data["status"] = "Pending Review"
    req_data["created_at"] = now
    req_data["updated_at"] = now

    # Auto-classify
    cats = ClassificationAgent.classify(payload.statement)
    req_data["categories"] = list(set(req_data.get("categories", []) + cats))

    # Quality check
    issues = ClarificationAgent.analyze_quality(req_data)
    req_data["quality_issues"] = [i.model_dump() for i in issues]
    if issues:
        req_data["status"] = "Under Clarification"
        req_data["confidence"] = 0.55
    else:
        req_data["confidence"] = 0.92

    # RAG check
    comp = ComplianceAgent.analyze_compliance(req_data)
    req_data["compliance_status"] = comp["status"]
    req_data["rag_evidence"] = comp["evidence_quote"]
    req_data["rag_source_citation"] = f"{comp['source_document']} - {comp['control_id']}"
    req_data["approval_status"] = "Pending"
    req_data["conflicts_with"] = []

    store.requirements.setdefault(project_id, []).append(req_data)

    store.log_audit(
        action="Requirement Created",
        user_name="Stakeholder",
        user_role="Stakeholder",
        project_id=project_id,
        agent_name="Requirement Extraction Agent",
        input_summary=payload.statement[:120],
        output_summary=f"Created {new_id} with categories: {', '.join(cats)}"
    )

    return RequirementResponse(**req_data)

@router.get("/{req_id}", response_model=RequirementResponse)
def get_requirement(project_id: str, req_id: str):
    store = DataStore.get_instance()
    reqs = store.requirements.get(project_id, [])
    for r in reqs:
        if r.get("id") == req_id:
            return RequirementResponse(**r)
    raise HTTPException(status_code=404, detail="Requirement not found")

@router.put("/{req_id}", response_model=RequirementResponse)
def update_requirement(project_id: str, req_id: str, payload: RequirementUpdate):
    store = DataStore.get_instance()
    reqs = store.requirements.get(project_id, [])
    for r in reqs:
        if r.get("id") == req_id:
            if payload.statement is not None:
                r["statement"] = payload.statement
            if payload.categories is not None:
                r["categories"] = payload.categories
            if payload.priority is not None:
                r["priority"] = payload.priority
            if payload.status is not None:
                r["status"] = payload.status
            if payload.acceptance_criteria is not None:
                r["acceptance_criteria"] = payload.acceptance_criteria
            if payload.approval_status is not None:
                r["approval_status"] = payload.approval_status
                if payload.approval_status == "Approved":
                    r["status"] = "Approved"

            r["updated_at"] = datetime.now().isoformat()

            store.log_audit(
                action="Requirement Modified",
                user_name="Business Analyst",
                user_role="Business Analyst",
                project_id=project_id,
                agent_name="Coordinator Agent",
                input_summary=f"Modified {req_id}",
                output_summary=f"Status: {r['status']}, Approval: {r.get('approval_status')}"
            )
            return RequirementResponse(**r)

    raise HTTPException(status_code=404, detail="Requirement not found")

@router.post("/{req_id}/clarify")
def clarify_requirement(
    project_id: str,
    req_id: str,
    action: str = Body(..., embed=True), # "accept", "custom", "reject"
    custom_statement: Optional[str] = Body(None, embed=True),
    issue_id: Optional[str] = Body(None, embed=True)
):
    store = DataStore.get_instance()
    reqs = store.requirements.get(project_id, [])
    target = None
    for r in reqs:
        if r.get("id") == req_id:
            target = r
            break
    if not target:
        raise HTTPException(status_code=404, detail="Requirement not found")

    old_stmt = target["statement"]
    if action == "accept":
        # Find suggested revision in quality issues
        rev = None
        for qi in target.get("quality_issues", []):
            if qi.get("suggested_revision"):
                rev = qi["suggested_revision"]
                qi["status"] = "Accepted"
                break
        if rev:
            target["statement"] = rev
        target["quality_issues"] = [qi for qi in target.get("quality_issues", []) if qi["status"] != "Accepted"]
        target["status"] = "Validated" if len(target["quality_issues"]) == 0 else "Under Clarification"
        target["confidence"] = 0.94
    elif action == "custom" and custom_statement:
        target["statement"] = custom_statement
        target["quality_issues"] = []
        target["status"] = "Validated"
        target["confidence"] = 0.92
    elif action == "reject":
        for qi in target.get("quality_issues", []):
            qi["status"] = "Rejected"
        target["status"] = "Validated"

    target["updated_at"] = datetime.now().isoformat()

    store.log_audit(
        action="Clarification Applied",
        user_name="Business Analyst",
        user_role="Business Analyst",
        project_id=project_id,
        agent_name="Clarification Agent",
        input_summary=f"Applied clarification action '{action}' on {req_id}",
        output_summary=f"Old: {old_stmt[:80]}... -> New: {target['statement'][:80]}..."
    )

    return {"status": "success", "requirement": RequirementResponse(**target)}

from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any
from datetime import datetime
import uuid
from database.store import DataStore
from schemas.interview import InterviewMessage, InterviewTurnRequest, InterviewTurnResponse
from agents.stakeholder_agent import StakeholderInteractionAgent
from agents.analysis_agents import ClassificationAgent, ClarificationAgent, ComplianceAgent

router = APIRouter(prefix="/projects/{project_id}/interview", tags=["AI Interview"])

@router.get("", response_model=List[InterviewMessage])
def get_interview_transcript(project_id: str):
    store = DataStore.get_instance()
    messages = store.interview_transcripts.get(project_id, [])
    return [InterviewMessage(**m) for m in messages]

@router.post("/message", response_model=InterviewTurnResponse)
def send_interview_message(project_id: str, payload: InterviewTurnRequest):
    store = DataStore.get_instance()
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")

    transcript = store.interview_transcripts.setdefault(project_id, [])
    now = datetime.now().isoformat()

    # Append user turn
    user_msg = {
        "id": f"msg-user-{len(transcript)+1}",
        "role": "user",
        "agent_name": None,
        "content": payload.user_message,
        "timestamp": now,
        "identified_domain_topics": [],
        "detected_missing_info": []
    }
    transcript.append(user_msg)

    # Process with Stakeholder Interaction Agent
    turn_res = StakeholderInteractionAgent.process_turn(payload.user_message, transcript)

    # Append agent reply
    agent_msg = {
        "id": f"msg-agent-{len(transcript)+1}",
        "role": "agent",
        "agent_name": turn_res["agent_name"],
        "content": turn_res["reply"],
        "timestamp": datetime.now().isoformat(),
        "identified_domain_topics": turn_res.get("missing_aspects_probed", []),
        "detected_missing_info": turn_res.get("missing_aspects_probed", [])
    }
    transcript.append(agent_msg)

    store.log_audit(
        action="Interview Turn",
        user_name="Stakeholder",
        user_role="Stakeholder",
        project_id=project_id,
        agent_name="Stakeholder Interaction Agent",
        input_summary=payload.user_message[:100],
        output_summary=turn_res["reply"][:100]
    )

    return InterviewTurnResponse(**turn_res)

@router.post("/extract")
def extract_requirements_from_interview(project_id: str):
    store = DataStore.get_instance()
    transcript = store.interview_transcripts.get(project_id, [])
    if not transcript:
        raise HTTPException(status_code=400, detail="Interview transcript is empty")

    user_statements = [m["content"] for m in transcript if m.get("role") == "user"]
    reqs = store.requirements.setdefault(project_id, [])

    extracted_count = 0
    for stmt in user_statements:
        # Check if already added
        if any(r.get("original_stakeholder_statement") == stmt for r in reqs):
            continue

        new_id = f"FR-ELICIT-{len(reqs)+101}"
        formal_stmt = stmt if stmt.lower().startswith("the system shall") else f"The system shall {stmt[0].lower() + stmt[1:]}"
        cats = ClassificationAgent.classify(formal_stmt)

        req_item = {
            "id": new_id,
            "project_id": project_id,
            "statement": formal_stmt,
            "categories": cats,
            "priority": "High",
            "source": "Stakeholder Interview Session",
            "original_stakeholder_statement": stmt,
            "business_justification": "Elicited from real-time stakeholder interview session.",
            "assumptions": [],
            "dependencies": [],
            "acceptance_criteria": [f"Verify that {stmt[:60]}"],
            "status": "Pending Review",
            "confidence": 0.88,
            "risk_level": "Medium",
            "compliance_status": "Mapped",
            "quality_issues": [],
            "conflicts_with": [],
            "approval_status": "Pending",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }

        # Check compliance
        comp = ComplianceAgent.analyze_compliance(req_item)
        req_item["compliance_status"] = comp["status"]
        req_item["rag_evidence"] = comp["evidence_quote"]
        req_item["rag_source_citation"] = f"{comp['source_document']} - {comp['control_id']}"

        reqs.append(req_item)
        extracted_count += 1

    return {"status": "success", "extracted_requirements": extracted_count, "total_requirements": len(reqs)}

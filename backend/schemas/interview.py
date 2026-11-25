from pydantic import BaseModel
from typing import List, Optional

class InterviewMessage(BaseModel):
    id: str
    role: str # "agent" or "user"
    agent_name: Optional[str] = "Stakeholder Interaction Agent"
    content: str
    timestamp: str
    identified_domain_topics: List[str] = [] # e.g. ["Loan Types", "KYC", "Transaction Limits", "Audit Logging"]
    detected_missing_info: List[str] = []

class InterviewTurnRequest(BaseModel):
    project_id: str
    user_message: str

class InterviewTurnResponse(BaseModel):
    reply: str
    agent_name: str = "Stakeholder Interaction Agent"
    missing_aspects_probed: List[str]
    suggested_followups: List[str]
    candidate_requirements_found: int
    transcript_length: int

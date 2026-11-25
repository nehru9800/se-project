from pydantic import BaseModel
from typing import Optional

class ApprovalRequest(BaseModel):
    id: str
    project_id: str
    item_type: str # "Requirement Baseline", "Compliance Mapping", "High-Risk Security Item", "SDLC Model Selection", "Conflict Resolution"
    item_id: str
    title: str
    description: str
    target_role: str # "Compliance Officer", "Security Officer", "Project Manager", "Business Analyst"
    status: str = "Pending" # "Pending", "Approved", "Rejected", "Changes Requested"
    requested_at: str
    decided_at: Optional[str] = None
    decided_by: Optional[str] = None
    decision_notes: Optional[str] = None

class ApprovalAction(BaseModel):
    decision: str # "Approved", "Rejected", "Changes Requested"
    notes: Optional[str] = ""
    actor_role: str
    actor_name: str

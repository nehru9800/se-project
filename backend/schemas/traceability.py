from pydantic import BaseModel
from typing import List, Optional

class TraceabilityItem(BaseModel):
    id: str
    stakeholder_statement: str
    requirement_id: str
    requirement_statement: str
    acceptance_criteria: List[str]
    risk_id: Optional[str] = None
    risk_title: Optional[str] = None
    compliance_control_id: Optional[str] = None
    compliance_control_title: Optional[str] = None
    security_control: Optional[str] = None
    test_case_id: Optional[str] = None
    test_case_title: Optional[str] = None
    sdlc_phase: str = "Development & Automated Verification"
    verification_status: str = "Verified"

class TraceabilityGraph(BaseModel):
    project_id: str
    items: List[TraceabilityItem]
    total_coverage_percentage: float = 100.0

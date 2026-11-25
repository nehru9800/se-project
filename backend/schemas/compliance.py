from pydantic import BaseModel, Field
from typing import List, Optional

class ComplianceMapping(BaseModel):
    id: str
    requirement_id: str
    requirement_statement: str
    regulation_name: str # e.g. "GLBA Safeguards Rule 16 CFR Part 314", "PCI-DSS v4.0", "CFPB Reg Z"
    control_id: str # e.g. "GLBA-314.4(c)(1)", "PCI-Req-3.4", "SOX-404-ITGC"
    control_description: str
    evidence_quote: str
    source_document: str
    section: str
    jurisdiction: str = "US Federal / CFPB"
    effective_date: str = "2023-06-09"
    status: str = "Compliant" # "Compliant", "Compliance Gap", "Partial Compliance", "Needs Human Review"
    confidence: float = 0.92
    requires_human_approval: bool = True
    approval_status: str = "Pending" # "Pending", "Approved", "Rejected"
    approved_by: Optional[str] = None
    compliance_gap_notes: Optional[str] = None

class ComplianceReport(BaseModel):
    project_id: str
    total_controls: int
    compliant_count: int
    gap_count: int
    pending_approval_count: int
    overall_compliance_score: float
    mappings: List[ComplianceMapping] = []

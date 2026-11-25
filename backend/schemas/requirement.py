from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class QualityIssue(BaseModel):
    issue_id: str
    issue_type: str # "Ambiguity", "Conflict", "Incompleteness", "Duplicate", "Infeasible", "Untestable"
    severity: str # "High", "Medium", "Low"
    description: str
    affected_text: str
    suggested_clarification: str
    suggested_revision: Optional[str] = None
    status: str = "Open" # "Open", "Accepted", "Rejected", "Customized"

class ClarificationOption(BaseModel):
    option_id: str
    label: str
    description: str
    revised_statement: str

class ClarificationRequest(BaseModel):
    requirement_id: str
    question: str
    context: str
    options: List[ClarificationOption] = []
    answered: bool = False
    chosen_option_id: Optional[str] = None
    custom_response: Optional[str] = None

class RequirementBase(BaseModel):
    statement: str
    categories: List[str] = Field(default_factory=lambda: ["Functional"])
    priority: str = "High" # "Critical", "High", "Medium", "Low"
    source: str = "Stakeholder Interview"
    source_document: Optional[str] = None
    original_stakeholder_statement: Optional[str] = None
    business_justification: Optional[str] = None
    assumptions: List[str] = Field(default_factory=list)
    dependencies: List[str] = Field(default_factory=list)
    acceptance_criteria: List[str] = Field(default_factory=list)

class RequirementCreate(RequirementBase):
    project_id: str

class RequirementUpdate(BaseModel):
    statement: Optional[str] = None
    categories: Optional[List[str]] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    acceptance_criteria: Optional[List[str]] = None
    approval_status: Optional[str] = None

class RequirementResponse(RequirementBase):
    id: str
    project_id: str
    status: str = "Pending Review" # "Draft", "Pending Review", "Under Clarification", "Validated", "Approved", "Rejected"
    confidence: float = 0.88
    confidence_rationale: Optional[str] = None
    risk_level: str = "Medium" # "Low", "Medium", "High", "Critical"
    compliance_status: str = "Mapped" # "Mapped", "Gap", "Compliant", "Not Applicable"
    quality_issues: List[QualityIssue] = Field(default_factory=list)
    conflicts_with: List[str] = Field(default_factory=list)
    rag_evidence: Optional[str] = None
    rag_source_citation: Optional[str] = None
    approval_status: str = "Pending" # "Pending", "Approved", "Rejected", "Changes Requested"
    approved_by: Optional[str] = None
    created_at: str
    updated_at: str

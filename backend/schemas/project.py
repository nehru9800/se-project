from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ProjectFactors(BaseModel):
    regulatory_criticality: float = Field(default=0.85, ge=0.0, le=1.0, description="Criticality of compliance: 0 (low) to 1 (high)")
    security_criticality: float = Field(default=0.90, ge=0.0, le=1.0, description="Security sensitivity: 0 (low) to 1 (high)")
    requirement_volatility: float = Field(default=0.60, ge=0.0, le=1.0, description="Frequency of change: 0 (fixed) to 1 (volatile)")
    project_complexity: float = Field(default=0.75, ge=0.0, le=1.0)
    system_size: str = Field(default="Medium", description="Small, Medium, Large, Enterprise")
    legacy_dependency: float = Field(default=0.65, ge=0.0, le=1.0)
    continuous_deployment: bool = Field(default=True)
    stakeholder_availability: float = Field(default=0.80, ge=0.0, le=1.0)
    formal_verification_needed: bool = Field(default=True)
    consequences_of_failure: str = Field(default="Severe Financial & Legal Penalty")
    budget_flexibility: str = Field(default="Moderate")
    timeline_months: int = Field(default=12)

class ProjectBase(BaseModel):
    name: str
    financial_domain: str = "Loan Processing / Digital Origination"
    description: str
    business_objective: str
    expected_users: str = "Retail Borrowers, Loan Officers, Risk Underwriters, Compliance Auditors"
    project_size: str = "Enterprise"
    budget: str = "$1,850,000"
    timeline: str = "12 Months"
    factors: ProjectFactors = Field(default_factory=ProjectFactors)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    factors: Optional[ProjectFactors] = None

class ProjectResponse(ProjectBase):
    id: str
    status: str = "In Progress"
    current_pipeline_stage: str = "Requirement Gathering"
    created_at: str
    updated_at: str
    owner: str = "Senior Business Analyst"
    total_requirements: int = 0
    approved_requirements: int = 0
    compliance_score: float = 0.0
    risk_score: float = 0.0

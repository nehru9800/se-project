from pydantic import BaseModel, Field
from typing import List, Optional

class RiskItem(BaseModel):
    id: str
    project_id: str
    description: str
    category: str # "Business", "Technical", "Security", "Compliance", "Operational"
    likelihood: int = Field(ge=1, le=5, description="1 (Rare) to 5 (Almost Certain)")
    impact: int = Field(ge=1, le=5, description="1 (Negligible) to 5 (Catastrophic)")
    severity: str # "Critical", "High", "Medium", "Low"
    severity_score: int # likelihood * impact (1 to 25)
    affected_requirement_id: Optional[str] = None
    affected_requirement_statement: Optional[str] = None
    mitigation_strategy: str
    owner: str = "Risk Management Team"
    status: str = "Identified" # "Identified", "Mitigating", "Mitigated", "Accepted"

class RiskSummary(BaseModel):
    project_id: str
    total_risks: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    risk_score: float # 0 - 100
    risks: List[RiskItem] = []

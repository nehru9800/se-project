from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class SDLCModelScore(BaseModel):
    model_name: str # "DevSecOps", "V-Model", "Agile", "Spiral", "Waterfall", "Hybrid (DevSecOps + V-Model)"
    score: float # 0 to 100
    is_recommended: bool = False
    suitability_level: str # "Highly Recommended", "Viable with Mitigations", "Not Recommended"
    supporting_factors: List[str]
    potential_limitations: List[str]
    applicable_conditions: List[str]

class SDLCWorkflowPhase(BaseModel):
    step_number: int
    phase_name: str
    responsible_role: str
    activities: List[str]
    deliverables: List[str]
    security_activities: List[str]
    testing_focus: List[str]
    compliance_checkpoint: str
    approval_gate: str
    entry_criteria: str
    exit_criteria: str

class SDLCRecommendation(BaseModel):
    project_id: str
    recommended_model: str
    confidence: float
    rule_engine_version: str = "FinTech-SDLC-Decision-Engine-v2.4"
    model_scores: List[SDLCModelScore]
    ai_generated_explanation: str
    factor_weights_used: Dict[str, float]
    approval_status: str = "Pending" # "Pending", "Approved", "Modified", "Rejected"
    approved_by: Optional[str] = None
    approval_comments: Optional[str] = None
    generated_workflow: List[SDLCWorkflowPhase] = []

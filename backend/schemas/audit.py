from pydantic import BaseModel
from typing import Optional, Dict, Any

class AuditLogEntry(BaseModel):
    id: str
    timestamp: str
    project_id: Optional[str] = None
    user_name: str
    user_role: str
    action: str
    agent_name: Optional[str] = None
    input_summary: Optional[str] = None
    output_summary: Optional[str] = None
    retrieved_sources: Optional[str] = None
    decision: Optional[str] = None
    metadata: Dict[str, Any] = {}

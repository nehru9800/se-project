from fastapi import APIRouter, Query
from typing import List, Optional
from database.store import DataStore
from schemas.audit import AuditLogEntry

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])

@router.get("", response_model=List[AuditLogEntry])
def get_audit_logs(
    project_id: Optional[str] = Query(None),
    user_role: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200)
):
    store = DataStore.get_instance()
    logs = store.audit_logs
    if project_id:
        logs = [l for l in logs if l.get("project_id") == project_id]
    if user_role and user_role != "All":
        logs = [l for l in logs if l.get("user_role") == user_role]
    return [AuditLogEntry(**l) for l in logs[:limit]]

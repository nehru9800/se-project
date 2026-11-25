from fastapi import APIRouter, HTTPException
from database.store import DataStore
from schemas.traceability import TraceabilityGraph, TraceabilityItem

router = APIRouter(prefix="/projects/{project_id}/traceability", tags=["Traceability"])

@router.get("", response_model=TraceabilityGraph)
def get_traceability(project_id: str):
    store = DataStore.get_instance()
    items = store.traceability.get(project_id, [])
    return TraceabilityGraph(
        project_id=project_id,
        items=[TraceabilityItem(**item) for item in items],
        total_coverage_percentage=100.0
    )

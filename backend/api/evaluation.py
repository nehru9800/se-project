
from fastapi import APIRouter, Depends, HTTPException

from database.store import DataStore
from database.models import User
from auth.dependencies import get_current_user

from agents.evaluation_metrics import (
    calculate_project_metrics,
    calculate_benchmark,
)

router = APIRouter(tags=["Evaluation & Benchmarking"])


@router.get("/projects/{project_id}/evaluation")
def get_project_evaluation(
    project_id: str,
    user: User = Depends(get_current_user),
):
    store = DataStore.get_instance()

    project = store.projects.get(project_id)

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    owner_id = project.get("owner_user_id")

    if owner_id is not None and owner_id != user.id:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    try:
        return calculate_project_metrics(project_id, store)
    except KeyError:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )


@router.get("/evaluation/benchmark")
def get_evaluation_benchmark(
    user: User = Depends(get_current_user),
):
    store = DataStore.get_instance()

    visible_ids = [
        project_id
        for project_id, project in store.projects.items()
        if (
            project.get("owner_user_id") is None
            or project.get("owner_user_id") == user.id
        )
    ]

    return calculate_benchmark(store, visible_ids)

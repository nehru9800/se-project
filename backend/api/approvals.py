
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, Depends

from database.store import DataStore
from database.models import User
from schemas.approval import ApprovalRequest, ApprovalAction
from auth.dependencies import get_current_user


router = APIRouter(
    prefix="/approvals",
    tags=["Human Approvals"],
)


ALLOWED_DECISIONS = {
    "Approved",
    "Rejected",
    "Changes Requested",
    "Request Changes",
}

ADMIN_ROLES = {
    "Super Admin",
    "Admin",
    "Administrator",
}


def check_approval_permission(
    approval: dict,
    user: User,
):
    """Verify that the authenticated user can decide this approval."""

    if user.role in ADMIN_ROLES:
        return

    target_role = approval.get("target_role")

    if target_role and user.role != target_role:
        raise HTTPException(
            status_code=403,
            detail=(
                f"This approval requires the {target_role} role. "
                f"Your role is {user.role}."
            ),
        )


@router.get("", response_model=List[ApprovalRequest])
def list_approvals(
    project_id: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
):
    store = DataStore.get_instance()

    approvals = store.approvals

    if project_id:
        approvals = [
            a for a in approvals
            if a.get("project_id") == project_id
        ]

    # Non-admin users can see approvals assigned to their role.
    if user.role not in ADMIN_ROLES:
        approvals = [
            a for a in approvals
            if a.get("target_role") == user.role
        ]

    if role and role != "All":
        approvals = [
            a for a in approvals
            if a.get("target_role") == role
        ]

    if status:
        approvals = [
            a for a in approvals
            if a.get("status") == status
        ]

    return [
        ApprovalRequest(**a)
        for a in approvals
    ]


@router.post(
    "/{approval_id}/action",
    response_model=ApprovalRequest,
)
def record_approval_action(
    approval_id: str,
    payload: ApprovalAction,
    user: User = Depends(get_current_user),
):
    store = DataStore.get_instance()

    decision = payload.decision

    if decision not in ALLOWED_DECISIONS:
        raise HTTPException(
            status_code=422,
            detail=(
                "Invalid decision. Allowed decisions: "
                + ", ".join(sorted(ALLOWED_DECISIONS))
            ),
        )

    for approval in store.approvals:

        if approval.get("id") != approval_id:
            continue

        # Verify that the authenticated user has permission.
        check_approval_permission(approval, user)

        if approval.get("status") != "Pending":
            raise HTTPException(
                status_code=409,
                detail="This approval has already been decided.",
            )

        now = datetime.now().isoformat()

        # Never trust the actor identity supplied in the request.
        actor_name = user.full_name
        actor_role = user.role

        # Record the decision.
        approval["status"] = (
            "Changes Requested"
            if decision == "Request Changes"
            else decision
        )

        approval["decided_at"] = now
        approval["decided_by"] = (
            f"{actor_name} ({actor_role})"
        )
        approval["decision_notes"] = payload.notes

        # Preserve a complete decision history.
        history = approval.setdefault(
            "action_history",
            [],
        )

        history.append({
            "decision": decision,
            "actor_name": actor_name,
            "actor_role": actor_role,
            "decided_at": now,
            "notes": payload.notes,
        })

        # Update the related requirement if applicable.
        if approval.get("item_type") == "Requirement Baseline":

            requirements = store.requirements.get(
                approval.get("project_id"),
                [],
            )

            for requirement in requirements:

                if requirement.get("id") == approval.get("item_id"):

                    requirement["approval_status"] = (
                        approval["status"]
                    )

                    break

        # Record the governance audit event.
        store.log_audit(
            action=f"Human Approval: {decision}",
            user_name=actor_name,
            user_role=actor_role,
            project_id=approval.get("project_id"),
            agent_name="Human Approval Agent",
            input_summary=(
                f"Action on {approval.get('title')} "
                f"({approval_id})"
            ),
            output_summary=(
                f"Outcome: {decision}. "
                f"Notes: {payload.notes}"
            ),
            decision=decision,
        )

        return ApprovalRequest(**approval)

    raise HTTPException(
        status_code=404,
        detail="Approval request not found",
    )

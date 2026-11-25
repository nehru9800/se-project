
import jwt

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from config import settings
from database.db import get_db
from database.models import User, AuthSession


bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    if credentials is None:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )

        user_id = int(payload["sub"])

        # The session UUID is stored in the JWT jti claim.
        session_jti = payload.get("sid") or payload.get("jti")

        if not session_jti:
            raise ValueError("Session identifier missing")

    except (
        jwt.PyJWTError,
        KeyError,
        ValueError,
        TypeError,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    session = db.scalar(
        select(AuthSession).where(
            AuthSession.jti == session_jti
        )
    )

    user = db.get(User, user_id)

    if (
        not session
        or session.revoked
        or not user
        or not user.is_active
        or session.user_id != user.id
    ):
        raise HTTPException(
            status_code=401,
            detail="Session is no longer valid",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

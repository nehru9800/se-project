
import jwt

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from config import settings
from database.db import get_db
from database.models import User, AuthSession
from auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    new_session_id,
)
from auth.dependencies import get_current_user


router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegisterInput(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=150)
    password: str = Field(min_length=12, max_length=128)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


def issue_session(user: User, db: Session):
    # Generate a unique token/session identifier.
    session_jti = new_session_id()

    token, expires = create_access_token(
        user.id,
        user.role,
        session_jti,
    )

    # Store the session using the database's integer primary key.
    # jti is the UUID-like identifier used to find this session.
    session = AuthSession(
        user_id=user.id,
        jti=session_jti,
        expires_at=expires.replace(tzinfo=None),
        revoked=False,
    )

    db.add(session)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_at": expires.isoformat(),
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
        },
    }


@router.post("/register", status_code=201)
def register(
    data: RegisterInput,
    db: Session = Depends(get_db),
):
    email = str(data.email).lower()

    existing = db.scalar(
        select(User).where(User.email == email)
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    role = "Business Analyst"

    if (
        settings.BOOTSTRAP_ADMIN_EMAIL
        and email == settings.BOOTSTRAP_ADMIN_EMAIL.lower()
    ):
        role = "Super Admin"

    user = User(
        email=email,
        full_name=data.full_name.strip(),
        password_hash=hash_password(data.password),
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return issue_session(user, db)


@router.post("/login")
def login(
    data: LoginInput,
    db: Session = Depends(get_db),
):
    email = str(data.email).lower()

    user = db.scalar(
        select(User).where(User.email == email)
    )

    if (
        not user
        or not verify_password(data.password, user.password_hash)
        or not user.is_active
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
        )

    return issue_session(user, db)


@router.get("/me")
def me(
    user: User = Depends(get_current_user),
):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
    }


@router.post("/logout")
def logout(
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    authorization = request.headers.get("authorization", "")

    token = authorization.removeprefix("Bearer ").strip()

    try:
        claims = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )

        session_jti = claims.get("sid") or claims.get("jti")

        if not session_jti:
            raise ValueError("Session identifier missing")

    except (jwt.PyJWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid session",
        )

    session = db.scalar(
        select(AuthSession).where(
            AuthSession.jti == session_jti
        )
    )

    if session and session.user_id == user.id:
        session.revoked = True
        db.commit()

    return {"status": "logged_out"}


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str,
    admin: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if admin.role not in {
        "Super Admin",
        "Admin",
        "Administrator",
    }:
        raise HTTPException(
            status_code=403,
            detail="Administrator permission required",
        )

    allowed_roles = {
        "Business Analyst",
        "Project Manager",
        "Compliance Officer",
        "Security Officer",
        "Risk Manager",
        "Super Admin",
    }

    if role not in allowed_roles:
        raise HTTPException(
            status_code=422,
            detail="Unsupported role",
        )

    target = db.get(User, user_id)

    if not target:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    target.role = role
    db.commit()
    db.refresh(target)

    return {
        "id": target.id,
        "email": target.email,
        "full_name": target.full_name,
        "role": target.role,
    }

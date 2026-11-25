
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.db import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    full_name: Mapped[str] = mapped_column(
        String(150), nullable=False
    )
    password_hash: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    role: Mapped[str] = mapped_column(
        String(50), default="Business Analyst", nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.utcnow, nullable=False
    )

    sessions: Mapped[list["AuthSession"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    # Match the existing PostgreSQL and Alembic integer primary key.
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index=True,
        nullable=False,
    )

    # The UUID/token identifier is stored here, not in the integer ID.
    jti: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False, index=True
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False
    )

    revoked: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.utcnow, nullable=False
    )

    user: Mapped[User] = relationship(
        back_populates="sessions"
    )


class AppState(Base):
    __tablename__ = "app_state"

    key: Mapped[str] = mapped_column(
        String(80), primary_key=True
    )

    payload: Mapped[dict] = mapped_column(
        JSON, nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        onupdate=utcnow,
    )


class DomainRecord(Base):
    __tablename__ = "domain_records"

    entity_type: Mapped[str] = mapped_column(
        String(60), primary_key=True
    )

    record_key: Mapped[str] = mapped_column(
        String(160), primary_key=True
    )

    record_id: Mapped[str] = mapped_column(
        String(160), index=True
    )

    project_id: Mapped[str | None] = mapped_column(
        String(160), index=True, nullable=True
    )

    ordinal: Mapped[int] = mapped_column(default=0)

    payload: Mapped[dict] = mapped_column(
        JSON, nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        onupdate=utcnow,
    )

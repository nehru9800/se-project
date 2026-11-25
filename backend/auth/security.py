import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from config import settings


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    hashed = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=2**14,
        r=8,
        p=1,
    )
    return f"scrypt${salt.hex()}${hashed.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, salt_hex, hash_hex = stored_hash.split("$", 2)
        if algorithm != "scrypt":
            return False

        expected = bytes.fromhex(hash_hex)
        actual = hashlib.scrypt(
            password.encode("utf-8"),
            salt=bytes.fromhex(salt_hex),
            n=2**14,
            r=8,
            p=1,
        )
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def create_access_token(user_id: int, role: str, jti: str):
    now = datetime.now(timezone.utc)
    expires = now + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "role": role,
        "jti": jti,
        "iat": now,
        "exp": expires,
    }

    token = jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )

    return token, expires


def new_session_id() -> str:
    return secrets.token_urlsafe(32)
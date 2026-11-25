
from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import secrets
import jwt
from config import settings


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    result = hashlib.scrypt(
        password.encode(),
        salt=salt,
        n=2**14,
        r=8,
        p=1
    )
    return f"scrypt$16384$8$1${salt.hex()}${result.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        scheme, n, r, p, salt_hex, expected = encoded.split("$")
        if scheme != "scrypt":
            return False

        actual = hashlib.scrypt(
            password.encode(),
            salt=bytes.fromhex(salt_hex),
            n=int(n),
            r=int(r),
            p=int(p)
        )
        return hmac.compare_digest(actual.hex(), expected)
    except (ValueError, TypeError):
        return False


def create_access_token(user_id: int, session_id: str):
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    token = jwt.encode(
        {"sub": str(user_id), "sid": session_id, "exp": expires},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return token, expires

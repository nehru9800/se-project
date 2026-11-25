

import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = (
        "Agentic AI Financial Requirements & SDLC Decision Support System"
    )
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"

    # LLM Settings
    LLM_PROVIDER: str = "gemini"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    LLM_MODEL: str = "gemini-1.5-flash"

    # JWT Settings
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    BOOTSTRAP_ADMIN_EMAIL: Optional[str] = None

    # Storage paths
    UPLOAD_DIR: str = os.path.join(
        os.path.dirname(__file__), "uploads"
    )
    GENERATED_DOCS_DIR: str = os.path.join(
        os.path.dirname(__file__), "generated_docs"
    )
    DATA_FILE: str = os.path.join(
        os.path.dirname(__file__), "data_store.json"
    )

    # PostgreSQL
    DATABASE_URL: str

    # RAG settings
    CONFIDENCE_THRESHOLD: float = 0.80

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="allow"
    )


settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.GENERATED_DOCS_DIR, exist_ok=True)

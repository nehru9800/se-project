
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from config import settings
from database.db import engine
from database.store import DataStore
from auth.dependencies import get_current_user

from api.auth import router as auth_router
from api.projects import router as projects_router
from api.requirements import router as requirements_router
from api.analysis import router as analysis_router
from api.interview import router as interview_router
from api.compliance import router as compliance_router
from api.risks import router as risks_router
from api.sdlc import router as sdlc_router
from api.traceability import router as traceability_router
from api.documents import router as documents_router
from api.approvals import router as approvals_router
from api.audit import router as audit_router
from api.knowledge import router as knowledge_router
from api.evaluation import router as evaluation_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    DataStore.get_instance(settings.DATA_FILE)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Agentic AI Financial Requirements and "
        "SDLC Decision Support System"
    ),
    lifespan=lifespan,
)

origins = [
    x.strip()
    for x in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if x.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=settings.API_PREFIX)

protected = [Depends(get_current_user)]

routers = [
    projects_router,
    requirements_router,
    analysis_router,
    interview_router,
    compliance_router,
    risks_router,
    sdlc_router,
    traceability_router,
    documents_router,
    approvals_router,
    audit_router,
    knowledge_router,
    evaluation_router,
]

for router in routers:
    app.include_router(
        router,
        prefix=settings.API_PREFIX,
        dependencies=protected,
    )


@app.get("/health", tags=["Health"])
def health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected",
        "llm_provider": settings.LLM_PROVIDER,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )


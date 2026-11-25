# Implementation guide — Steps 7–10

This upgrade extends the existing Steps 1–6 application. It does not replace the current authentication, project APIs, LangGraph workflow, approval routes or database model.

## Integrate the evaluation API into your existing backend

Do not replace `backend/main.py`. After extracting this upgrade into the existing project root, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\apply_steps7_10.ps1
```

The script adds the evaluation router import and appends it to your existing protected router list. It creates `backend/main.py.steps7-10.bak` before changing the file. It is safe to run again.

## Step 7 — Evaluation and benchmarking

- `GET /api/v1/projects/{project_id}/evaluation` returns project quality and coverage indicators.
- `GET /api/v1/evaluation/benchmark` compares readiness indicators across projects.
- The React sidebar now includes **Quality Metrics & Benchmarking**.
- Readiness is a weighted operational index (completeness 25%, acceptance testability 20%, compliance coverage 20%, traceability coverage 20%, approval resolution 15%). It is not AI accuracy, a legal opinion, or compliance certification. Review sample sizes and limitations before interpreting scores.

## Step 8 — Frontend improvements

- Adds an evaluation screen with refresh, loading/error states, sample counts, metric progress bars, portfolio average, quality indicators and metric limitations.
- Keeps the existing React 19 + TypeScript + Vite application and existing screens.

## Step 9 — Docker and CI/CD

Files added: `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx/default.conf`, `docker-compose.yml`, `.dockerignore`, and `.github/workflows/ci.yml`.

For a containerized local run, first make sure `backend/.env` exists and contains your current JWT and LLM settings. Then from the project root:

```powershell
docker compose up --build -d
docker compose ps
```

Open `http://localhost:8080`. API docs: `http://localhost:8080/docs`. Health: `http://localhost:8080/health`.

Compose uses a separate named PostgreSQL volume and host port `5434` by default, so it does not overwrite or collide with an existing local PostgreSQL container using host port `5433`. It starts a fresh database; existing PostgreSQL data is not copied automatically. Keep the current database and its volume as a backup until you deliberately migrate data.

The Compose backend loads `backend/.env` for JWT/LLM settings, but overrides `DATABASE_URL` to connect to the Compose PostgreSQL service. Change the Compose PostgreSQL credentials before using this setup beyond local development. Never commit `.env` or real secrets.

## Step 10 — Automated tests

Backend tests:

```powershell
cd backend
python -m pip install -r requirements.txt
python -m alembic upgrade head
python -m pytest -q
```

Frontend build/type check:

```powershell
cd ..\frontend
npm ci
npm run typecheck
npm run build
```

Browser end-to-end smoke test (optional locally):

```powershell
cd ..\backend
python -m pip install -r requirements-dev.txt
python -m playwright install chromium
$env:E2E_BASE_URL = "http://localhost:8080"
python -m pytest tests/e2e -q
```

The browser test registers a temporary user, enters the authenticated workspace, opens Evaluation and verifies the metrics screen. It is skipped unless `E2E_BASE_URL` is set. The GitHub Actions workflow runs Python tests, frontend build, and Docker configuration checks on pushes and pull requests.

## CI configuration

Add the repository to GitHub and push to `main` or `master`. The workflow at `.github/workflows/ci.yml` runs backend migration/tests, frontend type-check/build, a Docker-backed browser registration/login/evaluation smoke test, and Docker Compose configuration validation. For production deployment, configure a managed PostgreSQL database, TLS/reverse proxy, secret store, backups, restricted CORS origins and monitoring; do not use the local default Compose password.

#!/usr/bin/env bash
# Emergent preview launcher.
# Supervisor runs `yarn dev` inside /app -> this script.
# It starts the SAME stack as production (VPS): FastAPI backend + Vite frontend,
# so the preview and production run one identical codebase (/backend + /frontend).
set -euo pipefail

# Load environment (MONGO_URL, DB_NAME, CORS_ORIGINS, ...) from /app/.env
set -a
[ -f /app/.env ] && . /app/.env
set +a

# --- FastAPI backend (port 8009) -------------------------------------------
# Use an explicit python that has the backend deps installed. Prefer the
# project venv, fall back to whatever python3/uvicorn is on PATH.
if [ -x /root/.venv/bin/python3 ]; then
  PYBIN=/root/.venv/bin/python3
else
  PYBIN="$(command -v python3 || echo python3)"
fi
cd /app/backend
"${PYBIN}" -m uvicorn server:app --host 0.0.0.0 --port 8009 &
BACKEND_PID=$!
echo "[dev.sh] FastAPI backend started (pid ${BACKEND_PID}) on :8009"

# Make sure the backend is torn down when this script/vite exits.
trap 'kill ${BACKEND_PID} 2>/dev/null || true' EXIT INT TERM

# --- Vite frontend (port 3000, foreground) ---------------------------------
# Vite dev-proxies /api -> http://localhost:8009 (see vite.config.js).
cd /app/frontend
echo "[dev.sh] Starting Vite dev server on :3000"
exec node_modules/.bin/vite --host 0.0.0.0 --port 3000

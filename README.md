# Ink Loom Builder

Local scaffold for the WCC Hackathon: AI-powered brand intelligence and interactive landing page generator.

## Backend

- `backend/main.py` — FastAPI server (Groq or xAI Grok-compatible API).

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env and set GROQ_API_KEY and/or XAI_API_KEY
uvicorn main:app --reload --port 8000
```

Health check: `GET http://localhost:8000/api/health`

## Frontend

- `frontend/` — Vite + React + Tailwind app.

```powershell
cd frontend
npm install
npm run dev
```

Optional: create `frontend/.env` with `VITE_API_URL=http://localhost:8000/api` if the API is not on the default URL.

## API keys

| Variable | Purpose |
|----------|---------|
| `GROQ_API_KEY` | Uses Groq OpenAI-compatible API (default model: `llama-3.3-70b-versatile`) |
| `XAI_API_KEY` | Uses xAI API (default model: `grok-2-1212`) |
| `LLM_MODEL` | Optional model override for either provider |

Groq is preferred when both keys are set.

## Lovable UI

Copy your Lovable export into `lovable-ui/` (see `lovable-ui/README.md`), then ask to integrate — layout/components merge into `frontend/` while chat and API behavior stay the same.

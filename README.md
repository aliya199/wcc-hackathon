# Ink Loom Builder

Local scaffold for the WCC Hackathon: AI-powered brand intelligence and interactive landing page generator.

Backend:
- `backend/main.py` — FastAPI server that proxies prompts to xAI Grok-compatible API.
- Install and run:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
$env:XAI_API_KEY="your_grok_key_here"
uvicorn main:app --reload --port 8000
```

Frontend:
- `frontend/` — Vite + React + Tailwind app.
- Install and run:

```bash
cd frontend
npm install
npm run dev
```

Notes:
- The backend expects `XAI_API_KEY` (or `OPENAI_API_KEY`) env var for the Grok API.
- The frontend calls `http://localhost:8000/api/chat` and `/api/merge`.

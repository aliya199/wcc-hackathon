import json
import os
import re
from typing import Any, Dict, List, Optional, Tuple

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Ink Loom AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

_client: Optional[OpenAI] = None
_llm_model: Optional[str] = None

TEMPLATE_LIBRARY = [
    {"id": "hero_bold_01", "type": "hero", "vibe": ["energetic", "saas", "modern"], "description": "Split screen hero with high-contrast call-to-action"},
    {"id": "hero_minimal_02", "type": "hero", "vibe": ["clean", "minimal", "editorial"], "description": "Centered elegant hero with typography emphasis"},
    {"id": "features_bento_01", "type": "features", "vibe": ["modern", "tech", "saas"], "description": "Bento-grid feature showcase with interactive cards"},
    {"id": "features_grid_02", "type": "features", "vibe": ["clean", "minimal", "corporate"], "description": "3-column structured feature layout with icon badges"},
    {"id": "cta_glow_01", "type": "cta", "vibe": ["dark_mode", "energetic", "modern"], "description": "High-conversion glow card with email capture form"},
]


class ChatRequest(BaseModel):
    user_message: str
    conversation_history: List[Dict[str, str]] = []
    current_layout: Optional[List[Dict[str, Any]]] = None
    current_brand: Optional[Dict[str, Any]] = None


class MergeRequest(BaseModel):
    option_a: List[Dict[str, Any]]
    option_b: List[Dict[str, Any]]
    user_preference: str


SYSTEM_PROMPT = f"""
You are Ink Loom AI, a brand identity architect and dynamic web developer.
You help creators turn rough product ideas into structured brand kits and responsive, animated landing pages.

AVAILABLE TEMPLATE LIBRARY:
{json.dumps(TEMPLATE_LIBRARY, indent=2)}

RULES:
1. Always return a strictly valid JSON object matching the requested schema. No markdown fences.
2. Maintain brand consistency across color palettes (3-4 hex codes), Google Fonts, and Framer Motion profiles ("energetic_stagger", "minimal_fade", "slide_reveal").
3. Select appropriate component template_ids from the AVAILABLE TEMPLATE LIBRARY.
4. When updating or generating layout, populate realistic, compelling copy for each section.

RESPONSE JSON SCHEMA:
{{
  "reply": "Conversational explanation of choices and next steps",
  "brand": {{
    "name": "Brand Name",
    "tagline": "Brand Tagline",
    "primary_color": "#HEX",
    "secondary_color": "#HEX",
    "accent_color": "#HEX",
    "bg_color": "#HEX",
    "heading_font": "Inter",
    "body_font": "Inter",
    "motion_profile": "energetic_stagger"
  }},
  "layout": [
    {{
      "id": "sec_1",
      "template_id": "hero_bold_01",
      "section_type": "hero",
      "content": {{
        "headline": "Main Title",
        "subheadline": "Subtitle paragraph",
        "cta_text": "Button Label"
      }}
    }}
  ]
}}
"""


def _make_openai_client(api_key: str, base_url: str) -> OpenAI:
    try:
        return OpenAI(api_key=api_key, base_url=base_url)
    except TypeError:
        return OpenAI(api_key=api_key, api_base=base_url)


def get_llm() -> Tuple[OpenAI, str]:
    global _client, _llm_model
    if _client is not None and _llm_model is not None:
        return _client, _llm_model

    groq_key = os.getenv("GROQ_API_KEY")
    xai_key = os.getenv("XAI_API_KEY") or os.getenv("OPENAI_API_KEY")

    if groq_key:
        _client = _make_openai_client(groq_key, "https://api.groq.com/openai/v1")
        _llm_model = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
        return _client, _llm_model

    if not xai_key or xai_key in ("your_grok_key", "your_grok_key_here"):
        raise HTTPException(
            status_code=503,
            detail="Set GROQ_API_KEY or XAI_API_KEY in backend/.env (see .env.example).",
        )

    _client = _make_openai_client(xai_key, "https://api.x.ai/v1")
    _llm_model = os.getenv("LLM_MODEL", "grok-2-1212")
    return _client, _llm_model


def extract_message_content(response: Any) -> Optional[str]:
    try:
        content = response.choices[0].message.content
        if content:
            return content
    except Exception:
        pass
    try:
        return response["choices"][0]["message"]["content"]
    except Exception:
        return None


def parse_llm_json(content: str) -> Any:
    text = content.strip()
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if fence_match:
        text = fence_match.group(1).strip()
    return json.loads(text)


def complete_json(messages: List[Dict[str, str]]) -> Any:
    client, model = get_llm()
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            response_format={"type": "json_object"},
        )
    except Exception:
        response = client.chat.completions.create(model=model, messages=messages)
    content = extract_message_content(response)
    if not content:
        return {"reply": "No content returned from model"}
    try:
        return parse_llm_json(content)
    except json.JSONDecodeError:
        return {"reply": content}


@app.get("/api/health")
async def health():
    groq = bool(os.getenv("GROQ_API_KEY"))
    xai = bool(os.getenv("XAI_API_KEY") or os.getenv("OPENAI_API_KEY"))
    return {"status": "ok", "llm_configured": groq or xai}


@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        messages: List[Dict[str, str]] = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in req.conversation_history[-6:]:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})

        context_payload = {
            "user_prompt": req.user_message,
            "active_layout": req.current_layout,
            "active_brand": req.current_brand,
        }
        messages.append({"role": "user", "content": json.dumps(context_payload)})

        return complete_json(messages)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/api/merge")
async def merge_endpoint(req: MergeRequest):
    try:
        merge_prompt = f"""
User wants to merge two design options based on this instruction: "{req.user_preference}".
Option A Layout: {json.dumps(req.option_a)}
Option B Layout: {json.dumps(req.option_b)}

Return a single merged layout JSON object with key merged_layout containing a list of sections stitched from Option A and Option B.
Schema: {{"merged_layout": [...]}}
"""
        messages = [
            {"role": "system", "content": "You are a UI/UX layout stitching agent. Return valid JSON only."},
            {"role": "user", "content": merge_prompt},
        ]
        result = complete_json(messages)
        if isinstance(result, dict) and "merged_layout" in result:
            return result
        if isinstance(result, dict) and "reply" in result:
            return {"merged_layout": None, "reply": result["reply"]}
        return {"merged_layout": None}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

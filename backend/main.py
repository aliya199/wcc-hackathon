import os
import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI(title="Ink Loom AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate OpenAI client; default placeholder key so you can set your own locally
# Prefer GROQ provider if provided (Sanity/Groq), otherwise fall back to xAI/OPENAI
_client = None

def get_client():
    """Lazily instantiate OpenAI client and support both `base_url` and `api_base` init names."""
    global _client
    if _client is not None:
        return _client

    groq_key = os.getenv("GROQ_API_KEY")
    xai_key = os.getenv("XAI_API_KEY") or os.getenv("OPENAI_API_KEY")
    api_key = groq_key or xai_key or os.getenv("GROQ_API_KEY") or "your_grok_key"

    if groq_key:
        # prefer GROQ
        try:
            _client = OpenAI(api_key=groq_key, base_url="https://api.groq.com/openai/v1")
            return _client
        except TypeError:
            _client = OpenAI(api_key=groq_key, api_base="https://api.groq.com/openai/v1")
            return _client

    # fallback to xAI
    try:
        _client = OpenAI(api_key=api_key, base_url="https://api.x.ai/v1")
    except TypeError:
        _client = OpenAI(api_key=api_key, api_base="https://api.x.ai/v1")

    return _client

TEMPLATE_LIBRARY = [
    {"id": "hero_bold_01", "type": "hero", "vibe": ["energetic", "saas", "modern"], "description": "Split screen hero with high-contrast call-to-action"},
    {"id": "hero_minimal_02", "type": "hero", "vibe": ["clean", "minimal", "editorial"], "description": "Centered elegant hero with typography emphasis"},
    {"id": "features_bento_01", "type": "features", "vibe": ["modern", "tech", "saas"], "description": "Bento-grid feature showcase with interactive cards"},
    {"id": "features_grid_02", "type": "features", "vibe": ["clean", "minimal", "corporate"], "description": "3-column structured feature layout with icon badges"},
    {"id": "cta_glow_01", "type": "cta", "vibe": ["dark_mode", "energetic", "modern"], "description": "High-conversion glow card with email capture form"}
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
1. Always return a strictly valid JSON object matching the requested schema.
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


@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        # include recent conversation
        for msg in req.conversation_history[-6:]:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})

        context_payload = {
            "user_prompt": req.user_message,
            "active_layout": req.current_layout,
            "active_brand": req.current_brand,
        }

        messages.append({"role": "user", "content": json.dumps(context_payload)})

        client = get_client()
        response = client.chat.completions.create(
            model="grok-2-1212",
            messages=messages,
        )

        # Normalize different SDK response shapes safely
        try:
            content = None
            # Try attribute access
            content = getattr(response.choices[0].message, 'content', None)
        except Exception:
            content = None

        if not content:
            # try dict-style
            try:
                content = response['choices'][0]['message']['content']
            except Exception:
                content = None

        if isinstance(content, str):
            try:
                return json.loads(content)
            except Exception:
                return {"reply": content}

        return content or {"reply": "No content returned from model"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/merge")
async def merge_endpoint(req: MergeRequest):
    try:
        merge_prompt = f"""
        User wants to merge two design options based on this instruction: "{req.user_preference}".
        Option A Layout: {json.dumps(req.option_a)}
        Option B Layout: {json.dumps(req.option_b)}

        Return a single merged layout JSON list containing sections stitched together from Option A and Option B according to user preference.
        Return schema: {{"merged_layout": [...]} }
        """

        client = get_client()
        response = client.chat.completions.create(
            model="grok-2-1212",
            messages=[
                {"role": "system", "content": "You are a UI/UX layout stitching agent. Return valid JSON only."},
                {"role": "user", "content": merge_prompt}
            ],
        )

        # parse response similarly
        try:
            content = getattr(response.choices[0].message, 'content', None)
        except Exception:
            content = None

        if not content:
            try:
                content = response['choices'][0]['message']['content']
            except Exception:
                content = None

        if isinstance(content, str):
            try:
                return json.loads(content)
            except Exception:
                return {"merged_layout": None, "raw": content}

        return content or {"merged_layout": None}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


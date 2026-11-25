
import json
import os
import re

import httpx

from config import settings


class GeminiFinancialAgent:
    """Gemini-powered financial requirements analysis."""

    @staticmethod
    def _get_config():
        api_key = (
            getattr(settings, "GEMINI_API_KEY", None)
            or os.getenv("GEMINI_API_KEY")
        )

        model = (
            getattr(settings, "LLM_MODEL", None)
            or os.getenv("LLM_MODEL")
            or "gemini-2.5-flash"
        )

        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        return api_key, model

    @classmethod
    def analyze_requirements(cls, requirements: list):
        if not requirements:
            return []

        api_key, model = cls._get_config()

        safe_requirements = [
            {
                "id": str(req.get("id", "")),
                "statement": str(req.get("statement", "")),
                "existing_categories": req.get("categories", []),
            }
            for req in requirements
        ]

        prompt = """
You are a senior financial technology business analyst.

Analyze the supplied financial software requirements.

For each requirement:
1. Identify its likely requirement categories.
2. Identify ambiguity or missing information.
3. Suggest measurable acceptance criteria.
4. Identify potential financial, security, privacy,
   operational or regulatory risks.
5. Explain your reasoning briefly.

Rules:
- Do not invent laws, regulatory citations or quotations.
- Do not claim a requirement is legally compliant.
- Clearly distinguish observations from recommendations.
- Do not approve requirements.
- Return valid JSON only.

Required JSON structure:
{
  "insights": [
    {
      "id": "requirement id",
      "suggested_categories": [],
      "ambiguities": [],
      "acceptance_criteria": [],
      "potential_risks": [],
      "reasoning": ""
    }
  ]
}

Requirements:
""" + json.dumps(safe_requirements, ensure_ascii=False)

        url = (
            "https://generativelanguage.googleapis.com/"
            f"v1beta/models/{model}:generateContent"
        )

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json",
            },
        }

        try:
            response = httpx.post(
                url,
                params={"key": api_key},
                json=payload,
                timeout=90.0,
            )
            response.raise_for_status()

            data = response.json()
            candidates = data.get("candidates", [])

            if not candidates:
                raise RuntimeError(
                    "Gemini returned no analysis candidates"
                )

            text = candidates[0]["content"]["parts"][0]["text"]
            text = text.strip()

            # Remove Markdown fences if the model returns them.
            text = re.sub(
                r"^```(?:json)?\s*|\s*```$",
                "",
                text,
                flags=re.IGNORECASE,
            )

            result = json.loads(text)
            insights = result.get("insights", [])

            if not isinstance(insights, list):
                raise ValueError("Invalid Gemini insights format")

            return insights

        except httpx.HTTPStatusError as exc:
            raise RuntimeError(
                f"Gemini API returned HTTP {exc.response.status_code}: "
                f"{exc.response.text[:500]}"
            ) from exc

        except (httpx.RequestError, ValueError, KeyError) as exc:
            raise RuntimeError(
                f"Gemini analysis failed: {str(exc)}"
            ) from exc

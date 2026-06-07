import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
]


def _call_gemini(prompt, temperature=0.2):
    if not GEMINI_API_KEY:
        raise ValueError("Missing GEMINI_API_KEY environment variable.")

    payload = {
        "generationConfig": {
            "temperature": temperature,
        },
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
    }

    last_error = None
    last_status_code = None
    for model_name in GEMINI_MODELS:
        endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
            f"?key={GEMINI_API_KEY}"
        )
        try:
            response = requests.post(endpoint, json=payload, timeout=60)
            last_status_code = response.status_code

            if response.status_code == 404:
                # Try next configured model if current one is unavailable.
                continue

            response.raise_for_status()
            data = response.json()

            candidates = data.get("candidates", [])
            if not candidates:
                raise ValueError(f"No Gemini candidates returned for model {model_name}.")

            parts = candidates[0].get("content", {}).get("parts", [])
            text = "\n".join(part.get("text", "") for part in parts).strip()
            if not text:
                raise ValueError(f"Empty response from Gemini model {model_name}.")

            return text
        except Exception as error:
            last_error = error
            continue

    if last_error:
        if last_status_code is not None:
            raise RuntimeError(
                f"Gemini request failed across configured models. Last status code: {last_status_code}."
            )
        raise RuntimeError("Gemini request failed across configured models.")

    raise RuntimeError("Gemini request failed across configured models.")

def load_news_tags(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        news_tags = json.load(file)
    return news_tags


def _normalize_classification_tags(classification_data):
    if not isinstance(classification_data, dict):
        return None

    normalized_tags = {}

    for key, value in classification_data.items():
        if not isinstance(key, str):
            return None

        normalized_key = key.strip()
        if not normalized_key:
            return None

        if isinstance(value, str):
            cleaned_value = value.strip().replace('%', '')
            try:
                numeric_value = float(cleaned_value)
            except ValueError:
                return None
        elif isinstance(value, (int, float)):
            numeric_value = float(value)
        else:
            return None

        normalized_tags[normalized_key] = int(round(numeric_value))

    return normalized_tags


def _extract_json_object(text):
    json_match = re.search(r"\{[\s\S]*\}", text)
    if not json_match:
        return None

    try:
        return json.loads(json_match.group(0))
    except json.JSONDecodeError:
        return None


def refactor_news_content(news):
    """
    Refactors the content of a news object using Gemini.
    Cleans unnecessary text and retains valid Markdown format.
    """
    prompt = (
    "Clean the following news article text and return only concise Markdown.\n\n"
    "Requirements:\n"
    "- Keep only meaningful article content.\n"
    "- Preserve factual meaning.\n"
    "- Remove noise, ads, navigation text, broken fragments, duplicates, and unfinished sections.\n"
    "- Do not add facts, comments, explanations, or headings unless they already exist in the article.\n"
    "- Output only Markdown.\n\n"
    f"ARTICLE:\n{news}"
)

    try:
        refactored_content = _call_gemini(prompt)

        refactored_lines = refactored_content.splitlines()
        if len(refactored_lines) > 2:
            refactored_lines = refactored_lines[1:-1]
        else:
            refactored_lines = []
        refactored_content = "\n".join(refactored_lines)

        return refactored_content.strip()
    except Exception as e:
        print(f"Error during refactoring: {e}")
        return news  # Return the original content in case of error


def prepare_news_versions(title, news):
    prompt = f"""
You are an editor for an AI news website.
Your task is to decide whether the article is complete, coherent, grammatically sound, and conceptually whole.

Return JSON only in this exact shape:
{{
  "is_valid": true,
  "reason": "short reason",
  "title_en": "clean English title",
  "content_en": "clean complete English article in markdown",
  "title_bg": "Bulgarian title",
  "content_bg": "Bulgarian translation in markdown"
}}

Rules:
- If the article is fragmented, incomplete, badly written, or lacks a coherent concept, set is_valid to false.
- Keep content factual and readable.
- Do not add invented facts.
- Keep both language versions equivalent in meaning.

TITLE:
{title}

ARTICLE:
{news}
"""

    try:
        response = _call_gemini(prompt, temperature=0.2)
        parsed = _extract_json_object(response)
        if not isinstance(parsed, dict):
            return None

        required_fields = ["is_valid", "title_en", "content_en", "title_bg", "content_bg"]
        if not all(field in parsed for field in required_fields):
            return None

        return {
            "is_valid": bool(parsed.get("is_valid")),
            "reason": str(parsed.get("reason", "")).strip(),
            "title_en": str(parsed.get("title_en", "")).strip(),
            "content_en": str(parsed.get("content_en", "")).strip(),
            "title_bg": str(parsed.get("title_bg", "")).strip(),
            "content_bg": str(parsed.get("content_bg", "")).strip(),
        }
    except Exception as e:
        print(f"Error during quality/translation preparation: {e}")
        return None
    

def classify_news_content(news):
    """
    Classifies a news object into the three most relevant tags based on its content.
    Returns a JSON with the top three tags and their relevance scores (as percentages).
    If the tag "Other" is in the top three, it returns None.
    """
    news_tags = load_news_tags('./scripts/news_tags.json')
    template = """
{
    "tag name 1": percentage number,
    "tag name 2": percentage number,
    "tag name 3": percentage number
}
"""

    prompt = (
    "Classify the AI news article into exactly 3 tags from the allowed list.\n\n"
    "Output requirements:\n"
    "- Output only valid JSON.\n"
    "- The JSON must be an object.\n"
    "- Keys must be tag names from the allowed list.\n"
    "- Values must be numeric percentages.\n"
    "- Use exactly 3 keys.\n"
    "- Percentages must be in steps of 5.\n"
    "- Percentages must sum to 100.\n"
    "- If 'Other' belongs in the top 3, output exactly: {}\n"
    "- Do not output markdown or explanations.\n\n"
    f"Allowed tags:\n{news_tags}\n\n"
    f"Expected JSON shape:\n{template}\n\n"
    f"NEWS:\n{news}"
)

    try:
        classification_result = _call_gemini(prompt, temperature=0.1)
        parsed_json = _extract_json_object(classification_result)
        if not parsed_json:
            return None

        classification_data = _normalize_classification_tags(parsed_json)
        if not isinstance(classification_data, dict):
            return None

        # Check if "Other" is in the top three tags
        if "Other" in classification_data:
            return None

        return classification_data

    except Exception as e:
        print(f"Error during classification: {e}")
        return None  # Return None in case of error
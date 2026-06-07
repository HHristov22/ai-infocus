import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-1.5-flash" # gemini-2.5-flash


def _call_gemini(prompt, temperature=0.2):
    if not GEMINI_API_KEY:
        raise ValueError("Missing GEMINI_API_KEY environment variable.")

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
        f"?key={GEMINI_API_KEY}"
    )
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

    response = requests.post(endpoint, json=payload, timeout=60)
    response.raise_for_status()
    data = response.json()

    candidates = data.get("candidates", [])
    if not candidates:
        raise ValueError("No Gemini candidates returned.")

    parts = candidates[0].get("content", {}).get("parts", [])
    text = "\n".join(part.get("text", "") for part in parts).strip()
    if not text:
        raise ValueError("Empty response from Gemini.")

    return text

def load_news_tags(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        news_tags = json.load(file)
    return news_tags


def refactor_news_content(news):
    """
    Refactors the content of a news object using Gemini.
    Cleans unnecessary text and retains valid Markdown format.
    """
    prompt = (
        "You clean news article text and return concise markdown only. "
        "Remove noise, broken fragments, and unfinished sections while preserving factual meaning. "
        "Do not add commentary.\n\n"
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
        "Classify this AI news into exactly 3 most relevant tags from the provided list. "
        "Output only JSON object with tag names as keys and percentage numbers (0-100, step 5) as values. "
        "If one of the top tags would be 'Other', return {}.\n"
        f"Allowed tags: {news_tags}\n"
        f"JSON template: {template}\n"
        f"NEWS:\n{news}"
    )

    try:
        classification_result = _call_gemini(prompt, temperature=0.1)
        json_match = re.search(r"\{[\s\S]*\}", classification_result)
        if not json_match:
            return None

        classification_data = json.loads(json_match.group(0))
        if not isinstance(classification_data, dict):
            return None

        # Check if "Other" is in the top three tags
        if "Other" in classification_data:
            return None

        return classification_data

    except Exception as e:
        print(f"Error during classification: {e}")
        return None  # Return None in case of error
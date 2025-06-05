import google.generativeai as genai
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)


def rewrite_bot_response(original_response):
    """
    Use Gemini to rephrase bot responses to avoid repetition.

    Args:
        original_response (str): Static bot reply from Rasa

    Returns:
        str: A fresh variation of the same message
    """
    prompt = f"""
You are an AI assistant that rewrites bot replies to make them more natural and less repetitive.
Given the following bot message, generate a fresh variation that means the same thing.

Bot Message: "{original_response}"

Output only the rewritten version, no extra text.
"""

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[Response Rewriter] Error: {e}")
        return original_response
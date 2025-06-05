import google.generativeai as genai
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)


def clean_user_input(input_text):
    """
    Use Gemini to correct spelling and rephrase unclear queries.

    Args:
        input_text (str): Original user message

    Returns:
        str: Cleaned version of the user input
    """
    prompt = f"""
You are an AI assistant helping improve customer queries for better intent detection.
Your job is to:
1. Correct any spelling mistakes
2. Rephrase ambiguous sentences into clearer versions

Input: "{input_text}"

Output only the cleaned version, no extra text.
"""

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[LLM Rephraser] Error: {e}")
        return input_text

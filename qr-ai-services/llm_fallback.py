import google.generativeai as genai
import os

# Load Gemini API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in environment")

genai.configure(api_key=GEMINI_API_KEY)


def handle_unknown_query(input_text, context=None):
    """
    Use Gemini LLM to interpret unknown or ambiguous user input.

    Args:
        input_text (str): Raw user message
        context (dict): Metadata like org_id, table_id

    Returns:
        dict: {"response": "AI-generated reply", "source": "llm"}
    """
    # Build prompt based on context
    organization_id = context.get("org_id") if context else None
    table_id = context.get("table_id") if context else None

    prompt = f"""
You are Sam, a restaurant assistant helping guests place orders and get info.
Respond naturally to the following message.

Message: "{input_text}"

Context:
Organization ID: {organization_id}
Table ID: {table_id}

If the guest is asking about food items, menu, or ordering — say:
"I can help with that!" and suggest how.

Otherwise, respond politely and offer assistance.
"""

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)
        return {
            "response": response.text.strip(),
            "source": "llm"
        }
    except Exception as e:
        print(f"[LLM Fallback] Error generating response: {e}")
        return {
            "response": "I'm having trouble right now. Can you rephrase?",
            "source": "llm",
            "error": str(e)
        }

import re
from . import nlp  # Use shared spaCy instance

INTENTS = {
    "greet": ["hi", "hello", "hey", "good morning", "good evening"],
    "order_food": ["order", "want", "get", "add", "place order"],
    "track_order": ["where is my order", "status", "track", "order status"],
    "browse_menu": ["menu", "items", "what do you have", "show menu"],
    "recommend_menu": ["suggest", "recommend", "best", "popular"],
    "confirm_order": ["yes", "okay", "sure", "confirm", "proceed"],
    "cancel_order": ["cancel", "remove", "delete"],
    "give_feedback": ["rate", "feedback", "comment", "review"]
}


def detect_intent(text):
    text = text.lower().strip()

    # Rule-based matching
    for intent, patterns in INTENTS.items():
        for pattern in patterns:
            if re.search(rf'\b{pattern}\b', text):
                return {"intent": intent, "confidence": 0.8}

    # Fallback: Use spaCy token matching
    doc = nlp(text)
    tokens = [token.text.lower() for token in doc]

    if any(t in tokens for t in ["order", "place"]):
        return {"intent": "order_food", "confidence": 0.75}
    elif any(t in tokens for t in ["track", "status"]):
        return {"intent": "track_order", "confidence": 0.7}
    elif any(t in tokens for t in ["menu", "see"]):
        return {"intent": "browse_menu", "confidence": 0.65}

    return {"intent": "unknown", "confidence": 0.5}

import re


def detect_intent(text):
    text = text.lower().strip()

    # Exact match for greetings
    if any(greeting in text for greeting in ['hi', 'hello', 'hey']):
        return 'greet'

    # Match phrases like "where is my order"
    if re.search(r'(where is|status of|track|order status)', text):
        return 'track_order'

    if re.search(r'(menu|items|what do you have)', text):
        return 'browse_menu'

    if re.search(r'(suggest|recommend|best|popular)', text):
        return 'recommend_menu'

    if re.search(r'(cancel|remove|delete)', text):
        return 'cancel_order'

    if re.search(r'(yes|ok|okay|sure|confirm|proceed)', text):
        return 'confirm_order'

    if re.search(r'(rate|feedback|review|comment)', text):
        return 'give_feedback'

    # General food ordering intent
    if re.search(r'(order|want|get|add|place order)', text):
        return 'order_food'

    return 'unknown'


def extract_entities(text):
    entities = {}

    # Quantity detection
    quantity_match = re.search(r'(\d+)(?:\s+(?:more|extra))?$', text)
    if quantity_match:
        entities['quantity'] = int(quantity_match.group(1))

    # Dish detection (basic list)
    menu_items = ['dosa', 'idli', 'vada', 'biryani', 'pizza', 'burger']
    for item in menu_items:
        if item in text:
            entities['dish'] = item

    return entities

# import spacy
#
# nlp = spacy.load("en_core_web_sm")
#
#
# def detect_intent_spacy(text):
#     doc = nlp(text)
#
#     # Detect intent based on tokens
#     if any(token.text.lower() in ["order", "want", "get"] for token in doc):
#         return "order_food"
#     elif any(token.text.lower() in ["track", "where", "status"] for token in doc):
#         return "track_order"
#     elif any(token.text.lower() in ["menu", "what", "items"] for token in doc):
#         return "browse_menu"
#     else:
#         return "unknown"
#
#
# def extract_entities_spacy(text):
#     doc = nlp(text)
#     entities = {}
#     for ent in doc.ents:
#         if ent.label_ == "FOOD":
#             entities["dish"] = ent.text
#     return entities

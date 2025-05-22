import re
from . import nlp

MENU_ITEMS = ['dosa', 'idli', 'vada', 'biryani', 'pizza', 'burger']


def extract_entities(text):
    doc = nlp(text)
    entities = {}

    # Quantity detection
    quantity_tokens = [token.text for token in doc if token.pos_ == "NUM"]
    if quantity_tokens:
        try:
            entities['quantity'] = int(quantity_tokens[0])
        except ValueError:
            pass

    # Dish detection using custom NER
    dish_tokens = [ent.text for ent in doc.ents if ent.label_ == "FOOD"]
    if dish_tokens:
        entities['dish'] = dish_tokens[0]
    else:
        for item in MENU_ITEMS:
            if item in text:
                entities['dish'] = item

    return entities

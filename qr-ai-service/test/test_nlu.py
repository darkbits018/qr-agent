from nlu.intent_detector import detect_intent
from nlu.entity_extractor import extract_entities

def test_input(text):
    print(f"\nInput: '{text}'")
    intent = detect_intent(text)
    print(f"Intent: {intent['intent']} ({intent['confidence']:.2f})")
    entities = extract_entities(text)
    print(f"Entities: {entities}")

if __name__ == "__main__":
    samples = [
        "I want two dosas",
        "Where is my order?",
        "Show me the menu",
        "Cancel this",
        "Add another burger",
        "Three paneer rolls please"
    ]
    for sample in samples:
        test_input(sample)
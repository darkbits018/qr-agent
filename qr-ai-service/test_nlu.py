# ai-agent-service/test_nlu.py

from nlu import detect_intent, extract_entities


def test_input(text):
    intent = detect_intent(text)
    entities = extract_entities(text)
    print(f"Input: '{text}'")
    print(f"Intent: {intent}")
    print(f"Entities: {entities}\n")


if __name__ == '__main__':
    test_inputs = [
        "Hi",
        "I wawt two dosas",
        "What is on the menu?",
        "Where is my order?",
        "Can you recommend something?",
        "Yes, confirm my order",
        "Cancel this",
        "I'd like to give feedback"
    ]

    for text in test_inputs:
        test_input(text)

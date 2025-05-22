class DialogueState:
    def __init__(self, org_id, table_id):
        self.org_id = org_id
        self.table_id = table_id
        self.state = "start"
        self.order = []

    def transition(self, intent, entities):
        responses = {
            "greet": "Hi! I'm Sam. How can I help?",
            "order_food": f"Added {entities.get('quantity', 1)} {entities.get('dish', 'item')}(s). Anything else?",
            "browse_menu": "Fetching menu...",
            "confirm_order": f"Confirmed {len(self.order)} items.",
            "unknown": "Could you rephrase that?",
            "default": "Not implemented yet."
        }
        return {"response": responses.get(intent, responses["default"])}

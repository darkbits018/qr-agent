from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
import requests

BACKEND_URL = "https://qr-agent.onrender.com"


class ActionFetchMenu(Action):
    def name(self) -> Text:
        return "action_fetch_menu"

    def run(
            self,
            dispatcher: CollectingDispatcher,
            tracker,
            domain: Dict[Text, Any]
    ) -> List[Dict]:
        org_id = tracker.get_slot("org_id")
        if not org_id:
            dispatcher.utter_message(text="Organization ID required.")
            return []

        response = requests.get(f"{BACKEND_URL}/api/customer/menu?organization_id={org_id}")
        if response.status_code == 200:
            menu_items = [item["name"] for item in response.json()]
            dispatcher.utter_message(text=f"Available items: {', '.join(menu_items)}")
        else:
            dispatcher.utter_message(text="Failed to fetch menu.")
        return []


class ActionAddToCart(Action):
    def name(self) -> Text:
        return "action_add_to_cart"

    def run(
            self,
            dispatcher: CollectingDispatcher,
            tracker,
            domain: Dict[Text, Any]
    ) -> List[Dict]:
        dish = tracker.get_slot("dish")
        quantity = tracker.get_slot("quantity") or "1"
        org_id = tracker.get_slot("org_id")
        table_id = tracker.get_slot("table_id")

        if not all([dish, org_id, table_id]):
            dispatcher.utter_message(text="Missing information to add to cart.")
            return []

        payload = {
            "menu_item_id": dish,
            "quantity": int(quantity),
            "table_id": int(table_id),
            "organization_id": int(org_id)
        }

        response = requests.post(f"{BACKEND_URL}/api/customer/cart", json=payload)
        if response.status_code == 201:
            dispatcher.utter_message(text=f"Added {quantity} {dish}(s)")
        else:
            dispatcher.utter_message(text="Failed to add item to cart.")

        return []

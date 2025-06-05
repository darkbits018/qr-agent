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


class ActionSearchMenu(Action):
    def name(self) -> Text:
        return "action_search_menu"

    async def run(
            self,
            dispatcher: CollectingDispatcher,
            tracker,
            domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        # Try to get org_id from JWT or fallback to metadata
        org_id = tracker.get_slot("org_id")
        if not org_id:
            # Try to extract from message metadata (sent by frontend)
            metadata = tracker.latest_message.get("metadata", {})
            org_id = metadata.get("organization_id")

        if not org_id:
            dispatcher.utter_message(text="Organization ID required.")
            return []

        # Extract query terms
        dish = tracker.get_slot("dish")
        category = tracker.get_slot("category")
        dietary_preference = tracker.get_slot("dietary_preference")
        available_times = tracker.get_slot("available_times")

        query = dish or category or dietary_preference or available_times
        if not query:
            dispatcher.utter_message(text="Please specify what you're looking for.")
            return []

        # Call backend API
        url = f"{BACKEND_URL}/api/customer/menu/search?q={query}&org_id={org_id}"

        try:
            response = requests.get(url)
            if response.status_code != 200:
                dispatcher.utter_message(text="Failed to fetch menu items.")
                return []

            results = response.json().get("results", [])
            if not results:
                dispatcher.utter_message(text=f"Sorry, no items found for '{query}'.")
                return []

            reply = "Here are some items I found:\n"
            for result in results[:3]:  # Show top 3 matches
                item = result["item"]
                reply += f"- {item['name']} ({item['price']})\n"

            dispatcher.utter_message(text=reply)

        except Exception as e:
            dispatcher.utter_message(text="Something went wrong. Please try again.")

        return []
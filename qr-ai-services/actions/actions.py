from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
import requests

BACKEND_URL = "https://qr-agent.onrender.com"


class ActionAddToCart(Action):
    def name(self) -> Text:
        return "action_add_to_cart"

    def run(self, dispatcher, tracker, domain):
        org_id = tracker.get_slot("org_id")
        table_id = tracker.get_slot("table_id")
        dish = next(tracker.get_latest_entity_values("dish"), None)
        quantity = int(next(tracker.get_latest_entity_values("quantity"), 1))
        group_id = tracker.get_slot("group_id")
        member_token = tracker.get_slot("member_token")

        if not dish:
            dispatcher.utter_message(text="Please specify what you'd like to order.")
            return []

        payload = {
            "organization_id": org_id,
            "table_id": table_id,
            "item_name": dish,
            "quantity": quantity
        }

        if group_id and member_token:
            payload["group_id"] = group_id
            payload["member_token"] = member_token

        try:
            response = requests.post(f"{BACKEND_URL}/api/customer/cart/add", json=payload)
            if response.status_code == 200:
                dispatcher.utter_message(text=f"{quantity} x {dish} added to your cart!")
            else:
                error = response.json().get("error", "Could not add item.")
                dispatcher.utter_message(text=error)
        except Exception as e:
            dispatcher.utter_message(text="Something went wrong. Please try again.")

        return []


class ActionRemoveLastItem(Action):
    def name(self) -> Text:
        return "action_remove_last_item"

    def run(self, dispatcher, tracker, domain):
        group_id = tracker.get_slot("group_id")
        member_token = tracker.get_slot("member_token")

        if not group_id or not member_token:
            dispatcher.utter_message(text="You need to be part of a group to modify the cart.")
            return []

        params = {"group_id": group_id, "member_token": member_token}
        try:
            response = requests.delete(f"{BACKEND_URL}/api/customer/cart/remove-last", params=params)
            if response.status_code == 200:
                dispatcher.utter_message(text="Last item removed from your cart.")
            else:
                dispatcher.utter_message(text="Failed to remove the last item.")
        except Exception as e:
            dispatcher.utter_message(text="Error removing item.")

        return []


class ActionTrackOrder(Action):
    def name(self) -> Text:
        return "action_track_order"

    def run(self, dispatcher, tracker, domain):
        table_id = tracker.get_slot("table_id")
        response = requests.get(f"{BACKEND_URL}/api/customer/order/status?table_id={table_id}")
        if response.status_code == 200:
            status = response.json().get("status", "No active orders found.")
            dispatcher.utter_message(text=f"Your current order status: {status}")
        else:
            dispatcher.utter_message(text="Could not fetch order status.")
        return []

class ActionFetchMenu(Action):
    def name(self) -> Text:
        return "action_fetch_menu"

    def run(self, dispatcher, tracker, domain):
        org_id = tracker.get_slot("org_id")
        if not org_id:
            dispatcher.utter_message(text="Organization ID required to fetch menu.")
            return []

        response = requests.get(f"{BACKEND_URL}/api/customer/menu?organization_id={org_id}")
        if response.status_code == 200:
            items = [item['name'] for item in response.json()]
            message = "Here's today's menu:\n" + "\n".join(items)
            dispatcher.utter_message(text=message)
        else:
            dispatcher.utter_message(text="Failed to fetch menu.")
        return []

class ActionSearchMenu(Action):
    def name(self) -> Text:
        return "action_search_menu"

    def run(self, dispatcher, tracker, domain):
        org_id = tracker.get_slot("org_id")
        dish = next(tracker.get_latest_entity_values("dish"), None)
        category = next(tracker.get_latest_entity_values("category"), None)

        if not org_id:
            dispatcher.utter_message(text="Organization ID required.")
            return []

        params = {"organization_id": org_id}
        if dish:
            params["dish"] = dish
        if category:
            params["category"] = category

        response = requests.get(f"{BACKEND_URL}/api/customer/menu", params=params)
        if response.status_code == 200:
            results = response.json()
            if results:
                msg = "I found these matching items:\n"
                msg += "\n".join([f"- {item['name']}" for item in results])
                dispatcher.utter_message(text=msg)
            else:
                dispatcher.utter_message(text="No matching items found.")
        else:
            dispatcher.utter_message(text="Failed to search menu.")
        return []


class ActionRecommendMenu(Action):
    def name(self) -> Text:
        return "action_recommend_menu"

    def run(self, dispatcher, tracker, domain):
        org_id = tracker.get_slot("org_id")
        dietary_preference = next(tracker.get_latest_entity_values("dietary_preference"), None)

        if not org_id:
            dispatcher.utter_message(text="Organization ID required.")
            return []

        params = {"organization_id": org_id, "popular": True}
        if dietary_preference:
            params["dietary_preference"] = dietary_preference

        response = requests.get(f"{BACKEND_URL}/api/customer/menu", params=params)
        if response.status_code == 200:
            items = [item['name'] for item in response.json()]
            message = "Here are some recommendations:\n" + "\n".join(items)
            dispatcher.utter_message(text=message)
        else:
            dispatcher.utter_message(text="Failed to get recommendations.")
        return []

class ActionViewCart(Action):
    def name(self) -> Text:
        return "action_view_cart"

    def run(self, dispatcher, tracker, domain):
        group_id = tracker.get_slot("group_id")
        member_token = tracker.get_slot("member_token")

        if not group_id or not member_token:
            dispatcher.utter_message(text="You need to be part of a group to view cart.")
            return []

        params = {"group_id": group_id, "member_token": member_token}
        response = requests.get(f"{BACKEND_URL}/api/customer/cart", params=params)
        if response.status_code == 200:
            items = response.json().get("items", [])
            if items:
                message = "Your cart:\n"
                for item in items:
                    message += f"- {item['name']} x{item['quantity']}\n"
                dispatcher.utter_message(text=message)
            else:
                dispatcher.utter_message(text="Your cart is empty.")
        else:
            dispatcher.utter_message(text="Failed to load cart.")
        return []

class ActionRequestWaiter(Action):
    def name(self) -> Text:
        return "action_request_waiter"

    def run(self, dispatcher, tracker, domain):
        table_id = tracker.get_slot("table_id")
        payload = {"table_id": table_id, "message": "Customer needs assistance"}
        try:
            response = requests.post(f"{BACKEND_URL}/api/customer/request-waiter", json=payload)
            if response.status_code == 200:
                dispatcher.utter_message(text="Waiter has been notified.")
            else:
                dispatcher.utter_message(text="Failed to notify waiter.")
        except Exception as e:
            dispatcher.utter_message(text="Connection error.")
        return []
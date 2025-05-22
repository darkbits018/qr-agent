from flask import Blueprint, request, jsonify
import requests
from flask_jwt_extended import create_access_token

api_bp = Blueprint('api_agent', __name__)

BACKEND_URL = "http://localhost:5000"  # Your main backend URL
MENU_ENDPOINT = "/api/customer/menu"
ORDER_ENDPOINT = "/api/customer/cart"

@api_bp.route('/process', methods=['POST'])
def process_input():
    user_input = request.json.get("text")
    table_id = request.json.get("table_id")
    organization_id = request.json.get("organization_id")

    # For now, just echo back
    return jsonify({
        "response": f"You said: {user_input}",
        "next_steps": ["Would you like to see the menu?", "Place an order?"]
    })
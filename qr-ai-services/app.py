from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity
)
import requests
import os

# Load environment variables
from config import Config

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
jwt = JWTManager(app)

# Register custom actions URL
rasa_nlu_url = "http://localhost:5001/webhooks/rest/webhook"


@app.route('/')
def health_check():
    return {'status': 'AI Agent is running'}


@app.route('/api/agent/process', methods=['POST'])
@jwt_required()
def process_input():
    identity = get_jwt_identity()
    data = request.json
    user_input = data.get("text", "").strip()

    if not user_input:
        return jsonify({"error": "Missing 'text' field"}), 400

    table_id = data.get("table_id") or identity.get("table_id")
    organization_id = data.get("organization_id") or identity.get("org_id")

    if not table_id or not organization_id:
        return jsonify({
            "error": "Missing table_id or organization_id in request or identity"
        }), 400

    print(f"[INFO] Processing message from {identity.get('phone')}")
    print(f"[INFO] Message: '{user_input}'")

    # Send to Rasa NLU
    payload = {
        "sender": f"{organization_id}_{table_id}",
        "message": user_input
    }

    try:
        rasa_response = requests.post(rasa_nlu_url, json=payload)
        rasa_data = rasa_response.json()
    except Exception as e:
        return jsonify({
            "error": "Failed to communicate with Rasa NLU service",
            "details": str(e)
        }), 500

    # Return raw Rasa response for debugging
    return jsonify({
        "input": user_input,
        "intent": rasa_data[0].get("intent", {"name": "unknown"})["name"] if rasa_data else "unknown",
        "entities": {
            ent["entity"]: ent["value"]
            for ent in rasa_data[0].get("entities", [])
        } if rasa_data else {},
        "bot_replies": [r.get("text") for r in rasa_data]
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)

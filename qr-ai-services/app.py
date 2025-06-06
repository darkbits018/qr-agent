import os
from flask import Flask, request, jsonify, send_from_directory
from functools import wraps
import requests
from llm_rephraser import clean_user_input
from response_rewriter import rewrite_bot_response
from flask_jwt_extended import (
    JWTManager,
    get_jwt_identity,
    verify_jwt_in_request,
    get_jwt
)
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


# Initialize Flask app
def create_app():
    app = Flask(__name__)

    # JWT Config
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
    app.config['JWT_TOKEN_LOCATION'] = ['headers']

    return app


app = create_app()
jwt = JWTManager(app)


# Optional JWT decorator — won't fail if no token is sent
def jwt_optional(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request(optional=True)
            claims = get_jwt() or {}
            identity = claims.get("identity", {})  # Extract full identity dict
            request.jwt_claims = claims
            request.jwt_identity = identity
        except Exception as e:
            request.jwt_claims = {}
            request.jwt_identity = {}

        return fn(*args, **kwargs)

    return wrapper


# Set up Rasa NLU URL
rasa_nlu_url = "http://localhost:5001/webhooks/rest/webhook"


@app.route('/api/agent/process', methods=['POST'])
@jwt_optional
def process_input():
    """
    Process user input via Rasa NLU.
    Accepts JWT but doesn't require it.
    Falls back to extracting org_id/table_id from request body.
    """
    data = request.json
    user_input = data.get("text", "").strip()

    # Try to extract org_id/table_id from JWT first
    identity = getattr(request, 'jwt_identity', {})
    claims = getattr(request, 'jwt_claims', {})

    org_id = identity.get("organization_id") or claims.get("organization_id") or data.get("organization_id")
    table_id = identity.get("table_id") or claims.get("table_id") or data.get("table_id")

    if not all([org_id, table_id]):
        return jsonify({
            "input": user_input,
            "bot_replies": ["Please provide organization_id and table_id."]
        }), 400

    # Step 1: Clean user input (optional)
    cleaned_input = clean_user_input(user_input)

    # Step 2: Send to Rasa
    payload = {
        "sender": f"{org_id}_{table_id}",
        "message": cleaned_input,
        "metadata": {
            "org_id": org_id,
            "table_id": table_id,
            "group_id": data.get("group_id"),
            "member_token": data.get("member_token")
        }
    }

    try:
        print("Payload sent to Rasa:", payload)
        rasa_response = requests.post(rasa_nlu_url, json=payload)
        print("Raw response from Rasa:", rasa_response.text)
        rasa_data = rasa_response.json()
    except Exception as e:
        return jsonify({
            "input": user_input,
            "bot_replies": ["Rasa server unreachable. Please try again later."]
        }), 500
    if not rasa_data:
        return jsonify({
            "input": user_input,
            "cleaned_input": cleaned_input,
            "bot_replies": ["No response from Rasa."],
            "intent": None,
            "entities": [],
            "jwt_used": bool(identity or claims),
            "org_id": org_id,
            "table_id": table_id
        }), 502

    # Step 3: Rewrite bot responses (optional)
    rewritten_replies = [rewrite_bot_response(reply['text']) for reply in rasa_data]

    return jsonify({
        "input": user_input,
        "cleaned_input": cleaned_input,
        "bot_replies": rewritten_replies,
        "intent": rasa_data[0].get('intent', {}).get('name'),
        "entities": rasa_data[0].get('entities', []),
        "jwt_used": bool(identity or claims),
        "org_id": org_id,
        "table_id": table_id
    })


if __name__ == "__main__":
    app.run(debug=True, port=5002)

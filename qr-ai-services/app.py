from flask import Flask, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests

# Import rephrasing modules
from llm_rephraser import clean_user_input
from response_rewriter import rewrite_bot_response

app = Flask(__name__)
rasa_nlu_url = "http://localhost:5001/webhooks/rest/webhook"


@app.route('/api/agent/process', methods=['POST'])
@jwt_required(optional=True)
def process_input():
    identity = get_jwt_identity() or {}
    data = request.json
    user_input = data.get("text", "").strip()

    if not user_input:
        return jsonify({"error": "Missing 'text' field"}), 400

    org_id = identity.get("org_id") or data.get("organization_id")
    table_id = identity.get("table_id") or data.get("table_id")

    if not all([org_id, table_id]):
        return jsonify({"error": "Missing organization_id or table_id"}), 400

    # Step 1: Clean user input
    cleaned_input = clean_user_input(user_input)

    # Step 2: Send to Rasa NLU
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
        rasa_response = requests.post(rasa_nlu_url, json=payload)
        rasa_data = rasa_response.json()
    except Exception as e:
        return jsonify({"error": "Failed to reach Rasa", "details": str(e)}), 500

    # Step 3: Rewrite bot response
    rewritten_replies = [rewrite_bot_response(reply['text']) for reply in rasa_data]

    return jsonify({
        "input": user_input,
        "cleaned_input": cleaned_input,
        "bot_replies": rewritten_replies,
        "intent": rasa_data[0].get('custom') or rasa_data[0].get('intent', {}).get('name'),
        "entities": rasa_data[0].get('entities')
    })

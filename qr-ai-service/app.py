from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

@app.route('/')
def health_check():
    return {'status': 'AI Agent is running'}

# Import routes
from integrations import api_bp
app.register_blueprint(api_bp, url_prefix='/api/agent')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
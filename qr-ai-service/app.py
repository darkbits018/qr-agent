from flask import Flask, request, jsonify
from config import Config
from integrations import api_bp

app = Flask(__name__)

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Register blueprint
app.register_blueprint(api_bp, url_prefix='/api/agent')

@app.route('/')
def health_check():
    return {'status': 'AI Agent is running'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
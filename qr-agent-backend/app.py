import os
from datetime import timedelta
from flask import Flask
from geventwebsocket.handler import WebSocketHandler
from blueprints.auth import jwt_blacklist
from config import Config
from blueprints import superadmin, organization, kitchen, customer, auth, group
from models import db
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, jwt_required
from models.user import User
from models.organization import Organization
from models.menu_item import MenuItem
from models.table import Table
from models.order import Order
from models.order_item import OrderItem
from models.payment import Payment
from models.feedback import Feedback
from flask_migrate import Migrate
from flasgger import Swagger
from flask_cors import CORS
from flask_sockets import Sockets
from gevent import pywsgi
from websockets import register_sockets
from services.embedding_service import EmbeddingService



def create_app():
    app = Flask(__name__)

    load_dotenv()
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Load secret key from .env
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=12)
    app.config['JWT_IDENTITY_CLAIM'] = 'identity'  # Critical for proper handling

    app.config.from_object(Config)
    # Initialize JWTManage
    jwt = JWTManager(app)
    # Initialize database
    db.init_app(app)
    sockets = Sockets(app)
    register_sockets(sockets)
    # Initialize Flask-Migrate
    migrate = Migrate(app, db)
    Swagger(app)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})


    # Register blueprints
    app.register_blueprint(superadmin.bp)
    app.register_blueprint(organization.bp)
    app.register_blueprint(kitchen.bp)
    app.register_blueprint(customer.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(group.bp)

    # with app.app_context():
    #     db.create_all()

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        return jwt_payload['jti'] in jwt_blacklist

    @app.route('/')
    def health_check():
        return {'status': 'OK'}

    return app




if __name__ == '__main__':
    app = create_app()
    server = pywsgi.WSGIServer(('0.0.0.0', 5000), app, handler_class=WebSocketHandler)
    print("Server running on ws://localhost:5000")
    server.serve_forever()

app = create_app()
import os
from flask import Flask
from config import Config
from blueprints import superadmin, organization, kitchen, customer, auth
from models import db
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from models.user import User
from models.organization import Organization
from models.menu import Menu
from models.menu_item import MenuItem
from models.table import Table
from models.order import Order
from models.order_item import OrderItem
from models.payment import Payment
from models.feedback import Feedback

app = Flask(__name__)

load_dotenv()
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Load secret key from .env

app.config.from_object(Config)
# Initialize JWTManage
jwt = JWTManager(app)
# Initialize database
db.init_app(app)

# Register blueprints
app.register_blueprint(superadmin.bp)
app.register_blueprint(organization.bp)
app.register_blueprint(kitchen.bp)
app.register_blueprint(customer.bp)
app.register_blueprint(auth.bp)

with app.app_context():
    db.create_all()

@app.route('/')
def health_check():
    return {'status': 'OK'}


if __name__ == '__main__':
    app.run(debug=True)
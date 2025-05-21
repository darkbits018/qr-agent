from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy instance (MUST be before model imports)
db = SQLAlchemy()

# Import models AFTER db is created (avoid circular imports)
from .user import User
from .organization import Organization
from .menu_item import MenuItem
from .order import Order
from .order_item import OrderItem
from .payment import Payment
from .feedback import Feedback
from .table import Table
from .customer import Customer
from .status_change import StatusChange
from .group import Group
from .group_member import GroupMember

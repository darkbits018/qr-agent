from datetime import datetime
from models import db


class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # Add any other customer-specific fields
    # loyalty_points = db.Column(db.Integer, default=0)
    # preferences = db.Column(db.JSON)

    def __repr__(self):
        return f'<Customer {self.phone}>'

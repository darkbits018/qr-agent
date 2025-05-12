from models import db
from datetime import datetime


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))  # Changed from users.id to customers.id
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'))
    status = db.Column(db.String(20), default='pending')  # 'pending', 'preparing', 'ready', 'served'
    total_amount = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True)
    payment = db.relationship('Payment', backref='order', uselist=False)
    feedback = db.relationship('Feedback', backref='order', uselist=False)
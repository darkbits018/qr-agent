from models import db
from datetime import datetime


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    amount = db.Column(db.Float, nullable=False)
    method = db.Column(db.String(50))  # 'credit_card', 'upi', 'cash'
    transaction_id = db.Column(db.String(100))
    status = db.Column(db.String(20), default='pending')  # 'pending', 'completed', 'failed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
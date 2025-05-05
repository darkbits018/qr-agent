from datetime import datetime
from models import db


class Feedback(db.Model):
    __tablename__ = 'feedbacks'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    rating = db.Column(db.Integer)  # 1-5 scale
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
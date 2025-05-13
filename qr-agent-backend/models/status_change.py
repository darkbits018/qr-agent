from datetime import datetime

from models import db


class StatusChange(db.Model):
    __tablename__ = 'status_changes'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    from_status = db.Column(db.String(20))
    to_status = db.Column(db.String(20))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    changed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    notes = db.Column(db.Text)
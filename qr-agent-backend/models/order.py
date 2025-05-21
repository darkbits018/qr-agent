# qr-agent-backend/models/order.py
from models import db
from datetime import datetime


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'))
    status = db.Column(db.String(20), default='pending')  # 'pending', 'preparing', 'ready', 'served', 'completed'
    total_amount = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    accepted_at = db.Column(db.DateTime)
    preparing_at = db.Column(db.DateTime)
    ready_at = db.Column(db.DateTime)
    served_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    special_requests = db.Column(db.Text)
    rejected_at = db.Column(db.DateTime)
    on_hold_at = db.Column(db.DateTime)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True)
    payment = db.relationship('Payment', backref='order', uselist=False)
    feedback = db.relationship('Feedback', backref='order', uselist=False)
    table = db.relationship('Table', backref='orders')
    prep_instructions = db.Column(db.Text)
    priority = db.Column(db.String(10), default='normal')
    station_assignment_time = db.Column(db.DateTime)
    status_changes = db.relationship('StatusChange', backref='order', lazy=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))

    def status_timeline(self):
        return {
            'created': self.created_at.isoformat() if self.created_at else None,
            'accepted': self.accepted_at.isoformat() if self.accepted_at else None,
            'preparing': self.preparing_at.isoformat() if self.preparing_at else None,
            'ready': self.ready_at.isoformat() if self.ready_at else None,
            'served': self.served_at.isoformat() if self.served_at else None,
            'completed': self.completed_at.isoformat() if self.completed_at else None
        }

    def priority_level(self):
        # Example logic, adjust as needed
        if hasattr(self, 'priority'):
            return self.priority
        return 'normal'

    def estimated_prep_time(self):
        # Example: return a fixed value or calculate based on items
        return 15  # minutes

    def get_timestamps(self):
        return {
            "created": self.created_at.isoformat() if self.created_at else None,
            "accepted": self.accepted_at.isoformat() if self.accepted_at else None,
            "preparing": self.preparing_at.isoformat() if self.preparing_at else None,
            "ready": self.ready_at.isoformat() if self.ready_at else None,
            "served": self.served_at.isoformat() if self.served_at else None,
            "completed": self.completed_at.isoformat() if self.completed_at else None,
            "rejected": self.rejected_at.isoformat() if self.rejected_at else None,
            "on_hold": self.on_hold_at.isoformat() if self.on_hold_at else None,
        }

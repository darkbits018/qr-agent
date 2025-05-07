from datetime import datetime
from models import db


class Organization(db.Model):
    __tablename__ = 'organizations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Changed to nullable=False
    subscription_plan = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    tables = db.relationship('Table', backref='organization', lazy=True)
    admin = db.relationship('User', foreign_keys=[admin_id], backref='admin_of_organizations')

# models/group.py
from datetime import datetime, timedelta
from models import db

class Group(db.Model):
    __tablename__ = 'groups'

    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    join_code = db.Column(db.String(8), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.utcnow() + timedelta(hours=2))

    creator = db.relationship('Customer', backref='created_groups')
    table = db.relationship('Table')
    organization = db.relationship('Organization')
    members = db.relationship('GroupMember', backref='group', cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='group')
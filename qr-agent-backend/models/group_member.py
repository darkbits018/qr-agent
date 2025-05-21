# models/group_member.py
from datetime import datetime
from models import db

class GroupMember(db.Model):
    __tablename__ = 'group_members'

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    member_token = db.Column(db.String(100), unique=True)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    order_items = db.relationship('OrderItem', backref='member')
from models import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import random


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), nullable=False)  # 'superadmin', 'org_admin', 'customer'
    email = db.Column(db.String(100), unique=True, nullable=True)
    phone = db.Column(db.String(15), unique=True, nullable=True)
    password_hash = db.Column(db.String(256))  # Increase the length    otp = db.Column(db.String(6))
    otp_expiry = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)  # Add this line if missing
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True)  # <-- Add this line

    # Relationships
    organizations = db.relationship(
        'Organization',
        backref='organization_admin',
        lazy=True,
        foreign_keys='User.organization_id'
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        self.otp_expiry = datetime.utcnow() + timedelta(minutes=5)
        return self.otp

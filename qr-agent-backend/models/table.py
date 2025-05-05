from models import db


class Table(db.Model):
    __tablename__ = 'tables'

    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(20), nullable=False)  # e.g., "Table 1", "Counter 5"
    qr_code = db.Column(db.String(255), unique=True)  # Stores QR image URL or hash
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))
    is_occupied = db.Column(db.Boolean, default=False)
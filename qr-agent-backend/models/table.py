from models import db


# In qr-agent-backend/models/table.py
class Table(db.Model):
    __tablename__ = 'tables'

    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(20), nullable=False)
    qr_code_url = db.Column(db.Text)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))
    is_occupied = db.Column(db.Boolean, default=False)
from models import db


class Menu(db.Model):
    __tablename__ = 'menus'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)  # e.g., "Breakfast", "Dinner"
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))
    is_active = db.Column(db.Boolean, default=True)

    # Relationships
    items = db.relationship('MenuItem', backref='menu', lazy=True)
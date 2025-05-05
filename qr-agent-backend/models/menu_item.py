from models import db


class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'))
    category = db.Column(db.String(50))  # e.g., "Starter", "Main Course"
    is_vegetarian = db.Column(db.Boolean, default=False)
    is_available = db.Column(db.Boolean, default=True)
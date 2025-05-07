from models import db


class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))

    # Enhanced categorization
    category = db.Column(db.String(50))  # e.g., "main", "dessert", "appetizer"
    dietary_preference = db.Column(db.String(50))  # e.g., "vegetarian", "vegan", "gluten-free"
    available_times = db.Column(db.String(100))  # e.g., "breakfast", "lunch", "dinner", "all-day"

    is_vegetarian = db.Column(db.Boolean, default=False)  # Can be replaced by dietary_preference
    is_available = db.Column(db.Boolean, default=True)

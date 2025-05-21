from models import db


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'))
    menu_item = db.relationship('MenuItem', backref='order_items')
    quantity = db.Column(db.Integer, default=1)
    special_requests = db.Column(db.Text)
    price_at_order = db.Column(db.Float)  # Snapshot of price when ordered

    member_id = db.Column(db.Integer, db.ForeignKey('group_members.id'))

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "menu_item_id": self.menu_item_id,
            "quantity": self.quantity,
            # Add other fields as needed
        }

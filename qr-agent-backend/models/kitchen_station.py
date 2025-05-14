from models import db


class KitchenStation(db.Model):
    __tablename__ = 'kitchen_stations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, default=3)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))
    current_orders = db.relationship('Order', back_populates='kitchen_station')
from flask import Blueprint, request, jsonify
from models import db
from models.menu_item import MenuItem
from models.order import Order
from models.order_item import OrderItem
from models.table import Table
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('customer', __name__, url_prefix='/api/customer')


# Get Menu
@bp.route('/menu', methods=['GET'])
@jwt_required()
def get_menu():
    organization_id = request.args.get('organization_id')
    if not organization_id:
        return jsonify({"error": "Organization ID is required"}), 400

    menu_items = MenuItem.query.filter_by(organization_id=organization_id).all()
    return jsonify([item.to_dict() for item in menu_items]), 200


# Place Order from Cart
@bp.route('/order', methods=['POST'])
@jwt_required()
def place_order():
    data = request.get_json() or {}
    customer_id = get_jwt_identity()['id']

    # Find the cart order
    cart_order = Order.query.filter_by(customer_id=customer_id, status='cart').first()
    if not cart_order:
        return jsonify({"error": "No cart found"}), 400

    # Optionally update table_id if provided
    if 'table_id' in data:
        cart_order.table_id = data['table_id']

    cart_order.status = 'pending'
    db.session.commit()

    return jsonify({"message": "Order placed successfully", "order_id": cart_order.id}), 200


# Get Order Status
@bp.route('/order/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order_status(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    return jsonify({"order_id": order.id, "status": order.status}), 200


# Add Item to Cart
@bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    data = request.get_json()
    if not data or 'menu_item_id' not in data or 'quantity' not in data:
        return jsonify({"error": "Menu item ID and quantity are required"}), 400

    customer_id = get_jwt_identity()['id']
    # Find or create a cart order
    cart_order = Order.query.filter_by(customer_id=customer_id, status='cart').first()
    if not cart_order:
        cart_order = Order(customer_id=customer_id, status='cart')
        db.session.add(cart_order)
        db.session.commit()

    cart_item = OrderItem(order_id=cart_order.id, menu_item_id=data['menu_item_id'], quantity=data['quantity'])
    db.session.add(cart_item)
    db.session.commit()

    return jsonify({"message": "Item added to cart"}), 201


# View Cart
@bp.route('/cart', methods=['GET'])
@jwt_required()
def view_cart():
    customer_id = get_jwt_identity()['id']
    cart_order = Order.query.filter_by(customer_id=customer_id, status='cart').first()
    if not cart_order:
        return jsonify([]), 200
    cart_items = OrderItem.query.filter_by(order_id=cart_order.id).all()
    return jsonify([item.to_dict() for item in cart_items]), 200


# Remove Item from Cart
@bp.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    cart_item = OrderItem.query.filter_by(id=item_id, is_cart=True).first()
    if not cart_item:
        return jsonify({"error": "Item not found in cart"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Item removed from cart"}), 200


# Call Waiter
@bp.route('/waiter', methods=['POST'])
@jwt_required()
def call_waiter():
    data = request.get_json()
    if not data or 'table_id' not in data:
        return jsonify({"error": "Table ID is required"}), 400

    table = Table.query.get(data['table_id'])
    if not table:
        return jsonify({"error": "Table not found"}), 404

    # Logic to notify waiter (e.g., send notification)
    return jsonify({"message": "Waiter has been notified"}), 200

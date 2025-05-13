from flask import Blueprint, request, jsonify
from models import db
from models.menu_item import MenuItem
from models.order import Order
from models.order_item import OrderItem
from models.table import Table
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from functools import wraps

bp = Blueprint('customer', __name__, url_prefix='/api/customer')


# ======================
# Validation Decorators
# ======================
def validate_table_org(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json() or {}
        table_id = data.get('table_id') or request.args.get('table_id')
        organization_id = data.get('organization_id') or request.args.get('organization_id')

        if not table_id or not organization_id:
            return jsonify({"error": "Table ID and Organization ID are required"}), 400

        table = Table.query.get(table_id)
        if not table:
            return jsonify({"error": "Table not found"}), 404

        if table.organization_id != int(organization_id):
            return jsonify({"error": "Table does not belong to the specified organization"}), 400

        return f(table, *args, **kwargs)

    return decorated


def validate_menu_item(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json() or {}
        menu_item_id = data.get('menu_item_id') or kwargs.get('menu_item_id')

        if not menu_item_id:
            return jsonify({"error": "Menu item ID is required"}), 400

        menu_item = MenuItem.query.get(menu_item_id)
        if not menu_item:
            return jsonify({"error": "Menu item not found"}), 404

        if not menu_item.is_available:
            return jsonify({"error": "This menu item is currently unavailable"}), 400

        return f(menu_item, *args, **kwargs)

    return decorated


# ======================
# Menu Endpoints
# ======================
@bp.route('/menu', methods=['GET'])
@jwt_required()
def get_menu():
    """
    Get menu items for an organization
    ---
    parameters:
      - name: organization_id
        in: query
        required: true
        type: integer
    responses:
      200:
        description: List of menu items
      400:
        description: Missing organization ID
    """
    organization_id = request.args.get('organization_id')
    if not organization_id:
        return jsonify({"error": "Organization ID is required"}), 400

    try:
        menu_items = MenuItem.query.filter_by(
            organization_id=organization_id,
            is_available=True
        ).all()
        return jsonify([item.to_dict() for item in menu_items]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ======================
# Cart Endpoints
# ======================
@bp.route('/cart', methods=['POST'])
@jwt_required()
@validate_menu_item
def add_to_cart(menu_item):
    """
    Add item to cart
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            menu_item_id:
              type: integer
            quantity:
              type: integer
              minimum: 1
            table_id:
              type: integer
            organization_id:
              type: integer
    responses:
      201:
        description: Item added to cart
      400:
        description: Invalid input
    """
    data = request.get_json()
    quantity = data.get('quantity', 1)

    if quantity < 1:
        return jsonify({"error": "Quantity must be at least 1"}), 400

    customer_id = get_jwt_identity()['id']

    # Get or create cart
    cart_order = Order.query.filter_by(
        customer_id=customer_id,
        status='cart'
    ).first()

    if not cart_order:
        cart_order = Order(
            customer_id=customer_id,
            status='cart',
            table_id=data.get('table_id'),
            created_at=datetime.utcnow()
        )
        db.session.add(cart_order)

    # Add or update item
    existing_item = OrderItem.query.filter_by(
        order_id=cart_order.id,
        menu_item_id=menu_item.id
    ).first()

    if existing_item:
        existing_item.quantity += quantity
    else:
        cart_item = OrderItem(
            order_id=cart_order.id,
            menu_item_id=menu_item.id,
            quantity=quantity,
            price_at_order=menu_item.price
        )
        db.session.add(cart_item)

    db.session.commit()

    return jsonify({
        "message": "Item added to cart",
        "cart_item_id": existing_item.id if existing_item else cart_item.id
    }), 201


@bp.route('/cart', methods=['GET'])
@jwt_required()
def view_cart():
    """
    Get current cart contents
    ---
    responses:
      200:
        description: Cart items
    """
    customer_id = get_jwt_identity()['id']
    cart_order = Order.query.filter_by(
        customer_id=customer_id,
        status='cart'
    ).first()

    if not cart_order:
        return jsonify([]), 200

    cart_items = OrderItem.query.filter_by(order_id=cart_order.id).all()

    total = sum(item.quantity * (item.price_at_order or item.menu_item.price)
                for item in cart_items)

    return jsonify({
        "items": [item.to_dict() for item in cart_items],
        "total": total,
        "table_id": cart_order.table_id
    }), 200


@bp.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    """
    Remove item from cart
    ---
    parameters:
      - name: item_id
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Item removed
      404:
        description: Item not found
    """
    customer_id = get_jwt_identity()['id']
    cart_order = Order.query.filter_by(
        customer_id=customer_id,
        status='cart'
    ).first()

    if not cart_order:
        return jsonify({"error": "No active cart found"}), 404

    cart_item = OrderItem.query.filter_by(
        id=item_id,
        order_id=cart_order.id
    ).first()

    if not cart_item:
        return jsonify({"error": "Item not found in cart"}), 404

    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({"message": "Item removed from cart"}), 200


# ======================
# Order Endpoints
# ======================
@bp.route('/order', methods=['POST'])
@jwt_required()
@validate_table_org
def place_order(table):
    """
    Place order from cart
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            table_id:
              type: integer
            organization_id:
              type: integer
    responses:
      200:
        description: Order placed
      400:
        description: Cart is empty
    """
    customer_id = get_jwt_identity()['id']
    cart_order = Order.query.filter_by(
        customer_id=customer_id,
        status='cart'
    ).first()

    if not cart_order or not cart_order.items:
        return jsonify({"error": "Cart is empty"}), 400

    # Validate cart items
    for item in cart_order.items:
        if not item.menu_item.is_available:
            return jsonify({
                "error": f"Item {item.menu_item.name} is no longer available",
                "item_id": item.id
            }), 400

    # Convert cart to order
    cart_order.status = 'pending'
    cart_order.table_id = table.id
    cart_order.created_at = datetime.utcnow()

    # Calculate total
    cart_order.total_amount = sum(
        item.quantity * (item.price_at_order or item.menu_item.price)
        for item in cart_order.items
    )

    db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": cart_order.id,
        "total": cart_order.total_amount
    }), 200


@bp.route('/order/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order_status(order_id):
    """
    Get order status
    ---
    parameters:
      - name: order_id
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Order status
      403:
        description: Not your order
      404:
        description: Order not found
    """
    customer_id = get_jwt_identity()['id']
    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    if order.customer_id != customer_id:
        return jsonify({"error": "Not your order"}), 403

    return jsonify({
        "order_id": order.id,
        "status": order.status,
        "table_number": order.table.number if order.table else None,
        "items": [{
            "name": item.menu_item.name,
            "quantity": item.quantity,
            "price": item.price_at_order or item.menu_item.price
        } for item in order.items],
        "total": order.total_amount,
        "created_at": order.created_at.isoformat() if order.created_at else None
    }), 200


# ======================
# Service Endpoints
# ======================
@bp.route('/waiter', methods=['POST'])
@jwt_required()
@validate_table_org
def call_waiter(table):
    """
    Call waiter to table
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            table_id:
              type: integer
            organization_id:
              type: integer
            message:
              type: string
    responses:
      200:
        description: Waiter notified
    """
    message = request.json.get('message', 'Assistance requested')

    # In a real implementation, this would trigger a notification system
    return jsonify({
        "message": "Waiter has been notified",
        "table_number": table.number,
        "request": message
    }), 200

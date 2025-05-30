from flask import Blueprint, request, jsonify


from models import db, GroupMember
from models.menu_item import MenuItem
from models.order import Order
from models.order_item import OrderItem
from models.table import Table
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from datetime import datetime
from functools import wraps

from services import embedding_service
from websockets import broadcast_cart_update

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
# @jwt_required()
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


@bp.route('/menu/search', methods=['GET'])
@jwt_required()
def search_menu_items():
    """
    Search menu items using natural language
    ---
    tags:
      - Customer
    parameters:
      - name: q
        in: query
        required: true
        type: string
        example: "paneer dish"
    responses:
      200:
        description: List of matching menu items
    """
    identity = get_jwt_identity()
    org_id = request.args.get("org_id") or identity.get("organization_id")
    query = request.args.get("q")

    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    matches = embedding_service.search_menu_items(org_id, query, k=5)
    return jsonify({"results": matches}), 200


# ======================
# Cart Endpoints
# ======================


@bp.route('/cart', methods=['POST'])
def add_to_cart():
    verify_jwt_in_request(optional=True)
    identity = get_jwt_identity()
    data = request.json

    # Validate table and organization
    table_id = data.get('table_id')
    organization_id = data.get('organization_id')
    if not table_id or not organization_id:
        return jsonify({"error": "Table ID and Organization ID are required"}), 400

    table = Table.query.get(table_id)
    if not table:
        return jsonify({"error": "Table not found"}), 404
    if table.organization_id != int(organization_id):
        return jsonify({"error": "Table does not belong to the specified organization"}), 400

    # Validate menu item
    menu_item_id = data.get('menu_item_id')
    if not menu_item_id:
        return jsonify({"error": "Menu item ID is required"}), 400

    menu_item = MenuItem.query.get(menu_item_id)
    if not menu_item:
        return jsonify({"error": "Menu item not found"}), 404
    if not menu_item.is_available:
        return jsonify({"error": "This menu item is currently unavailable"}), 400

    quantity = data.get('quantity', 1)

    if identity:
        # Authenticated: treat as creator (personal cart)
        customer_id = identity['id']
        cart_order = Order.query.filter_by(
            customer_id=customer_id,
            status='cart'
        ).first()
        if not cart_order:
            cart_order = Order(
                customer_id=customer_id,
                status='cart',
                table_id=table.id,
                created_at=datetime.utcnow()
            )
            db.session.add(cart_order)
        else:
            if table.id and cart_order.table_id != table.id:
                cart_order.table_id = table.id

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
            "cart_item_id": existing_item.id if existing_item else cart_item.id,
            "table_id": cart_order.table_id,
            "organization_id": table.organization_id
        }), 201

    else:
        # Unauthenticated: must provide group_id and member_token
        group_id = data.get('group_id')
        member_token = data.get('member_token')
        if not group_id or not member_token:
            return jsonify({"error": "Group ID and member token required"}), 403

        member = GroupMember.query.filter_by(
            group_id=group_id,
            member_token=member_token
        ).first()
        print(
            f"Resolved member: id={member.id if member else None}, name={member.name if member else None}, token={member_token}")
        if not member:
            return jsonify({"error": "Invalid group membership"}), 403

        # Use a single cart per group
        cart_order = Order.query.filter_by(
            group_id=group_id,
            status='cart'
        ).first()
        if not cart_order:
            cart_order = Order(
                group_id=group_id,
                status='cart',
                table_id=table.id,
                created_at=datetime.utcnow()
            )
            db.session.add(cart_order)
        else:
            if table.id and cart_order.table_id != table.id:
                cart_order.table_id = table.id

        # Add item with member_id
        existing_item = OrderItem.query.filter_by(
            order_id=cart_order.id,
            menu_item_id=menu_item.id,
            member_id=member.id
        ).first()

        if existing_item:
            existing_item.quantity += quantity
        else:
            cart_item = OrderItem(
                order_id=cart_order.id,
                menu_item_id=menu_item.id,
                quantity=quantity,
                price_at_order=menu_item.price,
                member_id=member.id
            )
            db.session.add(cart_item)

        db.session.commit()

        updated_cart = {
            "action": "add",
            "item": {
                "id": existing_item.id if existing_item else cart_item.id,
                "quantity": quantity,
                "menu_item_id": menu_item.id,
                "price": menu_item.price
            }
        }
        broadcast_cart_update(group_id, updated_cart)

        return jsonify({
            "message": "Item added to cart",
            "cart_item_id": existing_item.id if existing_item else cart_item.id,
            "table_id": cart_order.table_id,
            "organization_id": table.organization_id
        }), 201


@bp.route('/cart', methods=['GET'])
def view_cart():
    verify_jwt_in_request(optional=True)
    identity = get_jwt_identity()
    data = request.args or {}

    if identity:
        # Authenticated: treat as creator (personal cart)
        customer_id = identity['id']
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
            "items": [
                {
                    **item.to_dict(),
                    "ordered_by": None  # Not a group order
                } for item in cart_items
            ],
            "total": total,
            "table_id": cart_order.table_id,
            "organization_id": cart_order.table.organization_id if cart_order.table else None,
        }), 200

    else:
        # Unauthenticated: must provide group_id and member_token
        group_id = data.get('group_id')
        member_token = data.get('member_token')
        personal = data.get('personal', 'false').lower() == 'true'
        if not group_id or not member_token:
            return jsonify({"error": "Group ID and member token required"}), 403

        member = GroupMember.query.filter_by(
            group_id=group_id,
            member_token=member_token
        ).first()
        if not member:
            return jsonify({"error": "Invalid group membership"}), 403

        cart_order = Order.query.filter_by(
            group_id=group_id,
            status='cart'
        ).first()
        if not cart_order:
            return jsonify([]), 200

        if personal:
            cart_items = OrderItem.query.filter_by(order_id=cart_order.id, member_id=member.id).all()
        else:
            cart_items = OrderItem.query.filter_by(order_id=cart_order.id).all()

        members = {m.id: m.name for m in GroupMember.query.filter_by(group_id=group_id).all()}
        total = sum(item.quantity * (item.price_at_order or item.menu_item.price) for item in cart_items)

        return jsonify({
            "items": [
                {
                    **item.to_dict(),
                    "name": item.menu_item.name,
                    "price": item.price_at_order or item.menu_item.price,
                    "ordered_by": members.get(item.member_id, "Unknown") if item.member_id else "Unknown"
                } for item in cart_items
            ],
            "total": total,
            "table_id": cart_order.table_id,
            "organization_id": cart_order.table.organization_id if cart_order.table else None,
        }), 200


@bp.route('/cart/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
    verify_jwt_in_request(optional=True)
    identity = get_jwt_identity()
    data = request.args or request.get_json() or {}

    if identity:
        # Authenticated user (personal cart)
        customer_id = identity['id']
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

    else:
        # Group member (unauthenticated)
        group_id = data.get('group_id')
        member_token = data.get('member_token')
        if not group_id or not member_token:
            return jsonify({"error": "Group ID and member token required"}), 403

        member = GroupMember.query.filter_by(
            group_id=group_id,
            member_token=member_token
        ).first()
        if not member:
            return jsonify({"error": "Invalid group membership"}), 403

        cart_order = Order.query.filter_by(
            group_id=group_id,
            status='cart'
        ).first()
        if not cart_order:
            return jsonify({"error": "No active cart found"}), 404

        cart_item = OrderItem.query.filter_by(
            id=item_id,
            order_id=cart_order.id,
            member_id=member.id
        ).first()
        if not cart_item:
            return jsonify({"error": "Item not found in cart"}), 404

    group_id = cart_order.group_id
    db.session.delete(cart_item)
    db.session.commit()

    if group_id:
        broadcast_cart_update(group_id, {"action": "remove", "item_id": item_id})

    return jsonify({"message": "Item removed from cart"}), 200


# ======================
# Order Endpoints
# ======================
@bp.route('/order', methods=['POST'])
@jwt_required()
@validate_table_org
def place_order(table):
    identity = get_jwt_identity()
    data = request.get_json() or {}

    group_id = data.get('group_id')
    member_token = data.get('member_token')
    if not group_id or not member_token:
        return jsonify({"error": "Group ID and member token required"}), 400

    # Optionally, verify the member_token belongs to the authenticated user if you have such mapping

    # Find the group cart
    cart_order = Order.query.filter_by(
        group_id=group_id,
        status='cart'
    ).first()

    if not cart_order or not cart_order.items:
        return jsonify({"error": "Cart is empty"}), 400

    for item in cart_order.items:
        if not item.menu_item.is_available:
            return jsonify({
                "error": f"Item {item.menu_item.name} is no longer available",
                "item_id": item.id
            }), 400

    cart_order.status = 'pending'
    cart_order.table_id = table.id
    cart_order.created_at = datetime.utcnow()
    cart_order.total_amount = sum(
        item.quantity * (item.price_at_order or item.menu_item.price)
        for item in cart_order.items
    )
    db.session.commit()
    # Get all items and member info BEFORE clearing cart items
    cart_items = OrderItem.query.filter_by(order_id=cart_order.id).all()
    members = {m.id: m.name for m in GroupMember.query.filter_by(group_id=group_id).all()}

    ordered_items = [
        {
            "name": item.menu_item.name,
            "quantity": item.quantity,
            "ordered_by": members.get(item.member_id, "Unknown") if item.member_id else "Unknown"
        }
        for item in cart_items
    ]

    # Clear cart items
    # OrderItem.query.filter_by(order_id=cart_order.id).delete()
    # db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": cart_order.id,
        "total": cart_order.total_amount,
        "table_id": cart_order.table_id,
        "organization_id": table.organization_id,
        "items": ordered_items
    }), 200

    # Update order status to 'pending'
    cart_order.status = 'pending'
    cart_order.table_id = table.id
    cart_order.created_at = datetime.utcnow()
    cart_order.total_amount = sum(
        item.quantity * (item.price_at_order or item.menu_item.price)
        for item in cart_order.items
    )

    # Clear cart items
    OrderItem.query.filter_by(order_id=cart_order.id).delete()

    db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": cart_order.id,
        "total": cart_order.total_amount,
        "table_id": cart_order.table_id,
        "organization_id": table.organization_id
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

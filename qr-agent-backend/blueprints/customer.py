from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('customer', __name__)

@bp.route('/menu', methods=['GET'])
@jwt_required()
def show_menu():
    """
    Show Menu
    ---
    tags:
      - Customer
    responses:
      200:
        description: Returns the menu
    """
    # Fetch menu from database (mocked here)
    menu = [{"id": 1, "name": "Pizza", "price": 10.99}, {"id": 2, "name": "Pasta", "price": 8.99}]
    return jsonify(menu), 200


@bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    """
    Add to Cart
    ---
    tags:
      - Customer
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              item_id:
                type: integer
                example: 1
              quantity:
                type: integer
                example: 2
    responses:
      200:
        description: Item added to cart
    """
    data = request.get_json()
    item_id = data.get('item_id')
    quantity = data.get('quantity')
    # Add item to cart logic here
    return jsonify({"message": f"Item {item_id} added to cart with quantity {quantity}"}), 200


@bp.route('/cart', methods=['GET'])
@jwt_required()
def view_cart():
    """
    View Cart
    ---
    tags:
      - Customer
    responses:
      200:
        description: Returns the cart
    """
    # Fetch cart from database (mocked here)
    cart = [{"item_id": 1, "name": "Pizza", "quantity": 2, "price": 10.99}]
    return jsonify(cart), 200


@bp.route('/order', methods=['POST'])
@jwt_required()
def place_order():
    """
    Place Order
    ---
    tags:
      - Customer
    responses:
      201:
        description: Order placed successfully
    """
    # Place order logic here
    return jsonify({"message": "Order placed successfully"}), 201


@bp.route('/order/status', methods=['GET'])
@jwt_required()
def order_status():
    """
    Order Status
    ---
    tags:
      - Customer
    responses:
      200:
        description: Returns the order status
    """
    # Fetch order status (mocked here)
    status = {"order_id": 123, "status": "Preparing"}
    return jsonify(status), 200


@bp.route('/order/history', methods=['GET'])
@jwt_required()
def order_history():
    """
    Order History
    ---
    tags:
      - Customer
    responses:
      200:
        description: Returns the order history
    """
    # Fetch order history (mocked here)
    history = [{"order_id": 123, "items": ["Pizza", "Pasta"], "total": 19.98, "status": "Completed"}]
    return jsonify(history), 200


@bp.route('/call-waiter', methods=['POST'])
@jwt_required()
def call_waiter():
    """
    Call Waiter
    ---
    tags:
      - Customer
    responses:
      200:
        description: Waiter called successfully
    """
    # Logic to notify waiter
    return jsonify({"message": "Waiter has been notified"}), 200
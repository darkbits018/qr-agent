from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, OrderItem, MenuItem, Table, Organization
from datetime import datetime
from .utils import admin_required, role_required
from functools import wraps
from sqlalchemy import func

bp = Blueprint('kitchen', __name__, url_prefix='/api/kitchen')


# ======================
# Validation Decorators
# ======================
def validate_kitchen_order(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        order = Order.query.get(kwargs.get('order_id'))
        if not order:
            return jsonify({"error": "Order not found"}), 404

        org_id = get_jwt_identity().get('org_id')
        if order.table.organization_id != org_id:
            return jsonify({"error": "Order doesn't belong to your organization"}), 403

        return f(order, *args, **kwargs)

    return decorated


def validate_status_transition(current_status, new_status):
    valid_transitions = {
        'pending': ['accepted', 'rejected'],
        'accepted': ['preparing', 'rejected'],
        'preparing': ['ready', 'on_hold'],
        'on_hold': ['preparing', 'rejected'],
        'ready': ['served'],
        'served': ['completed']
    }
    return new_status in valid_transitions.get(current_status, [])


# ======================
# Order Management
# ======================
@bp.route('/orders', methods=['GET'])
@jwt_required()
@role_required(['kitchen_staff', 'org_admin'])
def get_kitchen_orders():
    """
    Get filtered kitchen orders with advanced sorting
    ---
    parameters:
      - name: status
        in: query
        schema:
          type: string
          example: "pending,preparing"
      - name: sort
        in: query
        schema:
          type: string
          enum: [newest, oldest, category]
      - name: category
        in: query
        schema:
          type: string
          example: "main"
      - name: limit
        in: query
        schema:
          type: integer
          example: 10
    responses:
      200:
        description: List of orders with kitchen-specific details
    """
    org_id = get_jwt_identity()['org_id']
    status_filter = request.args.get('status', 'pending,preparing,on_hold').split(',')
    category_filter = request.args.get('category')
    limit = request.args.get('limit', type=int)
    sort = request.args.get('sort', 'oldest')

    # Base query
    query = Order.query.join(Table).filter(
        Order.status.in_(status_filter),
        Table.organization_id == org_id
    )

    # Apply category filter if provided
    if category_filter:
        query = query.join(Order.items).join(OrderItem.menu_item).filter(
            MenuItem.category == category_filter
        )

    # Apply sorting
    if sort == 'newest':
        query = query.order_by(Order.created_at.desc())
    elif sort == 'category':
        query = query.join(Order.items).join(OrderItem.menu_item).order_by(
            MenuItem.category.asc(),
            Order.created_at.asc()
        )
    else:  # oldest first (default)
        query = query.order_by(Order.created_at.asc())

    # Apply limit if specified
    if limit:
        query = query.limit(limit)

    orders = query.all()

    # Enhanced response with preparation estimates
    return jsonify([{
        'id': order.id,
        'table_number': order.table.number,
        'status': order.status,
        'priority': order.priority_level(),
        'estimated_prep_time': order.estimated_prep_time(),
        'items': [{
            'id': item.id,
            'name': item.menu_item.name,
            'quantity': item.quantity,
            'category': item.menu_item.category,
            'dietary_info': {
                'vegetarian': item.menu_item.is_vegetarian,
                'preference': item.menu_item.dietary_preference
            },
            'special_requests': item.special_requests,
            'prep_notes': item.menu_item.prep_instructions
        } for item in order.items],
        'timestamps': {
            'created': order.created_at.isoformat(),
            'accepted': order.accepted_at.isoformat() if order.accepted_at else None,
            'preparing': order.preparing_at.isoformat() if order.preparing_at else None
        }
    } for order in orders])


@bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
@role_required(['kitchen_staff', 'org_admin'])
@validate_kitchen_order
def update_order_status(order):
    """
    Update order status with validation and automatic timestamps
    ---
    parameters:
      - name: order_id
        in: path
        required: true
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            status:
              type: string
              enum: [accepted, preparing, ready, served, completed, rejected, on_hold]
            notes:
              type: string
    responses:
      200:
        description: Status updated with timestamps
      400:
        description: Invalid status transition
    """
    data = request.get_json()
    new_status = data.get('status')
    notes = data.get('notes', '')

    if not validate_status_transition(order.status, new_status):
        return jsonify({
            "error": f"Invalid status transition from {order.status} to {new_status}",
            "allowed_transitions": get_allowed_transitions(order.status)
        }), 400

    # Update status and timestamps
    order.status = new_status
    now = datetime.utcnow()

    status_to_timestamp = {
        'accepted': 'accepted_at',
        'preparing': 'preparing_at',
        'ready': 'ready_at',
        'served': 'served_at',
        'completed': 'completed_at',
        'rejected': 'rejected_at',
        'on_hold': 'on_hold_at'
    }

    if new_status in status_to_timestamp:
        setattr(order, status_to_timestamp[new_status], now)

    # Add status change record
    order.status_changes.append({
        'from_status': order.status,
        'to_status': new_status,
        'timestamp': now,
        'changed_by': get_jwt_identity()['id'],
        'notes': notes
    })

    db.session.commit()

    return jsonify({
        "message": "Order status updated",
        "new_status": new_status,
        "timestamps": order.get_timestamps(),
        "next_possible_statuses": get_allowed_transitions(new_status)
    })


# ======================
# Kitchen Management
# ======================
@bp.route('/stations', methods=['GET'])
@jwt_required()
@role_required(['kitchen_staff', 'org_admin'])
def get_kitchen_stations():
    """
    Get kitchen stations and their current orders
    ---
    responses:
      200:
        description: List of kitchen stations with assigned orders
    """
    org_id = get_jwt_identity()['org_id']
    stations = Organization.query.get(org_id).kitchen_stations

    return jsonify([{
        'id': station.id,
        'name': station.name,
        'current_orders': [{
            'order_id': order.id,
            'table_number': order.table.number,
            'items': [item.menu_item.name for item in order.items],
            'time_in_station': (datetime.utcnow() - order.station_assignment_time).total_seconds() // 60
        } for order in station.current_orders]
    } for station in stations])


@bp.route('/orders/<int:order_id>/assign', methods=['POST'])
@jwt_required()
@role_required(['kitchen_manager', 'org_admin'])
@validate_kitchen_order
def assign_order_to_station(order):
    """
    Assign order to kitchen station
    ---
    parameters:
      - name: order_id
        in: path
        required: true
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            station_id:
              type: integer
            priority:
              type: string
              enum: [normal, high, rush]
    responses:
      200:
        description: Order assigned successfully
      400:
        description: Station at capacity
    """
    data = request.get_json()
    station_id = data.get('station_id')
    priority = data.get('priority', 'normal')

    station = KitchenStation.query.get(station_id)
    if not station or station.organization_id != get_jwt_identity()['org_id']:
        return jsonify({"error": "Invalid station"}), 400

    if len(station.current_orders) >= station.capacity:
        return jsonify({"error": "Station at capacity"}), 400

    order.station_id = station_id
    order.priority = priority
    order.station_assignment_time = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "message": "Order assigned to station",
        "station": station.name,
        "position_in_queue": len(station.current_orders)
    })


# ======================
# Analytics Endpoints
# ======================
@bp.route('/analytics/performance', methods=['GET'])
@jwt_required()
@admin_required(roles=['org_admin', 'kitchen_manager'])
def get_performance_metrics():
    """
    Get kitchen performance analytics
    ---
    parameters:
      - name: timeframe
        in: query
        schema:
          type: string
          enum: [today, week, month]
      - name: station_id
        in: query
        schema:
          type: integer
    responses:
      200:
        description: Comprehensive performance metrics
    """
    org_id = get_jwt_identity()['org_id']
    timeframe = request.args.get('timeframe', 'today')
    station_id = request.args.get('station_id')

    # Calculate time range
    now = datetime.utcnow()
    if timeframe == 'today':
        start_date = now.replace(hour=0, minute=0, second=0)
    elif timeframe == 'week':
        start_date = now - timedelta(days=7)
    else:  # month
        start_date = now - timedelta(days=30)

    # Base query
    query = db.session.query(
        func.avg(Order.ready_at - Order.accepted_at).label('avg_prep_time'),
        func.count(Order.id).label('total_orders'),
        func.avg(Order.completed_at - Order.created_at).label('avg_completion_time')
    ).join(Table).filter(
        Table.organization_id == org_id,
        Order.completed_at.isnot(None),
        Order.created_at >= start_date
    )

    if station_id:
        query = query.filter(Order.station_id == station_id)

    metrics = query.first()

    # Item-level statistics
    popular_items = db.session.query(
        MenuItem.name,
        func.count(OrderItem.id).label('order_count')
    ).join(OrderItem.menu_item).join(OrderItem.order).join(Table).filter(
        Table.organization_id == org_id,
        Order.created_at >= start_date
    ).group_by(MenuItem.name).order_by(func.count(OrderItem.id).desc()).limit(5).all()

    return jsonify({
        "timeframe": timeframe,
        "avg_prep_time": str(metrics.avg_prep_time),
        "avg_completion_time": str(metrics.avg_completion_time),
        "total_orders": metrics.total_orders,
        "popular_items": [{"name": item[0], "count": item[1]} for item in popular_items],
        "station_utilization": get_station_utilization(org_id, start_date)
    })


# ======================
# Helper Functions
# ======================
def get_allowed_transitions(current_status):
    transitions = {
        'pending': ['accepted', 'rejected'],
        'accepted': ['preparing', 'rejected'],
        'preparing': ['ready', 'on_hold'],
        'on_hold': ['preparing', 'rejected'],
        'ready': ['served'],
        'served': ['completed']
    }
    return transitions.get(current_status, [])


def get_station_utilization(org_id, start_date):
    stations = KitchenStation.query.filter_by(organization_id=org_id).all()
    return [{
        'station_id': s.id,
        'name': s.name,
        'utilization': db.session.query(
            func.count(Order.id) / (s.capacity * ((datetime.utcnow() - start_date).days or 1))
        ).join(Table).filter(
            Order.station_id == s.id,
            Order.created_at >= start_date
        ).scalar() * 100
    } for s in stations]

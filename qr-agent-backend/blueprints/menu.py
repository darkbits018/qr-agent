from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Menu, MenuItem, Organization
from schemas import MenuSchema, MenuItemSchema
from .utils import org_admin_required

bp = Blueprint('menu', __name__, url_prefix='/api/menus')

menu_schema = MenuSchema()
menu_item_schema = MenuItemSchema()


# --------------------------
# Menu Routes
# --------------------------
@bp.route('', methods=['POST'])
@jwt_required()
@org_admin_required
def create_menu():
    """Create a new menu for organization"""
    data = request.get_json()
    data['organization_id'] = get_jwt_identity()['organization_id']  # Auto-set from JWT

    errors = menu_schema.validate(data)
    if errors:
        return jsonify({"validation_errors": errors}), 400

    menu = Menu(
        name=data['name'],
        organization_id=data['organization_id'],
        is_active=data.get('is_active', True)
    )
    db.session.add(menu)
    db.session.commit()

    return jsonify(menu_schema.dump(menu)), 201


@bp.route('/<int:menu_id>', methods=['GET'])
def get_menu(menu_id):
    """Get menu details (public)"""
    menu = Menu.query.get_or_404(menu_id)
    return jsonify(menu_schema.dump(menu))


@bp.route('/organization/<int:org_id>', methods=['GET'])
def get_org_menus(org_id):
    """List all menus for an organization (public)"""
    menus = Menu.query.filter_by(organization_id=org_id, is_active=True).all()
    return jsonify(menu_schema.dump(menus, many=True))


# --------------------------
# Menu Item Routes
# --------------------------
@bp.route('/<int:menu_id>/items', methods=['POST'])
@jwt_required()
@org_admin_required
def add_menu_item(menu_id):
    """Add item to menu"""
    data = request.get_json()
    errors = menu_item_schema.validate(data)
    if errors:
        return jsonify({"validation_errors": errors}), 400

    # Verify menu belongs to admin's org
    menu = Menu.query.filter_by(
        id=menu_id,
        organization_id=get_jwt_identity()['organization_id']
    ).first_or_404()

    item = MenuItem(
        name=data['name'],
        price=data['price'],
        menu_id=menu_id,
        category=data.get('category', 'main'),
        is_vegetarian=data.get('is_vegetarian', False),
        is_available=data.get('is_available', True)
    )
    db.session.add(item)
    db.session.commit()

    return jsonify(menu_item_schema.dump(item)), 201


@bp.route('/items/<int:item_id>', methods=['PUT'])
@jwt_required()
@org_admin_required
def update_menu_item(item_id):
    """Update menu item"""
    item = MenuItem.query.join(Menu).filter(
        MenuItem.id == item_id,
        Menu.organization_id == get_jwt_identity()['organization_id']
    ).first_or_404()

    data = request.get_json()
    if 'name' in data:
        item.name = data['name']
    if 'price' in data:
        item.price = data['price']
    if 'is_available' in data:
        item.is_available = data['is_available']

    db.session.commit()
    return jsonify(menu_item_schema.dump(item))


@bp.route('/items/bulk', methods=['POST'])
@jwt_required()
@org_admin_required
def bulk_import_items():
    """Bulk import menu items from Excel"""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if not file.filename.endswith(('.xlsx', '.xls')):
        return jsonify({"error": "Only Excel files allowed"}), 400

    try:
        df = pd.read_excel(file)
        for _, row in df.iterrows():
            item = MenuItem(
                name=row['name'],
                price=float(row['price']),
                menu_id=int(row['menu_id']),
                category=row.get('category', 'main'),
                is_vegetarian=row.get('is_vegetarian', False),
                is_available=row.get('is_available', True)
            )
            db.session.add(item)
        db.session.commit()
        return jsonify({"message": f"{len(df)} items imported"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

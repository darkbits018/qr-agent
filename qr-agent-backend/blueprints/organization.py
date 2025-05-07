from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Organization, MenuItem, Table
from schemas import MenuSchema, MenuItemSchema, TableSchema
import pandas as pd
import qrcode
import os
from io import BytesIO
from .utils import admin_required, save_qr_code

bp = Blueprint('organization', __name__, url_prefix='/api/organizations')


# --------------------------
# Menu Item Management
# --------------------------
@bp.route('/menu/items', methods=['POST'])
@jwt_required()
@admin_required(roles=['org_admin'])
def create_menu_item():
    org_id = get_jwt_identity()['org_id']
    data = request.get_json()

    item = MenuItem(
        name=data['name'],
        price=data['price'],
        organization_id=org_id,
        category=data.get('category'),
        dietary_preference=data.get('dietary_preference'),
        available_times=data.get('available_times', 'all-day')
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(MenuItemSchema().dump(item)), 201


@bp.route('/menu/items', methods=['GET'])
@jwt_required()
@admin_required(roles=['org_admin'])
def get_menu_items():
    org_id = get_jwt_identity()['org_id']
    items = MenuItem.query.filter_by(organization_id=org_id).all()
    return jsonify(MenuItemSchema(many=True).dump(items)), 200


@bp.route('/menu/items/<int:item_id>', methods=['PUT', 'DELETE'])
@jwt_required()
@admin_required(roles=['org_admin'])
def manage_menu_item(item_id):
    org_id = get_jwt_identity()['org_id']
    item = MenuItem.query.filter_by(id=item_id, organization_id=org_id).first_or_404()

    if request.method == 'PUT':
        item.name = request.json.get('name', item.name)
        item.price = request.json.get('price', item.price)
        item.category = request.json.get('category', item.category)
        item.dietary_preference = request.json.get('dietary_preference', item.dietary_preference)
        item.available_times = request.json.get('available_times', item.available_times)
        item.is_available = request.json.get('is_available', item.is_available)
        db.session.commit()
        return jsonify(MenuItemSchema().dump(item)), 200

    elif request.method == 'DELETE':
        db.session.delete(item)
        db.session.commit()
        return jsonify(message="Menu item deleted"), 200


# Bulk import menu items
@bp.route('/menu/items/bulk', methods=['POST'])
@jwt_required()
@admin_required(roles=['org_admin'])
def bulk_import_items():
    org_id = get_jwt_identity()['org_id']

    if 'file' not in request.files:
        return jsonify(error="Excel file required"), 400

    file = request.files['file']
    if not file.filename.endswith(('.xlsx', '.xls')):
        return jsonify(error="Only Excel files allowed"), 400

    try:
        df = pd.read_excel(file)
        for _, row in df.iterrows():
            item = MenuItem(
                name=row['name'],
                price=row['price'],
                organization_id=org_id,
                category=row.get('category'),
                dietary_preference=row.get('dietary_preference'),
                available_times=row.get('available_times', 'all-day')
            )
            db.session.add(item)
        db.session.commit()
        return jsonify(message=f"{len(df)} items imported"), 201
    except Exception as e:
        return jsonify(error=str(e)), 400


# --------------------------
# Table/QR Management
# --------------------------
@bp.route('/<int:org_id>/tables/bulk', methods=['POST'])
@jwt_required()
@admin_required(roles=['org_admin'])
def bulk_create_tables(org_id):
    count = request.json.get('count', 1)  # Default 1 table
    tables = []

    for i in range(1, count + 1):
        table = Table(
            number=f"Table {i}",
            qr_code=f"org_{org_id}_table_{i}",
            organization_id=org_id
        )
        # Generate QR image
        qr = qrcode.make(f"https://yourdomain.com/menu?table_id={table.id}")
        qr_path = f"static/qr_codes/table_{table.id}.png"
        save_qr_code(qr, qr_path)  # Using our new utility function

        db.session.add(table)
        tables.append(table)

    db.session.commit()
    return jsonify(TableSchema(many=True).dump(tables)), 201


@bp.route('/<int:org_id>/tables/<int:table_id>', methods=['GET', 'DELETE'])
@jwt_required()
@admin_required(roles=['org_admin'])
def manage_table(org_id, table_id):
    table = Table.query.filter_by(id=table_id, organization_id=org_id).first_or_404()

    if request.method == 'GET':
        return jsonify(TableSchema().dump(table)), 200

    elif request.method == 'DELETE':
        # Delete QR image
        qr_path = f"static/qr_codes/table_{table.id}.png"
        if os.path.exists(qr_path):
            os.remove(qr_path)

        db.session.delete(table)
        db.session.commit()
        return jsonify(message="Table deleted"), 200
    return None

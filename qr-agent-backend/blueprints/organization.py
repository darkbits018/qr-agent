from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Organization, Menu, MenuItem, Table
from schemas import MenuSchema, MenuItemSchema, TableSchema
import pandas as pd
import qrcode
import os
from io import BytesIO
from .utils import admin_required, save_qr_code

bp = Blueprint('organization', __name__, url_prefix='/api/organizations')


# --------------------------
# Menu Management
# --------------------------
@bp.route('/<int:org_id>/menus', methods=['POST'])
@jwt_required()
@admin_required(roles=['org_admin'])
def create_menu(org_id):
    data = request.get_json()
    menu = Menu(name=data['name'], organization_id=org_id)
    db.session.add(menu)
    db.session.commit()
    return jsonify(MenuSchema().dump(menu)), 201


@bp.route('/<int:org_id>/menus/<int:menu_id>', methods=['PUT', 'DELETE'])
@jwt_required()
@admin_required(roles=['org_admin'])
def manage_menu(org_id, menu_id):
    menu = Menu.query.filter_by(id=menu_id, organization_id=org_id).first_or_404()

    if request.method == 'PUT':
        menu.name = request.json.get('name', menu.name)
        db.session.commit()
        return jsonify(MenuSchema().dump(menu)), 200

    elif request.method == 'DELETE':
        db.session.delete(menu)
        db.session.commit()
        return jsonify(message="Menu deleted"), 200


# Bulk import menu items via Excel
@bp.route('/<int:org_id>/menus/<int:menu_id>/bulk-items', methods=['POST'])
@jwt_required()
@admin_required(roles=['org_admin'])
def bulk_import_items(org_id, menu_id):
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
                menu_id=menu_id,
                category=row.get('category', '')
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

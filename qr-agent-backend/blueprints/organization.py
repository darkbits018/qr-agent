from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Organization, MenuItem, Table
from schemas import MenuSchema, MenuItemSchema, TableSchema
import pandas as pd
import qrcode
import os
from io import BytesIO
from .utils import admin_required, generate_qr_code

bp = Blueprint('organization', __name__, url_prefix='/api/organizations')


# --------------------------
# Menu Item Management
# --------------------------
@bp.route('/menu/items', methods=['POST'])
@jwt_required()
@admin_required(roles=['org_admin'])
def create_menu_item():
    """
    Create a Menu Item
    ---
    tags:
      - Menu Management
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              name:
                type: string
                example: "Pizza"
              price:
                type: number
                example: 9.99
              category:
                type: string
                example: "Main Course"
              dietary_preference:
                type: string
                example: "Vegetarian"
              available_times:
                type: string
                example: "all-day"
    responses:
      201:
        description: Menu item created successfully
      400:
        description: Invalid input
      403:
        description: Unauthorized
    """
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
    """
    Get Menu Items
    ---
    tags:
      - Menu Management
    responses:
      200:
        description: List of menu items
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/MenuItem'
      403:
        description: Unauthorized
    """
    org_id = get_jwt_identity()['org_id']
    items = MenuItem.query.filter_by(organization_id=org_id).all()
    return jsonify(MenuItemSchema(many=True).dump(items)), 200


@bp.route('/menu/items/<int:item_id>', methods=['PUT', 'DELETE'])
@jwt_required()
@admin_required(roles=['org_admin'])
def manage_menu_item(item_id):
    """
    Manage Menu Item
    ---
    tags:
      - Menu Management
    parameters:
      - name: item_id
        in: path
        required: true
        schema:
          type: integer
          example: 1
    requestBody:
      required: false
      content:
        application/json:
          schema:
            type: object
            properties:
              name:
                type: string
                example: "Updated Pizza"
              price:
                type: number
                example: 12.99
              category:
                type: string
                example: "Main Course"
              dietary_preference:
                type: string
                example: "Vegan"
              available_times:
                type: string
                example: "dinner"
              is_available:
                type: boolean
                example: true
    responses:
      200:
        description: Menu item updated or deleted successfully
      403:
        description: Unauthorized
      404:
        description: Menu item not found
    """
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
    return None


# Bulk import menu items
@bp.route('/menu/items/bulk', methods=['POST'])
@jwt_required()
@admin_required(roles=['org_admin'])
def bulk_import_items():
    """
    Bulk Import Menu Items
    ---
    tags:
      - Menu Management
    requestBody:
      required: true
      content:
        multipart/form-data:
          schema:
            type: object
            properties:
              file:
                type: string
                format: binary
    responses:
      201:
        description: Menu items imported successfully
      400:
        description: Invalid file or format
      403:
        description: Unauthorized
    """
    org_id = get_jwt_identity()['org_id']

    if 'file' not in request.files:
        return jsonify(error="Excel file required"), 400

    file = request.files['file']
    if not file.filename.endswith(('.xlsx', '.xls')):
        return jsonify(error="Only Excel files allowed"), 400

    try:
        df = pd.read_excel(file)

        # Ensure column names match exactly with your database
        required_columns = ['name', 'description', 'price', 'image_url',
                            'category', 'dietary_preference', 'available_times',
                            'is_vegetarian', 'is_available']

        if not all(col in df.columns for col in required_columns):
            return jsonify(error="Excel columns don't match required format"), 400

        for _, row in df.iterrows():
            item = MenuItem(
                name=row['name'],
                description=row['description'],
                price=float(row['price']),  # Explicit conversion to float
                image_url=row['image_url'],
                category=row['category'],
                dietary_preference=row['dietary_preference'] if pd.notna(row['dietary_preference']) else None,
                available_times=row['available_times'],
                is_vegetarian=bool(row['is_vegetarian']),
                is_available=bool(row['is_available']),
                organization_id=org_id
            )
            db.session.add(item)

        db.session.commit()
        return jsonify(message=f"{len(df)} items imported"), 201

    except Exception as e:
        db.session.rollback()
        return jsonify(error=f"Import failed: {str(e)}"), 400


# --------------------------
# Table/QR Management
# --------------------------
# In qr-agent-backend/blueprints/organization.py
@bp.route('/tables/bulk', methods=['POST'])
@jwt_required()
@admin_required(roles=['org_admin'])
def bulk_create_tables():
    current_user = get_jwt_identity()
    org_id = current_user['org_id']
    count = request.json.get('count', 1)

    tables = []
    for i in range(1, count + 1):
        # Generate QR code with dynamic URL
        qr_url = generate_qr_code(
            f"https://yourdomain.com/menu?org_id={org_id}&table_id={i}"
        )

        table = Table(
            number=f"Table {i}",
            qr_code_url=qr_url,
            organization_id=org_id
        )
        db.session.add(table)
        tables.append(table)

    db.session.commit()

    return jsonify([{
        "id": table.id,
        "number": table.number,
        "qr_code_url": table.qr_code_url,
        "organization_id": table.organization_id
    } for table in tables]), 201


@bp.route('/tables', methods=['GET'])
@jwt_required()
@admin_required(roles=['org_admin'])
def get_tables():
    current_user = get_jwt_identity()
    org_id = current_user['org_id']

    tables = Table.query.filter_by(organization_id=org_id).all()
    return jsonify([{
        "id": table.id,
        "number": table.number,
        "qr_code_url": table.qr_code_url,
        "is_occupied": table.is_occupied
    } for table in tables])

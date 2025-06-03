from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from models import db, Organization, MenuItem, Table, User
from schemas import MenuSchema, MenuItemSchema, TableSchema, UserSchema
import pandas as pd
import qrcode
import os
from io import BytesIO

from services import embedding_service
from .utils import admin_required, generate_qr_code

bp = Blueprint('organization', __name__, url_prefix='/api/organizations')
UPLOAD_FOLDER = 'static/uploads/menu_items'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


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
    data = request.form
    files = request.files.getlist('images')

    if not data.get('name') or not data.get('price'):
        return jsonify({"error": "Name and price are required"}), 400

    image_paths = []
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    for file in files[:4]:  # Limit to 4 images
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            image_paths.append(file_path)
        else:
            return jsonify({"error": "Invalid file type"}), 400

    item = MenuItem(
        name=data['name'],
        price=float(data['price']),
        organization_id=org_id,
        category=data.get('category'),
        dietary_preference=data.get('dietary_preference'),
        available_times=data.get('available_times', 'all-day'),
        image1=image_paths[0] if len(image_paths) > 0 else None,
        image2=image_paths[1] if len(image_paths) > 1 else None,
        image3=image_paths[2] if len(image_paths) > 2 else None,
        image4=image_paths[3] if len(image_paths) > 3 else None
    )
    db.session.add(item)
    db.session.commit()
    embedding_service.build_index_for_organization(org_id)
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
        embedding_service.build_index_for_organization(org_id)  # Refresh index
        return jsonify(MenuItemSchema().dump(item)), 200

    elif request.method == 'DELETE':
        db.session.delete(item)
        db.session.commit()
        embedding_service.build_index_for_organization(org_id)  # Refresh index
        return jsonify(message="Menu item deleted"), 200
    return None


# Bulk import menu items
# @bp.route('/menu/items/bulk', methods=['POST'])
# @jwt_required()
# @admin_required(roles=['org_admin'])
# def bulk_import_items():
#     """
#     Bulk Import Menu Items
#     ---
#     tags:
#       - Menu Management
#     requestBody:
#       required: true
#       content:
#         multipart/form-data:
#           schema:
#             type: object
#             properties:
#               file:
#                 type: string
#                 format: binary
#     responses:
#       201:
#         description: Menu items imported successfully
#       400:
#         description: Invalid file or format
#       403:
#         description: Unauthorized
#     """
#     org_id = get_jwt_identity()['org_id']
#
#     if 'file' not in request.files:
#         return jsonify(error="Excel file required"), 400
#
#     file = request.files['file']
#     if not file.filename.endswith(('.xlsx', '.xls')):
#         return jsonify(error="Only Excel files allowed"), 400
#
#     try:
#         df = pd.read_excel(file)
#
#         # Ensure column names match exactly with your database
#         required_columns = ['name', 'description', 'price', 'image_url',
#                             'category', 'dietary_preference', 'available_times',
#                             'is_vegetarian', 'is_available']
#
#         if not all(col in df.columns for col in required_columns):
#             return jsonify(error="Excel columns don't match required format"), 400
#
#         for _, row in df.iterrows():
#             item = MenuItem(
#                 name=row['name'],
#                 description=row['description'],
#                 price=float(row['price']),  # Explicit conversion to float
#                 image_url=row['image_url'],
#                 category=row['category'],
#                 dietary_preference=row['dietary_preference'] if pd.notna(row['dietary_preference']) else None,
#                 available_times=row['available_times'],
#                 is_vegetarian=bool(row['is_vegetarian']),
#                 is_available=bool(row['is_available']),
#                 organization_id=org_id
#             )
#             db.session.add(item)
#
#         db.session.commit()
#         return jsonify(message=f"{len(df)} items imported"), 201
#
#     except Exception as e:
#         db.session.rollback()
#         return jsonify(error=f"Import failed: {str(e)}"), 400


# --------------------------
# Table/QR Management
# --------------------------
# In qr-agent-backend/blueprints/organization.py

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

        required_columns = [
            'name', 'description', 'price', 'category', 'dietary_preference',
            'available_times', 'is_vegetarian', 'is_available',
            'image1', 'image2', 'image3', 'image4'
        ]

        if not all(col in df.columns for col in required_columns):
            return jsonify(error="Excel columns don't match required format"), 400

        for _, row in df.iterrows():
            item = MenuItem(
                name=row['name'],
                description=row['description'],
                price=float(row['price']),
                category=row['category'],
                dietary_preference=row['dietary_preference'] if pd.notna(row['dietary_preference']) else None,
                available_times=row['available_times'],
                is_vegetarian=bool(row['is_vegetarian']),
                is_available=bool(row['is_available']),
                organization_id=org_id,
                image1=row['image1'] if pd.notna(row['image1']) else None,
                image2=row['image2'] if pd.notna(row['image2']) else None,
                image3=row['image3'] if pd.notna(row['image3']) else None,
                image4=row['image4'] if pd.notna(row['image4']) else None
            )
            db.session.add(item)

        db.session.commit()
        return jsonify(message=f"{len(df)} items imported"), 201

    except Exception as e:
        db.session.rollback()
        return jsonify(error=f"Import failed: {str(e)}"), 400


@bp.route('/tables/bulk', methods=['POST'])
@jwt_required()
@admin_required(roles=['org_admin'])
def bulk_create_tables():
    """
        Bulk Create Tables
        ---
        tags:
          - Table Management
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  count:
                    type: integer
                    example: 5
                    description: "Number of tables to create"
        responses:
          201:
            description: Tables created successfully
            content:
              application/json:
                schema:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        example: 1
                      number:
                        type: string
                        example: "Table 1"
                      qr_code_url:
                        type: string
                        example: "https://yourdomain.com/menu?org_id=1&table_id=1"
                      organization_id:
                        type: integer
                        example: 1
          403:
            description: Unauthorized
            """
    current_user = get_jwt_identity()
    org_id = current_user['org_id']
    count = request.json.get('count', 1)

    tables = []
    for i in range(1, count + 1):
        table = Table(
            number=f"Table {i}",
            organization_id=org_id
        )
        db.session.add(table)
        tables.append(table)

    db.session.commit()  # Now table.id is available

    for table in tables:
        table.qr_code_url = generate_qr_code(
            f"http://localhost:5173/customer/welcome?org_id={org_id}&table_id={table.id}"
        )
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
    """
        Get Tables
        ---
        tags:
          - Table Management
        responses:
          200:
            description: List of tables
            content:
              application/json:
                schema:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        example: 1
                      number:
                        type: string
                        example: "Table 1"
                      qr_code_url:
                        type: string
                        example: "https://yourdomain.com/menu?org_id=1&table_id=1"
                      is_occupied:
                        type: boolean
                        example: false
          403:
            description: Unauthorized
        """
    current_user = get_jwt_identity()
    org_id = current_user['org_id']

    tables = Table.query.filter_by(organization_id=org_id).all()
    return jsonify([{
        "id": table.id,
        "number": table.number,
        "qr_code_url": table.qr_code_url,
        "is_occupied": table.is_occupied
    } for table in tables])


# Add tables (single or bulk)
@bp.route('/tables', methods=['POST'])
@jwt_required()
@admin_required(roles=['org_admin'])
def add_tables():
    """
    Add one or multiple tables
    ---
    tags:
      - Table Management
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            tables:
              type: array
              items:
                type: object
                properties:
                  number:
                    type: string
                    example: "Table 1"
    responses:
      201:
        description: Tables created successfully
      400:
        description: Invalid input
    """
    current_user = get_jwt_identity()
    org_id = current_user['org_id']
    data = request.get_json()

    if 'tables' in data:
        table_numbers = [t['number'] for t in data['tables']]
    elif 'number' in data:
        table_numbers = [data['number']]
    else:
        return jsonify({"error": "Must provide 'number' or 'tables' array"}), 400

    tables = []
    for number in table_numbers:
        table = Table(
            number=number,
            organization_id=org_id
        )
        db.session.add(table)
        tables.append(table)

    db.session.commit()  # Now table.id is available

    for table in tables:
        table.qr_code_url = generate_qr_code(
            f"https://localhost:5173/customer/welcome?org_id={org_id}&table_id={table.id}"
        )
    db.session.commit()

    return jsonify({
        "message": f"{len(tables)} table(s) created successfully",
        "tables": [{
            "id": t.id,
            "number": t.number,
            "qr_code_url": t.qr_code_url
        } for t in tables]
    }), 201


@bp.route('/tables', methods=['DELETE'])
@jwt_required()
@admin_required(roles=['org_admin'])
def delete_tables():
    """
    Delete tables - supports single, bulk, or all tables
    ---
    tags:
      - Table Management
    parameters:
      - name: body
        in: body
        schema:
          type: object
          properties:
            table_id:
              type: integer
              example: 1
            table_ids:
              type: array
              items:
                type: integer
                example: 1
            delete_all:
              type: boolean
              example: false
    responses:
      200:
        description: Tables deleted successfully
      400:
        description: Invalid input
    """
    current_user = get_jwt_identity()
    org_id = current_user['org_id']
    data = request.get_json()

    # Handle delete all request
    if data.get('delete_all', False):
        return delete_all_tables(org_id)

    # Handle single or bulk delete
    if 'table_ids' in data:  # Bulk deletion
        table_ids = data['table_ids']
    elif 'table_id' in data:  # Single deletion
        table_ids = [data['table_id']]
    else:
        return jsonify({"error": "Must provide 'table_id', 'table_ids', or 'delete_all: true'"}), 400

    deleted_count = 0
    for table_id in table_ids:
        table = Table.query.filter_by(
            id=table_id,
            organization_id=org_id
        ).first()

        if not table:
            continue

        # Delete QR code file if stored locally
        delete_qr_code_file(table.qr_code_url)

        db.session.delete(table)
        deleted_count += 1

    try:
        db.session.commit()
        return jsonify({
            "message": f"{deleted_count} table(s) deleted successfully",
            "deleted_count": deleted_count
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


def delete_all_tables(org_id):
    """Helper function to delete all tables for an organization"""
    try:
        # Get all tables for the organization
        tables = Table.query.filter_by(organization_id=org_id).all()

        # Delete associated QR code files
        for table in tables:
            delete_qr_code_file(table.qr_code_url)

        # Bulk delete using SQL for better performance
        deleted_count = Table.query.filter_by(organization_id=org_id).delete()
        db.session.commit()

        return jsonify({
            "message": f"All {deleted_count} tables deleted successfully",
            "deleted_count": deleted_count
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


def delete_qr_code_file(qr_url):
    """Helper to delete QR code file if stored locally"""
    if qr_url and qr_url.startswith('/static/qr_codes/'):
        try:
            os.remove(qr_url)
        except OSError:
            pass  # File already deleted or doesn't exist


@bp.route('/staff', methods=['POST'])
@jwt_required()
def add_staff():
    identity = get_jwt_identity()
    role = identity.get('role')

    if role != 'org_admin':
        return jsonify({"error": "Forbidden"}), 403

    org_id = int(identity.get('org_id'))

    data = request.get_json()
    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password required"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists"}), 400

    organization = Organization.query.get(org_id)
    if not organization:
        return jsonify({"error": "Invalid organization_id"}), 400

    staff = User(
        email=data['email'],
        role='staff',
        organization_id=org_id
    )
    staff.set_password(data['password'])
    db.session.add(staff)
    db.session.commit()

    return jsonify(UserSchema().dump(staff)), 201

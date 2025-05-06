from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Organization, User
from schemas import OrganizationSchema, UserSchema
import re

bp = Blueprint('superadmin', __name__, url_prefix='/api/superadmin')


# --------------------------
# Organization CRUD
# --------------------------
@bp.route('/organizations', methods=['POST'])
@jwt_required()
def create_organization():
    """
    Create a new organization with admin
    """
    # Verify superadmin
    if get_jwt_identity().get('role') != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()

    # Validate input
    required_fields = ['name', 'admin_email', 'admin_password']
    if missing := [field for field in required_fields if field not in data]:
        return jsonify({
            "error": "Missing required fields",
            "missing": missing
        }), 400

    # Password validation
    if len(data['admin_password']) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters"
        }), 400

    # Email validation
    if not re.match(r"[^@]+@[^@]+\.[^@]+", data['admin_email']):
        return jsonify({
            "error": "Invalid email format"
        }), 400

    # Check for existing user
    admin = User.query.filter_by(email=data['admin_email']).first()
    admin_created = False

    try:
        # Create admin if needed
        if not admin:
            admin = User(
                email=data['admin_email'],
                role='org_admin',
                is_active=True
            )
            admin.set_password(data['admin_password'])
            db.session.add(admin)
            db.session.flush()  # Critical - generates ID without commit

        # Create organization
        org = Organization(
            name=data['name'],
            admin_id=admin.id,  # Use the flushed ID
            is_active=True
        )
        db.session.add(org)
        db.session.commit()  # Single atomic commit

        return jsonify({
            "message": "Organization created successfully",
            "organization": OrganizationSchema().dump(org),
            "admin": {
                "id": admin.id,
                "email": admin.email,
                "new_account": admin_created
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@bp.route('/organizations', methods=['GET'])
@jwt_required()
def list_organizations():
    if get_jwt_identity()['role'] != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    # Filtering
    is_active = request.args.get('is_active', type=lambda v: v.lower() == 'true')
    query = Organization.query
    if is_active is not None:
        query = query.filter_by(is_active=is_active)

    orgs = query.all()
    return jsonify(OrganizationSchema(many=True).dump(orgs)), 200


@bp.route('/organizations/<int:org_id>', methods=['GET'])
@jwt_required()
def get_organization(org_id):
    if get_jwt_identity()['role'] != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    org = Organization.query.get_or_404(org_id)
    return jsonify(OrganizationSchema().dump(org)), 200


@bp.route('/organizations/<int:org_id>', methods=['PUT'])
@jwt_required()
def update_organization(org_id):
    if get_jwt_identity()['role'] != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    org = Organization.query.get_or_404(org_id)
    data = request.get_json()

    if 'name' in data:
        org.name = data['name']
    if 'is_active' in data:
        org.is_active = data['is_active']

    db.session.commit()
    return jsonify(OrganizationSchema().dump(org)), 200


@bp.route('/organizations/<int:org_id>', methods=['DELETE'])
@jwt_required()
def deactivate_organization(org_id):
    if get_jwt_identity()['role'] != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    org = Organization.query.get_or_404(org_id)
    org.is_active = False  # Soft delete
    db.session.commit()
    return jsonify(message="Organization deactivated"), 200


# --------------------------
# Admin Management
# --------------------------
@bp.route('/admins', methods=['POST'])
@jwt_required()
def create_admin():
    if get_jwt_identity()['role'] != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()
    required_fields = ['email', 'role', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Required fields: {required_fields}"}), 400

    if data['role'] not in ['superadmin', 'org_admin']:
        return jsonify({"error": "Invalid role"}), 400

    # Check if user exists
    user = User.query.filter_by(email=data['email']).first()
    if user:
        return jsonify({"error": "User already exists"}), 400

    # Create admin user
    admin = User(
        email=data['email'],
        role=data['role']
    )
    admin.set_password(data['password'])

    # Associate with organization if role is org_admin
    if data['role'] == 'org_admin':
        if 'organization_id' not in data:
            return jsonify({"error": "organization_id is required for org_admin"}), 400

        organization = Organization.query.get(data['organization_id'])
        if not organization:
            return jsonify({"error": "Invalid organization_id"}), 400

        organization.admin_id = admin.id
        db.session.add(organization)

    db.session.add(admin)
    db.session.commit()

    return jsonify(UserSchema().dump(admin)), 201


@bp.route('/admins', methods=['GET'])
@jwt_required()
def get_all_admins():
    if get_jwt_identity()['role'] != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    role = request.args.get('role')
    query = User.query.filter(User.role.in_(['superadmin', 'org_admin']))

    if role:
        query = query.filter_by(role=role)

    admins = query.all()
    return jsonify(UserSchema(many=True).dump(admins)), 200


@bp.route('/admins/<int:admin_id>', methods=['PUT'])
@jwt_required()
def update_admin(admin_id):
    if get_jwt_identity()['role'] != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    # Use filter() instead of filter_by() for complex conditions
    admin = User.query.filter(
        User.id == admin_id,
        User.role.in_(['superadmin', 'org_admin'])
    ).first_or_404()

    data = request.get_json()

    if 'role' in data:
        if data['role'] not in ['superadmin', 'org_admin']:
            return jsonify({"error": "Invalid role"}), 400
        admin.role = data['role']

    if 'is_active' in data:
        admin.is_active = data['is_active']

    db.session.commit()
    return jsonify(UserSchema().dump(admin)), 200


@bp.route('/admins/<int:admin_id>', methods=['DELETE'])
@jwt_required()
def deactivate_admin(admin_id):
    if get_jwt_identity()['role'] != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    # Use filter() for in_() clause
    admin = User.query.filter(
        User.id == admin_id,
        User.role.in_(['superadmin', 'org_admin'])
    ).first_or_404()

    admin.is_active = False  # Soft delete
    db.session.commit()
    return jsonify(message="Admin deactivated"), 200

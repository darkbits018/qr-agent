from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Organization, User
from schemas import OrganizationSchema, UserSchema

bp = Blueprint('superadmin', __name__, url_prefix='/api/superadmin')


# --------------------------
# Organization CRUD
# --------------------------
@bp.route('/organizations', methods=['POST'])
@jwt_required()
def create_organization():
    # Verify superadmin role
    if get_jwt_identity()['role'] != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()

    # Validate input
    required_fields = ['name', 'admin_email', 'admin_password']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Required fields: {required_fields}"}), 400

    # Check if admin exists or create new
    admin = User.query.filter_by(email=data['admin_email']).first()
    if not admin:
        admin = User(
            email=data['admin_email'],
            role='org_admin'  # Default role for new admins
        )
        admin.set_password(data['admin_password'])
        db.session.add(admin)
        db.session.flush()  # Generate admin.id before commit

    # Verify admin role is valid
    elif admin.role not in ['superadmin', 'org_admin']:
        return jsonify({
            "error": "Email belongs to non-admin user",
            "solution": "Use a different email or promote user to admin"
        }), 400

    # Create organization
    org = Organization(
        name=data['name'],
        admin_id=admin.id,
        is_active=True
    )
    db.session.add(org)
    db.session.commit()

    return jsonify({
        "organization": OrganizationSchema().dump(org),
        "admin_created": not admin  # True if new admin was created
    }), 201


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
    if not data.get('email') or not data.get('role'):
        return jsonify({"error": "Email and role required"}), 400

    if data['role'] not in ['superadmin', 'org_admin']:
        return jsonify({"error": "Invalid role"}), 400

    # Check if user exists
    user = User.query.filter_by(email=data['email']).first()
    if user:
        return jsonify({"error": "User already exists"}), 400

    # Create admin user
    admin = User(
        email=data['email'],
        role=data['role'],
        is_active=True
    )
    admin.set_password("temporary_password")  # Force password reset
    db.session.add(admin)
    db.session.commit()

    return jsonify(UserSchema().dump(admin)), 201


@bp.route('/admins', methods=['GET'])
@jwt_required()
def list_admins():
    if get_jwt_identity()['role'] != 'superadmin':
        return jsonify({"error": "Forbidden"}), 403

    role_filter = request.args.get('role')
    query = User.query.filter(User.role.in_(['superadmin', 'org_admin']))

    if role_filter:
        query = query.filter_by(role=role_filter)

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

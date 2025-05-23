import base64
from io import BytesIO

import qrcode
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Table
from models.group import Group
from models.group_member import GroupMember
import random, string
from datetime import datetime, timedelta

bp = Blueprint('group', __name__, url_prefix='/api/group')


def generate_join_code(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


@bp.route('/create', methods=['POST'])
@jwt_required()
def create_group():
    identity = get_jwt_identity()
    user_id = identity['id']
    creator_name = identity.get('name', 'Creator')  # fallback to 'Creator' if name not present
    data = request.json
    table_id = data['table_id']
    organization_id = data['organization_id']

    # Verify table belongs to organization
    table = Table.query.filter_by(id=table_id, organization_id=organization_id).first()
    if not table:
        return jsonify({"error": "Invalid table/organization"}), 400

    # Create group
    join_code = generate_join_code()
    group = Group(
        creator_id=user_id,
        table_id=table_id,
        organization_id=organization_id,
        join_code=join_code,
        expires_at=datetime.utcnow() + timedelta(hours=2)
    )
    db.session.add(group)
    db.session.commit()

    member_token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    creator_member = GroupMember(group_id=group.id, name=creator_name, member_token=member_token)
    db.session.add(creator_member)
    db.session.commit()

    # Create QR code URL
    qr_url = f"https://localhost:5173/customer/join?org_id={organization_id}&table_id={table_id}&group_id={group.id}"

    qr_img = qrcode.make(qr_url)
    buffered = BytesIO()
    qr_img.save(buffered, format="PNG")
    qr_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return jsonify({
        "group_id": group.id,
        "qr_url": qr_url,
        "qr_image_base64": qr_base64,
        "join_code": join_code,
        "member_token": member_token
    }), 201


@bp.route('/join', methods=['POST'])
def join_group():
    data = request.json
    group_id = data.get('group_id')
    name = data.get('name')

    if not group_id or not name:
        return jsonify({"error": "Group ID and name are required"}), 400

    group = Group.query.filter_by(id=group_id, is_active=True).first()
    if not group or group.expires_at < datetime.utcnow():
        return jsonify({"error": "Invalid or expired group"}), 400

    if GroupMember.query.filter_by(group_id=group.id, name=name).first():
        return jsonify({"error": "Name already taken"}), 400

    member_token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    member = GroupMember(group_id=group.id, name=name, member_token=member_token)
    db.session.add(member)
    db.session.commit()
    return jsonify({"member_token": member_token, "group_id": group.id})


@bp.route('/status', methods=['GET'])
def group_status():
    group_id = request.args.get('group_id')
    member_token = request.args.get('member_token')
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    # If member_token is provided, check membership
    if member_token:
        member = GroupMember.query.filter_by(group_id=group.id, member_token=member_token).first()
        if not member:
            return jsonify({"error": "Invalid member token"}), 403

    members = [{"id": m.id, "name": m.name} for m in group.members]
    return jsonify({
        "group_id": group.id,
        "is_active": group.is_active,
        "expires_at": group.expires_at.isoformat(),
        "members": members,
        "creator_id": group.creator_id
    })

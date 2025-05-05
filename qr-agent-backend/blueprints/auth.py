from flask import Blueprint, request, jsonify
from itsdangerous import URLSafeTimedSerializer
from models import db, User
from services.auth import send_otp, verify_otp, authenticate_admin, authenticate_superadmin
from flask_jwt_extended import create_access_token
bp = Blueprint('auth', __name__)


# --------------------------
# Phone/OTP Auth (Customers)
# --------------------------
@bp.route('/request-otp', methods=['POST'])
def request_otp():
    phone = request.json.get('phone')
    if not phone:
        return jsonify({"error": "Phone number required"}), 400

    if send_otp(phone):
        return jsonify({"message": "OTP sent successfully"}), 200
    return jsonify({"error": "Failed to send OTP"}), 500


@bp.route('/verify-otp', methods=['POST'])
def verify_otp_route():
    phone = request.json.get('phone')
    otp = request.json.get('otp')

    if not phone or not otp:
        return jsonify({"error": "Phone and OTP required"}), 400

    if verify_otp(phone, otp):
        user = User.query.filter_by(phone=phone).first()
        token = create_access_token(identity={"id": user.id, "role": user.role})
        return jsonify({"token": token}), 200
    return jsonify({"error": "Invalid OTP"}), 401


# --------------------------
# Email/Password Auth (Admins)
# --------------------------
@bp.route('/org-admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password required"}), 400

    token = authenticate_admin(data['email'], data['password'])
    if token:
        return jsonify({"org_admin_token": token}), 200
    return jsonify({"error": "Invalid email or password"}), 401

@bp.route('/superadmin/login', methods=['POST'])
def superadmin_login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password required"}), 400

    token = authenticate_superadmin(data['email'], data['password'])
    if token:
        return jsonify({"superadmin_token": token}), 200
    return jsonify({"error": "Invalid email or password"}), 401

# --------------------------
# Password Reset Flow
# --------------------------
@bp.route('/admin/request-password-reset', methods=['POST'])
def request_password_reset():
    email = request.json.get('email')
    if not email:
        return jsonify({"error": "Email required"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
        token = serializer.dumps(email, salt='password-reset')

        # In production: Send email with Flask-Mail here
        reset_link = f"https://yourdomain.com/reset-password?token={token}"
        print(f"Dev Mode - Reset Link: {reset_link}")  # Remove in production

    return jsonify({"message": "If email exists, reset link sent"}), 200


@bp.route('/admin/reset-password', methods=['POST'])
def reset_password():
    token = request.json.get('token')
    new_password = request.json.get('new_password')

    if not token or not new_password:
        return jsonify({"error": "Token and new password required"}), 400

    try:
        serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
        email = serializer.loads(token, salt='password-reset', max_age=3600)  # 1hr expiry
    except Exception as e:
        return jsonify({"error": "Invalid/expired token"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        user.set_password(new_password)
        db.session.commit()
        return jsonify({"message": "Password updated"}), 200
    return jsonify({"error": "User not found"}), 404

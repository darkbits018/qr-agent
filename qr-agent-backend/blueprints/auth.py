from datetime import datetime
from flask import Blueprint, request, jsonify
from itsdangerous import URLSafeTimedSerializer
from twilio.rest import Client
from blueprints.utils import validate_phone
from config import Config
from models import db, User
from models.customer import Customer
from services.auth import send_otp, verify_otp, authenticate_admin, authenticate_superadmin, authenticate_staff
from flask_jwt_extended import create_access_token

bp = Blueprint('auth', __name__)

# --------------------------
# Phone/OTP Auth (Customers)
# --------------------------
bp = Blueprint('auth', __name__)


@bp.route('/request-otp', methods=['POST'])
def request_otp():
    """
        Request OTP for phone number verification.
        ---
        tags:
          - Authentication
        parameters:
          - name: body
            in: body
            required: true
            schema:
              type: object
              properties:
                phone:
                  type: string
                  example: "+1234567890"
                name:
                  type: string
                  example: "John Doe"
        responses:
          200:
            description: OTP sent successfully.
          400:
            description: Phone number and name are required or invalid phone format.
          500:
            description: Internal server error.
        """
    phone = request.json.get('phone')
    name = request.json.get('name')  # Get the name from the request

    if not phone or not name:
        return jsonify({"error": "Phone number and name are required"}), 400

    # Validate phone format if needed
    if not validate_phone(phone):
        return jsonify({"error": "Invalid phone format"}), 400

    client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)

    try:
        # Create or update customer
        customer = Customer.query.filter_by(phone=phone).first()
        if not customer:
            customer = Customer(phone=phone, name=name)
            db.session.add(customer)
        else:
            customer.name = name  # Update name if it already exists
        db.session.commit()

        # Send OTP
        client.verify \
            .v2 \
            .services(Config.TWILIO_VERIFY_SERVICE_SID) \
            .verifications \
            .create(to=phone, channel='sms')

        return jsonify({"message": "OTP sent successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@bp.route('/verify-otp', methods=['POST'])
def verify_otp_route():
    """
        Verify OTP for phone number authentication.
        ---
        tags:
          - Authentication
        parameters:
          - name: body
            in: body
            required: true
            schema:
              type: object
              properties:
                phone:
                  type: string
                  example: "+1234567890"
                otp:
                  type: string
                  example: "123456"
        responses:
          200:
            description: OTP verified successfully, returns a token.
          400:
            description: Phone and OTP are required.
          401:
            description: Invalid OTP.
          404:
            description: Customer not found.
          500:
            description: Internal server error.
        """
    phone = request.json.get('phone')
    otp = request.json.get('otp')
    organization_id = request.json.get('organization_id')
    table_id = request.json.get('table_id')

    if not phone or not otp:
        return jsonify({"error": "Phone and OTP required"}), 400

    client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)

    try:
        verification_check = client.verify \
            .v2 \
            .services(Config.TWILIO_VERIFY_SERVICE_SID) \
            .verification_checks \
            .create(to=phone, code=otp)

        if verification_check.status == 'approved':
            customer = Customer.query.filter_by(phone=phone).first()
            if not customer:
                return jsonify({"error": "Customer not found"}), 404

            customer.last_login = datetime.utcnow()
            db.session.commit()

            # Add org and table to JWT if provided
            token_payload = {
                "id": customer.id,
                "role": "customer",
                "phone": customer.phone,
                "name": customer.name
            }
            if organization_id:
                token_payload["organization_id"] = organization_id
            if table_id:
                token_payload["table_id"] = table_id

            token = create_access_token(identity=token_payload)

            return jsonify({
                "message": "OTP verified successfully",
                "token": token
            }), 200
        else:
            return jsonify({"error": "Invalid OTP"}), 401
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# --------------------------
# Email/Password Auth (Admins)
# --------------------------
@bp.route('/org-admin/login', methods=['POST'])
def admin_login():
    """
        Admin Login
        ---
        tags:
          - Authentication
        parameters:
          - name: body
            in: body
            required: true
            schema:
              type: object
              properties:
                email:
                  type: string
                  example: "admin@example.com"
                password:
                  type: string
                  example: "password123"
        responses:
          200:
            description: Returns an org admin token
          400:
            description: Email and password required
          401:
            description: Invalid email or password
        """
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password required"}), 400

    token = authenticate_admin(data['email'], data['password'])
    if token:
        return jsonify({"org_admin_token": token}), 200
    return jsonify({"error": "Invalid email or password"}), 401


@bp.route('/superadmin/login', methods=['POST'])
def superadmin_login():
    """
        Superadmin Login
        ---
        tags:
          - Authentication
        parameters:
          - name: body
            in: body
            required: true
            schema:
              type: object
              properties:
                email:
                  type: string
                  example: "superadmin@example.com"
                password:
                  type: string
                  example: "password123"
        responses:
          200:
            description: Returns a superadmin token
          400:
            description: Email and password required
          401:
            description: Invalid email or password
        """
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password required"}), 400

    token = authenticate_superadmin(data['email'], data['password'])
    if token:
        return jsonify({"superadmin_token": token}), 200
    return jsonify({"error": "Invalid email or password"}), 401


@bp.route('/staff-login', methods=['POST'])
def staff_login():
    """
        Staff Login
        ---
        tags:
          - Authentication
        parameters:
          - name: body
            in: body
            required: true
            schema:
              type: object
              properties:
                email:
                  type: string
                  example: "staff@example.com"
                password:
                  type: string
                  example: "password123"
        responses:
          200:
            description: Returns a staff token
          400:
            description: Email and password required
          401:
            description: Invalid email or password
    """
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password required"}), 400

    # Implement authenticate_staff similar to authenticate_admin
    token = authenticate_staff(data['email'], data['password'])
    if token:
        return jsonify({"staff_token": token}), 200
    return jsonify({"error": "Invalid email or password"}), 401


# --------------------------
# Password Reset Flow
# --------------------------
@bp.route('/admin/request-password-reset', methods=['POST'])
def request_password_reset():
    # request_password_reset
    """
    Request Password Reset
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
              example: "admin@example.com"
    responses:
      200:
        description: If email exists, reset link sent
      400:
        description: Email required
    """
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
    """
       Reset Password
       ---
       tags:
         - Authentication
       parameters:
         - name: body
           in: body
           required: true
           schema:
             type: object
             properties:
               token:
                 type: string
                 example: "your_token_here"
               new_password:
                 type: string
                 example: "newpassword123"
       responses:
         200:
           description: Password updated successfully
         400:
           description: Token and new password required or invalid/expired token
         404:
           description: User not found
       """
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


# --------------------------
# Logout
# --------------------------


from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

# In-memory blacklist for demonstration (use Redis or DB in production)
jwt_blacklist = set()


@bp.route('/logout', methods=['POST'])
@jwt_required()
def customer_logout():
    jti = get_jwt()['jti']
    jwt_blacklist.add(jti)
    return jsonify({"message": "Customer logged out"}), 200


@bp.route('/org-admin/logout', methods=['POST'])
@jwt_required()
def org_admin_logout():
    identity = get_jwt_identity()
    if identity.get('role') != 'org_admin':
        return jsonify({"error": "Unauthorized"}), 403
    jti = get_jwt()['jti']
    jwt_blacklist.add(jti)
    return jsonify({"message": "Org admin logged out"}), 200


@bp.route('/superadmin/logout', methods=['POST'])
@jwt_required()
def superadmin_logout():
    identity = get_jwt_identity()
    if identity.get('role') != 'superadmin':
        return jsonify({"error": "Unauthorized"}), 403
    jti = get_jwt()['jti']
    jwt_blacklist.add(jti)
    return jsonify({"message": "Superadmin logged out"}), 200

from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity


def admin_required(roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            current_user = get_jwt_identity()
            if current_user['role'] not in roles:
                return jsonify({"error": "Unauthorized"}), 403
            return fn(*args, **kwargs)

        return decorator

    return wrapper


# Add this to qr-agent-backend/blueprints/utils.py
import qrcode
from io import BytesIO
import base64


def generate_qr_code(url: str) -> str:
    """Generates a QR code and returns a base64-encoded data URL."""
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffered = BytesIO()
    img.save(buffered, format="PNG")

    return f"data:image/png;base64,{base64.b64encode(buffered.getvalue()).decode()}"


def org_admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user['role'] != 'org_admin':
            return jsonify({"error": "Organization admin required"}), 403
        return fn(*args, **kwargs)

    return wrapper


def validate_phone(phone):
    import re
    # Simple regex for validating phone numbers (adjust as needed)
    phone_regex = r'^\+?[1-9]\d{1,14}$'
    return re.match(phone_regex, phone) is not None


# utils.py
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from functools import wraps


def role_required(roles):
    """
    Decorator to restrict access to users with specific roles.
    :param roles: List of allowed roles
    """

    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            user = get_jwt_identity()
            if not user or user.get('role') not in roles:
                return jsonify({"error": "Access forbidden: insufficient role"}), 403
            return f(*args, **kwargs)

        return wrapped

    return decorator

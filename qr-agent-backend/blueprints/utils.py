from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify

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


import os
from werkzeug.utils import secure_filename


def save_qr_code(qr_code, filename, folder='static/qr_codes'):
    """Saves QR code image to specified folder"""
    os.makedirs(folder, exist_ok=True)
    filepath = os.path.join(folder, filename)
    qr_code.save(filepath)
    return filepath

def org_admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user['role'] != 'org_admin':
            return jsonify({"error": "Organization admin required"}), 403
        return fn(*args, **kwargs)

    return wrapper

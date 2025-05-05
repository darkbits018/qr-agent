from flask import Blueprint

bp = Blueprint('customer', __name__)

@bp.route('/example')
def example():
    return "Example route in customer blueprint"
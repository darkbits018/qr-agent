from flask import Blueprint

bp = Blueprint('kitchen', __name__)

@bp.route('/example')
def example():
    return "Example route in kitchen blueprint"
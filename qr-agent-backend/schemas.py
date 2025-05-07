from marshmallow import Schema, fields, validate, EXCLUDE
from datetime import datetime


# --------------------------
# Authentication
# --------------------------
class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    role = fields.Str(validate=validate.OneOf(['superadmin', 'org_admin', 'customer']))
    is_active = fields.Bool(dump_default=True)
    created_at = fields.DateTime(dump_only=True)


# --------------------------
# Organizations (Hotels/Restaurants)
# --------------------------
class OrganizationSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    admin_id = fields.Int(required=True)  # Explicitly include
    is_active = fields.Bool(dump_default=True)
    created_at = fields.DateTime(dump_only=True)
    admin_email = fields.Email(required=True)
    admin_password = fields.Str(required=True, validate=validate.Length(min=8))
    admin_role = fields.Str(validate=validate.OneOf(['org_admin']))
    admin = fields.Nested('UserSchema', only=('id', 'email'))


# --------------------------
# Menu System
# --------------------------
class MenuSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(max=50))
    organization_id = fields.Int(required=True)
    is_active = fields.Bool(dump_default=True)


class MenuItemSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(max=100))
    description = fields.Str()
    price = fields.Float(required=True, validate=validate.Range(min=0))
    image_url = fields.Url()
    organization_id = fields.Int(required=True)
    category = fields.Str(validate=validate.OneOf(['appetizer', 'main', 'dessert', 'beverage']))
    dietary_preference = fields.Str(validate=validate.OneOf([
        'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'none'
    ]))
    available_times = fields.Str(validate=validate.OneOf([
        'breakfast', 'lunch', 'dinner', 'all-day'
    ]))
    is_available = fields.Bool(dump_default=True)


# --------------------------
# Tables & QR Codes
# --------------------------
class TableSchema(Schema):
    id = fields.Int(dump_only=True)
    number = fields.Str(required=True)  # e.g. "Table 1"
    qr_code = fields.Str(dump_only=True)  # Auto-generated
    qr_image_url = fields.Method("get_qr_url")  # Derived field
    organization_id = fields.Int(required=True)
    is_occupied = fields.Bool(dump_default=False)

    def get_qr_url(self, obj):
        return f"/static/qr_codes/table_{obj.id}.png"


# --------------------------
# Orders & Payments
# --------------------------
class OrderItemSchema(Schema):
    id = fields.Int(dump_only=True)
    menu_item_id = fields.Int(required=True)
    quantity = fields.Int(validate=validate.Range(min=1))
    special_requests = fields.Str()


class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    customer_id = fields.Int(dump_only=True)  # Set from JWT
    table_id = fields.Int(required=True)
    status = fields.Str(validate=validate.OneOf(['pending', 'preparing', 'ready', 'served']))
    items = fields.Nested(OrderItemSchema, many=True, required=True)
    total_amount = fields.Float(dump_only=True)  # Calculated server-side
    created_at = fields.DateTime(dump_only=True)


class PaymentSchema(Schema):
    id = fields.Int(dump_only=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0))
    method = fields.Str(validate=validate.OneOf(['credit_card', 'upi', 'cash']))
    transaction_id = fields.Str()
    status = fields.Str(validate=validate.OneOf(['pending', 'completed', 'failed']))


# --------------------------
# Feedback
# --------------------------
class FeedbackSchema(Schema):
    id = fields.Int(dump_only=True)
    rating = fields.Int(validate=validate.Range(min=1, max=5))
    comment = fields.Str(validate=validate.Length(max=500))
    created_at = fields.DateTime(dump_only=True)


class AdminLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    organization_id = fields.Int(required=True)

from twilio.rest import Client
from config import Config
from models import db, User
from datetime import datetime, timedelta
import random
from flask_jwt_extended import create_access_token
from models import User
from datetime import timedelta
from models import Organization

client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)


def send_otp(phone):
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))

    # Save OTP to user in database
    user = User.query.filter_by(phone=phone).first()
    if not user:
        user = User(phone=phone, role='customer')
        db.session.add(user)

    user.otp = otp
    user.otp_expiry = datetime.utcnow() + timedelta(minutes=5)  # OTP expires in 5 mins
    db.session.commit()

    # Send OTP via Twilio SMS
    try:
        message = client.messages.create(
            body=f'Your OTP is: {otp}',
            from_=Config.TWILIO_PHONE_NUMBER,
            to=phone
        )
        return True
    except Exception as e:
        print(f"Twilio error: {e}")
        return False


def verify_otp(phone, otp):
    user = User.query.filter_by(phone=phone).first()
    if user and user.otp == otp and user.otp_expiry > datetime.utcnow():
        user.otp = None  # Invalidate OTP after successful verification
        db.session.commit()
        return True
    return False


def authenticate_admin(email, password):
    user = User.query.filter_by(email=email).filter(User.role.in_(['org_admin', 'superadmin'])).first()
    if user and user.check_password(password):
        # Fetch the organization_id from the Organization model
        organization = Organization.query.filter_by(admin_id=user.id).first()
        organization_id = organization.id if organization else None

        # Debugging: Print the organization_id
        print(f"Organization ID: {organization_id}")

        # Ensure organization_id is included in the token
        return create_access_token(
            identity={
                'id': str(user.id),  # Convert to string
                'role': str(user.role),  # Convert to string
                'org_id': str(organization_id) if organization_id else None
            },
            expires_delta=timedelta(hours=12)
        )
    return None


def authenticate_superadmin(email, password):
    user = User.query.filter_by(email=email, role='superadmin').first()
    if user and user.check_password(password):
        return create_access_token(
            identity={
                'id': str(user.id),  # Convert to string
                'role': str(user.role)  # Convert to string
            },
            expires_delta=timedelta(hours=12)
        )
    return None


def authenticate_staff(email, password):
    staff = User.query.filter_by(email=email, role='staff').first()
    if staff and staff.check_password(password):
        return create_access_token(identity={
            "id": staff.id,
            "role": "staff",
            "email": staff.email,
            "org_id": staff.organization_id
        })
    return None
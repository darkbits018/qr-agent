from dotenv import load_dotenv
import os

load_dotenv()  # Load .env file


class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DB_URI', 'sqlite:///qr_orders.db')  # Fallback to SQLite
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Auth
    JWT_SECRET_KEY = os.environ['JWT_SECRET_KEY']  # Raises error if missing
    OTP_EXPIRY_MINUTES = int(os.getenv('OTP_EXPIRY_MINUTES', 5))

    # Payments
    RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
    RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')
    STRIPE_API_KEY = os.getenv('STRIPE_API_KEY')

    # SMS
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
    TWILIO_VERIFY_SERVICE_SID = os.getenv('TWILIO_VERIFY_SERVICE_SID')

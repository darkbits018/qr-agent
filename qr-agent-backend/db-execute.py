import os
from app import create_app
from models import db, User

def add_superadmins():
    db_uri = os.getenv('DB_URI') or os.getenv('DATABASE_URL')
    jwt_secret = os.getenv('JWT_SECRET_KEY', 'test-secret-key')

    if not db_uri:
        raise RuntimeError('Database URI not set in environment variables.')

    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['JWT_SECRET_KEY'] = jwt_secret

    with app.app_context():
        # Create superadmin 1
        sa1 = User(
            email='afnan@superadmin.com',
            role='superadmin',
            is_active=True
        )
        sa1.set_password('superadminpass1')

        # Create superadmin 2
        sa2 = User(
            email='abhay@superadmin.com',
            role='superadmin',
            is_active=True
        )
        sa2.set_password('superadminpass2')
        sa3 = User(
            email='superadmin@example.com',
            role='superadmin',
            is_active=True
        )
        sa3.set_password('securepassword123')

        db.session.add(sa1)
        db.session.add(sa2)
        db.session.add(sa3)
        db.session.commit()
        print("Added 2 superadmins.")

if __name__ == '__main__':
    add_superadmins()
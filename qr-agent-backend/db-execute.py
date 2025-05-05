from app import app, db
from models import User, Organization  # Import all your models

with app.app_context():
    # Create a superadmin
    admin = User(
        email="superadmin@example.com",
        role="superadmin",
    )
    admin.set_password("securepassword123")
    db.session.add(admin)

    db.session.commit()
    print("Test data added!")
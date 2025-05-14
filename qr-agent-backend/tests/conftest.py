import os

import pytest
from flask_jwt_extended import create_access_token
from app import create_app
from models import User, Organization, MenuItem, Table, Customer
from models import db as _db


@pytest.fixture(scope='session')
def app():
    """Create and configure a new app instance for each test session."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('TEST_DB_URI')
    app.config['JWT_SECRET_KEY'] = '1a34d77e9710d1e69076922d507c504f98411d5a7a91785bf3ec7c6d9e11d7b2'

    with app.app_context():
        yield app


@pytest.fixture(scope='session')
def db(app):
    """Create database for the tests."""
    _db.app = app
    _db.create_all()

    yield _db

    _db.drop_all()


@pytest.fixture(scope='function')
def client(app, db):
    """Create a test client for the app."""
    with app.test_client() as client:
        with app.app_context():
            yield client


@pytest.fixture(scope='function')
def init_db(db):
    """Initialize test data."""
    # Create test superadmin
    superadmin = User(
        email='superadmin@test.com',
        role='superadmin',
        is_active=True
    )
    superadmin.set_password('superadmin123')
    db.session.add(superadmin)
    db.session.flush()  # Ensure superadmin gets an ID

    # Create test org admin
    org_admin = User(
        email='admin@test.com',
        role='org_admin',
        is_active=True
    )
    org_admin.set_password('admin123')
    db.session.add(org_admin)
    db.session.flush()  # Ensure org_admin gets an ID

    # Now create organization with the admin_id set
    org = Organization(
        name='Test Restaurant',
        admin_id=org_admin.id,  # Make sure this is set
        is_active=True
    )
    db.session.add(org)

    # Create test menu items
    menu_items = [
        MenuItem(
            name='Margherita Pizza',
            price=9.99,
            organization_id=org.id,
            category='main',
            dietary_preference='vegetarian',
            is_available=True
        ),
        MenuItem(
            name='Pepperoni Pizza',
            price=11.99,
            organization_id=org.id,
            category='main',
            is_available=True
        )
    ]
    db.session.add_all(menu_items)

    # Create test tables
    tables = [
        Table(
            number='Table 1',
            qr_code_url='test-url-1',
            organization_id=org.id
        ),
        Table(
            number='Table 2',
            qr_code_url='test-url-2',
            organization_id=org.id
        )
    ]
    db.session.add_all(tables)

    # Create test customer
    customer = Customer(
        phone='+1234567890',
        name='Test Customer'
    )
    db.session.add(customer)

    db.session.commit()

    yield db

    db.session.rollback()


@pytest.fixture
def superadmin_token(app):
    with app.app_context():
        token = create_access_token(identity={
            'id': 1,
            'role': 'superadmin'
        })
        return token


@pytest.fixture
def org_admin_token(app, init_db):
    with app.app_context():
        token = create_access_token(identity={
            'id': 2,
            'role': 'org_admin',
            'org_id': 1
        })
        return token


@pytest.fixture
def customer_token(app, init_db):
    with app.app_context():
        token = create_access_token(identity={
            'id': 1,
            'role': 'customer',
            'phone': '+1234567890'
        })
        return token

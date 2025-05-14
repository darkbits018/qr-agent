import allure
import pytest
import json
from models import User, Customer
from datetime import datetime, timedelta


@allure.feature("Authentication")
class TestAuthBlueprint:
    @allure.story("Customer OTP Flow")
    def test_request_otp_new_customer(self, client, db):
        with allure.step("Request OTP for new customer"):
            response = client.post('/request-otp', json={
                'phone': '+1234567891',
                'name': 'New Customer'
            })
            assert response.status_code == 200
            assert response.json['message'] == 'OTP sent successfully'

            # Verify customer was created
            customer = Customer.query.filter_by(phone='+1234567891').first()
            assert customer is not None
            assert customer.name == 'New Customer'

    @allure.story("Admin Login")
    def test_admin_login(self, client, init_db):
        with allure.step("Successful admin login"):
            response = client.post('/org-admin/login', json={
                'email': 'admin@test.com',
                'password': 'admin123'
            })
            assert response.status_code == 200
            assert 'org_admin_token' in response.json

    @allure.story("Superadmin Login")
    def test_superadmin_login(self, client, init_db):
        with allure.step("Successful superadmin login"):
            response = client.post('/superadmin/login', json={
                'email': 'superadmin@test.com',
                'password': 'superadmin123'
            })
            assert response.status_code == 200
            assert 'superadmin_token' in response.json

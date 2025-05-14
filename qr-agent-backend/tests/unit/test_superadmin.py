import pytest
import json
import allure
from models import Organization, User


@allure.feature("Superadmin Operations")
class TestSuperadminBlueprint:
    @allure.story("Organization CRUD")
    def test_organization_crud(self, client, init_db, superadmin_token):
        """Test creating, reading, updating, and deleting organizations"""
        headers = {'Authorization': f'Bearer {superadmin_token}'}

        # Create organization
        response = client.post('/api/superadmin/organizations', json={
            'name': 'New Org',
            'admin_email': 'newadmin@test.com',
            'admin_password': 'admin123'
        }, headers=headers)
        assert response.status_code == 201
        org_id = response.json['organization']['id']

        # List organizations
        response = client.get('/api/superadmin/organizations', headers=headers)
        assert response.status_code == 200
        assert any(org['name'] == 'New Org' for org in response.json)

        # Update organization
        response = client.put(f'/api/superadmin/organizations/{org_id}', json={
            'name': 'Updated Org',
            'is_active': False
        }, headers=headers)
        assert response.status_code == 200
        assert response.json['name'] == 'Updated Org'
        assert response.json['is_active'] is False

        # Delete (deactivate) organization
        response = client.delete(f'/api/superadmin/organizations/{org_id}', headers=headers)
        assert response.status_code == 200
        assert Organization.query.get(org_id).is_active is False

    @allure.story("Admin Management")
    def test_admin_management(self, client, init_db, superadmin_token):
        """Test creating and managing admin users"""
        headers = {'Authorization': f'Bearer {superadmin_token}'}

        # Create admin
        response = client.post('/api/superadmin/admins', json={
            'email': 'newadmin2@test.com',
            'role': 'org_admin',
            'password': 'admin123',
            'organization_id': 1
        }, headers=headers)
        assert response.status_code == 201
        admin_id = response.json['id']

        # List admins
        response = client.get('/api/superadmin/admins', headers=headers)
        assert response.status_code == 200
        assert any(admin['email'] == 'newadmin2@test.com' for admin in response.json)

        # Update admin
        response = client.put(f'/api/superadmin/admins/{admin_id}', json={
            'role': 'org_admin',
            'is_active': False
        }, headers=headers)
        assert response.status_code == 200
        assert response.json['is_active'] is False

        # Deactivate admin
        response = client.delete(f'/api/superadmin/admins/{admin_id}', headers=headers)
        assert response.status_code == 200
        assert User.query.get(admin_id).is_active is False

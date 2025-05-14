import pytest
import json
import allure
from models import MenuItem, Table
import io
import pandas as pd


@allure.feature("Organization Management")
class TestOrganizationBlueprint:
    @allure.story("Menu Item Management")
    def test_menu_item_crud(self, client, init_db, org_admin_token):
        """Test creating, updating, and deleting menu items"""
        headers = {'Authorization': f'Bearer {org_admin_token}'}

        # Create menu item
        response = client.post('/api/organizations/menu/items', json={
            'name': 'New Item',
            'price': 10.99,
            'category': 'main',
            'dietary_preference': 'vegetarian'
        }, headers=headers)
        assert response.status_code == 201
        item_id = response.json['id']

        # Update menu item
        response = client.put(f'/api/organizations/menu/items/{item_id}', json={
            'price': 12.99,
            'is_available': False
        }, headers=headers)
        assert response.status_code == 200
        assert response.json['price'] == 12.99
        assert response.json['is_available'] is False

        # Delete menu item
        response = client.delete(f'/api/organizations/menu/items/{item_id}', headers=headers)
        assert response.status_code == 200
        assert MenuItem.query.get(item_id) is None

    @allure.story("Bulk Menu Import")
    def test_bulk_menu_import(self, client, init_db, org_admin_token):
        """Test bulk importing menu items from Excel"""
        headers = {'Authorization': f'Bearer {org_admin_token}'}

        # Create test Excel file
        df = pd.DataFrame({
            'name': ['Imported Item 1', 'Imported Item 2'],
            'description': ['Desc 1', 'Desc 2'],
            'price': [9.99, 12.99],
            'image_url': [None, None],
            'category': ['main', 'dessert'],
            'dietary_preference': ['vegetarian', None],
            'available_times': ['all-day', 'dinner'],
            'is_vegetarian': [True, False],
            'is_available': [True, True]
        })

        # Save to BytesIO buffer
        buffer = io.BytesIO()
        df.to_excel(buffer, index=False)
        buffer.seek(0)

        # Send request
        response = client.post(
            '/api/organizations/menu/items/bulk',
            data={'file': (buffer, 'test.xlsx')},
            headers=headers,
            content_type='multipart/form-data'
        )
        assert response.status_code == 201
        assert '2 items imported' in response.json['message']
        assert MenuItem.query.filter(MenuItem.name.like('Imported Item%')).count() == 2

    @allure.story("Table Management")
    def test_table_operations(self, client, init_db, org_admin_token):
        """Test creating, listing, and deleting tables"""
        headers = {'Authorization': f'Bearer {org_admin_token}'}

        # Bulk create tables
        response = client.post('/api/organizations/tables/bulk', json={
            'count': 3
        }, headers=headers)
        assert response.status_code == 201
        assert len(response.json) == 3

        # Get all tables
        response = client.get('/api/organizations/tables', headers=headers)
        assert response.status_code == 200
        assert len(response.json) >= 3  # Including initial test data

        # Delete tables
        table_ids = [t['id'] for t in response.json]
        response = client.delete('/api/organizations/tables', json={
            'table_ids': table_ids[:2]
        }, headers=headers)
        assert response.status_code == 200
        assert response.json['deleted_count'] == 2

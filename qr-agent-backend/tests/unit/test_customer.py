import pytest
import json
import allure
from models import Order, OrderItem


@allure.feature("Customer Operations")
class TestCustomerBlueprint:
    @allure.story("Menu Access")
    def test_get_menu(self, client, init_db, customer_token):
        """Test getting menu for an organization"""
        headers = {'Authorization': f'Bearer {customer_token}'}
        response = client.get('/api/customer/menu?organization_id=1', headers=headers)
        assert response.status_code == 200
        assert len(response.json) > 0
        assert all(item['is_available'] for item in response.json)

    @allure.story("Cart Management")
    def test_cart_operations(self, client, init_db, customer_token):
        """Test adding, viewing, and removing items from cart"""
        headers = {'Authorization': f'Bearer {customer_token}'}

        # Add item to cart
        response = client.post('/api/customer/cart', json={
            'menu_item_id': 1,
            'quantity': 2,
            'table_id': 1,
            'organization_id': 1
        }, headers=headers)
        assert response.status_code == 201

        # View cart
        response = client.get('/api/customer/cart', headers=headers)
        assert response.status_code == 200
        assert len(response.json['items']) == 1
        assert response.json['items'][0]['quantity'] == 2

        # Remove item from cart
        item_id = response.json['items'][0]['id']
        response = client.delete(f'/api/customer/cart/{item_id}', headers=headers)
        assert response.status_code == 200

        # Verify cart is empty
        response = client.get('/api/customer/cart', headers=headers)
        assert len(response.json['items']) == 0

    @allure.story("Order Management")
    def test_order_workflow(self, client, init_db, customer_token):
        """Test placing and checking order status"""
        headers = {'Authorization': f'Bearer {customer_token}'}

        # Add item to cart
        client.post('/api/customer/cart', json={
            'menu_item_id': 1,
            'quantity': 1,
            'table_id': 1,
            'organization_id': 1
        }, headers=headers)

        # Place order
        response = client.post('/api/customer/order', json={
            'table_id': 1,
            'organization_id': 1
        }, headers=headers)
        assert response.status_code == 200
        order_id = response.json['order_id']

        # Check order status
        response = client.get(f'/api/customer/order/{order_id}', headers=headers)
        assert response.status_code == 200
        assert response.json['status'] == 'pending'
        assert len(response.json['items']) == 1

    @allure.story("Waiter Service")
    def test_call_waiter(self, client, init_db, customer_token):
        """Test calling waiter service"""
        headers = {'Authorization': f'Bearer {customer_token}'}
        response = client.post('/api/customer/waiter', json={
            'table_id': 1,
            'organization_id': 1,
            'message': 'Need water'
        }, headers=headers)
        assert response.status_code == 200
        assert 'Waiter has been notified' in response.json['message']

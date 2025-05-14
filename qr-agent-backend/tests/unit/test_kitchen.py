import pytest
import json
import allure
from datetime import datetime, timedelta
from models import Order, OrderItem, KitchenStation


@allure.feature("Kitchen Operations")
class TestKitchenBlueprint:
    @allure.story("Order Management")
    def test_get_kitchen_orders(self, client, init_db, org_admin_token):
        """Test retrieving kitchen orders"""
        headers = {'Authorization': f'Bearer {org_admin_token}'}

        # Create a test order
        order = Order(
            customer_id=1,
            table_id=1,
            status='pending',
            created_at=datetime.utcnow()
        )
        order_item = OrderItem(
            order=order,
            menu_item_id=1,
            quantity=1
        )
        db.session.add_all([order, order_item])
        db.session.commit()

        # Get kitchen orders
        response = client.get('/api/kitchen/orders', headers=headers)
        assert response.status_code == 200
        assert len(response.json) > 0
        assert any(o['status'] == 'pending' for o in response.json)

    @allure.story("Order Status Updates")
    def test_update_order_status(self, client, init_db, org_admin_token):
        """Test updating order status through workflow"""
        headers = {'Authorization': f'Bearer {org_admin_token}'}

        # Create a test order
        order = Order(
            customer_id=1,
            table_id=1,
            status='pending',
            created_at=datetime.utcnow()
        )
        db.session.add(order)
        db.session.commit()

        # Test status transitions
        transitions = [
            ('accepted', 200),
            ('preparing', 200),
            ('ready', 200),
            ('served', 200),
            ('completed', 200),
            ('invalid', 400)  # Invalid transition
        ]

        for status, expected_code in transitions:
            response = client.put(
                f'/api/kitchen/orders/{order.id}/status',
                json={'status': status},
                headers=headers
            )
            assert response.status_code == expected_code
            if expected_code == 200:
                assert response.json['new_status'] == status

    @allure.story("Kitchen Stations")
    def test_kitchen_stations(self, client, init_db, org_admin_token):
        """Test kitchen station operations"""
        headers = {'Authorization': f'Bearer {org_admin_token}'}

        # Create a test station
        station = KitchenStation(
            name='Test Station',
            organization_id=1,
            capacity=2
        )
        db.session.add(station)
        db.session.commit()

        # Get stations
        response = client.get('/api/kitchen/stations', headers=headers)
        assert response.status_code == 200
        assert len(response.json) > 0
        assert any(s['name'] == 'Test Station' for s in response.json)

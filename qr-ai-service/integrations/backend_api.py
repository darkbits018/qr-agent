import requests


def fetch_menu(organization_id):
    response = requests.get(f"http://localhost:5000/api/customer/menu?organization_id={organization_id}")
    return response.json()


def place_order(table_id, organization_id, items):
    payload = {
        "table_id": table_id,
        "organization_id": organization_id,
        "items": items
    }
    response = requests.post("http://localhost:5000/api/customer/order", json=payload)
    return response.json()

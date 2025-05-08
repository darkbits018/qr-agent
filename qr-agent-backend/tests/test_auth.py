import requests
import pytest
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:5000"  # Update with your API base URL

def test_request_otp():
    url = f"{BASE_URL}/request-otp"
    payload = {"phone": "1234567890"}
    logger.info(f"Sending request to {url} with payload {payload}")
    response = requests.post(url, json=payload)
    logger.info(f"Received response: {response.json()}")
    assert response.status_code == 200
    assert "OTP sent successfully" in response.json().get("message", "")

def test_verify_otp():
    url = f"{BASE_URL}/verify-otp"
    payload = {"phone": "1234567890", "otp": "123456"}
    logger.info(f"Sending request to {url} with payload {payload}")
    response = requests.post(url, json=payload)
    logger.info(f"Received response: {response.json()}")
    assert response.status_code == 200
    assert "token" in response.json()

def test_admin_login():
    url = f"{BASE_URL}/org-admin/login"
    payload = {"email": "admin@example.com", "password": "password123"}
    logger.info(f"Sending request to {url} with payload {payload}")
    response = requests.post(url, json=payload)
    logger.info(f"Received response: {response.json()}")
    assert response.status_code == 200
    assert "org_admin_token" in response.json()

def test_superadmin_login():
    url = f"{BASE_URL}/superadmin/login"
    payload = {"email": "superadmin@example.com", "password": "password123"}
    logger.info(f"Sending request to {url} with payload {payload}")
    response = requests.post(url, json=payload)
    logger.info(f"Received response: {response.json()}")
    assert response.status_code == 200
    assert "superadmin_token" in response.json()

def test_request_password_reset():
    url = f"{BASE_URL}/admin/request-password-reset"
    payload = {"email": "admin@example.com"}
    logger.info(f"Sending request to {url} with payload {payload}")
    response = requests.post(url, json=payload)
    logger.info(f"Received response: {response.json()}")
    assert response.status_code == 200
    assert "If email exists, reset link sent" in response.json().get("message", "")

def test_reset_password():
    url = f"{BASE_URL}/admin/reset-password"
    payload = {"token": "valid_token_here", "new_password": "newpassword123"}
    logger.info(f"Sending request to {url} with payload {payload}")
    response = requests.post(url, json=payload)
    logger.info(f"Received response: {response.json()}")
    assert response.status_code == 200
    assert "Password updated" in response.json().get("message", "")

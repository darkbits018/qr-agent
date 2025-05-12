# QR Agent API Documentation

## Introduction

Welcome to the QR Agent API documentation. This API allows you to manage customers, orders, menus, and more for a
restaurant management system.

### Base URL

The base URL for all API requests is `https://api.qragent.com`.

### Authentication

All API requests require authentication. The API uses JWT (JSON Web Tokens) for authentication. You need to include the
token in the `Authorization` header of your requests.

## Authentication

### Phone/OTP Auth (Customers)

#### Request OTP

- **Endpoint:** `/request-otp`
- **Method:** `POST`
- **Description:** Requests an OTP to be sent to the provided phone number.
- **Request Body:**
  ```json
  {
    "phone": "string",
    "name": "string"
  }
  ```
- **Responses:**
    - **200:** `{"message": "OTP sent successfully"}`
    - **400:** `{"error": "Phone number and name are required"}`
    - **500:** `{"error": "Failed to send OTP"}`

#### Verify OTP

- **Endpoint:** `/verify-otp`
- **Method:** `POST`
- **Description:** Verifies the OTP sent to the provided phone number.
- **Request Body:**
  ```json
  {
    "phone": "string",
    "otp": "string"
  }
  ```
- **Responses:**
    - **200:** `{"token": "string"}`
    - **400:** `{"error": "Phone and OTP required"}`
    - **401:** `{"error": "Invalid OTP"}`

### Email/Password Auth (Admins)

#### Admin Login

- **Endpoint:** `/org-admin/login`
- **Method:** `POST`
- **Description:** Logs in an organization admin using email and password.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
    - **200:** `{"org_admin_token": "string"}`
    - **400:** `{"error": "Email and password required"}`
    - **401:** `{"error": "Invalid email or password"}`

#### Superadmin Login

- **Endpoint:** `/superadmin/login`
- **Method:** `POST`
- **Description:** Logs in a superadmin using email and password.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
    - **200:** `{"superadmin_token": "string"}`
    - **400:** `{"error": "Email and password required"}`
    - **401:** `{"error": "Invalid email or password"}`

### Password Reset Flow

#### Request Password Reset

- **Endpoint:** `/admin/request-password-reset`
- **Method:** `POST`
- **Description:** Requests a password reset link to be sent to the provided email.
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Responses:**
    - **200:** `{"message": "If email exists, reset link sent"}`
    - **400:** `{"error": "Email required"}`

#### Reset Password

- **Endpoint:** `/admin/reset-password`
- **Method:** `POST`
- **Description:** Resets the password using the provided token and new password.
- **Request Body:**
  ```json
  {
    "token": "string",
    "new_password": "string"
  }
  ```
- **Responses:**
    - **200:** `{"message": "Password updated"}`
    - **400:** `{"error": "Token and new password required"}`
    - **400:** `{"error": "Invalid/expired token"}`
    - **404:** `{"error": "User not found"}`

## Customer Blueprint

### Get Menu

- **Endpoint:** `/api/customer/menu`
- **Method:** `GET`
- **Description:** Retrieves the menu for a specific organization.
- **Query Parameters:**
    - `organization_id`: The ID of the organization.
- **Responses:**
    - **200:** `{"menu_items": [...]}`
    - **400:** `{"error": "Organization ID is required"}`

### Place Order

- **Endpoint:** `/api/customer/order`
- **Method:** `POST`
- **Description:** Places an order for a customer.
- **Request Body:**
  ```json
  {
    "items": [...],
    "table_id": "integer"
  }
  ```
- **Responses:**
    - **201:** `{"message": "Order placed successfully", "order_id": "integer"}`
    - **400:** `{"error": "Items and table ID are required"}`

### Get Order Status

- **Endpoint:** `/api/customer/order/<int:order_id>`
- **Method:** `GET`
- **Description:** Retrieves the status of a specific order.
- **Responses:**
    - **200:** `{"order_id": "integer", "status": "string"}`
    - **404:** `{"error": "Order not found"}`

### Add Item to Cart

- **Endpoint:** `/api/customer/cart`
- **Method:** `POST`
- **Description:** Adds an item to the customer's cart.
- **Request Body:**
  ```json
  {
    "menu_item_id": "integer",
    "quantity": "integer"
  }
  ```
- **Responses:**
    - **201:** `{"message": "Item added to cart"}`
    - **400:** `{"error": "Menu item ID and quantity are required"}`

### View Cart

- **Endpoint:** `/api/customer/cart`
- **Method:** `GET`
- **Description:** Retrieves the items in the customer's cart.
- **Responses:**
    - **200:** `{"cart_items": [...]}`

### Remove Item from Cart

- **Endpoint:** `/api/customer/cart/<int:item_id>`
- **Method:** `DELETE`
- **Description:** Removes an item from the customer's cart.
- **Responses:**
    - **200:** `{"message": "Item removed from cart"}`
    - **404:** `{"error": "Item not found in cart"}`

### Call Waiter

- **Endpoint:** `/api/customer/waiter`
- **Method:** `POST`
- **Description:** Notifies a waiter for a specific table.
- **Request Body:**
  ```json
  {
    "table_id": "integer"
  }
  ```
- **Responses:**
    - **200:** `{"message": "Waiter has been notified"}`
    - **400:** `{"error": "Table ID is required"}`
    - **404:** `{"error": "Table not found"}`

## Kitchen Blueprint

### Example Route

- **Endpoint:** `/example`
- **Method:** `GET`
- **Description:** Example route in the kitchen blueprint.
- **Responses:**
    - **200:** `"Example route in kitchen blueprint"`

## Organization Blueprint

### Menu Item Management

#### Create Menu Item

- **Endpoint:** `/api/organizations/menu/items`
- **Method:** `POST`
- **Description:** Creates a new menu item for the organization.
- **Request Body:**
  ```json
  {
    "name": "string",
    "price": "float",
    "category": "string",
    "dietary_preference": "string",
    "available_times": "string"
  }
  ```
- **Responses:**
    - **201:** `MenuItemSchema().dump(item)`
    - **403:** `{"error": "Unauthorized"}`

#### Get Menu Items

- **Endpoint:** `/api/organizations/menu/items`
- **Method:** `GET`
- **Description:** Retrieves all menu items for the organization.
- **Responses:**
    - **200:** `MenuItemSchema(many=True).dump(items)`
    - **403:** `{"error": "Unauthorized"}`

#### Manage Menu Item

- **Endpoint:** `/api/organizations/menu/items/<int:item_id>`
- **Method:** `PUT`, `DELETE`
- **Description:** Updates or deletes a menu item.
- **Request Body (PUT):**
  ```json
  {
    "name": "string",
    "price": "float",
    "category": "string",
    "dietary_preference": "string",
    "available_times": "string",
    "is_available": "boolean"
  }
  ```
- **Responses:**
    - **200 (PUT):** `MenuItemSchema().dump(item)`
    - **200 (DELETE):** `{"message": "Menu item deleted"}`
    - **403:** `{"error": "Unauthorized"}`

#### Bulk Import Menu Items

- **Endpoint:** `/api/organizations/menu/items/bulk`
- **Method:** `POST`
- **Description:** Bulk imports menu items from an Excel file.
- **Request Body:**
    - Form data with key `file` containing the Excel file.
- **Responses:**
    - **201:** `{"message": "X items imported"}`
    - **400:** `{"error": "Excel file required"}`
    - **400:** `{"error": "Only Excel files allowed"}`
    - **400:** `{"error": "Excel columns don't match required format"}`
    - **400:** `{"error": "Import failed: error message"}`

# Table/QR Management

## Bulk Create Tables

- **Endpoint:** `/tables/bulk`
- **Method:** `POST`
- **Authentication:** Requires JWT token with `org_admin` role.
- **Description:** Bulk creates tables for the organization.
- **Request Body:**
  ```json
  {
    "count": 5
  }
  ```
- **Responses:**
    - **201 Created:**
      ```json
      [
        {
          "id": 1,
          "number": "Table 1",
          "qr_code_url": "https://yourdomain.com/menu?org_id=1&table_id=1",
          "organization_id": 1
        }
      ]
      ```
    - **403 Forbidden:**
      ```json
      {
        "error": "Unauthorized"
      }
      ```

## Get Tables

- **Endpoint:** `/tables`
- **Method:** `GET`
- **Authentication:** Requires JWT token with `org_admin` role.
- **Description:** Retrieves all tables for the organization.
- **Responses:**
    - **200 OK:**
      ```json
      [
        {
          "id": 1,
          "number": "Table 1",
          "qr_code_url": "https://yourdomain.com/menu?org_id=1&table_id=1",
          "is_occupied": false
        }
      ]
      ```
    - **403 Forbidden:**
      ```json
      {
        "error": "Unauthorized"
      }
      ```

## Add Tables

- **Endpoint:** `/tables`
- **Method:** `POST`
- **Authentication:** Requires JWT token with `org_admin` role.
- **Description:** Adds one or multiple tables.
- **Request Body:**
  ```json
  {
    "tables": [
      {
        "number": "Table 1"
      }
    ]
  }
  ```
- **Responses:**
    - **201 Created:**
      ```json
      {
        "message": "1 table(s) created successfully",
        "tables": [
          {
            "id": 1,
            "number": "Table 1",
            "qr_code_url": "https://yourdomain.com/menu?org_id=1&table_id=1"
          }
        ]
      }
      ```
    - **400 Bad Request:**
      ```json
      {
        "error": "Must provide 'number' or 'tables' array"
      }
      ```

## Delete Tables

- **Endpoint:** `/tables`
- **Method:** `DELETE`
- **Authentication:** Requires JWT token with `org_admin` role.
- **Description:** Deletes tables - supports single, bulk, or all tables.
- **Request Body:**
  ```json
  {
    "table_ids": [1, 2]
  }
  ```
- **Responses:**
    - **200 OK:**
      ```json
      {
        "message": "2 table(s) deleted successfully",
        "deleted_count": 2
      }
      ```
    - **400 Bad Request:**
      ```json
      {
        "error": "Must provide 'table_id', 'table_ids', or 'delete_all: true'"
      }
      ```

## Superadmin Blueprint

### Organization CRUD

#### Create Organization

- **Endpoint:** `/api/superadmin/organizations`
- **Method:** `POST`
- **Description:** Creates a new organization with an admin.
- **Request Body:**
  ```json
  {
    "name": "string",
    "admin_email": "string",
    "admin_password": "string"
  }
  ```
- **Responses:**
    - **201:**
      `{"message": "Organization created successfully", "organization": OrganizationSchema().dump(org), "admin": {"id": "int", "email": "string", "new_account": "boolean"}}`
    - **400:** `{"error": "Missing required fields", "missing": "list"}`
    - **400:** `{"error": "Password must be at least 8 characters"}`
    - **400:** `{"error": "Invalid email format"}`
    - **500:** `{"error": "error message"}`

#### List Organizations

- **Endpoint:** `/api/superadmin/organizations`
- **Method:** `GET`
- **Description:** Lists all organizations.
- **Query Parameters:**
    - `is_active`: boolean (optional)
- **Responses:**
    - **200:** `OrganizationSchema(many=True).dump(orgs)`
    - **403:** `{"error": "Forbidden"}`

#### Get Organization

- **Endpoint:** `/api/superadmin/organizations/<int:org_id>`
- **Method:** `GET`
- **Description:** Retrieves a specific organization.
- **Responses:**
    - **200:** `OrganizationSchema().dump(org)`
    - **403:** `{"error": "Forbidden"}`

#### Update Organization

- **Endpoint:** `/api/superadmin/organizations/<int:org_id>`
- **Method:** `PUT`
- **Description:** Updates an organization.
- **Request Body:**
  ```json
  {
    "name": "string",
    "is_active": "boolean"
  }
  ```
- **Responses:**
    - **200:** `OrganizationSchema().dump(org)`
    - **403:** `{"error": "Forbidden"}`

#### Deactivate Organization

- **Endpoint:** `/api/superadmin/organizations/<int:org_id>`
- **Method:** `DELETE`
- **Description:** Deactivates an organization.
- **Responses:**
    - **200:** `{"message": "Organization deactivated"}`
    - **403:** `{"error": "Forbidden"}`

### Admin Management

#### Create Admin

- **Endpoint:** `/api/superadmin/admins`
- **Method:** `POST`
- **Description:** Creates a new admin.
- **Request Body:**
  ```json
  {
    "email": "string",
    "role": "string",
    "password": "string",
    "organization_id": "integer"
  }
  ```
- **Responses:**
    - **201:** `UserSchema().dump(admin)`
    - **400:** `{"error": "Required fields: list"}`
    - **400:** `{"error": "Invalid role"}`
    - **400:** `{"error": "User already exists"}`
    - **400:** `{"error": "organization_id is required for org_admin"}`
    - **400:** `{"error": "Invalid organization_id"}`

#### Get All Admins

- **Endpoint:** `/api/superadmin/admins`
- **Method:** `GET`
- **Description:** Retrieves all admins.
- **Query Parameters:**
    - `role`: string (optional)
- **Responses:**
    - **200:** `UserSchema(many=True).dump(admins)`
    - **403:** `{"error": "Forbidden"}`

#### Update Admin

- **Endpoint:** `/api/superadmin/admins/<int:admin_id>`
- **Method:** `PUT`
- **Description:** Updates an admin.
- **Request Body:**
  ```json
  {
    "role": "string",
    "is_active": "boolean"
  }
  ```
- **Responses:**
    - **200:** `UserSchema().dump(admin)`
    - **400:** `{"error": "Invalid role"}`
    - **403:** `{"error": "Forbidden"}`

#### Deactivate Admin

- **Endpoint:** `/api/superadmin/admins/<int:admin_id>`
- **Method:** `DELETE`
- **Description:** Deactivates an admin.
- **Responses:**
    - **200:** `{"message": "Admin deactivated"}`
    - **403:** `{"error": "Forbidden"}`

## Error Handling

### Common Error Responses

- **400 Bad Request:** The request was malformed or missing required parameters.
- **401 Unauthorized:** Authentication failed or user does not have permissions for the requested operation.
- **403 Forbidden:** The request was valid but the server is refusing action.
- **404 Not Found:** The requested resource could not be found.
- **500 Internal Server Error:** An unexpected error occurred on the server.

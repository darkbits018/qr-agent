# QR Agent Backend Documentation

## Authentication Blueprint

### Phone/OTP Auth (Customers)

#### Request OTP
- **Endpoint:** `/request-otp`
- **Method:** `POST`
- **Description:** Requests an OTP to be sent to the provided phone number.
- **Request Body:**
  ```json
  {
    "phone": "string"
  }
  ```
- **Responses:**
  - **200:** `{"message": "OTP sent successfully"}`
  - **400:** `{"error": "Phone number required"}`
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

### Example Route
- **Endpoint:** `/example`
- **Method:** `GET`
- **Description:** Example route in the customer blueprint.
- **Responses:**
  - **200:** `"Example route in customer blueprint"`

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

### Table/QR Management

#### Bulk Create Tables
- **Endpoint:** `/api/organizations/<int:org_id>/tables/bulk`
- **Method:** `POST`
- **Description:** Bulk creates tables for the organization.
- **Request Body:**
  ```json
  {
    "count": "integer"
  }
  ```
- **Responses:**
  - **201:** `TableSchema(many=True).dump(tables)`
  - **403:** `{"error": "Unauthorized"}`

#### Manage Table
- **Endpoint:** `/api/organizations/<int:org_id>/tables/<int:table_id>`
- **Method:** `GET`, `DELETE`
- **Description:** Retrieves or deletes a table.
- **Responses:**
  - **200 (GET):** `TableSchema().dump(table)`
  - **200 (DELETE):** `{"message": "Table deleted"}`
  - **403:** `{"error": "Unauthorized"}`

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
  - **201:** `{"message": "Organization created successfully", "organization": OrganizationSchema().dump(org), "admin": {"id": "int", "email": "string", "new_account": "boolean"}}`
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

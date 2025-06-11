# 📚 Comprehensive Developer Documentation for QR-Based Ordering System

---

## 🧭 Table of Contents

1. [Introduction](#introduction)
2. [System Overview](#system-overview)
3. [Target Audience](#target-audience)
4. [Technology Stack](#technology-stack)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Customer Flow](#customer-flow)
7. [API Endpoints](#api-endpoints)
    - [Customer Side](#customer-api)
    - [Organization Admin Side](#organization-admin-api)
    - [Superadmin Side](#superadmin-api)

---

## 1. Introduction

This document provides a **comprehensive technical guide** for developers working on the **QR-based restaurant/hotel
ordering system**. It includes:

- User flows
- API references
- AI assistant design
- Database schema
- Security practices
- Deployment instructions

The system allows users to scan a QR code at their table and place food orders via an intuitive interface or AI-powered
chatbot.

---

## 2. System Overview

### Key Features:

- **QR Code Scanning**: Directs users to digital menu.
- **Multi-language Support**
- **Order Tracking in Real-time**
- **Group Ordering**
- **Integrated AI Chatbot (Rasa + LLM Fallback)**
- **Admin Dashboard for Managing Menus, Orders, Tables, Staff**
- **Analytics & Reports**

---

## 3. Target Audience

- **Frontend Developers**: For building customer-facing UIs.
- **Backend Developers**: For maintaining Flask APIs and database logic.
- **AI Engineers**: For training and improving the Rasa agent.
- **DevOps Engineers**: For deploying and monitoring the application.

---

## 4. Technology Stack

| Layer         | Technology                                 |
|---------------|--------------------------------------------|
| Backend       | Python (Flask), SQLAlchemy                 |
| Auth          | JWT Extended                               |
| AI Agent      | Rasa NLU + Core, Gemini Pro (LLM fallback) |
| Database      | PostgreSQL / SQLite                        |
| Hosting       | Docker, Gunicorn, Nginx                    |
| Notifications | Twilio (SMS), WebSockets                   |
| Analytics     | Custom metrics using SQL aggregations      |

---

## 5. User Roles & Permissions

| Role                   | Description                        | Access Level                                      |
|------------------------|------------------------------------|---------------------------------------------------|
| **Customer**           | Regular user placing orders via QR | Read-only access to menus, own orders             |
| **Organization Admin** | Manages a single restaurant        | Full control over menus, tables, staff, analytics |
| **Superadmin**         | Manages multiple organizations     | Full access across all restaurants                |

---

## 6. Customer Flow

> 🧭 From scanning QR code to receiving food

### Step-by-Step Journey:

1. **Scan QR Code**
    - URL: `https://yourdomain.com/customer/join?org_id=1&table_id=5`
2. **Enter Phone Number**
    - OTP is sent via Twilio
3. **Verify OTP**
    - JWT token issued with:
        - `user_id`, `role="customer"`, `table_id`, `org_id`
4. **Access Menu or AI Assistant**
    - Option A: Browse full menu
    - Option B: Chat with AI bot
5. **Add Items to Cart**
    - Supports quantity, special requests
6. **Confirm Order**
    - Sent to kitchen dashboard
7. **Track Order Status**
    - Real-time updates:
        - Created → Accepted → Preparing → Ready → Served → Completed
8. **Request Bill**
    - Can be paid online or collected by waiter
9. **Leave Feedback**
    - Rating and optional comment

### Group Ordering Extension:

- One user creates group
- Others join using shared link or QR
- All contribute items to a shared cart
- Any member can confirm order

---

## 7. API Endpoints

---

### 🔹 Customer API

#### Authentication

- `POST /api/customer/send-otp` – Send OTP to phone number
- `POST /api/customer/verify-otp` – Verify OTP and get JWT

#### Group Management

- `POST /api/customer/group` – Create new group
- `POST /api/customer/group/join` – Join existing group
- `GET /api/customer/group/<group_id>` – View group members

#### Cart & Orders

- `POST /api/customer/cart/add` – Add item to cart
- `PUT /api/customer/cart/update` – Modify quantity
- `DELETE /api/customer/cart/remove` – Remove item
- `GET /api/customer/cart` – View cart contents
- `POST /api/customer/order/confirm` – Confirm and submit order
- `GET /api/customer/order/status/<order_id>` – Track status
- `GET /api/customer/orders/history` – View past orders
- `POST /api/customer/order/cancel` – Cancel current order

#### Menu Interaction

- `GET /api/customer/menu` – Browse full menu
- `GET /api/customer/menu/search` – Search menu items
- `GET /api/customer/menu?category=veg&dietary=vegetarian` – Filter menu

#### Waiter & Bill

- `POST /api/customer/waiter/call` – Call waiter
- `POST /api/customer/bill/request` – Request bill
- `POST /api/customer/bill/pay` – Pay bill (if integrated)

#### Feedback

- `POST /api/customer/feedback` – Submit rating and comment

---

### 🔹 Organization Admin API

#### Organization Management

- `POST /api/superadmin/organizations` – Create new org
- `GET /api/superadmin/organizations` – List all orgs
- `PUT /api/superadmin/organizations/<org_id>` – Update org
- `PUT /api/superadmin/organizations/<org_id>/deactivate` – Deactivate org

#### Staff Management

- `POST /api/superadmin/admins` – Add admin
- `GET /api/superadmin/admins` – List admins
- `PUT /api/superadmin/admins/<admin_id>` – Update admin
- `DELETE /api/superadmin/admins/<admin_id>` – Delete admin

#### Table Management

- `POST /api/org-admin/tables` – Add new table
- `GET /api/org-admin/tables` – List tables
- `GET /api/org-admin/table/<table_id>/qr` – Get QR image URL

#### Menu Management

- `POST /api/org-admin/menu` – Add menu item
- `PUT /api/org-admin/menu/<item_id>` – Update item
- `DELETE /api/org-admin/menu/<item_id>` – Delete item
- `GET /api/org-admin/menu` – List all items
- `POST /api/org-admin/menu/upload` – Bulk upload via Excel

#### Order Management

- `GET /api/org-admin/orders` – List all orders
- `GET /api/org-admin/order/<order_id>` – View details
- `PUT /api/org-admin/order/<order_id>/status` – Update status

#### Analytics

- `GET /api/org-admin/analytics/sales` – Daily sales report
- `GET /api/org-admin/analytics/popular` – Popular items
- `GET /api/org-admin/analytics/prep-time` – Avg prep time

#### Feedback

- `GET /api/org-admin/feedback` – View customer feedback

#### Notifications

- `POST /api/org-admin/notify` – Send message to customer

---

### 🔹 Superadmin API

- Full access to all organizations
- Admin management
- Global analytics
- Subscription plan management (future)

---


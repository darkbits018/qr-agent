# QR Agent - Restaurant Management System

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)

A comprehensive multi-role restaurant management system with QR code integration, real-time order tracking, and role-based access control.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

QR Agent is a modern restaurant management platform that streamlines operations across four distinct user roles: Customers, Kitchen Staff, Organization Admins, and Super Admins. The system provides real-time order management, inventory tracking, QR code-based table management, and comprehensive analytics.

### Key Capabilities

- **Multi-Role Architecture**: Supports different access levels and functionalities
- **Real-Time Operations**: Live order tracking and status updates
- **QR Code Integration**: Table management with dynamic QR code generation
- **Secure Authentication**: JWT-based authentication with persistent sessions
- **Modern UI/UX**: Responsive design built with React 18 and Tailwind CSS
- **Analytics Dashboard**: Real-time business metrics and reporting

## Features

### Role-Based Access Control

| Role | Access Level | Key Features |
|------|-------------|--------------|
| **Customer** | Public | Menu browsing, Chat-based ordering, Payment processing, Order tracking |
| **Kitchen Staff** | Staff | Order management, Inventory tracking, Recipe management, Status updates |
| **Organization Admin** | Admin | Staff management, Menu configuration, QR code generation, Analytics |
| **Super Admin** | System | Multi-org management, Admin provisioning, System analytics |

### Customer Experience
- Interactive chat interface for ordering
- Dynamic menu display with real-time availability
- Seamless payment processing
- Group ordering via QR code scanning
- Real-time order status tracking

### Kitchen Operations
- Real-time order queue management
- Automated inventory tracking with alerts
- Digital recipe management
- Order status communication system

### Administrative Tools
- Batch QR code generation for tables
- Role-based staff account creation
- Real-time analytics dashboard
- Dynamic menu management system

## Technologies

### Frontend Stack
- **React** 18.x - Modern React with hooks and concurrent features
- **TypeScript** 5.x - Type-safe development
- **Tailwind CSS** 3.4 - Utility-first CSS framework
- **Vite** 5.x - Fast build tool and development server
- **Framer Motion** - Smooth animations and transitions

### Key Libraries
- **Lucide React** - Beautiful icon set
- **Chart.js** - Data visualization and analytics
- **jsPDF** - PDF generation for QR codes
- **JWT Decode** - Token management
- **html2canvas** - Screenshot capabilities

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **TypeScript Compiler** - Type checking
- **Vite HMR** - Hot module replacement

## Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 1.22.0
- Git for version control

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/your-username/qr-agent.git
cd qr-agent
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```env
VITE_API_BASE_URL=https://---------/api
VITE_KITCHEN_API_URL=https://-----------/api/kitchen
VITE_JWT_SECRET=your-jwt-secret-key
VITE_PAYMENT_GATEWAY_URL=your-payment-gateway-url
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## Project Structure

```
afnan006-qr-agent1/
├── public/
│   └── assets/
│       └── fonts/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── pages/
│   │   └── RoleSelectionPage.jsx
│   ├── roles/
│   │   ├── customer/
│   │   │   ├── router.jsx
│   │   │   ├── api/
│   │   │   │   └── customerApi.jsx
│   │   │   ├── components/
│   │   │   │   ├── ChatInterface/
│   │   │   │   │   ├── AvatarSection.jsx
│   │   │   │   │   ├── CartDetailsList.jsx
│   │   │   │   │   ├── ChatNavbar.jsx
│   │   │   │   │   ├── DynamicSubtitleBubble.jsx
│   │   │   │   │   ├── InputSection.jsx
│   │   │   │   │   ├── MenuCarousel.jsx
│   │   │   │   │   ├── MessageBubble.jsx
│   │   │   │   │   ├── OrderedItemsList.jsx
│   │   │   │   │   ├── PaymentDetails.jsx
│   │   │   │   │   ├── TypingIndicator.jsx
│   │   │   │   │   └── VoicePulseOverlay.jsx
│   │   │   │   ├── EngagementQuiz/
│   │   │   │   │   └── QuizOverlay.jsx
│   │   │   │   ├── MenuCards/
│   │   │   │   │   ├── MenuCard.jsx
│   │   │   │   │   ├── MenuCarousel.jsx
│   │   │   │   │   └── MenuCategorySection.jsx
│   │   │   │   ├── PaymentPanel/
│   │   │   │   │   ├── CartSlideOver.jsx
│   │   │   │   │   └── PaymentModal.jsx
│   │   │   │   └── SharedComponents/
│   │   │   │       ├── AppShell.jsx
│   │   │   │       ├── ImageLoader.jsx
│   │   │   │       └── LoadingSpinner.jsx
│   │   │   ├── context/
│   │   │   │   ├── CartContext.jsx
│   │   │   │   ├── ChatContext.jsx
│   │   │   │   └── UserContext.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useOTPVerify.js
│   │   │   │   └── useQRScan.js
│   │   │   └── pages/
│   │   │       ├── ChatPage.jsx
│   │   │       ├── JoinGroupPage.jsx
│   │   │       ├── MenuPage.jsx
│   │   │       ├── NotFoundPage.jsx
│   │   │       ├── OrderModePage.jsx
│   │   │       ├── PaymentPage.jsx
│   │   │       └── WelcomePage.jsx
│   │   ├── kitchen/
│   │   │   ├── router.jsx
│   │   │   ├── api/
│   │   │   │   └── kitchenApi.js
│   │   │   ├── components/
│   │   │   │   ├── InventoryTable.jsx
│   │   │   │   ├── OrderCard.jsx
│   │   │   │   ├── OrderStatusBadge.jsx
│   │   │   │   ├── RecipeEditor.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── context/
│   │   │   │   └── KitchenContext.jsx
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Inventory.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── Recipes.jsx
│   │   │   │   └── Settings.jsx
│   │   │   └── styles/
│   │   │       └── theme.css
│   │   ├── orgadmin/
│   │   │   ├── router.jsx
│   │   │   ├── api/
│   │   │   │   └── orgadminApi.js
│   │   │   ├── components/
│   │   │   │   ├── MenuItemFormModal.jsx
│   │   │   │   ├── MenuItemTable.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── TableList.jsx
│   │   │   │   └── UploadExcelModal.jsx
│   │   │   ├── context/
│   │   │   │   └── OrgAdminAuthContext.jsx
│   │   │   ├── pages/
│   │   │   │   ├── CreateStaffPage.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── MenuItems.jsx
│   │   │   │   └── Tables.jsx
│   │   │   └── styles/
│   │   │       └── theme.css
│   │   └── superadmin/
│   │       ├── router.jsx
│   │       ├── api/
│   │       │   └── superadminApi.js
│   │       ├── components/
│   │       │   ├── AdminTable.jsx
│   │       │   ├── CreateAdminModal.jsx
│   │       │   ├── CreateOrgModal.jsx
│   │       │   ├── OrgTable.jsx
│   │       │   └── Sidebar.jsx
│   │       ├── context/
│   │       │   └── SuperAdminAuthContext.jsx
│   │       ├── pages/
│   │       │   ├── Admins.jsx
│   │       │   ├── Dashboard.jsx
│   │       │   ├── Login.jsx
│   │       │   ├── Organizations.jsx
│   │       │   └── OrgDetails.jsx
│   │       └── styles/
│   │           └── theme.css
│   ├── shared/
│   │   └── utils/
│   │       ├── delay.jsx
│   │       └── LoadingSpinner.jsx
│   └── styles/
│       └── globals.css
├── docs/
│   └── authentication-guide.md
├── eslint.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https:/-----------------/api
VITE_KITCHEN_API_URL=https://----------------/api/kitchen

# Authentication
VITE_JWT_SECRET=your-jwt-secret-key
VITE_SESSION_TIMEOUT=3600000

# Payment Configuration
VITE_PAYMENT_GATEWAY_URL=your-payment-gateway-url
VITE_PAYMENT_PUBLIC_KEY=your-payment-public-key

# Development
VITE_DEV_MODE=true
VITE_DEBUG_LOGGING=true
```

### Build Configuration

The project uses Vite for building and development. Key configuration files:

- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules and settings

## Usage

### Authentication System

The application uses JWT-based authentication with different token storage keys for each role:

```javascript
// Token storage keys
const TOKEN_KEYS = {
  SUPER_ADMIN: 'superadmin_token',
  ORG_ADMIN: 'orgadmin_token1',
  KITCHEN: 'kitchen_token',
  CUSTOMER: 'customer_session'
};

// Session types
const SESSION_TYPES = {
  PERSISTENT: 7 * 24 * 60 * 60 * 1000, // 7 days
  TEMPORARY: 60 * 60 * 1000             // 1 hour
};
```

### Role Access URLs

- **Customer Interface**: `/customer`
- **Kitchen Dashboard**: `/kitchen`
- **Organization Admin**: `/orgadmin`
- **Super Admin Panel**: `/superadmin`

### Test Credentials

For development and testing:

```
Super Admin:
Email: admin@example.com
Password: password123

Organization Admin:
Email: orgadmin@restaurant.com
Password: orgpass123

Kitchen Staff:
Email: kitchen@restaurant.com
Password: kitchenpass123
```

## API Reference

### Base Configuration

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const KITCHEN_API_URL = import.meta.env.VITE_KITCHEN_API_URL;
```

### Authentication Endpoints

#### Super Admin Login
```http
POST /api/superadmin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123",
  "remember_me": true
}
```

#### Organization Management
```http
GET /api/organizations
Authorization: Bearer <token>

POST /api/organizations
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Restaurant Name",
  "address": "123 Main St",
  "contact_email": "restaurant@example.com"
}
```

### Menu Management

#### Create Menu Item
```http
POST /api/menu-items
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Burger Deluxe",
  "description": "Premium burger with fries",
  "price": 12.99,
  "category": "main-course",
  "image_url": "https://example.com/burger.jpg"
}
```

### Order Management

#### Place Order
```http
POST /api/orders
Content-Type: application/json

{
  "table_id": "table_123",
  "items": [
    {
      "menu_item_id": "item_456",
      "quantity": 2,
      "special_requests": "No onions"
    }
  ]
}
```

#### Update Order Status
```http
PUT /api/kitchen/orders/:orderId/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "preparing"
}
```

### Payment Processing

#### Process Payment
```http
POST /api/payments
Content-Type: application/json

{
  "order_id": "order_789",
  "amount": 25.98,
  "payment_method": "card",
  "card_token": "tok_1234567890"
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm test -- --testPathPattern=auth
```

### Test Structure

```
__tests__/
├── auth/
│   ├── SuperAdminAuth.test.js
│   ├── OrgAdminAuth.test.js
│   └── KitchenAuth.test.js
├── components/
│   ├── MenuCard.test.jsx
│   ├── OrderCard.test.jsx
│   └── PaymentModal.test.jsx
├── api/
│   ├── superadminApi.test.js
│   ├── orgadminApi.test.js
│   └── kitchenApi.test.js
└── integration/
    ├── orderFlow.test.js
    └── paymentFlow.test.js
```

### Authentication Testing

```javascript
// Test Super Admin login
describe('Super Admin Authentication', () => {
  test('should login with valid credentials', async () => {
    const credentials = {
      email: 'admin@example.com',
      password: 'password123'
    };
    
    const result = await superAdminLogin(credentials);
    expect(result.success).toBe(true);
    expect(localStorage.getItem('superadmin_token')).toBeTruthy();
  });

  test('should handle remember me functionality', async () => {
    const credentials = {
      email: 'admin@example.com',
      password: 'password123',
      remember_me: true
    };
    
    const result = await superAdminLogin(credentials);
    const token = localStorage.getItem('superadmin_token');
    const decoded = jwt_decode(token);
    
    expect(decoded.exp - decoded.iat).toBeGreaterThan(24 * 60 * 60);
  });
});
```

### Component Testing

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import MenuCard from '../components/MenuCard';

describe('MenuCard Component', () => {
  const mockItem = {
    id: '1',
    name: 'Test Burger',
    price: 12.99,
    description: 'Delicious test burger',
    image_url: 'test-image.jpg'
  };

  test('should render menu item correctly', () => {
    render(<MenuCard item={mockItem} onAddToCart={jest.fn()} />);
    
    expect(screen.getByText('Test Burger')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  test('should handle add to cart click', () => {
    const onAddToCart = jest.fn();
    render(<MenuCard item={mockItem} onAddToCart={onAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(onAddToCart).toHaveBeenCalledWith(mockItem);
  });
});
```

## Deployment

### Production Build

```bash
npm run build
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Setup for Production

```env
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_KITCHEN_API_URL=https://your-production-api.com/api/kitchen
VITE_JWT_SECRET=your-production-jwt-secret
VITE_ENCRYPTION_KEY=your-encryption-key
VITE_ENABLE_ANALYTICS=true
VITE_CDN_URL=https://your-cdn.com
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## Troubleshooting

### Common Issues

#### Authentication Errors (401 Unauthorized)
- Check token validity in localStorage
- Verify API endpoint URLs in `.env`
- Ensure token hasn't expired

```javascript
// Debug authentication
console.log('Token:', localStorage.getItem('superadmin_token'));
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
```

#### UI Rendering Issues
- Clear browser cache and cookies
- Check console for CSS/JavaScript errors
- Verify Tailwind CSS classes are loading

#### State Management Problems
- Ensure Context Providers are properly wrapped
- Check for circular dependencies in context
- Verify state updates are immutable

#### API Connection Issues
- Test API connectivity with health check endpoints
- Verify CORS configuration on backend
- Check network connectivity and firewall settings

```javascript
// Test API connection
const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    console.log('API Status:', response.status);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};
```

### Performance Optimization

#### Bundle Size Analysis
```bash
npm run build -- --analyze
```

#### Code Splitting
```javascript
import { lazy, Suspense } from 'react';

const CustomerDashboard = lazy(() => import('./roles/customer/pages/Dashboard'));
const KitchenDashboard = lazy(() => import('./roles/kitchen/pages/Dashboard'));

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <CustomerDashboard />
</Suspense>
```

## Contributing

We welcome contributions to QR Agent! Please follow these guidelines:

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### Code Standards

- Use TypeScript for all new code
- Follow existing naming conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure code passes ESLint checks

### Pull Request Requirements

- Descriptive title and detailed description
- Reference any related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update relevant documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please check:

1. [Documentation](./docs/)
2. [Issue Tracker](https://github.com/your-username/qr-agent/issues)
3. [API Documentation](./docs/api-specification.md)
4. [Authentication Guide](./docs/authentication-guide.md)

## Credits

- **Icons**: [Lucide React](https://lucide.dev)
- **Charts**: [Chart.js](https://www.chartjs.org)
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Build Tool**: [Vite](https://vitejs.dev)

---

For detailed implementation notes, refer to the documentation in the `docs/` directory.
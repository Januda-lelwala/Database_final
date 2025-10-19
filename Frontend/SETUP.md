# Setup Guide

## 📦 Installation

1. **Navigate to the project directory:**
   ```bash
   cd frontend-clean
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your backend API URL:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at http://localhost:3000

## 🔌 Connecting to Your Backend

Your backend API should have these endpoints:

### Authentication Endpoints
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout user

### Request/Response Format

**Login Request:**
```json
{
  "username": "john",
  "password": "john123",
  "role": "customer",
  "portalType": "customer"
}
```

**Login Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "CUS123",
    "username": "john",
    "name": "John Doe",
    "role": "customer",
    "portalType": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Register Request:**
```json
{
  "name": "John Doe",
  "user_name": "john",
  "password": "password123",
  "phone_no": "1234567890",
  "city": "Colombo",
  "address": "123 Main St"
}
```

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Backend validates credentials and returns JWT token
3. Token is stored in localStorage
4. Token is automatically added to all subsequent API requests
5. On 401 error, user is redirected to login

## 📁 Project Structure Overview

```
src/
├── components/          # Reusable components
│   ├── common/         # Button, Input, etc.
│   └── layout/         # ProtectedRoute, Header, etc.
├── pages/              # Page components
│   ├── Auth/           # Login, Register
│   └── Customer/       # Customer Dashboard
├── context/            # React Context
│   └── AuthContext.js  # Authentication state
├── services/           # API services
│   ├── api.js          # Axios configuration
│   └── auth.service.js # Auth API calls
├── utils/              # Utilities
│   └── validators.js   # Form validation
├── config/             # Configuration
│   └── constants.js    # App constants
└── styles/             # Global styles
```

## 🚀 Adding New Features

### Adding a New Page

1. Create component in `src/pages/`:
   ```javascript
   // src/pages/Products/ProductList.js
   import React from 'react';
   
   const ProductList = () => {
     return <div>Product List</div>;
   };
   
   export default ProductList;
   ```

2. Add route in `src/App.js`:
   ```javascript
   import ProductList from './pages/Products/ProductList';
   
   <Route path="/products" element={<ProductList />} />
   ```

### Adding a New API Service

1. Create service file in `src/services/`:
   ```javascript
   // src/services/product.service.js
   import api from './api';
   
   export const productService = {
     getAll: async () => {
       const response = await api.get('/products');
       return response.data;
     }
   };
   ```

2. Use in components:
   ```javascript
   import { productService } from '../services/product.service';
   
   const products = await productService.getAll();
   ```

## 🎨 Styling

- Each component has its own CSS file
- Use the pre-built Button and Input components
- Global styles in `src/styles/`
- Utility classes available in `App.css`

## 🧪 Testing the Setup

1. Start your backend server
2. Start this frontend: `npm start`
3. Try logging in with test credentials
4. Check browser console for any API errors
5. Verify token is stored in localStorage

## ⚠️ Common Issues

**CORS Errors:**
- Make sure your backend has CORS enabled for http://localhost:3000

**API Connection Failed:**
- Verify the API_URL in `.env` matches your backend
- Check that your backend is running
- Open browser dev tools and check Network tab

**Login Not Working:**
- Check that backend endpoints match expected format
- Verify JWT token is being returned
- Check browser console for errors

## 📝 Next Steps

1. Connect to your existing backend
2. Test authentication flow
3. Add additional pages (Products, Orders, etc.)
4. Add additional API services as needed
5. Customize styling to match your brand

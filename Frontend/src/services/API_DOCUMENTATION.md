# KandyPack API Integration Documentation

This document provides a comprehensive guide on how to use the API services in the KandyPack frontend application.

## Table of Contents
- [Configuration](#configuration)
- [Authentication](#authentication)
- [Customers](#customers)
- [Orders](#orders)
- [Products](#products)
- [Stores](#stores)
- [Trucks](#trucks)
- [Trains](#trains)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)

## Configuration

### Base API URL
The API base URL is configured in `/src/services/api.js`:
- Default: `http://localhost:3000/api`
- Can be overridden via environment variable: `REACT_APP_API_URL`

### Authentication
All authenticated requests automatically include the JWT token from localStorage in the Authorization header.

## Authentication

Import: `import { authService } from './services'`

### User Authentication
```javascript
// Register new user
await authService.register({ email, password, name, phone, address });

// User login
await authService.login({ email, password });

// Get user profile
await authService.getProfile();
```

### Admin Authentication
```javascript
// Register new admin (admin only)
await authService.admin.register({ email, password, name, role });

// Admin login
await authService.admin.login({ email, password });

// Get admin profile
await authService.admin.getProfile();
```

### Driver Authentication
```javascript
// Register new driver
await authService.driver.register({ email, password, name, license_number });

// Driver login
await authService.driver.login({ email, password });
```

### Assistant Authentication
```javascript
// Register new assistant
await authService.assistant.register({ email, password, name, employee_id });

// Assistant login
await authService.assistant.login({ email, password });
```

### Logout
```javascript
// Logout (clears local storage)
authService.logout();
```

## Customers

Import: `import { customersService } from './services'`

```javascript
// Get all customers (admin only)
await customersService.getAll({ page: 1, limit: 10 });

// Search customers (admin only)
await customersService.search({ query: 'john' });

// Get customer by ID
await customersService.getById(customerId);

// Create new customer (admin only)
await customersService.create({ name, email, phone, address });

// Update customer
await customersService.update(customerId, { name, phone });

// Delete customer (admin only)
await customersService.delete(customerId);

// Get customer orders
await customersService.getOrders(customerId, { status: 'pending' });
```

## Orders

Import: `import { ordersService } from './services'`

```javascript
// Get all orders (admin only)
await ordersService.getAll({ page: 1, limit: 10 });

// Get order by ID
await ordersService.getById(orderId);

// Create new order
await ordersService.create({
  customer_id,
  store_id,
  items: [{ product_id, quantity }],
  delivery_address
});

// Update order
await ordersService.update(orderId, { delivery_address });

// Delete order (admin only)
await ordersService.delete(orderId);

// Get order items
await ordersService.getItems(orderId);

// Update order status (admin only)
await ordersService.updateStatus(orderId, { status: 'shipped' });
```

## Products

Import: `import { productsService } from './services'`

### Public Endpoints
```javascript
// Get all products
await productsService.getAll({ page: 1, limit: 20 });

// Search products
await productsService.search({ query: 'chocolate' });

// Get products by category
await productsService.getByCategory(categoryId);

// Get product by ID
await productsService.getById(productId);
```

### Admin Endpoints
```javascript
// Get low stock products (admin only)
await productsService.getLowStock({ threshold: 10 });

// Create new product (admin only)
await productsService.create({
  name,
  description,
  price,
  category_id,
  stock_quantity
});

// Update product (admin only)
await productsService.update(productId, { price, stock_quantity });

// Delete product (admin only)
await productsService.delete(productId);

// Update product stock (admin only)
await productsService.updateStock(productId, { quantity: 100 });
```

## Stores

Import: `import { storesService } from './services'`

### Public Endpoints
```javascript
// Get all stores
await storesService.getAll();

// Get available cities
await storesService.getCities();

// Search stores by city
await storesService.search({ city: 'Colombo' });

// Get store by ID
await storesService.getById(storeId);

// Get store products
await storesService.getProducts(storeId);
```

### Admin Endpoints
```javascript
// Create new store (admin only)
await storesService.create({
  name,
  city,
  address,
  phone,
  manager_id
});

// Update store (admin only)
await storesService.update(storeId, { phone, address });

// Delete store (admin only)
await storesService.delete(storeId);

// Get store inventory (admin only)
await storesService.getInventory(storeId);

// Update store inventory (admin only)
await storesService.updateInventory(storeId, {
  product_id,
  quantity
});

// Get store orders (admin only)
await storesService.getOrders(storeId, { status: 'pending' });
```

## Trucks

Import: `import { trucksService } from './services'`

All truck endpoints require admin authentication.

```javascript
// Get all trucks
await trucksService.getAll();

// Search trucks
await trucksService.search({ status: 'available' });

// Get trucks by capacity
await trucksService.getByCapacity({ min_capacity: 1000 });

// Get truck by ID
await trucksService.getById(truckId);

// Create new truck
await trucksService.create({
  registration_number,
  capacity,
  driver_id
});

// Update truck
await trucksService.update(truckId, { status: 'maintenance' });

// Delete truck (requires manage_vehicles permission)
await trucksService.delete(truckId);
```

## Trains

Import: `import { trainsService } from './services'`

All train endpoints require admin authentication.

```javascript
// Get all trains
await trainsService.getAll();

// Get trains by capacity
await trainsService.getByCapacity({ min_capacity: 5000 });

// Get train by ID
await trainsService.getById(trainId);

// Create new train
await trainsService.create({
  train_number,
  capacity,
  route
});

// Update train
await trainsService.update(trainId, { status: 'active' });

// Delete train (requires manage_vehicles permission)
await trainsService.delete(trainId);
```

## Usage Examples

### Example 1: Customer Login and Order Creation
```javascript
import { authService, ordersService } from './services';

// Login
const loginResponse = await authService.login({
  email: 'customer@example.com',
  password: 'password123'
});

// Store token
localStorage.setItem('authToken', loginResponse.token);

// Create order
const order = await ordersService.create({
  customer_id: loginResponse.user.id,
  store_id: 1,
  items: [
    { product_id: 101, quantity: 2 },
    { product_id: 102, quantity: 1 }
  ],
  delivery_address: '123 Main St, Colombo'
});
```

### Example 2: Admin Managing Products
```javascript
import { authService, productsService } from './services';

// Admin login
const adminLogin = await authService.admin.login({
  email: 'admin@kandypack.com',
  password: 'adminpass'
});

localStorage.setItem('authToken', adminLogin.token);

// Get low stock products
const lowStock = await productsService.getLowStock({ threshold: 10 });

// Update stock for low stock items
for (const product of lowStock.products) {
  await productsService.updateStock(product.id, { quantity: 100 });
}
```

### Example 3: Store Search and Product Browsing
```javascript
import { storesService, productsService } from './services';

// Find stores in a city
const stores = await storesService.search({ city: 'Kandy' });

// Get products from a specific store
const storeProducts = await storesService.getProducts(stores[0].id);

// Search for specific products
const chocolates = await productsService.search({ query: 'chocolate' });
```

## Error Handling

All API calls return promises and should be wrapped in try-catch blocks:

```javascript
import { handleAPIError } from './services';

try {
  const products = await productsService.getAll();
  // Handle success
} catch (error) {
  const errorMessage = handleAPIError(error);
  console.error('Error:', errorMessage);
  // Show error to user
}
```

### Common Error Responses
- `401 Unauthorized`: Token expired or invalid - user will be redirected to login
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Environment Setup

Create a `.env` file in your project root:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

For production:
```env
REACT_APP_API_URL=https://api.kandypack.com/api
```

## Notes

1. All services automatically include authentication tokens in requests
2. Token expiration is handled automatically - users will be redirected to login
3. Admin-only endpoints will return 403 if called by non-admin users
4. All timestamps are in ISO 8601 format
5. Pagination typically uses `page` and `limit` query parameters
6. Search endpoints support fuzzy matching

## Support

For issues or questions, contact the development team or refer to the backend API documentation.

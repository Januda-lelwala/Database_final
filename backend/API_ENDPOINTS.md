# API Endpoints Documentation

## Base URL
`http://localhost:3000/api`

---

## Authentication Endpoints (`/api/auth`)

### User Authentication
- **POST** `/auth/register` - Register new user (public)
  - Validation: `validateUserRegistration`
  - Body: `{ name, email, password, phone }`

- **POST** `/auth/login` - User login (public)
  - Validation: `validateUserLogin`
  - Body: `{ email, password }`

- **GET** `/auth/profile` - Get user profile
  - Auth: `verifyUser`

### Admin Authentication
- **POST** `/auth/admin/register` - Register new admin
  - Auth: `verifyAdmin`
  - Validation: `validateAdminRegistration`
  - Body: `{ name, email, password, phone, role? }`

- **POST** `/auth/admin/login` - Admin login (public)
  - Validation: `validateUserLogin`
  - Body: `{ email, password }`

- **GET** `/auth/admin/profile` - Get admin profile
  - Auth: `verifyAdmin`

---

## Customer Endpoints (`/api/customers`)

- **GET** `/customers` - Get all customers
  - Auth: `verifyAdmin`

- **GET** `/customers/:id` - Get customer by ID
  - Auth: `verifyUser`

- **POST** `/customers` - Create new customer (public)
  - Validation: `validateCustomer`
  - Body: `{ name, email, phone, address? }`

- **PUT** `/customers/:id` - Update customer
  - Auth: `verifyUser`
  - Validation: `validateCustomer`
  - Body: `{ name, email, phone, address? }`

- **DELETE** `/customers/:id` - Delete customer
  - Auth: `verifyAdmin`

- **GET** `/customers/:id/orders` - Get customer orders
  - Auth: `verifyUser`

---

## Order Endpoints (`/api/orders`)

- **GET** `/orders` - Get all orders
  - Auth: `verifyAdmin`

- **GET** `/orders/:id` - Get order by ID
  - Auth: `verifyUser`

- **POST** `/orders` - Create new order
  - Auth: `verifyUser`
  - Validation: `validateOrder`
  - Body: `{ customerId, storeId, deliveryAddress, orderDate?, status? }`

- **PUT** `/orders/:id` - Update order
  - Auth: `verifyUser`
  - Validation: `validateOrder`
  - Body: `{ customerId, storeId, deliveryAddress, orderDate?, status? }`

- **DELETE** `/orders/:id` - Delete order
  - Auth: `verifyAdmin`

- **GET** `/orders/:id/items` - Get order items
  - Auth: `verifyUser`

- **PATCH** `/orders/:id/status` - Update order status
  - Auth: `verifyAdmin`
  - Body: `{ status }`

---

## Product Endpoints (`/api/products`)

### Public Routes
- **GET** `/products` - Get all products (public)

- **GET** `/products/search?query=...` - Search products (public)

- **GET** `/products/:id` - Get product by ID (public)

- **GET** `/products/category/:categoryId` - Get products by category (public)

### Admin Routes
- **POST** `/products` - Create new product
  - Auth: `verifyAdmin`

- **PUT** `/products/:id` - Update product
  - Auth: `verifyAdmin`

- **DELETE** `/products/:id` - Delete product
  - Auth: `verifyAdmin`

- **PATCH** `/products/:id/stock` - Update product stock
  - Auth: `verifyAdmin`
  - Body: `{ quantity }`

---

## Store Endpoints (`/api/stores`)

### Public Routes
- **GET** `/stores` - Get all stores (public)

- **GET** `/stores/search?city=...` - Get stores by city (public)

- **GET** `/stores/:id` - Get store by ID (public)

- **GET** `/stores/:id/products` - Get store products (public)

### Admin Routes
- **POST** `/stores` - Create new store
  - Auth: `verifyAdmin`
  - Validation: `validateStore`
  - Body: `{ name, city, address, contactNo, email? }`

- **PUT** `/stores/:id` - Update store
  - Auth: `verifyAdmin`
  - Validation: `validateStore`
  - Body: `{ name, city, address, contactNo, email? }`

- **DELETE** `/stores/:id` - Delete store
  - Auth: `verifyAdmin`

- **GET** `/stores/:id/inventory` - Get store inventory
  - Auth: `verifyAdmin`

- **PATCH** `/stores/:id/inventory` - Update store inventory
  - Auth: `verifyAdmin`

- **GET** `/stores/:id/orders` - Get store orders
  - Auth: `verifyAdmin`

---

## Truck Endpoints (`/api/trucks`)

All truck endpoints require admin authentication.

- **GET** `/trucks` - Get all trucks
  - Auth: `verifyAdmin`

- **GET** `/trucks/available` - Get available trucks
  - Auth: `verifyAdmin`

- **GET** `/trucks/search?status=...` - Get trucks by status
  - Auth: `verifyAdmin`
  - Status values: `available`, `in_transit`, `maintenance`, `out_of_service`

- **GET** `/trucks/:id` - Get truck by ID
  - Auth: `verifyAdmin`

- **POST** `/trucks` - Create new truck
  - Auth: `verifyAdmin`
  - Validation: `validateTruck`
  - Body: `{ registrationNo, capacity, status?, model?, year? }`

- **PUT** `/trucks/:id` - Update truck
  - Auth: `verifyAdmin`
  - Validation: `validateTruck`
  - Body: `{ registrationNo, capacity, status?, model?, year? }`

- **DELETE** `/trucks/:id` - Delete truck
  - Auth: `verifyAdmin` + `checkPermission('manage_vehicles')`

- **PATCH** `/trucks/:id/status` - Update truck status
  - Auth: `verifyAdmin`
  - Body: `{ status }`

- **GET** `/trucks/:id/schedule` - Get truck schedule
  - Auth: `verifyAdmin`

- **POST** `/trucks/:id/assign-route` - Assign truck to route
  - Auth: `verifyAdmin`

- **GET** `/trucks/:id/maintenance` - Get truck maintenance history
  - Auth: `verifyAdmin`

- **POST** `/trucks/:id/maintenance` - Add maintenance record
  - Auth: `verifyAdmin`

- **GET** `/trucks/:id/orders` - Get orders assigned to truck
  - Auth: `verifyAdmin`

---

## Utility Endpoints

- **GET** `/health` - Health check endpoint (public)
  - Returns: `{ status, message, timestamp }`

- **GET** `/` - API information (public)
  - Returns: API version and available endpoints

---

## Authentication

### Headers
All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### User Roles
- **User**: Regular authenticated user (customers)
- **Admin**: Administrator with elevated permissions
- **Super Admin**: Full access with all permissions

### Permissions
Some admin routes require specific permissions:
- `manage_vehicles` - Required for deleting trucks
- `manage_routes` - Required for deleting routes (if implemented)

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

---

## Status Codes

- **200** - OK (successful GET, PUT, PATCH)
- **201** - Created (successful POST)
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing or invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

---

## Notes

1. All endpoints currently return placeholder responses
2. Controllers need to be implemented for full functionality
3. Database connection is currently disabled in `server.js`
4. Rate limiting: 100 requests per 15 minutes per IP for `/api/*` routes
5. Request body size limit: 10kb

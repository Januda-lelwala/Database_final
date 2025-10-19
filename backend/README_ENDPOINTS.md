# Quick Endpoint Reference

Based on the ER diagram, the API now supports the following entities:

## 🔐 Authentication (`/api/auth`)
- User & Admin registration/login
- Profile management
- JWT-based authentication

## 👥 Customer (`/api/customers`)
- CRUD operations
- Customer orders retrieval
- Public registration, admin management

## 📦 Order (`/api/orders`)
- Full order lifecycle management
- Order items tracking
- Status updates (pending → processing → in_transit → delivered)
- Customer and admin access levels

## 🏪 Store (`/api/stores`)
- Store management (city, address, contact)
- Public store listing and search by city
- Store-specific product inventory
- Store order assignments
- Admin-only management

## 🚚 Truck (`/api/trucks`)
- Fleet management
- Status tracking (available, in_transit, maintenance, out_of_service)
- Route assignments
- Maintenance history
- Schedule management
- Admin-only access

## 🛍️ Product (`/api/products`)
- Public product catalog
- Category-based filtering
- Search functionality
- Stock management (admin)
- Store associations

---

## Key Features Implemented

### Security
- ✅ JWT authentication
- ✅ Role-based access control (User/Admin/Super Admin)
- ✅ Permission-based authorization
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet security headers
- ✅ CORS enabled
- ✅ Request size limits (10kb)

### Validation
- ✅ Customer validation (name, email, phone, address)
- ✅ Order validation (customerId, storeId, deliveryAddress, status)
- ✅ Store validation (name, city, address, contactNo)
- ✅ Truck validation (registrationNo, capacity, status)
- ✅ User/Admin registration validation
- ✅ Express-validator middleware

### Architecture
- ✅ MVC pattern (Models, Routes, Controllers)
- ✅ Sequelize ORM with PostgreSQL
- ✅ Environment-based configuration
- ✅ Centralized error handling
- ✅ Modular route structure

---

## Database Schema (from ER Diagram)

### Core Entities
1. **Customer** - name, email, phone, address
2. **Order** - customerId, storeId, orderDate, deliveryAddress, status
3. **OrderItem** - orderId, productId, quantity, price
4. **Product** - name, description, price, category, storeId
5. **Store** - name, city, address, contactNo
6. **Truck** - registrationNo, capacity, status, model, year
7. **Admin** - name, email, password, role, permissions
8. **User** - name, email, password, phone, isActive

### Relationships
- Customer → Orders (1:N)
- Order → OrderItems (1:N)
- Order → Store (N:1)
- Order → Truck (N:1) [for delivery]
- Product → Store (N:1)
- Store → Orders (1:N)
- Truck → Orders (1:N)

---

## Next Steps

### To Enable Database
1. Configure `.env` with PostgreSQL credentials
2. Uncomment `connectDB()` in `server.js`
3. Run migrations to create tables

### To Implement Controllers
Create controller files for:
- `controllers/customerController.js`
- `controllers/orderController.js`
- `controllers/productController.js`
- `controllers/storeController.js`
- `controllers/truckController.js`

### To Test
```bash
# Start server
npm run dev

# Test health endpoint
curl http://localhost:3000/health

# Test API info
curl http://localhost:3000/
```

---

## Port Configuration
- Current: Hardcoded to `3000`
- Recommended: Use `process.env.PORT || 3000` for flexibility

See `API_ENDPOINTS.md` for detailed endpoint documentation.

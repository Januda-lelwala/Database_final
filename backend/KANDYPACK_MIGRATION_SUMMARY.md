# KandyPack Database Migration Summary

## ✅ Completed Changes

### 1. Database Configuration
- ✅ Updated `config/config.js` - Changed from PostgreSQL to MySQL
- ✅ Updated `config/database.js` - MySQL connection message
- ✅ Updated `.env.example` - MySQL defaults (port 3306, db: kandypack)
- ✅ Updated `package.json` - Replaced `pg`/`pg-hstore`/`sqlite3` with `mysql2`

### 2. Models Updated
- ✅ **Admin.js** - Matches `admin` table schema
- ✅ **Customer.js** - Matches `customer` table schema  
- ✅ **Product.js** - Matches `product` table schema with `space_consumption`

### 3. Database Files Created
- ✅ `database/kandypack_schema.sql` - Full MySQL schema with triggers, procedures, views
- ✅ `DATABASE_SETUP.md` - Complete setup guide

## ⏳ Models Still Needed

The following Sequelize models need to be created to match the KandyPack schema:

### Core Entities
1. ✅ `models/Admin.js` - DONE
2. ✅ `models/Customer.js` - DONE  
3. ✅ `models/Product.js` - DONE
4. **`models/Store.js`** - NEW (store table)
5. **`models/Order.js`** - UPDATE (orders table - note plural)
6. **`models/OrderItem.js`** - UPDATE (order_item table)

### Rail Layer
7. **`models/TrainRoute.js`** - NEW
8. **`models/Train.js`** - NEW
9. **`models/TrainTrip.js`** - NEW
10. **`models/TrainShipment.js`** - NEW

### Road Layer
11. **`models/Truck.js`** - NEW (replaces Vehicle.js)
12. **`models/TruckRoute.js`** - NEW
13. **`models/Driver.js`** - NEW
14. **`models/Assistant.js`** - NEW
15. **`models/TruckSchedule.js`** - NEW
16. **`models/TruckDelivery.js`** - NEW

### Models to DELETE (not in KandyPack schema)
- ❌ `models/User.js` - Customer handles authentication
- ❌ `models/Vehicle.js` - Replaced by Truck.js
- ❌ `models/Route.js` - Replaced by TrainRoute.js and TruckRoute.js
- ❌ `models/RouteSchedule.js` - Replaced by TruckSchedule.js
- ❌ `models/RouteStop.js` - Not in KandyPack schema
- ❌ `models/Booking.js` - Not in KandyPack schema
- ❌ `models/Category.js` - Category is now a string field in Product

## Schema Mapping

### Table Name Changes
| Old Model | Old Table | New Model | New Table |
|-----------|-----------|-----------|-----------|
| Customer | customers | Customer | customer |
| Admin | admins | Admin | admin |
| Product | products | Product | product |
| Order | orders | Order | orders (same) |
| OrderItem | order_items | OrderItem | order_item |
| Vehicle | vehicles | Truck | truck |
| - | - | Store | store |
| - | - | Train | train |
| - | - | TrainRoute | train_route |
| - | - | TrainTrip | train_trip |
| - | - | TrainShipment | train_shipment |
| - | - | TruckRoute | truck_route |
| - | - | Driver | driver |
| - | - | Assistant | assistant |
| - | - | TruckSchedule | truck_schedule |
| - | - | TruckDelivery | truck_delivery |

### Primary Key Changes
All tables now use VARCHAR primary keys instead of UUID:
- `customer_id` VARCHAR(40)
- `admin_id` VARCHAR(20)
- `product_id` VARCHAR(40)
- `order_id` VARCHAR(40)
- `store_id` VARCHAR(40)
- `truck_id` VARCHAR(40)
- `train_id` VARCHAR(40)
- etc.

### Timestamp Changes
- **Old**: Sequelize auto-timestamps (`created_at`, `updated_at`)
- **New**: Manual timestamp fields where needed
  - `admin.created_at`
  - `customer.created_at`
  - `orders.created_at`, `orders.updated_at`
  - `train_shipment.created_at`
- **Config**: `timestamps: false` in all models

## API Endpoint Changes Needed

### Authentication
- **Customer Auth**: Use `user_name` + `password` (not email)
- **Admin Auth**: Use `admin_id` + `password` (no email field)

### Existing Endpoints to Update
1. `/api/customers` - Update to use `customer_id`, `user_name`
2. `/api/products` - Update to use `product_id`, `space_consumption`, `available_quantity`
3. `/api/orders` - Update to use `order_id`, `destination_city`, `destination_address`
4. `/api/stores` - Already created, needs controller
5. `/api/trucks` - Already created, needs controller

### New Endpoints Needed
1. `/api/trains` - Train management
2. `/api/train-routes` - Train route management
3. `/api/train-trips` - Train trip scheduling
4. `/api/drivers` - Driver management
5. `/api/assistants` - Assistant management
6. `/api/truck-schedules` - Truck scheduling with roster rules
7. `/api/reports` - Access to reporting views

## Validation Updates Needed

### Current Validators
- ✅ `validateCustomer` - UPDATE for `user_name` field
- ✅ `validateOrder` - UPDATE for `destination_city`, `destination_address`
- ✅ `validateStore` - Already created
- ✅ `validateTruck` - UPDATE for `license_plate`

### New Validators Needed
- `validateTrain`
- `validateTrainRoute`
- `validateTrainTrip`
- `validateDriver`
- `validateAssistant`
- `validateTruckSchedule`

## Business Logic to Implement

### Stored Procedures (Call from Node.js)
1. **`sp_schedule_order_to_trains(order_id, route_id, store_id)`**
   - Allocates order across train trips
   - Handles capacity management
   - Splits orders if needed

2. **`sp_create_truck_schedule(...)`**
   - Validates roster rules
   - Prevents overlaps
   - Enforces weekly hour limits

3. **`sp_assign_delivery_to_schedule(...)`**
   - Assigns order to truck run

### Triggers (Automatic in MySQL)
- Stock management on order_item insert/update/delete
- 7-day advance order validation
- Capacity tracking on train_shipment

### Views (Query from Node.js)
- `v_quarterly_sales`
- `v_quarter_top_items`
- `v_city_route_sales`
- `v_worker_hours`
- `v_truck_usage`
- `v_customer_order_history`

## Next Steps

### Immediate (Required for Basic Functionality)
1. ✅ Install mysql2: `npm install`
2. ✅ Create database: `mysql -u root -p < database/kandypack_schema.sql`
3. ✅ Update `.env` with MySQL credentials
4. ⏳ Create remaining Sequelize models (Store, Order, OrderItem, Truck, etc.)
5. ⏳ Update authController to use new Customer/Admin schema
6. ⏳ Create controllers for new entities
7. ⏳ Update validation middleware
8. ⏳ Test API endpoints

### Medium Priority
1. Implement stored procedure calls in controllers
2. Add report endpoints
3. Create admin dashboard for scheduling
4. Add order tracking functionality

### Low Priority
1. Add WebSocket for real-time order tracking
2. Implement email notifications
3. Add PDF invoice generation
4. Create mobile-friendly UI

## Testing Checklist

### Database
- [ ] MySQL connection successful
- [ ] All tables created
- [ ] Seed data loaded
- [ ] Triggers working (stock management)
- [ ] Stored procedures callable
- [ ] Views accessible

### API
- [ ] Customer registration/login
- [ ] Admin login
- [ ] Product CRUD
- [ ] Order creation (7-day rule enforced)
- [ ] Store listing
- [ ] Truck management
- [ ] Train scheduling
- [ ] Reports generation

### Business Rules
- [ ] Orders require 7+ days advance
- [ ] Stock decreases on order
- [ ] Stock restores on order cancellation
- [ ] Train capacity tracking
- [ ] Truck schedule no overlaps
- [ ] Driver no consecutive deliveries
- [ ] Assistant max 2 consecutive routes
- [ ] Weekly hour limits enforced

## File Structure

```
Database_lab_backend/
├── config/
│   ├── config.js          ✅ Updated for MySQL
│   └── database.js        ✅ Updated connection message
├── database/
│   └── kandypack_schema.sql  ✅ Created
├── models/
│   ├── Admin.js           ✅ Updated
│   ├── Customer.js        ✅ Updated
│   ├── Product.js         ✅ Updated
│   ├── Store.js           ⏳ TODO
│   ├── Order.js           ⏳ TODO - Update
│   ├── OrderItem.js       ⏳ TODO - Update
│   ├── Train.js           ⏳ TODO - New
│   ├── TrainRoute.js      ⏳ TODO - New
│   ├── TrainTrip.js       ⏳ TODO - New
│   ├── TrainShipment.js   ⏳ TODO - New
│   ├── Truck.js           ⏳ TODO - New
│   ├── TruckRoute.js      ⏳ TODO - New
│   ├── Driver.js          ⏳ TODO - New
│   ├── Assistant.js       ⏳ TODO - New
│   ├── TruckSchedule.js   ⏳ TODO - New
│   └── TruckDelivery.js   ⏳ TODO - New
├── routes/
│   ├── authRoutes.js      ⏳ Update for new schema
│   ├── customerRoutes.js  ✅ Created
│   ├── orderRoutes.js     ✅ Created
│   ├── productRoutes.js   ✅ Created
│   ├── storeRoutes.js     ✅ Created
│   └── truckRoutes.js     ✅ Created
├── controllers/
│   └── authController.js  ⏳ Update
├── middleware/
│   ├── auth.js            ⏳ Update for new schema
│   └── validation.js      ✅ Updated
├── .env.example           ✅ Updated
├── package.json           ✅ Updated
├── server.js              ⏳ Uncomment connectDB()
├── DATABASE_SETUP.md      ✅ Created
└── API_ENDPOINTS.md       ✅ Created

```

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Setup MySQL database
mysql -u root -p < database/kandypack_schema.sql

# 3. Configure environment
cp .env.example .env
# Edit .env with your MySQL password

# 4. Uncomment database connection in server.js (line 25)
# connectDB();

# 5. Start server
npm run dev

# 6. Test connection
curl http://localhost:3000/health
```

## Migration Status: 40% Complete

- ✅ Database configuration
- ✅ Schema SQL file
- ✅ 3/16 models updated
- ✅ Route files created
- ⏳ Controllers pending
- ⏳ Auth system update pending
- ⏳ Remaining models pending

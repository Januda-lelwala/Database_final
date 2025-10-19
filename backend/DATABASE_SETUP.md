# KandyPack Database Setup Guide

## Overview
This project uses the **KandyPack** MySQL database - a rail & road distribution system for managing customer orders, train shipments, and truck deliveries.

## Database Schema Highlights

### Core Entities
1. **Admin** - System administrators
2. **Customer** - End customers placing orders
3. **Product** - Items with space consumption metrics
4. **Store** - Distribution hubs near train stations
5. **Orders** - Customer orders with 7-day advance requirement
6. **Order_Item** - Line items in orders

### Rail Layer
- **Train_Route** - Rail routes between cities
- **Train** - Rolling stock with capacity
- **Train_Trip** - Scheduled departures with capacity tracking
- **Train_Shipment** - Order allocation to train trips

### Road Layer
- **Truck** - Delivery vehicles
- **Truck_Route** - Last-mile delivery routes
- **Driver** & **Assistant** - Personnel with hour limits
- **Truck_Schedule** - Scheduled runs with roster rules
- **Truck_Delivery** - Final delivery assignments

## Business Rules (Enforced in Database)

### Order Rules
- ✅ Orders must be placed **≥7 days in advance**
- ✅ Stock automatically reduced/restored on order item changes
- ✅ Orders can split across multiple train trips if needed

### Train Scheduling
- ✅ Capacity-aware allocation via `sp_schedule_order_to_trains()`
- ✅ Automatic splitting across trips when single trip lacks capacity

### Truck Roster Rules
- ✅ **No resource overlap** - truck/driver/assistant can't be double-booked
- ✅ **Driver**: Cannot take consecutive back-to-back deliveries
- ✅ **Assistant**: Max 2 consecutive routes
- ✅ **Weekly limits**: Drivers 40h, Assistants 60h
- ✅ Enforced via `sp_create_truck_schedule()` procedure

## Setup Instructions

### 1. Install MySQL
```bash
# macOS (Homebrew)
brew install mysql
brew services start mysql

# Or download from https://dev.mysql.com/downloads/mysql/
```

### 2. Install Node Dependencies
```bash
npm install
# This will install mysql2 driver for Sequelize
```

### 3. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your MySQL credentials
nano .env
```

Example `.env`:
```env
PORT=3000
NODE_ENV=development

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kandypack
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### 4. Create Database
```bash
# Option A: Using MySQL CLI
mysql -u root -p < database/kandypack_schema.sql

# Option B: Using MySQL Workbench
# - Open kandypack_schema.sql
# - Execute the script

# Option C: Command line
mysql -u root -p
```

Then in MySQL:
```sql
source /path/to/database/kandypack_schema.sql;
```

### 5. Verify Database
```sql
USE kandypack;
SHOW TABLES;

-- Should show:
-- admin, customer, product, store, orders, order_item
-- train, train_route, train_trip, train_shipment
-- truck, truck_route, driver, assistant, truck_schedule, truck_delivery
```

### 6. Enable Database Connection
Edit `server.js` and uncomment:
```javascript
// Line 25 - uncomment this:
connectDB();
```

### 7. Start Server
```bash
npm run dev
```

## Seed Data

The schema includes minimal seed data:
- 1 admin account
- 4 stores (Colombo, Negombo, Galle, Kandy)
- 2 customers
- 3 products
- 2 train routes, 2 trains, 3 upcoming trips
- 2 trucks, 2 drivers, 2 assistants
- 3 truck routes
- 1 sample order with train & truck assignments

### Generate 40+ Orders
```sql
USE kandypack;
CALL sp_seed_orders_40();
```

## Key Stored Procedures

### 1. Schedule Order to Trains
```sql
CALL sp_schedule_order_to_trains(
  'ORD001',      -- order_id
  'R_KAN_COL',   -- route_id
  'ST_COL'       -- store_id
);
```
- Automatically allocates order across available train trips
- Splits across multiple trips if needed
- Updates capacity tracking

### 2. Create Truck Schedule
```sql
CALL sp_create_truck_schedule(
  'TS001',                -- truck_schedule_id
  'TR_COL_01',            -- route_id
  'TK01',                 -- truck_id
  'DRV001',               -- driver_id
  'AST001',               -- assistant_id
  '2025-10-10 09:00:00',  -- start_time
  '2025-10-10 13:00:00'   -- end_time
);
```
- Validates all roster rules
- Prevents overlaps and violations
- Enforces weekly hour limits

### 3. Assign Delivery
```sql
CALL sp_assign_delivery_to_schedule(
  'DELIV001',  -- delivery_id
  'TS001',     -- truck_schedule_id
  'ORD001'     -- order_id
);
```

## Reporting Views

### 1. Quarterly Sales
```sql
SELECT * FROM v_quarterly_sales;
-- Returns: quarter, total_value, total_space_units, orders
```

### 2. Top Products by Quarter
```sql
SELECT * FROM v_quarter_top_items 
WHERE year = 2025 AND quarter = 4
ORDER BY total_qty DESC
LIMIT 10;
```

### 3. City & Route Sales
```sql
SELECT * FROM v_city_route_sales
ORDER BY total_value DESC;
```

### 4. Worker Hours
```sql
SELECT * FROM v_worker_hours
WHERE week = '2025-40'  -- ISO week format
ORDER BY hours DESC;
```

### 5. Truck Usage
```sql
SELECT * FROM v_truck_usage
WHERE month = '2025-10'
ORDER BY hours DESC;
```

### 6. Customer Order History
```sql
SELECT * FROM v_customer_order_history
WHERE customer_id = 'CUS001'
ORDER BY order_date DESC;
```

## Testing the Database

### Test Order Creation (7-day rule)
```sql
-- This should FAIL (less than 7 days)
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address)
VALUES ('TEST001', 'CUS001', CURRENT_DATE + INTERVAL 5 DAY, 'Colombo', 'Test Address');
-- Error: Orders must be placed at least 7 days in advance

-- This should SUCCEED (8+ days)
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address)
VALUES ('TEST001', 'CUS001', CURRENT_DATE + INTERVAL 8 DAY, 'Colombo', 'Test Address');
```

### Test Stock Management
```sql
-- Check initial stock
SELECT product_id, available_quantity FROM product WHERE product_id = 'P001';

-- Add order item (stock should decrease)
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price)
VALUES ('TEST_OI1', 'TEST001', 'P001', 10, 600.00);

-- Check stock again (should be -10)
SELECT product_id, available_quantity FROM product WHERE product_id = 'P001';

-- Delete order item (stock should restore)
DELETE FROM order_item WHERE order_item_id = 'TEST_OI1';
```

### Test Truck Schedule Constraints
```sql
-- Try to create overlapping schedule (should fail)
CALL sp_create_truck_schedule(
  'TS_TEST1', 'TR_COL_01', 'TK01', 'DRV001', 'AST001',
  DATE_ADD(CURRENT_DATE, INTERVAL 9 DAY) + INTERVAL 9 HOUR,
  DATE_ADD(CURRENT_DATE, INTERVAL 9 DAY) + INTERVAL 13 HOUR
);
-- Error: Truck/Driver/Assistant has overlapping schedule (if TS001 exists)
```

## API Integration

The Node.js backend will connect to this database via Sequelize ORM. Models will map to these tables:

- `models/Admin.js` → `admin`
- `models/Customer.js` → `customer`
- `models/Product.js` → `product`
- `models/Store.js` → `store`
- `models/Order.js` → `orders`
- `models/OrderItem.js` → `order_item`
- `models/Train.js` → `train`
- `models/TrainRoute.js` → `train_route`
- `models/TrainTrip.js` → `train_trip`
- `models/TrainShipment.js` → `train_shipment`
- `models/Truck.js` → `truck`
- `models/TruckRoute.js` → `truck_route`
- `models/Driver.js` → `driver`
- `models/Assistant.js` → `assistant`
- `models/TruckSchedule.js` → `truck_schedule`
- `models/TruckDelivery.js` → `truck_delivery`

## Troubleshooting

### Connection Issues
```bash
# Test MySQL connection
mysql -u root -p -e "SELECT VERSION();"

# Check if MySQL is running
brew services list | grep mysql
# or
sudo systemctl status mysql
```

### Permission Issues
```sql
-- Grant privileges
GRANT ALL PRIVILEGES ON kandypack.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Reset Database
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS kandypack;"
mysql -u root -p < database/kandypack_schema.sql
```

## Next Steps

1. ✅ Database configured for MySQL
2. ✅ Schema created with all tables, triggers, procedures
3. ⏳ Create Sequelize models matching schema
4. ⏳ Update API endpoints to use real database
5. ⏳ Implement controllers with business logic
6. ⏳ Test end-to-end order flow

See `API_ENDPOINTS.md` for API documentation.

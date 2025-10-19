# KandyPack Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install MySQL
```bash
# macOS
brew install mysql
brew services start mysql

# Verify installation
mysql --version
```

### Step 2: Install Node Dependencies
```bash
npm install
```

This installs:
- `mysql2` - MySQL driver for Sequelize
- All other Express/Sequelize dependencies

### Step 3: Create Database
```bash
# Login to MySQL
mysql -u root -p

# Run the schema (from MySQL prompt)
source database/kandypack_schema.sql;

# Or from command line
mysql -u root -p < database/kandypack_schema.sql
```

### Step 4: Configure Environment
```bash
# Copy example
cp .env.example .env

# Edit with your MySQL password
nano .env
```

Update these values in `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kandypack
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE

JWT_SECRET=your_random_secret_key_here
```

### Step 5: Enable Database Connection
Edit `server.js` line 25:
```javascript
// Change from:
// connectDB();

// To:
connectDB();
```

### Step 6: Start Server
```bash
npm run dev
```

You should see:
```
Server running on port 3000 in development mode
MySQL database connection established successfully.
Connected to KandyPack database
```

### Step 7: Test the API
```bash
# Health check
curl http://localhost:3000/health

# API info
curl http://localhost:3000/

# Get all stores (public endpoint)
curl http://localhost:3000/api/stores

# Get all products (public endpoint)
curl http://localhost:3000/api/products
```

---

## 📊 Sample Data Included

The database comes pre-loaded with:

### Stores (4)
- Colombo Central Store
- Negombo Station Store
- Galle Station Store
- Kandy HQ Store

### Products (3)
- Detergent Box (600 LKR, 0.5 space units)
- Shampoo Pack (450 LKR, 0.2 space units)
- Soap Carton (1200 LKR, 1.0 space units)

### Customers (2)
- john / hash1 (Colombo)
- jane / hash2 (Kandy)

### Admin (1)
- ADM001 / admin123

### Trains & Routes
- 2 train routes (Kandy-Colombo, Kandy-Galle)
- 2 trains (TR100, TR200)
- 3 upcoming trips (8-9 days from today)

### Trucks & Personnel
- 2 trucks (WP-1234, WP-5678)
- 2 drivers
- 2 assistants
- 3 truck routes

### Sample Order
- 1 complete order with train and truck assignments

---

## 🧪 Test the Business Rules

### Test 1: 7-Day Advance Order Rule
```sql
USE kandypack;

-- This should FAIL (only 5 days advance)
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address)
VALUES ('TEST001', 'CUS001', DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), 'Colombo', 'Test Addr');
-- Error: Orders must be placed at least 7 days in advance

-- This should SUCCEED (8 days advance)
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address)
VALUES ('TEST001', 'CUS001', DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), 'Colombo', 'Test Addr');
-- Success!
```

### Test 2: Automatic Stock Management
```sql
-- Check initial stock
SELECT product_id, available_quantity FROM product WHERE product_id = 'P001';
-- Shows: 200

-- Add order item (stock auto-decreases via trigger)
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price)
VALUES ('TEST_OI1', 'TEST001', 'P001', 10, 600.00);

-- Check stock again
SELECT product_id, available_quantity FROM product WHERE product_id = 'P001';
-- Shows: 190 (decreased by 10)

-- Delete order item (stock auto-restores)
DELETE FROM order_item WHERE order_item_id = 'TEST_OI1';

-- Check stock
SELECT product_id, available_quantity FROM product WHERE product_id = 'P001';
-- Shows: 200 (restored)
```

### Test 3: Train Capacity Scheduling
```sql
-- Schedule an order to trains (auto-allocates across trips)
CALL sp_schedule_order_to_trains('TEST001', 'R_KAN_COL', 'ST_COL');

-- Check allocations
SELECT * FROM train_shipment WHERE order_id = 'TEST001';

-- Check capacity usage
SELECT trip_id, capacity, capacity_used, (capacity - capacity_used) AS available
FROM train_trip WHERE route_id = 'R_KAN_COL';
```

### Test 4: Truck Schedule Roster Rules
```sql
-- Create a valid truck schedule
CALL sp_create_truck_schedule(
  'TS_TEST1',
  'TR_COL_01',
  'TK01',
  'DRV001',
  'AST001',
  DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 9 HOUR,
  DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 13 HOUR
);
-- Success!

-- Try overlapping schedule (should fail)
CALL sp_create_truck_schedule(
  'TS_TEST2',
  'TR_COL_01',
  'TK01',  -- Same truck
  'DRV002',
  'AST002',
  DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 10 HOUR,  -- Overlaps!
  DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 14 HOUR
);
-- Error: Truck has overlapping schedule
```

---

## 📈 View Reports

### Quarterly Sales
```sql
SELECT * FROM v_quarterly_sales;
```

### Top Products by Quarter
```sql
SELECT * FROM v_quarter_top_items
WHERE year = YEAR(CURRENT_DATE) AND quarter = QUARTER(CURRENT_DATE)
ORDER BY total_qty DESC
LIMIT 10;
```

### City & Route Sales
```sql
SELECT * FROM v_city_route_sales
ORDER BY total_value DESC;
```

### Worker Hours This Week
```sql
SELECT * FROM v_worker_hours
WHERE week = DATE_FORMAT(CURRENT_DATE, '%x-%v')
ORDER BY hours DESC;
```

### Truck Usage This Month
```sql
SELECT * FROM v_truck_usage
WHERE month = DATE_FORMAT(CURRENT_DATE, '%Y-%m')
ORDER BY hours DESC;
```

### Customer Order History
```sql
SELECT * FROM v_customer_order_history
WHERE customer_id = 'CUS001'
ORDER BY order_date DESC;
```

---

## 🎯 Generate More Test Data

### Create 40 Additional Orders
```sql
USE kandypack;
CALL sp_seed_orders_40();
```

This creates:
- 40 orders (ORD002 through ORD041)
- Distributed across customers
- Various cities (Colombo, Galle, Negombo)
- 7-14 days in advance
- With order items

---

## 🔧 Common Tasks

### Add a New Product
```sql
INSERT INTO product (product_id, name, description, price, space_consumption, category, available_quantity)
VALUES ('P004', 'Rice Bag', '5kg premium rice', 850.00, 2.5, 'Food', 100);
```

### Add a New Store
```sql
INSERT INTO store (store_id, name, city)
VALUES ('ST_JAF', 'Jaffna Distribution Hub', 'Jaffna');
```

### Add a New Customer
```sql
INSERT INTO customer (customer_id, name, phone_no, city, address, user_name, password)
VALUES ('CUS003', 'Alice Wong', '+94773456789', 'Galle', '789 Beach Rd', 'alice', 'hash3');
```

### Create a Train Trip
```sql
INSERT INTO train_trip (trip_id, route_id, train_id, depart_time, arrive_time, capacity, store_id)
VALUES (
  'TT004',
  'R_KAN_COL',
  'TR100',
  DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 8 HOUR,
  DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 14 HOUR,
  200.0000,
  'ST_COL'
);
```

---

## 🐛 Troubleshooting

### Can't connect to MySQL
```bash
# Check if MySQL is running
brew services list | grep mysql

# Start MySQL
brew services start mysql

# Reset root password if needed
mysql_secure_installation
```

### Database doesn't exist
```bash
# Create manually
mysql -u root -p -e "CREATE DATABASE kandypack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Then run schema
mysql -u root -p kandypack < database/kandypack_schema.sql
```

### Server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

### Sequelize connection errors
```javascript
// Check config/database.js has correct settings
// Verify .env has correct MySQL credentials
// Ensure connectDB() is uncommented in server.js
```

---

## 📚 Next Steps

1. **Read the docs**:
   - `DATABASE_SETUP.md` - Detailed setup guide
   - `API_ENDPOINTS.md` - Complete API reference
   - `KANDYPACK_MIGRATION_SUMMARY.md` - Migration status

2. **Test the API**:
   - Use Postman/Insomnia to test endpoints
   - Try customer registration/login
   - Create orders and track them

3. **Implement controllers**:
   - Currently routes return placeholder responses
   - Need to implement actual database operations
   - See `controllers/authController.js` for example

4. **Build the frontend**:
   - Customer portal for placing orders
   - Admin dashboard for scheduling
   - Real-time tracking interface

---

## 🎓 Learning Resources

### KandyPack Business Rules
- Orders must be ≥7 days in advance
- Train capacity auto-managed
- Truck schedules enforce roster rules
- Driver: no consecutive deliveries
- Assistant: max 2 consecutive routes
- Weekly limits: drivers 40h, assistants 60h

### Database Features
- **Triggers**: Auto stock management, order validation
- **Procedures**: Complex scheduling logic
- **Views**: Pre-built reports
- **Constraints**: Data integrity enforcement

### API Architecture
- **Express**: Web framework
- **Sequelize**: ORM for MySQL
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **express-validator**: Input validation

---

## ✅ Checklist

- [ ] MySQL installed and running
- [ ] Database created from schema
- [ ] `.env` configured
- [ ] `npm install` completed
- [ ] `connectDB()` uncommented in server.js
- [ ] Server starts without errors
- [ ] Can access `/health` endpoint
- [ ] Can query stores/products
- [ ] Sample data visible in database
- [ ] Business rules tested

**Once all checked, you're ready to build! 🚀**

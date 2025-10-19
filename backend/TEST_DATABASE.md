# KandyPack Database Testing Guide

## Step 1: Setup MySQL Database

### Install MySQL (if not already installed)
```bash
# macOS
brew install mysql
brew services start mysql

# Verify MySQL is running
mysql --version
```

### Create the Database
```bash
# Login to MySQL
mysql -u root -p
# Enter your password when prompted

# From MySQL prompt, run:
source /Users/janudax/Computer_Science/Database_lab_backend/database/kandypack_schema.sql;

# Or from terminal:
mysql -u root -p < /Users/janudax/Computer_Science/Database_lab_backend/database/kandypack_schema.sql
```

### Verify Database Creation
```sql
-- Login to MySQL
mysql -u root -p

-- Check database exists
SHOW DATABASES;

-- Use the database
USE kandypack;

-- Check tables
SHOW TABLES;

-- Should show 16 tables:
-- admin, customer, product, store, orders, order_item
-- train, train_route, train_trip, train_shipment
-- truck, truck_route, driver, assistant, truck_schedule, truck_delivery
```

## Step 2: Update Your .env File

Your `.env` is already updated, but verify it has:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=kandypack
DB_USER=root
DB_PASSWORD=YOUR_ACTUAL_MYSQL_PASSWORD

JWT_SECRET=secure_jwt_secret_for_development_only
JWT_EXPIRE=7d
```

**IMPORTANT**: Replace `YOUR_ACTUAL_MYSQL_PASSWORD` with your real MySQL root password!

## Step 3: Start the Server

```bash
# From project root
cd /Users/janudax/Computer_Science/Database_lab_backend

# Start server
npm run dev
```

You should see:
```
Server running on port 3000 in development mode
MySQL database connection established successfully.
Connected to KandyPack database
```

## Step 4: Test API Endpoints

### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-10-02T06:39:27.000Z"
}
```

### Test 2: Get All Stores (Public)
```bash
curl http://localhost:3000/api/stores
```

Expected response:
```json
{
  "message": "Get all stores",
  "success": true
}
```

### Test 3: Get All Products (Public)
```bash
curl http://localhost:3000/api/products
```

### Test 4: API Info
```bash
curl http://localhost:3000/
```

## Step 5: Test Database Directly

### Query Sample Data
```sql
USE kandypack;

-- Check stores
SELECT * FROM store;
-- Should show 4 stores: Colombo, Negombo, Galle, Kandy

-- Check products
SELECT * FROM product;
-- Should show 3 products: Detergent, Shampoo, Soap

-- Check customers
SELECT * FROM customer;
-- Should show 2 customers: john, jane

-- Check admin
SELECT * FROM admin;
-- Should show 1 admin: ADM001

-- Check sample order
SELECT * FROM orders;
-- Should show 1 order: ORD001

-- Check order items
SELECT * FROM order_item;
-- Should show 2 items for ORD001
```

### Test Business Rules

#### Test 1: 7-Day Advance Order Rule
```sql
-- This should FAIL (only 5 days advance)
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address)
VALUES ('TEST001', 'CUS001', DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), 'Colombo', 'Test Address');
-- Expected: Error 1644: Orders must be placed at least 7 days in advance

-- This should SUCCEED (8 days advance)
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address)
VALUES ('TEST001', 'CUS001', DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), 'Colombo', 'Test Address');
-- Expected: Success!
```

#### Test 2: Automatic Stock Management
```sql
-- Check initial stock
SELECT product_id, available_quantity FROM product WHERE product_id = 'P001';
-- Shows: 200 (or less if sample order consumed some)

-- Add order item (stock auto-decreases via trigger)
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price)
VALUES ('TEST_OI1', 'TEST001', 'P001', 10, 600.00);

-- Check stock again
SELECT product_id, available_quantity FROM product WHERE product_id = 'P001';
-- Should be decreased by 10

-- Delete order item (stock auto-restores)
DELETE FROM order_item WHERE order_item_id = 'TEST_OI1';

-- Check stock
SELECT product_id, available_quantity FROM product WHERE product_id = 'P001';
-- Should be restored to original
```

#### Test 3: Train Capacity Scheduling
```sql
-- Check available train trips
SELECT trip_id, route_id, capacity, capacity_used, (capacity - capacity_used) AS available
FROM train_trip
WHERE route_id = 'R_KAN_COL';

-- Schedule an order to trains
CALL sp_schedule_order_to_trains('TEST001', 'R_KAN_COL', 'ST_COL');
-- Expected: Success! Order allocated across trips

-- Check allocations
SELECT * FROM train_shipment WHERE order_id = 'TEST001';

-- Check updated capacity
SELECT trip_id, capacity, capacity_used, (capacity - capacity_used) AS available
FROM train_trip
WHERE route_id = 'R_KAN_COL';
```

#### Test 4: Truck Schedule Roster Rules
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
-- Expected: Success!

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
-- Expected: Error 1644: Truck has overlapping schedule

-- Try consecutive driver deliveries (should fail)
CALL sp_create_truck_schedule(
  'TS_TEST3',
  'TR_COL_02',
  'TK02',
  'DRV001',  -- Same driver
  'AST002',
  DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 13 HOUR,  -- Immediately after TS_TEST1
  DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 17 HOUR
);
-- Expected: Error 1644: Driver cannot take consecutive back-to-back deliveries
```

## Step 6: Test Reporting Views

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

### Worker Hours
```sql
SELECT * FROM v_worker_hours
ORDER BY hours DESC;
```

### Truck Usage
```sql
SELECT * FROM v_truck_usage
ORDER BY hours DESC;
```

### Customer Order History
```sql
SELECT * FROM v_customer_order_history
WHERE customer_id = 'CUS001';
```

## Step 7: Generate More Test Data

### Create 40 Additional Orders
```sql
USE kandypack;
CALL sp_seed_orders_40();
```

This creates:
- 40 orders (ORD002 through ORD041)
- Distributed across customers
- Various cities
- With order items

### Verify Generated Data
```sql
-- Count orders
SELECT COUNT(*) FROM orders;
-- Should show 41 (1 original + 40 generated)

-- Check order distribution
SELECT destination_city, COUNT(*) as order_count
FROM orders
GROUP BY destination_city;

-- Check order items
SELECT COUNT(*) FROM order_item;
```

## Step 8: Test API with Real Data

Once the database has data, test the API endpoints:

### Get Stores
```bash
curl http://localhost:3000/api/stores
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Get Trucks (Admin only - will need auth)
```bash
curl http://localhost:3000/api/trucks
# Expected: 401 Unauthorized (needs admin token)
```

## Common Issues & Solutions

### Issue 1: Can't connect to MySQL
```bash
# Check if MySQL is running
brew services list | grep mysql

# Start MySQL
brew services start mysql

# Reset root password if needed
mysql_secure_installation
```

### Issue 2: Database doesn't exist
```bash
# Create manually
mysql -u root -p -e "CREATE DATABASE kandypack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Then run schema
mysql -u root -p kandypack < database/kandypack_schema.sql
```

### Issue 3: Server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Issue 4: Sequelize connection errors
- Verify `.env` has correct MySQL credentials
- Check `DB_PASSWORD` matches your MySQL root password
- Ensure `connectDB()` is uncommented in `server.js`
- Check MySQL is running: `mysql -u root -p`

### Issue 5: "Access denied for user 'root'@'localhost'"
```bash
# Reset MySQL root password
mysql -u root

# In MySQL prompt:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;

# Update .env with new password
```

## Expected Test Results

### ✅ Successful Setup Checklist
- [ ] MySQL installed and running
- [ ] Database `kandypack` created
- [ ] 16 tables visible in database
- [ ] Sample data loaded (4 stores, 3 products, 2 customers)
- [ ] `.env` configured with correct MySQL password
- [ ] Server starts without errors
- [ ] Can access `/health` endpoint
- [ ] Can query stores and products
- [ ] 7-day order rule enforced
- [ ] Stock management triggers working
- [ ] Train scheduling procedure works
- [ ] Truck roster rules enforced
- [ ] Reporting views accessible

## Next Steps After Testing

1. **Implement Controllers**: Replace placeholder responses with real database operations
2. **Add Authentication**: Implement customer/admin login with JWT
3. **Create Frontend**: Build UI for customers and admins
4. **Add More Endpoints**: Train management, driver management, reports
5. **Testing**: Write unit and integration tests
6. **Documentation**: API documentation with Swagger/Postman

## Quick Test Commands

```bash
# Terminal 1: Start server
cd /Users/janudax/Computer_Science/Database_lab_backend
npm run dev

# Terminal 2: Test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/stores
curl http://localhost:3000/api/products

# Terminal 3: MySQL queries
mysql -u root -p kandypack
# Then run SQL queries from above
```

## Success Indicators

You'll know everything is working when:
1. Server starts with "MySQL database connection established successfully"
2. `/health` endpoint returns 200 OK
3. `/api/stores` returns store data
4. MySQL queries return sample data
5. Business rule tests pass/fail as expected
6. No errors in server console

**Happy Testing! 🚀**

-- KandyPack Database Test Queries
-- Run these in MySQL to verify database setup and business rules

-- ============================================
-- 1. VERIFY DATABASE SETUP
-- ============================================

-- Check database exists
SHOW DATABASES LIKE 'kandypack';

-- Use database
USE kandypack;

-- List all tables
SHOW TABLES;

-- ============================================
-- 2. CHECK SAMPLE DATA
-- ============================================

-- Stores (should have 4)
SELECT * FROM store;

-- Products (should have 3)
SELECT product_id, name, price, space_consumption, available_quantity FROM product;

-- Customers (should have 2)
SELECT customer_id, name, city, user_name FROM customer;

-- Admin (should have 1)
SELECT admin_id, name FROM admin;

-- Orders (should have 1)
SELECT * FROM orders;

-- Order Items (should have 2)
SELECT * FROM order_item;

-- Trains
SELECT * FROM train;

-- Train Routes
SELECT * FROM train_route;

-- Train Trips
SELECT trip_id, route_id, train_id, depart_time, capacity, capacity_used FROM train_trip;

-- Trucks
SELECT * FROM truck;

-- Drivers
SELECT * FROM driver;

-- Assistants
SELECT * FROM assistant;

-- ============================================
-- 3. TEST BUSINESS RULE: 7-DAY ADVANCE ORDERS
-- ============================================

-- This should FAIL (only 5 days advance)
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address)
VALUES ('TEST_FAIL', 'CUS001', DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), 'Colombo', 'Test Address');
-- Expected Error: Orders must be placed at least 7 days in advance

-- This should SUCCEED (8 days advance)
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address, status)
VALUES ('TEST001', 'CUS001', DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), 'Colombo', '123 Test Street, Colombo', 'confirmed');
-- Expected: Success!

-- Verify order created
SELECT * FROM orders WHERE order_id = 'TEST001';

-- ============================================
-- 4. TEST AUTOMATIC STOCK MANAGEMENT
-- ============================================

-- Check initial stock for P001
SELECT product_id, name, available_quantity FROM product WHERE product_id = 'P001';

-- Add order item (stock should auto-decrease)
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price)
VALUES ('TEST_OI1', 'TEST001', 'P001', 10, 600.00);

-- Check stock after insert (should be decreased by 10)
SELECT product_id, name, available_quantity FROM product WHERE product_id = 'P001';

-- Delete order item (stock should auto-restore)
DELETE FROM order_item WHERE order_item_id = 'TEST_OI1';

-- Check stock after delete (should be restored)
SELECT product_id, name, available_quantity FROM product WHERE product_id = 'P001';

-- ============================================
-- 5. TEST TRAIN CAPACITY SCHEDULING
-- ============================================

-- Check available train trips for Kandy-Colombo route
SELECT 
    trip_id, 
    route_id, 
    train_id,
    depart_time,
    capacity, 
    capacity_used, 
    (capacity - capacity_used) AS available_capacity
FROM train_trip
WHERE route_id = 'R_KAN_COL'
ORDER BY depart_time;

-- Add more order items to TEST001
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price)
VALUES 
    ('TEST_OI2', 'TEST001', 'P001', 20, 600.00),
    ('TEST_OI3', 'TEST001', 'P002', 15, 450.00);

-- Check order space requirement
SELECT 
    oi.order_id,
    SUM(oi.quantity * p.space_consumption) AS required_space
FROM order_item oi
JOIN product p ON p.product_id = oi.product_id
WHERE oi.order_id = 'TEST001'
GROUP BY oi.order_id;

-- Schedule order to trains (auto-allocates across trips)
CALL sp_schedule_order_to_trains('TEST001', 'R_KAN_COL', 'ST_COL');

-- Check train shipments created
SELECT * FROM train_shipment WHERE order_id = 'TEST001';

-- Check updated train capacity
SELECT 
    trip_id, 
    route_id,
    capacity, 
    capacity_used, 
    (capacity - capacity_used) AS available_capacity
FROM train_trip
WHERE route_id = 'R_KAN_COL'
ORDER BY depart_time;

-- ============================================
-- 6. TEST TRUCK SCHEDULE ROSTER RULES
-- ============================================

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

-- Verify schedule created
SELECT * FROM truck_schedule WHERE truck_schedule_id = 'TS_TEST1';

-- Try overlapping truck schedule (should FAIL)
CALL sp_create_truck_schedule(
    'TS_TEST2',
    'TR_COL_01',
    'TK01',  -- Same truck
    'DRV002',
    'AST002',
    DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 10 HOUR,  -- Overlaps!
    DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 14 HOUR
);
-- Expected Error: Truck has overlapping schedule

-- Try consecutive driver deliveries (should FAIL)
CALL sp_create_truck_schedule(
    'TS_TEST3',
    'TR_COL_02',
    'TK02',
    'DRV001',  -- Same driver as TS_TEST1
    'AST002',
    DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 13 HOUR,  -- Immediately after TS_TEST1
    DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY) + INTERVAL 17 HOUR
);
-- Expected Error: Driver cannot take consecutive back-to-back deliveries

-- Create valid non-consecutive schedule
CALL sp_create_truck_schedule(
    'TS_TEST4',
    'TR_COL_02',
    'TK02',
    'DRV002',
    'AST002',
    DATE_ADD(CURRENT_DATE, INTERVAL 11 DAY) + INTERVAL 9 HOUR,  -- Different day
    DATE_ADD(CURRENT_DATE, INTERVAL 11 DAY) + INTERVAL 13 HOUR
);
-- Expected: Success!

-- ============================================
-- 7. TEST DELIVERY ASSIGNMENT
-- ============================================

-- Assign order to truck schedule
CALL sp_assign_delivery_to_schedule('DELIV_TEST1', 'TS_TEST1', 'TEST001');

-- Verify delivery created
SELECT * FROM truck_delivery WHERE delivery_id = 'DELIV_TEST1';

-- ============================================
-- 8. TEST REPORTING VIEWS
-- ============================================

-- Quarterly Sales
SELECT * FROM v_quarterly_sales;

-- Top Products by Quarter
SELECT * FROM v_quarter_top_items
WHERE year = YEAR(CURRENT_DATE) AND quarter = QUARTER(CURRENT_DATE)
ORDER BY total_qty DESC
LIMIT 10;

-- City & Route Sales
SELECT * FROM v_city_route_sales
ORDER BY total_value DESC;

-- Worker Hours
SELECT * FROM v_worker_hours
ORDER BY hours DESC
LIMIT 10;

-- Truck Usage
SELECT * FROM v_truck_usage
ORDER BY hours DESC;

-- Customer Order History
SELECT * FROM v_customer_order_history
WHERE customer_id = 'CUS001'
ORDER BY order_date DESC;

-- ============================================
-- 9. GENERATE MORE TEST DATA
-- ============================================

-- Generate 40 additional orders
CALL sp_seed_orders_40();

-- Verify orders created
SELECT COUNT(*) as total_orders FROM orders;
-- Should show 42 orders (1 original + 1 TEST001 + 40 generated)

-- Check order distribution by city
SELECT 
    destination_city, 
    COUNT(*) as order_count,
    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders
FROM orders
GROUP BY destination_city
ORDER BY order_count DESC;

-- Check order items count
SELECT COUNT(*) as total_order_items FROM order_item;

-- ============================================
-- 10. CLEANUP TEST DATA (Optional)
-- ============================================

-- Uncomment to clean up test data
-- DELETE FROM truck_delivery WHERE delivery_id = 'DELIV_TEST1';
-- DELETE FROM truck_schedule WHERE truck_schedule_id IN ('TS_TEST1', 'TS_TEST4');
-- DELETE FROM train_shipment WHERE order_id = 'TEST001';
-- DELETE FROM order_item WHERE order_id = 'TEST001';
-- DELETE FROM orders WHERE order_id = 'TEST001';

-- ============================================
-- SUMMARY QUERIES
-- ============================================

-- Database statistics
SELECT 
    'Stores' as entity, COUNT(*) as count FROM store
UNION ALL
SELECT 'Products', COUNT(*) FROM product
UNION ALL
SELECT 'Customers', COUNT(*) FROM customer
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_item
UNION ALL
SELECT 'Trains', COUNT(*) FROM train
UNION ALL
SELECT 'Train Trips', COUNT(*) FROM train_trip
UNION ALL
SELECT 'Trucks', COUNT(*) FROM truck
UNION ALL
SELECT 'Drivers', COUNT(*) FROM driver
UNION ALL
SELECT 'Assistants', COUNT(*) FROM assistant
UNION ALL
SELECT 'Truck Schedules', COUNT(*) FROM truck_schedule;

-- Order status distribution
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status
ORDER BY count DESC;

-- Product stock levels
SELECT 
    product_id,
    name,
    available_quantity,
    CASE 
        WHEN available_quantity = 0 THEN 'Out of Stock'
        WHEN available_quantity < 50 THEN 'Low Stock'
        ELSE 'In Stock'
    END as stock_status
FROM product
ORDER BY available_quantity ASC;

-- ============================================
-- END OF TEST QUERIES
-- ============================================

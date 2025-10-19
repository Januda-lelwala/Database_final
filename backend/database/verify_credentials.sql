-- ============================================
-- KandyPack - Verify Test Credentials
-- ============================================

USE kandypack;

-- Check all user tables exist
SELECT 'Checking database tables...' AS status;
SHOW TABLES LIKE '%admin%';
SHOW TABLES LIKE '%customer%';
SHOW TABLES LIKE '%driver%';
SHOW TABLES LIKE '%assistant%';

-- ============================================
-- ADMIN ACCOUNTS
-- ============================================
SELECT '==================== ADMIN ACCOUNTS ====================' AS '';
SELECT 
    admin_id AS 'Admin ID',
    name AS 'Name',
    LEFT(password, 20) AS 'Password (Preview)',
    created_at AS 'Created'
FROM admin
ORDER BY admin_id;

SELECT CONCAT('Total Admins: ', COUNT(*)) AS 'Summary' FROM admin;

-- ============================================
-- CUSTOMER ACCOUNTS
-- ============================================
SELECT '==================== CUSTOMER ACCOUNTS ====================' AS '';
SELECT 
    customer_id AS 'Customer ID',
    name AS 'Name',
    user_name AS 'Username',
    city AS 'City',
    phone_no AS 'Phone',
    LEFT(password, 30) AS 'Password Hash (Preview)'
FROM customer
ORDER BY customer_id;

SELECT CONCAT('Total Customers: ', COUNT(*)) AS 'Summary' FROM customer;

-- ============================================
-- DRIVER ACCOUNTS
-- ============================================
SELECT '==================== DRIVER ACCOUNTS ====================' AS '';
SELECT 
    driver_id AS 'Driver ID',
    name AS 'Name',
    phone_no AS 'Phone',
    email AS 'Email',
    LEFT(address, 30) AS 'Address'
FROM driver
ORDER BY driver_id;

SELECT CONCAT('Total Drivers: ', COUNT(*)) AS 'Summary' FROM driver;

-- Note: Drivers don't have passwords in base schema
SELECT 'NOTE: Driver table does not have password column by default' AS 'Warning';

-- ============================================
-- ASSISTANT ACCOUNTS
-- ============================================
SELECT '==================== ASSISTANT ACCOUNTS ====================' AS '';
SELECT 
    assistant_id AS 'Assistant ID',
    name AS 'Name',
    phone_no AS 'Phone',
    email AS 'Email',
    LEFT(address, 30) AS 'Address'
FROM assistant
ORDER BY assistant_id;

SELECT CONCAT('Total Assistants: ', COUNT(*)) AS 'Summary' FROM assistant;

-- Note: Assistants don't have passwords in base schema
SELECT 'NOTE: Assistant table does not have password column by default' AS 'Warning';

-- ============================================
-- TEST CREDENTIALS SUMMARY
-- ============================================
SELECT '==================== CREDENTIALS SUMMARY ====================' AS '';

SELECT 'Customer Login Test:' AS 'Test Type',
       'Username: john, Password: password123' AS 'Credentials',
       'CUS001' AS 'Expected ID';

SELECT 'Customer Login Test 2:' AS 'Test Type',
       'Username: jane, Password: password456' AS 'Credentials',
       'CUS002' AS 'Expected ID';

SELECT 'Admin Login Test:' AS 'Test Type',
       'Admin ID: ADM001, Password: admin123' AS 'Credentials',
       'System Administrator' AS 'Expected Name';

-- ============================================
-- CHECK PASSWORD HASHING
-- ============================================
SELECT '==================== PASSWORD CHECK ====================' AS '';

SELECT 
    user_name AS 'Username',
    CASE 
        WHEN password LIKE '$2a$%' THEN 'Bcrypt (Good)'
        WHEN password LIKE '$2b$%' THEN 'Bcrypt (Good)'
        WHEN LENGTH(password) < 30 THEN 'Plain Text (INSECURE!)'
        ELSE 'Unknown Hash'
    END AS 'Password Type',
    LENGTH(password) AS 'Hash Length'
FROM customer
ORDER BY user_name;

-- ============================================
-- SAMPLE DATA CHECK
-- ============================================
SELECT '==================== SAMPLE DATA ====================' AS '';

SELECT 'Products:' AS 'Data Type', COUNT(*) AS 'Count' FROM product
UNION ALL
SELECT 'Stores:', COUNT(*) FROM store
UNION ALL
SELECT 'Orders:', COUNT(*) FROM orders
UNION ALL
SELECT 'Trucks:', COUNT(*) FROM truck
UNION ALL
SELECT 'Train Routes:', COUNT(*) FROM train_route
UNION ALL
SELECT 'Train Trips:', COUNT(*) FROM train_trip;

-- ============================================
-- READY FOR TESTING?
-- ============================================
SELECT '==================== READY FOR TESTING? ====================' AS '';

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM admin) >= 1 THEN '✓'
        ELSE '✗'
    END AS 'Has Admin',
    CASE 
        WHEN (SELECT COUNT(*) FROM customer WHERE password LIKE '$2%') >= 1 THEN '✓'
        ELSE '✗'
    END AS 'Has Customer with Bcrypt',
    CASE 
        WHEN (SELECT COUNT(*) FROM driver) >= 2 THEN '✓'
        ELSE '✗'
    END AS 'Has Drivers',
    CASE 
        WHEN (SELECT COUNT(*) FROM assistant) >= 2 THEN '✓'
        ELSE '✗'
    END AS 'Has Assistants',
    CASE 
        WHEN (SELECT COUNT(*) FROM product) >= 3 THEN '✓'
        ELSE '✗'
    END AS 'Has Products',
    CASE 
        WHEN (SELECT COUNT(*) FROM store) >= 4 THEN '✓'
        ELSE '✗'
    END AS 'Has Stores';

SELECT '✓ = Ready, ✗ = Missing Data' AS 'Legend';

-- ============================================
-- END OF CHECK
-- ============================================
SELECT 'Database credential check complete!' AS '';
SELECT 'See TEST_CREDENTIALS.md for full details' AS '';

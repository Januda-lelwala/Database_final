-- Test Driver and Assistant Authentication Setup
-- This script verifies the credential system is working

USE kandypack;

-- Check if columns exist
SHOW COLUMNS FROM driver LIKE 'user_name';
SHOW COLUMNS FROM driver LIKE 'password';
SHOW COLUMNS FROM driver LIKE 'must_change_password';

SHOW COLUMNS FROM assistant LIKE 'user_name';
SHOW COLUMNS FROM assistant LIKE 'password';
SHOW COLUMNS FROM assistant LIKE 'must_change_password';

-- View existing drivers (without showing password hashes)
SELECT driver_id, name, user_name, email, phone_no, must_change_password 
FROM driver 
ORDER BY driver_id;

-- View existing assistants (without showing password hashes)
SELECT assistant_id, name, user_name, email, phone_no, must_change_password 
FROM assistant 
ORDER BY assistant_id;

-- Count of employees
SELECT 
  (SELECT COUNT(*) FROM driver) as total_drivers,
  (SELECT COUNT(*) FROM assistant) as total_assistants;

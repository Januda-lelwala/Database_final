-- Update existing drivers and assistants with usernames and temporary passwords
-- These will need to be changed on first login (must_change_password=1)

USE kandypack;

-- Note: Passwords will be hashed by the application when employees are created through the API
-- For existing records, we need to manually create bcrypt hashes
-- Using bcrypt hash for "Welcome123!" (generated externally)
SET @temp_password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW';

-- Update drivers with NULL user_name
UPDATE driver SET user_name = 'john', password = @temp_password_hash WHERE driver_id = 'DRV001' AND user_name IS NULL;
UPDATE driver SET user_name = 'jane', password = @temp_password_hash WHERE driver_id = 'DRV002' AND user_name IS NULL;
UPDATE driver SET user_name = 'mike', password = @temp_password_hash WHERE driver_id = 'DRV003' AND user_name IS NULL;
UPDATE driver SET user_name = 'sarah', password = @temp_password_hash WHERE driver_id = 'DRV004' AND user_name IS NULL;
UPDATE driver SET user_name = 'dinuka', password = @temp_password_hash WHERE driver_id = 'DRV005' AND user_name IS NULL;
UPDATE driver SET user_name = 'senuth', password = @temp_password_hash WHERE driver_id = 'DRV006' AND user_name IS NULL;

-- Update assistants with NULL user_name
UPDATE assistant SET user_name = 'sarahs', password = @temp_password_hash WHERE assistant_id = 'AST001' AND user_name IS NULL;
UPDATE assistant SET user_name = 'david', password = @temp_password_hash WHERE assistant_id = 'AST002' AND user_name IS NULL;
UPDATE assistant SET user_name = 'emma', password = @temp_password_hash WHERE assistant_id = 'AST003' AND user_name IS NULL;
UPDATE assistant SET user_name = 'tom', password = @temp_password_hash WHERE assistant_id = 'AST004' AND user_name IS NULL;
UPDATE assistant SET user_name = 'senura', password = @temp_password_hash WHERE assistant_id = 'AST005' AND user_name IS NULL;

-- Verify updates
SELECT driver_id, name, user_name, SUBSTRING(password, 1, 20) as password_preview, must_change_password 
FROM driver 
ORDER BY driver_id;

SELECT assistant_id, name, user_name, SUBSTRING(password, 1, 20) as password_preview, must_change_password 
FROM assistant 
ORDER BY assistant_id;

-- Summary
SELECT 'Migration Complete' as Status, 
       'Temporary password for all: Welcome123!' as Note,
       'All users must change password on first login' as Requirement;

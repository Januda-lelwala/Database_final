-- Add user_name and password fields to driver and assistant tables
ALTER TABLE driver ADD COLUMN user_name VARCHAR(50) UNIQUE AFTER email;
ALTER TABLE driver ADD COLUMN password VARCHAR(255) AFTER user_name;
ALTER TABLE driver ADD COLUMN must_change_password BOOLEAN DEFAULT 1 AFTER password;

ALTER TABLE assistant ADD COLUMN user_name VARCHAR(50) UNIQUE AFTER email;
ALTER TABLE assistant ADD COLUMN password VARCHAR(255) AFTER user_name;
ALTER TABLE assistant ADD COLUMN must_change_password BOOLEAN DEFAULT 1 AFTER password;

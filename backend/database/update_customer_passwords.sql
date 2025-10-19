-- Update customer passwords with bcrypt hashes
-- CUS001: username=john, password=password123
-- CUS002: username=jane, password=password456

UPDATE customer SET password = '$2a$12$C4/JjIS7gx2Ms79JxYbjfOX/czD44w9gdSgXuZ9cqpO5OZ35rlPxq' WHERE customer_id = 'CUS001';
UPDATE customer SET password = '$2a$12$NEJuc03OznS.MLKWPUSQWOCP.80EedlIzSEeo.WIRT1Wwc7PGPouS' WHERE customer_id = 'CUS002';

SELECT 'Customer passwords updated' AS status;
SELECT customer_id, name, user_name, LEFT(password, 20) AS password_preview FROM customer;

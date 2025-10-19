-- Add customers from schema with bcrypt hashed passwords
-- john: password123
-- jane: password456

INSERT INTO customer (customer_id, name, phone_no, city, address, user_name, password) VALUES
('CUS004','John Doe','+94771234567','Colombo','123 Galle Rd, Colombo 03','john','$2a$12$V59rG4xfbrLYHfR0FGRZ/OZMVQcCsutD9ONLh/2ceQuy8OGXfMqxu'),
('CUS005','Jane Smith','+94772345678','Kandy','456 Peradeniya Rd, Kandy','jane','$2a$12$tmkgo6kZilB8jG/F93IAuO8hOEKTXMQOOIRSWpmmPjBPu7Hqzs3xa')
ON DUPLICATE KEY UPDATE password=VALUES(password);

SELECT 'Schema customers added' AS status;
SELECT customer_id, name, user_name, city FROM customer ORDER BY customer_id;

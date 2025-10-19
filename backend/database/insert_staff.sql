
INSERT INTO driver (driver_id, name, phone_no, email, address) VALUES
('DRV001', 'John Driver', '+94770000001', 'john.driver@kandypack.com', '123 Driver Street, Colombo'),
('DRV002', 'Jane Transport', '+94770000002', 'jane.transport@kandypack.com', '456 Transport Ave, Kandy'),
('DRV003', 'Mike Wilson', '+94770000005', 'mike.wilson@kandypack.com', '789 Road Lane, Galle'),
('DRV004', 'Sarah Johnson', '+94770000006', 'sarah.j@kandypack.com', '321 Highway St, Negombo')
ON DUPLICATE KEY UPDATE name=VALUES(name), phone_no=VALUES(phone_no), email=VALUES(email), address=VALUES(address);


INSERT INTO assistant (assistant_id, name, phone_no, email, address) VALUES
('AST001', 'Sarah Support', '+94770000003', 'sarah.support@kandypack.com', '111 Support St, Colombo'),
('AST002', 'David Logistics', '+94770000004', 'david.logistics@kandypack.com', '222 Logistics Ave, Kandy'),
('AST003', 'Emma Helper', '+94770000007', 'emma.helper@kandypack.com', '333 Helper Lane, Galle'),
('AST004', 'Tom Assistant', '+94770000008', 'tom.assist@kandypack.com', '444 Assist Road, Negombo')
ON DUPLICATE KEY UPDATE name=VALUES(name), phone_no=VALUES(phone_no), email=VALUES(email), address=VALUES(address);

SELECT 'Drivers inserted/updated' AS status;
SELECT * FROM driver;

SELECT 'Assistants inserted/updated' AS status;
SELECT * FROM assistant;

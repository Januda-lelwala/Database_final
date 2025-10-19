-- Insert additional admins
INSERT INTO admin (admin_id, name, password) VALUES
('ADM002', 'System Admin', 'admin123'),
('ADM003', 'Operations Manager', 'admin123')
ON DUPLICATE KEY UPDATE name=VALUES(name);

SELECT 'Admins inserted/updated' AS status;
SELECT admin_id, name, created_at FROM admin;

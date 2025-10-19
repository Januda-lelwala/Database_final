-- Insert Trucks
INSERT INTO truck (truck_id, license_plate, capacity) VALUES
('TK01', 'WP-1234', 60.0),
('TK02', 'WP-5678', 60.0),
('TK03', 'WP-9012', 80.0),
('TK04', 'CP-3456', 70.0),
('TK05', 'KY-7890', 65.0)
ON DUPLICATE KEY UPDATE license_plate=VALUES(license_plate), capacity=VALUES(capacity);

-- Insert Trains
INSERT INTO train (train_id, capacity, notes) VALUES
('TR100', 200.0000, 'Bulk cargo'),
('TR200', 150.0000, 'Mixed cargo'),
('TR300', 180.0000, 'Express cargo')
ON DUPLICATE KEY UPDATE capacity=VALUES(capacity), notes=VALUES(notes);

SELECT 'Trucks inserted/updated' AS status;
SELECT * FROM truck;

SELECT 'Trains inserted/updated' AS status;
SELECT * FROM train;

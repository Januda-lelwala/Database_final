-- =========================================================
-- KANDYPACK - RAIL & ROAD DISTRIBUTION DB (MySQL 8.0+)
-- Implements: ERD (Customer/Order/Product/Trains/Trucks/Stores/Routes)
-- and Project rules: capacity-aware train scheduling, non-overlap rosters,
-- no consecutive driver deliveries, assistant max 2 consecutive routes,
-- weekly hour limits, orders 7 days in advance, & reports.
-- =========================================================

-- Safety & defaults
SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET sql_safe_updates = 0;

-- ---------------------------------------------------------
-- 0) Database
-- ---------------------------------------------------------
DROP DATABASE IF EXISTS kandypack;
CREATE DATABASE IF NOT EXISTS kandypack
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE kandypack;

-- ---------------------------------------------------------
-- 1) Core reference (Admin/Customer/Product/Store)
-- ---------------------------------------------------------
CREATE TABLE admin (
  admin_id    VARCHAR(20) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE customer (
  customer_id VARCHAR(40) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  phone_no    VARCHAR(20),
  city        VARCHAR(80),
  address     VARCHAR(255),
  user_name   VARCHAR(50) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- space_consumption = "units of train space per one item"
CREATE TABLE product (
  product_id        VARCHAR(40) PRIMARY KEY,
  name              VARCHAR(120) NOT NULL,
  description       TEXT,
  price             DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  space_consumption DECIMAL(10,4) NOT NULL CHECK (space_consumption > 0),
  category          VARCHAR(60),
  available_quantity INT NOT NULL DEFAULT 0 CHECK (available_quantity >= 0)
) ENGINE=InnoDB;

-- Stores near stations (destination hubs)
CREATE TABLE store (
  store_id  VARCHAR(40) PRIMARY KEY,
  name      VARCHAR(120) NOT NULL,
  city      VARCHAR(80)  NOT NULL
) ENGINE=InnoDB;

CREATE INDEX idx_store_city ON store(city);

-- ---------------------------------------------------------
-- 2) Orders & items
-- ---------------------------------------------------------
CREATE TABLE orders (
  order_id            VARCHAR(40) PRIMARY KEY,
  customer_id         VARCHAR(40) NOT NULL,
  order_date          DATETIME NOT NULL,
  destination_city    VARCHAR(80) NOT NULL,
  destination_address VARCHAR(255) NOT NULL,
  status ENUM('pending','confirmed','scheduled','in_transit','delivered','cancelled') DEFAULT 'pending',
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status   ON orders(status);
CREATE INDEX idx_orders_city     ON orders(destination_city);

CREATE TABLE order_item (
  order_item_id VARCHAR(40) PRIMARY KEY,
  order_id      VARCHAR(40) NOT NULL,
  product_id    VARCHAR(40) NOT NULL,
  quantity      INT NOT NULL CHECK (quantity > 0),
  unit_price    DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  CONSTRAINT fk_order_item_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_order_item_product
    FOREIGN KEY (product_id) REFERENCES product(product_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_order_item_order   ON order_item(order_id);
CREATE INDEX idx_order_item_product ON order_item(product_id);

-- ---------------------------------------------------------
-- 3) Rail layer (train routes, trains, train trips, shipments)
-- ---------------------------------------------------------
-- Train routes (origin/destination; optional via-stops as CSV text)
CREATE TABLE train_route (
  route_id     VARCHAR(40) PRIMARY KEY,
  start_city   VARCHAR(80) NOT NULL,
  end_city     VARCHAR(80) NOT NULL,
  destinations TEXT
) ENGINE=InnoDB;

-- Trains (rolling stock)
CREATE TABLE train (
  train_id   VARCHAR(40) PRIMARY KEY,
  capacity   DECIMAL(12,4) NOT NULL CHECK (capacity > 0), -- total space units per trip
  notes      VARCHAR(255),
  route_id   VARCHAR(40) NULL, -- FK to train_route (one route can have many trains)
  begin_time TIME NULL,
  CONSTRAINT fk_train_route FOREIGN KEY (route_id) REFERENCES train_route(route_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Concrete departures (a "trip"): capacity is allocated per trip
CREATE TABLE train_trip (
  trip_id     VARCHAR(40) PRIMARY KEY,
  route_id    VARCHAR(40) NOT NULL,
  train_id    VARCHAR(40) NOT NULL,
  depart_time DATETIME NOT NULL,
  arrive_time DATETIME NOT NULL,
  capacity    DECIMAL(12,4) NOT NULL CHECK (capacity > 0),
  capacity_used DECIMAL(12,4) NOT NULL DEFAULT 0 CHECK (capacity_used >= 0),
  store_id    VARCHAR(40) NOT NULL, -- store at destination station
  CONSTRAINT fk_tt_route FOREIGN KEY (route_id) REFERENCES train_route(route_id) ON DELETE RESTRICT,
  CONSTRAINT fk_tt_train FOREIGN KEY (train_id) REFERENCES train(train_id)       ON DELETE RESTRICT,
  CONSTRAINT fk_tt_store FOREIGN KEY (store_id) REFERENCES store(store_id)       ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_train_trip_times ON train_trip(depart_time, arrive_time);
CREATE INDEX idx_train_trip_route ON train_trip(route_id);

-- Allocation of orders to train trips (may split across multiple trips)
CREATE TABLE train_shipment (
  shipment_id VARCHAR(40) PRIMARY KEY,
  order_id    VARCHAR(40) NOT NULL,
  trip_id     VARCHAR(40) NOT NULL,
  allocated_space DECIMAL(12,4) NOT NULL CHECK (allocated_space > 0),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ts_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  CONSTRAINT fk_ts_trip  FOREIGN KEY (trip_id)  REFERENCES train_trip(trip_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_train_shipment_order ON train_shipment(order_id);
CREATE INDEX idx_train_shipment_trip  ON train_shipment(trip_id);

-- ---------------------------------------------------------
-- 4) Road layer (trucks, routes, schedule, deliveries)
-- ---------------------------------------------------------
CREATE TABLE truck (
  truck_id       VARCHAR(40) PRIMARY KEY,
  license_plate  VARCHAR(40) UNIQUE NOT NULL,
  capacity       DECIMAL(12,4) NOT NULL CHECK (capacity > 0)
) ENGINE=InnoDB;

CREATE TABLE truck_route (
  route_id   VARCHAR(40) PRIMARY KEY,
  store_id   VARCHAR(40) NOT NULL,
  route_name VARCHAR(120) NOT NULL,
  max_minutes INT NOT NULL DEFAULT 240 CHECK (max_minutes > 0),
  CONSTRAINT fk_tr_store FOREIGN KEY (store_id) REFERENCES store(store_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_truck_route_store ON truck_route(store_id);

-- People
CREATE TABLE driver (
  driver_id VARCHAR(40) PRIMARY KEY,
  name      VARCHAR(120) NOT NULL,
  address   TEXT,
  phone_no  VARCHAR(20),
  email     VARCHAR(120) UNIQUE
) ENGINE=InnoDB;

CREATE TABLE assistant (
  assistant_id VARCHAR(40) PRIMARY KEY,
  name         VARCHAR(120) NOT NULL,
  address      TEXT,
  phone_no     VARCHAR(20),
  email        VARCHAR(120) UNIQUE
) ENGINE=InnoDB;

-- Truck schedules (one schedule = one run of a route)
CREATE TABLE truck_schedule (
  truck_schedule_id VARCHAR(40) PRIMARY KEY,
  route_id          VARCHAR(40) NOT NULL,
  truck_id          VARCHAR(40) NOT NULL,
  driver_id         VARCHAR(40) NOT NULL,
  assistant_id      VARCHAR(40) NOT NULL,
  start_time        DATETIME NOT NULL,
  end_time          DATETIME NOT NULL,
  CONSTRAINT fk_ts_route     FOREIGN KEY (route_id)     REFERENCES truck_route(route_id)   ON DELETE RESTRICT,
  CONSTRAINT fk_ts_truck     FOREIGN KEY (truck_id)     REFERENCES truck(truck_id)         ON DELETE RESTRICT,
  CONSTRAINT fk_ts_driver    FOREIGN KEY (driver_id)    REFERENCES driver(driver_id)       ON DELETE RESTRICT,
  CONSTRAINT fk_ts_assistant FOREIGN KEY (assistant_id) REFERENCES assistant(assistant_id) ON DELETE RESTRICT,
  CONSTRAINT chk_ts_time CHECK (end_time > start_time)
) ENGINE=InnoDB;

CREATE INDEX idx_truck_schedule_time     ON truck_schedule(start_time, end_time);
CREATE INDEX idx_truck_schedule_truck    ON truck_schedule(truck_id);
CREATE INDEX idx_truck_schedule_driver   ON truck_schedule(driver_id);
CREATE INDEX idx_truck_schedule_assistant ON truck_schedule(assistant_id);

-- Last-mile deliveries from a schedule to orders
CREATE TABLE truck_delivery (
  delivery_id        VARCHAR(40) PRIMARY KEY,
  truck_schedule_id  VARCHAR(40) NOT NULL,
  order_id           VARCHAR(40) NOT NULL,
  delivered_at       DATETIME NULL,
  CONSTRAINT fk_td_ts   FOREIGN KEY (truck_schedule_id) REFERENCES truck_schedule(truck_schedule_id) ON DELETE CASCADE,
  CONSTRAINT fk_td_order FOREIGN KEY (order_id)          REFERENCES orders(order_id)                 ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_truck_delivery_order ON truck_delivery(order_id);

-- ---------------------------------------------------------
-- 5) Derived helpers & integrity: stock + order totals
-- ---------------------------------------------------------
-- order totals by price & space requirement
CREATE OR REPLACE VIEW v_order_totals AS
SELECT
  oi.order_id,
  SUM(oi.quantity * oi.unit_price)             AS order_amount,
  SUM(oi.quantity * p.space_consumption)       AS required_space
FROM order_item oi
JOIN product p ON p.product_id = oi.product_id
GROUP BY oi.order_id;

-- Reduce/restore stock when order_items change
DELIMITER //
CREATE TRIGGER trg_order_item_before_insert
BEFORE INSERT ON order_item
FOR EACH ROW
BEGIN
  DECLARE stock INT;
  SELECT available_quantity INTO stock
  FROM product WHERE product_id = NEW.product_id FOR UPDATE;
  IF stock IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Product not found'; END IF;
  IF stock < NEW.quantity THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Insufficient stock'; END IF;
  UPDATE product SET available_quantity = available_quantity - NEW.quantity
  WHERE product_id = NEW.product_id;
END;
//

CREATE TRIGGER trg_order_item_before_update
BEFORE UPDATE ON order_item
FOR EACH ROW
BEGIN
  DECLARE delta INT;
  IF OLD.product_id <> NEW.product_id THEN
    UPDATE product SET available_quantity = available_quantity + OLD.quantity WHERE product_id = OLD.product_id;
    DECLARE ns INT;
    SELECT available_quantity INTO ns FROM product WHERE product_id = NEW.product_id FOR UPDATE;
    IF ns < NEW.quantity THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Insufficient stock for new product'; END IF;
    UPDATE product SET available_quantity = available_quantity - NEW.quantity WHERE product_id = NEW.product_id;
  ELSE
    SET delta = NEW.quantity - OLD.quantity;
    IF delta > 0 THEN
      DECLARE cs INT;
      SELECT available_quantity INTO cs FROM product WHERE product_id = NEW.product_id FOR UPDATE;
      IF cs < delta THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Insufficient stock for increased quantity'; END IF;
      UPDATE product SET available_quantity = available_quantity - delta WHERE product_id = NEW.product_id;
    ELSEIF delta < 0 THEN
      UPDATE product SET available_quantity = available_quantity - delta WHERE product_id = NEW.product_id; -- delta negative
    END IF;
  END IF;
END;
//

CREATE TRIGGER trg_order_item_before_delete
BEFORE DELETE ON order_item
FOR EACH ROW
BEGIN
  UPDATE product SET available_quantity = available_quantity + OLD.quantity WHERE product_id = OLD.product_id;
END;
//
DELIMITER ;

-- Orders must be placed ≥7 days in advance (vs. train + truck planning)
DELIMITER //
CREATE TRIGGER trg_orders_min_lead_time
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  IF NEW.order_date < (CURRENT_DATE + INTERVAL 7 DAY) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Orders must be placed at least 7 days in advance';
  END IF;
END;
//
DELIMITER ;

-- ---------------------------------------------------------
-- 6) Roster/business rules implemented via procedures
-- ---------------------------------------------------------
-- Utility: time overlap check
DROP FUNCTION IF EXISTS fn_times_overlap;
DELIMITER //
CREATE FUNCTION fn_times_overlap(a_start DATETIME, a_end DATETIME, b_start DATETIME, b_end DATETIME)
RETURNS TINYINT DETERMINISTIC
RETURN (a_start < b_end) AND (b_start < a_end);
//
DELIMITER ;

-- Procedure: create a truck schedule with constraints
-- - No resource overlap (truck/driver/assistant)
-- - Driver cannot have consecutive deliveries (must have at least one other schedule in between the driver's last and this one)
-- - Assistant max 2 consecutive routes
-- - Weekly limits: drivers 40h, assistants 60h
DROP PROCEDURE IF EXISTS sp_create_truck_schedule;
DELIMITER //
CREATE PROCEDURE sp_create_truck_schedule(
  IN p_truck_schedule_id VARCHAR(40),
  IN p_route_id          VARCHAR(40),
  IN p_truck_id          VARCHAR(40),
  IN p_driver_id         VARCHAR(40),
  IN p_assistant_id      VARCHAR(40),
  IN p_start_time        DATETIME,
  IN p_end_time          DATETIME
)
BEGIN
  DECLARE wk_start DATE;
  DECLARE wk_end   DATE;

  IF p_end_time <= p_start_time THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='end_time must be after start_time';
  END IF;

  -- No overlapping resource allocations
  IF EXISTS (
    SELECT 1 FROM truck_schedule s
    WHERE s.truck_id = p_truck_id
      AND fn_times_overlap(p_start_time, p_end_time, s.start_time, s.end_time)
  ) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Truck has overlapping schedule'; END IF;

  IF EXISTS (
    SELECT 1 FROM truck_schedule s
    WHERE s.driver_id = p_driver_id
      AND fn_times_overlap(p_start_time, p_end_time, s.start_time, s.end_time)
  ) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Driver has overlapping schedule'; END IF;

  IF EXISTS (
    SELECT 1 FROM truck_schedule s
    WHERE s.assistant_id = p_assistant_id
      AND fn_times_overlap(p_start_time, p_end_time, s.start_time, s.end_time)
  ) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Assistant has overlapping schedule'; END IF;

  -- Driver: no consecutive deliveries (must not be immediately adjacent)
  IF EXISTS (
    SELECT 1 FROM truck_schedule s
    WHERE s.driver_id = p_driver_id
      AND (s.end_time = p_start_time OR s.start_time = p_end_time)
  ) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Driver cannot take consecutive back-to-back deliveries'; END IF;

  -- Assistant: max two consecutive routes (disallow 3rd in a row if times are adjacent)
  IF EXISTS (
    SELECT 1 FROM (
      SELECT s1.start_time AS t1, s2.start_time AS t2
      FROM truck_schedule s1
      JOIN truck_schedule s2 ON s2.assistant_id = s1.assistant_id
                            AND s2.start_time = s1.end_time
      WHERE s1.assistant_id = p_assistant_id
    ) q
    WHERE EXISTS (
      SELECT 1 FROM truck_schedule s3
      WHERE s3.assistant_id = p_assistant_id
        AND s3.start_time = q.t2
        AND (p_start_time = s3.end_time OR p_start_time = q.t2) -- would make it 3rd consecutive
    )
  ) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Assistant cannot be scheduled for more than 2 consecutive routes'; END IF;

  -- Weekly limits
  SET wk_start = DATE_SUB(DATE(p_start_time), INTERVAL (WEEKDAY(p_start_time)) DAY);
  SET wk_end   = DATE_ADD(wk_start, INTERVAL 7 DAY);

  -- Driver 40h/week
  IF (
    SELECT COALESCE(SUM(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time)),0)
    FROM truck_schedule s
    WHERE s.driver_id = p_driver_id
      AND s.start_time >= wk_start AND s.start_time < wk_end
  ) + TIMESTAMPDIFF(MINUTE, p_start_time, p_end_time) > 40*60
  THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Driver weekly limit (40h) exceeded'; END IF;

  -- Assistant 60h/week
  IF (
    SELECT COALESCE(SUM(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time)),0)
    FROM truck_schedule s
    WHERE s.assistant_id = p_assistant_id
      AND s.start_time >= wk_start AND s.start_time < wk_end
  ) + TIMESTAMPDIFF(MINUTE, p_start_time, p_end_time) > 60*60
  THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Assistant weekly limit (60h) exceeded'; END IF;

  -- All good -> insert
  INSERT INTO truck_schedule (truck_schedule_id, route_id, truck_id, driver_id, assistant_id, start_time, end_time)
  VALUES (p_truck_schedule_id, p_route_id, p_truck_id, p_driver_id, p_assistant_id, p_start_time, p_end_time);
END;
//
DELIMITER ;

-- Procedure: capacity-aware train allocation
-- Splits an order across future trips on the matching route/store until fully allocated.
DROP PROCEDURE IF EXISTS sp_schedule_order_to_trains;
DELIMITER //
CREATE PROCEDURE sp_schedule_order_to_trains(IN p_order_id VARCHAR(40), IN p_route_id VARCHAR(40), IN p_store_id VARCHAR(40))
BEGIN
  DECLARE req DECIMAL(12,4);
  DECLARE left_req DECIMAL(12,4);
  DECLARE done INT DEFAULT 0;

  -- Compute required train space for the order
  SELECT required_space INTO req FROM v_order_totals WHERE order_id = p_order_id;
  IF req IS NULL OR req <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Order has no items / required space';
  END IF;
  SET left_req = req;

  -- Iterate upcoming trips in time order
  DECLARE cur_trip VARCHAR(40);
  DECLARE cap DECIMAL(12,4);
  DECLARE used DECIMAL(12,4);

  DECLARE trip_cur CURSOR FOR
    SELECT t.trip_id
    FROM train_trip t
    WHERE t.route_id = p_route_id AND t.store_id = p_store_id
      AND t.depart_time >= CURRENT_TIMESTAMP
    ORDER BY t.depart_time ASC;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN trip_cur;
  read_loop: LOOP
    FETCH trip_cur INTO cur_trip;
    IF done = 1 THEN LEAVE read_loop; END IF;

    SELECT capacity, capacity_used INTO cap, used FROM train_trip WHERE trip_id = cur_trip FOR UPDATE;
    IF (cap - used) > 0 THEN
      IF left_req <= (cap - used) THEN
        INSERT INTO train_shipment (shipment_id, order_id, trip_id, allocated_space)
        VALUES (UUID(), p_order_id, cur_trip, left_req);
        UPDATE train_trip SET capacity_used = capacity_used + left_req WHERE trip_id = cur_trip;
        SET left_req = 0;
        LEAVE read_loop;
      ELSE
        INSERT INTO train_shipment (shipment_id, order_id, trip_id, allocated_space)
        VALUES (UUID(), p_order_id, cur_trip, cap - used);
        UPDATE train_trip SET capacity_used = capacity_used + (cap - used) WHERE trip_id = cur_trip;
        SET left_req = left_req - (cap - used);
      END IF;
    END IF;
  END LOOP;
  CLOSE trip_cur;

  IF left_req > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Insufficient upcoming train capacity to fully schedule order';
  ELSE
    UPDATE orders SET status = 'scheduled', updated_at = CURRENT_TIMESTAMP WHERE order_id = p_order_id;
  END IF;
END;
//
DELIMITER ;

-- ---------------------------------------------------------
-- 7) Reporting (per project brief)
-- ---------------------------------------------------------
-- 1. Quarterly sales report (value & space volume)
CREATE OR REPLACE VIEW v_quarterly_sales AS
SELECT
  CONCAT(YEAR(o.order_date), '-Q', QUARTER(o.order_date)) AS quarter,
  SUM(v.order_amount)  AS total_value,
  SUM(v.required_space) AS total_space_units,
  COUNT(DISTINCT o.order_id) AS orders
FROM orders o
JOIN v_order_totals v ON v.order_id = o.order_id
GROUP BY YEAR(o.order_date), QUARTER(o.order_date);

-- 2. Most ordered items in a given quarter
CREATE OR REPLACE VIEW v_quarter_top_items AS
SELECT
  YEAR(o.order_date) AS year,
  QUARTER(o.order_date) AS quarter,
  oi.product_id,
  p.name AS product_name,
  SUM(oi.quantity) AS total_qty
FROM order_item oi
JOIN orders o ON o.order_id = oi.order_id
JOIN product p ON p.product_id = oi.product_id
GROUP BY YEAR(o.order_date), QUARTER(o.order_date), oi.product_id, p.name;

-- 3. City-wise and route-wise sales
CREATE OR REPLACE VIEW v_city_route_sales AS
SELECT
  o.destination_city,
  tr.route_name,
  SUM(v.order_amount) AS total_value,
  COUNT(DISTINCT o.order_id) AS orders
FROM orders o
JOIN v_order_totals v ON v.order_id = o.order_id
LEFT JOIN truck_delivery td ON td.order_id = o.order_id
LEFT JOIN truck_schedule ts ON ts.truck_schedule_id = td.truck_schedule_id
LEFT JOIN truck_route tr ON tr.route_id = ts.route_id
GROUP BY o.destination_city, tr.route_name;

-- 4. Driver & assistant working hours
CREATE OR REPLACE VIEW v_worker_hours AS
SELECT
  'driver' AS role, s.driver_id AS worker_id,
  DATE_FORMAT(s.start_time, '%x-%v') AS week,
  SUM(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time))/60 AS hours
FROM truck_schedule s
GROUP BY role, worker_id, week
UNION ALL
SELECT
  'assistant' AS role, s.assistant_id AS worker_id,
  DATE_FORMAT(s.start_time, '%x-%v') AS week,
  SUM(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time))/60 AS hours
FROM truck_schedule s
GROUP BY role, worker_id, week;

-- 5. Truck usage per month
CREATE OR REPLACE VIEW v_truck_usage AS
SELECT
  s.truck_id,
  DATE_FORMAT(s.start_time, '%Y-%m') AS month,
  COUNT(*) AS runs,
  SUM(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time))/60 AS hours
FROM truck_schedule s
GROUP BY s.truck_id, month;

-- 6. Customer order history with delivery details
CREATE OR REPLACE VIEW v_customer_order_history AS
SELECT
  c.customer_id, c.name AS customer_name,
  o.order_id, o.order_date, o.status,
  v.order_amount,
  GROUP_CONCAT(DISTINCT tr.route_name ORDER BY tr.route_name SEPARATOR ', ') AS truck_routes_used,
  MIN(ts.start_time) AS first_out_for_delivery,
  MAX(td.delivered_at) AS delivered_at
FROM customer c
JOIN orders o ON o.customer_id = c.customer_id
LEFT JOIN v_order_totals v ON v.order_id = o.order_id
LEFT JOIN truck_delivery td ON td.order_id = o.order_id
LEFT JOIN truck_schedule ts ON ts.truck_schedule_id = td.truck_schedule_id
LEFT JOIN truck_route tr ON tr.route_id = ts.route_id
GROUP BY c.customer_id, c.name, o.order_id, o.order_date, o.status, v.order_amount;

-- ---------------------------------------------------------
-- 8) Convenience: assign truck schedule & attach deliveries
-- ---------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_assign_delivery_to_schedule;
DELIMITER //
CREATE PROCEDURE sp_assign_delivery_to_schedule(IN p_delivery_id VARCHAR(40), IN p_truck_schedule_id VARCHAR(40), IN p_order_id VARCHAR(40))
BEGIN
  -- attach order to the run; app logic should pick route matching address
  INSERT INTO truck_delivery(delivery_id, truck_schedule_id, order_id) VALUES (p_delivery_id, p_truck_schedule_id, p_order_id);
END;
//
DELIMITER ;

-- ---------------------------------------------------------
-- 9) Seed data (minimal; extend or use the generator below)
-- ---------------------------------------------------------
INSERT INTO admin (admin_id, name, password) VALUES ('ADM001', 'System Administrator', 'admin123')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO store (store_id, name, city) VALUES
('ST_COL', 'Colombo Central Store', 'Colombo'),
('ST_NEG', 'Negombo Station Store', 'Negombo'),
('ST_GAL', 'Galle Station Store', 'Galle'),
('ST_KAN', 'Kandy HQ Store', 'Kandy');

INSERT INTO customer (customer_id, name, phone_no, city, address, user_name, password) VALUES
('CUS001','John Doe',   '+94771234567','Colombo','123 Galle Rd, Colombo 03','john',  'hash1'),
('CUS002','Jane Smith', '+94772345678','Kandy',  '456 Peradeniya Rd, Kandy','jane',  'hash2')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO product (product_id, name, description, price, space_consumption, category, available_quantity) VALUES
('P001','Detergent Box','1kg box', 600.00, 0.50, 'FMCG', 200),
('P002','Shampoo Pack','500ml',   450.00, 0.20, 'FMCG', 300),
('P003','Soap Carton','20 bars', 1200.00, 1.00, 'FMCG', 150)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO train_route (route_id, start_city, end_city, destinations) VALUES
('R_KAN_COL','Kandy','Colombo','Kegalle,Ragama'),
('R_KAN_GAL','Kandy','Galle','Aluthgama');

INSERT INTO train (train_id, capacity, notes) VALUES
('TR100', 200.0000, 'Bulk cargo'),
('TR200', 150.0000, 'Mixed cargo');

-- Upcoming trips (attach to destination stores)
INSERT INTO train_trip (trip_id, route_id, train_id, depart_time, arrive_time, capacity, store_id)
VALUES
('TT001','R_KAN_COL','TR100', DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY)+INTERVAL 6 HOUR, 200.0000, 'ST_COL'),
('TT002','R_KAN_COL','TR100', DATE_ADD(CURRENT_DATE, INTERVAL 9 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 9 DAY)+INTERVAL 6 HOUR, 200.0000, 'ST_COL'),
('TT003','R_KAN_GAL','TR200', DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY)+INTERVAL 7 HOUR, 150.0000, 'ST_GAL');

INSERT INTO truck (truck_id, license_plate, capacity) VALUES
('TK01', 'WP-1234', 60.0),
('TK03', 'WP-5678', 60.0);

INSERT INTO driver (driver_id, name, phone_no) VALUES
('DRV001','John Driver','+94770000001'),
('DRV002','Jane Transport','+94770000002');

INSERT INTO assistant (assistant_id, name, phone_no) VALUES
('AST001','Sarah Support','+94770000003'),
('AST002','David Logistics','+94770000004');

INSERT INTO truck_route (route_id, store_id, route_name, max_minutes) VALUES
('TR_COL_01','ST_COL','Colombo City North', 240),
('TR_COL_02','ST_COL','Colombo City South', 240),
('TR_GAL_01','ST_GAL','Galle Town',         240);

-- Example order: 8+ days out (passes 7-day rule)
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address, status)
VALUES ('ORD001','CUS001', DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), 'Colombo', '12 Beach Rd, Mt. Lavinia', 'confirmed');

INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI1','ORD001','P001', 20, 600.00),
('OI2','ORD001','P002', 10, 450.00);

-- Schedule the order on trains (auto-splits if needed)
-- (route to Colombo, store ST_COL)
CALL sp_schedule_order_to_trains('ORD001','R_KAN_COL','ST_COL');

-- Create a truck run that respects rosters
CALL sp_create_truck_schedule('TS001','TR_COL_01','TK01','DRV001','AST001',
  DATE_ADD(CURRENT_DATE, INTERVAL 9 DAY)+INTERVAL 9 HOUR,
  DATE_ADD(CURRENT_DATE, INTERVAL 9 DAY)+INTERVAL 13 HOUR);

-- Attach the order to that run
CALL sp_assign_delivery_to_schedule('DELIV001','TS001','ORD001');

-- ---------------------------------------------------------
-- 10) Sample data generator (to reach 40+ orders quickly)
-- ---------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_seed_orders_40;
DELIMITER //
CREATE PROCEDURE sp_seed_orders_40()
BEGIN
  DECLARE i INT DEFAULT 2;
  WHILE i <= 41 DO
    INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address, status)
    VALUES (CONCAT('ORD', LPAD(i,3,'0')),
            IF(i%2=0,'CUS001','CUS002'),
            DATE_ADD(CURRENT_DATE, INTERVAL (7 + (i%5)+1) DAY),
            IF(i%3=0,'Colombo',IF(i%3=1,'Galle','Negombo')),
            CONCAT('Auto Addr ', i),
            'confirmed');
    INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price)
    VALUES (UUID(), CONCAT('ORD', LPAD(i,3,'0')), IF(i%3=0,'P001',IF(i%3=1,'P002','P003')), (2 + (i%4)), 
            (SELECT price FROM product WHERE product_id = IF(i%3=0,'P001',IF(i%3=1,'P002','P003'))));
    SET i = i + 1;
  END WHILE;
END;
//
DELIMITER ;


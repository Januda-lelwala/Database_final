DELIMITER $$

DROP TRIGGER IF EXISTS trg_orders_bu_check_advance$$
CREATE TRIGGER trg_orders_bu_check_advance
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
  IF NEW.delivery_date IS NOT NULL THEN
    IF (NEW.delivery_date <> OLD.delivery_date OR NEW.order_date <> OLD.order_date) THEN
      IF TIMESTAMPDIFF(DAY, NEW.order_date, NEW.delivery_date) < 7 THEN
        SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Order must be placed >= 7 days before delivery_date.';
      END IF;
    END IF;
  END IF;
END$$


CREATE TRIGGER trg_orders_bu_status_guard
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
  IF NOT fn_status_transition_ok(OLD.status, NEW.status) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Invalid status change';
  END IF;
END$$


CREATE TRIGGER trg_oi_ai_reserve_stock
AFTER INSERT ON order_item
FOR EACH ROW
BEGIN
  UPDATE product
     SET available_quantity = available_quantity - NEW.quantity
   WHERE product_id = NEW.product_id;

  IF (SELECT available_quantity FROM product WHERE product_id = NEW.product_id) < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock for product on order_item insert.';
  END IF;
END$$


CREATE TRIGGER trg_oi_au_adjust_stock
AFTER UPDATE ON order_item
FOR EACH ROW
BEGIN
  IF NEW.product_id = OLD.product_id THEN
    UPDATE product
       SET available_quantity = available_quantity - (NEW.quantity - OLD.quantity)
     WHERE product_id = NEW.product_id;
  ELSE
    UPDATE product SET available_quantity = available_quantity + OLD.quantity WHERE product_id = OLD.product_id;
    UPDATE product SET available_quantity = available_quantity - NEW.quantity WHERE product_id = NEW.product_id;

    IF (SELECT available_quantity FROM product WHERE product_id = NEW.product_id) < 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock after product switch.';
    END IF;
  END IF;
END$$


CREATE TRIGGER trg_oi_ad_release_stock
AFTER DELETE ON order_item
FOR EACH ROW
BEGIN
  UPDATE product
     SET available_quantity = available_quantity + OLD.quantity
   WHERE product_id = OLD.product_id;
END$$


CREATE TRIGGER trg_ts_ai_capacity
BEFORE INSERT ON train_shipment
FOR EACH ROW
BEGIN
  DECLARE v_left DECIMAL(12,4);

  SELECT (t.capacity - t.capacity_used) INTO v_left
  FROM train_trip t WHERE t.trip_id = NEW.trip_id FOR UPDATE;

  IF NEW.allocated_space <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'allocated_space must be > 0';
  END IF;

  IF v_left < NEW.allocated_space THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough train capacity for this shipment.';
  END IF;

  UPDATE train_trip
     SET capacity_used = capacity_used + NEW.allocated_space
   WHERE trip_id = NEW.trip_id;
END$$


CREATE TRIGGER trg_ts_au_capacity
AFTER UPDATE ON train_shipment
FOR EACH ROW
BEGIN
  IF NEW.trip_id <> OLD.trip_id THEN
    UPDATE train_trip SET capacity_used = capacity_used - OLD.allocated_space WHERE trip_id = OLD.trip_id;
    UPDATE train_trip SET capacity_used = capacity_used + NEW.allocated_space WHERE trip_id = NEW.trip_id;
  ELSE
    UPDATE train_trip SET capacity_used = capacity_used + (NEW.allocated_space - OLD.allocated_space)
    WHERE trip_id = NEW.trip_id;
  END IF;

  IF (SELECT capacity_used FROM train_trip WHERE trip_id = NEW.trip_id) > (SELECT capacity FROM train_trip WHERE trip_id = NEW.trip_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Capacity overflow after update.';
  END IF;
  IF (SELECT capacity_used FROM train_trip WHERE trip_id = COALESCE(OLD.trip_id, NEW.trip_id)) < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Capacity underflow after update.';
  END IF;
END$$


CREATE TRIGGER trg_ts_ad_capacity
AFTER DELETE ON train_shipment
FOR EACH ROW
BEGIN
  UPDATE train_trip
     SET capacity_used = capacity_used - OLD.allocated_space
   WHERE trip_id = OLD.trip_id;
END$$


CREATE TRIGGER trg_trucks_bi_no_overlap
BEFORE INSERT ON truck_schedule
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1 FROM truck_schedule s
     WHERE s.truck_id = NEW.truck_id
       AND NEW.start_time < s.end_time
       AND NEW.end_time   > s.start_time
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Truck has an overlapping schedule.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM truck_schedule s
     WHERE s.driver_id = NEW.driver_id
       AND NEW.start_time < s.end_time
       AND NEW.end_time   > s.start_time
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Driver has an overlapping schedule.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM truck_schedule s
     WHERE s.assistant_id = NEW.assistant_id
       AND NEW.start_time < s.end_time
       AND NEW.end_time   > s.start_time
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Assistant has an overlapping schedule.';
  END IF;
END$$

DELIMITER ;

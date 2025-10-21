DELIMITER $$

DROP PROCEDURE IF EXISTS sp_set_order_status$$
CREATE PROCEDURE sp_set_order_status(IN p_order_id VARCHAR(40), IN p_new_status VARCHAR(20))
BEGIN
  DECLARE v_old VARCHAR(20);

  SELECT status INTO v_old FROM orders WHERE order_id = p_order_id FOR UPDATE;

  IF v_old IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order not found.';
  END IF;

  IF NOT fn_status_transition_ok(v_old, p_new_status) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid status change';
  END IF;

  UPDATE orders SET status = p_new_status WHERE order_id = p_order_id;
END$$

DROP PROCEDURE IF EXISTS sp_schedule_order_to_train$$
CREATE PROCEDURE sp_schedule_order_to_train(IN p_order_id VARCHAR(40))
BEGIN
  DECLARE v_city VARCHAR(80);
  DECLARE v_space_left DECIMAL(12,4);
  DECLARE v_need DECIMAL(12,4);
  DECLARE v_route_id VARCHAR(40);
  DECLARE v_trip_id VARCHAR(40);
  DECLARE v_alloc DECIMAL(12,4);
  DECLARE v_now DATETIME;

  SET v_now = NOW();
  SELECT destination_city INTO v_city FROM orders WHERE order_id = p_order_id FOR UPDATE;
  IF v_city IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Order not found.'; END IF;

  SET v_need = fn_order_required_space(p_order_id);
  IF v_need <= 0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Order has no items / space.'; END IF;

  SET v_route_id = fn_find_route_for_city(v_city);
  IF v_route_id IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='No train route covers this destination city.'; END IF;

  WHILE v_need > 0.0000 DO
    SET v_trip_id = fn_next_trip_with_space(v_route_id, v_now, v_need);

    IF v_trip_id IS NULL THEN
      SELECT t.trip_id, (t.capacity - t.capacity_used) AS free_space
        INTO v_trip_id, v_space_left
      FROM train_trip t
      WHERE t.route_id = v_route_id
        AND t.depart_time >= v_now
        AND (t.capacity - t.capacity_used) > 0
      ORDER BY t.depart_time
      LIMIT 1;

      IF v_trip_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='No future trips with capacity available.';
      END IF;

      SET v_alloc = LEAST(v_need, v_space_left);
    ELSE
      SET v_alloc = v_need;
    END IF;

    INSERT INTO train_shipment(shipment_id, order_id, trip_id, allocated_space, created_at)
    VALUES (CONCAT('SHP', REPLACE(UUID(),'-','')), p_order_id, v_trip_id, v_alloc, NOW());

    SET v_need = v_need - v_alloc;
  END WHILE;

  CALL sp_set_order_status(p_order_id, 'scheduled');
END$$

DROP PROCEDURE IF EXISTS sp_recommend_truck_route$$
CREATE PROCEDURE sp_recommend_truck_route(IN p_city VARCHAR(80), OUT o_route_id VARCHAR(40))
BEGIN
  SELECT tr.route_id
    INTO o_route_id
  FROM truck_route tr
  WHERE tr.route_name LIKE CONCAT('%', p_city, '%')
  ORDER BY tr.max_minutes ASC
  LIMIT 1;

  IF o_route_id IS NULL THEN
    SELECT tr.route_id
      INTO o_route_id
    FROM truck_route tr
    WHERE tr.store_id IN (
      SELECT store_id FROM store WHERE city LIKE CONCAT('%', p_city, '%')
    )
    ORDER BY tr.max_minutes ASC
    LIMIT 1;
  END IF;
END$$

DROP PROCEDURE IF EXISTS sp_create_truck_schedule$$
CREATE PROCEDURE sp_create_truck_schedule(
  IN p_route_id     VARCHAR(40),
  IN p_truck_id     VARCHAR(40),
  IN p_driver_id    VARCHAR(40),
  IN p_assistant_id VARCHAR(40),
  IN p_order_id     VARCHAR(40),
  IN p_start        DATETIME,
  IN p_end          DATETIME
)
BEGIN
  IF p_end <= p_start THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'end_time must be > start_time';
  END IF;

  INSERT INTO truck_schedule(
    truck_schedule_id, route_id, truck_id, driver_id, assistant_id, order_id, start_time, end_time
  ) VALUES (
    CONCAT('TS', REPLACE(UUID(),'-','')), p_route_id, p_truck_id, p_driver_id, p_assistant_id, p_order_id, p_start, p_end
  );
END$$

DELIMITER ;

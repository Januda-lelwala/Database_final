-- Fix the train-route relationship: One route can have many trains
-- Step 1: Remove train_id from train_route (it shouldn't be there)
ALTER TABLE train_route DROP COLUMN train_id;

-- Step 2: Add route_id back to train table as a foreign key
ALTER TABLE train ADD COLUMN route_id VARCHAR(40) NULL AFTER notes;

-- Step 3: Add foreign key constraint
ALTER TABLE train 
ADD CONSTRAINT fk_train_route 
FOREIGN KEY (route_id) REFERENCES train_route(route_id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

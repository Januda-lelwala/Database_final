-- Remove route_id column from train table
-- The relationship between train and route is stored in train_route table via train_id

-- First, drop the foreign key constraint
ALTER TABLE train DROP FOREIGN KEY fk_train_route;

-- Then drop the route_id column
ALTER TABLE train DROP COLUMN route_id;

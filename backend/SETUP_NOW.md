# 🚀 Setup Database NOW

## Step 1: Create Database (Run these commands)

Open your terminal and run:

```bash
# Navigate to project
cd /Users/janudax/Computer_Science/Database_lab_backend

# Login to MySQL (enter your password when prompted)
mysql -u root -p
```

Then in MySQL prompt, paste these commands:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS kandypack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use database
USE kandypack;

-- Load schema
source /Users/janudax/Computer_Science/Database_lab_backend/database/kandypack_schema.sql;

-- Verify tables (should show 16)
SHOW TABLES;

-- Check sample data
SELECT * FROM store;
SELECT * FROM product;

-- Exit
exit;
```

## Step 2: Update .env Password

If your MySQL password is NOT "password", update `.env`:

```bash
nano .env
# Change DB_PASSWORD=password to your actual password
```

## Step 3: Start Server

```bash
npm run dev
```

You should see:
```
Server running on port 3000 in development mode
MySQL database connection established successfully.
Connected to KandyPack database
```

## Step 4: Test API (Open NEW Terminal)

```bash
cd /Users/janudax/Computer_Science/Database_lab_backend

# Test health
curl http://localhost:3000/health

# Test stores
curl http://localhost:3000/api/stores

# Test products
curl http://localhost:3000/api/products

# Run all tests
./test-api.sh
```

## Quick Troubleshooting

**MySQL won't connect?**
```bash
# Check if running
brew services list | grep mysql

# Start it
brew services start mysql

# Or restart
brew services restart mysql
```

**Don't know MySQL password?**
```bash
# Try without password
mysql -u root

# Or reset password
mysqladmin -u root password 'newpassword'
```

**Port 3000 in use?**
```bash
# Check what's using it
lsof -i :3000

# Kill it
kill -9 <PID>
```

## Expected Results

### Database Setup
- ✅ 16 tables created
- ✅ 4 stores loaded
- ✅ 3 products loaded
- ✅ 2 customers loaded
- ✅ Sample order created

### API Tests
- ✅ Health check returns 200
- ✅ Stores endpoint returns data
- ✅ Products endpoint returns data
- ✅ Trucks endpoint returns 401 (needs auth)

**Once all working, you're ready to test! 🎉**

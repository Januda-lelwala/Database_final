# 🧪 Test API Calls - Step by Step

## Prerequisites Check

Run these to verify everything is ready:

```bash
# 1. Check Node.js
node --version
# Should show v14+ or higher

# 2. Check MySQL
mysql --version
# Should show MySQL version

# 3. Check if MySQL is running
mysql -u root -p -e "SELECT 1;"
# Should connect successfully
```

---

## Setup Steps

### 1️⃣ Install Dependencies (if not done)

```bash
cd /Users/janudax/Computer_Science/Database_lab_backend
npm install
```

Wait for installation to complete (~30 seconds).

### 2️⃣ Create Database

```bash
# Login to MySQL
mysql -u root -p
```

Then run in MySQL:

```sql
CREATE DATABASE IF NOT EXISTS kandypack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kandypack;
source /Users/janudax/Computer_Science/Database_lab_backend/database/kandypack_schema.sql;
SHOW TABLES;
exit;
```

### 3️⃣ Verify .env

Check your `.env` file has the correct MySQL password:

```bash
cat .env | grep DB_PASSWORD
```

If it shows `DB_PASSWORD=password` and that's NOT your MySQL password, update it:

```bash
nano .env
# Change the password line
# Save: Ctrl+O, Enter, Ctrl+X
```

### 4️⃣ Start Server

```bash
npm run dev
```

**Expected output:**
```
Server running on port 3000 in development mode
MySQL database connection established successfully.
Connected to KandyPack database
```

**If you see errors**, check:
- MySQL is running: `brew services list | grep mysql`
- Password in `.env` is correct
- Database exists: `mysql -u root -p -e "USE kandypack;"`

---

## Test API Calls

Open a **NEW terminal window** (keep server running in the first one).

### Test 1: Health Check ✅

```bash
curl http://localhost:3000/health
```

**Expected:**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-10-02T06:54:35.000Z"
}
```

### Test 2: API Info ✅

```bash
curl http://localhost:3000/
```

**Expected:**
```json
{
  "status": "success",
  "message": "Welcome to Customer Order Management System API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "customers": "/api/customers",
    "orders": "/api/orders",
    "products": "/api/products",
    "stores": "/api/stores",
    "trucks": "/api/trucks"
  }
}
```

### Test 3: Get All Stores (Public) ✅

```bash
curl http://localhost:3000/api/stores
```

**Expected:**
```json
{
  "message": "Get all stores",
  "success": true
}
```

### Test 4: Search Stores by City ✅

```bash
curl "http://localhost:3000/api/stores/search?city=Colombo"
```

### Test 5: Get All Products (Public) ✅

```bash
curl http://localhost:3000/api/products
```

### Test 6: Search Products ✅

```bash
curl "http://localhost:3000/api/products/search?query=soap"
```

### Test 7: Get Trucks (Should Require Auth) ✅

```bash
curl http://localhost:3000/api/trucks
```

**Expected:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

This is correct! Trucks endpoint requires admin authentication.

### Test 8: 404 for Invalid Route ✅

```bash
curl http://localhost:3000/api/invalid
```

**Expected:**
```json
{
  "status": "fail",
  "message": "Can't find /api/invalid on this server!"
}
```

---

## Run All Tests Automatically

```bash
./test-api.sh
```

This will run all 8 tests and show results.

---

## Test with Better Formatting (using jq)

If you have `jq` installed:

```bash
# Install jq (optional)
brew install jq

# Then test with pretty output
curl -s http://localhost:3000/health | jq '.'
curl -s http://localhost:3000/api/stores | jq '.'
curl -s http://localhost:3000/api/products | jq '.'
```

---

## Test Database Directly

While server is running, open another terminal:

```bash
mysql -u root -p kandypack
```

Then run:

```sql
-- Check stores
SELECT * FROM store;

-- Check products
SELECT product_id, name, price, available_quantity FROM product;

-- Check customers
SELECT customer_id, name, city, user_name FROM customer;

-- Check orders
SELECT order_id, customer_id, order_date, destination_city, status FROM orders;

-- Exit
exit;
```

---

## Advanced API Tests

### Test with Postman or Insomnia

Import these endpoints:

**GET Requests:**
- `http://localhost:3000/health`
- `http://localhost:3000/api/stores`
- `http://localhost:3000/api/products`
- `http://localhost:3000/api/stores/search?city=Colombo`
- `http://localhost:3000/api/products/search?query=soap`

**Protected Endpoints (need auth):**
- `http://localhost:3000/api/trucks` (should return 401)
- `http://localhost:3000/api/orders` (should return 401)

---

## Troubleshooting

### Server won't start

**Error: "Cannot find module 'mysql2'"**
```bash
npm install mysql2
```

**Error: "Port 3000 already in use"**
```bash
# Find what's using it
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change port in .env
PORT=3001
```

**Error: "Unable to connect to the database"**
```bash
# Check MySQL is running
brew services list | grep mysql

# Start MySQL
brew services start mysql

# Check password in .env
cat .env | grep DB_PASSWORD

# Test MySQL connection
mysql -u root -p -e "USE kandypack;"
```

### API returns errors

**"Can't find /api/... on this server"**
- Check URL is correct
- Server must be running
- Check server logs for errors

**"Access denied. No token provided."**
- This is correct for protected endpoints
- You need to implement authentication first

---

## Success Checklist

- [ ] `npm install` completed
- [ ] Database created (16 tables)
- [ ] Server starts without errors
- [ ] Health check returns 200
- [ ] Stores endpoint works
- [ ] Products endpoint works
- [ ] Trucks endpoint returns 401 (correct)
- [ ] Can query database directly

**When all checked, you're ready to build! ✅**

---

## Next Steps

1. **Implement Controllers** - Replace placeholder responses with real DB queries
2. **Add Authentication** - Implement customer/admin login
3. **Test Business Rules** - Run `test-queries.sql`
4. **Build Frontend** - Create UI for customers and admins

---

## Quick Commands Reference

```bash
# Start server
npm run dev

# Test API
curl http://localhost:3000/health
./test-api.sh

# Check database
mysql -u root -p kandypack -e "SHOW TABLES;"

# View logs
tail -f server.log

# Stop server
Ctrl+C
```

---

**Happy Testing! 🚀**

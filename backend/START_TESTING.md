# 🚀 Start Testing KandyPack Database

## Quick Setup (5 Minutes)

### 1. Create MySQL Database
```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source /Users/janudax/Computer_Science/Database_lab_backend/database/kandypack_schema.sql;

# Verify
USE kandypack;
SHOW TABLES;
# Should show 16 tables

# Exit MySQL
exit;
```

### 2. Update Password in .env
```bash
# Edit .env file
nano .env

# Change this line to your actual MySQL password:
DB_PASSWORD=YOUR_ACTUAL_MYSQL_PASSWORD
```

### 3. Start the Server
```bash
# Make sure you're in the project directory
cd /Users/janudax/Computer_Science/Database_lab_backend

# Start server
npm run dev
```

**Expected output:**
```
Server running on port 3000 in development mode
MySQL database connection established successfully.
Connected to KandyPack database
```

### 4. Test API (New Terminal)
```bash
# Open a new terminal window
cd /Users/janudax/Computer_Science/Database_lab_backend

# Run test script
./test-api.sh
```

### 5. Test Database (MySQL Terminal)
```bash
# Login to MySQL
mysql -u root -p kandypack

# Run test queries
source test-queries.sql;
```

---

## What Gets Tested

### ✅ API Tests (`./test-api.sh`)
1. Health check endpoint
2. API info endpoint
3. Get all stores (public)
4. Search stores by city
5. Get all products (public)
6. Search products
7. Get trucks (should require auth)
8. 404 for undefined routes

### ✅ Database Tests (`test-queries.sql`)
1. **Sample Data**: Verify 4 stores, 3 products, 2 customers loaded
2. **7-Day Rule**: Orders must be ≥7 days in advance
3. **Stock Management**: Auto decrease/restore on order changes
4. **Train Scheduling**: Capacity-aware allocation across trips
5. **Truck Roster**: No overlaps, no consecutive driver deliveries
6. **Reports**: Quarterly sales, top products, worker hours, etc.

---

## Expected Results

### API Tests
```
✓ PASS - Health Check (200)
✓ PASS - API Info (200)
✓ PASS - Get Stores (200)
✓ PASS - Search Stores (200)
✓ PASS - Get Products (200)
✓ PASS - Search Products (200)
✓ PASS - Get Trucks (401 - correctly requires auth)
✓ PASS - 404 Route (404)
```

### Database Tests

**Sample Data:**
- 4 Stores: Colombo, Negombo, Galle, Kandy
- 3 Products: Detergent (600 LKR), Shampoo (450 LKR), Soap (1200 LKR)
- 2 Customers: john, jane
- 1 Admin: ADM001
- 1 Sample Order: ORD001

**Business Rules:**
- ❌ Order 5 days ahead → **FAIL** (correct)
- ✅ Order 8 days ahead → **SUCCESS** (correct)
- ✅ Stock decreases on order item insert
- ✅ Stock restores on order item delete
- ✅ Train scheduling allocates across trips
- ✅ Truck schedule prevents overlaps
- ❌ Consecutive driver deliveries → **FAIL** (correct)

---

## Troubleshooting

### Problem: Can't connect to MySQL
```bash
# Check MySQL is running
brew services list | grep mysql

# Start MySQL
brew services start mysql
```

### Problem: Database doesn't exist
```bash
# Create it
mysql -u root -p -e "CREATE DATABASE kandypack;"

# Run schema
mysql -u root -p kandypack < database/kandypack_schema.sql
```

### Problem: Server won't start
```bash
# Check .env has correct password
cat .env | grep DB_PASSWORD

# Check port 3000 is free
lsof -i :3000
```

### Problem: "Access denied" error
```bash
# Reset MySQL password
mysql -u root

# In MySQL:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;

# Update .env with new password
```

---

## Files Created for Testing

1. **`TEST_DATABASE.md`** - Comprehensive testing guide
2. **`test-api.sh`** - Automated API testing script
3. **`test-queries.sql`** - SQL queries to test business rules
4. **`START_TESTING.md`** - This quick start guide (you are here)

---

## Next Steps After Testing

Once all tests pass:

1. **Implement Controllers**
   - Replace placeholder responses with real DB operations
   - See `controllers/authController.js` for example

2. **Add Authentication**
   - Customer login with `user_name` + `password`
   - Admin login with `admin_id` + `password`
   - JWT token generation

3. **Create More Models**
   - Store, Train, TrainRoute, TrainTrip, Truck, etc.
   - See `KANDYPACK_MIGRATION_SUMMARY.md` for full list

4. **Build Frontend**
   - Customer portal for placing orders
   - Admin dashboard for scheduling
   - Real-time order tracking

5. **Add More Features**
   - Email notifications
   - PDF invoices
   - Analytics dashboard
   - Mobile app

---

## Quick Commands Reference

```bash
# Start server
npm run dev

# Test API
./test-api.sh

# Test database
mysql -u root -p kandypack < test-queries.sql

# View logs
tail -f server.log

# Check MySQL status
brew services list | grep mysql

# Generate more test data
mysql -u root -p kandypack -e "CALL sp_seed_orders_40();"
```

---

## Success Checklist

- [ ] MySQL running
- [ ] Database created with 16 tables
- [ ] Sample data loaded
- [ ] `.env` configured
- [ ] Server starts successfully
- [ ] API tests pass
- [ ] Database tests pass
- [ ] Business rules enforced
- [ ] Reports accessible

**When all checked, you're ready to build! 🎉**

---

## Support

- **Full Setup Guide**: `DATABASE_SETUP.md`
- **API Documentation**: `API_ENDPOINTS.md`
- **Migration Status**: `KANDYPACK_MIGRATION_SUMMARY.md`
- **Quick Start**: `QUICK_START.md`

**Happy Testing! 🚀**

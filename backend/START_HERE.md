# 🎯 START HERE - Test API in 3 Steps

## Step 1: Setup Database (2 minutes)

Open Terminal and run:

```bash
cd /Users/janudax/Computer_Science/Database_lab_backend

# Login to MySQL (you'll be prompted for password)
mysql -u root -p
```

**In MySQL, copy and paste this:**

```sql
CREATE DATABASE IF NOT EXISTS kandypack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kandypack;
source /Users/janudax/Computer_Science/Database_lab_backend/database/kandypack_schema.sql;
SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'kandypack';
exit;
```

You should see `table_count: 16` ✅

---

## Step 2: Update Password (30 seconds)

**Only if your MySQL password is NOT "password":**

```bash
nano .env
```

Change this line:
```
DB_PASSWORD=password
```

To your actual MySQL password, then save (Ctrl+O, Enter, Ctrl+X).

---

## Step 3: Start Server & Test (1 minute)

### Terminal 1: Start Server

```bash
npm run dev
```

**Wait for this message:**
```
✓ MySQL database connection established successfully.
✓ Connected to KandyPack database
✓ Server running on port 3000
```

### Terminal 2: Test API

Open a **NEW terminal** and run:

```bash
cd /Users/janudax/Computer_Science/Database_lab_backend

# Test 1: Health Check
curl http://localhost:3000/health

# Test 2: Get Stores
curl http://localhost:3000/api/stores

# Test 3: Get Products  
curl http://localhost:3000/api/products

# Run all tests
./test-api.sh
```

---

## ✅ Success Indicators

You'll know it's working when:

1. **Server starts** with "MySQL database connection established"
2. **Health check** returns `{"status":"success"}`
3. **Stores endpoint** returns `{"message":"Get all stores","success":true}`
4. **Products endpoint** returns `{"message":"Get all products","success":true}`

---

## 🆘 Quick Fixes

### MySQL won't connect?

```bash
# Start MySQL
brew services start mysql

# Test connection
mysql -u root -p -e "SELECT 1;"
```

### Server won't start?

```bash
# Install dependencies
npm install

# Check port 3000 is free
lsof -i :3000
```

### Wrong password?

```bash
# Update .env
nano .env
# Change DB_PASSWORD line
```

---

## 📚 More Help

- **Full Setup**: See `SETUP_NOW.md`
- **Detailed Testing**: See `TEST_API_NOW.md`
- **Database Tests**: See `TEST_DATABASE.md`
- **API Reference**: See `API_ENDPOINTS.md`

---

## 🎉 What's Next?

Once API tests pass:

1. **Test Database Rules** - Run `mysql -u root -p kandypack < test-queries.sql`
2. **Implement Controllers** - Add real database operations
3. **Add Authentication** - Customer/Admin login
4. **Build Frontend** - Create UI

---

**That's it! Follow these 3 steps and you'll be testing in minutes! 🚀**

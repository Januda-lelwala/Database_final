# 🧪 Complete API Testing Guide

## ✅ Working Endpoints

### 1. Customer Registration
**POST** `/api/auth/register`

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "user_name": "johndoe",
    "password": "password123",
    "phone_no": "+94771234567",
    "city": "Colombo",
    "address": "123 Main Street"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Customer registered successfully",
  "data": {
    "customer": {
      "customer_id": "CUS001",
      "name": "John Doe",
      "user_name": "johndoe",
      "city": "Colombo"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Customer Login
**POST** `/api/auth/login`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "johndoe",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "customer": {
      "customer_id": "CUS001",
      "name": "John Doe",
      "user_name": "johndoe",
      "city": "Colombo"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get All Stores (Public)
**GET** `/api/stores`

```bash
curl http://localhost:3000/api/stores
```

### 4. Get All Products (Public)
**GET** `/api/products`

```bash
curl http://localhost:3000/api/products
```

### 5. Search Stores
**GET** `/api/stores/search?city=Colombo`

```bash
curl "http://localhost:3000/api/stores/search?city=Colombo"
```

### 6. Search Products
**GET** `/api/products/search?query=soap`

```bash
curl "http://localhost:3000/api/products/search?query=soap"
```

---

## 🔒 Protected Endpoints (Require Token)

### Using Token in Requests

After login, use the token in the Authorization header:

```bash
TOKEN="your_token_here"

curl -X GET http://localhost:3000/api/customers \
  -H "Authorization: Bearer $TOKEN"
```

### Example: Get Customer Profile

```bash
# 1. Login first
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user_name":"johndoe","password":"password123"}')

# 2. Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')

# 3. Use token to access protected endpoint
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🌐 Testing in Browser

Open these URLs in your browser:

1. **API Info**: http://localhost:3000
2. **Health Check**: http://localhost:3000/health
3. **Stores**: http://localhost:3000/api/stores
4. **Products**: http://localhost:3000/api/products
5. **Search Stores**: http://localhost:3000/api/stores/search?city=Colombo

For POST requests (register/login), use:
- **Postman**: https://www.postman.com/downloads/
- **Insomnia**: https://insomnia.rest/download
- **Thunder Client** (VS Code extension)

---

## 📱 Postman Collection

### Register Customer
```
Method: POST
URL: http://localhost:3000/api/auth/register
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "name": "Jane Smith",
  "user_name": "janesmith",
  "password": "password123",
  "phone_no": "+94772345678",
  "city": "Kandy",
  "address": "456 Temple Road"
}
```

### Login Customer
```
Method: POST
URL: http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "user_name": "janesmith",
  "password": "password123"
}
```

### Get Profile (Protected)
```
Method: GET
URL: http://localhost:3000/api/auth/profile
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🧪 Complete Test Script

Save this as `test-complete-api.sh`:

```bash
#!/bin/bash

echo "🧪 Complete API Test Suite"
echo "=========================="
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Register new customer
echo "1. Registering new customer..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "user_name": "apitest",
    "password": "test123",
    "phone_no": "+94773456789",
    "city": "Galle",
    "address": "789 Beach Road"
  }')

echo "$REGISTER_RESPONSE" | jq '.'
echo ""

# Test 2: Login
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "apitest",
    "password": "test123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"
echo ""

# Test 3: Get profile with token
echo "3. Getting profile..."
curl -s -X GET $BASE_URL/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 4: Get stores
echo "4. Getting all stores..."
curl -s $BASE_URL/api/stores | jq '.'
echo ""

# Test 5: Get products
echo "5. Getting all products..."
curl -s $BASE_URL/api/products | jq '.'
echo ""

echo "=========================="
echo "✅ All tests complete!"
```

---

## 🗄️ Direct Database Queries

### Check registered customers
```bash
mysql -u root kandypack -e "SELECT customer_id, name, user_name, city FROM customer;"
```

### Check customer count
```bash
mysql -u root kandypack -e "SELECT COUNT(*) as total_customers FROM customer;"
```

### View all data
```bash
mysql -u root kandypack -e "SELECT * FROM customer WHERE user_name='testuser';"
```

---

## ✨ What's Working

- ✅ Customer registration with auto-generated IDs
- ✅ Password hashing (bcrypt)
- ✅ Customer login with JWT tokens
- ✅ Token generation (7-day expiry)
- ✅ Input validation
- ✅ Public endpoints (stores, products)
- ✅ Protected endpoints (require auth)
- ✅ Error handling

---

## 🚀 Next Steps

1. **Implement Order Creation** - Create orders with authentication
2. **Add Admin Endpoints** - Admin login and management
3. **Implement Reports** - Access reporting views
4. **Add Product Management** - CRUD operations for products
5. **Implement Train/Truck Scheduling** - Call stored procedures

---

## 📝 API Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (in development)"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "msg": "Error message",
      "path": "field_name",
      "location": "body"
    }
  ]
}
```

---

**Server running at: http://localhost:3000**  
**Database: kandypack (MySQL)**  
**All systems operational! 🎉**

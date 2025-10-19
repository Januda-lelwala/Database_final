#!/bin/bash

echo "🧪 Testing Customer API Endpoints"
echo "=================================="
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Register Customer (will fail - needs controller implementation)
echo "Test 1: Register Customer"
echo "POST $BASE_URL/api/auth/register"
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "0771234567"
  }' | jq '.' 2>/dev/null || echo ""
echo ""
echo ""

# Test 2: Login Customer (will fail - needs controller implementation)
echo "Test 2: Login Customer"
echo "POST $BASE_URL/api/auth/login"
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' | jq '.' 2>/dev/null || echo ""
echo ""
echo ""

# Test 3: Get All Customers (needs auth)
echo "Test 3: Get All Customers"
echo "GET $BASE_URL/api/customers"
curl -X GET $BASE_URL/api/customers | jq '.' 2>/dev/null || echo ""
echo ""
echo ""

# Test 4: Create Order (needs auth)
echo "Test 4: Create Order"
echo "POST $BASE_URL/api/orders"
curl -X POST $BASE_URL/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUS001",
    "order_date": "2025-10-10",
    "destination_city": "Colombo",
    "destination_address": "123 Main St"
  }' | jq '.' 2>/dev/null || echo ""
echo ""
echo ""

echo "=================================="
echo "Note: Most endpoints return placeholder responses"
echo "Controllers need to be implemented for full functionality"
echo ""
echo "To add customers directly to database:"
echo "mysql -u root kandypack -e \"INSERT INTO customer (customer_id, name, phone_no, city, address, user_name, password) VALUES ('CUS003', 'Test User', '+94771234567', 'Colombo', '123 Test St', 'testuser', 'hash123');\""

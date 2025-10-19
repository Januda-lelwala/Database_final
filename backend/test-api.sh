#!/bin/bash

# KandyPack API Test Script
# This script tests all public API endpoints

echo "🧪 Testing KandyPack API..."
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

# Test 1: Health Check
echo "Test 1: Health Check"
echo "GET $BASE_URL/health"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/health)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
    echo "$body"
fi
echo ""

# Test 2: API Info
echo "Test 2: API Info"
echo "GET $BASE_URL/"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
    echo "$body"
fi
echo ""

# Test 3: Get All Stores
echo "Test 3: Get All Stores (Public)"
echo "GET $BASE_URL/api/stores"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/api/stores)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
    echo "$body"
fi
echo ""

# Test 4: Search Stores by City
echo "Test 4: Search Stores by City"
echo "GET $BASE_URL/api/stores/search?city=Colombo"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/stores/search?city=Colombo")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
    echo "$body"
fi
echo ""

# Test 5: Get All Products
echo "Test 5: Get All Products (Public)"
echo "GET $BASE_URL/api/products"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/api/products)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
    echo "$body"
fi
echo ""

# Test 6: Search Products
echo "Test 6: Search Products"
echo "GET $BASE_URL/api/products/search?query=soap"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/products/search?query=soap")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code"
    echo "$body"
fi
echo ""

# Test 7: Get Trucks (Should require auth)
echo "Test 7: Get Trucks (Admin Only - Should Fail)"
echo "GET $BASE_URL/api/trucks"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/api/trucks)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "401" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code (Correctly requires auth)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Status: $http_code (Expected 401)"
    echo "$body"
fi
echo ""

# Test 8: 404 for undefined route
echo "Test 8: 404 for Undefined Route"
echo "GET $BASE_URL/api/nonexistent"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/api/nonexistent)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "404" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAIL${NC} - Status: $http_code (Expected 404)"
    echo "$body"
fi
echo ""

echo "================================"
echo "✅ API Testing Complete!"
echo ""
echo "Next steps:"
echo "1. Check TEST_DATABASE.md for database testing"
echo "2. Run MySQL queries to test business rules"
echo "3. Implement controllers for full functionality"

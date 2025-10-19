#!/bin/bash

echo "🔧 Setting up KandyPack Database..."
echo ""

# Check if MySQL is accessible
echo "Checking MySQL connection..."
if mysql -u root -ppassword -e "SELECT 1;" > /dev/null 2>&1; then
    echo "✓ MySQL connection successful"
else
    echo "✗ Cannot connect to MySQL"
    echo ""
    echo "Please ensure:"
    echo "1. MySQL is running"
    echo "2. Password in .env is correct (currently: 'password')"
    echo ""
    echo "Try these commands:"
    echo "  brew services start mysql"
    echo "  mysql -u root -p  (then enter your password)"
    exit 1
fi

echo ""
echo "Creating kandypack database..."
mysql -u root -ppassword -e "CREATE DATABASE IF NOT EXISTS kandypack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

echo "Loading schema..."
mysql -u root -ppassword kandypack < database/kandypack_schema.sql 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Database setup complete!"
    echo ""
    echo "Verifying tables..."
    table_count=$(mysql -u root -ppassword kandypack -e "SHOW TABLES;" 2>/dev/null | wc -l)
    echo "✓ Found $((table_count - 1)) tables"
    echo ""
    echo "Sample data:"
    mysql -u root -ppassword kandypack -e "SELECT store_id, name, city FROM store;" 2>/dev/null
    echo ""
    echo "✅ Database is ready!"
    echo ""
    echo "Next step: Start the server with 'npm run dev'"
else
    echo "✗ Error loading schema"
    exit 1
fi

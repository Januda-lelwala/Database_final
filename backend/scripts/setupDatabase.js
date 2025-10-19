require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('='.repeat(60));
    console.log('  KandyPack Database Setup');
    console.log('='.repeat(60));
    console.log();

    // Check current state
    console.log('[1/4] Checking database state...');
    const [productCount] = await conn.query('SELECT COUNT(*) as count FROM product');
    const [storeCount] = await conn.query('SELECT COUNT(*) as count FROM store');
    const [customerCount] = await conn.query('SELECT COUNT(*) as count FROM customer');
    
    console.log(`  - Products: ${productCount[0].count}`);
    console.log(`  - Stores: ${storeCount[0].count}`);
    console.log(`  - Customers: ${customerCount[0].count}`);
    console.log();

    // Insert products if needed
    if (productCount[0].count === 0) {
      console.log('[2/4] Inserting sample products...');
      const products = [
        ['P001', 'Detergent Box', '1kg box', 600.00, 0.50, 'FMCG', 200],
        ['P002', 'Shampoo Pack', '500ml', 450.00, 0.20, 'FMCG', 300],
        ['P003', 'Soap Carton', '20 bars', 1200.00, 1.00, 'FMCG', 150],
        ['P004', 'Rice Bag', '5kg premium rice', 1500.00, 2.50, 'Food', 100],
        ['P005', 'Tea Pack', '500g Ceylon tea', 800.00, 0.30, 'Food', 250],
        ['P006', 'Coffee Pack', '250g instant coffee', 950.00, 0.25, 'Food', 180],
        ['P007', 'Sugar Bag', '1kg white sugar', 250.00, 0.60, 'Food', 500],
        ['P008', 'Flour Bag', '1kg wheat flour', 180.00, 0.65, 'Food', 400],
        ['P009', 'Milk Powder', '400g tin', 1100.00, 0.35, 'Food', 220],
        ['P010', 'Coconut Oil', '1L bottle', 650.00, 0.45, 'Food', 150],
        ['P011', 'Notebook Set', '10 books', 350.00, 0.40, 'Stationery', 300],
        ['P012', 'Pen Pack', '12 pens', 120.00, 0.15, 'Stationery', 500],
        ['P013', 'Pencil Set', '24 pencils', 180.00, 0.20, 'Stationery', 400],
        ['P014', 'Eraser Pack', '5 erasers', 50.00, 0.10, 'Stationery', 600],
        ['P015', 'Ruler Set', '30cm rulers', 75.00, 0.12, 'Stationery', 450],
        ['P016', 'Battery Pack', 'AA 4 pack', 280.00, 0.18, 'Electronics', 350],
        ['P017', 'Light Bulb', 'LED 15W', 320.00, 0.22, 'Electronics', 280],
        ['P018', 'Extension Cord', '3m cord', 550.00, 0.35, 'Electronics', 200],
        ['P019', 'Toothpaste', '100g family pack', 180.00, 0.16, 'Personal Care', 400],
        ['P020', 'Toothbrush', 'Soft bristle', 85.00, 0.08, 'Personal Care', 550],
        ['P021', 'Face Wash', '150ml tube', 420.00, 0.19, 'Personal Care', 320],
        ['P022', 'Hand Sanitizer', '500ml bottle', 380.00, 0.28, 'Personal Care', 290],
        ['P023', 'Tissue Box', '200 sheets', 150.00, 0.32, 'Household', 450],
        ['P024', 'Kitchen Towel', '2 rolls', 220.00, 0.38, 'Household', 380],
        ['P025', 'Garbage Bags', '30 pack', 280.00, 0.42, 'Household', 340],
        ['P026', 'Dishwashing Liquid', '500ml', 240.00, 0.26, 'Household', 410],
        ['P027', 'Laundry Powder', '1kg box', 480.00, 0.55, 'Household', 260],
        ['P028', 'Floor Cleaner', '1L bottle', 320.00, 0.48, 'Household', 300],
        ['P029', 'Biscuit Pack', '500g assorted', 280.00, 0.33, 'Snacks', 380],
        ['P030', 'Chocolate Bar', '200g milk chocolate', 350.00, 0.14, 'Snacks', 420]
      ];
      await conn.query(
        'INSERT INTO product (product_id, name, description, price, space_consumption, category, available_quantity) VALUES ?',
        [products]
      );
      console.log('  ✓ 30 products inserted');
    } else {
      console.log('[2/4] Products already exist, skipping...');
    }
    console.log();

    // Insert stores if needed
    if (storeCount[0].count === 0) {
      console.log('[3/4] Inserting sample stores...');
      const stores = [
        ['ST_COL', 'KandyPack Colombo Hub', 'Colombo'],
        ['ST_KAN', 'KandyPack Kandy Store', 'Kandy'],
        ['ST_GAL', 'KandyPack Galle Branch', 'Galle'],
        ['ST_JAF', 'KandyPack Jaffna Center', 'Jaffna'],
        ['ST_MAT', 'KandyPack Matara Store', 'Matara'],
        ['ST_NEG', 'KandyPack Negombo Hub', 'Negombo'],
        ['ST_TRI', 'KandyPack Trincomalee Store', 'Trincomalee'],
        ['ST_BAT', 'KandyPack Batticaloa Branch', 'Batticaloa'],
        ['ST_ANU', 'KandyPack Anuradhapura Store', 'Anuradhapura'],
        ['ST_KUR', 'KandyPack Kurunegala Hub', 'Kurunegala']
      ];
      await conn.query(
        'INSERT INTO store (store_id, name, city) VALUES ?',
        [stores]
      );
      console.log('  ✓ 10 stores inserted');
    } else {
      console.log('[3/4] Stores already exist, skipping...');
    }
    console.log();

    // Final verification
    console.log('[4/4] Final verification...');
    const [finalProducts] = await conn.query('SELECT COUNT(*) as count FROM product');
    const [finalStores] = await conn.query('SELECT COUNT(*) as count FROM store');
    console.log(`  ✓ Products: ${finalProducts[0].count}`);
    console.log(`  ✓ Stores: ${finalStores[0].count}`);
    console.log();

    await conn.end();

    console.log('='.repeat(60));
    console.log('  ✓ Database setup complete!');
    console.log('='.repeat(60));
    console.log();
    console.log('Next steps:');
    console.log('  1. Start backend: npm run dev');
    console.log('  2. Test API: http://localhost:3000/api/products');
    console.log('  3. Start frontend: cd ../Frontend && npm start');
    console.log();

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('\nPlease check:');
    console.error('  - MySQL is running');
    console.error('  - Database credentials in .env file');
    console.error('  - kandypack database exists');
    process.exit(1);
  }
}

setupDatabase();

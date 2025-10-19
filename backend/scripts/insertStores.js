require('dotenv').config();
const mysql = require('mysql2/promise');

async function insertStores() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected to database...');
    console.log('Inserting sample stores...\n');

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

    const query = `
      INSERT INTO store (store_id, name, city) 
      VALUES ? 
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `;

    const [result] = await conn.query(query, [stores]);
    console.log(`✓ ${result.affectedRows} stores inserted/updated`);

    const [count] = await conn.query('SELECT COUNT(*) as total FROM store');
    console.log(`✓ Total stores in database: ${count[0].total}`);

    const [allStores] = await conn.query('SELECT * FROM store ORDER BY store_id');
    console.log('\nAll stores:');
    allStores.forEach(s => {
      console.log(`  - ${s.store_id}: ${s.name} (${s.city})`);
    });

    await conn.end();
    console.log('\n✓ Done!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

insertStores();

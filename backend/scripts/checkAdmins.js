require('dotenv').config();
const db = require('../models');
const { Admin } = db;

async function checkAdmins() {
  try {
    const admins = await Admin.findAll();
    
    console.log(`Found ${admins.length} admin(s):`);
    admins.forEach(admin => {
      console.log(`- ID: ${admin.admin_id}, Name: ${admin.name}, Password: ${admin.password.substring(0, 20)}...`);
    });

    if (admins.length === 0) {
      console.log('\nNo admins found. Creating ADM001...');
      
      const newAdmin = await Admin.create({
        admin_id: 'ADM001',
        name: 'System Administrator',
        password: 'admin123'
      });
      
      console.log('\n✓ Admin created successfully!');
      console.log('admin_id:', newAdmin.admin_id);
      console.log('name:', newAdmin.name);
      console.log('hashed password:', newAdmin.password.substring(0, 30) + '...');
      console.log('\nYou can now login with:');
      console.log('admin_id: ADM001');
      console.log('password: admin123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkAdmins();

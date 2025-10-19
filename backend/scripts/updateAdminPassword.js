require('dotenv').config();
const db = require('../models');
const { Admin } = db;

async function updateAdminPassword() {
  try {
    // Find the admin
    const admin = await Admin.findOne({ where: { admin_id: 'ADM001' } });
    
    if (!admin) {
      console.log('Admin ADM001 not found!');
      process.exit(1);
    }

    console.log('Found admin:', admin.admin_id, admin.name);
    console.log('Current password (unhashed):', admin.password);

    // Update password - this will trigger the beforeSave hook to hash it
    admin.password = 'admin123';
    await admin.save();

    console.log('\n✓ Password updated successfully!');
    console.log('New hashed password:', admin.password);
    console.log('\nYou can now login with:');
    console.log('admin_id: ADM001');
    console.log('password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error.message);
    process.exit(1);
  }
}

updateAdminPassword();

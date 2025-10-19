const db = require('../models');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected');

    // Find admin
    const admin = await db.Admin.findOne({ where: { admin_id: 'ADM001' }});
    
    if (!admin) {
      console.log('Admin ADM001 not found');
      process.exit(1);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Update directly (bypassing hooks)
    await db.sequelize.query(
      'UPDATE admin SET password = ? WHERE admin_id = ?',
      { replacements: [hashedPassword, 'ADM001'] }
    );

    console.log('✅ Admin password updated successfully');
    console.log('Admin ID: ADM001');
    console.log('Password: admin123');

    // Verify it works
    const updatedAdmin = await db.Admin.findOne({ where: { admin_id: 'ADM001' }});
    const isMatch = await bcrypt.compare('admin123', updatedAdmin.password);
    console.log('Password verification:', isMatch ? '✅ SUCCESS' : '❌ FAILED');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateAdminPassword();

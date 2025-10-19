const db = require('../models');
const { Admin } = db;

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get admin by ID
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;

    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update fields
    if (name) admin.name = name;
    if (password) admin.password = password;

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: {
        admin_id: admin.admin_id,
        name: admin.name
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (req.admin.admin_id === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account'
      });
    }

    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    await admin.destroy();

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
};

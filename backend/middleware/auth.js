const jwt = require('jsonwebtoken');
const db = require('../models');
const { User, Admin, Customer, Driver, Assistant } = db;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Middleware to verify user authentication (supports customer/admin/driver/assistant tokens)
const verifyUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Persist decoded on request for downstream usage
    req.auth = { id: decoded.id, role: decoded.role };

    // Resolve the principal based on role
    let principal = null;
    if (decoded.role === 'customer') {
      principal = await Customer.findByPk(decoded.id);
      if (!principal) {
        return res.status(401).json({ success: false, message: 'Customer not found.' });
      }
      req.user = principal; // keep existing naming for handlers
    } else if (decoded.role === 'admin') {
      const admin = await Admin.findByPk(decoded.id);
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Admin not found.' });
      }
      req.admin = admin;
      req.user = admin; // some routes may check req.user presence
    } else if (decoded.role === 'driver') {
      const driver = await Driver.findByPk(decoded.id);
      if (!driver) {
        return res.status(401).json({ success: false, message: 'Driver not found.' });
      }
      req.driver = driver;
      req.user = driver;
    } else if (decoded.role === 'assistant') {
      const assistant = await Assistant.findByPk(decoded.id);
      if (!assistant) {
        return res.status(401).json({ success: false, message: 'Assistant not found.' });
      }
      req.assistant = assistant;
      req.user = assistant;
    } else {
      // fallback to generic User model if present
      const user = await User.findByPk(decoded.id);
      if (!user || user.isActive === false) {
        return res.status(401).json({ success: false, message: 'User not found or inactive.' });
      }
      req.user = user;
    }

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Middleware to verify admin authentication
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Middleware to check admin permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required.'
      });
    }

    if (req.admin.role === 'super_admin' || req.admin.permissions.includes(permission)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.'
      });
    }
  };
};

module.exports = {
  verifyToken,
  verifyUser,
  verifyAdmin,
  checkPermission
};

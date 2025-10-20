const jwt = require('jsonwebtoken');
const db = require('../models');
const { Customer, Admin, Driver, Assistant } = db;

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Customer Registration
const registerUser = async (req, res) => {
  try {
    const { name, user_name, password, phone_no, city, address } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ where: { user_name } });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer already exists with this username'
      });
    }

    // Generate customer ID
    const customerCount = await Customer.count();
    const customer_id = `CUS${String(customerCount + 1).padStart(3, '0')}`;

    // Create new customer
    const customer = await Customer.create({
      customer_id,
      name,
      user_name,
      password,
      phone_no,
      city,
      address
    });

    // Generate token
    const token = generateToken(customer.customer_id, 'customer');

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      data: {
        customer: {
          customer_id: customer.customer_id,
          name: customer.name,
          user_name: customer.user_name,
          city: customer.city
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Customer Login
const loginUser = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    // Find customer by username
    const customer = await Customer.findOne({ where: { user_name } });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await customer.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(customer.customer_id, 'customer');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          customer_id: customer.customer_id,
          name: customer.name,
          user_name: customer.user_name,
          city: customer.city
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Admin Registration
const registerAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Generate admin ID
    const adminCount = await Admin.count();
    const admin_id = `ADM${String(adminCount + 1).padStart(3, '0')}`;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { admin_id } });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists with this ID'
      });
    }

    // Create new admin
    const admin = await Admin.create({
      admin_id,
      name,
      password
    });

    // Generate token
    const token = generateToken(admin.admin_id, 'admin');

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        admin: {
          admin_id: admin.admin_id,
          name: admin.name
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during admin registration',
      error: error.message
    });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { admin_id, password } = req.body;

    // Find admin by admin_id
    const admin = await Admin.findOne({ where: { admin_id } });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your Admin ID (e.g., ADM001) and password.'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your Admin ID and password.'
      });
    }

    // Generate token
    const token = generateToken(admin.admin_id, 'admin');

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: {
          admin_id: admin.admin_id,
          name: admin.name
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during admin login',
      error: error.message
    });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id);
    
    res.status(200).json({
      success: true,
      data: { admin }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Driver Registration
const registerDriver = async (req, res) => {
  try {
    const { name, address, phone_no, email, user_name, password } = req.body;

    // Check if driver already exists by username
    const existingDriverByUsername = await Driver.findOne({ where: { user_name } });
    if (existingDriverByUsername) {
      return res.status(400).json({
        success: false,
        message: 'Driver already exists with this username'
      });
    }

    // Check if driver already exists by email
    const existingDriverByEmail = await Driver.findOne({ where: { email } });
    if (existingDriverByEmail) {
      return res.status(400).json({
        success: false,
        message: 'Driver already exists with this email'
      });
    }

    // Create new driver
    const driver = await Driver.create({
      name,
      address,
      phone_no,
      email,
      user_name,
      password
    });

    // Generate token
  const token = generateToken(driver.driver_id, 'driver');

    res.status(201).json({
      success: true,
      message: 'Driver registered successfully',
      data: {
        driver: {
          id: driver.id,
          name: driver.name,
          user_name: driver.user_name,
          email: driver.email,
          phone_no: driver.phone_no,
          address: driver.address
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during driver registration',
      error: error.message
    });
  }
};

// Driver Login
const loginDriver = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    // Find driver by username
    const driver = await Driver.findOne({ where: { user_name } });
    if (!driver) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await driver.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
  const token = generateToken(driver.driver_id, 'driver');

    res.status(200).json({
      success: true,
      message: 'Driver login successful',
      data: {
        driver: {
          id: driver.id,
          driver_id: driver.driver_id,
          name: driver.name,
          user_name: driver.user_name,
          email: driver.email,
          phone_no: driver.phone_no,
          address: driver.address
        },
        must_change_password: driver.must_change_password || false,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during driver login',
      error: error.message
    });
  }
};

// Assistant Registration
const registerAssistant = async (req, res) => {
  try {
    const { name, address, phone_no, email, user_name, password } = req.body;

    // Check if assistant already exists by username
    const existingAssistantByUsername = await Assistant.findOne({ where: { user_name } });
    if (existingAssistantByUsername) {
      return res.status(400).json({
        success: false,
        message: 'Assistant already exists with this username'
      });
    }

    // Check if assistant already exists by email
    const existingAssistantByEmail = await Assistant.findOne({ where: { email } });
    if (existingAssistantByEmail) {
      return res.status(400).json({
        success: false,
        message: 'Assistant already exists with this email'
      });
    }

    // Create new assistant
    const assistant = await Assistant.create({
      name,
      address,
      phone_no,
      email,
      user_name,
      password
    });

  // Generate token using primary key assistant_id
  const token = generateToken(assistant.assistant_id || assistant.id, 'assistant');

    res.status(201).json({
      success: true,
      message: 'Assistant registered successfully',
      data: {
        assistant: {
          id: assistant.id,
          name: assistant.name,
          user_name: assistant.user_name,
          email: assistant.email,
          phone_no: assistant.phone_no,
          address: assistant.address
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during assistant registration',
      error: error.message
    });
  }
};

// Assistant Login
const loginAssistant = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    // Find assistant by username
    const assistant = await Assistant.findOne({ where: { user_name } });
    if (!assistant) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await assistant.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

  // Generate token using primary key assistant_id
  const token = generateToken(assistant.assistant_id || assistant.id, 'assistant');

    res.status(200).json({
      success: true,
      message: 'Assistant login successful',
      data: {
        assistant: {
          id: assistant.id,
          assistant_id: assistant.assistant_id,
          name: assistant.name,
          user_name: assistant.user_name,
          email: assistant.email,
          phone_no: assistant.phone_no,
          address: assistant.address
        },
        must_change_password: assistant.must_change_password || false,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during assistant login',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
  getUserProfile,
  getAdminProfile,
  registerDriver,
  loginDriver,
  registerAssistant,
  loginAssistant
};

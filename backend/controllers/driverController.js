const db = require('../models');
const { Driver, TruckSchedule, Order, Customer } = db;
const { listAssignmentsForRole, updateAssignmentStatus } = require('../utils/assignmentStore');
const { sendEmail } = require('../utils/mailer');
const { ensureOrderDeliveryDateColumn } = require('../utils/schemaHelper');
const { ensureScheduleOrderLinks } = require('../utils/scheduleHelper');
const { employeeWelcome } = require('../utils/emailTemplates');
const { generateSecurePassword, generateUniqueUsername } = require('../utils/credentialGenerator');

// Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create driver (admin-only)
const createDriver = async (req, res) => {
  try {
    const { name, address, phone_no, email } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    // Generate driver ID
    const count = await Driver.count();
    const driver_id = `DRV${String(count + 1).padStart(3, '0')}`;

    // Optional unique email check
    if (email) {
      const exists = await Driver.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Driver already exists with this email' });
      }
    }

    // Generate unique username (first name with fallback)
    const user_name = await generateUniqueUsername(name, async (uname) => {
      const existing = await Driver.findOne({ where: { user_name: uname } });
      return !!existing;
    });

    // Generate secure password (will be hashed by model hook)
    const plainPassword = generateSecurePassword(10);

    const driver = await Driver.create({
      driver_id,
      name: name.trim(),
      address: address || null,
      phone_no: phone_no || null,
      email: email || null,
      user_name,
      password: plainPassword, // Will be auto-hashed by bcrypt hook
      must_change_password: true
    });

    // Send welcome email with credentials (optional)
    let emailStatus = { sent: false };
    if (driver.email) {
      const tpl = employeeWelcome({ 
        role: 'driver', 
        name: driver.name, 
        id: driver.driver_id,
        user_name: driver.user_name,
        password: plainPassword // Send plain password in email
      });
      emailStatus = await sendEmail({ to: driver.email, subject: tpl.subject, text: tpl.text, html: tpl.html });
    }

    // Return driver data without hashed password, include plain password for admin to see
    const driverData = {
      driver_id: driver.driver_id,
      name: driver.name,
      address: driver.address,
      phone_no: driver.phone_no,
      email: driver.email,
      user_name: driver.user_name
    };

    return res.status(201).json({ 
      success: true, 
      message: 'Driver created successfully', 
      data: driverData,
      credentials: { user_name: driver.user_name, password: plainPassword }, // Include for admin display
      emailStatus 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get driver by ID
const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.status(200).json({
      success: true,
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update driver
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_no, address } = req.body;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Update fields
    if (name) driver.name = name;
    if (email) driver.email = email;
    if (phone_no) driver.phone_no = phone_no;
    if (address) driver.address = address;

    await driver.save();

    res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete driver
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    await driver.destroy();

    res.status(200).json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Change driver password (for first login or password reset)
const changeDriverPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { current_password, new_password, new_user_name } = req.body;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Verify current password
    const isPasswordValid = await driver.comparePassword(current_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Validate new password
    if (!new_password || new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Password complexity check
    const hasUpper = /[A-Z]/.test(new_password);
    const hasLower = /[a-z]/.test(new_password);
    const hasNumber = /[0-9]/.test(new_password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(new_password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain uppercase, lowercase, number, and symbol'
      });
    }

    // Update password (will be auto-hashed by model hook)
    driver.password = new_password;
    driver.must_change_password = false;

    // Update username if provided
    if (new_user_name && new_user_name !== driver.user_name) {
      // Check if new username is already taken
      const existing = await Driver.findOne({ where: { user_name: new_user_name } });
      if (existing && existing.driver_id !== driver.driver_id) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
      driver.user_name = new_user_name;
    }

    await driver.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: {
        driver_id: driver.driver_id,
        user_name: driver.user_name,
        must_change_password: false
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

module.exports = {
  getAllDrivers,
  createDriver,
  getDriverById,
  updateDriver,
  deleteDriver,
  changeDriverPassword,
  // New self-profile handlers
  getMyProfile: async (req, res) => {
    try {
      if (!req.auth || req.auth.role !== 'driver') {
        return res.status(403).json({ success: false, message: 'Driver authentication required' });
      }
      const driverId = req.auth.id; // should be driver_id from JWT
      if (!driverId) {
        return res.status(400).json({ success: false, message: 'Driver id missing from token' });
      }
      const driver = await Driver.findByPk(driverId);
      if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
      const data = {
        driver_id: driver.driver_id,
        name: driver.name,
        address: driver.address,
        phone_no: driver.phone_no,
        email: driver.email,
        user_name: driver.user_name,
        must_change_password: driver.must_change_password || false
      };
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },
  updateMyProfile: async (req, res) => {
    try {
      if (!req.auth || req.auth.role !== 'driver') {
        return res.status(403).json({ success: false, message: 'Driver authentication required' });
      }
      const driverId = req.auth.id;
      if (!driverId) {
        return res.status(400).json({ success: false, message: 'Driver id missing from token' });
      }
      const driver = await Driver.findByPk(driverId);
      if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
      const { name, email, phone_no, address } = req.body || {};
      if (name !== undefined) driver.name = name;
      if (email !== undefined) driver.email = email;
      if (phone_no !== undefined) driver.phone_no = phone_no;
      if (address !== undefined) driver.address = address;
      await driver.save();
      return res.status(200).json({ success: true, message: 'Profile updated', data: {
        driver_id: driver.driver_id,
        name: driver.name,
        address: driver.address,
        phone_no: driver.phone_no,
        email: driver.email,
        user_name: driver.user_name
      }});
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },
  getMyRequests: async (req, res) => {
    try {
      if (!req.auth || req.auth.role !== 'driver') {
        return res.status(403).json({ success: false, message: 'Driver authentication required' });
      }
      const driverId = req.auth.id || req.driver?.driver_id;
      if (!driverId) {
        return res.status(400).json({ success: false, message: 'Driver id missing from token' });
      }
      await ensureOrderDeliveryDateColumn();
      await ensureScheduleOrderLinks();
      const assignmentEntries = listAssignmentsForRole('driver', driverId);

      const schedules = await TruckSchedule.findAll({
        where: { driver_id: driverId },
        include: [
          {
            model: Order,
            as: 'order',
            include: [{ model: Customer, as: 'customer', attributes: ['name'] }]
          }
        ],
        order: [['start_time', 'DESC']]
      });

      const scheduleMap = new Map(
        schedules.map((schedule) => [schedule.truck_schedule_id, schedule])
      );

      const merged = assignmentEntries.map((entry) => {
        const schedule = entry.schedule_id ? scheduleMap.get(entry.schedule_id) : null;
        const order = schedule?.order || null;
        return {
          id: entry.id,
          schedule_id: entry.schedule_id || schedule?.truck_schedule_id || null,
          status: entry.status || 'pending',
          order_id: entry.order_id || schedule?.order_id || null,
          start_time: schedule?.start_time || null,
          end_time: schedule?.end_time || null,
          customer_name: entry.customer_name || order?.customer?.name || null,
          destination_city: entry.destination_city || order?.destination_city || null,
          destination_address: entry.destination_address || order?.destination_address || null,
          delivery_date: entry.delivery_date || order?.delivery_date || null,
          created_at: entry.created_at || schedule?.created_at || null,
          updated_at: entry.updated_at || schedule?.updated_at || null
        };
      });

      const assignmentScheduleIds = new Set(
        assignmentEntries.map((entry) => entry.schedule_id).filter(Boolean)
      );

      const additional = schedules
        .filter((schedule) => !assignmentScheduleIds.has(schedule.truck_schedule_id))
        .map((schedule) => ({
          id: schedule.truck_schedule_id,
          schedule_id: schedule.truck_schedule_id,
          status: 'accepted',
          order_id: schedule.order_id || null,
          start_time: schedule.start_time || null,
          end_time: schedule.end_time || null,
          customer_name: schedule.order?.customer?.name || null,
          destination_city: schedule.order?.destination_city || null,
          destination_address: schedule.order?.destination_address || null,
          delivery_date: schedule.order?.delivery_date || null,
          created_at: schedule.created_at || null,
          updated_at: schedule.updated_at || null
        }));

      const requests = [...merged, ...additional];

      return res.status(200).json({
        success: true,
        count: requests.length,
        data: { requests }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },
  acceptAssignmentRequest: async (req, res) => {
    try {
      if (!req.auth || req.auth.role !== 'driver') {
        return res.status(403).json({ success: false, message: 'Driver authentication required' });
      }
      const driverId = req.auth.id || req.driver?.driver_id;
      if (!driverId) {
        return res.status(400).json({ success: false, message: 'Driver id missing from token' });
      }
      const { requestId } = req.params;
      if (!requestId) {
        return res.status(400).json({ success: false, message: 'Request id is required' });
      }
      const updated = updateAssignmentStatus(requestId, 'driver', driverId, 'accepted');
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Request accepted',
        data: { request: updated }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
};

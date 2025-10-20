const db = require('../models');
const { Assistant, TruckSchedule, Order, Customer } = db;
const { listAssignmentsForRole, updateAssignmentStatus } = require('../utils/assignmentStore');
const { sendEmail } = require('../utils/mailer');
const { ensureOrderDeliveryDateColumn } = require('../utils/schemaHelper');
const { employeeWelcome } = require('../utils/emailTemplates');
const { ensureScheduleOrderLinks } = require('../utils/scheduleHelper');
const { generateSecurePassword, generateUniqueUsername } = require('../utils/credentialGenerator');

// Get all assistants
const getAllAssistants = async (req, res) => {
  try {
    const assistants = await Assistant.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: assistants.length,
      data: assistants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get assistant by ID
const getAssistantById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assistant = await Assistant.findByPk(id);

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assistant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create assistant
const createAssistant = async (req, res) => {
  try {
    const { name, address, phone_no, email } = req.body;

    // Generate assistant ID
    const assistantCount = await Assistant.count();
    const assistant_id = `AST${String(assistantCount + 1).padStart(3, '0')}`;

    // Check if assistant already exists by email
    if (email) {
      const existingAssistant = await Assistant.findOne({ where: { email } });
      if (existingAssistant) {
        return res.status(400).json({
          success: false,
          message: 'Assistant already exists with this email'
        });
      }
    }

    // Generate unique username (first name with fallback)
    const user_name = await generateUniqueUsername(name, async (uname) => {
      const existing = await Assistant.findOne({ where: { user_name: uname } });
      return !!existing;
    });

    // Generate secure password (will be hashed by model hook)
    const plainPassword = generateSecurePassword(10);

    // Create new assistant
    const assistant = await Assistant.create({
      assistant_id,
      name,
      address,
      phone_no,
      email,
      user_name,
      password: plainPassword, // Will be auto-hashed by bcrypt hook
      must_change_password: true
    });

    // Send welcome email with credentials (optional)
    let emailStatus = { sent: false };
    if (assistant.email) {
      const tpl = employeeWelcome({ 
        role: 'assistant', 
        name: assistant.name, 
        id: assistant.assistant_id,
        user_name: assistant.user_name,
        password: plainPassword // Send plain password in email
      });
      emailStatus = await sendEmail({ to: assistant.email, subject: tpl.subject, text: tpl.text, html: tpl.html });
    }

    // Return assistant data without hashed password, include plain password for admin to see
    const assistantData = {
      assistant_id: assistant.assistant_id,
      name: assistant.name,
      address: assistant.address,
      phone_no: assistant.phone_no,
      email: assistant.email,
      user_name: assistant.user_name
    };

    res.status(201).json({
      success: true,
      message: 'Assistant created successfully',
      data: assistantData,
      credentials: { user_name: assistant.user_name, password: plainPassword }, // Include for admin display
      emailStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update assistant
const updateAssistant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_no, address } = req.body;

    const assistant = await Assistant.findByPk(id);

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found'
      });
    }

    // Update fields
    if (name) assistant.name = name;
    if (email) assistant.email = email;
    if (phone_no) assistant.phone_no = phone_no;
    if (address) assistant.address = address;

    await assistant.save();

    res.status(200).json({
      success: true,
      message: 'Assistant updated successfully',
      data: assistant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete assistant
const deleteAssistant = async (req, res) => {
  try {
    const { id } = req.params;

    const assistant = await Assistant.findByPk(id);

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found'
      });
    }

    await assistant.destroy();

    res.status(200).json({
      success: true,
      message: 'Assistant deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Change assistant password (for first login or password reset)
const changeAssistantPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { current_password, new_password, new_user_name } = req.body;

    const assistant = await Assistant.findByPk(id);

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found'
      });
    }

    // Verify current password
    const isPasswordValid = await assistant.comparePassword(current_password);
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
    assistant.password = new_password;
    assistant.must_change_password = false;

    // Update username if provided
    if (new_user_name && new_user_name !== assistant.user_name) {
      // Check if new username is already taken
      const existing = await Assistant.findOne({ where: { user_name: new_user_name } });
      if (existing && existing.assistant_id !== assistant.assistant_id) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
      assistant.user_name = new_user_name;
    }

    await assistant.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: {
        assistant_id: assistant.assistant_id,
        user_name: assistant.user_name,
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
  getAllAssistants,
  getAssistantById,
  createAssistant,
  updateAssistant,
  deleteAssistant,
  changeAssistantPassword,
  // Self profile: authenticated assistant only
  getMyProfile: async (req, res) => {
    try {
      const assistant = req.assistant || req.user;
      if (!assistant) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = {
        assistant_id: assistant.assistant_id,
        name: assistant.name,
        email: assistant.email,
        phone_no: assistant.phone_no,
        address: assistant.address,
        user_name: assistant.user_name
      };
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },
  updateMyProfile: async (req, res) => {
    try {
      const assistant = req.assistant || req.user;
      if (!assistant) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { name, email, phone_no, address } = req.body || {};
      if (name !== undefined) assistant.name = name;
      if (email !== undefined) assistant.email = email;
      if (phone_no !== undefined) assistant.phone_no = phone_no;
      if (address !== undefined) assistant.address = address;
      await assistant.save();
      return res.status(200).json({
        message: 'Profile updated successfully',
        data: {
          assistant_id: assistant.assistant_id,
          name: assistant.name,
          email: assistant.email,
          phone_no: assistant.phone_no,
          address: assistant.address,
          user_name: assistant.user_name
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },
  getMyRequests: async (req, res) => {
    try {
      if (!req.auth || req.auth.role !== 'assistant') {
        return res.status(403).json({ success: false, message: 'Assistant authentication required' });
      }
      const assistantId = req.auth.id || req.assistant?.assistant_id;
      if (!assistantId) {
        return res.status(400).json({ success: false, message: 'Assistant id missing from token' });
      }
      await ensureOrderDeliveryDateColumn();
      await ensureScheduleOrderLinks();
      const assignmentEntries = listAssignmentsForRole('assistant', assistantId);

      const schedules = await TruckSchedule.findAll({
        where: { assistant_id: assistantId },
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
      if (!req.auth || req.auth.role !== 'assistant') {
        return res.status(403).json({ success: false, message: 'Assistant authentication required' });
      }
      const assistantId = req.auth.id || req.assistant?.assistant_id;
      if (!assistantId) {
        return res.status(400).json({ success: false, message: 'Assistant id missing from token' });
      }
      const { requestId } = req.params;
      if (!requestId) {
        return res.status(400).json({ success: false, message: 'Request id is required' });
      }
      const updated = updateAssignmentStatus(requestId, 'assistant', assistantId, 'accepted');
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

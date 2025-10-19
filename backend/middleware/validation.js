const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('=== VALIDATION ERROR ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Errors:', JSON.stringify(errors.array(), null, 2));
    console.log('=======================');
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Customer registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('user_name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone_no')
    .optional()
    .trim(),
  body('city')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  handleValidationErrors
];

// Customer login validation
const validateUserLogin = [
  body('user_name')
    .trim()
    .notEmpty()
    .withMessage('Please provide a username'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Admin registration validation
const validateAdminRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Route validation
const validateRoute = [
  body('routeName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Route name must be between 2 and 100 characters'),
  body('routeCode')
    .trim()
    .notEmpty()
    .withMessage('Route code is required'),
  body('startLocationName')
    .trim()
    .notEmpty()
    .withMessage('Start location name is required'),
  body('endLocationName')
    .trim()
    .notEmpty()
    .withMessage('End location name is required'),
  body('distance')
    .isFloat({ min: 0 })
    .withMessage('Distance must be a positive number'),
  body('estimatedDuration')
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute'),
  handleValidationErrors
];

// Booking validation
const validateBooking = [
  body('routeId')
    .notEmpty()
    .withMessage('Valid route ID is required'),
  body('vehicleId')
    .notEmpty()
    .withMessage('Valid vehicle ID is required'),
  body('travelDate')
    .isDate()
    .withMessage('Valid travel date is required'),
  body('departureTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid departure time is required (HH:MM format)'),
  body('passengers')
    .isInt({ min: 1 })
    .withMessage('At least 1 passenger is required'),
  handleValidationErrors
];

// Store validation
const validateStore = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Store name must be between 2 and 120 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('City must be between 2 and 80 characters'),
  handleValidationErrors
];

// Truck validation
const validateTruck = [
  body('license_plate')
    .trim()
    .notEmpty()
    .withMessage('License plate is required')
    .isLength({ max: 40 })
    .withMessage('License plate must not exceed 40 characters'),
  body('capacity')
    .isFloat({ min: 0.0001 })
    .withMessage('Capacity must be a positive number greater than 0'),
  handleValidationErrors
];

// Train validation
const validateTrain = [
  body('capacity')
    .isFloat({ min: 0.0001 })
    .withMessage('Capacity must be a positive number greater than 0'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Notes must not exceed 255 characters'),
  handleValidationErrors
];

// Order validation
// Note: customer_id can be derived from JWT (req.auth.id) for customer role.
const validateOrder = [
  body('customer_id')
    .optional()
    .trim(),
  body('destination_city')
    .trim()
    .notEmpty()
    .withMessage('Destination city is required'),
  body('destination_address')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Destination address must be between 5 and 255 characters'),
  body('order_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid order date format'),
  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array'),
  body('items.*.product_id')
    .if(body('items').exists())
    .notEmpty()
    .withMessage('Product ID is required for each item'),
  body('items.*.quantity')
    .if(body('items').exists())
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.unit_price')
    .if(body('items').exists())
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'scheduled', 'in_transit', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  handleValidationErrors
];

// Product validation
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Product name must be between 2 and 120 characters'),
  body('description')
    .optional()
    .trim(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('space_consumption')
    .isFloat({ min: 0.0001 })
    .withMessage('Space consumption must be greater than 0'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Category must not exceed 60 characters'),
  body('available_quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available quantity must be a non-negative integer'),
  handleValidationErrors
];

// Customer validation
const validateCustomer = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('user_name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone_no')
    .optional()
    .trim(),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage('City must not exceed 80 characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  handleValidationErrors
];

// Driver registration validation
const validateDriverRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('user_name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('email')
      .optional({ checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone_no')
      .optional({ checkFalsy: true })
      .trim(),
  body('address')
    .optional()
    .trim(),
  handleValidationErrors
];

// Driver login validation
const validateDriverLogin = [
  body('user_name')
    .trim()
    .notEmpty()
    .withMessage('Please provide a username'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Assistant registration validation
const validateAssistantRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('user_name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('email')
      .optional({ checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone_no')
      .optional({ checkFalsy: true })
      .trim(),
  body('address')
    .optional()
    .trim(),
  handleValidationErrors
];

// Assistant login validation
const validateAssistantLogin = [
  body('user_name')
    .trim()
    .notEmpty()
    .withMessage('Please provide a username'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Admin login validation
const validateAdminLogin = [
  body('admin_id')
    .trim()
    .notEmpty()
    .withMessage('Please provide an admin ID'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateAdminRegistration,
  validateRoute,
  validateBooking,
  validateStore,
  validateTruck,
  validateTrain,
  validateOrder,
  validateProduct,
  validateCustomer,
  validateDriverRegistration,
  validateDriverLogin,
  validateAssistantRegistration,
  validateAssistantLogin,
  validateAdminLogin
};

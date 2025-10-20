require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/database');
const db = require('./models');
const { ensureTruckRoutes } = require('./utils/truckRouteSeeder');

// Import routes
const authRoutes = require('./routes/authRoutes');
// Customer order management routes
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
// Store and truck routes
const storeRoutes = require('./routes/storeRoutes');
const truckRoutes = require('./routes/truckRoutes');
const truckRouteRoutes = require('./routes/truckRouteRoutes');
const truckScheduleRoutes = require('./routes/truckScheduleRoutes');
const trainRoutes = require('./routes/trainRoutes');
// Driver and assistant routes
const driverRoutes = require('./routes/driverRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
// Admin management routes
const adminRoutes = require('./routes/adminRoutes');

// Initialize express app
const app = express();

// Database connection
connectDB().then(() => ensureTruckRoutes()).catch((error) => {
  console.error('[Startup] Failed while ensuring truck routes:', error.message);
});

// CORS configuration - MUST come before rate limiter and routes
const allowedOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1):30(00|01)$/i;
app.use((req, _res, next) => {
  // Minimal debug log for origin
  if (req.headers.origin) {
    console.log('[CORS] Origin:', req.headers.origin, '->', allowedOriginRegex.test(req.headers.origin) ? 'allowed' : 'blocked');
  }
  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from our dev frontends only; reflect actual origin
    if (origin && allowedOriginRegex.test(origin)) {
      return callback(null, true);
    }
    // For non-browser clients (no Origin), do not set CORS headers
    if (!origin) return callback(null, false);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: [],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 600
};

app.use(cors(corsOptions));
// Explicitly handle preflight for all routes (extra safety)
app.options('*', cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

// Rate limiting disabled for local development to avoid 429s
if (process.env.NODE_ENV === 'production') {
  console.log('[RateLimit] Note: Rate limiting should be enabled in production.');
}

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 'cors' will automatically handle OPTIONS preflight with the options above

// API routes
app.use('/api/auth', authRoutes);
// Customer order management routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
// Store and truck routes
app.use('/api/stores', storeRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/truck-routes', truckRouteRoutes);
app.use('/api/truck-schedule', truckScheduleRoutes);
app.use('/api/trains', trainRoutes);
// Driver and assistant routes
app.use('/api/drivers', driverRoutes);
app.use('/api/assistants', assistantRoutes);
// Admin management routes
app.use('/api/admins', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Customer Order Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      orders: '/api/orders',
      products: '/api/products',
      stores: '/api/stores',
      trucks: '/api/trucks',
      truckRoutes: '/api/truck-routes',
      truckSchedules: '/api/truck-schedule',
      trains: '/api/trains',
      drivers: '/api/drivers',
      assistants: '/api/assistants',
      admins: '/api/admins'
    },
    documentation: '/api/docs'
  });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server with configurable port (default 3000)
const PORT = Number(process.env.PORT) || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

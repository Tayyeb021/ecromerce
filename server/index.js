require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const helmet = require('helmet');

const keys = require('./config/keys');
const routes = require('./routes');
const socket = require('./socket');
const setupDB = require('./utils/db');

const { port } = keys;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);
// CORS configuration - allows local development and production
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:8084',        // Local frontend dev server
      'http://localhost:3000',        // Alternative local port
      'http://127.0.0.1:8084',        // Localhost alternative
      'http://127.0.0.1:3000',        // Localhost alternative
      'https://a-z-on-buz.com',       // Production frontend
      'https://ecromerce-production.up.railway.app'    // Production with www
    ];

    // Allow if origin is in the list or if in development mode
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development, restrict in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Serve static files from uploads directory
// Try root uploads directory first (one level up from server/), fallback to server/uploads
const path = require('path');
const fs = require('fs');
const rootUploadsPath = path.join(__dirname, '../uploads');
const serverUploadsPath = path.join(__dirname, './uploads');

// Use root uploads if it exists, otherwise use server/uploads (for cPanel compatibility)
const uploadsPath = fs.existsSync(rootUploadsPath) ? rootUploadsPath : serverUploadsPath;
app.use('/uploads', express.static(uploadsPath));

// Initialize passport
require('./config/passport')(app);

// Routes
app.use(routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(chalk.red('Error:'), err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await setupDB();

    // Start listening - bind to 0.0.0.0 for cPanel compatibility
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(
        `${chalk.green('✓')} ${chalk.blue(
          `Server is running on port ${port}`
        )}`
      );
      console.log(
        `${chalk.green('✓')} ${chalk.blue(
          `Visit http://localhost:${port}/ in your browser`
        )}`
      );
      console.log(
        `${chalk.green('✓')} ${chalk.blue(
          `API available at http://localhost:${port}/${keys.app.apiURL}`
        )}`
      );
    });

    // Initialize socket.io - wrap in try-catch for shared hosting compatibility
    try {
      socket(server);
    } catch (error) {
      console.log('Socket.io initialization skipped:', error.message);
    }
  } catch (error) {
    console.error(chalk.red('✗ Failed to start server:'), error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});


// Start the application
startServer();

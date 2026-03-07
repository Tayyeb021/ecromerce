const router = require('express').Router();
const apiRoutes = require('./api');

const keys = require('../config/keys');
const { apiURL } = keys.app;

const api = `/${apiURL}`;

// api routes
router.use(api, apiRoutes);
router.use(api, (req, res) => {
  console.log(`404 - API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'No API route found',
    path: req.originalUrl,
    method: req.method
  });
});

module.exports = router;

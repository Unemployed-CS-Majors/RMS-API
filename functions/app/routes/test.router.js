const express = require('express');
const router = express.Router();
const TestController = require('../controllers/test.controller');

// Handle the /users endpoint
router.get('/', TestController.getTest);

// Add more routes for the /users endpoint as needed

module.exports = router;
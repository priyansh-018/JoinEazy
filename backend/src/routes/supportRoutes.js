const express = require('express');
const router = express.Router();
const { sendSupportMessage } = require('../controllers/supportController');

// Public route: send support/help message
router.post('/contact', sendSupportMessage);

module.exports = router;

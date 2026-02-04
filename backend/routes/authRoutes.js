const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import your guard

// @route   POST /api/auth/login
// @desc    Public route for all staff to log in
router.post('/login', login);

// @route   POST /api/auth/create-user
// @desc    Private route: Only an authenticated Admin can create new accounts
// @access  Private (Admin only logic is handled in the controller or middleware)
router.post('/create-user', protect, register);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getPrediction } = require('../controllers/forecastController');
const { protect } = require('../middleware/authMiddleware');
const AuditLog = require('../models/AuditLog'); // Added for Audit Log retrieval

// --- FORECASTING ROUTES ---

// @route   POST /api/forecast
// @desc    Get traffic or workforce predictions from FastAPI
// @access  Private (Requires JWT)
router.post('/forecast', protect, getPrediction);

// --- ADMIN & AUDIT ROUTES ---

// @route   GET /api/admin/logs
// @desc    Retrieve all system activity for the Admin Panel
// @access  Private (Requires JWT & Admin Role)
router.get('/admin/logs', protect, async (req, res) => {
    try {
        // Optimization: We populate 'userId' to get the username instead of just the ID
        const logs = await AuditLog.find()
            .populate('userId', 'username') 
            .sort({ timestamp: -1 }); // Show latest logs first
            
        res.json(logs);
    } catch (err) {
        console.error("Audit Log Fetch Error:", err.message);
        res.status(500).json({ message: "Failed to retrieve system logs" });
    }
});

module.exports = router;
const axios = require('axios');
const AuditLog = require('../models/AuditLog');

exports.getPrediction = async (req, res) => {
    try {
        // Extract inputs from the React frontend request
        // Note: 'weeks' is more common for workforce planning than 'days'
        const { weeks, department } = req.body;

        // 1. DYNAMIC ENDPOINT TARGETING
        // Points to your specific FastAPI route: /workforce_requirement
        const mlServiceUrl = `${process.env.FASTAPI_URL}/workforce_requirement`;
        
        // 2. FORWARD REQUEST TO FASTAPI
        // Node.js acts as a 'bridge' here
        const response = await axios.post(mlServiceUrl, { 
            weeks: weeks, 
            dept: department 
        });

        // 3. AUDIT LOGGING (SUCCESS)
        // Every successful forecast is permanently recorded in MongoDB
        const newLog = new AuditLog({
            userId: req.user.id,        // Injected by your Auth Middleware
            action: 'GENERATE_WORKFORCE_FORECAST',
            params: { weeks, department },
            status: 'Success'
        });
        await newLog.save();

        // 4. DATA DELIVERY
        // Send the JSON response (staffing levels/predictions) back to React
        res.status(200).json(response.data);

    } catch (err) {
        // 5. AUDIT LOGGING (FAILURE)
        // We log the failure to track potential system downtime or invalid attempts
        const failLog = new AuditLog({
            userId: req.user ? req.user.id : null,
            action: 'GENERATE_WORKFORCE_FORECAST',
            params: req.body,
            status: 'Failure'
        });
        await failLog.save();

        console.error("FastAPI Connection Error:", err.message);
        res.status(500).json({ 
            message: "The forecasting service is currently unavailable. Please try again later." 
        });
    }
};
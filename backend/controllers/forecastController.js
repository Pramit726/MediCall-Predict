const axios = require('axios');
const AuditLog = require('../models/AuditLog');

exports.getPrediction = async (req, res) => {
    try {
        const { type, n_months, avg_call_time, work_hours_per_agent, department } = req.body;

        let mlServiceUrl;
        let auditAction;
        let payload;

        // 1. DYNAMIC ROUTING & PAYLOAD MAPPING
        if (type === 'workforce') {
            // Target: http://127.0.0.1:8000/forecast/workforce-requirement
            mlServiceUrl = `${process.env.FASTAPI_URL}/forecast/workforce-requirement`;
            auditAction = 'GENERATE_WORKFORCE_FORECAST';
            payload = { 
                avg_call_time: avg_call_time || 8, 
                work_hours_per_agent: work_hours_per_agent || 8 
            };
        } else {
            // Target: http://127.0.0.1:8000/forecast/forecast
            mlServiceUrl = `${process.env.FASTAPI_URL}/forecast/forecast`;
            auditAction = 'GENERATE_TRAFFIC_FORECAST';
            payload = { 
                n_months: n_months || 3 
            };
        }

        // 2. FORWARD REQUEST TO FASTAPI
        const response = await axios.post(mlServiceUrl, payload);

        // 3. AUDIT LOGGING (SUCCESS)
        const newLog = new AuditLog({
            userId: req.user.id,
            action: auditAction,
            params: { ...payload, department }, // Log everything for the Admin panel
            status: 'Success'
        });
        await newLog.save();

        // 4. RETURN DATA TO REACT
        res.status(200).json(response.data);

    } catch (err) {
        // 5. AUDIT LOGGING (FAILURE)
        const failLog = new AuditLog({
            userId: req.user ? req.user.id : null,
            action: 'ML_SERVICE_FAILURE',
            params: req.body,
            status: 'Failure'
        });
        await failLog.save();

        console.error("FastAPI Error:", err.response?.data || err.message);
        res.status(500).json({ 
            message: "The ML service returned an error or is unreachable.",
            error: err.response?.data 
        });
    }
};
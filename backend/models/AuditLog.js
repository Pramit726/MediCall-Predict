const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., "GET_FORECAST"
    params: { type: Object },                  // Stores the JSON sent to FastAPI
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['Success', 'Failure'], required: true }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
// backend/models/ActivityLog.js
const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Object, required: true },
});

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);

// backend/models/ActivityLog.js

/**
 * ActivityLog.js
 * ----------------
 * This file defines the MongoDB schema and model for activity logs using Mongoose.
 * Each activity log represents a user action (e.g., a workout) with metadata.
 * 
 * This model is used to interact with the "activitylogs" collection in MongoDB.
 */

const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Object, required: true },
});

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);

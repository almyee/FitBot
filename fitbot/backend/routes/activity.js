// backend/routes/activity.js

/**
 * activity.js
 * -----------------
 * This file defines the routes for logging and retrieving activity data.
 * It handles HTTP requests related to the ActivityLog model.
 */

const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");

// POST a new activity
// Route: POST /
// Purpose: Create and save a new activity log entry
router.post("/", async (req, res) => {
  try {
    const newLog = new ActivityLog(req.body);
    await newLog.save();
    res.status(201).json({ message: "Activity logged" });
  } catch (err) {
    res.status(500).json({ error: "Failed to log activity" });
  }
});

// GET recent activity logs
// Route: GET /
// Purpose: Retrieve the 20 most recent activity logs (sorted by timestamp)
router.get("/", async (req, res) => {
  const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(20);
  res.json(logs);
});

module.exports = router;

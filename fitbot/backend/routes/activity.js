// backend/routes/activity.js
const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");

// POST a new activity
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
router.get("/", async (req, res) => {
  const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(20);
  res.json(logs);
});

module.exports = router;

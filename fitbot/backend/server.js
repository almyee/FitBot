// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const ActivityLog = require("./models/ActivityLog"); // adjust the path if needed
const app = express();
connectDB();

//app.use(cors());
app.use(cors({ origin: '*' }));
app.use(express.json());

// Test route
app.get('/summary', (req, res) => {
    const message = [
        { id: 1, activity: "API working..." },
      ];
      res.json(message);
});
// app.get('/logs', (req, res) => { //this works
//     // Sample response, replace with actual database logic
//     const logs = [
//       { id: 1, activity: "User signed in", timestamp: "2025-05-09 10:00:00" },
//       { id: 2, activity: "User clicked a button", timestamp: "2025-05-09 10:05:00" },
//     ];
//     res.json(logs);
//   });


app.get("/logs", async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }); // newest first
    res.json(logs);
  } catch (error) {
    console.error("❌ Error fetching logs:", error.message);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});
app.post("/logs/sample", async (req, res) => {
    try {
      const log = new ActivityLog({
        action: "User viewed dashboard",
        metadata: { user: "Alyssa", page: "dashboard" },
      });
      await log.save();
      res.json(log);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// At the top of server.js
// const ActivityLog = require("./models/ActivityLog");

app.post("/logs/test", async (req, res) => {
  try {
    const log = new ActivityLog({
      action: "User signed in",
      metadata: { user: "Alyssa Yee", method: "Google OAuth" },
    });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//   app.get("/logs", async (req, res) => {
//     try {
//       const db = await connectToDB();
//       const logs = await db.collection("logs").find().toArray();
//       res.json(logs);
//     } catch (error) {
//       console.error("Error fetching logs:", error);
//       console.error(error.stack); // Log the full stack trace
//       res.status(500).json({ error: "Failed to fetch logs" });
//     }
//   });
// app.get('/', (req, res) => {
//     console.log('Received a GET request at /');
//     res.send("Backend is working!");
//   });
  
// Import activity routes (you'll add this next)
const activityRoutes = require("./routes/activity");
app.use("/api/activity", activityRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


  
  
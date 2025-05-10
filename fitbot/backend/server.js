// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
connectDB();

//app.use(cors());
app.use(cors({ origin: '*' }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get('/', (req, res) => {
    console.log('Received a GET request at /');
    res.send("Backend is working!");
  });
  
// Import activity routes (you'll add this next)
const activityRoutes = require("./routes/activity");
app.use("/api/activity", activityRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

app.get('/logs', (req, res) => {
    // Sample response, replace with actual database logic
    const logs = [
      { id: 1, activity: "User signed in", timestamp: "2025-05-09 10:00:00" },
      { id: 2, activity: "User clicked a button", timestamp: "2025-05-09 10:05:00" },
    ];
    res.json(logs);
  });
  
  
// backend/config/db.js

/**
 * db.js
 * ----------
 * This module handles connecting to the MongoDB database using Mongoose.
 * It loads the MongoDB URI from environment variables and establishes a connection.
 * On failure, it logs the error and exits the process.
 * 
 * Used by the backend to initialize database connectivity.
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
    
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

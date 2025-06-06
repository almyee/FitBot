/**
 * Auth Routes - Express Router for User Authentication
 *
 * This module provides two main routes for user authentication:
 * - POST /sign-up: Registers a new user if the username is not already taken.
 * - POST /sign-in: Authenticates a user with a matching username and password.
 * 
 * MongoDB is used as the backend database for storing user credentials.
 * Note: Passwords are stored in plaintext here for simplicity,
 * but in a production app, always hash and salt passwords.
 */

const express = require("express");
const router = express.Router();
const { client } = require("./config/connection");

// Database and collection constants
const DB_NAME = "fitbot";
const COLLECTION_NAME = "users";

// Sign-up route for user registration
router.post("/sign-up", async (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(DB_NAME);
    const existingUser = await db.collection(COLLECTION_NAME).findOne({ username });

    // Check if the username already exists
    if (existingUser) {
      // If username is taken, return an error
      return res.status(400).json({ message: "Username already exists" });
    }

    // Insert new user credentials into the database
    await db.collection(COLLECTION_NAME).insertOne({ username, password });

    // Respond with success message
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    // Log and return server error
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close(); // Always close the DB connection
  }
});

// Sign-in route for user authentication
router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body; // Extract credentials from request body

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(DB_NAME);
    const user = await db.collection(COLLECTION_NAME).findOne({ username });

    // Find the user by username
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Respond with login success
    res.status(200).json({ message: "Login successful", username });
  } catch (err) {
    // Log and return server error
    console.error("Signin error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close(); // Always close the DB connection
  }
});

module.exports = router;

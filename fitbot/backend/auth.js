const express = require("express");
const router = express.Router();
const { client } = require("./config/connection");

const DB_NAME = "fitbot";
const COLLECTION_NAME = "users";

// Sign-up
router.post("/sign-up", async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const existingUser = await db.collection(COLLECTION_NAME).findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    await db.collection(COLLECTION_NAME).insertOne({ username, password });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

// Sign-in
router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const user = await db.collection(COLLECTION_NAME).findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful", username });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

module.exports = router;

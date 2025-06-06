
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, Paper } from "@mui/material";

function SignIn() {
  // State to hold username and password inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Handle form submission for sign-in
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit behavior (page reload)
    try {
      // Send POST request to sign-in API with username and password
      const res = await fetch("http://localhost:3001/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json(); // Parse JSON response
      
      // If response is not OK, throw error with message from server or generic message
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save logged-in username to localStorage to keep session info
      localStorage.setItem("currentUser", username);

      // Navigate user to the settings page after successful login
      navigate("/settings");
    } catch (err) {
      // Show alert on any errors (network, validation, etc.)
      alert(err.message);
    }
  };

  return (
    // Center container for the sign-in form
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>

        {/* Form for username and password inputs */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state on input
            required
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on input
            required
          />

          {/* Submit button triggers handleSubmit */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign In
          </Button>

          {/* Link to sign-up page with a button */}
          <Link to="/sign-up">
            <Button variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignIn;



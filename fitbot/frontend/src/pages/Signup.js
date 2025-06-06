import React, { useState } from "react";
import { Container, TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SignUp() {
  // State variables to hold form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Handle form submission for user sign-up
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    
    // Validate password confirmation matches
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return; // Stop submission if passwords don't match
    }
  
    try {
      // Send POST request to sign-up API endpoint with username and password
      const res = await fetch("http://localhost:3001/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json(); // Parse JSON response
      
      // If response is not OK, throw an error with message from API or generic
      if (!res.ok) throw new Error(data.message || "Signup failed");
  
      // Inform user of successful account creation
      alert("Account created successfully!");
      
      // Redirect user to sign-in page after successful signup
      navigate("/sign-in");
    } catch (err) {
      // Show error message to the user on failure
      alert(err.message);
    }
  };
  

  return (
    // Container centers the form vertically and horizontally
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        {/* Form for username, password, and password confirmation */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state
            required
          />
          {/* Submit button triggers handleSubmit */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignUp;

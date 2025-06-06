import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Settings() {
  // State variables to hold user input values
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const navigate = useNavigate();
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [calories, setCalories] = useState("");
  const [steps, setSteps] = useState("");
  const [water, setWater] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");

  // On component mount, check if user is logged in; redirect if not
  // Also load stored user data from localStorage into state
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/sign-in");  // Redirect to sign-in page if no logged-in user
    } else {
      // Retrieve saved data for the current user
      const storedData = JSON.parse(localStorage.getItem(currentUser));
      if (storedData) {
        // Populate state with stored user profile and goal data
        setAge(storedData.age);
        setGender(storedData.gender);
        setHeight(storedData.height);
        setWeight(storedData.weight);
        setSteps(storedData.steps);
        setWater(storedData.water);
        setCalories(storedData.calories);
        setDuration(storedData.duration);
        setDistance(storedData.distance);
      }
    }
  }, [navigate]);

  // Handles saving updated user settings to backend API
  const handleSave = async () => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      // Combine feet and inches into single height string
      const height = `${heightFeet}'${heightInches}"`;

      try {
        // POST updated profile data to backend
        const response = await fetch("http://localhost:3001/updateUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: currentUser,
            age,
            gender,
            height,
            weight,
            steps,
            calories, 
            water, 
            duration, 
            distance,
          }),
        });

        const result = await response.json();

        // Notify user based on success or failure response
        if (result.success) {
          alert("Profile saved to MongoDB!");
        } else {
          alert("Failed to save profile.");
        }
      } catch (err) {
        // Log and alert if network or other errors occur
        console.error(err);
        alert("Error saving profile.");
      }
    } else {
      alert("No user signed in!"); // If no user, prompt to sign in
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Settings
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Basic Information
        </Typography>

        {/* Form container with inputs for user profile and goals */}
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Age input field */}
          <TextField
            label="Age"
            variant="outlined"
            fullWidth
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            sx={{ flex: 1 }}
            InputProps={{ sx: { fontSize: "1rem" } }}
            InputLabelProps={{ sx: { fontSize: "1rem" } }}
          />

          {/* Gender input field */}
          <TextField
            label="Gender"
            variant="outlined"
            fullWidth
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            sx={{ flex: 1 }}
            InputProps={{ sx: { fontSize: "1rem" } }}
            InputLabelProps={{ sx: { fontSize: "1rem" } }}
          />

          {/* Height input section separated into feet and inches */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Height
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Feet"
                variant="outlined"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                required
                sx={{ flex: 1 }}
                InputProps={{ sx: { fontSize: "1rem" } }}
                InputLabelProps={{ sx: { fontSize: "1rem" } }}
              />
              <TextField
                label="Inches"
                variant="outlined"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                required
                sx={{ flex: 1 }}
                InputProps={{ sx: { fontSize: "1rem" } }}
                InputLabelProps={{ sx: { fontSize: "1rem" } }}
              />
            </Box>
          </Box>

          {/* Weight input field */}
          <TextField
            label="Weight (lbs)"
            variant="outlined"
            fullWidth
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            sx={{ flex: 1 }}
            InputProps={{ sx: { fontSize: "1rem" } }}
            InputLabelProps={{ sx: { fontSize: "1rem" } }}
          />

          {/* Fitness goals input fields */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Goals
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Step Count"
                variant="outlined"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                required
                sx={{ flex: 1 }}
                InputProps={{ sx: { fontSize: "0.85rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.85rem" } }}
              />
              <TextField
                label="Water Intake (cups)"
                variant="outlined"
                value={water}
                onChange={(e) => setWater(e.target.value)}
                required
                sx={{ flex: 1 }}
                InputProps={{ sx: { fontSize: "0.85rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.85rem" } }}
              />
              <TextField
                label="Calories Burned"
                variant="outlined"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
                sx={{ flex: 1 }}
                InputProps={{ sx: { fontSize: "0.85rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.85rem" } }}
              />
              <TextField
                label="Exercise Duration (hrs)"
                variant="outlined"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                sx={{ flex: 1 }}
                InputProps={{ sx: { fontSize: "0.85rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.85rem" } }}
              />
              <TextField
                label="Distance Covered (mi)"
                variant="outlined"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
                sx={{ flex: 1 }}
                InputProps={{ sx: { fontSize: "0.85rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.85rem" } }}
              />
            </Box>
          </Box>

          {/* Save button triggers handleSave */}
          <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Settings;


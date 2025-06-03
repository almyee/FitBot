import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Settings() {
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
  
  useEffect(() => {
    // Check if a user is logged in, if not, redirect to sign-in page
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/sign-in");
    } else {
      // Load existing data for the logged-in user (if any)
      const storedData = JSON.parse(localStorage.getItem(currentUser));
      if (storedData) {
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

  const handleSave = async () => {
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    const height = `${heightFeet}'${heightInches}"`;

    try {
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

      if (result.success) {
        alert("Profile saved to MongoDB!");
      } else {
        alert("Failed to save profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile.");
    }
  } else {
    alert("No user signed in!");
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
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Age"
            variant="outlined"
            fullWidth
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            sx={{ flex: 1 }}
                  InputProps={{
                    sx: { fontSize: "1rem" },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "1rem" },
                  }}
          />
          <TextField
            label="Gender"
            variant="outlined"
            fullWidth
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            sx={{ flex: 1 }}
                  InputProps={{
                    sx: { fontSize: "1rem" },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "1rem" },
                  }}
          />
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
                // sx={{ flex: 1 }}
                sx={{ flex: 1 }}
                  InputProps={{
                    sx: { fontSize: "1rem" },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "1rem" },
                  }}
                />
                <TextField
                label="Inches"
                variant="outlined"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                required
                // sx={{ flex: 1 }}
                sx={{ flex: 1 }}
                  InputProps={{
                    sx: { fontSize: "1rem" },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "1rem" },
                  }}
                />
            </Box>
            </Box>
          <TextField
            label="Weight (lbs)"
            variant="outlined"
            fullWidth
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            sx={{ flex: 1 }}
                  InputProps={{
                    sx: { fontSize: "1rem" },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "1rem" },
                  }}
          />
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
                  InputProps={{
                    sx: { fontSize: "0.85rem" },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "0.85rem" },
                  }}
                />
                <TextField
                label="Water Intake (cups)"
                variant="outlined"
                value={water}
                onChange={(e) => setWater(e.target.value)}
                required
                sx={{ flex: 1 }}
                  InputProps={{
                    sx: { fontSize: "0.85rem" },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "0.85rem" },
                  }}
                />
                <TextField
                label="Calories Burned"
                variant="outlined"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
                sx={{ flex: 1 }}
                  InputProps={{
                    sx: { fontSize: "0.85rem" },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "0.85rem" },
                  }}
                />
                <TextField
                label="Exercise Duration (hrs)"
                variant="outlined"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                sx={{ flex: 1 }}
                  InputProps={{
                    sx: { fontSize: "0.85rem" },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "0.85rem" },
                  }}
                />
                <TextField
                label="Distance Covered (mi)"
                variant="outlined"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
                sx={{ flex: 1 }}
                  InputProps={{
                    sx: { fontSize: "0.85rem" },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "0.85rem" },
                  }}
                />
                
            </Box>
            </Box>
          <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Settings;

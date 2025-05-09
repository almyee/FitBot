// import React from "react";
// import SoftBox from "../components/SoftBox";
// import SoftTypography from "../components/SoftTypography";

// function Settings() {
//   return (
//     <SoftBox p={3}>
//       <SoftTypography variant="h3" fontWeight="bold">
//         Settings Page
//       </SoftTypography>
//       <SoftTypography variant="body1">
//         This is where your settings content will go.
//       </SoftTypography>
//     </SoftBox>
//   );
// }

// export default Settings;

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
      }
    }
  }, [navigate]);

  const handleSave = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const height = `${heightFeet}'${heightInches}"`; // store as string like 5'7"
      const userData = { age, gender, height, weight };
      localStorage.setItem(currentUser, JSON.stringify(userData));
      alert("Profile saved successfully!");
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
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Age"
            variant="outlined"
            fullWidth
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
          <TextField
            label="Gender"
            variant="outlined"
            fullWidth
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
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
                sx={{ flex: 1 }}
                />
                <TextField
                label="Inches"
                variant="outlined"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                required
                sx={{ flex: 1 }}
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
          />
          <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Settings;

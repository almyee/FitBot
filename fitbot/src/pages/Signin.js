// import React from "react";
// import SoftBox from "../components/SoftBox";
// import SoftTypography from "../components/SoftTypography";

// function SignIn() {
//   return (
//     <SoftBox p={3}>
//       <SoftTypography variant="h3" fontWeight="bold">
//         Sign In Page
//       </SoftTypography>
//       <SoftTypography variant="body1">
//         This is where your sign-in form will go.
//       </SoftTypography>
//     </SoftBox>
//   );
// }

// export default SignIn;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, Paper } from "@mui/material";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle authentication logic
    console.log("Username:", username);
    console.log("Password:", password);
    // Example: Navigate to dashboard after login
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignIn;


import { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  DirectionsWalk,
  DirectionsRun,
  DirectionsBike,
  Pool,
} from "@mui/icons-material";
import MiniStatisticsCard from "../MiniStatisticsCard"; // You can keep or replace this

const exercises = [
  { id: "walking", title: "Walking", icon: { component: <DirectionsWalk fontSize="large" /> } },
  { id: "running", title: "Running", icon: { component: <DirectionsRun fontSize="large" /> } },
  { id: "cycling", title: "Cycling", icon: { component: <DirectionsBike fontSize="large" /> } },
  { id: "swimming", title: "Swimming", icon: { component: <Pool fontSize="large" /> } },
];

export default function SelectExercise() {
  const [selectedExercise, setSelectedExercise] = useState("default");
  const [activityData, setActivityData] = useState({
    duration: "",
    heartRate: "",
    steps: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActivityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitting activity for:", selectedExercise);
    console.log("Activity Data:", activityData);
    setActivityData({ duration: "", heartRate: "", steps: "" });
    setSelectedExercise("default");
  };

  const currentExercise = exercises.find((ex) => ex.id === selectedExercise);

  return (
    <div style={{ padding: "2rem"}}>
      <h3>Select Exercise</h3>

      <Grid container spacing={4}>
        {/* Exercise selection */}
        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={2}>
            {exercises.map((exercise) => (
              <Grid item key={exercise.id}>
                
                <div
                  onClick={() => setSelectedExercise(exercise.id)}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    padding: "1rem",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #F20488 0%, #8B23C1 100%)",
                    color: "white",
                  }}
                >
                  {exercise.icon.component}
                  <h4>{exercise.title}</h4>
                </div>

              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Plain form */}
        {selectedExercise !== "default" && currentExercise && (
          <Grid item xs={12} md={8}>
            <h3>Log {currentExercise.title} Activity:</h3>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setSelectedExercise("default")}
              sx={{ mb: 2, color: '#333', borderColor: '#333' }}
            >
              ← Back to Exercise Selection
            </Button>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <TextField
                    type="number"
                    label="Duration (minutes)"
                    name="duration"
                    fullWidth
                    value={activityData.duration}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      sx: {
                        fontSize: '0.8rem', // smaller label text
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    type="number"
                    label="Heart Rate (bpm)"
                    name="heartRate"
                    fullWidth
                    value={activityData.heartRate}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      sx: {
                        fontSize: '0.8rem', // smaller label text
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    type="number"
                    label="Steps"
                    name="steps"
                    fullWidth
                    value={activityData.steps}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      sx: {
                        fontSize: '0.8rem', // smaller label text
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" type="submit">
                    Submit Activity
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        )}
      </Grid>
    </div>
  );
}


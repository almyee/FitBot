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
  const [submitMessage, setSubmitMessage] = useState("");

  const [activityData, setActivityData] = useState({
    duration: "",
    heartRate: "",
    stepCount: "",
    distanceCovered: "", 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActivityData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = () => {
  //   console.log("Submitting activity for:", selectedExercise);
  //   console.log("Activity Data:", activityData);
  //   setActivityData({ duration: "", heartRate: "", steps: "" });
  //   setSelectedExercise("default");
  // };

  const handleSubmit = async () => {
      if (!selectedExercise) return;

      const payload = {
        user: "alyssa", // adjust as needed
        action: selectedExercise,
        workoutType: "cardio",
        duration: String(activityData.duration),
        timestamp: new Date().toISOString(),
        heartRate: String(activityData.heartRate),
        stepCount: String(activityData.stepCount),
        distanceCovered: String(activityData.distanceCovered),  
      };

      console.log("Created activity JSON:", payload); //DEBUG: Print to browser console

      try {
        const response = await fetch("http://localhost:3001/activitylogs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to log activity");
        }

        console.log("Activity logged successfully!" , payload); //DEBUG: Print to browser console
        setSubmitMessage("✅ Activity Logged!");

        //Wait 6 seconds before resetting the form
        setTimeout(() => {
          setActivityData({
            duration: "",
            heartRate: "",
            stepCount: "",
            distanceCovered: ""
          });
          setSelectedExercise("default");
          setSubmitMessage(""); // Optionally clear message after hiding
        }, 6000);

      } catch (error) {
        console.error("Error submitting activity:", error.message);
        setSubmitMessage("❌ Error logging activity");
      }

      // Reset form
      setActivityData({ duration: "", heartRate: "", stepCount: "" });
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
                    label="Steps Taken"
                    name="stepCount"
                    fullWidth
                    value={activityData.stepCount}
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
                    type="float"
                    label="Distance Covered (miles)"
                    name="distanceCovered"
                    fullWidth
                    value={activityData.distanceCovered}
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

        {/* Message Appears After Form Is Submitted Correctly*/}
            {submitMessage && (
              <h3 style={{ color: submitMessage.startsWith("✅") ? "green" : "red", marginTop: "2rem" }}>
                {submitMessage}
              </h3>
        )}

      </Grid>
    </div>
    
  );
}


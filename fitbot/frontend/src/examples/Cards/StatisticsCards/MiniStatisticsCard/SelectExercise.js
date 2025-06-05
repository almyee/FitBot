import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  DirectionsWalk,
  DirectionsRun,
  DirectionsBike,
  Pool,
} from "@mui/icons-material";

const exercises = [
  { id: "walking", title: "Walking", icon: <DirectionsWalk fontSize="large" /> },
  { id: "running", title: "Running", icon: <DirectionsRun fontSize="large" /> },
  { id: "cycling", title: "Cycling", icon: <DirectionsBike fontSize="large" /> },
  { id: "swimming", title: "Swimming", icon: <Pool fontSize="large" /> },
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

  const handleSubmit = async () => {
    if (!selectedExercise) return;

    const payload = {
      user: "alyssa",
      action: selectedExercise,
      workoutType: "cardio",
      duration: String(activityData.duration),
      timestamp: new Date().toISOString(),
      heartRate: String(activityData.heartRate),
      stepCount: String(activityData.stepCount),
      distanceCovered: String(activityData.distanceCovered),
    };

    try {
      const response = await fetch("http://localhost:3001/activitylogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to log activity");

      setSubmitMessage("✅ Activity Logged!");

      setTimeout(() => {
        setActivityData({
          duration: "",
          heartRate: "",
          stepCount: "",
          distanceCovered: "",
        });
        setSelectedExercise("default");
        setSubmitMessage("");
      }, 6000);
    } catch (error) {
      setSubmitMessage("❌ Error logging activity");
    }
  };

  const currentExercise = exercises.find((ex) => ex.id === selectedExercise);

  return (
    <div style={{ padding: "2rem" }}>
      <h3>Select Exercise</h3>

      {/* Flex container for left buttons and right form */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Left side: fixed width column */}
        <div style={{ flex: "0 0 250px" }}>
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise.id)}
              style={{
                cursor: "pointer",
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #F20488 0%, #8B23C1 100%)",
                color: "white",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {exercise.icon}
              <h4>{exercise.title}</h4>
            </div>
          ))}
        </div>

        {/* Right side: flexible width, fills remaining space */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {selectedExercise !== "default" && currentExercise ? (
            <div style={{ width: "100%", maxWidth: "600px" }}>
              <h3>Log {currentExercise.title} Activity:</h3>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setSelectedExercise("default")}
                sx={{ mb: 2, color: "#333", borderColor: "#333" }}
              >
                ← Back to Exercise Selection
              </Button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <TextField
                    type="number"
                    label="Duration (minutes)"
                    name="duration"
                    fullWidth
                    value={activityData.duration}
                    onChange={handleInputChange}
                    InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  />
                  <TextField
                    type="number"
                    label="Heart Rate (bpm)"
                    name="heartRate"
                    fullWidth
                    value={activityData.heartRate}
                    onChange={handleInputChange}
                    InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  />
                  <TextField
                    type="number"
                    label="Steps Taken"
                    name="stepCount"
                    fullWidth
                    value={activityData.stepCount}
                    onChange={handleInputChange}
                    InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  />
                  <TextField
                    type="number"
                    label="Distance Covered (miles)"
                    name="distanceCovered"
                    fullWidth
                    value={activityData.distanceCovered}
                    onChange={handleInputChange}
                    InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  />
                  <Button variant="contained" color="primary" type="submit">
                    Submit Activity
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ color: "#777", fontStyle: "italic" }}>
              Select an exercise to log activity.
            </div>
          )}
        </div>
      </div>

      {/* Submission message */}
      {submitMessage && (
        <h3
          style={{
            color: submitMessage.startsWith("✅") ? "green" : "red",
            marginTop: "2rem",
          }}
        >
          {submitMessage}
        </h3>
      )}
    </div>
  );
}

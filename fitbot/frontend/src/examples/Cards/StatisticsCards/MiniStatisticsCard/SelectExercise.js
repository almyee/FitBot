import { useState } from "react";
import Grid from "@mui/material/Grid";
import MiniStatisticsCard from "../MiniStatisticsCard";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import SoftInput from "../../../../components/SoftInput";
import SoftButton from "../../../../components/SoftButton/SoftButtonRoot";

const exercises = [
  { id: "running", title: "Running", icon: { component: <i className="fas fa-running" /> } },
  { id: "cycling", title: "Cycling", icon: { component: <i className="fas fa-bicycle" /> } },
  { id: "swimming", title: "Swimming", icon: { component: <i className="fas fa-swimmer" /> } },
  // Add more as needed
];

export default function SelectExercisePage() {
  const [selectedExercise, setSelectedExercise] = useState(null);
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
    // Save or send data to backend
  };

  return (
    <SoftBox p={3}>
      <Grid container spacing={3}>
        {/* Left column: MiniStatisticsCards for each exercise */}
         <Grid item xs={12}>
          <h2>Select Exercise</h2>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={2}>
            {exercises.map((exercise) => (
              <Grid item key={exercise.id}>
                <MiniStatisticsCard
                  title={{ text: exercise.title, fontWeight: "bold" }}
                  icon={exercise.icon}
                  bgColor="white"
                  direction="left"
                  onClick={() => setSelectedExercise(exercise)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right column: form to input activity data */}
        <Grid item xs={12} md={8}>
          {selectedExercise ? (
            <SoftBox>
              <h3>Log Activity: {selectedExercise.title}</h3>
              <SoftBox mb={2}>
                <SoftInput
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g. 30 mins)"
                  value={activityData.duration}
                  onChange={handleInputChange}
                />
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput
                  type="text"
                  name="heartRate"
                  placeholder="Heart Rate (bpm)"
                  value={activityData.heartRate}
                  onChange={handleInputChange}
                />
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput
                  type="text"
                  name="steps"
                  placeholder="Steps"
                  value={activityData.steps}
                  onChange={handleInputChange}
                />
              </SoftBox>
              <SoftButton color="info" onClick={handleSubmit}>
                Submit Activity
              </SoftButton>
            </SoftBox>
          ): null}
        </Grid>
      </Grid>
    </SoftBox>
  );
}

import { useState } from "react";
import Grid from "@mui/material/Grid";
import { DirectionsWalk, DirectionsRun, DirectionsBike, Pool} from '@mui/icons-material';
import MiniStatisticsCard from "../MiniStatisticsCard";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import SoftInput from "../../../../components/SoftInput";
import SoftButton from "../../../../components/SoftButton/SoftButtonRoot";

const exercises = [
  { id: "walking", title: "Walking", icon: <DirectionsWalk fontSize="large" /> },
  { id: "running", title: "Running", icon: <DirectionsRun fontSize="large" /> },
  { id: "cycling", title: "Cycling", icon: <DirectionsBike fontSize="large" /> },
  { id: "swimming", title: "Swimming", icon: <Pool fontSize="large" /> },
  // Add more as needed
];

export default function SelectExercise() {
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
    <SoftBox p={6}>
      <h3>Select Exercise</h3>
      {!selectedExercise && (
        <SoftTypography variant="body2" color="text">
          Click an exercise to log activity.
        </SoftTypography>
      )}
      <Grid container spacing={4}>
        {/* Left column: MiniStatisticsCards for each exercise */}
        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={4}>
            {exercises.map((exercise) => (
              <Grid item key={exercise.id}>
                <MiniStatisticsCard
                  title={{ text: exercise.title, fontWeight: "bold"}}
                  icon={exercise.icon}
                  bgColor="white"
                  direction="right"
                  onClick={() => setSelectedExercise(exercise)}
                  // Added props to increase size
                  value={{ text: "" }}
                  description={{ text: "" }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right column: form to input activity data */}
        
        <Grid item xs={12} md={8}>
          {selectedExercise ? (
            <SoftBox bgColor="white" p={3} borderRadius="md" boxShadow="lg">
              <SoftBox mb={2}>
                <h3>Log Activity: {selectedExercise.title}</h3>
              </SoftBox>
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
          ) : null}
        </Grid>
      </Grid>
    </SoftBox>
  );
}

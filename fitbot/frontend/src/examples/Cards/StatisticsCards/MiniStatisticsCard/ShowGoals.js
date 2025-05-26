import React, {useMemo, useState } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { Bar} from "react-chartjs-2";
import DefaultDoughnutChart from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import configs from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart/configs";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);


//HARD CODED VALUES HERE FOR NOW (Needs to be imported from MongoDB)
//TODO: Replace with MongoDB data in the future
const goalData = {
  "Calories Burnt": {
    today: "400 cal",
    weekly: [200, 300, 400, 350, 450, 500, 400],
    unit: "cal",
    goalRemaining: "Need to burn 500 more calories.",
  },
  "Exercise Duration": {
    today: "2 hours",
    weekly: [1, 1.5, 2, 1.2, 2.5, 2, 1.7],
    unit: "hours",
    goalRemaining: "Exercise 3 more hours this week.",
  },
  "Steps Taken": {
    today: "2,000",
    weekly: [3000, 5000, 7000, 4000, 6000, 8000, 2000],
    unit: "steps",
    goalRemaining: "Take 8,000 more steps.",
  },
  "Distance Covered": {
    today: "2.1 miles",
    weekly: [1.2, 1.5, 2.3, 1.8, 2.5, 2.7, 2.1],
    unit: "miles",
    goalRemaining: "Walk 3 more miles.",
  },
  "Water Intake": {
    today: "3 cups",
    weekly: [2, 3, 4, 2, 3, 5, 3],
    unit: "cups",
    goalRemaining: "Drink 5 more cups today.",
  },
};

export default function ShowGoals() {
  const today = new Date().toLocaleDateString();
  const [selectedGoal, setSelectedGoal] = useState("Calories Burnt");

  const chartData = useMemo(() => {
    const goal = goalData[selectedGoal];
    return {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: selectedGoal,
          data: goal.weekly,
          backgroundColor: "#42a5f5",
          borderRadius: 4,
        },
      ],
    };
  }, [selectedGoal]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }), []);

  return (
    <Grid container spacing={3}>
      {/* LEFT SIDE */}
      <Grid item xs={12} md={5}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" gutterBottom>
              {today}
            </SoftTypography>
            <List>
              {Object.entries(goalData).map(([key, value]) => (
                <ListItemButton key={key} onClick={() => setSelectedGoal(key)}>
                  <SoftTypography variant="body1">
                    {`${key}: ${value.today}`}
                  </SoftTypography>
                </ListItemButton>
              ))}
            </List>
          </SoftBox>
        </Card>

        <SoftBox mt={3}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h6" gutterBottom>
                Remaining Goals
              </SoftTypography>
              <SoftTypography variant="body2" color="text">
                {goalData[selectedGoal].goalRemaining}
              </SoftTypography>
            </SoftBox>
          </Card>
        </SoftBox>
      </Grid>

      {/* RIGHT SIDE */}
      <Grid item xs={12} md={7}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h6" gutterBottom>
              Weekly Progress: {selectedGoal}
            </SoftTypography>
            <Bar data={chartData} options={chartOptions} />
          </SoftBox>
        </Card>
      </Grid>
    </Grid>
  );
}

ShowGoals.propTypes = {
  currentSteps: PropTypes.number,
  targetSteps: PropTypes.number,
  weeklySteps: PropTypes.arrayOf(PropTypes.number),
};
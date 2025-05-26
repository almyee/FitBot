import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Bar, Doughnut } from "react-chartjs-2";
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
const currentSteps = 2000;
const targetSteps = 10000;
const weeklySteps = [4000, 5500, 6000, 7000, 8000, 3000, 5000]; // Array of 7 numbers


export default function ShowSteps() {
  
  const percentage = ((currentSteps / targetSteps) * 100).toFixed(1);

  const doughnutChart = useMemo(() => {
    const labels = ["Steps Taken", "Remaining"];
    const datasets = {
      label: "Steps",
      data: [currentSteps, Math.max(targetSteps - currentSteps, 0)],
      backgroundColors: ["success", "dark"],
    };
    return configs(labels, datasets, 70);
  }, [currentSteps, targetSteps]);

  const weeklyBarData = useMemo(() => ({
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Steps",
        data: weeklySteps,
        backgroundColor: "#42a5f5",
        borderRadius: 4,
      },
    ],
  }), [weeklySteps]);

  const weeklyBarOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }), []);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <DefaultDoughnutChart
          title="Step Progress"
          height="25rem"
          chart={doughnutChart}
        />
        <SoftBox mt={2} textAlign="center">
          <SoftTypography variant="h6">
            {currentSteps}/{targetSteps} steps
          </SoftTypography>
          <SoftTypography variant="caption" color="text">
            {percentage}% of goal reached
          </SoftTypography>
        </SoftBox>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" mb={2}>
              Weekly Step Count
            </SoftTypography>
            <Bar data={weeklyBarData} options={weeklyBarOptions} />
          </SoftBox>
        </Card>
      </Grid>
    </Grid>
  );
}

ShowSteps.propTypes = {
  currentSteps: PropTypes.number.isRequired,
  targetSteps: PropTypes.number.isRequired,
  weeklySteps: PropTypes.arrayOf(PropTypes.number).isRequired,
};

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
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
const currentCups = 2;
const targetCups = 6;
const weeklyCups = [4, 6, 2, 3.5, 1.5, 5, 5.5]; // Array of 7 numbers


export default function ShowWaterIntake() {
  
  const percentage = ((currentCups / targetCups) * 100).toFixed(1);

  const doughnutChart = useMemo(() => {
    const labels = ["Cups Drank", "Remaining"];
    const datasets = {
      label: "Cups",
      data: [currentCups, Math.max(targetCups - currentCups, 0)],
      backgroundColors: ["success", "dark"],
    };
    return configs(labels, datasets, 70);
  }, [currentCups, targetCups]);

  const weeklyBarData = useMemo(() => ({
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Cups",
        data: weeklyCups,
        backgroundColor: "#42a5f5",
        borderRadius: 4,
      },
    ],
  }), [weeklyCups]);

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
          title="Water Intake Progress"
          height="25rem"
          chart={doughnutChart}
        />
        <SoftBox mt={2} textAlign="center">
          <SoftTypography variant="h6">
            {currentCups}/{targetCups} cups
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
              Weekly Water Intake
            </SoftTypography>
            <Bar data={weeklyBarData} options={weeklyBarOptions} />
          </SoftBox>
        </Card>
      </Grid>
    </Grid>
  );
}

ShowWaterIntake.propTypes = {
  currentCups: PropTypes.number.isRequired,
  targetCups: PropTypes.number.isRequired,
  weeklyCups: PropTypes.arrayOf(PropTypes.number).isRequired,
};

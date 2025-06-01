import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Bar, Line } from "react-chartjs-2";
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
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Filler,
  TimeSeriesScale,
} from "chart.js";

import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  Tooltip,
  Legend,
  Title,
  Filler,
  zoomPlugin
);

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function ShowSteps() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch("http://localhost:3001/activitylogs");
        if (!response.ok) throw new Error("Failed to fetch logs");
        const data = await response.json();
        const alyssaLogs = data.filter((log) => log.user === "alyssa");
        setLogs(alyssaLogs);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const targetSteps = 10000;

  const todayUTC = useMemo(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }, []);

  const weeklySteps = useMemo(() => {
    const steps = [0, 0, 0, 0, 0, 0, 0];
    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      const day = date.getDay(); // 0 = Sunday
      steps[day] += Number(log.stepCount || 0) / 2500;
    });
    return steps;
  }, [logs]);

  const weeklyTotal = useMemo(() => {
    return weeklySteps.reduce((sum, steps) => sum + Number(steps || 0), 0);
  }, [weeklySteps]);

  const percentage = ((weeklyTotal / targetSteps) * 100).toFixed(1);

  const todayDayIndex = useMemo(() => {
    return new Date().getDay();
  }, []);

  const dailyTotal = useMemo(() => weeklySteps[todayDayIndex] || 0, [weeklySteps, todayDayIndex]);
  const currentSteps = dailyTotal;
  const dailyPercentage = ((dailyTotal / targetSteps) * 100).toFixed(1);

  const doughnutChart = useMemo(() => {
    const labels = ["Steps Taken", "Remaining"];
    const datasets = {
      label: "Steps",
      data: [currentSteps, Math.max(targetSteps - currentSteps, 0)],
      backgroundColors: ["success", "light"],
    };
    return configs(labels, datasets, 70);
  }, [currentSteps, targetSteps]);

  const weeklyBarData = useMemo(
    () => ({
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Steps",
          data: weeklySteps,
          backgroundColor: "#42a5f5",
          borderRadius: 4,
        },
      ],
    }),
    [weeklySteps]
  );

  const weeklyBarOptions = useMemo(
    () => ({
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
    }),
    []
  );

  const monthlyData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const stepsByDate = {};

    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
        const day = date.toISOString().split("T")[0]; // YYYY-MM-DD
        if (!stepsByDate[day]) stepsByDate[day] = 0;
        stepsByDate[day] += Number(log.stepCount || 0);
      }
    });

    const labels = Object.keys(stepsByDate).sort();
    const data = labels.map((date) => stepsByDate[date]);

    return {
      labels,
      datasets: [
        {
          label: "Steps per Day",
          data,
          fill: true,
          borderColor: "#1976d2",                    // Blue line
          backgroundColor: "rgba(25, 118, 210, 0.2)", // Blue fill
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: "#1976d2",
          pointBorderColor: "#1976d2",
          segment: {
            borderColor: () => "#1976d2",
            backgroundColor: () => "rgba(25, 118, 210, 0.2)",
          },
        },
      ],
    };
  }, [logs]);

  const monthlyOptions = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "PP",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Steps",
        },
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
      legend: {
        display: true,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  if (loading) return <p>Loading step data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <DefaultDoughnutChart title="Daily Step Progress" height="25rem" chart={doughnutChart} />
        <SoftBox mt={2} textAlign="center">
          <SoftTypography variant="h6">
            {Math.round(dailyTotal)}/{targetSteps} steps
          </SoftTypography>
          <SoftTypography variant="caption" color="text">
            {dailyPercentage}% of daily goal reached
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

      <Grid item xs={12}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" mb={2}>
              Monthly Step Trend (Zoomable)
            </SoftTypography>
            <Line data={monthlyData} options={monthlyOptions} />
          </SoftBox>
        </Card>
      </Grid>
    </Grid>
  );
}

ShowSteps.propTypes = {
  currentSteps: PropTypes.number,
  targetSteps: PropTypes.number,
  weeklySteps: PropTypes.arrayOf(PropTypes.number),
};

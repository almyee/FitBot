import React, { useEffect, useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import DefaultDoughnutChart from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import configs from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart/configs";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// NEW helper: parse date string as local date ignoring time/timezone
function toLocalDate(dateString) {
  // Use only YYYY-MM-DD part as local date (no timezone shift)
  const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);
  return { year, month: month - 1, day }; // JS months are zero-indexed
}

// Helper: get Sunday of the week for a given date
function startOfWeek(date) {
  const day = date.getDay();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
}

export default function ShowWaterIntake() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch("http://localhost:3001/activitylogs");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const alyssaLogs = data.filter((log) => log.user === "alyssa");
        setLogs(alyssaLogs);
      } catch (err) {
        setError(err.message || "Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  // === TODAY'S DATE for pie chart ===
  const totalCupsToday = useMemo(() => {
    if (!logs.length) return 0;

    const today = new Date();
    const todayYMD = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };

    return logs
      .filter((log) => {
        const { year, month, day } = toLocalDate(log.timestamp);
        return year === todayYMD.year && month === todayYMD.month && day === todayYMD.day;
      })
      .reduce((sum, log) => sum + (log.waterIntake || 0), 0);
  }, [logs]);

  const targetCups = 6;
  const percentage = ((totalCupsToday / targetCups) * 100).toFixed(1);

  const doughnutChart = useMemo(() => {
    const labels = ["Cups Drank", "Remaining"];
    const datasets = {
      label: "Cups",
      data: [totalCupsToday, Math.max(targetCups - totalCupsToday, 0)],
      backgroundColors: ["success", "dark"],
    };
    return configs(labels, datasets, 70);
  }, [totalCupsToday]);

  // === WEEKLY DATA for bar chart ===
  const weeklyCups = useMemo(() => {
    if (!logs.length) return Array(7).fill(0);

    const today = new Date();
    const weekStart = startOfWeek(today); // Sunday of current week

    // Initialize cups per day array, Sunday=0 to Saturday=6
    const cups = Array(7).fill(0);

    logs.forEach((log) => {
      const { year, month, day } = toLocalDate(log.timestamp);
      const logDate = new Date(year, month, day);

      if (logDate >= weekStart && logDate <= today) {
        const weekday = logDate.getDay(); // 0=Sun ... 6=Sat
        cups[weekday] += log.waterIntake || 0;
      }
    });

    return cups;
  }, [logs]);

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

  const weeklyBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (loading) return <p>Loading Alyssa's water intake logs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <DefaultDoughnutChart title="Today's Water Intake" height="25rem" chart={doughnutChart} />
        <SoftBox mt={2} textAlign="center">
          <SoftTypography variant="h6">
            {totalCupsToday}/{targetCups} cups
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

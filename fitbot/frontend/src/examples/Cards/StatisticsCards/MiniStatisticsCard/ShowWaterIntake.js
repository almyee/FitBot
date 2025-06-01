import React, { useEffect, useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import DefaultDoughnutChart from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import configs from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart/configs";
import { Bar, Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
  PointElement,
  LineElement,
} from "chart.js";

import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
  PointElement,
  LineElement,
  zoomPlugin
);

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getWeekStart(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
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

        const alyssaLogs = data.filter((log) => {
          const user = log.user || log["﻿user"];
          return user === "alyssa";
        });

        console.log("Fetched logs for Alyssa:", alyssaLogs);
        setLogs(alyssaLogs);
      } catch (err) {
        setError(err.message || "Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  // Today's total cups
  const totalCupsToday = useMemo(() => {
    if (!logs.length) return 0;

    return logs
      .filter((log) => {
        if (!log.timestamp) return false;
        const logDate = parseLocalDate(log.timestamp);
        return isSameDay(logDate, today);
      })
      .reduce((sum, log) => {
        const user = log.user || log["﻿user"];
        if (user !== "alyssa") return sum;
        return sum + Number(log.waterIntake || 0) / 8;
      }, 0);
  }, [logs, today]);

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

  // Weekly cups
  const weeklyCups = useMemo(() => {
    if (!logs.length) return Array(7).fill(0);

    const weekStart = getWeekStart(today);
    const cups = Array(7).fill(0);

    logs.forEach((log) => {
      const user = log.user || log["﻿user"];
      if (user !== "alyssa" || !log.timestamp) return;

      const logDate = parseLocalDate(log.timestamp);
      if (logDate >= weekStart && logDate <= today) {
        const dayIndex = logDate.getDay();
        const intake = Number(log.waterIntake || 0) / 8;
        cups[dayIndex] += intake;
      }
    });

    return cups;
  }, [logs, today]);

  const weeklyBarData = useMemo(
    () => ({
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Cups",
          data: weeklyCups,
          backgroundColor: "#42a5f5",
          borderRadius: 4,
        },
      ],
    }),
    [weeklyCups]
  );

  const weeklyBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // --- NEW: Monthly Line Chart Data for zoomable chart ---
  const monthlyLineData = useMemo(() => {
    if (!logs.length) return { labels: [], datasets: [] };

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Create array for each day of current month, default 0 cups
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyCups = new Array(daysInMonth).fill(0);

    logs.forEach((log) => {
      if (!log.timestamp) return;
      const logDate = parseLocalDate(log.timestamp);
      const user = log.user || log["﻿user"];
      if (user !== "alyssa") return;

      if (logDate.getFullYear() === year && logDate.getMonth() === month) {
        const day = logDate.getDate(); // 1-based day of month
        dailyCups[day - 1] += Number(log.waterIntake || 0) / 8;
      }
    });

    // labels: dates of the month in ISO string or simpler format
    const labels = dailyCups.map((_, i) => {
      const d = new Date(year, month, i + 1);
      // Format: MM/dd
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    return {
      labels,
      datasets: [
        {
          label: "Daily Cups",
          data: dailyCups,
          borderColor: "#1976d2",
          backgroundColor: "rgba(25, 118, 210, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [logs]);

  const monthlyLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
        pan: {
          enabled: true,
          mode: "x",
        },
      },
    },
    scales: {
      x: {
        type: "category", // use category for string labels
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          maxRotation: 90,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 15,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Cups",
        },
      },
    },
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <DefaultDoughnutChart title="Today's Water Intake" height="25rem" chart={doughnutChart} />
        <SoftBox mt={2} textAlign="center">
          <SoftTypography variant="h6">
            {totalCupsToday.toFixed(1)}/{targetCups} cups
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

      {/* New Monthly Zoomable Line Chart */}
      <Grid item xs={12}>
        <Card>
          <SoftBox p={3} style={{ height: 400 }}>
            <SoftTypography variant="h5" mb={2}>
              Monthly Water Intake (Zoomable)
            </SoftTypography>
            <Line data={monthlyLineData} options={monthlyLineOptions} />
          </SoftBox>
        </Card>
      </Grid>
    </Grid>
  );
}
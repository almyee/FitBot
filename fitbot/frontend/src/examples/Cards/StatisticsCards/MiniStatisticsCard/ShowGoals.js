import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { Bar } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function toLocalDate(dateString) {
  const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);
  return { year, month: month - 1, day };
}

function startOfWeek(date) {
  const day = date.getDay();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
}

export default function ShowGoals() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState("Calories Burnt");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch("http://localhost:3001/activitylogs");
        if (!response.ok) throw new Error("Failed to fetch logs");
        const data = await response.json();
        console.log("Fetched logs:", data);
        const alyssaLogs = data.filter((log) => log.user === "alyssa");
        console.log("Filtered logs for Alyssa:", alyssaLogs);
        setLogs(alyssaLogs);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const goals = useMemo(() => {
    const today = new Date();
    const todayYMD = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
    const weekStart = startOfWeek(today);

    const initial = {
      "Calories Burnt": { todayVal: 0, weekly: Array(7).fill(0), unit: "cal" },
      "Exercise Duration": { todayVal: 0, weekly: Array(7).fill(0), unit: "hours" },
      "Steps Taken": { todayVal: 0, weekly: Array(7).fill(0), unit: "steps" },
      "Distance Covered": { todayVal: 0, weekly: Array(7).fill(0), unit: "miles" },
      "Water Intake": { todayVal: 0, weekly: Array(7).fill(0), unit: "cups" },
    };

    // Map goal display names to actual log keys
    const keyMap = {
      "Calories Burnt": "caloriesBurned",
      "Exercise Duration": "duration",
      "Steps Taken": "steps",
      "Distance Covered": "distance",
      "Water Intake": "waterIntake",
    };

    logs.forEach((log) => {
      const { year, month, day } = toLocalDate(log.timestamp);
      const logDate = new Date(year, month, day);
      const isToday = year === todayYMD.year && month === todayYMD.month && day === todayYMD.day;
      const isThisWeek = logDate >= weekStart && logDate <= today;
      const weekday = logDate.getDay();

      for (const goal of Object.keys(initial)) {
        const key = keyMap[goal];
        if (key && log[key] != null) {
          const value = Number(log[key]) || 0;
          console.log(`Goal: ${goal}, Key: ${key}, Log Value: ${log[key]}, Parsed Value: ${value}`);
          if (isToday) initial[goal].todayVal += value;
          if (isThisWeek) initial[goal].weekly[weekday] += value;
        }
      }
    });

    const goalDescriptions = {
      "Calories Burnt": (v) => `Need to burn ${Math.max(0, 500 - v)} more calories.`,
      "Exercise Duration": (v) => `Exercise ${Math.max(0, 5 - v).toFixed(1)} more hours this week.`,
      "Steps Taken": (v) => `Take ${Math.max(0, 10000 - v)} more steps.`,
      "Distance Covered": (v) => `Walk ${Math.max(0, 5 - v).toFixed(1)} more miles.`,
      "Water Intake": (v) => `Drink ${Math.max(0, 6 - v)} more cups today.`,
    };

    const goalData = {};
    for (const [goal, { todayVal, weekly, unit }] of Object.entries(initial)) {
      const totalWeekly = goal === "Water Intake" ? todayVal : weekly.reduce((a, b) => a + b, 0);
      goalData[goal] = {
        today: `${todayVal} ${unit}`,
        weekly,
        unit,
        goalRemaining: goalDescriptions[goal](totalWeekly),
      };
    }

    console.log("Processed goals data: ", goalData);
    return goalData;
  }, [logs]);

  const todayStr = new Date().toLocaleDateString();

  const chartData = useMemo(() => {
    const goal = goals[selectedGoal] || { weekly: [] };
    console.log(`Chart data for "${selectedGoal}": `, goal.weekly);
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
  }, [selectedGoal, goals]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }), []);

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Grid container spacing={3}>
      {/* LEFT SIDE */}
      <Grid item xs={12} md={5}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" gutterBottom>
              {todayStr}
            </SoftTypography>
            <List>
              {Object.entries(goals).map(([key, value]) => (
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
                {goals[selectedGoal]?.goalRemaining}
              </SoftTypography>
            </SoftBox>
          </Card>
        </SoftBox>
      </Grid>

      {/* RIGHT SIDE: Chart */}
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

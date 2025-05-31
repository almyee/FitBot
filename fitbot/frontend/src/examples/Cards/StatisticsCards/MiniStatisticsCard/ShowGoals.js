import React, { useEffect, useMemo, useState, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { Bar } from "react-chartjs-2";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";

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

const MET_VALUES = {
  running: 9.8,
  walking: 3.5,
  cycling: 7.5,
  swimming: 8.0,
  yoga: 2.5,
  "weight lifting": 6.0,
};

function calculateCaloriesMET(activity, weight, duration) {
  const key = activity.toLowerCase();
  const MET = MET_VALUES[key] || 1;
  return (MET * weight * duration) / 60;
}

const GOAL_CONFIG = {
  "Calories Burnt": { key: "caloriesBurned", unit: "cal", target: 500 },
  "Exercise Duration": { key: "duration", unit: "hours", target: 5 },
  "Steps Taken": { key: "stepCount", unit: "steps", target: 10000 },
  "Distance Covered": { key: "distanceCovered", unit: "miles", target: 5 },
  "Water Intake": { key: "waterIntake", unit: "cups", target: 6 },
};

export default function ShowGoals() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState("Calories Burnt");

  const fetchLogs = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const goals = useMemo(() => {
    if (logs.length === 0) return {};

    const today = new Date();
    const todayYMD = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
    const weekStart = startOfWeek(today);

    const initial = Object.fromEntries(
      Object.entries(GOAL_CONFIG).map(([label, { unit }]) => [
        label,
        { todayVal: 0, weekly: Array(7).fill(0), unit },
      ])
    );

    logs.forEach((log) => {
      const { year, month, day } = toLocalDate(log.timestamp);
      const logDate = new Date(year, month, day);
      const isToday = year === todayYMD.year && month === todayYMD.month && day === todayYMD.day;
      const isThisWeek = logDate >= weekStart && logDate <= today;
      const weekday = logDate.getDay();

      for (const [goal, { key }] of Object.entries(GOAL_CONFIG)) {
        let value = 0;

        if (goal === "Calories Burnt") {
          const hasRequiredFields = log.action && log.weight && log.duration;
          if (hasRequiredFields) {
            value = calculateCaloriesMET(log.action, Number(log.weight), Number(log.duration));
          } else if (log.caloriesBurned != null) {
            value = Number(log.caloriesBurned);
          }
        } else if (key && log[key] != null) {
          value = Number(log[key]) || 0;
          if (goal === "Exercise Duration") value /= 60; // seconds to hours
        }

        if (value) {
          if (isToday) initial[goal].todayVal += value;
          if (isThisWeek) initial[goal].weekly[weekday] += value;
        }
      }
    });

    const goalRemainingMessages = {
      "Calories Burnt": (_, todayVal) =>
        todayVal < GOAL_CONFIG["Calories Burnt"].target
          ? `Need to burn ${Math.max(0, GOAL_CONFIG["Calories Burnt"].target - todayVal).toFixed(0)} more calories today.`
          : "Congrats! You’ve reached your calorie burn goal today.",
      "Exercise Duration": (total) =>
        total < GOAL_CONFIG["Exercise Duration"].target
          ? `Exercise ${Math.max(0, GOAL_CONFIG["Exercise Duration"].target - total).toFixed(1)} more hours this week.`
          : "Congrats! You’ve reached your exercise duration goal.",
      "Steps Taken": (total) =>
        total < GOAL_CONFIG["Steps Taken"].target
          ? `Take ${Math.max(0, GOAL_CONFIG["Steps Taken"].target - total)} more steps.`
          : "Congrats! You’ve reached your step goal.",
      "Distance Covered": (total) =>
        total < GOAL_CONFIG["Distance Covered"].target
          ? `Walk ${Math.max(0, GOAL_CONFIG["Distance Covered"].target - total).toFixed(1)} more miles.`
          : "Congrats! You’ve reached your distance goal.",
      "Water Intake": (todayVal) =>
        todayVal < GOAL_CONFIG["Water Intake"].target
          ? `Drink ${Math.max(0, GOAL_CONFIG["Water Intake"].target - todayVal)} more cups today.`
          : "Congrats! You’ve reached your water intake goal.",
    };

    const goalData = {};
    for (const [goal, { todayVal, weekly, unit }] of Object.entries(initial)) {
      const total = goal === "Water Intake" ? todayVal : weekly.reduce((a, b) => a + b, 0);
      const message =
        goal === "Calories Burnt"
          ? goalRemainingMessages[goal](null, todayVal)
          : goalRemainingMessages[goal](total);
      goalData[goal] = {
        today: `${todayVal.toFixed(goal === "Exercise Duration" ? 1 : 0)} ${unit}`,
        weekly,
        unit,
        goalRemaining: message,
      };
    }

    return goalData;
  }, [logs]);

  const todayStr = new Date().toLocaleDateString();

  const chartData = useMemo(() => {
    const goal = goals[selectedGoal] || { weekly: [] };
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

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true },
      },
    }),
    []
  );

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
                <ListItemButton
                  key={key}
                  selected={selectedGoal === key}
                  onClick={() => setSelectedGoal(key)}
                >
                  <SoftTypography variant="body1">{`${key}: ${value.today}`}</SoftTypography>
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

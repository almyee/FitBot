import React, { useEffect, useMemo, useState, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { Bar, Line } from "react-chartjs-2";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function toLocalDate(dateString) {
  const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);
  return { year, month: month - 1, day };
}

function startOfWeek(date) {
  const day = date.getDay();
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - day);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

function calculateCaloriesHRBased({ gender, age, weight, VO2max, heartRate }) {
  if (gender === 1) {
    return (
      -59.3954 +
      gender *
        (-36.3781 +
          0.271 * age +
          0.394 * weight +
          0.404 * VO2max +
          0.634 * heartRate)
    );
  } else {
    return (
      -59.3954 +
      (1 - gender) *
        (0.274 * age + 0.103 * weight + 0.380 * VO2max + 0.450 * heartRate)
    );
  }
}

const GOAL_CONFIG = {
  "Calories Burned": { key: "caloriesBurned", unit: "cal", target: 500 },
  "Exercise Duration": { key: "duration", unit: "hours", target: 5 },
  "Steps Taken": { key: "stepCount", unit: "steps", target: 10000 },
  "Distance Covered": { key: "distanceCovered", unit: "miles", target: 5 },
  "Water Intake": { key: "waterIntake", unit: "cups", target: 8 },
};


const GOAL_COLORS = {
  "Steps Taken": {
    barColor: "#98EC2E", // success (green) #98EC2E "#4caf50"
    lineColor: "rgb(152, 236, 46, 0.4)", //#2FAA53 rgba(76, 175, 80, 0.5)
  },
  "Water Intake": {
    barColor: "#42A5F5", // info (blue, as used in weeklyBarData) #2152FF 42a5f5 //bar chart #42A5F5
    lineColor: "rgba(66, 165, 245, 0.4)", // same family as used in the doughnut chart line variant #1B76D3 rgba(66, 165, 245, 0.4)
  },
  "Calories Burned": {
    barColor: "#FF0081", // primary (red) #FF0081 ef5350
    lineColor: "rgba(239, 83, 80, 0.4)",
  },
  // Optional: add additional mappings as needed
  "Exercise Duration": {
    barColor: "#ab47bc",      // purple
    lineColor: "rgba(171, 71, 188, 0.4)",
  },
  "Distance Covered": {
    barColor: "#ffa726",      // orange
    lineColor: "rgba(255, 167, 38, 0.4)",
  },
};
async function retryFetch(url, options = {}, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
}


export default function ShowGoals() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState("Calories Burned");

 
  const fetchLogs = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const users = await retryFetch("http://localhost:3001/users");
    console.log("users =", users);
    const logsData = await retryFetch("http://localhost:3001/activitylogs");
    const alyssaLogs = logsData.filter((log) => log.user === "alyssa");
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
    if (logs.length === 0) {
      return {};
    }

    const today = new Date();
    //today.setHours(23, 59, 59, 999); 

    const todayYMD = {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    };
    //const weekStart = startOfWeek(today);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);

    // Initialize goal data
    const initial = Object.fromEntries(
      Object.entries(GOAL_CONFIG).map(([label, { unit }]) => [
        label,
        { todayVal: 0, weekly: Array(7).fill(0), monthly: Array(30).fill(0), unit },
      ])
    );

    logs.forEach((log) => {
      const { year, month, day } = toLocalDate(log.timestamp);
      const logDate = new Date(year, month, day);
      logDate.setHours(0, 0, 0, 0); 
      

      const isToday =
        year === todayYMD.year && month === todayYMD.month && day === todayYMD.day;
      const isThisWeek = logDate >= weekStart && logDate <= today;
      const weekday = logDate.getDay();

      // For monthly, map day difference to index (last 30 days)
      const daysDiff = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
      const isThisMonth = daysDiff >= 0 && daysDiff < 30;

      for (const [goal, { key }] of Object.entries(GOAL_CONFIG)) {
        let value = 0;

        if (goal === "Calories Burned") {
          const hasRequiredFields =
            log.gender != null &&
            log.age != null &&
            log.weight != null &&
            log.vo2Max != null &&
            log.heartRate != null;
          if (hasRequiredFields) {
            value = calculateCaloriesHRBased({
              gender: Number(log.gender),
              age: Number(log.age),
              weight: Number(log.weight),
              VO2max: Number(log.vo2Max),
              heartRate: Number(log.heartRate),
            });
          } else if (log.caloriesBurned != null) {
            value = Number(log.caloriesBurned);
          }
          value /= 30; // Scale calories
        } else if (key && log[key] != null) {
          value = Number(log[key]) || 0;

          switch (goal) {
            case "Exercise Duration":
              value = value / 60 / 10; // seconds to hours scaled
              break;
            case "Steps Taken":
              //value -= 953; DO TOMORROW
              value /= 100;
              break;
            case "Distance Covered":
              value /= 50;
              break;
            case "Water Intake":
              value /= 8;
              break;
            default:
              break;
          }
        }

        if (value) {
          if (isToday) initial[goal].todayVal += value;
          if (isThisWeek) initial[goal].weekly[weekday] += value;
          if (isThisMonth) initial[goal].monthly[29 - daysDiff] += value; // oldest first for line chart
        }
      }
    });

    const goalRemainingMessages = {
      "Calories Burned": (_, todayVal) =>
        todayVal < GOAL_CONFIG["Calories Burned"].target
          ? `Need to burn ${Math.max(
              0,
              GOAL_CONFIG["Calories Burned"].target - todayVal
            ).toFixed(0)} more calories today.`
          : "Congrats! You’ve reached your calorie burn goal today.",
      "Exercise Duration": (total) =>
        total < GOAL_CONFIG["Exercise Duration"].target
          ? `Exercise ${Math.max(
              0,
              GOAL_CONFIG["Exercise Duration"].target - total
            ).toFixed(1)} more hours this week.`
          : "Congrats! You’ve reached your exercise duration goal.",
      "Steps Taken": (total) =>
        total < GOAL_CONFIG["Steps Taken"].target
          ? `Take ${Math.round(
              Math.max(0, GOAL_CONFIG["Steps Taken"].target - total)
            )} more steps.`
          : "Congrats! You’ve reached your step goal.",
      "Distance Covered": (total) =>
        total < GOAL_CONFIG["Distance Covered"].target
          ? `Walk ${Math.max(
              0,
              GOAL_CONFIG["Distance Covered"].target - total
            ).toFixed(1)} more miles.`
          : "Congrats! You’ve reached your distance goal.",
      "Water Intake": (todayVal) =>
        todayVal < GOAL_CONFIG["Water Intake"].target
          ? `Drink ${Math.round(
            Math.max( 0, GOAL_CONFIG["Water Intake"].target - todayVal) * 100
            ) / 100 } more cups today.`
          : "Congrats! You’ve reached your water intake goal.",
    };

    const goalData = {};
    for (const [goal, { todayVal, weekly, monthly, unit }] of Object.entries(
      initial
    )) {
      const totalWeekly =
        goal === "Water Intake" ? todayVal : weekly.reduce((a, b) => a + b, 0);

      const message =
        goal === "Calories Burned"
          ? goalRemainingMessages[goal](null, todayVal)
          : goalRemainingMessages[goal](totalWeekly);
      goalData[goal] = {
        today: `${todayVal.toFixed(goal === "Exercise Duration" || "Steps Taken" ? 1 : 0)} ${unit}`,
        weekly,
        monthly,
        unit,
        goalRemaining: message,
      };
    }

    return goalData;
  }, [logs]);

  const todayStr = new Date().toLocaleDateString();

  // Weekly bar chart data
  const weeklyChartData = useMemo(() => {
    const goal = goals[selectedGoal] || { weekly: [] };
    return {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: selectedGoal,
          data: goal.weekly,
          backgroundColor: GOAL_COLORS[selectedGoal]?.barColor || "#42a5f5",
          borderRadius: 4,
        },
      ],
    };
  }, [selectedGoal, goals]);

  // Monthly line chart data
  const monthlyChartData = useMemo(() => {
    const goal = goals[selectedGoal] || { monthly: [] };
    const labels = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString(undefined, { month: "numeric", day: "numeric" }));
    }
    return {
      labels,
      datasets: [
        {
          label: `${selectedGoal} - Last 30 Days`,
          data: goal.monthly,
          borderColor: GOAL_COLORS[selectedGoal]?.barColor || "#42a5f5",
          backgroundColor: GOAL_COLORS[selectedGoal]?.lineColor || "rgba(66, 165, 245, 0.4)",
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    };
  }, [selectedGoal, goals]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
      scales: {
        y: { beginAtZero: true },
      },
    }),
    []
  );
  if (loading) return <p>Loading goal data...</p>;
  if (error) return <p>Error: {error}</p>;
  // if (loading)
  //   return (
  //     <Grid container justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
  //       <CircularProgress />
  //     </Grid>
  //   );
  // if (error)
  //   return (
  //     <Alert severity="error" variant="outlined" style={{ margin: 20 }}>
  //       {error}
  //     </Alert>
  //   );

  return (
    <Grid container spacing={2} sx={{ px: 2, py: 3 }}>
      {/* Left side: Goal list */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: "100%", overflowY: "auto" }}>
          <List>
            {Object.entries(goals).map(([goal, data]) => (
              <ListItemButton
                key={goal}
                selected={goal === selectedGoal}
                onClick={() => setSelectedGoal(goal)}
              >
                <SoftBox
                  display="flex"
                  flexDirection="column"
                  sx={{ width: "100%" }}
                >
                  <SoftTypography variant="subtitle1" fontWeight="bold">
                    {goal}
                  </SoftTypography>
                  <SoftTypography variant="body2" color="text.secondary">
                    Today: {data.today}
                  </SoftTypography>
                  <SoftTypography variant="caption" color="text.secondary" mt={0.5}>
                    {data.goalRemaining}
                  </SoftTypography>
                </SoftBox>
              </ListItemButton>
            ))}
          </List>
        </Card>
      </Grid>

      {/* Right side: Charts */}
      <Grid item xs={12} md={8} container spacing={2}>
        {/* Weekly Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Weekly {selectedGoal}
            </Typography>
            <Bar data={weeklyChartData} options={chartOptions} />
          </Card>
        </Grid>

        {/* Monthly Line Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly {selectedGoal} (Last 30 Days)
            </Typography>
            <Line data={monthlyChartData} options={chartOptions} />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

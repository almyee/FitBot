import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import * as d3 from "d3";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";

function toLocalDate(dateString) {
  const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);
  return { year, month: month - 1, day };
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
    barColor: "#98EC2E",
    lineColor: "rgba(152, 236, 46, 0.4)",
  },
  "Water Intake": {
    barColor: "#42A5F5",
    lineColor: "rgba(66, 165, 245, 0.4)",
  },
  "Calories Burned": {
    barColor: "#FF0081",
    lineColor: "rgba(239, 83, 80, 0.4)",
  },
  "Exercise Duration": {
    barColor: "#ab47bc",
    lineColor: "rgba(171, 71, 188, 0.4)",
  },
  "Distance Covered": {
    barColor: "#ffa726",
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

// D3 Weekly Bar Chart Component
function WeeklyBarChart({ data, color }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 350 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
      .range([0, width])
      .padding(0.3);

    const yMax = d3.max(data) || 1;
    const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Y axis
    g.append("g").call(d3.axisLeft(y).ticks(5));

    // Bars
    g.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (_, i) => x(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]))
      .attr("y", (d) => y(d))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d))
      .attr("fill", color);
  }, [data, color]);

  return <svg ref={ref}></svg>;
}

// D3 Monthly Line Chart Component
function MonthlyLineChart({ data, color, fillColor }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 350 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain([
        d3.timeDay.offset(new Date(), -29),
        new Date(),
      ])
      .range([0, width]);

    const yMax = d3.max(data) || 1;
    const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%m/%d"))
      )
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

    // Y axis
    g.append("g").call(d3.axisLeft(y).ticks(5));

    // Line generator
    const line = d3
      .line()
      .x((_, i) => x(d3.timeDay.offset(new Date(), i - 29))) // map index to date
      .y((d) => y(d))
      .curve(d3.curveMonotoneX);

    // Append fill area
    g.append("path")
      .datum(data)
      .attr("fill", fillColor)
      .attr(
        "d",
        d3
          .area()
          .x((_, i) => x(d3.timeDay.offset(new Date(), i - 29)))
          .y0(y(0))
          .y1((d) => y(d))
          .curve(d3.curveMonotoneX)
      )
      .attr("opacity", 0.4);

    // Append line path
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

    // Points
    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (_, i) => x(d3.timeDay.offset(new Date(), i - 29)))
      .attr("cy", (d) => y(d))
      .attr("r", 3)
      .attr("fill", color);
  }, [data, color, fillColor]);

  return <svg ref={ref}></svg>;
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
    const todayYMD = {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    };
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);

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
              value = value / 60 / 10;
              break;
            case "Steps Taken":
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
          if (isThisMonth) initial[goal].monthly[29 - daysDiff] += value;
        }
      }
    });

    const goalRemainingMessages = {
      "Calories Burned": (_, todayVal) =>
        todayVal < GOAL_CONFIG["Calories Burned"].target
          ? `Need to burn ${Math.max(0, GOAL_CONFIG["Calories Burned"].target - todayVal).toFixed(0)} more calories today.`
          : "Congrats! You’ve reached your calorie burn goal today.",
      "Exercise Duration": (total) =>
        total < GOAL_CONFIG["Exercise Duration"].target
          ? `Exercise ${Math.max(0, GOAL_CONFIG["Exercise Duration"].target - total).toFixed(1)} more hours this week.`
          : "Congrats! You’ve reached your exercise duration goal.",
      "Steps Taken": (total) =>
        total < GOAL_CONFIG["Steps Taken"].target
          ? `Take ${Math.round(Math.max(0, GOAL_CONFIG["Steps Taken"].target - total))} more steps.`
          : "Congrats! You’ve reached your step goal.",
      "Distance Covered": (total) =>
        total < GOAL_CONFIG["Distance Covered"].target
          ? `Walk ${Math.max(0, GOAL_CONFIG["Distance Covered"].target - total).toFixed(1)} more miles.`
          : "Congrats! You’ve reached your distance goal.",
      "Water Intake": (todayVal) =>
        todayVal < GOAL_CONFIG["Water Intake"].target
          ? `Drink ${Math.round(Math.max(0, GOAL_CONFIG["Water Intake"].target - todayVal) * 100) / 100} more cups today.`
          : "Congrats! You’ve reached your water intake goal.",
    };

    const goalData = {};
    for (const [goal, { todayVal, weekly, monthly, unit }] of Object.entries(initial)) {
      const totalWeekly = goal === "Water Intake" ? todayVal : weekly.reduce((a, b) => a + b, 0);

      const message =
        goal === "Calories Burned"
          ? goalRemainingMessages[goal](null, todayVal)
          : goalRemainingMessages[goal](totalWeekly);
      goalData[goal] = {
        today: `${todayVal.toFixed(goal === "Exercise Duration" || goal === "Steps Taken" ? 1 : 0)} ${unit}`,
        weekly,
        monthly,
        unit,
        goalRemaining: message,
      };
    }

    return goalData;
  }, [logs]);

  if (loading) return <p>Loading goal data...</p>;
  if (error) return <p>Error: {error}</p>;

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
                <SoftBox display="flex" flexDirection="column" sx={{ width: "100%" }}>
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
            <WeeklyBarChart
              data={goals[selectedGoal]?.weekly || []}
              color={GOAL_COLORS[selectedGoal]?.barColor || "#42a5f5"}
            />
          </Card>
        </Grid>

        {/* Monthly Line Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly {selectedGoal} (Last 30 Days)
            </Typography>
            <MonthlyLineChart
              data={goals[selectedGoal]?.monthly || []}
              color={GOAL_COLORS[selectedGoal]?.barColor || "#42a5f5"}
              fillColor={GOAL_COLORS[selectedGoal]?.lineColor || "rgba(66, 165, 245, 0.4)"}
            />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

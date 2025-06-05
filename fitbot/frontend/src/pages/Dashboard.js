import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { DirectionsRun } from '@mui/icons-material';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Footer from "../examples/Footer";

function SquareCard({ title, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 250,
        height: 250,
        borderRadius: 16,
        backgroundColor: "#f5f5f5",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        transition: "box-shadow 0.3s ease",
        margin: 8,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"}
    >
      <div style={{ fontSize: 56, marginBottom: 20, color: "#1976d2" }}>
        {icon}
      </div>
      <div style={{ fontSize: 22, fontWeight: "600", color: "#333" }}>
        {title}
      </div>
    </div>
  );
}

// D3 DonutChart component
function DonutChart({ data, colors, size = 200 }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const radius = size / 2;
    const color = d3.scaleOrdinal().range(colors);

    const pie = d3.pie().value(d => d);
    const arcs = pie(data);

    const arcGenerator = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.9)
      .cornerRadius(5);

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous renders

    svg
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${radius}, ${radius})`)
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px");

    // Add text label for percentage in center
    const total = d3.sum(data);
    const taken = data[0];
    const percent = total > 0 ? Math.round((taken / total) * 100) : 0;

    const g = svg.select("g");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .style("font-size", "32px")
      .style("font-weight", "bold")
      .text(`${percent}%`);

    // Add label below percentage
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.5em")
      .style("font-size", "14px")
      .style("fill", "#666")
      .text("Complete");

  }, [data, colors, size]);

  return <svg ref={ref}></svg>;
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [logData, setLogData] = useState(null);
  const [selectedCharts, setSelectedCharts] = useState(["steps"]);

  useEffect(() => {
    fetch("http://localhost:3001/summary")
      .then((response) => response.json())
      .then((message) => setData(message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/activitylogs")
      .then((response) => response.json())
      .then((logs) => setLogData(logs))
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const todayLogs = Array.isArray(logData)
    ? logData.filter((log) => {
      const logDate = new Date(log.timestamp);
      const localDate = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());
      return localDate.getTime() === todayDate.getTime();
    }) : [];

  // Calculate current values with safety checks
  const stepsTaken = todayLogs.reduce((sum, log) => sum + Number(log.stepCount || 0), 0) / 100;
  const waterDrank = todayLogs.reduce((sum, log) => sum + Number(log.waterIntake || 0), 0) / 8;
  const caloriesBurned = todayLogs.reduce((sum, log) => sum + Number(log.caloriesBurned || 0), 0) / 10;

  const targetSteps = 10000;
  const targetWater = 8;      // cups
  const targetCalories = 2000;

  // Ensure remaining is never negative
  const clamp = (val) => (val < 0 ? 0 : val);

  const chartData = {
    steps: [stepsTaken, clamp(targetSteps - stepsTaken)],
    water: [waterDrank, clamp(targetWater - waterDrank)],
    calories: [caloriesBurned, clamp(targetCalories - caloriesBurned)],
  };

  const colors = {
  steps: ["#4caf50", "#c8e6c9"],       // green and light green (no change)
  water: ["#2196f3", "#bbdefb"],       // blue and light blue (no change)
  calories: ["#e91e63", "#f8bbd0"],    // pink and light pink (updated)
};

  const handleChartChange = (e) => {
    const value = e.target.value;
    setSelectedCharts(typeof value === "string" ? value.split(",") : value);
  };

  const units = {
    steps: "steps",
    water: "cups",
    calories: "calories",
  };

  return (
    <>
      <div style={{ padding: 16 }}>
        {/* Cards container */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <SquareCard
            title="Exercise"
            icon={<DirectionsRun fontSize="inherit" />}
            onClick={() => window.location.href = "/select-exercise"}
          />
          <SquareCard
            title="Step Count"
            icon={<i className="fas fa-shoe-prints" style={{ transform: "rotate(-90deg)" }} />}
            onClick={() => window.location.href = "/step-count"}
          />
          <SquareCard
            title="Goals"
            icon={<i className="fa-solid fa-list-check" />}
            onClick={() => window.location.href = "/goals"}
          />
          <SquareCard
            title="Water Intake"
            icon={<i className="fa-solid fa-glass-water-droplet" />}
            onClick={() => window.location.href = "/water-intake"}
          />
        </div>

        {/* Select Metrics */}
        <div
          style={{
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h4 style={{ marginBottom: 24, fontSize: "1.75rem", textAlign: "center" }}>
            Select Metrics to Display
          </h4>

          <div style={{ marginBottom: 24, maxWidth: 350, width: "100%" }}>
            <Select
              multiple
              value={selectedCharts}
              onChange={handleChartChange}
              fullWidth
              MenuProps={{
                PaperProps: {
                  style: { textAlign: "center" }
                },
                MenuListProps: {
                  style: {
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }
                }
              }}
              sx={{ textAlign: "center" }}
            >
              <MenuItem value="steps" sx={{ justifyContent: "center", fontSize: "1.25rem", width: "100%" }}>Steps</MenuItem>
              <MenuItem value="water" sx={{ justifyContent: "center", fontSize: "1.25rem", width: "100%" }}>Water Intake</MenuItem>
              <MenuItem value="calories" sx={{ justifyContent: "center", fontSize: "1.25rem", width: "100%" }}>Calories Burned</MenuItem>
            </Select>
          </div>
        </div>

        {/* Donut Charts */}
        <Grid container spacing={6} justifyContent="center">
          {selectedCharts.map(metric => {
            const [taken, remaining] = chartData[metric];
            const total = taken + remaining;
            const unit = units[metric];
            const percent = total > 0 ? Math.round((taken / total) * 100) : 0;

            return (
              <Grid item xs={12} md={4} key={metric} style={{ textAlign: "center" }}>
                <h3 style={{ marginBottom: 8, fontWeight: "600" }}>
                  {metric.charAt(0).toUpperCase() + metric.slice(1)} Progress
                </h3>

                <DonutChart
                  data={[taken, remaining]}
                  colors={colors[metric]}
                  size={400}
                />

                <div style={{ marginTop: 12, fontSize: 18, fontWeight: 600 }}>
                  {Math.round(taken)} / {Math.round(total)} {unit}
                </div>
                <div style={{ color: "#666", fontWeight: "normal" }}>
                  {percent}% complete
                </div>
              </Grid>
            );
          })}
        </Grid>
      </div>
      <Footer company={{ href: "https://yourcompany.com", name: "FitBot" }} />
    </>
  );
}

export default Dashboard;

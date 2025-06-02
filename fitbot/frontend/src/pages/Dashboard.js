import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { DirectionsRun } from '@mui/icons-material';
import DashboardNavbar from "../examples/Navbars/DashboardNavbar";
import Footer from "../examples/Footer";
import DefaultDoughnutChart from "../examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import configs from "../examples/Charts/DoughnutCharts/DefaultDoughnutChart/configs";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";

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

  const stepsTaken = todayLogs.reduce((sum, log) => sum + Number(log.stepCount || 0), 0) / 100;
  const waterDrank = todayLogs.reduce((sum, log) => sum + Number(log.waterIntake || 0), 0) / 8;
  const caloriesBurned = todayLogs.reduce((sum, log) => sum + Number(log.caloriesBurned || 0), 0)/ 10;


  const targetSteps = 10000;
  const targetWater = 8;      // in cups
  const targetCalories = 2000;

  const handleChartChange = (e) => {
    const value = e.target.value;
    setSelectedCharts(typeof value === "string" ? value.split(",") : value);
  };

  
  const chartConfigs = {
  steps: configs(
    ["Taken", "Remaining"],
    {
      label: "Steps",
      data: [stepsTaken, Math.max(0, targetSteps - stepsTaken)],
      backgroundColors: ["success", "light"],
    },
    70,
  ),
  water: configs(
    ["Drank", "Remaining"],
    {
      label: "Water",
      data: [waterDrank, Math.max(0, targetWater - waterDrank)],
      backgroundColors: ["info", "light"],
    },
    70,
  ),
  calories: configs(
    ["Burned", "Remaining"],
    {
      label: "Calories",
      data: [caloriesBurned, Math.max(0, targetCalories - caloriesBurned)],
      backgroundColors: ["primary", "light"],
    },
    70,
  ),
};

  return (
    <>
      <div style={{ padding: 16 }}>
        <h4 style={{ marginBottom: 16 }}></h4>

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

        {/* Donut Charts Section */}
        
        <div
          style={{
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // centers content horizontally
          }}
        >
          <h4 style={{ marginBottom: 24, fontSize: "1.75rem", textAlign: "center" }}>
            Select Metrics to Display
          </h4>

          {/* Dropdown */}
          <div style={{ marginBottom: 24, maxWidth: 350, width: "100%" }}>
            <Select
              multiple
              value={selectedCharts}
              onChange={handleChartChange}
              fullWidth
              MenuProps={{
                PaperProps: {
                  style: {
                    textAlign: "center",
                  },
                },
                MenuListProps: {
                  style: {
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  },
                },
              }}
              sx={{
                textAlign: "center",
              }}
            >
              <MenuItem
                value="steps"
                sx={{
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: "1.25rem",  // bigger text
                  width: "100%",        // full width
                  "&:hover": {
                    // backgroundColor: "rgba(25, 118, 210, 0.08)", // typical MUI hover color
                    width: "100%",
                  },
                }}
              >
                Steps
              </MenuItem>
              <MenuItem
                value="water"
                sx={{
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: "1.25rem",
                  width: "100%",
                  "&:hover": {
                    // backgroundColor: "rgba(25, 118, 210, 0.08)",
                    width: "100%",
                  },
                }}
              >
                Water Intake
              </MenuItem>
              <MenuItem
                value="calories"
                sx={{
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: "1.25rem",
                  width: "100%",
                  "&:hover": {
                    // backgroundColor: "rgba(25, 118, 210, 0.08)",
                    width: "100%",
                  },
                }}
              >
                Calories Burned
              </MenuItem>
            </Select>


          </div>
        </div>

        <div>
          {/* Doughnut charts */}
          <Grid container spacing={13}>
            {selectedCharts.map((metric) => {
              const config = chartConfigs[metric];
              const current = config.data.datasets[0].data[0];
              const remaining = config.data.datasets[0].data[1];
              const total = current + remaining;
              const percent = ((current / total) * 100).toFixed(1);

              let unit = "";
              if (metric === "steps") unit = "steps";
              else if (metric === "water") unit = "cups";
              else if (metric === "calories") unit = "calories";

              return (
                <Grid item xs={12} md={4} key={metric}>
                  <div style={{ padding: 24, textAlign: "center" }}>
                    <DefaultDoughnutChart
                      title={config.data.datasets?.[0]?.label || "Progress Overview"}
                      description=""
                      height="25rem"
                      chart={{
                        data: config.data,
                        options: config.options,
                      }}
                    />
                    <div style={{ marginTop: 16, fontSize: 18, fontWeight: 600 }}>
                      {Math.round(current)} / {total} {unit}
                    </div>
                    <div style={{ color: "#666", fontWeight: "normal" }}>
                      {percent}% complete
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>
      <Footer company={{ href: "https://yourcompany.com", name: "FitBot" }} />
    </>
  );
}

export default Dashboard;

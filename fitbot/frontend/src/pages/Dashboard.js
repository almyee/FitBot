// need to have `npm run start` running in terminal #1, have `node server.js` running in termimal #2 (in backend/config/) -> then can see dashboard with backend connected
import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {DirectionsRun} from '@mui/icons-material';
import SoftBox from "../components/SoftBox";
import SoftTypography from "../components/SoftTypography";
import DashboardNavbar from "../examples/Navbars/DashboardNavbar";
import Footer from "../examples/Footer";
import MiniStatisticsCard from "../examples/Cards/StatisticsCards/MiniStatisticsCard";
import DefaultLineChart from "../examples/Charts/LineCharts/DefaultLineChart";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import DefaultDoughnutChart from "../examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import configs from "../examples/Charts/DoughnutCharts/DefaultDoughnutChart/configs";

function Dashboard() {
  const [data, setData] = useState(null);
  const [logData, setLogData] = useState(null);
  const [selectedChart, setSelectedChart] = useState("steps");

  useEffect(() => {
    // Make a GET request to your backend API
    fetch("http://localhost:3001/summary")
      .then((response) => response.json())
      .then((message) => setData(message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    // Fetch the logs from the backend
    fetch("http://localhost:3001/activitylogs")
      .then((response) => response.json())
      .then((logs) => setLogData(logs))
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

   const chartConfigs = {
    steps: configs(["Taken", "Remaining"], { label: "Steps", data: [5000, 3000], backgroundColors: ["info", "light"] }, 70),
    water: configs(["Drank", "Remaining"], { label: "Water", data: [5, 3], backgroundColors: ["primary", "light"] }, 70),
    calories: configs(["Burned", "Remaining"], { label: "Calories", data: [1500, 500], backgroundColors: ["warning", "light"] }, 70),
  };
  
  return (
    <>
      <SoftBox p={2}>
        <SoftTypography variant="h4" mb={2}>
          Dashboard
        </SoftTypography>

        {/* Statistics Cards */}
        <SoftBox display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <MiniStatisticsCard
            title={{ text: "Exercise" }}
            //count="0"
            percentage={{ color: "success", text: "" }}
            icon={{
              color: "successfkwoe",
              component: <DirectionsRun fontSize="large" />,
            }} 
            direction="bottom"
            navigateTo="/select-exercise"
          />


          <MiniStatisticsCard
            title={{ text: "Step Count" }}
            //count="0"
            percentage={{ color: "success", text: "" }}
            icon={{
                color: "info",
                component: <SoftBox style={{ transform: "rotate(-90deg)" }}><i className="fas fa-shoe-prints fa-lg" /></SoftBox>
              }}
            direction="bottom" 
            navigateTo="/step-count"
          />

          <MiniStatisticsCard
            title={{ text: "Goals" }}
            //count="0"
            percentage={{ color: "success", text: "" }}
            icon={{
              color: "info",
              component: <i className="fa-solid fa-list-check fa-lg"/>
            }}
            direction="bottom"
            navigateTo="/goals"
          />

          <MiniStatisticsCard
            title={{ text: "Water Intake" }}
            //count="0"
            icon={{
              color: "info",
              component: <i class="fa-solid fa-glass-water-droplet fa-lg"/>
            }}
            direction="bottom"
            navigateTo="water-intake"
          />
        </SoftBox>

        {/* Donut Chart Dropdown Section */}
        <SoftBox mt={6}>
          <SoftTypography variant="h5" mb={2}>Select a Metric to Display</SoftTypography>
          <SoftBox mb={2} width="200px">
            <Select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              fullWidth
            >
              <MenuItem value="steps">Steps</MenuItem>
              <MenuItem value="water">Water Intake</MenuItem>
              <MenuItem value="calories">Calories Burned</MenuItem>
            </Select>
          </SoftBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
             <DefaultDoughnutChart
                title={chartConfigs[selectedChart].data.datasets?.[0]?.label || "Progress Overview"}
                description="Progress Overview"
                chart={{
                  data: chartConfigs[selectedChart].data,
                  options: chartConfigs[selectedChart].options,
                }}
              />
            </Grid>
          </Grid>
        </SoftBox>

{/*
        <div>
        {data ? (
          <div>{JSON.stringify(data)}</div>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <div>
        {logData ? (
          <div>{JSON.stringify(logData)}</div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
*/}
      </SoftBox>
      <Footer company={{ href: "https://yourcompany.com", name: "FitBot" }} />
    </>
  );
}

export default Dashboard;


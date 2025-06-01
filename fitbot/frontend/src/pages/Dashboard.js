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
  const [selectedCharts, setSelectedCharts] = useState(["steps"]);

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

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const todayLogs = logData?.filter((log) => {
    const logDate = new Date(log.timestamp);
    const localDate = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());
    return localDate.getTime() === todayDate.getTime();
    
  }) || [];

  const stepsTaken = todayLogs.reduce((sum, log) => sum + Number(log.stepCount || 0), 0) / 100;
  const waterDrank = todayLogs.reduce((sum, log) => sum + Number(log.waterIntake || 0), 0) / 8;
  const caloriesBurned = todayLogs.reduce((sum, log) => sum + Number(log.caloriesBurned || 0), 0)/ 10;

  console.log("doughnut stuff: ", stepsTaken, waterDrank, caloriesBurned)
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
        
        {/* Donut Charts Section */}
        <SoftBox mt={6}>
          <SoftTypography variant="h4" mb={3}>
            Select Metrics to Display
          </SoftTypography>

        {/* Dropdown Menu */}
          <SoftBox mb={3} width="300px">
            <Select
              multiple
              value={selectedCharts}
              onChange={handleChartChange}
              fullWidth
            >
              <MenuItem value="steps">Steps</MenuItem>
              <MenuItem value="water">Water Intake</MenuItem>
              <MenuItem value="calories">Calories Burned</MenuItem>
            </Select>
          </SoftBox>

        {/* Rows of Doughnut Charts */}
          <Grid container spacing={3}>
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
                  <SoftBox p={6} textAlign="center">
                    <DefaultDoughnutChart
                      title= {config.data.datasets?.[0]?.label || "Progress Overview"}
                      description=""
                      height="25rem"
                      chart={{
                        data: config.data,
                        options: config.options,
                      }}
                    />
                    <SoftTypography mt={2} variant="h6">
                      {Math.round(current)} / {total} {unit}
                    </SoftTypography>
                    <SoftTypography variant="button" color="text" fontWeight="regular">
                      {percent}% complete
                    </SoftTypography>
                  </SoftBox>
                </Grid>
              );
            })}
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


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

function Dashboard() {
  const [data, setData] = useState(null);
  const [logData, setLogData] = useState(null);

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
              color: "info",
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

        {/* Example line chart */}
        {/* <SoftBox mt={4}>
          <DefaultLineChart
            title="Example Line Chart"
            description="This is an example of a line chart with no data yet."
            chart={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
              datasets: [
                {
                  label: "Sample Data",
                  data: [0, 0, 0, 0, 0],
                  color: "info",
                },
              ],
            }}
          />
        </SoftBox> */}
        <SoftBox mt={4}>
          <DefaultLineChart
            title="Workout Duration Over Time"
            description="Logged workout durations from the database"
            chart={{
              labels: logData?.map((entry) =>
                new Date(entry.timestamp).toLocaleDateString()
              ) || [],
              datasets: [
                {
                  label: "Duration (minutes)",
                  data: logData?.map((entry) => entry.duration) || [],
                  color: "info",
                },
              ],
            }}
          />
        </SoftBox>
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
      </SoftBox>
      <Footer company={{ href: "https://yourcompany.com", name: "FitBot" }} />
    </>
  );
}

export default Dashboard;


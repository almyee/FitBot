// need to have `npm run start` running in terminal #1, have `node server.js` running in termimal #2 (in backend/config/) -> then can see dashboard with backend connected
import React, { useEffect, useState } from "react";
// import Icon from "@mui/material/Icon";
// import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
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
            count="0"
            percentage={{ color: "success", text: "" }}
            // icon={{
            //     color: "info",
            //     component: <PersonIcon />,
            //   }}
          />

          <MiniStatisticsCard
            title={{ text: "Step Count" }}
            count="$0"
            percentage={{ color: "success", text: "" }}
            // icon={{
            //     color: "info",
            //     component: <PersonIcon />,
            //   }}
          />
          <MiniStatisticsCard
            title={{ text: "Goals" }}
            count="0"
            percentage={{ color: "success", text: "" }}
            // icon={{
            //     color: "info",
            //     component: <PersonIcon />,
            //   }}
          />
          <MiniStatisticsCard
            title={{ text: "Water Intake" }}
            count="0"
            // icon={{
            //     color: "info",
            //     component: <PersonIcon />,
            //   }}
          />
        </SoftBox>

        {/* Example line chart */}
        <SoftBox mt={4}>
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


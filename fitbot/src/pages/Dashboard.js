// Simplified example
// import React from 'react';
// import SoftBox from '../components/SoftBox';
// import SoftTypography from '../components/SoftTypography';
// import DashboardNavbar from '../examples/Navbars/DashboardNavbar';
// import Footer from '../examples/Footer';
// // ...and other components

// function Dashboard() {
//   return (
//     <>
//       <DashboardNavbar />
//       <SoftBox>
//         <SoftTypography variant="h4">Dashboard</SoftTypography>
//         {/* Replace API data with hardcoded numbers */}
//       </SoftBox>
//       <Footer
//   company={{ href: "https://yourcompany.com", name: "My Company" }}
//   links={[
//     { href: "/about", name: "About" },
//     { href: "/contact", name: "Contact" },
//     { href: "/help", name: "Help" },
//   ]}
// />

//     </>
//   );
// }

// export default Dashboard;

// Blank example
import React from "react";
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
  return (
    <>
      <SoftBox p={2}>
        <SoftTypography variant="h4" mb={2}>
          Dashboard
        </SoftTypography>

        {/* Statistics Cards */}
        <SoftBox display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <MiniStatisticsCard
            title={{ text: "Users" }}
            count="0"
            percentage={{ color: "success", text: "" }}
            // icon={{
            //     color: "info",
            //     component: <PersonIcon />,
            //   }}
          />

          <MiniStatisticsCard
            title={{ text: "Revenue" }}
            count="$0"
            percentage={{ color: "success", text: "" }}
            // icon={{
            //     color: "info",
            //     component: <PersonIcon />,
            //   }}
          />
          <MiniStatisticsCard
            title={{ text: "Orders" }}
            count="0"
            percentage={{ color: "success", text: "" }}
            // icon={{
            //     color: "info",
            //     component: <PersonIcon />,
            //   }}
          />
          <MiniStatisticsCard
            title={{ text: "Feedback" }}
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
      </SoftBox>
      <Footer company={{ href: "https://yourcompany.com", name: "My Company" }} />
    </>
  );
}

export default Dashboard;


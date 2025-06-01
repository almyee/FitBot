// import React, { useMemo } from "react";
// import PropTypes from "prop-types";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import { Bar } from "react-chartjs-2";
// import DefaultDoughnutChart from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart";
// import SoftBox from "../../../../components/SoftBox";
// import SoftTypography from "../../../../components/SoftTypography";
// import configs from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart/configs";

// import {
//   Chart as ChartJS,
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// );


// //HARD CODED VALUES HERE FOR NOW (Needs to be imported from MongoDB)
// const currentSteps = 2000;
// const targetSteps = 10000;
// const weeklySteps = [4000, 5500, 6000, 7000, 8000, 3000, 5000]; // Array of 7 numbers


// export default function ShowSteps() {
  
//   const percentage = ((currentSteps / targetSteps) * 100).toFixed(1);

//   const doughnutChart = useMemo(() => {
//     const labels = ["Steps Taken", "Remaining"];
//     const datasets = {
//       label: "Steps",
//       data: [currentSteps, Math.max(targetSteps - currentSteps, 0)],
//       backgroundColors: ["success", "dark"],
//     };
//     return configs(labels, datasets, 70);
//   }, [currentSteps, targetSteps]);

//   const weeklyBarData = useMemo(() => ({
//     labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
//     datasets: [
//       {
//         label: "Steps",
//         data: weeklySteps,
//         backgroundColor: "#42a5f5",
//         borderRadius: 4,
//       },
//     ],
//   }), [weeklySteps]);

//   const weeklyBarOptions = useMemo(() => ({
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   }), []);

//   return (
//     <Grid container spacing={6}>
//       <Grid item xs={12} md={6}>
//         <DefaultDoughnutChart
//           title="Step Progress"
//           height="25rem"
//           chart={doughnutChart}
//         />
//         <SoftBox mt={2} textAlign="center">
//           <SoftTypography variant="h6">
//             {currentSteps}/{targetSteps} steps
//           </SoftTypography>
//           <SoftTypography variant="caption" color="text">
//             {percentage}% of goal reached
//           </SoftTypography>
//         </SoftBox>
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <Card>
//           <SoftBox p={3}>
//             <SoftTypography variant="h5" mb={2}>
//               Weekly Step Count
//             </SoftTypography>
//             <Bar data={weeklyBarData} options={weeklyBarOptions} />
//           </SoftBox>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// }

// ShowSteps.propTypes = {
//   currentSteps: PropTypes.number.isRequired,
//   targetSteps: PropTypes.number.isRequired,
//   weeklySteps: PropTypes.arrayOf(PropTypes.number).isRequired,
// };

// import React, { useMemo, useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import { Bar } from "react-chartjs-2";
// import DefaultDoughnutChart from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart";
// import SoftBox from "../../../../components/SoftBox";
// import SoftTypography from "../../../../components/SoftTypography";
// import configs from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart/configs";

// import {
//   Chart as ChartJS,
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// );

// function isSameDay(date1, date2) {
//   return (
//     date1.getFullYear() === date2.getFullYear() &&
//     date1.getMonth() === date2.getMonth() &&
//     date1.getDate() === date2.getDate()
//   );
// }

// export default function ShowSteps() {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch step logs from MongoDB backend
//   useEffect(() => {
//     async function fetchLogs() {
//       try {
//         const response = await fetch("http://localhost:3001/activitylogs");
//         if (!response.ok) throw new Error("Failed to fetch logs");
//         const data = await response.json();
//         const alyssaLogs = data.filter((log) => log.user === "alyssa");
//         setLogs(alyssaLogs);
//       } catch (err) {
//         setError(err.message || "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchLogs();
//   }, []);

//   const targetSteps = 10000;

//   // const today = useMemo(() => new Date(), []);

//   // // Sum today's steps from logs
//   // const currentSteps = useMemo(() => {
//   //   return logs
//   //     .filter(log => {
//   //       const logDate = new Date(log.timestamp);
//   //       return isSameDay(logDate, today);
//   //     })
//   //     .reduce((sum, log) => sum + (log.stepCount || 0), 0);
//   // }, [logs, today]);
//   // Use UTC "today" date for comparison
//   const todayUTC = useMemo(() => {
//     const now = new Date();
//     // Create a new date normalized to UTC midnight
//     return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
//   }, []);

//   const currentSteps = useMemo(() => {
//     return logs
//       .filter(log => {
//         const logDate = new Date(log.timestamp);
//         // Normalize logDate to UTC midnight
//         const logDateUTC = new Date(Date.UTC(logDate.getUTCFullYear(), logDate.getUTCMonth(), logDate.getUTCDate()));
//         return logDateUTC.getTime() === todayUTC.getTime();
//       })
//       .reduce((sum, log) => sum + (log.stepCount || 0), 0);
//   }, [logs, todayUTC]);

//   // Calculate weekly steps Sun-Sat
//   const weeklySteps = useMemo(() => {
//     const steps = [0, 0, 0, 0, 0, 0, 0];
//     logs.forEach(log => {
//       const date = new Date(log.timestamp);
//       const day = date.getDay(); // 0=Sun .. 6=Sat
//       steps[day] += log.stepCount || 0;
//     });
//     return steps;
//   }, [logs]);

//   const percentage = ((currentSteps / targetSteps) * 100).toFixed(1);

// //   const doughnutChart = useMemo(() => {
// //   const labels = ["Steps Taken", "Remaining"];
// //   const datasets = {
// //     label: "Steps",
// //     data: [currentSteps, Math.max(targetSteps - currentSteps, 0)],
// //     backgroundColors: ["info", "dark"],  // 'info' exists in gradients, 'dark' is fallback
// //   };
// //   return configs(labels, datasets, 70);
// // }, [currentSteps, targetSteps]);

// // const doughnutChart = {
// //   data: {
// //     labels: ["Steps Taken", "Remaining"],
// //     datasets: [
// //       {
// //         label: "Steps",
// //         data: [7500, 2500],
// //         backgroundColor: ["#42a5f5", "#cfd8dc"],
// //         borderWidth: 1,
// //       },
// //     ],
// //   },
// //   options: {
// //     cutout: 70,
// //     responsive: true,
// //     plugins: {
// //       legend: {
// //         display: true,
// //       },
// //     },
// //   },
// // };
// const doughnutChart = useMemo(() => {
//   const labels = ["Steps Taken", "Remaining"];
//   const datasets = {
//     label: "Steps",
//     data: [weeklyTotal, Math.max(targetSteps - weeklyTotal, 0)],
//     backgroundColors: ["info", "dark"],
//   };
//   return configs(labels, datasets, 70);
// }, [weeklyTotal, targetSteps]);


//   const weeklyBarData = useMemo(() => ({
//     labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
//     datasets: [
//       {
//         label: "Steps",
//         data: weeklySteps,
//         backgroundColor: "#42a5f5",
//         borderRadius: 4,
//       },
//     ],
//   }), [weeklySteps]);

//   const weeklyBarOptions = useMemo(() => ({
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   }), []);

//   if (loading) return <p>Loading step data...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <Grid container spacing={6}>
//       <Grid item xs={12} md={6}>
//         <DefaultDoughnutChart
//           title="Step Progress"
//           height="25rem"
//           chart={doughnutChart}
//         />
//         <SoftBox mt={2} textAlign="center">
//           <SoftTypography variant="h6">
//             {currentSteps}/{targetSteps} steps
//           </SoftTypography>
//           <SoftTypography variant="caption" color="text">
//             {percentage}% of goal reached
//           </SoftTypography>
//         </SoftBox>
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <Card>
//           <SoftBox p={3}>
//             <SoftTypography variant="h5" mb={2}>
//               Weekly Step Count
//             </SoftTypography>
//             <Bar data={weeklyBarData} options={weeklyBarOptions} />
//           </SoftBox>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// }

// ShowSteps.propTypes = {
//   currentSteps: PropTypes.number,
//   targetSteps: PropTypes.number,
//   weeklySteps: PropTypes.arrayOf(PropTypes.number),
// };

import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Bar } from "react-chartjs-2";
import DefaultDoughnutChart from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import configs from "../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart/configs";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function ShowSteps() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch step logs from MongoDB backend
  useEffect(() => {
    async function fetchLogs() {
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
    }
    fetchLogs();
  }, []);

const targetSteps = 100000; // Daily goal for doughnut chart

  const todayUTC = useMemo(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }, []);

  // const currentSteps = useMemo(() => {
  //   return logs
  //     .filter((log) => {
  //       const logDate = new Date(log.timestamp);
  //       const logDateUTC = new Date(Date.UTC(logDate.getUTCFullYear(), logDate.getUTCMonth(), logDate.getUTCDate()));
  //       return logDateUTC.getTime() === todayUTC.getTime();
  //     })
  //     .reduce((sum, log) => sum + (log.stepCount || 0), 0);
  // }, [logs, todayUTC]);

  const weeklySteps = useMemo(() => {
    const steps = [0, 0, 0, 0, 0, 0, 0];
    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      const day = date.getDay(); // 0 = Sunday
      steps[day] += log.stepCount || 0;
    });
    return steps;
  }, [logs]);

  const weeklyTotal = useMemo(() => {
    return weeklySteps.reduce((sum, steps) => sum + steps, 0);
  }, [weeklySteps]);

  const percentage = ((weeklyTotal / targetSteps) * 100).toFixed(1);
  // const dailyTotal = useMemo(() => {
  //   return logs
  //     .filter((log) => {
  //       const logDate = new Date(log.timestamp);
  //       const logDateUTC = new Date(Date.UTC(
  //         logDate.getUTCFullYear(),
  //         logDate.getUTCMonth(),
  //         logDate.getUTCDate()
  //       ));
  //       return logDateUTC.getTime() === todayUTC.getTime();
  //     })
  //     .reduce((sum, log) => sum + (log.stepCount || 0), 0);
  // }, [logs, todayUTC]);

  // const dailyPercentage = ((dailyTotal / targetSteps) * 100).toFixed(1);

  const todayDayIndex = useMemo(() => {
    return new Date().getDay(); // 0 = Sunday ... 6 = Saturday
  }, []);

const dailyTotal = useMemo(() => weeklySteps[todayDayIndex] || 0, [weeklySteps, todayDayIndex]);
const currentSteps = dailyTotal
const dailyPercentage = ((dailyTotal / targetSteps) * 100).toFixed(1);
// console.log("daily total: , daily perc: ", dailyTotal, dailyPercentage)


  // const doughnutChart = useMemo(() => {
  //   const labels = ["Steps Taken", "Remaining"];
  //   const datasets = {
  //     label: "Steps",
  //     data: [weeklyTotal, Math.max(targetSteps - weeklyTotal, 0)],
  //     backgroundColors: ["info", "dark"],
  //   };
  //   return configs(labels, datasets, 70);
  // }, [weeklyTotal, targetSteps]);
  const doughnutChart = useMemo(() => {
  const labels = ["Steps Taken", "Remaining"];
  const datasets = {
    label: "Steps",
    data: [currentSteps, Math.max(targetSteps - currentSteps, 0)],
    backgroundColors: ["success", "light"],
  };
  return configs(labels, datasets, 70);
}, [currentSteps, targetSteps]);


  const weeklyBarData = useMemo(() => ({
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Steps",
        data: weeklySteps,
        backgroundColor: "#42a5f5",
        borderRadius: 4,
      },
    ],
  }), [weeklySteps]);

  const weeklyBarOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }), []);

  if (loading) return <p>Loading step data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <DefaultDoughnutChart
          title="Daily Step Progress"
          height="25rem"
          chart={doughnutChart}
        />
        <SoftBox mt={2} textAlign="center">
          <SoftTypography variant="h6">
            {dailyTotal}/{targetSteps} steps
          </SoftTypography>
          <SoftTypography variant="caption" color="text">
            {dailyPercentage}% of daily goal reached
          </SoftTypography>
        </SoftBox>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" mb={2}>
              Weekly Step Count
            </SoftTypography>
            <Bar data={weeklyBarData} options={weeklyBarOptions} />
          </SoftBox>
        </Card>
      </Grid>
    </Grid>
  );
}

ShowSteps.propTypes = {
  currentSteps: PropTypes.number,
  targetSteps: PropTypes.number,
  weeklySteps: PropTypes.arrayOf(PropTypes.number),
};



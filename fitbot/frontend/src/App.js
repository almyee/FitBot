
// Import React Router components for routing functionality
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import page components for different routes
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/Signin";
import Settings from "./pages/Settings";
import SignUp from "./pages/Signup";

// Import the navigation bar component
import DashboardNavbar from "./examples/Navbars/DashboardNavbar";  // Update path if needed

// Import smaller card components for specific stats pages
import SelectExercise from "./examples/Cards/StatisticsCards/MiniStatisticsCard/SelectExercise";
import ShowSteps from "./examples/Cards/StatisticsCards/MiniStatisticsCard/ShowSteps";
import ShowWaterIntake from "./examples/Cards/StatisticsCards/MiniStatisticsCard/ShowWaterIntake";
import ShowGoals from "./examples/Cards/StatisticsCards/MiniStatisticsCard/ShowGoals";

// Main app component which sets up routing and navbar
function App() {
  return (
    <>
      {/* Display the dashboard navigation bar on every page */}
      <DashboardNavbar />

      {/* Define the routes for the app */}
      <Routes>
        {/* Route for sign-in page */}
        <Route path="/sign-in" element={<SignIn />} />

        {/* Route for sign-up page */}
        <Route path="/sign-up" element={<SignUp />} />

        {/* Route for settings page */}
        <Route path="/settings" element={<Settings />} />

        {/* Route for the main dashboard page */}
        <Route path="/" element={<Dashboard />} />

        {/* Route to select an exercise */}
        <Route path="/select-exercise" element={<SelectExercise />} />

        {/* Route to show step count statistics */}
        <Route path="/step-count" element={<ShowSteps />} />

        {/* Route to show water intake statistics */}
        <Route path="/water-intake" element={<ShowWaterIntake />} />

        {/* Route to show goals statistics */}
        <Route path="/goals" element={<ShowGoals />} />

        {/* You can add more routes here as your app grows */}
      </Routes>
    </>
  );
}

// Export the App component as default so it can be used in index.js or other entry points
export default App;

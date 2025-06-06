
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/Signin";
import Settings from "./pages/Settings";
import SignUp from "./pages/Signup";
import DashboardNavbar from "./examples/Navbars/DashboardNavbar";  // update import path if needed
import SelectExercise from "./examples/Cards/StatisticsCards/MiniStatisticsCard/SelectExercise";
import ShowSteps from "./examples/Cards/StatisticsCards/MiniStatisticsCard/ShowSteps";
import ShowWaterIntake from "./examples/Cards/StatisticsCards/MiniStatisticsCard/ShowWaterIntake";
import ShowGoals from "./examples/Cards/StatisticsCards/MiniStatisticsCard/ShowGoals";

//./examples/Navbars/DashboardNavbar/index.js
function App() {
  return (
    <>
    <DashboardNavbar />
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/select-exercise" element={<SelectExercise />} />
      <Route path="/step-count" element={<ShowSteps />} />
      <Route path="/water-intake" element={<ShowWaterIntake />} />
      <Route path="/goals" element={<ShowGoals />} />
      {/* Other routes */}
    </Routes>
    </>
    
  );
}

export default App;




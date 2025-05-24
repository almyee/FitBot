// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// index.js or App.js
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';

// import theme from './assets/theme'; // the copied theme index.js
// import App from './App';

// ReactDOM.render(
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <App />
//   </ThemeProvider>,
//   document.getElementById('root')
// );

// App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/Signin";
import Settings from "./pages/Settings";
import SignUp from "./pages/Signup";
import DashboardNavbar from "./examples/Navbars/DashboardNavbar";  // update import path if needed
import SelectExercise from "./examples/Cards/StatisticsCards/MiniStatisticsCard/SelectExercise";

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
      {/* Other routes */}
    </Routes>
    </>
    
  );
}

export default App;




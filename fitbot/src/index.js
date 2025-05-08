// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import './index.css'; // Ensure styles are included

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );

// import React from "react";
// import ReactDOM from "react-dom";
// import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";

// import App from "./App";
// import theme from "./assets/theme";
// import { SoftUIControllerProvider } from "./context";

// ReactDOM.render(
//   <SoftUIControllerProvider>
//     <BrowserRouter>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <App />
//       </ThemeProvider>
//     </BrowserRouter>
//   </SoftUIControllerProvider>,
//   document.getElementById("root")
// );
import React from "react";
import ReactDOM from "react-dom/client";  // ✅ update import
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import theme from "./assets/theme";
import { SoftUIControllerProvider } from "./context";

const root = ReactDOM.createRoot(document.getElementById("root"));  // ✅ createRoot
root.render(
  <SoftUIControllerProvider>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </SoftUIControllerProvider>
);


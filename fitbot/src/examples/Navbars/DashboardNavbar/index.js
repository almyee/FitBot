/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// import { useState, useEffect } from "react";

// // react-router components
// import { useLocation, Link } from "react-router-dom";

// // prop-types is a library for typechecking of props.
// import PropTypes from "prop-types";

// // @material-ui core components
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import Icon from "@mui/material/Icon";

// // Soft UI Dashboard React components
// import SoftBox from "../../../components/SoftBox";
// import SoftTypography from "../../../components/SoftTypography";
// import SoftInput from "../../../components/SoftInput";

// // Soft UI Dashboard React examples
// import Breadcrumbs from "../../Breadcrumbs";
// import NotificationItem from "../../Items/NotificationItem";

// // Custom styles for DashboardNavbar
// import {
//   navbar,
//   navbarContainer,
//   navbarRow,
//   navbarIconButton,
//   navbarMobileMenu,
// } from "../../../examples/Navbars/DashboardNavbar/styles";

// // Soft UI Dashboard React context
// import {
//   useSoftUIController,
//   setTransparentNavbar,
//   setMiniSidenav,
//   setOpenConfigurator,
// } from "../../../context";

// // Images
// // import team2 from "../../../assets/images/team-2.jpg";
// // import logoSpotify from "../../../assets/images/small-logos/logo-spotify.svg";
// import AdbIcon from '@mui/icons-material/Adb';
// import SettingsIcon from '@mui/icons-material/Settings';
// function DashboardNavbar({ absolute, light, isMini }) {
//   const [navbarType, setNavbarType] = useState();
//   const [controller, dispatch] = useSoftUIController();
//   const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
//   const [openMenu, setOpenMenu] = useState(false);
//   const route = useLocation().pathname.split("/").slice(1);

//   useEffect(() => {
//     // Setting the navbar type
//     if (fixedNavbar) {
//       setNavbarType("sticky");
//     } else {
//       setNavbarType("static");
//     }

//     // A function that sets the transparent state of the navbar.
//     function handleTransparentNavbar() {
//       setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
//     }

//     window.addEventListener("scroll", handleTransparentNavbar);
//     handleTransparentNavbar();
//     return () => window.removeEventListener("scroll", handleTransparentNavbar);
//   }, [dispatch, fixedNavbar]);

//   const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
//   const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
//   const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
//   const handleCloseMenu = () => setOpenMenu(false);

//   // Render the notifications menu
//   const renderMenu = () => (
//     <Menu
//       anchorEl={openMenu}
//       anchorReference={null}
//       anchorOrigin={{
//         vertical: "bottom",
//         horizontal: "left",
//       }}
//       open={Boolean(openMenu)}
//       onClose={handleCloseMenu}
//       sx={{ mt: 2 }}
//     >
//       <NotificationItem
//         image={<AdbIcon />}
//         title={["New message", "from Bot"]}
//         date="1 minutes ago"
//         onClick={handleCloseMenu}
//       />
//     </Menu>
//   );

//   return (
//     <AppBar
//       position={absolute ? "absolute" : navbarType}
//       color="inherit"
//       sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
//     >
//       <Toolbar sx={(theme) => navbarContainer(theme)}>
//       <Link to="/" style={{ textDecoration: "none" }}>
//         <SoftTypography variant="h6" fontWeight="bold" color="primary">
//           FitBot
//         </SoftTypography>
//       </Link>

      
    
//         {isMini ? null : (
//           <SoftBox
//             sx={(theme) => ({
//               ...navbarRow(theme, { isMini }),
//               flexWrap: "nowrap",           // Prevent wrapping
//               alignItems: "center",         // Vertical alignment
//               gap: theme.spacing(2),        // More spacing between items
//             })}
//           >
//             <SoftBox color={light ? "white" : "inherit"} sx={{ display: "flex", gap: 2 }}>
//               <Link to="/sign-in">
//                 <IconButton sx={{ ...navbarIconButton, display: "flex", alignItems: "center", gap: 0.5 }} size="small">
//                   <SoftTypography variant="button" fontWeight="medium">
//                     Sign In/Out
//                   </SoftTypography>
//                 </IconButton>
//               </Link>
//               <Link to="/settings">
//                 <IconButton
//                   size="small"
//                   color="inherit"
//                   sx={navbarIconButton}
//                   // onClick={handleConfiguratorOpen}
//                 >
//                   <SettingsIcon />
//                 </IconButton>
//               </Link>
//               <IconButton
//                 size="small"
//                 color="inherit"
//                 sx={navbarIconButton}
//                 aria-controls="notification-menu"
//                 aria-haspopup="true"
//                 variant="contained"
//                 onClick={handleOpenMenu}
//               >
//                 <AdbIcon />
//               </IconButton>
//               {renderMenu()}
//             </SoftBox>
//           </SoftBox>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// }

// // Setting default values for the props of DashboardNavbar
// DashboardNavbar.defaultProps = {
//   absolute: false,
//   light: false,
//   isMini: false,
// };

// // Typechecking props for the DashboardNavbar
// DashboardNavbar.propTypes = {
//   absolute: PropTypes.bool,
//   light: PropTypes.bool,
//   isMini: PropTypes.bool,
// };

// export default DashboardNavbar;

import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";  // ✅ added useNavigate
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import SoftInput from "../../../components/SoftInput";
import Breadcrumbs from "../../Breadcrumbs";
import NotificationItem from "../../Items/NotificationItem";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "../../../examples/Navbars/DashboardNavbar/styles";
import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "../../../context";
import AdbIcon from '@mui/icons-material/Adb';
import SettingsIcon from '@mui/icons-material/Settings';

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // ✅ state to track login status
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();  // ✅ hook for navigation

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    setIsLoggedIn(!!currentUser);  // ✅ check login status on mount
  }, [route]); // ✅ update login status when route changes

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // const handleSignInOut = () => {
  //   const currentUser = localStorage.getItem("currentUser");
  //   if (currentUser) {
  //     localStorage.removeItem("currentUser");  // ✅ log out
  //     setIsLoggedIn(false);
  //     alert("You have been logged out.");
  //     navigate("/sign-in");
  //   } else {
  //     navigate("/sign-in");  // ✅ if not logged in, go to sign-in page
  //   }
  // };
  const handleSignInOut = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      // Comment or remove this line to keep localStorage intact
      // localStorage.removeItem("currentUser");  // No longer removing currentUser
  
      setIsLoggedIn(false);  // Mark as logged out in the UI
      alert("You have been logged out.");
      navigate("/sign-in");  // Redirect to the sign-in page
    } else {
      navigate("/sign-in");  // If not logged in, just go to the sign-in page
    }
  };
  
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        image={<AdbIcon />}
        title={["New message", "from Bot"]}
        date="1 minutes ago"
        onClick={handleCloseMenu}
      />
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <SoftTypography variant="h6" fontWeight="bold" color="primary">
            FitBot
          </SoftTypography>
        </Link>

        {isMini ? null : (
          <SoftBox
            sx={(theme) => ({
              ...navbarRow(theme, { isMini }),
              flexWrap: "nowrap",
              alignItems: "center",
              gap: theme.spacing(2),
            })}
          >
            <SoftBox color={light ? "white" : "inherit"} sx={{ display: "flex", gap: 2 }}>
              <IconButton
                sx={{ ...navbarIconButton, display: "flex", alignItems: "center", gap: 0.5 }}
                size="small"
                onClick={handleSignInOut}  // ✅ use function instead of <Link>
              >
                <SoftTypography variant="button" fontWeight="medium">
                  {isLoggedIn ? "Sign Out" : "Sign In"}  {/* ✅ dynamic label */}
                </SoftTypography>
              </IconButton>

              <Link to="/settings">
                <IconButton
                  size="small"
                  color="inherit"
                  sx={navbarIconButton}
                >
                  <SettingsIcon />
                </IconButton>
              </Link>

              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <AdbIcon />
              </IconButton>

              {renderMenu()}
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;

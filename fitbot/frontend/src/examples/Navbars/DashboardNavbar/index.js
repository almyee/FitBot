import { useState, useEffect } from "react";
// React Router hooks for location, navigation, and links
import { useLocation, Link, useNavigate } from "react-router-dom";  
import PropTypes from "prop-types"; // Prop type validation

// MUI components for layout and UI controls
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Custom UI components from your project
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import SoftInput from "../../../components/SoftInput";
import Breadcrumbs from "../../Breadcrumbs";
import NotificationItem from "../../Items/NotificationItem";

// Styles for the navbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "./styles";

// Context API state management hooks and action creators
import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "../../../context";

// Icons from MUI icons library
import AdbIcon from '@mui/icons-material/Adb';
import SettingsIcon from '@mui/icons-material/Settings';

function DashboardNavbar({ absolute, light, isMini }) {
  // State to control navbar positioning style ("sticky" or "static")
  const [navbarType, setNavbarType] = useState();

  // Get the UI controller state and dispatcher from context
  const [controller, dispatch] = useSoftUIController();
  // Destructure relevant state from controller
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;

  // State to control whether notification menu is open (and its anchor element)
  const [openMenu, setOpenMenu] = useState(false);

  // State to track if user is logged in (based on localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get the current route path, split by "/" and remove the first empty string
  const route = useLocation().pathname.split("/").slice(1);

  // Hook to programmatically navigate to other routes
  const navigate = useNavigate();

  // Effect to set the navbar type on mount or when fixedNavbar changes,
  // and to add/remove a scroll listener for transparent navbar logic
  useEffect(() => {
    // Set navbar type based on whether fixedNavbar is true
    if (fixedNavbar) {
      setNavbarType("sticky");  // navbar sticks to top on scroll
    } else {
      setNavbarType("static");  // navbar scrolls with page
    }

    // Function to update transparentNavbar state based on scroll position
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleTransparentNavbar);
    // Run once initially
    handleTransparentNavbar();

    // Cleanup: remove event listener on unmount
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  // Effect to check if user is logged in whenever route changes
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    setIsLoggedIn(!!currentUser);  // Set logged-in state to true if currentUser exists
  }, [route]);

  // Toggle mini sidenav visibility using context dispatch
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  // Toggle configurator panel visibility
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Open notification menu by setting the anchor element (from click event)
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);

  // Close the notification menu
  const handleCloseMenu = () => setOpenMenu(false);

  // Handle Sign In or Sign Out button click
  const handleSignInOut = () => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      // User is logged in, so log out
      // Commented out removing from localStorage to keep user info intact
      // localStorage.removeItem("currentUser");

      setIsLoggedIn(false);  // Update state to reflect logged out status
      alert("You have been logged out.");
      navigate("/sign-in");  // Redirect to sign-in page
    } else {
      // If not logged in, just navigate to sign-in page
      navigate("/sign-in");
    }
  };

  // Render the notification menu component
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}           // Anchor element for positioning menu
      anchorReference={null}        // Custom anchor reference (null disables default)
      anchorOrigin={{               // Where the menu anchors relative to the anchor element
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}      // Open state of menu
      onClose={handleCloseMenu}     // Close handler
      sx={{ mt: 2 }}                // Styling margin top: 2
    >
      {/* Single notification item with icon, title, date and close handler */}
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
      position={absolute ? "absolute" : navbarType}  // Position prop from prop or state
      color="inherit"
      sx={{
        backgroundColor: "#EBEFF5", // Light gray background color
        boxShadow: "none",          // Remove default shadow for flat look
      }}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        {/* Logo linking to home page */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <SoftTypography variant="h2" fontWeight="bold" color="primary">
            FitBot
          </SoftTypography>
        </Link>

        {/* If not mini navbar, render the buttons and icons */}
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
              {/* Sign In / Sign Out button */}
              <IconButton
                sx={{ ...navbarIconButton, display: "flex", alignItems: "center", gap: 0.5 }}
                size="small"
                onClick={handleSignInOut}  // Use click handler instead of Link for logic
              >
                <SoftTypography variant="h5" fontWeight="medium">
                  {isLoggedIn ? "Sign Out" : "Sign In"}  {/* Show label based on login state */}
                </SoftTypography>
              </IconButton>

              {/* Settings button linking to /settings */}
              <Link to="/settings">
                <IconButton
                  size="large"
                  color="inherit"
                  sx={navbarIconButton}
                >
                  <SettingsIcon />
                </IconButton>
              </Link>

              {/* Notification bell icon */}
              <IconButton
                size="large"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <AdbIcon />
              </IconButton>

              {/* Render the notification menu */}
              {renderMenu()}
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Default props in case they are not passed
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Prop type validations for the component
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;


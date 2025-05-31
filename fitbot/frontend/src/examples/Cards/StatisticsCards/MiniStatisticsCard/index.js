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

// prop-types is a library for typechecking of props
// import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";

//function MiniStatisticsCard({ bgColor, title, count, percentage, icon, direction }) {
function  MiniStatisticsCard({ bgColor, icon, title, direction, navigateTo, logActivity }){
  const navigate = useNavigate();

  // Default icon color if not provided
  const iconColor = icon?.color || "primary"; // default color if icon color is undefined
  const iconComponent = icon?.component ||  <Icon>help</Icon>; // default empty string if icon component is undefined
 
  //Navigates to a different page where user can log exercise activity, OR
  //Runs a custom function that shows a form in SelectExercise that shows form for user to log exercise health data
  const handleClick = () => {
  if (logActivity) {
    logActivity(); // Use custom click behavior (e.g., show form)
  } else if (navigateTo) {
    navigate(navigateTo); // Fallback to navigation if no onClick given
  }
};

  return (
    <Card onClick={handleClick} style={{ cursor: "pointer" }}>
      <SoftBox bgColor={bgColor} variant="gradient">
      {direction === "bottom" ? (
        <SoftBox
          p={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="6rem"
          height= "6rem"
        >
          <SoftTypography
            variant="button"
            color={bgColor === "black" ? "text" : "black"}
            opacity={bgColor === "white" ? 1 : 0.7}
            textTransform="capitalize"
            fontWeight={title.fontWeight}
            align="center"
          >
            {title.text}
          </SoftTypography>

          <SoftBox
            variant="gradient"
            bgColor={bgColor === "white" ? iconColor : "white"}
            color={bgColor === "white" ? "white" : "dark"}
            width="3rem"
            height="3rem"
            borderRadius="md"
            display="flex"
            justifyContent="center"
            alignItems="center"
            shadow="md"
          >
            {iconComponent}
          </SoftBox>
        </SoftBox>
      ): null}
      </SoftBox>
    </Card>
  );
}

MiniStatisticsCard.defaultProps = {
  bgColor: "white",
  title: {
    fontWeight: "medium",
    text: "",
  },
  percentage: {
    color: "success",
    text: "",
  },
  direction: "right",
  icon: {
    color: "primary", // default color
    component:  <Icon>help</Icon>, // default icon (can be adjusted as necessary)
  },
  logActivity: null,
  navigateTo: null,
};

MiniStatisticsCard.propTypes = {
  logActivity: PropTypes.func,
  navigateTo: PropTypes.string,
  bgColor: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  //title: PropTypes.shape({
    //fontWeight: PropTypes.oneOf(["light", "regular", "medium", "bold"]),
    //text: PropTypes.string,
  //}),
  //count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), //.isRequired
  // percentage: PropTypes.shape({
  //   color: PropTypes.oneOf([
  //     "primary",
  //     "secondary",
  //     "info",
  //     "success",
  //     "warning",
  //     "error",
  //     "dark",
  //     "white",
  //   ]),
  //   text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // }),
  icon: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
    ]),
    component: PropTypes.node, //.isRequired
  }).isRequired,
  direction: PropTypes.oneOf(["right", "left"]),
};

export default MiniStatisticsCard;


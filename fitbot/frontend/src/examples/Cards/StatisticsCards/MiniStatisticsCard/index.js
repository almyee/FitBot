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

// // @mui material components
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// import Icon from "@mui/material/Icon";

// // Soft UI Dashboard React components
// import SoftBox from "../../../../components/SoftBox";
// import SoftTypography from "../../../../components/SoftTypography";

// function MiniStatisticsCard({ bgColor, title, count, percentage, icon, direction }) {
//   return (
//     <Card>
//       <SoftBox bgColor={bgColor} variant="gradient">
//         <SoftBox p={2}>
//           <Grid container alignItems="center">
//             {direction === "left" ? (
//               <Grid item>
//                 <SoftBox
//                   variant="gradient"
//                   bgColor={bgColor === "white" ? icon.color : "white"}
//                   color={bgColor === "white" ? "white" : "dark"}
//                   width="3rem"
//                   height="3rem"
//                   borderRadius="md"
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                   shadow="md"
//                 >
//                   <Icon fontSize="small" color="inherit">
//                     {icon.component}
//                   </Icon>
//                 </SoftBox>
//               </Grid>
//             ) : null}
//             <Grid item xs={8}>
//               <SoftBox ml={direction === "left" ? 2 : 0} lineHeight={1}>
//                 <SoftTypography
//                   variant="button"
//                   color={bgColor === "white" ? "text" : "white"}
//                   opacity={bgColor === "white" ? 1 : 0.7}
//                   textTransform="capitalize"
//                   fontWeight={title.fontWeight}
//                 >
//                   {title.text}
//                 </SoftTypography>
//                 <SoftTypography
//                   variant="h5"
//                   fontWeight="bold"
//                   color={bgColor === "white" ? "dark" : "white"}
//                 >
//                   {count}{" "}
//                   <SoftTypography variant="button" color={percentage.color} fontWeight="bold">
//                     {percentage.text}
//                   </SoftTypography>
//                 </SoftTypography>
//               </SoftBox>
//             </Grid>
//             {direction === "right" ? (
//               <Grid item xs={4}>
//                 <SoftBox
//                   variant="gradient"
//                   bgColor={bgColor === "white" ? icon.color : "white"}
//                   color={bgColor === "white" ? "white" : "dark"}
//                   width="3rem"
//                   height="3rem"
//                   marginLeft="auto"
//                   borderRadius="md"
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                   shadow="md"
//                 >
//                   <Icon fontSize="small" color="inherit">
//                     {icon.component}
//                   </Icon>
//                 </SoftBox>
//               </Grid>
//             ) : null}
//           </Grid>
//         </SoftBox>
//       </SoftBox>
//     </Card>
//   );
// }

// // Setting default values for the props of MiniStatisticsCard
// MiniStatisticsCard.defaultProps = {
//   bgColor: "white",
//   title: {
//     fontWeight: "medium",
//     text: "",
//   },
//   percentage: {
//     color: "success",
//     text: "",
//   },
//   direction: "right",
// };

// // Typechecking props for the MiniStatisticsCard
// MiniStatisticsCard.propTypes = {
//   bgColor: PropTypes.oneOf([
//     "white",
//     "primary",
//     "secondary",
//     "info",
//     "success",
//     "warning",
//     "error",
//     "dark",
//   ]),
//   title: PropTypes.PropTypes.shape({
//     fontWeight: PropTypes.oneOf(["light", "regular", "medium", "bold"]),
//     text: PropTypes.string,
//   }),
//   count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//   percentage: PropTypes.shape({
//     color: PropTypes.oneOf([
//       "primary",
//       "secondary",
//       "info",
//       "success",
//       "warning",
//       "error",
//       "dark",
//       "white",
//     ]),
//     text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   }),
//   icon: PropTypes.shape({
//     color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
//     component: PropTypes.node.isRequired,
//   }).isRequired,
//   direction: PropTypes.oneOf(["right", "left"]),
// };

// export default MiniStatisticsCard;
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";

//function MiniStatisticsCard({ bgColor, title, count, percentage, icon, direction }) {
function MiniStatisticsCard({ bgColor, icon, title, percentage, direction }) {
  const navigate = useNavigate();

  // Default icon color if not provided
  const iconColor = icon?.color || "primary"; // default color if icon color is undefined
  const iconComponent = icon?.component ||  <Icon>help</Icon>; // default empty string if icon component is undefined

  //Navigates to a different page where user can log exercise activity
  const handleClick = () => {
    navigate("/select-exercise"); // this should match your route
  };

  const isLeft = direction === "left";
  const isRight = direction === "right";

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
            mb={1}
          >
            {iconComponent}
          </SoftBox>
        </SoftBox>
      ) : (
        <SoftBox p={2}>
          <Grid container alignItems="center">
            {isLeft && (
              <Grid item>
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
              </Grid>
            )}

            <Grid item xs={isRight ? 8 : true}>
              <SoftBox ml={isLeft ? 2 : 0} lineHeight={1}>
                 <SoftTypography
                  variant="button"
                  color={bgColor === "black" ? "text" : "black"}
                  opacity={bgColor === "white" ? 1 : 0.7}
                  textTransform="capitalize"
                  fontWeight={title.fontWeight}
                >
                  {title.text}
                </SoftTypography> 

                <SoftTypography
                  variant="h5"
                  fontWeight="bold"
                  color={bgColor === "black" ? "dark" : "black"}
                >
                  {/* {count}{" "}*/}
                  <SoftTypography
                    variant="button"
                    color={percentage?.color || "success"}
                    fontWeight="bold"
                  >
                  {percentage?.text || ""}
                  </SoftTypography> 
                </SoftTypography>
              </SoftBox>
            </Grid>
            {isRight && (
              <Grid item xs={4}>
                <SoftBox
                  variant="gradient"
                  bgColor={bgColor === "white" ? iconColor : "white"}
                  color={bgColor === "white" ? "white" : "dark"}
                  width="3rem"
                  height="3rem"
                  marginLeft="auto"
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  shadow="md"
                >
                {iconComponent}
                </SoftBox>
              </Grid>
            )}
          </Grid>
        </SoftBox>
        )}
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
};

MiniStatisticsCard.propTypes = {
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


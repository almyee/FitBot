import React from "react";
import SoftBox from "../components/SoftBox";
import SoftTypography from "../components/SoftTypography";

function Settings() {
  return (
    <SoftBox p={3}>
      <SoftTypography variant="h3" fontWeight="bold">
        Settings Page
      </SoftTypography>
      <SoftTypography variant="body1">
        This is where your settings content will go.
      </SoftTypography>
    </SoftBox>
  );
}

export default Settings;

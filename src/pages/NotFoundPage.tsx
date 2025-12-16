import React from "react";
import { Grid } from "@mui/material";
import DashboardNavbar from "../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../examples/LayoutContainers/DashboardLayout/index";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { IntlProvider, useIntl } from "react-intl";
import "./styles.scss";

const NotFoundPage: React.FC = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container justifyContent="center" alignItems="center" sx={{ height: "350px", mt: 3 }}>
        <Grid item xs={12} lg={12} style={{ textAlign: "center", paddingBottom: "450px" }}>
          <h1>Error 404</h1>
          <BrokenImageIcon style={{ fontSize: "250px" }} fontSize={"large"} />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default NotFoundPage;

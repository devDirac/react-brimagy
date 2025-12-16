/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { ReactNode } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS examples components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Material Dashboard 2 PRO React page layout routes
import pageRoutes from "page.routes";

// Material Dashboard 2 PRO React context
import { useMaterialUIController } from "context";
import colors from "./../../../../assets/theme-dark/base/colors";

// Declaring props types for IllustrationLayout
interface Props {
  header?: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  illustration?: string;
}

function IllustrationLayout({
  header,
  title,
  description,
  illustration,
  children,
}: Props): JSX.Element {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <PageLayout background="white">
      <MDBox
        sx={{
          width: "100%",
          minHeight: "100vh",
          backgroundImage: `url(${illustration})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Overlay oscuro opcional
          },
        }}
      >
        <MDBox
          sx={{
            position: "relative",
            zIndex: 1,
            width: { xs: "90%", sm: "400px", md: "450px" },
            maxWidth: "500px",
          }}
        >
          <MDBox
            sx={{
              backgroundColor: ({ palette: { background, white } }) =>
                darkMode ? "rgba(18, 18, 18, 0.2)" : "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)", // Para Safari
              borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
              boxShadow: 3,
              p: 4,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <MDBox mb={3} textAlign="center">
              {!header ? (
                <>
                  <MDBox mb={1}>
                    <MDTypography variant="h4" fontWeight="bold" color="white">
                      {title}
                    </MDTypography>
                  </MDBox>
                  <MDTypography variant="body2" color="white">
                    {description}
                  </MDTypography>
                </>
              ) : (
                header
              )}
            </MDBox>
            <MDBox>{children}</MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </PageLayout>
  );
}

// Declaring default props for IllustrationLayout
IllustrationLayout.defaultProps = {
  header: "",
  title: "",
  description: "",
  illustration: "",
};

export default IllustrationLayout;

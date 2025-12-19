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

import { useState, useEffect, ReactNode } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import type { HeaderProps } from "./types";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 PRO React TS Base Styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import logoPerfil from "assets/images/profile_icon.png";
import backgroundImage from "assets/images/fondo2-brimagy.jpg";
import logo from "assets/images/profile_icon.png";
import { Avatar } from "@mui/material";

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const [tabsOrientation, setTabsOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event: any, newValue: any) => setTabValue(newValue);
  const usuarioPermiso = () => {
    const tipo = props?.tipoUsuario;
    switch (tipo) {
      case 1:
        return "Internauta";
      case 2:
        return "Auditor";
      case 3:
        return "Compras";
      case 4:
        return "Inventario";
      case 5:
        return "Administración";
      case 6:
        return "Super Usuario";
      default:
        return "Usuario";
    }
  };

  return (
    <MDBox position="relative" mb={0}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="7rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              className="AvatarUser"
              alt={props?.nombreUsuario || ""}
              src={props?.fotoPerfil || logoPerfil}
            />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {props?.nombreUsuario}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {usuarioPermiso()}
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </Card>
    </MDBox>
  );
};

export default Header;

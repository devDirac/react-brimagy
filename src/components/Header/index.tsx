import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Avatar } from "@mui/material";

import type { HeaderProps } from "./types";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS Base Styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import logoPerfil from "assets/images/profile_icon.png";
import backgroundImage from "assets/images/fondo2-brimagy.jpg";
import { ContadorCanjes } from "modules/resumenCanjes";

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const [tabsOrientation, setTabsOrientation] = useState<"horizontal" | "vertical">("horizontal");

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }
    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const usuarioPermiso = () => {
    switch (props?.tipoUsuario) {
      case 1:
        return "Empleado Mabe";
      case 2:
        return "Institucional";
      case 3:
        return "Operario";
      case 4:
        return "Oso Polar";
      case 5:
        return "León Marino";
      case 6:
        return "Pingüino";
      case 7:
        return "Super Admin";
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
      <Card sx={{ position: "relative", mt: -8, mx: 3, py: 2, px: 2 }}>
        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Grid container spacing={2} alignItems="center">
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
          </Grid>

          <Grid item xs={12} md="auto">
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems={{ xs: "flex-start", md: "flex-end" }}
            >
              <ContadorCanjes onCanjeValidado={props?.onCanjeValidado} />
            </MDBox>
          </Grid>
        </Grid>
      </Card>
    </MDBox>
  );
};

export default Header;
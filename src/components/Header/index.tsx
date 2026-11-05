import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Avatar, Chip } from "@mui/material";

import type { HeaderProps } from "./types";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS Base Styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import logoPerfil from "assets/images/profile_icon.png";
import backgroundImage from "assets/images/fondo2-brimagy.jpg";
import { useSelector } from "react-redux";
import { StoreType } from "types/genericTypes";
import {
  IconListNumbers,
  IconHelpCircle,
  IconHourglassHigh,
  IconShieldCheck,
} from "@tabler/icons-react";

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const [tabsOrientation, setTabsOrientation] = useState<"horizontal" | "vertical">("horizontal");

  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");
  const resumenCanjes = useSelector((state: StoreType) => state?.app?.resumenCanjes || null);

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

  const iconProps = { size: 16, stroke: 2 };
  const contadores = resumenCanjes
    ? [
      { label: "Totales", valor: resumenCanjes.total, bg: "#084d6e", icon: <IconListNumbers {...iconProps} /> },
      { label: "Sin validar", valor: resumenCanjes.sin_validar, bg: "#9e9e9e", icon: <IconHelpCircle {...iconProps} /> },
      { label: "En proceso", valor: resumenCanjes.en_proceso, bg: "#f5a623", icon: <IconHourglassHigh {...iconProps} /> },
      { label: "Validados", valor: resumenCanjes.validados, bg: "#3ec972", icon: <IconShieldCheck {...iconProps} /> },
    ]
    : [];

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
              <MDTypography variant="h6" color="text" fontWeight="regular">
                Estás viendo:{" "}
                <strong style={{ color: "#a5eb2f", fontWeight: 600 }}>
                  {plataforma === "club_bohn" ? "Club Bohn" : "Puntotes"}
                </strong>
              </MDTypography>

              {contadores.length > 0 && (
                <MDBox display="flex" gap={1} flexWrap="wrap" mt={1}>
                  <MDTypography variant="h6" color="text" fontWeight="regular">
                    Canjes
                  </MDTypography>
                  {contadores.map((c) => (
                    <Chip
                      key={c.label}
                      icon={c.icon}
                      label={`${c.label}: ${c.valor}`}
                      size="small"
                      sx={{
                        background: c.bg,
                        fontWeight: 600,
                        "& .MuiChip-label, & .MuiChip-icon": { color: "#fff !important" },
                      }}
                    />
                  ))}
                </MDBox>
              )}
            </MDBox>
          </Grid>
        </Grid>
      </Card>
    </MDBox>
  );
};

export default Header;
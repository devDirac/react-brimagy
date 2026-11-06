import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Avatar, Box, Chip, Skeleton, Typography } from "@mui/material";

import type { HeaderProps } from "./types";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS Base Styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import logoPerfil from "assets/images/profile_icon.png";
import backgroundImage from "assets/images/fondo2-brimagy.jpg";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "types/genericTypes";
import {
  IconListNumbers,
  IconHelpCircle,
  IconHourglassHigh,
  IconShieldCheck,
} from "@tabler/icons-react";
import { actualizarResumenCanjes } from "actions/canjes";

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const [tabsOrientation, setTabsOrientation] = useState<"horizontal" | "vertical">("horizontal");

  const dispatch = useDispatch();
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

  useEffect(() => {
    actualizarResumenCanjes(dispatch, plataforma);
  }, [dispatch, plataforma]);

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

  const cargandoResumen = resumenCanjes === null;
  const iconProps = { size: 16, stroke: 2 };
  const contadores = [
    { label: "Totales", valor: resumenCanjes?.total ?? "—", bg: "#084d6e", bgHover: "#043952", icon: <IconListNumbers {...iconProps} /> },
    { label: "Sin validar", valor: resumenCanjes?.sin_validar ?? "—", bg: "#9e9e9e", bgHover: "#8a8888", icon: <IconHelpCircle {...iconProps} /> },
    { label: "En proceso", valor: resumenCanjes?.en_proceso ?? "—", bg: "#f5a623", bgHover: "#db9116", icon: <IconHourglassHigh {...iconProps} /> },
    { label: "Validados", valor: resumenCanjes?.validados ?? "—", bg: "#3ec972", bgHover: "#2fad5e", icon: <IconShieldCheck {...iconProps} /> },
  ];

  const TAMANO_ICONO = 22;

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
              <MDBox
                display="flex"
                gap={0.5}
                flexWrap="wrap"
                mt={1}
                sx={{
                  border: "1px solid #a5eb2f",
                  borderRadius: "0 0 10px 10px",
                  p: 1,
                  position: "relative"
                }}
              >
                <MDTypography
                  variant="caption"
                  style={{
                    position: "absolute",
                    left: -1,
                    top: -20,
                    background: "#a5eb2f",
                    color: "#000",
                    fontSize: 12,
                    padding: "2px 10px",
                    fontWeight: 600,
                  }}
                >
                  Canjes
                </MDTypography>
                <MDTypography
                  variant="caption"
                  style={{
                    position: "absolute",
                    right: -1,
                    top: -20,
                    background: "#a5eb2f",
                    color: "#000",
                    fontSize: 12,
                    padding: "2px 10px",
                    fontWeight: 600,
                  }}
                >
                  {plataforma === "club_bohn" ? "Club Bohn" : "Puntotes"}
                </MDTypography>
                {contadores.map((c) => (
                  <Box
                    key={c.label}
                    sx={{
                      background: c.bg,
                      color: "#fff",
                      fontWeight: 600,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      px: 1.5,
                      py: 1,
                      cursor: "pointer",
                      "&:hover": {
                        background: c.bgHover,
                      }
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          lineHeight: 0,
                          "& svg, & .material-icons, & .MuiIcon-root": {
                            fontSize: TAMANO_ICONO,
                            width: TAMANO_ICONO,
                            height: TAMANO_ICONO,
                          },
                        }}
                      >
                        {c.icon}
                      </Box>

                      <Box sx={{ minWidth: 28, textAlign: "right" }}>
                        {cargandoResumen ? (
                          <Skeleton
                            variant="text"
                            width={28}
                            sx={{ bgcolor: "rgba(255,255,255,0.35)", ml: "auto" }}
                          />
                        ) : (
                          <Typography variant="h6" fontWeight="medium" color="inherit" sx={{ lineHeight: 1 }}>
                            {c.valor ?? 0}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="caption" fontWeight="medium" color="inherit">
                      {c.label}
                    </Typography>
                  </Box>
                ))}
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </Card>
    </MDBox>
  );
};

export default Header;
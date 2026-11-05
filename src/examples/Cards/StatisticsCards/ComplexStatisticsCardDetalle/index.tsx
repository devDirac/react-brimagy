import { ReactNode } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// ── Barras estilizadas ────────────────────────────────────────────────────────

const BarraFisicos = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 5,
  backgroundColor: "rgba(26, 144, 255, 0.25) !important",
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    backgroundColor: "#1a90ff !important",
  },
}));

const BarraDigitales = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 5,
  backgroundColor: "rgba(255, 152, 0, 0.25) !important",
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    backgroundColor: "#ff9800 !important",
  },
}));

// ── Interfaces ────────────────────────────────────────────────────────────────

interface TipoDetalle {
  label?: string;
  total_canjes?: number;
  total_puntos?: number;
  porcentaje?: number;
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "white";
}

interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  title?: string;
  count?: string | number;
  icon?: ReactNode;
  fisicos?: TipoDetalle;
  digitales?: TipoDetalle;
}

// ── Componente ────────────────────────────────────────────────────────────────

function ComplexStatisticsCardDetalle({
  color,
  title,
  count,
  icon,
  fisicos,
  digitales,
}: Props): JSX.Element {
  console.log("fisicos.porcentaje:", fisicos?.porcentaje, typeof fisicos?.porcentaje);
  console.log("digitales.porcentaje:", digitales?.porcentaje, typeof digitales?.porcentaje);
  return (
    <Card sx={{ overflow: "hidden" }}>
      <MDBox
        sx={{
          width: "100%",
          bgcolor: "grey.400",
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MDTypography variant="button" fontWeight="bold" color="dark" sx={{ letterSpacing: 1 }}>
          {title}
        </MDTypography>
      </MDBox>

      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2} pb={1}>
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="3.5rem"
          height="3.5rem"
        >
          <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon>
        </MDBox>
        <MDBox textAlign="right">
          <MDTypography variant="h4">{count}</MDTypography>
          <MDTypography variant="caption" color="text">
            puntos totales
          </MDTypography>
        </MDBox>
      </MDBox>

      <Divider sx={{ my: 0.5 }} />

      {/* ── Barras ── */}
      <MDBox pb={2} px={2}>
        {fisicos && (
          <MDBox mb={1.5}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <MDTypography variant="caption" color="text" display="flex" alignItems="center">
                <MDBox
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#1a90ff",
                    display: "inline-block",
                    mr: 0.5,
                  }}
                />
                Físicos
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={0.5}>
                <MDTypography variant="caption" fontWeight="bold" color="info">
                  {fisicos.porcentaje ?? 0}%
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  ({fisicos.total_canjes ?? 0} canjes)
                </MDTypography>
              </MDBox>
            </MDBox>

            {/* barra con div nativo */}
            <div
              style={{
                width: "100%",
                height: 8,
                borderRadius: 5,
                backgroundColor: "rgba(26, 144, 255, 0.25)",
              }}
            >
              <div
                style={{
                  width: `${fisicos.porcentaje ?? 0}%`,
                  height: "100%",
                  borderRadius: 5,
                  backgroundColor: "#1a90ff",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </MDBox>
        )}

        {digitales && (
          <MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <MDTypography variant="caption" color="text" display="flex" alignItems="center">
                <MDBox
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#ff9800",
                    display: "inline-block",
                    mr: 0.5,
                  }}
                />
                Digitales
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={0.5}>
                <MDTypography variant="caption" fontWeight="bold" color="warning">
                  {digitales.porcentaje ?? 0}%
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  ({digitales.total_canjes ?? 0} canjes)
                </MDTypography>
              </MDBox>
            </MDBox>

            {/* barra con div nativo */}
            <div
              style={{
                width: "100%",
                height: 8,
                borderRadius: 5,
                backgroundColor: "rgba(255, 152, 0, 0.25)",
              }}
            >
              <div
                style={{
                  width: `${digitales.porcentaje ?? 0}%`,
                  height: "100%",
                  borderRadius: 5,
                  backgroundColor: "#ff9800",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

ComplexStatisticsCardDetalle.defaultProps = {
  color: "info",
};

export default ComplexStatisticsCardDetalle;

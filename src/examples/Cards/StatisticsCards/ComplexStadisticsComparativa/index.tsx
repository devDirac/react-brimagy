import { ReactNode } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// ── Barras estilizadas ────────────────────────────────────────────────────────

const BarraEmpleadoMabe = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 5,
  backgroundColor: "rgba(26, 144, 255, 0.25) !important",
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    backgroundColor: "#1a90ff !important",
  },
}));

const BarraInstitucional = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 5,
  backgroundColor: "rgba(255, 152, 0, 0.25) !important",
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    backgroundColor: "#ff9800 !important",
  },
}));

const BarraOperario = styled(LinearProgress)(() => ({
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
  tipo?: number;
  nombre?: string;
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
  empleado_mabe?: TipoDetalle;
  institucional?: TipoDetalle;
  operario?: TipoDetalle;
}

// ── Componente ────────────────────────────────────────────────────────────────

function ComplexStatisticsComparativa({
  color,
  title,
  count,
  icon,
  empleado_mabe,
  institucional,
  operario,
}: Props): JSX.Element {
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
        {empleado_mabe && (
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
                {empleado_mabe.label ?? ""}
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={0.5}>
                <MDTypography variant="caption" fontWeight="bold" color="info">
                  {empleado_mabe.porcentaje ?? 0}%
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  ({empleado_mabe.total_puntos ?? 0} puntos)
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
                  width: `${empleado_mabe.porcentaje ?? 0}%`,
                  height: "100%",
                  borderRadius: 5,
                  backgroundColor: "#1a90ff",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </MDBox>
        )}

        {institucional && (
          <MDBox mb={1.5}>
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
                {institucional.label ?? ""}
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={0.5}>
                <MDTypography variant="caption" fontWeight="bold" color="warning">
                  {institucional.porcentaje ?? 0}%
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  ({institucional.total_puntos ?? 0} puntos)
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
                  width: `${institucional.porcentaje ?? 0}%`,
                  height: "100%",
                  borderRadius: 5,
                  backgroundColor: "#ff9800",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </MDBox>
        )}

        {operario && (
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
                {operario.label ?? ""}
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={0.5}>
                <MDTypography variant="caption" fontWeight="bold" color="warning">
                  {operario.porcentaje ?? 0}%
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  ({operario.total_puntos ?? 0} puntos)
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
                  width: `${operario.porcentaje ?? 0}%`,
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

ComplexStatisticsComparativa.defaultProps = {
  color: "info",
};

export default ComplexStatisticsComparativa;

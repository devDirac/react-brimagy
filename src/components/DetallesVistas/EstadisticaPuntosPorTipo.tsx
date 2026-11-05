import { Grid, Typography, Divider, Box, Chip, TextField, MenuItem } from "@mui/material";
import { useIntl } from "react-intl";
import { Spinner } from "react-bootstrap";
import DinamicTableMejorada from "components/DinamicTable/DinamicTable";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import CategoriesList from "examples/Lists/CategoriesList";

import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMemo, useState } from "react";
import { numericFormatter } from "react-number-format";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import MDBox from "components/MDBox";
import MDBadgeDot from "components/MDBadgeDot";

interface Item {
  total_canjes: number;
  total_puntos: number;
}

interface Datos {
  periodo: string;
  fisico: Item;
  digital: Item;
  sin_clasificar: Item;
}
interface Resumen {
  fisico: Item;
  digital: Item;
  sin_clasificar: Item;
}

interface EstadisticasPeriodoData {
  agrupacion: number;
  resumen: Resumen;
  datos: Datos[];
}

interface Props {
  verEstadisticas?: EstadisticasPeriodoData | null;
  procesando?: boolean;
  fechaInicio: string;
  setFechaInicio: (v: string) => void;
  fechaFin: string;
  setFechaFin: (v: string) => void;
  setAgrupacion: React.Dispatch<React.SetStateAction<string>>;
  agrupacion: string;
}

const EstadisticasPuntosPorTipoModulo = ({
  verEstadisticas,
  procesando,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  setAgrupacion,
  agrupacion,
}: Props) => {
  const intl = useIntl();

  const d = verEstadisticas;
  const [fechaInicioLocal, setFechaInicioLocal] = useState<string>(fechaInicio);
  const [fechaFinLocal, setFechaFinLocal] = useState<string>(fechaFin);

  const periodoArray = [
    { id: 0, label: "Mensual", value: "mensual" },
    { id: 1, label: "Anual", value: "anual" },
  ];

  const formatPeriodo = (periodo: string, agrupacion: string) => {
    if (agrupacion === "mensual") {
      //mensual
      const [year, month] = periodo.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleString("es-MX", { month: "short", year: "numeric" });
    }
    //anual
    return periodo;
  };

  const buildChartData = (datos: any[]) => ({
    labels: datos.map((d) => formatPeriodo(d.periodo, agrupacion)),
    datasets: [
      {
        label: "Físico",
        color: "info" as const,
        data: datos.map((d) => d.fisico.total_puntos),
      },
      {
        label: "Digital",
        color: "dark" as const,
        data: datos.map((d) => d.digital.total_puntos),
      },
      {
        label: "Sin clasificar",
        color: "warning" as const,
        data: datos.map((d) => d.sin_clasificar.total_puntos),
      },
    ],
  });

  const chartData = useMemo(() => buildChartData(d?.datos ?? []), [d?.datos, agrupacion]);

  if (!verEstadisticas && !procesando) return null;

  return (
    <Grid container spacing={3} sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" gutterBottom sx={{ textAlign: "center" }}>
          Categorías
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {procesando ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {intl.formatMessage({ id: "general_cargando_datos" })}
            </Typography>
            <Spinner animation="border" />
          </Box>
        ) : d ? (
          <Grid container spacing={3} mt={2}>
            {" "}
            <Grid item xs={12} sm={3}></Grid>
            <Grid item xs={6} sm={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                  label={intl.formatMessage({ id: "input_fecha_inicio" })}
                  openTo="year"
                  format="YYYY/MM/DD"
                  views={["year", "month", "day"]}
                  value={fechaInicioLocal ? dayjs(fechaInicioLocal) : null}
                  onChange={(newValue) => {
                    const formatted = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                    setFechaInicioLocal(formatted);

                    if (formatted && fechaFinLocal && formatted > fechaFinLocal) {
                      setFechaFinLocal("");
                      setFechaFin("");
                    }
                  }}
                  onAccept={(newValue) => {
                    setFechaInicio(newValue ? dayjs(newValue).format("YYYY-MM-DD") : "");
                  }}
                  slotProps={{
                    textField: {
                      error: false,
                      variant: "standard",
                    },
                  }}
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6} sm={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                  label={intl.formatMessage({ id: "input_fecha_fin" })}
                  openTo="year"
                  format="YYYY/MM/DD"
                  views={["year", "month", "day"]}
                  value={fechaFinLocal ? dayjs(fechaFinLocal) : null}
                  minDate={fechaInicioLocal ? dayjs(fechaInicioLocal) : undefined}
                  onChange={(newValue) => {
                    setFechaFinLocal(newValue ? dayjs(newValue).format("YYYY-MM-DD") : "");
                  }}
                  onAccept={(newValue) => {
                    setFechaFin(newValue ? dayjs(newValue).format("YYYY-MM-DD") : "");
                  }}
                  slotProps={{
                    textField: {
                      error: false,
                      variant: "standard",
                    },
                  }}
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                id="agrupacion"
                select
                fullWidth
                label={`${intl.formatMessage({ id: "select_agrupacion" })} *`}
                variant="standard"
                name="agrupacion"
                value={agrupacion || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setAgrupacion(value);
                }}
                InputProps={{
                  style: { padding: "5px" },
                }}
              >
                {periodoArray?.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}></Grid>
            {/* ── Físicos ── */}
            <Grid item xs={12} sm={4}>
              <ComplexStatisticsCard
                color="primary"
                icon="redeem"
                title="Digitales"
                secondary="Puntos premios"
                count={numericFormatter(d.resumen?.digital?.total_puntos + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: false,
                  prefix: "",
                })}
                percentage={{
                  color: "success",
                  amount: `${d.resumen?.digital?.total_canjes}`,
                  label: "Canjes totales",
                }}
              />
            </Grid>
            {/* ── Digitales ── */}
            <Grid item xs={12} sm={4}>
              <ComplexStatisticsCard
                color="primary"
                icon="redeem"
                title="Fisicos"
                secondary="Puntos premios"
                count={numericFormatter(d.resumen?.fisico?.total_puntos + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: false,
                  prefix: "",
                })}
                percentage={{
                  color: "success",
                  amount: `${d.resumen?.fisico?.total_canjes}`,
                  label: "Canjes totales",
                }}
              />
            </Grid>
            {/* ── Totales ── */}
            <Grid item xs={12} sm={4}>
              <ComplexStatisticsCard
                color="primary"
                icon="redeem"
                title="Totales"
                secondary="Puntos premios"
                count={numericFormatter(
                  d.resumen?.fisico?.total_puntos + d.resumen?.digital?.total_puntos + "",
                  {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: false,
                    prefix: "",
                  }
                )}
                percentage={{
                  color: "success",
                  amount: `${d.resumen?.fisico?.total_canjes + d.resumen?.digital?.total_canjes}`,
                  label: "Canjes totales",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <DefaultLineChart
                title="Evolución"
                description={
                  <MDBox display="flex" justifyContent="space-between">
                    <MDBox display="flex" ml={-1}>
                      <MDBadgeDot color="info" size="sm" badgeContent="Fisico" />
                      <MDBadgeDot color="dark" size="sm" badgeContent="Digital" />
                      <MDBadgeDot color="warning" size="sm" badgeContent="Sin clasificar" />
                    </MDBox>
                  </MDBox>
                }
                chart={chartData}
              />
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h6" color="text.secondary">
              {intl.formatMessage({ id: "no_hay_datos_registrados" })}
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default EstadisticasPuntosPorTipoModulo;

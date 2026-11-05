import { Grid, Typography, Divider, Box, Chip } from "@mui/material";
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
import { useState } from "react";
import { numericFormatter } from "react-number-format";

interface TopCategoriaItem {
  id_categoria: number;
  nombre_categoria: string;
  total_canjes: number;
  puntos_canjeados: number;
}

interface GrupoCanjes {
  total_canjes: number;
  total_puntos_canjeados: number;
  top_categorias: TopCategoriaItem[];
}

interface EstadisticasCanjeadosData {
  total: number;
  fisicos: GrupoCanjes;
  digitales: GrupoCanjes;
  sin_clasificar: GrupoCanjes;
}

interface Props {
  verEstadisticas?: EstadisticasCanjeadosData | null;
  procesando?: boolean;
  fechaInicio: string;
  setFechaInicio: (v: string) => void;
  fechaFin: string;
  setFechaFin: (v: string) => void;
}

const EstadisticasPuntosCategoriaModulo = ({
  verEstadisticas,
  procesando,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
}: Props) => {
  const intl = useIntl();

  if (!verEstadisticas && !procesando) return null;

  const d = verEstadisticas;
  const [fechaInicioLocal, setFechaInicioLocal] = useState<string>(fechaInicio);
  const [fechaFinLocal, setFechaFinLocal] = useState<string>(fechaFin);

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
            <Grid item xs={2} sm={3}></Grid>
            <Grid item xs={4} sm={3}>
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
            <Grid item xs={4} sm={3}>
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
            <Grid item xs={2} sm={3}></Grid>
            {/* ── Físicos ── */}
            <Grid item xs={12} sm={6}>
              <ComplexStatisticsCard
                color="primary"
                icon="redeem"
                title="Fisicos"
                secondary="Total de puntos canjeados"
                count={numericFormatter(d.fisicos?.total_puntos_canjeados + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: false,
                  prefix: "",
                })}
                percentage={{
                  color: "success",
                  amount: `${d.fisicos?.total_canjes}`,
                  label: "Canjes totales",
                }}
              />
              <br />
              <CategoriesList
                title="Top categorías fisicos"
                categories={
                  d.fisicos?.top_categorias.slice(0, 10).map((canje) => ({
                    color: "dark" as const,
                    icon: "auto_awesome_mosaic",
                    name: `${canje.nombre_categoria}`,
                    description: (
                      <>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Canjes:</strong> {canje.total_canjes}
                        </Typography>
                        {" - "}
                        <Typography variant="caption" color="text.secondary">
                          <strong>Puntos:</strong> {canje.puntos_canjeados}
                        </Typography>
                      </>
                    ),
                    route: "/canjes-fisicos",
                  })) ?? []
                }
              />
            </Grid>
            {/* ── Digitales ── */}
            <Grid item xs={12} sm={6}>
              <ComplexStatisticsCard
                color="primary"
                icon="redeem"
                title="Digitales"
                secondary="Total de puntos canjeados"
                count={numericFormatter(d.digitales?.total_puntos_canjeados + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: false,
                  prefix: "",
                })}
                percentage={{
                  color: "success",
                  amount: `${d.digitales?.total_canjes}`,
                  label: "Canjes totales",
                }}
              />
              <br />
              <CategoriesList
                title="Top categorías digitales"
                categories={
                  d.digitales?.top_categorias.slice(0, 10).map((canje) => ({
                    color: "dark" as const,
                    icon: "auto_awesome_mosaic",
                    name: `${canje.nombre_categoria}`,
                    description: (
                      <>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Canjes:</strong> {canje.total_canjes}
                        </Typography>
                        {" - "}
                        <Typography variant="caption" color="text.secondary">
                          <strong>Puntos:</strong> {canje.puntos_canjeados}
                        </Typography>
                      </>
                    ),
                    route: "/canjes-digitales",
                  })) ?? []
                }
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

export default EstadisticasPuntosCategoriaModulo;

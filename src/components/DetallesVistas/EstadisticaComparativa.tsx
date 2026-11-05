import { Grid, Typography, Divider, Box } from "@mui/material";
import { useIntl } from "react-intl";
import { Spinner } from "react-bootstrap";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { numericFormatter } from "react-number-format";

import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMemo, useState } from "react";
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import MDBox from "components/MDBox";
import MDBadgeDot from "components/MDBadgeDot";
import ComplexStatisticsComparativa from "examples/Cards/StatisticsCards/ComplexStadisticsComparativa";

interface PorUsuarioItem {
  tipo: number;
  nombre: string;
  total_canjes: number;
  total_puntos: number;
}
interface ResumenItemMini {
  total_canjes: number;
  total_puntos: number;
}
interface ResumenItem {
  fisico: ResumenItemMini;
  digital: ResumenItemMini;
  sin_clasificar: ResumenItemMini;
}

interface PeriodoItem {
  fecha_inicio: string;
  fecha_fin: string;
  resumen: ResumenItem;
  por_usuario: PorUsuarioItem[];
}

interface PeriodoComparativaItem {
  total_puntos: number;
  total_canjes: number;
  fisico_puntos: number;
  digital_puntos: number;
  sin_clasificar_puntos: number;
}

interface Comparativa {
  mes: number;
  periodo1: PeriodoComparativaItem;
  periodo2: PeriodoComparativaItem;
}

interface EstadisticasComparativaData {
  periodo1: PeriodoItem;
  periodo2: PeriodoItem;
  comparativa: Comparativa[];
}

interface EstadisticasHomeModuloProps {
  verEstadisticas?: EstadisticasComparativaData | null;
  procesando?: boolean;
  periodoUnoInicio: string;
  setPeriodoUnoInicio: (v: string) => void;
  periodoUnoFin: string;
  setPeriodoUnoFin: (v: string) => void;
  periodoDosInicio: string;
  setPeriodoDosInicio: (v: string) => void;
  periodoDosFin: string;
  setPeriodoDosFin: (v: string) => void;
  plataforma?: string;
}

const EstadisticaComparativaModulo = ({
  verEstadisticas,
  procesando,
  periodoUnoInicio,
  setPeriodoUnoInicio,
  periodoUnoFin,
  setPeriodoUnoFin,
  periodoDosInicio,
  setPeriodoDosInicio,
  periodoDosFin,
  setPeriodoDosFin,
  plataforma,
}: EstadisticasHomeModuloProps) => {
  const intl = useIntl();

  if (!verEstadisticas && !procesando) return null;

  const d = verEstadisticas;
  const [periodoUnoInicioLocal, setPeriodoUnoInicioLocal] = useState<string>(periodoUnoInicio);
  const [periodoUnoFinLocal, setPeriodoUnoFinLocal] = useState<string>(periodoUnoFin);
  const [periodoDosInicioLocal, setPeriodoDosInicioLocal] = useState<string>(periodoDosInicio);
  const [periodoDosFinLocal, setPeriodoDosFinLocal] = useState<string>(periodoDosFin);

  const puntosTotales1 =
    (d?.periodo1?.resumen?.fisico?.total_puntos || 0) +
    (d?.periodo1?.resumen?.digital?.total_puntos || 0) +
    (d?.periodo1?.resumen?.sin_clasificar?.total_puntos || 0);

  const canjesTotales1 =
    (d?.periodo1?.resumen?.fisico?.total_canjes || 0) +
    (d?.periodo1?.resumen?.digital?.total_canjes || 0) +
    (d?.periodo1?.resumen?.sin_clasificar?.total_canjes || 0);

  const puntosTotales2 =
    (d?.periodo2?.resumen?.fisico?.total_puntos || 0) +
    (d?.periodo2?.resumen?.digital?.total_puntos || 0) +
    (d?.periodo2?.resumen?.sin_clasificar?.total_puntos || 0);

  const canjesTotales2 =
    (d?.periodo2?.resumen?.fisico?.total_canjes || 0) +
    (d?.periodo2?.resumen?.digital?.total_canjes || 0) +
    (d?.periodo2?.resumen?.sin_clasificar?.total_canjes || 0);

  const MES_LABEL: Record<string, string> = {
    "01": "Enero",
    "02": "Febrero",
    "03": "Marzo",
    "04": "Abril",
    "05": "Mayo",
    "06": "Junio",
    "07": "Julio",
    "08": "Agosto",
    "09": "Septiembre",
    "10": "Octubre",
    "11": "Noviembre",
    "12": "Diciembre",
  };

  const chartData = useMemo(
    () => ({
      labels: d?.comparativa?.map((c) => MES_LABEL[c.mes] ?? c.mes) ?? [],
      datasets: [
        {
          label: "Periodo 1",
          color: "dark" as const,
          data: d?.comparativa?.map((c) => c.periodo1?.total_puntos ?? 0) ?? [],
        },
        {
          label: "Periodo 2",
          color: "success" as const,
          data: d?.comparativa?.map((c) => c.periodo2?.total_puntos ?? 0) ?? [],
        },
      ],
    }),
    [d?.comparativa]
  );

  return (
    <Grid container spacing={3} sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" gutterBottom sx={{ textAlign: { xs: "center" } }}>
          Comparativa de puntos
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
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2} sx={{ m: 0, p: 0 }}>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DatePicker
                      label={intl.formatMessage({ id: "input_fecha_inicio" })}
                      openTo="year"
                      format="YYYY/MM" ///DD
                      views={["year", "month"]} //, "day"
                      value={periodoUnoInicioLocal ? dayjs(periodoUnoInicioLocal) : null}
                      onChange={(newValue) => {
                        const formatted = newValue ? dayjs(newValue).format("YYYY-MM") : "";
                        setPeriodoUnoInicioLocal(formatted);

                        if (formatted && periodoUnoFinLocal && formatted > periodoUnoFinLocal) {
                          setPeriodoUnoFinLocal("");
                          setPeriodoUnoFin("");
                        }
                      }}
                      onAccept={(newValue) => {
                        setPeriodoUnoInicio(newValue ? dayjs(newValue).format("YYYY-MM") : ""); //-DD
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
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DatePicker
                      label={intl.formatMessage({ id: "input_fecha_fin" })}
                      openTo="year"
                      format="YYYY/MM"
                      views={["year", "month"]}
                      value={periodoUnoFinLocal ? dayjs(periodoUnoFinLocal) : null}
                      minDate={periodoUnoInicioLocal ? dayjs(periodoUnoInicioLocal) : undefined}
                      onChange={(newValue) => {
                        setPeriodoUnoFinLocal(newValue ? dayjs(newValue).format("YYYY-MM") : "");
                      }}
                      onAccept={(newValue) => {
                        setPeriodoUnoFin(newValue ? dayjs(newValue).format("YYYY-MM") : "");
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
                <Grid item xs={6}></Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Grid container spacing={2} sx={{ m: 0, p: 0 }}>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DatePicker
                      label={intl.formatMessage({ id: "input_fecha_inicio" })}
                      openTo="year"
                      format="YYYY/MM" ///DD
                      views={["year", "month"]} //, "day"
                      value={periodoDosInicioLocal ? dayjs(periodoDosInicioLocal) : null}
                      onChange={(newValue) => {
                        const formatted = newValue ? dayjs(newValue).format("YYYY-MM") : "";
                        setPeriodoDosInicioLocal(formatted);

                        if (formatted && periodoDosFinLocal && formatted > periodoDosFinLocal) {
                          setPeriodoDosFinLocal("");
                          setPeriodoDosFin("");
                        }
                      }}
                      onAccept={(newValue) => {
                        setPeriodoDosInicio(newValue ? dayjs(newValue).format("YYYY-MM") : ""); //-DD
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
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DatePicker
                      label={intl.formatMessage({ id: "input_fecha_fin" })}
                      openTo="year"
                      format="YYYY/MM"
                      views={["year", "month"]}
                      value={periodoDosFinLocal ? dayjs(periodoDosFinLocal) : null}
                      minDate={periodoDosInicioLocal ? dayjs(periodoDosInicioLocal) : undefined}
                      onChange={(newValue) => {
                        setPeriodoDosFinLocal(newValue ? dayjs(newValue).format("YYYY-MM") : "");
                      }}
                      onAccept={(newValue) => {
                        setPeriodoDosFin(newValue ? dayjs(newValue).format("YYYY-MM") : "");
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
                <Grid item xs={6}></Grid>
              </Grid>
            </Grid>
            {/* ── Tarjetas superiores ── */}
            <Grid item xs={12} sm={6} mt={2}>
              <ComplexStatisticsCard
                color="primary"
                icon="tag"
                title="Puntos totales"
                secondary="Periodo 1"
                count={numericFormatter(puntosTotales1 + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: false,
                  prefix: "",
                })}
                percentage={{
                  color: "success",
                  amount: `${canjesTotales1}`,
                  label: `canjes totales - Comparando: ${d?.periodo1?.fecha_inicio} y ${d?.periodo1?.fecha_fin}`,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} mt={2}>
              <ComplexStatisticsCard
                color="primary"
                icon="tag"
                title="Puntos canjeados"
                secondary="Periodo 2"
                count={numericFormatter(puntosTotales2 + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: false,
                  prefix: "",
                })}
                percentage={{
                  color: "success",
                  amount: `${canjesTotales2}`,
                  label: `canjes totales - Comparando: ${d?.periodo2?.fecha_inicio} y ${d?.periodo2?.fecha_fin}`,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} mt={2}>
              <VerticalBarChart
                icon={{ color: "info", component: "leaderboard" }}
                title="Puntos por mes"
                description={
                  <MDBox display="flex" justifyContent="space-between">
                    <MDBox display="flex" ml={-1}>
                      <MDBadgeDot color="dark" size="sm" badgeContent="Periodo 1" />
                      <MDBadgeDot color="success" size="sm" badgeContent="Periodo 2" />
                    </MDBox>
                  </MDBox>
                }
                chart={chartData}
              />
            </Grid>
            {/* PUNTOS TOTALES POR EL TIPO DE USUARIO */}
            {(() => {
              const calcPorcentaje = (puntos: number, total: number) =>
                total > 0 ? Math.round((puntos / total) * 100) : 0;

              const buildPeriodo = (periodoKey: "periodo1" | "periodo2") => {
                const periodo = d[periodoKey];
                const getU = (tipo: number) => periodo?.por_usuario?.find((u) => u.tipo === tipo);
                const total =
                  periodo?.por_usuario?.reduce((acc, u) => acc + (u.total_puntos ?? 0), 0) ?? 0;

                const u1 = plataforma === "club_bohn" ? getU(4) : getU(1);
                const u2 = plataforma === "club_bohn" ? getU(5) : getU(2);
                const u3 = plataforma === "club_bohn" ? getU(6) : getU(3);

                return { u1, u2, u3, total };
              };

              const p1 = buildPeriodo("periodo1");
              const p2 = buildPeriodo("periodo2");

              return (
                <>
                  <Grid item xs={12} sm={6}>
                    <ComplexStatisticsComparativa
                      color="warning"
                      icon="group"
                      title="Periodo 1"
                      count={p1.total}
                      empleado_mabe={{
                        label: plataforma === "club_bohn" ? "Oso Polar" : "Empleado Mabe",
                        total_puntos: p1.u1?.total_puntos ?? 0,
                        porcentaje: calcPorcentaje(p1.u1?.total_puntos ?? 0, p1.total),
                      }}
                      institucional={{
                        label: plataforma === "club_bohn" ? "Leon Marino" : "Institucional",
                        total_puntos: p1.u2?.total_puntos ?? 0,
                        porcentaje: calcPorcentaje(p1.u2?.total_puntos ?? 0, p1.total),
                      }}
                      operario={{
                        label: plataforma === "club_bohn" ? "Pingüino" : "Operario",
                        total_puntos: p1.u3?.total_puntos ?? 0,
                        porcentaje: calcPorcentaje(p1.u3?.total_puntos ?? 0, p1.total),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ComplexStatisticsComparativa
                      color="primary"
                      icon="group"
                      title="Periodo 2"
                      count={p2.total}
                      empleado_mabe={{
                        label: plataforma === "club_bohn" ? "Oso Polar" : "Empleado Mabe",
                        total_puntos: p2.u1?.total_puntos ?? 0,
                        porcentaje: calcPorcentaje(p2.u1?.total_puntos ?? 0, p2.total),
                      }}
                      institucional={{
                        label: plataforma === "club_bohn" ? "Leon Marino" : "Institucional",
                        total_puntos: p2.u2?.total_puntos ?? 0,
                        porcentaje: calcPorcentaje(p2.u2?.total_puntos ?? 0, p2.total),
                      }}
                      operario={{
                        label: plataforma === "club_bohn" ? "Pingüino" : "Operario",
                        total_puntos: p2.u3?.total_puntos ?? 0,
                        porcentaje: calcPorcentaje(p2.u3?.total_puntos ?? 0, p2.total),
                      }}
                    />
                  </Grid>
                </>
              );
            })()}
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

export default EstadisticaComparativaModulo;

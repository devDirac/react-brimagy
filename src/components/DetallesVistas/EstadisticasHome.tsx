import { Grid, Typography, Divider, Box, Chip } from "@mui/material";
import { useIntl } from "react-intl";
import { Spinner } from "react-bootstrap";
import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { numericFormatter } from "react-number-format";
import CategoriesList from "examples/Lists/CategoriesList";
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import MDBadgeDot from "components/MDBadgeDot";
import PieChart from "examples/Charts/PieChart";
import { Card } from "@mui/material";
import DinamicTableMejorada from "components/DinamicTable/DinamicTable";
import ComplexStatisticsCardDetalle from "examples/Cards/StatisticsCards/ComplexStatisticsCardDetalle";
import { useMemo } from "react";

interface EstadisticaHomeItem {
  numero: number;
}
interface CategoriaUsuarioItem {
  tipo: number;
  nombre: string;
  total: number;
}
interface PuntosCategoriaItem {
  tipo: number;
  nombre: string;
  total_puntos: number;
  total_canjes: number;
  canjes_fisico: number;
  canjes_digital: number;
  porcentaje_fisico: number;
  porcentaje_digital: number;
}

interface TipoCanjeDetalle {
  total_canjes: number;
  total_puntos: number;
  porcentaje: number;
}

interface CanjesPorCategoriaItem {
  tipo: number;
  nombre: string;
  fisicos: TipoCanjeDetalle;
  digitales: TipoCanjeDetalle;
  total_canjes: number;
}

interface CanjeItem {
  id: number;
  folio: number;
  nombre_usuario: number;
  email: number;
  phone: number;
  puntos_canjeados: number;
  nombre_premio: number;
  costo_premio: number;
  sku: number;
  estado_canje: number;
  creacion_canje: number;
  estado_validacion: string | null;
  fecha_validacion: string | null;
}

interface EstadisticasHomeData {
  participantes: number;
  puntos_canjeados: number;
  puntos_sobrantes: number;
  puntos_acumulados: number;
  canjes: CanjeItem[];
  participantes_por_categoria: CategoriaUsuarioItem[];
  puntos_por_usuario: PuntosCategoriaItem[];
  //material_sin_movimiento?: ProductoSinMovimiento[];
}

interface EstadisticasHomeModuloProps {
  verEstadisticas?: EstadisticasHomeData | null;
  procesando?: boolean;
  plataforma?: string;
}

// Mapeo de colores por estatus
const estatusColorMap: Record<string, "success" | "error" | "warning" | "info" | "default"> = {
  identidad_validada: "success",
  notificacion_enviada: "warning",
  solicitud_enviada: "info",
};

const PIE_COLORS = ["info", "primary", "dark", "secondary", "warning", "error", "success"] as const;

const EstadisticasHome = ({
  verEstadisticas,
  procesando,
  plataforma,
}: EstadisticasHomeModuloProps) => {
  const intl = useIntl();

  if (!verEstadisticas && !procesando) return null;

  const d = verEstadisticas;

  const canjesConEstatus =
    d?.canjes?.map((c) => ({
      ...c,
      estado_validacion: (
        <Chip
          label={c.estado_validacion ?? "Sin validación"}
          color={estatusColorMap[c.estado_validacion ?? ""] ?? "default"}
          size="small"
          sx={{ textTransform: "uppercase", fontSize: "0.65rem" }}
        />
      ),
    })) ?? [];

  const ESPECIE_LABEL_PUNTOTES: Record<string, string> = {
    empleado_mabe: "Empleado Mabe",
    institucional: "Institucional",
    operario: "Operario",
  };

  const ESPECIE_LABEL_CLUB_BOHN: Record<string, string> = {
    oso_polar: "Oso Polar",
    leon_marino: "Leon Marino",
    pinguino: "Pingüino",
  };

  const ESPECIE_LABEL =
    plataforma === "club_bohn" ? ESPECIE_LABEL_CLUB_BOHN : ESPECIE_LABEL_PUNTOTES;

  const PIE_COLORS = ["info", "warning", "primary"] as const;

  const chartData = useMemo(
    () => ({
      labels: d?.participantes_por_categoria?.map((e) => ESPECIE_LABEL[e.nombre] ?? e.nombre) ?? [],
      datasets: {
        label: "Participantes",
        backgroundColors: [...PIE_COLORS],
        data: d?.participantes_por_categoria?.map((e) => e.total) ?? [],
      },
    }),
    [d?.participantes_por_categoria]
  );

  return (
    <Grid container spacing={3} sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" gutterBottom sx={{ textAlign: { xs: "center" } }}>
          Estadísticas generales
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
            {/* ── Tarjetas superiores ── */}
            <Grid item xs={12} sm={3}>
              <ComplexStatisticsCard
                color="info"
                icon="group"
                title="Participantes"
                count={numericFormatter(d.participantes + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: false,
                  prefix: "",
                })}
                percentage={{ color: "success", amount: "", label: "Usuarios registrados" }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComplexStatisticsCard
                color="info"
                icon="group"
                title="Puntos canjeados"
                count={numericFormatter(d.puntos_canjeados + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: false,
                  prefix: "",
                })}
                percentage={{ color: "success", amount: "", label: "" }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComplexStatisticsCard
                color="info"
                icon="group"
                title="Puntos sobrantes"
                count={numericFormatter(d.puntos_sobrantes + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: false,
                  prefix: "",
                })}
                percentage={{ color: "success", amount: "", label: "" }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComplexStatisticsCard
                color="info"
                icon="group"
                title="Puntos acumulados"
                count={numericFormatter(d.puntos_acumulados + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: false,
                  prefix: "",
                })}
                percentage={{ color: "success", amount: "", label: "" }}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <DinamicTableMejorada
                key="canjes-recientes"
                data={canjesConEstatus}
                sinFiltro
                sinExport
                columnsOrder={[
                  // "folio",
                  "nombre_usuario",
                  "nombre_premio",
                  "telefono",
                  "ciudad",
                  //"creacion_canje",
                  "puntos_canjeados",
                ]}
              />
            </Grid>
            {!!d.participantes_por_categoria?.length && (
              <Grid item xs={12} md={3}>
                <Card sx={{ height: "100%" }}>
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    pt={2}
                    px={2}
                  >
                    <Typography variant="h6">Usuarios por categoría</Typography>
                  </MDBox>
                  <MDBox mt={3}>
                    <Grid container alignItems="center">
                      <Grid item xs={12}>
                        <PieChart chart={chartData} height="12.5rem" />
                      </Grid>
                      <Grid item xs={12}>
                        <MDBox pr={1}>
                          {d.participantes_por_categoria.map((especie, index) => (
                            <MDBox mb={1} key={especie.tipo}>
                              <MDBadgeDot
                                color={PIE_COLORS[index % PIE_COLORS.length] as any}
                                size="sm"
                                badgeContent={`${
                                  ESPECIE_LABEL[especie.nombre] ?? especie.nombre
                                }: ${especie.total}`}
                              />
                            </MDBox>
                          ))}
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            )}
            {/* CANJES POR TIPO DE USUARIO */}
            {(() => {
              const getTipoUsuario = (tipo: number) =>
                d.puntos_por_usuario?.find((c) => c.tipo === tipo);

              const configsPuntotes = [
                { tipo: 1, title: "Empleado Mabe", color: "warning" as const },
                { tipo: 2, title: "Institucional", color: "primary" as const },
                { tipo: 3, title: "Operario", color: "primary" as const },
              ];

              const configsClubBohn = [
                { tipo: 4, title: "Oso Polar", color: "primary" as const },
                { tipo: 5, title: "Leon Marino", color: "primary" as const },
                { tipo: 6, title: "Pingüino", color: "primary" as const },
              ];

              const configs = plataforma === "club_bohn" ? configsClubBohn : configsPuntotes;

              return configs.map(({ tipo, title, color }) => {
                const puntos = getTipoUsuario(tipo);

                return (
                  <Grid item xs={12} sm={4} key={tipo}>
                    <ComplexStatisticsCardDetalle
                      color={color}
                      icon="group"
                      title={title}
                      count={puntos?.total_puntos ?? 0}
                      fisicos={{
                        label: "Físicos",
                        total_canjes: puntos?.canjes_fisico ?? 0,
                        porcentaje: puntos?.porcentaje_fisico ?? 0,
                        color: "warning",
                      }}
                      digitales={{
                        label: "Digitales",
                        total_canjes: puntos?.canjes_digital ?? 0,
                        porcentaje: puntos?.porcentaje_digital ?? 0,
                        color: "primary",
                      }}
                    />
                  </Grid>
                );
              });
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

export default EstadisticasHome;

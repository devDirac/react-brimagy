// components/AhorroStatsCards/AhorroStatsCards.tsx
import { Grid, Card, Typography, Box, Tooltip, IconButton } from "@mui/material";
import { TotalesReporte, Periodos } from "../../modules/reporteCanjesGlobal/types/reporteCanjes";
import { reporteColors } from "../../modules/reporteCanjesGlobal/config/reporteCanjesColors";
import { IconCalendarWeek, IconEdit, IconCalendarPlus } from "@tabler/icons-react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";

interface StatDef {
  key: keyof TotalesReporte;
  label: string;
  bg: string;
}

const stats: StatDef[] = [
  {
    key: "ahorro_precio_puntos_global",
    label: "Ahorro precio puntos global",
    bg: reporteColors.verde,
  },
  {
    key: "ahorro_precio_proveedor_global",
    label: "Ahorro precio proveedor global",
    bg: reporteColors.verde,
  },
  { key: "ahorro_fee_puntos_global", label: "Ahorro fee puntos global", bg: reporteColors.gris },
  {
    key: "ahorro_fee_proveedor_global",
    label: "Ahorro fee proveedor global",
    bg: reporteColors.gris,
  },
  {
    key: "ahorro_envio_proveedor_global",
    label: "Ahorro envío proveedor global",
    bg: reporteColors.naranjaAmarillo,
  },
  {
    key: "ahorro_usuario_global",
    label: "Ahorro usuario",
    bg: reporteColors.naranja,
  },
  {
    key: "ahorro_proveedor_global",
    label: "Ahorro proveedor",
    bg: reporteColors.naranja,
  },
];

interface Props {
  totales: TotalesReporte;
  periodos?: Periodos[] | null;
  handleisAlertOpenPeriodo: () => void;
  handleisAlertClosePeriodo: () => void;
  isAlertOpenPeriodo: boolean;
  setPeriodoEditar: React.Dispatch<React.SetStateAction<any>>;
}

const AhorroStatsCards = ({
  totales,
  periodos,
  handleisAlertOpenPeriodo,
  handleisAlertClosePeriodo,
  isAlertOpenPeriodo,
  setPeriodoEditar,
}: Props) => {
  const intl = useIntl();
  const periodoActivo = periodos?.find((p) => p.activo === 1) ?? null;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {stats.map((s) => (
        <Grid item xs={12} sm={6} md={3} key={s.key}>
          <Card sx={{ overflow: "hidden" }}>
            <Box sx={{ backgroundColor: s.bg, py: 1, textAlign: "center" }}>
              <Typography variant="caption" fontWeight="bold">
                {s.label}
              </Typography>
            </Box>
            <Box sx={{ py: 2, textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold">
                {totales[s.key]}%
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={3} key="periodo-actual">
        <Card sx={{ py: 0.5, px: 2, overflow: "hidden" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="caption" fontWeight="bold">
              PERIODO ACTUAL
            </Typography>

            <Box>
              {periodoActivo && (
                <Tooltip title={intl.formatMessage({ id: "general_editar" })}>
                  <IconButton
                    onClick={(e) => {
                      setPeriodoEditar(periodoActivo);
                      handleisAlertOpenPeriodo();
                    }}
                    sx={{
                      color: "#7153c2",
                      "&:hover": { color: "#442e80" },
                      "&:focus:not(:hover)": { background: "transparent" },
                    }}
                  >
                    <IconEdit stroke={2} />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title={intl.formatMessage({ id: "general_añadir_periodo" })}>
                <IconButton
                  onClick={(e) => {
                    setPeriodoEditar(null);
                    handleisAlertOpenPeriodo();
                  }}
                  sx={{
                    color: "#126b4b",
                    "&:hover": { color: "#063624" },
                    "&:focus:not(:hover)": { background: "transparent" },
                  }}
                >
                  <IconCalendarPlus stroke={2} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Fila inferior: ícono calendario a la izquierda, fechas a la derecha */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 2,
            }}
          >
            <IconCalendarWeek stroke={2} size={65} />

            <Box sx={{ textAlign: "left" }}>
              {periodoActivo ? (
                <>
                  <Typography variant="body2">
                    Inicio:{" "}
                    {dayjs(periodoActivo?.fecha_inicio)
                      .locale("es")
                      .format("DD [de] MMMM [de] YYYY")}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    Fin:{" "}
                    {dayjs(periodoActivo?.fecha_fin).locale("es").format("DD [de] MMMM [de] YYYY")}
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" fontWeight="bold">
                  No hay periodo registrado
                </Typography>
              )}
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AhorroStatsCards;

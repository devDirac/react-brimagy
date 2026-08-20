// components/AhorroStatsCards/AhorroStatsCards.tsx
import { Grid, Card, Typography, Box } from "@mui/material";
import { TotalesReporte } from "../../modules/reporteCanjesGlobal/types/reporteCanjes";
import { reporteColors } from "../../modules/reporteCanjesGlobal/config/reporteCanjesColors";

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
}

const AhorroStatsCards = ({ totales }: Props) => {
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
    </Grid>
  );
};

export default AhorroStatsCards;

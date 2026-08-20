import { Grid, Typography, Divider, Box } from "@mui/material";
import { useIntl } from "react-intl";
import { Spinner } from "react-bootstrap";
import { ReporteGeneralResponse } from "../../modules/reporteCanjesGlobal/types/reporteCanjes";
import { reporteCanjesColumns } from "../../modules/reporteCanjesGlobal/config/reporteCanjesColumns";
import GenericGroupedTable from "components/GenericGroupedTable/GenericGroupedTable";
import AhorroStatsCards from "components/AhorroStatsCards/AhorroStatsCards";

interface Props {
  verEstadisticas?: ReporteGeneralResponse | null;
  procesando?: boolean;
  fechaInicio: string;
  setFechaInicio: (v: string) => void;
  fechaFin: string;
  setFechaFin: (v: string) => void;
}

const ReporteCanjesGeneralModulo = ({ verEstadisticas, procesando }: Props) => {
  const intl = useIntl();

  if (!verEstadisticas && !procesando) return null;

  return (
    <Grid container spacing={3} sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" gutterBottom sx={{ textAlign: "center" }}>
          Reporte general de canjes
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {procesando ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {intl.formatMessage({ id: "general_cargando_datos" })}
            </Typography>
            <Spinner animation="border" />
          </Box>
        ) : verEstadisticas ? (
          <>
            <AhorroStatsCards totales={verEstadisticas.totales} />
            <GenericGroupedTable
              data={verEstadisticas.detalle}
              columns={reporteCanjesColumns}
              totales={verEstadisticas.totales}
              searchColumnId="premio"
              searchPlaceholder="Buscar por premio..."
            />
          </>
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

export default ReporteCanjesGeneralModulo;

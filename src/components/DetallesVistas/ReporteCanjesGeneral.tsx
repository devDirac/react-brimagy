import { Grid, Typography, Divider, Box } from "@mui/material";
import { useIntl } from "react-intl";
import { Spinner } from "react-bootstrap";
import {
  ReporteGeneralResponse,
  Periodos,
} from "../../modules/reporteCanjesGlobal/types/reporteCanjes";
import { reporteCanjesColumns } from "../../modules/reporteCanjesGlobal/config/reporteCanjesColumns";
import GenericGroupedTable from "components/GenericGroupedTable/GenericGroupedTable";
import AhorroStatsCards from "components/AhorroStatsCards/AhorroStatsCards";
import { FormikProps } from "formik";

interface PeriodoFormValues {
  fecha_inicio_periodo: string;
  fecha_fin_periodo: string;
}

interface PropsReporteGeneral {
  verEstadisticas?: ReporteGeneralResponse | null;
  procesando?: boolean;
  descargando?: boolean;
  rangoFechas?: boolean;
  fechaInicio: string;
  setFechaInicio: (v: string) => void;
  fechaFin: string;
  setFechaFin: (v: string) => void;
  handleExportarExcel: (inicio?: string, fin?: string, plataforma?: string) => Promise<void>;
  plataforma?: string;
  periodos?: Periodos[] | null;
  formik: FormikProps<PeriodoFormValues>;
  getFieldColor: (fieldName: keyof PeriodoFormValues) => string | undefined;
  createPeriodo: (data: any) => Promise<void>;
  procesandoPeriodo?: boolean;
  handleisAlertOpenPeriodo: () => void;
  handleisAlertClosePeriodo: () => void;
  isAlertOpenPeriodo: boolean;
  setPeriodoEditar: React.Dispatch<React.SetStateAction<any>>;
  periodoEditar: Periodos | null;
  editarPeriodo: (datos: any) => void;
}

const ReporteCanjesGeneralModulo = ({
  verEstadisticas,
  procesando,
  descargando,
  handleExportarExcel,
  plataforma,
  periodos,
  formik,
  getFieldColor,
  createPeriodo,
  procesandoPeriodo,
  handleisAlertOpenPeriodo,
  handleisAlertClosePeriodo,
  isAlertOpenPeriodo,
  setPeriodoEditar,
  periodoEditar,
  editarPeriodo,
}: PropsReporteGeneral) => {
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
            <AhorroStatsCards
              periodos={periodos}
              totales={verEstadisticas.totales}
              handleisAlertOpenPeriodo={handleisAlertOpenPeriodo}
              isAlertOpenPeriodo={isAlertOpenPeriodo}
              handleisAlertClosePeriodo={handleisAlertClosePeriodo}
              setPeriodoEditar={setPeriodoEditar}
            />
            <GenericGroupedTable
              data={verEstadisticas.detalle}
              columns={reporteCanjesColumns}
              totales={verEstadisticas.totales}
              searchColumnId="premio"
              searchPlaceholder="Buscar por premio..."
              descargando={descargando}
              handleExportarExcel={handleExportarExcel}
              plataforma={plataforma}
              periodos={periodos}
              formik={formik}
              getFieldColor={getFieldColor}
              createPeriodo={createPeriodo}
              procesandoPeriodo={procesandoPeriodo}
              handleisAlertOpenPeriodo={handleisAlertOpenPeriodo}
              isAlertOpenPeriodo={isAlertOpenPeriodo}
              handleisAlertClosePeriodo={handleisAlertClosePeriodo}
              periodoEditar={periodoEditar}
              editarPeriodo={editarPeriodo}
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

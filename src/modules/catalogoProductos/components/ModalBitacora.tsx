import { Grid, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import ModalComponent from "components/Modal";
import TablaDatos from "components/TablaDatos";
import { columnasBitacora, RegistroBitacora } from "./tabla/columnasBitacora";
import type { CatalogoProductosState } from "../hooks";

interface Props {
  bitacora: CatalogoProductosState["bitacora"];
  nombreProducto?: string;
  procesando: boolean;
}

const ModalBitacora = ({ bitacora, nombreProducto, procesando }: Props) => {
  const intl = useIntl();
  const registros: RegistroBitacora[] = bitacora.registros ?? [];

  return (
    <ModalComponent
      handleClose={bitacora.cerrar}
      isOpen={bitacora.abierta}
      key="alertaBitacoraProducto"
    >
      <Grid container spacing={2} mt={4} style={{ textAlign: "center" }}>
        {registros.length > 0 ? (
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom noWrap sx={{ fontWeight: 600, mb: 4 }}>
              HISTORIAL DE CAMBIOS EN EL PRODUCTO {nombreProducto}
            </Typography>
            <TablaDatos<RegistroBitacora>
              data={registros}
              columns={columnasBitacora}
              opcionesPorPagina={[5, 10, 25]}
              anchoMinimo={700}
            />
          </Grid>
        ) : (
          !procesando && (
            <Grid item xs={12} display="flex" justifyContent="center">
              <h3>{intl.formatMessage({ id: "sin_cambios_producto" })}</h3>
            </Grid>
          )
        )}
      </Grid>
    </ModalComponent>
  );
};

export default ModalBitacora;

import { Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import env from "react-dotenv";
import ModalComponent from "components/Modal";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import type { RecursoProducto } from "../types";

interface Props {
  foto: RecursoProducto | null;
  onCerrar: () => void;
}

/** Foto ampliada con opción de descarga (fotos, fotos de oferta y foto de monto). */
const ModalVistaFoto = ({ foto, onCerrar }: Props) => {
  const url = foto ? `${env.API_URL_ASSETS}${foto.url_foto}` : "";

  return (
    <ModalComponent handleClose={onCerrar} isOpen={!!foto} key="vista-foto">
      {foto && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <MDTypography variant="h5">{foto.nombre_original}</MDTypography>
              <IconButton onClick={onCerrar} size="small">
                <CloseIcon />
              </IconButton>
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <img
                src={url}
                alt={foto.nombre_original}
                style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 8 }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox display="flex" justifyContent="flex-end" gap={2}>
              <MDButton variant="outlined" color="secondary" onClick={onCerrar}>
                Cerrar
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                component="a"
                href={url}
                download={foto.nombre_original}
                target="_blank"
              >
                Descargar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      )}
    </ModalComponent>
  );
};

export default ModalVistaFoto;

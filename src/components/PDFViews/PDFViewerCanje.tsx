import React from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PDFCanje from "./PDFCanje";

interface Canje {
  id: number;
  folio: string;
  nombre_usuario: string;
  email: string;
  phone: number;
  number_of_awards: string;
  size: string;
  color: string;
  category: string;
  puntos_canjeados: string;
  nombre_premio: string;
  costo_premio: string;
  sku: string;
  calle: string;
  numero_calle: string;
  colonia: string;
  codigo_postal: number;
  municipio: string;
  numero_interior: string;
  between_1: string;
  between_2: string;
  referencia_adicional: string;
  creacion_canje: string;
  estado_canje: string;
  estado_validacion: string;
}

interface PDFViewerCanjeProps {
  open: boolean;
  onClose: () => void;
  canje: Canje;
}

const PDFViewerCanje: React.FC<PDFViewerCanjeProps> = ({ open, onClose, canje }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Folio de canje: #{canje.folio}</span>
          <Box>
            <PDFDownloadLink
              document={<PDFCanje canje={canje} />}
              fileName={`Canje_${canje.folio}_${canje.nombre_usuario}.pdf`}
              style={{ textDecoration: "none", marginRight: "10px" }}
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#084d6e",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#063a52",
                    },
                  }}
                >
                  {loading ? "Generando..." : "Descargar PDF"}
                </Button>
              )}
            </PDFDownloadLink>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ height: "80vh", padding: 0 }}>
        <PDFViewer width="100%" height="100%" showToolbar={true}>
          <PDFCanje canje={canje} />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewerCanje;

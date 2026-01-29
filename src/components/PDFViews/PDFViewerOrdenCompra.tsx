import React from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PDFCanje from "./PDFCanje";
import PDFOrdenCompra from "./PDFOrdenCompra";

interface Producto {
  id: number;
  id_canje: number;
  folio: string;
  nombre_usuario: string;
  email: string;
  phone: number;
  number_of_awards: number;
  size: string;
  color: string;
  category: string;
  puntos_canjeados: number;
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
  nombre_producto: string;
  marca: string;
  nombre_proveedor: string;
  razon_social: string;
  fecha_validacion?: string;
  fee_brimagy: number;
  costo_sin_iva: number;
  costo_con_iva: number;
  iva: number;
  estatus_proveedor: number;
  porcentaje_descuento: number;
  cantidad_producto: number;
  precio_unitario: number;
  estatus_almacen: number;
  importe_total: number;
  subtotal: number;
}
interface ordenCompraResponse {
  estadisticas?: {
    total_productos: number;
    productos_aceptados: number;
    productos_rechazados: number;
    productos_pendientes: number;
  };
  orden_compra: {
    id: number;
    no_orden: string;
    estatus: string;
    observaciones: string;
    nombre_vendedor: string;
    primer_apellido: string;
    segundo_apellido: string;
    created_at: string;
    updated_at: string;
  };
  proveedor: {
    id: number;
    nombre: string;
    razon_social: string;
    descripcion: string;
    nombre_contacto: string;
    telefono: string;
    correo: string;
  };
  totales: {
    subtotal: number;
    iva: number;
    total: number;
  };
  productos: Producto[];
}

interface PDFViewerOrdenCompraProps {
  open: boolean;
  onClose: () => void;
  ordenCompra: ordenCompraResponse;
}

const PDFViewerOrdenCompra: React.FC<PDFViewerOrdenCompraProps> = ({
  open,
  onClose,
  ordenCompra,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>No. de orden de compra: #{ordenCompra?.orden_compra?.no_orden}</span>
          <Box>
            <PDFDownloadLink
              document={<PDFOrdenCompra ordenCompra={ordenCompra} />}
              fileName={`Orden_Compra_${ordenCompra?.orden_compra?.no_orden}_${ordenCompra?.proveedor?.nombre}.pdf`}
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
          <PDFOrdenCompra ordenCompra={ordenCompra} />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewerOrdenCompra;

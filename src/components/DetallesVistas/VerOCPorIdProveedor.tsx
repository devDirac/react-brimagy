import {
  Grid,
  Typography,
  Divider,
  Box,
  Chip,
  Paper,
  Button,
  TextField,
  TablePagination,
  Tooltip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useIntl } from "react-intl";
import ModalComponent from "components/Modal";
import { useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { numericFormatter } from "react-number-format";

import { useSelector } from "react-redux";
import { StoreType } from "../../types/genericTypes";
import PDFViewerCanje from "components/PDFViews/PDFViewerCanje";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SendIcon from "@mui/icons-material/Send";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

interface OrdenesCompra {
  id: number;
  no_orden: string;
  estado_orden: string;
  fecha_creacion: string;
  total_productos: number;
}
interface Proveedor {
  id: number;
  nombre: string;
  razon_social: string;
  descripcion: string;
  nombre_contacto: number;
  telefono: string;
  correo: string;
  total_canjes: string;
}

interface DetalleCanjeProps {
  verOrdenesCompra?: OrdenesCompra[] | null;
  verProveedor?: Proveedor | null;
  isPDFViewerOpen: boolean;
  handleClosePDFViewer: () => void;
  handleOpenPDFViewer: () => void;
  handleisAlertOpenVerCanje: () => void;
  procesandoIdentidad: boolean;
  procesandoEnviarProveedor: boolean;
  procesandoOrdenCompra: boolean;
  getOCPorId: (data: any) => Promise<void>;
  enviarCotizacionProveedor: (data: any) => Promise<void>;
}

const OCPorIdProveedorModal = ({
  isPDFViewerOpen,
  handleClosePDFViewer,
  handleOpenPDFViewer,
  handleisAlertOpenVerCanje,
  verProveedor,
  verOrdenesCompra,
  procesandoIdentidad,
  procesandoEnviarProveedor,
  procesandoOrdenCompra,
  enviarCotizacionProveedor,
  getOCPorId,
}: DetalleCanjeProps) => {
  if (!verProveedor) return null;
  if (!verOrdenesCompra) return null;
  const intl = useIntl();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  // Handlers para la paginación
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const ordenesCompraPaginadas = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return verOrdenesCompra?.slice(startIndex, endIndex) || [];
  }, [verOrdenesCompra, page, rowsPerPage]);

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const isSuperAdmin = tipoUsuario === 6;
  const isAdministracion = tipoUsuario === 5;
  const isInventario = tipoUsuario === 4;
  const isCompras = tipoUsuario === 3;
  const isAuditor = tipoUsuario === 2;
  const isInternauta = tipoUsuario === 1;

  const [isAlertOpenCompraDigital, setIsAlertOpenCompraDigital] = useState(false);
  const handleisAlertOpenCompraDigital = () => setIsAlertOpenCompraDigital(true);
  const handleisAlertCloseCompraDigital = () => setIsAlertOpenCompraDigital(false);

  const getEstadoColorCanje = (estado_canje: string) => {
    if (!estado_canje) return "default";
    switch (estado_canje.toLowerCase()) {
      case "inactive":
        return "error";
      case "active":
        return "success";
      default:
        return "default";
    }
  };
  const getEstadoColorValidacion = (estado_validacion: string) => {
    if (!estado_validacion) return "default";
    switch (estado_validacion.toLowerCase()) {
      case "notificacion_enviada":
        return "warning";
      case "solicitud_enviada":
        return "error";
      case "identidad_validada":
        return "success";
      default:
        return "default";
    }
  };

  const estadosCanjeMap: { [key: string]: string } = {
    ACTIVE: "ACTIVO",
    INACTIVE: "INACTIVO",
  };

  const estadosValidacionMap: { [key: string]: string } = {
    NOTIFICACION_ENVIADA: "NOTIFICACIÓN ENVIADA",
    SOLICITUD_ENVIADA: "SOLICITUD ENVIADA",
    IDENTIDAD_VALIDADA: "IDENTIDAD VALIDADA",
  };

  const renderEstatusChip = (estatusProveedor: number) => {
    if (estatusProveedor === null || estatusProveedor === undefined) {
      return <Chip label="Pendiente" color="default" variant="outlined" />;
    }

    if (estatusProveedor === 0) {
      return <Chip label="Validación pendiente" color="secondary" variant="outlined" />;
    }

    if (estatusProveedor === 2) {
      return <Chip label="Rechazado" color="error" variant="outlined" />;
    }

    if (estatusProveedor === 1) {
      return <Chip label="Aceptado" color="success" variant="outlined" />;
    }

    return null;
  };

  // Función helper para traducir estados
  const traducirEstadoCanje = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosCanjeMap[estadoUpper] || estadoUpper;
  };

  const traducirEstadoValidacion = (estado: string | null): string => {
    if (!estado) return "SIN VALIDAR";
    const estadoUpper = estado.toUpperCase();
    return estadosValidacionMap[estadoUpper] || estadoUpper;
  };

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={2}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Canjes registrados
            </Typography>
          </Box>
        </Grid>

        {/* Datos del proveedor */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Datos del proveedor
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Nombre del proveedor
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProveedor.nombre}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Razón Social
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProveedor.razon_social ?? "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Nombre del contacto
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProveedor.nombre_contacto ?? "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Teléfono
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProveedor.telefono ?? "S/N"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Correo
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProveedor.correo ?? "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Total de ordenes de compra
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verOrdenesCompra?.length}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Información de los canjes */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {ordenesCompraPaginadas.map((oc) => {
                return (
                  <>
                    <Grid item xs={6} md={4} key={oc.id}>
                      <Typography variant="body2" color="text.secondary">
                        No. orden
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {oc.no_orden}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4} key={oc.id}>
                      <Typography variant="body2" color="text.secondary">
                        No. canjes
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {oc.total_productos}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4} key={oc.id}>
                      <Typography variant="body2" color="text.secondary">
                        Acciones
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        <Tooltip title={intl.formatMessage({ id: "ver_orden_compra" })}>
                          <IconButton
                            onClick={() => {
                              //console.log(oc.id);
                              getOCPorId(oc.id);
                              handleisAlertOpenVerCanje();
                            }}
                            sx={{ color: darkMode ? "#fff" : "#13e9bf", padding: "0" }}
                          >
                            <ManageSearchIcon fontSize="large" />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                    </Grid>
                  </>
                );
              })}
            </Grid>
            <Divider sx={{ mb: 0 }} />
            {/* Componente de paginación */}
            <MDBox mt={3} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TablePagination
                component="div"
                count={verOrdenesCompra.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[4, 8, 10, 12]}
                labelRowsPerPage="Ordenes de compra por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                sx={{
                  direction: "ltr",
                  ".MuiTablePagination-toolbar": {
                    justifyContent: "space-between",
                    padding: "16px 24px",
                  },
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                    margin: 0,
                  },
                  ".MuiTablePagination-actions svg": {
                    transform: "scaleX(-1)",
                  },
                }}
              />
            </MDBox>
          </Paper>
        </Grid>
      </Grid>
      <ModalConfirm
        onAcept={() => {
          handleisAlertCloseCompraDigital();
          //eliminarProducto(Number(productoId));
        }}
        onCancel={() => {
          handleisAlertCloseCompraDigital();
        }}
        open={isAlertOpenCompraDigital}
        text={intl.formatMessage({
          id: "producto_compra_digital_confirmar",
        })}
        title={""}
        cancelText="No"
        acceptText={intl.formatMessage({
          id: "si",
        })}
      />
    </Box>
  );
};
export default OCPorIdProveedorModal;

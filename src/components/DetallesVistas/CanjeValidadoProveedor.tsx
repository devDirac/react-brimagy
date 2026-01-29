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
import PDFViewerOrdenCompra from "components/PDFViews/PDFViewerOrdenCompra";

interface Producto {
  id: number;
  id_validacion_producto: number;
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

interface CanjesResponse {
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

interface DetalleCanjeProps {
  verCanje?: CanjesResponse | null;
  verProveedor?: Proveedor | null;
  isPDFViewerOpen: boolean;
  handleClosePDFViewer: () => void;
  handleOpenPDFViewer: () => void;
  handleisAlertOpenOtroProveedor: () => void;
  procesandoIdentidad: boolean;
  procesandoEnviarProveedor: boolean;
  procesandoOrdenCompra: boolean;
  procesandoEnviarOrdenAProveedor: boolean;
  procesandoRechazarCotizacion: boolean;
  enviarOrdenCompraProveedor: (data: any) => Promise<void>;
  enviarCotizacionProveedor: (data: any) => Promise<void>;
  rechazarCotizacionDeProveedor: (data: any) => Promise<void>;
  getProductoNuevoProveedor: (data: any) => Promise<void>;
  setOrdenCompraActiva: React.Dispatch<React.SetStateAction<any>>;
}

const CanjeValidadoProveedorModal = ({
  isPDFViewerOpen,
  handleClosePDFViewer,
  handleOpenPDFViewer,
  verCanje,
  verProveedor,
  procesandoIdentidad,
  procesandoEnviarProveedor,
  procesandoOrdenCompra,
  procesandoEnviarOrdenAProveedor,
  procesandoRechazarCotizacion,
  enviarCotizacionProveedor,
  enviarOrdenCompraProveedor,
  rechazarCotizacionDeProveedor,
  getProductoNuevoProveedor,
  handleisAlertOpenOtroProveedor,
  setOrdenCompraActiva,
}: DetalleCanjeProps) => {
  if (!verCanje) return null;
  if (!verProveedor) return null;
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

  const canjesPaginados = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return verCanje?.productos.slice(startIndex, endIndex) || [];
  }, [verCanje, page, rowsPerPage]);

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
      case "cotizacion_enviada_a_proveedor":
        return "warning";
      case "cotizacion_validada_por_proveedor":
        return "primary";
      case "orden_compra_enviada_a_proveedor":
        return "info";
      case "orden_validada_por_proveedor":
        return "success";
      case "cotizacion_rechazada":
        return "error";
      case "xml_validado_correctamente_proveedor":
        return "primary";
      case "factura_subida_correctamente_proveedor":
        return "primary";
      default:
        return "default";
    }
  };

  const estadosCanjeMap: { [key: string]: string } = {
    ACTIVE: "ACTIVO",
    INACTIVE: "INACTIVO",
  };

  const estadosValidacionMap: { [key: string]: string } = {
    COTIZACION_ENVIADA_A_PROVEEDOR: "LA COTIZACIÓN FUE ENVIADA A PROVEEDOR",
    COTIZACION_VALIDADA_POR_PROVEEDOR: "LA COTIZACIÓN FUE VALIDADA POR EL PROVEEDOR",
    ORDEN_COMPRA_ENVIADA_A_PROVEEDOR: "LA ORDEN DE COMPRA FUE ENVIADA AL PROVEEDOR",
    ORDEN_VALIDADA_POR_PROVEEDOR: "LA ORDEN DE COMPRA FUE VALIDADA POR EL PROVEEDOR",
    COTIZACION_RECHAZADA: "LA COTIZACIÓN HA SIDO RECHAZADA",
    XML_VALIDADO_CORRECTAMENTE_PROVEEDOR: "EL XML DE LA FACTURA FUE VALIDADO POR EL PROVEEDOR",
    FACTURA_SUBIDA_CORRECTAMENTE_PROVEEDOR: "ESPERANDO VALIDACIÓN DE ORDEN POR PROVEEDOR",
  };

  const renderEstatusChip = (estatusProveedor: number) => {
    if (estatusProveedor === null || estatusProveedor === undefined) {
      return <Chip label="Cotización pendiente" color="default" variant="outlined" />;
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
    if (!estado) return "SIN ESTATUS";
    const estadoUpper = estado.toUpperCase();
    return estadosValidacionMap[estadoUpper] || estadoUpper;
  };

  const todosProductosValidados = useMemo(() => {
    if (!verCanje?.productos || verCanje.productos.length === 0) {
      return false;
    }

    return verCanje.productos.every(
      (producto: any) =>
        producto.estatus_proveedor === 0 ||
        producto.estatus_proveedor === 1 ||
        producto.estatus_proveedor === 2
    );
  }, [verCanje]);

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={2}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Productos registrados
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
              {!verCanje?.orden_compra?.estatus ? null : (
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Estatus de la orden de compra
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    <Chip
                      label={traducirEstadoValidacion(
                        verCanje?.orden_compra?.estatus?.toUpperCase()
                      )}
                      color={getEstadoColorValidacion(verCanje?.orden_compra?.estatus)}
                      sx={{ fontWeight: "bold" }}
                    />
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        {/* Información de los canjes */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            {canjesPaginados.length > 0 ? (
              canjesPaginados.map((canje) => {
                const precioUnitario = canje.costo_sin_iva || 0;
                const cantidad = canje.number_of_awards || 0;
                const porcentajeDescuento = canje.fee_brimagy || 0;
                // Subtotal sin descuento
                const subtotalSinDescuento = precioUnitario * cantidad;
                // Descuento en pesos
                const descuentoEnPesos = subtotalSinDescuento * (porcentajeDescuento / 100);
                // Subtotal con descuento
                const subtotalConDescuento = subtotalSinDescuento - descuentoEnPesos;
                // IVA
                const iva = subtotalConDescuento * 0.16;
                // Total
                const importeTotal = subtotalConDescuento + iva;

                return (
                  <>
                    <Grid container spacing={2} key={canje.id}>
                      <Grid item xs={6} md={!verCanje?.orden_compra ? 2 : 3}>
                        <Typography variant="body2" color="text.secondary">
                          Nombre del producto
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={
                            canje.estatus_proveedor === 2
                              ? {
                                  textDecoration: "line-through",
                                  textDecorationColor: "red",
                                }
                              : {}
                          }
                        >
                          {canje.nombre_premio}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={1}>
                        <Typography variant="body2" color="text.secondary">
                          Cantidad
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={
                            canje.estatus_proveedor === 2
                              ? {
                                  textDecoration: "line-through",
                                  textDecorationColor: "red",
                                }
                              : {}
                          }
                        >
                          {cantidad}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Precio unitario
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={
                            canje.estatus_proveedor === 2
                              ? {
                                  textDecoration: "line-through",
                                  textDecorationColor: "red",
                                }
                              : {}
                          }
                        >
                          {numericFormatter(precioUnitario.toString(), {
                            thousandSeparator: ",",
                            decimalScale: 2,
                            fixedDecimalScale: true,
                            prefix: "$",
                          })}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={1}>
                        <Typography variant="body2" color="text.secondary">
                          % de desc.
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={
                            canje.estatus_proveedor === 2
                              ? {
                                  textDecoration: "line-through",
                                  textDecorationColor: "red",
                                }
                              : {}
                          }
                        >
                          {numericFormatter(porcentajeDescuento.toString(), {
                            thousandSeparator: ",",
                            decimalScale: 2,
                            fixedDecimalScale: false,
                            suffix: "%",
                          })}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={1}>
                        <Typography variant="body2" color="text.secondary">
                          Impuestos
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={
                            canje.estatus_proveedor === 2
                              ? {
                                  textDecoration: "line-through",
                                  textDecorationColor: "red",
                                }
                              : {}
                          }
                        >
                          IVA (16%)
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Importe
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={
                            canje.estatus_proveedor === 2
                              ? {
                                  textDecoration: "line-through",
                                  textDecorationColor: "red",
                                }
                              : {}
                          }
                        >
                          {numericFormatter(importeTotal.toString(), {
                            thousandSeparator: ",",
                            decimalScale: 2,
                            fixedDecimalScale: true,
                            prefix: "$",
                          })}
                        </Typography>
                      </Grid>
                      {!verCanje?.orden_compra ? (
                        <Grid item xs={6} md={1}>
                          <Typography variant="body2" color="text.secondary">
                            Acciones
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            <Tooltip title={intl.formatMessage({ id: "enviar_a_otro_proveedor" })}>
                              <IconButton
                                onClick={() => {
                                  const datos = {
                                    nombre_producto: canje.nombre_premio,
                                  };
                                  setOrdenCompraActiva(canje?.id_validacion_producto);
                                  getProductoNuevoProveedor(datos);
                                  handleisAlertOpenOtroProveedor();
                                }}
                                sx={{ color: darkMode ? "#fff" : "#13e9bf", padding: "0" }}
                              >
                                <DoubleArrowIcon />
                              </IconButton>
                            </Tooltip>
                            {/*{canje.estatus_proveedor === 2 ? null : (
                              <Tooltip
                                title={intl.formatMessage({ id: "marcar_como_compra_digital" })}
                              >
                                <IconButton
                                  onClick={() => handleisAlertOpenCompraDigital()}
                                  sx={{ color: darkMode ? "#fff" : "#f64e52", padding: "0" }}
                                >
                                  <MobileFriendlyIcon />
                                </IconButton>
                              </Tooltip>
                            )}*/}
                          </Typography>
                        </Grid>
                      ) : null}
                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Estatus
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {renderEstatusChip(canje.estatus_proveedor)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ mb: 2 }} />
                  </>
                );
              })
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {intl.formatMessage({ id: "no_hay_canjes_validados_disponibles" })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No se encontraron canjes sin orden de compra disponibles
                </Typography>
              </Box>
            )}

            {/* Componente de paginación */}
            <MDBox mt={3} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TablePagination
                component="div"
                count={verCanje.productos.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[4, 8, 10, 12]}
                labelRowsPerPage="Canjes por página:"
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

            {verCanje?.orden_compra?.observaciones !== "" && (
              <Grid item xs={12} mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Observaciones del proveedor
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje?.orden_compra?.observaciones}
                </Typography>
              </Grid>
            )}

            <Button
              sx={{
                color: "#fff",
                background: "#3ec972",
                fontSize: "0.75rem",
                padding: "6px 8px",
                margin: "0 10px",
              }}
              variant="contained"
              endIcon={<SendIcon />}
              disabled={
                procesandoEnviarOrdenAProveedor ||
                verCanje?.orden_compra?.estatus !== "cotizacion_validada_por_proveedor"
              }
              onClick={(e: any) => {
                const datos = {
                  id_orden_compra: verCanje?.orden_compra?.id,
                  id_proveedor: verProveedor.id,
                };
                enviarOrdenCompraProveedor(datos);
              }}
            >
              {procesandoEnviarOrdenAProveedor ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Enviando orden...{" "}
                </>
              ) : (
                intl.formatMessage({ id: "enviar_orden_de_compra" })
              )}
            </Button>
            <Button
              sx={{
                color: "#fff",
                background: "#e01032",
                fontSize: "0.75rem",
                padding: "6px 8px",
                margin: "0 10px",
              }}
              variant="contained"
              endIcon={<SendIcon />}
              disabled={
                procesandoRechazarCotizacion ||
                verCanje?.orden_compra?.estatus !== "cotizacion_validada_por_proveedor"
              }
              onClick={(e: any) => {
                const datos = {
                  id_orden_compra: verCanje?.orden_compra?.id,
                  id_proveedor: verProveedor.id,
                };
                rechazarCotizacionDeProveedor(datos);
              }}
            >
              {procesandoRechazarCotizacion ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Enviando orden...{" "}
                </>
              ) : (
                intl.formatMessage({ id: "rechazar_cotizacion_proveedor" })
              )}
            </Button>
            <Button
              sx={{
                color: "#fff",
                background: "#3ec972",
                fontSize: "0.75rem",
                padding: "6px 8px",
                margin: "0 10px",
              }}
              variant="contained"
              endIcon={<SendIcon />}
              disabled={
                procesandoEnviarProveedor || canjesPaginados.length === 0 || todosProductosValidados
              }
              onClick={(e: any) => {
                const datos = {
                  id_usuario: idUsuario,
                  id_proveedor: verProveedor.id,
                  productos: verCanje.productos.map((productos) => {
                    return {
                      id_canje: productos.id_canje,
                      id_producto: productos.id,
                      cantidad_producto: productos.number_of_awards,
                      cantidad_almacen: productos.number_of_awards,
                      estatus_almacen: 0,
                      estatus_proveedor: 0,
                      tipo_compra: "",
                    };
                  }),
                };
                //console.log(datos);
                enviarCotizacionProveedor(datos);
              }}
            >
              {procesandoEnviarProveedor ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Enviando...{" "}
                </>
              ) : (
                intl.formatMessage({ id: "enviar_a_proveedor" })
              )}
            </Button>
            <Button
              sx={{
                color: "#fff",
                background: "#084d6e",
                fontSize: "0.75rem",
                padding: "6px 8px",
                margin: "0 10px",
              }}
              variant="contained"
              endIcon={<PictureAsPdfIcon />}
              disabled={
                procesandoOrdenCompra || canjesPaginados.length === 0 || !todosProductosValidados
              }
              onClick={(e: any) => {
                //console.log(verCanje);
                handleOpenPDFViewer();
              }}
            >
              {procesandoOrdenCompra ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Generando orden de compra...{" "}
                </>
              ) : (
                intl.formatMessage({ id: "generar_orden_compra" })
              )}
            </Button>
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
      {/* Visor de PDF */}
      <PDFViewerOrdenCompra
        open={isPDFViewerOpen}
        onClose={handleClosePDFViewer}
        ordenCompra={verCanje}
      />
    </Box>
  );
};
export default CanjeValidadoProveedorModal;

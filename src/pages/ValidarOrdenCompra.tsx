import { useMemo, useRef, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "components/Header";
import MDBox from "components/MDBox";
import {
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
  Paper,
  Backdrop,
  CircularProgress,
  Chip,
  Stack,
  Tooltip,
  IconButton,
  TablePagination,
} from "@mui/material";
import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import logo from "assets/images/profile_icon.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { green, red } from "@mui/material/colors";
import ModalComponent from "components/Modal";
import GppBadIcon from "@mui/icons-material/GppBad";
import { numericFormatter } from "react-number-format";
import AddIcon from "@mui/icons-material/Add";
import HttpsIcon from "@mui/icons-material/Https";
import { Spinner } from "react-bootstrap";
import Forward10Icon from "@mui/icons-material/Forward10";
import { useValidarOrdenCompra } from "./customHooksPages/useValidarOrdenCompra";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SendIcon from "@mui/icons-material/Send";

function ValidarOrdenCompra(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    aceptarProductoOC,
    rechazarProductoOC,
    cargarOrdenCompraPorProveedor,
    verificado,
    showInput,
    setShowInput,
    codigoVerificacion,
    procesandoCodigo,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    ordenCompra,
    procesando,
    intl,
    navigate,
  } = useValidarOrdenCompra();

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

  const productosPaginados = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return ordenCompra?.productos.slice(startIndex, endIndex) || [];
  }, [ordenCompra, page, rowsPerPage]);

  const getEstadoColor = (estado_validacion: string) => {
    switch (estado_validacion?.toLowerCase()) {
      case "cotizacion_enviada_a_proveedor":
        return "warning";
      case "cotizacion_validada_a_proveedor":
        return "info";
      case "orden_compra_enviada_a_proveedor":
        return "warning";
      case "orden_validada_por_proveedor":
        return "success";
      default:
        return "default";
    }
  };

  const estadosOrdenCompraMap: { [key: string]: string } = {
    COTIZACION_ENVIADA_A_PROVEEDOR: "EN ESPERA DE VALIDACIÓN DE PRODUCTOS",
    COTIZACION_VALIDADA_A_PROVEEDOR: "ESPERANDO ORDEN DE COMPRA DE BRIMAGY",
    ORDEN_COMPRA_ENVIADA_A_PROVEEDOR: "EN ESPERA DE SUBIR FACTURA",
    ORDEN_VALIDADA_POR_PROVEEDOR: "ORDEN DE COMPRA VALIDADA",
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

  const traducirEstadoOrdenCompra = (estado: string | null): string => {
    if (!estado) return "SIN VALIDAR";
    const estadoUpper = estado.toUpperCase();
    return estadosOrdenCompraMap[estadoUpper] || estadoUpper;
  };

  return (
    <DashboardLayout withSidebar={false}>
      <MDBox py={0} mb={0}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                {ordenCompra ? (
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <VerifiedIcon sx={{ fontSize: 60, color: green[500], mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                      VALIDACIÓN DE ORDEN DE COMPRA
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hola <b style={{ color: "#A5EB2F" }}>{ordenCompra.nombre_contacto}</b>, a
                      continuación se muestran los detalles de tu orden de compra, por favor valide
                      qué productos tiene en inventario, envíe a través del botón de{" "}
                      <b>Enviar para validación</b> y espere la respuesta de Brimagy
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <GppBadIcon sx={{ fontSize: 80, color: red[500], mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                      Orden de compra no existente
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Por favor introduce un proveedor con una orden de compra registrada
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Información del Canje */}
                {ordenCompra && (
                  <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h5" color={"#eb2fa5"}>
                        Datos de mi orden de compra
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Typography variant="caption" color="text.secondary">
                          No. de orden
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {ordenCompra?.orden_compra?.no_orden}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Typography variant="caption" color="text.secondary">
                          Estado de validación
                        </Typography>
                        <Box>
                          <Chip
                            label={traducirEstadoOrdenCompra(
                              ordenCompra?.orden_compra?.estatus.toUpperCase()
                            )}
                            color={getEstadoColor(ordenCompra.estado_validacion)}
                            size="small"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h5" color={"#eb2fa5"}>
                            Mis datos
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        md={4}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Proveedor
                        </Typography>
                        <Typography variant="body2">{ordenCompra?.proveedor.nombre}</Typography>
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        md={4}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Razón social
                        </Typography>
                        <Typography variant="body2">
                          {ordenCompra?.proveedor.razon_social ?? "N/A"}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        md={4}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Nombre contacto
                        </Typography>
                        <Typography variant="body2">
                          {ordenCompra?.proveedor.nombre_contacto ?? "N/A"}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        md={4}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Teléfono
                        </Typography>
                        <Typography variant="body2">{ordenCompra?.proveedor.telefono}</Typography>
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        md={4}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Correo
                        </Typography>
                        <Typography variant="body2">{ordenCompra?.proveedor.correo}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h5" color={"#eb2fa5"}>
                            Datos de los productos
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      {productosPaginados.map((producto: any) => {
                        return (
                          <>
                            <Grid container spacing={2} key={producto.id}>
                              <Grid item xs={6} md={2}>
                                <Typography variant="body2" color="text.secondary">
                                  Producto
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {producto?.nombre_premio}
                                </Typography>
                              </Grid>

                              <Grid item xs={6} md={1}>
                                <Typography variant="body2" color="text.secondary">
                                  Cantidad
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {producto?.cantidad_producto}
                                </Typography>
                              </Grid>

                              <Grid item xs={6} md={2}>
                                <Typography variant="body2" color="text.secondary">
                                  Precio unitario
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {numericFormatter(producto?.precio_unitario.toString(), {
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
                                <Typography variant="body2" fontWeight="medium">
                                  {numericFormatter(producto?.porcentaje_descuento.toString(), {
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
                                <Typography variant="body2" fontWeight="medium">
                                  IVA (16%)
                                </Typography>
                              </Grid>

                              <Grid item xs={6} md={2}>
                                <Typography variant="body2" color="text.secondary">
                                  Importe
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {numericFormatter(producto?.importe_total.toString(), {
                                    thousandSeparator: ",",
                                    decimalScale: 2,
                                    fixedDecimalScale: true,
                                    prefix: "$",
                                  })}
                                </Typography>
                              </Grid>

                              <Grid item xs={6} md={1}>
                                <Typography variant="body2" color="text.secondary">
                                  Acciones
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  <Tooltip title={intl.formatMessage({ id: "validar_producto" })}>
                                    <IconButton
                                      onClick={() => aceptarProductoOC(producto?.id_canje)}
                                      sx={{ color: "#13e9bf", padding: "0" }}
                                    >
                                      <CheckIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={intl.formatMessage({ id: "rechazar_producto" })}>
                                    <IconButton
                                      onClick={() => rechazarProductoOC(producto?.id_canje)}
                                      sx={{ color: "#f64e52", padding: "0" }}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Typography>
                              </Grid>

                              <Grid item xs={6} md={2}>
                                <Typography variant="body2" color="text.secondary">
                                  Estatus del producto
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {renderEstatusChip(producto?.estatus_proveedor)}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Divider sx={{ mb: 2 }} />
                          </>
                        );
                      })}
                      {/* Componente de paginación */}
                    </Grid>
                    <MDBox
                      mt={0}
                      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <TablePagination
                        component="div"
                        count={ordenCompra?.productos.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[4, 8, 10, 12]}
                        labelRowsPerPage="Productos por página:"
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
                    <MDBox
                      mt={0}
                      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
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
                        disabled={procesando}
                        onClick={(e: any) => {
                          /*const datos = {
                            id_usuario: idUsuario,
                            id_proveedor: verProveedor.id,
                            canjes: verCanje.map((canje) => {
                              return {
                                id_canje: canje.id,
                                cantidad_producto: canje.number_of_awards,
                                cantidad_almacen: canje.number_of_awards,
                                estatus_almacen: 0,
                                estatus_proveedor: 0,
                                tipo_compra: "",
                              };
                            }),
                          };

                          enviarCotizacionProveedor(datos);*/
                        }}
                      >
                        {procesando ? (
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
                        disabled={procesando}
                        onClick={(e: any) => {}}
                      >
                        {procesando ? (
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
                    </MDBox>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <ModalComponent handleClose={handleisAlerClose} isOpen={isAlertOpen} key={"alerta"}>
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <br />
            <p>{mensajeAlert}</p>
          </Grid>
        </Grid>
      </ModalComponent>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={procesando}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </DashboardLayout>
  );
}

export default ValidarOrdenCompra;

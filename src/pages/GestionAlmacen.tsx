/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useMemo, useState } from "react";

// formik components
import { Formik, Form } from "formik";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import logo from "assets/images/profile_icon.png";
import Footer from "examples/Footer";

import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import {
  Backdrop,
  Box,
  Button,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ModalComponent from "components/Modal";
import Header from "components/Header";
import MDTypography from "components/MDTypography";
import TablePagination from "@mui/material/TablePagination";
import { green } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";
import Badge, { BadgeProps } from "@mui/material/Badge";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CanjeValidadoProveedorModal from "components/DetallesVistas/CanjeValidadoProveedor";
import OCPorIdProveedorModal from "components/DetallesVistas/VerOCPorIdProveedor";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { Spinner } from "react-bootstrap";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ProductoNuevoProveedorModal from "components/DetallesVistas/ProductoNuevoProveedor";
import { useGestionAlmacen } from "./customHooksPages/useGestionAlmacen";
import ProductoAlmacenModal from "components/DetallesVistas/ProductoAlmacen";
import { MuiFileInput } from "mui-file-input";
import CloseIcon from "@mui/icons-material/Close";
import MDButton from "components/MDButton";
import ReceiptIcon from "@mui/icons-material/Receipt";
import env from "react-dotenv";

import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function GestionAlmacen(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const {
    enviarEncuesta,
    addFechaPagoFactura,
    enviarProductoAlmacen,
    confirmarRecepcionProductoAlmacen,
    procesandoEnvioProducto,
    procesandoGuiaProducto,
    procesandoRecepcionProducto,
    setGuiaProducto,
    guiaProducto,
    isAlertOpenGuia,
    handleisAlertOpenGuia,
    handleisAlertCloseGuia,
    addGuiaProductoAlmacen,
    isAlertOpenCantidad,
    handleisAlertOpenCantidad,
    handleisAlertCloseCantidad,
    handleCantidadChange,
    cantidadMaximaPermitida,
    setCantidadProducto,
    cantidadProducto,
    procesandoRecibirProducto,
    addProductoAlmacen,
    getProductoAlmacenPorId,
    productos,
    verProducto,
    isAlertOpenVerProducto,
    handleisAlertCloseVerProducto,
    handleisAlertOpenVerProducto,
    handleBuscadorChange,
    buscador,
    setBuscador,
    navigate,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    setProcesando,
    procesandoEditar,
    tableKey,
    //evidencias
    subirEvidencias,
    isModalVistaEvidencia,
    evidenciaSeleccionada,
    handleOpenVistaEvidencia,
    handleCloseVistaEvidencia,
    procesandoEvidencias,
    setProcesandoEvidencias,
    evidenciasFiles,
    setEvidenciasFiles,
    handleOpenEvidencia,
    handleCloseEvidencia,
    isModalEvidencia,
    //facturas
    isModalVistaFactura,
    setIsModalVistaFactura,
    handleOpenVistaFactura,
    handleCloseVistaFactura,
    facturaSeleccionada,
    setFacturaSeleccionada,
    //fecha de pago de la factura
    procesandoFechaPagoFactura,
    isAlertOpenFechaPagoFactura,
    handleisAlertOpenFechaPagoFactura,
    handleisAlertCloseFechaPagoFactura,
    setFechaPagoFactura,
    fechaPagoFactura,
    //encuestas
    procesandoEnviarEncuesta,
    isAlertOpenEnviarEncuesta,
    handleisAlertOpenEnviarEncuesta,
    handleisAlertCloseEnviarEncuesta,
    setDatosEncuestaEnviar,
    datosEncuestaEnviar,
    encuestas,
    setTipoEncuesta,
    tipoEncuesta,
  } = useGestionAlmacen(tipoUsuario);

  const handleChangeEvidencias = (newFiles: File[] | null) => {
    setEvidenciasFiles(newFiles || []);
  };

  const independiente = () => {
    return !productos?.length && !procesando ? (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h3>Sin registros</h3>
        </Grid>
      </Grid>
    ) : null;
  };
  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 2,
      top: 7,
      background: `#eb2fa5`,
      padding: "0 4px",
      fontSize: "10px",
    },
  }));
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

  const estadosValidacionMap: { [key: string]: string } = {
    NOTIFICACION_ENVIADA: "EN ESPERA DE VALIDACIÓN DE IDENTIDAD",
    SOLICITUD_ENVIADA: "SOLICITUD DE CÓDIGO ENVIADA",
    IDENTIDAD_VALIDADA: "IDENTIDAD VALIDADA",
  };

  const tipoEncuestaMap: { [key: string]: string } = {
    SATISFACCION_COMPRA: "SATISFACCIÓN DE COMPRA",
    SATISFACCION_PLATAFORMA: "SATISFACCIÓN DE PLATAFORMA",
  };
  const traducirTipoEncuesta = (tipo_encuesta: string | null): string => {
    if (!tipo_encuesta) return "ENCUESTA NORMAL";
    const estadoUpper = tipo_encuesta.toUpperCase();
    return tipoEncuestaMap[estadoUpper] || estadoUpper;
  };

  const traducirEstadoValidacion = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosValidacionMap[estadoUpper] || estadoUpper;
  };

  const productosPaginados = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return productos?.slice(startIndex, endIndex) || [];
  }, [productos, page, rowsPerPage]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <MDBox py={3} mb={20}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={8}></Grid>
          <Grid
            item
            xs={4}
            sm={4}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <TextField
              id="buscador"
              fullWidth
              label={intl.formatMessage({ id: "input_buscador" })}
              variant="standard"
              name="buscador"
              value={buscador || ""}
              onChange={handleBuscadorChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="medium" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        {productos?.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {productosPaginados.map((p: any, key: number) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={p.id || key}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden",
                        transition: "all 0.3s",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      {/* Fila superior*/}
                      <Box
                        sx={{
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "row",
                          bgcolor: "#a5eb2f",
                          p: 1,
                          borderBottom: `2px solid #02999e`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1,
                          }}
                        >
                          <Inventory2Icon
                            sx={{
                              color: "#eb2fa5",
                              fontSize: 48,
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            overflow: "hidden",
                          }}
                        >
                          <MDTypography
                            variant="caption"
                            color="text"
                            sx={{
                              paddingLeft: "10px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontWeight: 600,
                              color: green[900],
                            }}
                          >
                            {p.marca}
                          </MDTypography>
                        </Box>
                      </Box>

                      {/* Fila inferior - Iconos a la izquierda, Info a la derecha */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          flex: 1,
                          overflow: "hidden",
                        }}
                      >
                        {/* Columna izquierda - Iconos de acción */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            p: 1.5,
                            bgcolor: "grey.50",
                            borderRight: "1px solid",
                            borderColor: "grey.200",
                          }}
                        >
                          <Tooltip title="Ver Producto">
                            <StyledBadge badgeContent={p.cantidad_almacen} color="secondary">
                              <IconButton
                                aria-label="ver"
                                size="small"
                                color="default"
                                onClick={() => {
                                  const datos = {
                                    id_producto_almacen: p.id,
                                  };
                                  getProductoAlmacenPorId(datos);
                                  handleisAlertOpenVerProducto();
                                }}
                              >
                                <VisibilityIcon fontSize="medium" />
                              </IconButton>
                            </StyledBadge>
                          </Tooltip>
                          {p.tiene_factura && (
                            <Tooltip title="Ver factura">
                              <StyledBadge badgeContent={0} color="secondary">
                                <IconButton
                                  aria-label="ver"
                                  size="small"
                                  color="default"
                                  onClick={() => {
                                    const datos = {
                                      id_producto_almacen: p.id,
                                    };
                                    const factura = {
                                      url_factura: p.url_factura,
                                      nombre_factura: p.nombre_factura,
                                    };
                                    getProductoAlmacenPorId(datos);
                                    handleOpenVistaFactura(factura);
                                  }}
                                >
                                  <ReceiptIcon fontSize="medium" />
                                </IconButton>
                              </StyledBadge>
                            </Tooltip>
                          )}
                        </Box>

                        {/* Columna derecha - Información */}
                        <CardContent
                          sx={{
                            flex: 1,
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                          }}
                        >
                          <Tooltip title={p.nombre_producto}>
                            <Typography
                              variant="button"
                              gutterBottom
                              noWrap
                              sx={{ fontWeight: 600 }}
                            >
                              {p.nombre_producto}
                            </Typography>
                          </Tooltip>
                          <Box sx={{ mt: "auto" }}>
                            <MDTypography variant="caption" display="block" color="text" noWrap>
                              <strong>Proveedor:</strong> {p.nombre_proveedor ?? "N/A"}
                            </MDTypography>
                            <MDTypography variant="caption" display="block" color="text" noWrap>
                              <strong>Sku:</strong> {p.sku ?? "N/A"}
                            </MDTypography>
                          </Box>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Componente de paginación */}
            <MDBox mt={3} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TablePagination
                component="div"
                count={productos.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[3, 6, 9, 12]}
                labelRowsPerPage="Proveedores por página:"
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
          </>
        ) : !procesando ? (
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <h3>{intl.formatMessage({ id: "sin_canjes_validados_registrados" })}</h3>
            </Grid>
          </Grid>
        ) : null}
      </MDBox>
      <Footer />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={procesando}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* VISUALIZAR DATOS DE LA ORDEN DE COMPRA */}
      <ModalComponent
        esFullScreen
        handleClose={handleisAlertCloseVerProducto}
        isOpen={isAlertOpenVerProducto}
        key={"alertaVerProducto"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verProducto ? (
            <>
              <ProductoAlmacenModal
                enviarProductoAlmacen={enviarProductoAlmacen}
                confirmarRecepcionProductoAlmacen={confirmarRecepcionProductoAlmacen}
                handleisAlertOpenGuia={handleisAlertOpenGuia}
                handleisAlertOpenCantidad={handleisAlertOpenCantidad}
                handleOpenVistaEvidencia={handleOpenVistaEvidencia}
                procesandoRecibirProducto={procesandoRecibirProducto}
                procesandoEnvioProducto={procesandoEnvioProducto}
                procesandoRecepcionProducto={procesandoRecepcionProducto}
                procesandoGuiaProducto={procesandoGuiaProducto}
                addProductoAlmacen={addProductoAlmacen}
                verProducto={verProducto}
                handleOpenEvidencia={handleOpenEvidencia}
                handleisAlertOpenEnviarEncuesta={handleisAlertOpenEnviarEncuesta}
                setDatosEncuestaEnviar={setDatosEncuestaEnviar}
              />
            </>
          ) : null}
        </Grid>
      </ModalComponent>
      <ModalComponent handleClose={handleisAlerClose} isOpen={isAlertOpen} key={"alerta"}>
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <br />
            <p>{mensajeAlert}</p>
          </Grid>
        </Grid>
      </ModalComponent>
      <ModalComponent
        handleClose={handleisAlertCloseCantidad}
        isOpen={isAlertOpenCantidad}
        key={"alertaCantidad"}
      >
        {verProducto ? (
          <Grid container spacing={2} style={{ textAlign: "center" }}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                ¿Cuántos productos está recibiendo?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cantidad total: {verProducto.cantidad_producto || 0} | Ya recibida:{" "}
                {verProducto.cantidad_almacen || 0} | Pendiente: {cantidadMaximaPermitida}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                id="cantidadProducto"
                fullWidth
                label={`${intl.formatMessage({ id: "input_cantidad_producto" })} *`}
                variant="standard"
                name="cantidadProducto"
                type="number"
                value={cantidadProducto || ""}
                onChange={handleCantidadChange}
                inputProps={{
                  min: 1,
                  max: cantidadMaximaPermitida,
                  step: 1,
                }}
                helperText={`Máximo: ${cantidadMaximaPermitida} unidades`}
                error={
                  cantidadProducto !== "" &&
                  (parseInt(cantidadProducto) > cantidadMaximaPermitida ||
                    parseInt(cantidadProducto) < 1)
                }
              />
            </Grid>
            <Grid item xs={6} sm={6} display="flex" alignContent="center" justifyContent="center">
              <Button
                sx={{ color: "#fff", background: "#084d6e" }}
                variant="contained"
                endIcon={<AddCircleIcon />}
                disabled={
                  procesandoRecibirProducto ||
                  !cantidadProducto ||
                  parseInt(cantidadProducto) < 1 ||
                  parseInt(cantidadProducto) > cantidadMaximaPermitida ||
                  cantidadMaximaPermitida === 0
                }
                onClick={(e: any) => {
                  const datos = {
                    id_producto_almacen: verProducto?.id_producto_almacen,
                    cantidad_producto: parseInt(cantidadProducto),
                  };
                  addProductoAlmacen(datos);
                }}
              >
                {procesandoRecibirProducto ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    {intl.formatMessage({ id: "general_añadiendo" })}...{" "}
                  </>
                ) : (
                  intl.formatMessage({ id: "set_añadir_producto_almacen" })
                )}
              </Button>
            </Grid>
          </Grid>
        ) : null}
      </ModalComponent>
      <ModalComponent
        handleClose={handleisAlertCloseGuia}
        isOpen={isAlertOpenGuia}
        key={"alertaGuia"}
      >
        {verProducto ? (
          <Grid container spacing={2} style={{ textAlign: "center" }}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Añadir guía de envío
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                id="guiaProducto"
                fullWidth
                label={`${intl.formatMessage({ id: "input_guia_producto" })} *`}
                variant="standard"
                name="guiaProducto"
                value={guiaProducto || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setGuiaProducto(value);
                }}
              />
            </Grid>
            <Grid item xs={6} sm={6} display="flex" alignContent="center" justifyContent="center">
              <Button
                sx={{ color: "#fff", background: "#084d6e" }}
                variant="contained"
                endIcon={<AddCircleIcon />}
                disabled={procesandoGuiaProducto}
                onClick={(e: any) => {
                  const datos = {
                    id_producto_almacen: verProducto?.id_producto_almacen,
                    guia_producto: guiaProducto,
                  };
                  addGuiaProductoAlmacen(datos);
                }}
              >
                {procesandoGuiaProducto ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    {intl.formatMessage({ id: "general_añadiendo" })}...{" "}
                  </>
                ) : (
                  intl.formatMessage({ id: "set_añadir_guia_producto_almacen" })
                )}
              </Button>
            </Grid>
          </Grid>
        ) : null}
      </ModalComponent>
      {/* MODAL PARA EVIDENCIAS */}
      <ModalComponent
        handleClose={handleCloseEvidencia}
        isOpen={isModalEvidencia}
        key="vista-evidencia"
      >
        {verProducto ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="center" alignItems="center" m={2}>
                <MDTypography variant="h5">
                  Añadir evidencia de {verProducto?.nombre_producto}
                </MDTypography>
              </MDBox>
            </Grid>

            <Grid item xs={12} sm={8}>
              <MuiFileInput
                value={evidenciasFiles}
                onChange={handleChangeEvidencias}
                label="Selecciona evidencias"
                placeholder="Selecciona las evidencias a subir"
                inputProps={{
                  accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
                  multiple: true,
                }}
                multiple
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                sx={{
                  color: "#000",
                  background: "#8ded42",
                  "&:hover": {
                    color: "#000",
                    background: "#62b324",
                  },
                }}
                disabled={evidenciasFiles.length === 0 || procesandoEvidencias}
                onClick={(e: any) => {
                  const formData = new FormData();
                  formData.append("id_producto_almacen", verProducto?.id_producto_almacen);
                  evidenciasFiles.forEach((file) => {
                    formData.append("evidencias[]", file);
                  });

                  subirEvidencias(formData);
                  setEvidenciasFiles([]);
                }}
              >
                {procesandoEvidencias ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Añadiendo...{" "}
                  </>
                ) : (
                  intl.formatMessage({ id: "set_general_evidencia" })
                )}
              </Button>
            </Grid>
          </Grid>
        ) : null}
      </ModalComponent>
      {/* MODAL PARA VER EVIDENCIA INDIVIDUAL */}
      <ModalComponent
        handleClose={handleCloseVistaEvidencia}
        isOpen={isModalVistaEvidencia}
        key="vista-evidencia-individual"
      >
        {evidenciaSeleccionada ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MDTypography variant="h5">{evidenciaSeleccionada.nombre_original}</MDTypography>
                <IconButton onClick={handleCloseVistaEvidencia} size="small">
                  <CloseIcon />
                </IconButton>
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <img
                  src={evidenciaSeleccionada.url}
                  alt={evidenciaSeleccionada.nombre_original}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="flex-end" gap={2}>
                <MDButton variant="outlined" color="secondary" onClick={handleCloseVistaEvidencia}>
                  Cerrar
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="info"
                  component="a"
                  href={evidenciaSeleccionada.url}
                  download={evidenciaSeleccionada.nombre_original}
                  target="_blank"
                >
                  Descargar
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        ) : null}
      </ModalComponent>
      {/* MODAL PARA VER FACTURA */}
      <ModalComponent
        handleClose={handleCloseVistaFactura}
        isOpen={isModalVistaFactura}
        key="vista-evidencia-individual"
      >
        {facturaSeleccionada ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MDTypography variant="h5">{facturaSeleccionada.nombre_factura}</MDTypography>
                <IconButton onClick={handleCloseVistaFactura} size="small">
                  <CloseIcon />
                </IconButton>
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <iframe
                  src={`${env.API_URL_ASSETS}${facturaSeleccionada.url_factura}`}
                  style={{
                    width: "100%",
                    height: "70vh",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  title="Vista de evidencia PDF"
                />
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="flex-end" gap={2}>
                <MDButton variant="outlined" color="secondary" onClick={handleCloseVistaFactura}>
                  Cerrar
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="info"
                  component="a"
                  href={`${env.API_URL_ASSETS}${facturaSeleccionada.url_factura}`}
                  download={facturaSeleccionada.nombre_factura}
                  target="_blank"
                >
                  Descargar
                </MDButton>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={handleisAlertOpenFechaPagoFactura}
                >
                  Programar pago
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        ) : null}
      </ModalComponent>
      {/* MODAL PARA AÑADIR FECHA DE PAGO A LA FACTURA */}
      <ModalComponent
        handleClose={handleisAlertCloseFechaPagoFactura}
        isOpen={isAlertOpenFechaPagoFactura}
        key={"alertaFechaPagoFactura"}
      >
        {verProducto ? (
          <Grid container spacing={2} style={{ textAlign: "center" }}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Añadir fecha de pago de la factura
              </Typography>
              {verProducto?.fecha_pago && (
                <Typography variant="caption" color="text.secondary">
                  Fecha de pago programada: {verProducto?.fecha_pago}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                  label={intl.formatMessage({ id: "input_fecha_pago" })}
                  openTo="year"
                  format="YYYY/MM/DD"
                  views={["year", "month", "day"]}
                  value={fechaPagoFactura ? dayjs(fechaPagoFactura) : null}
                  onChange={(newValue) => {
                    setFechaPagoFactura(newValue ? dayjs(newValue).format("YYYY-MM-DD") : "");
                  }}
                  slotProps={{
                    textField: {
                      error: false,
                      variant: "standard",
                    },
                  }}
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6} sm={6} display="flex" alignContent="center" justifyContent="center">
              <Button
                sx={{ color: "#fff", background: "#084d6e" }}
                variant="contained"
                endIcon={<AddCircleIcon />}
                disabled={procesandoFechaPagoFactura}
                onClick={(e: any) => {
                  const datos = {
                    id_orden_compra: verProducto?.id_orden_compra,
                    fecha_pago: fechaPagoFactura,
                  };
                  addFechaPagoFactura(datos);
                }}
              >
                {procesandoFechaPagoFactura ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    {intl.formatMessage({ id: "general_añadiendo" })}...{" "}
                  </>
                ) : (
                  intl.formatMessage({ id: "set_añadir_fecha_pago_factura" })
                )}
              </Button>
            </Grid>
          </Grid>
        ) : null}
      </ModalComponent>
      {/* MODAL PARA ENVIAR ENCUESTA AL USUARIO */}
      <ModalComponent
        handleClose={handleisAlertCloseEnviarEncuesta}
        isOpen={isAlertOpenEnviarEncuesta}
        key={"alertaEnviarEncuesta"}
      >
        {datosEncuestaEnviar ? (
          <Grid container spacing={2} style={{ textAlign: "center" }}>
            <Grid item xs={12} mt={1}>
              <Typography variant="h6" color="primary" gutterBottom>
                ¿Qué tipo de encuesta desea enviar?
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                id="tipo_encuesta"
                select
                fullWidth
                label={`${intl.formatMessage({ id: "select_tipo_encuesta" })} *`}
                variant="standard"
                name="tipo_encuesta"
                value={tipoEncuesta || ""}
                disabled={procesando}
                onChange={(e) => {
                  const value = e.target.value;
                  setTipoEncuesta(value);
                }}
                InputProps={{
                  style: { padding: "5px" },
                }}
              >
                {encuestas?.map((option) => (
                  <MenuItem key={option.id} value={option.tipo_encuesta}>
                    {traducirTipoEncuesta(option.tipo_encuesta)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={6} display="flex" alignContent="center" justifyContent="center">
              <Button
                sx={{ color: "#fff", background: "#084d6e" }}
                variant="contained"
                endIcon={<AddCircleIcon />}
                disabled={procesandoEnviarEncuesta}
                onClick={(e: any) => {
                  const datos = {
                    id_canje: datosEncuestaEnviar?.id_canje,
                    tipo_encuesta: tipoEncuesta,
                  };
                  //console.log(datos);
                  enviarEncuesta(datos);
                }}
              >
                {procesandoEnviarEncuesta ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    {intl.formatMessage({ id: "general_enviando" })}...{" "}
                  </>
                ) : (
                  intl.formatMessage({ id: "set_enviar_encuesta" })
                )}
              </Button>
            </Grid>
          </Grid>
        ) : null}
      </ModalComponent>
    </DashboardLayout>
  );
}

export default GestionAlmacen;

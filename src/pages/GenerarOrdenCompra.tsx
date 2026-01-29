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
import { useGenerarOrdenCompra } from "./customHooksPages/useGenerarOrdenCompra";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CanjeValidadoProveedorModal from "components/DetallesVistas/CanjeValidadoProveedor";
import OCPorIdProveedorModal from "components/DetallesVistas/VerOCPorIdProveedor";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { Spinner } from "react-bootstrap";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ProductoNuevoProveedorModal from "components/DetallesVistas/ProductoNuevoProveedor";

function GenerarOrdenCompra(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const {
    enviarANuevoProveedor,
    setOrdenCompraActiva,
    ordenCompraActiva,
    setProveedorSeleccionado,
    proveedorSeleccionado,
    getProductoNuevoProveedor,
    setProductoNuevoProveedor,
    productoNuevoProveedor,
    rechazarCotizacionDeProveedor,
    procesandoRechazarCotizacion,
    procesandoNuevoProveedor,
    setProveedorNuevo,
    proveedorNuevo,
    proveedoresSelect,
    isAlertOpenOtroProveedor,
    handleisAlertCloseOtroProveedor,
    handleisAlertOpenOtroProveedor,
    procesandoEnviarOrdenAProveedor,
    enviarOrdenCompraProveedor,
    getOCPorId,
    ordenesCompra,
    isAlertOpenVerOC,
    handleisAlertOpenVerOC,
    handleisAlertCloseVerOC,
    conOC,
    getOCPorIdProveedor,
    enviarCotizacionProveedor,
    procesandoEnviarProveedor,
    procesandoOrdenCompra,
    verProveedor,
    setVerProveedor,
    getCanjesPorProveedor,
    verCanje,
    setVerCanje,
    isAlertOpenVerCanje,
    handleisAlertCloseVerCanje,
    handleisAlertOpenVerCanje,
    isSuperAdmin,
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
    setCanjeId,
    canjeId,
    procesandoEditar,
    tableKey,
    proveedores,
    isPDFViewerOpen,
    handleClosePDFViewer,
    handleOpenPDFViewer,
    procesandoIdentidad,
  } = useGenerarOrdenCompra(tipoUsuario);

  const independiente = () => {
    return !proveedores?.length && !procesando ? (
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

  const traducirEstadoValidacion = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosValidacionMap[estadoUpper] || estadoUpper;
  };

  const proveedoresPaginados = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return proveedores?.slice(startIndex, endIndex) || [];
  }, [proveedores, page, rowsPerPage]);

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
        {proveedores?.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {proveedoresPaginados.map((p: any, key: number) => {
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
                            {p.razon_social}
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
                          <Tooltip title="Crear orden compra">
                            <StyledBadge badgeContent={p.total_canjes} color="secondary">
                              <IconButton
                                aria-label="ver"
                                size="small"
                                color="default"
                                onClick={() => {
                                  setVerProveedor(p);
                                  getCanjesPorProveedor(p.id);
                                  handleisAlertOpenVerCanje();
                                }}
                              >
                                <LibraryAddIcon fontSize="medium" />
                              </IconButton>
                            </StyledBadge>
                          </Tooltip>
                          <Tooltip title="Ver ordenes de Compra">
                            <StyledBadge badgeContent={p.total_ordenes_compra} color="secondary">
                              <IconButton
                                aria-label="ver"
                                size="small"
                                color="default"
                                onClick={() => {
                                  setVerProveedor(p);
                                  getOCPorIdProveedor(p.id);
                                  handleisAlertOpenVerOC();
                                }}
                              >
                                <VisibilityIcon fontSize="medium" />
                              </IconButton>
                            </StyledBadge>
                          </Tooltip>
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
                          <Tooltip title={p.nombre}>
                            <Typography
                              variant="button"
                              gutterBottom
                              noWrap
                              sx={{ fontWeight: 600 }}
                            >
                              {p.nombre}
                            </Typography>
                          </Tooltip>
                          <Box sx={{ mt: "auto" }}>
                            <MDTypography variant="caption" display="block" color="text" noWrap>
                              <strong>Canjes pendientes de cotizar:</strong>{" "}
                              {p.total_canjes ?? "N/A"}
                            </MDTypography>
                            <MDTypography variant="caption" display="block" color="text" noWrap>
                              <strong>Ordenes de compra generadas:</strong>{" "}
                              {p.total_ordenes_compra ?? "N/A"}
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
                count={proveedores.length}
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
      {/* VISUALIZAR DE ORDENES DE COMPRA */}
      <ModalComponent
        esFullScreen
        handleClose={handleisAlertCloseVerOC}
        isOpen={isAlertOpenVerOC}
        key={"alertaVerOC"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {ordenesCompra ? (
            <>
              <OCPorIdProveedorModal
                handleisAlertOpenVerCanje={handleisAlertOpenVerCanje}
                verOrdenesCompra={ordenesCompra}
                verProveedor={verProveedor}
                isPDFViewerOpen={isPDFViewerOpen}
                handleClosePDFViewer={handleClosePDFViewer}
                handleOpenPDFViewer={handleOpenPDFViewer}
                procesandoIdentidad={procesandoIdentidad}
                procesandoEnviarProveedor={procesandoEnviarProveedor}
                procesandoOrdenCompra={procesandoOrdenCompra}
                enviarCotizacionProveedor={enviarCotizacionProveedor}
                getOCPorId={getOCPorId}
              />
            </>
          ) : null}
        </Grid>
      </ModalComponent>
      {/* VISUALIZAR DATOS DE LA ORDEN DE COMPRA */}
      <ModalComponent
        esFullScreen
        handleClose={handleisAlertCloseVerCanje}
        isOpen={isAlertOpenVerCanje}
        key={"alertaVerDatos"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verCanje ? (
            <>
              <CanjeValidadoProveedorModal
                verCanje={verCanje}
                verProveedor={verProveedor}
                isPDFViewerOpen={isPDFViewerOpen}
                handleClosePDFViewer={handleClosePDFViewer}
                handleOpenPDFViewer={handleOpenPDFViewer}
                procesandoIdentidad={procesandoIdentidad}
                procesandoEnviarProveedor={procesandoEnviarProveedor}
                procesandoOrdenCompra={procesandoOrdenCompra}
                enviarCotizacionProveedor={enviarCotizacionProveedor}
                enviarOrdenCompraProveedor={enviarOrdenCompraProveedor}
                procesandoEnviarOrdenAProveedor={procesandoEnviarOrdenAProveedor}
                handleisAlertOpenOtroProveedor={handleisAlertOpenOtroProveedor}
                procesandoRechazarCotizacion={procesandoRechazarCotizacion}
                rechazarCotizacionDeProveedor={rechazarCotizacionDeProveedor}
                getProductoNuevoProveedor={getProductoNuevoProveedor}
                setOrdenCompraActiva={setOrdenCompraActiva}
              />
            </>
          ) : null}
        </Grid>
      </ModalComponent>
      <ModalComponent
        handleClose={handleisAlertCloseOtroProveedor}
        isOpen={isAlertOpenOtroProveedor}
        key={"alertaOtroProveedor"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12} sm={12} display="flex" alignContent="center" justifyContent="center">
            {productoNuevoProveedor ? (
              <>
                <ProductoNuevoProveedorModal
                  enviarANuevoProveedor={enviarANuevoProveedor}
                  ordenCompraActiva={ordenCompraActiva}
                  setProveedorSeleccionado={setProveedorSeleccionado}
                  proveedorSeleccionado={proveedorSeleccionado}
                  verProducto={productoNuevoProveedor}
                  procesandoNuevoProveedor={procesandoNuevoProveedor}
                />
              </>
            ) : null}
          </Grid>
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
    </DashboardLayout>
  );
}

export default GenerarOrdenCompra;

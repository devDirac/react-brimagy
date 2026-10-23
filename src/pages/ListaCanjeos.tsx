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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import ModalComponent from "components/Modal";
import Header from "components/Header";
import MDTypography from "components/MDTypography";
import TablePagination from "@mui/material/TablePagination";
import { green, pink } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { numericFormatter } from "react-number-format";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useListaCanjeos } from "./customHooksPages/useListaCanjeos";
import TagIcon from "@mui/icons-material/Tag";
import DetallesCanjeModal from "components/DetallesVistas/DetalleCanje";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import DinamicTableMejorada from "components/DinamicTable/DinamicTable";
import DateRangeIcon from "@mui/icons-material/DateRange";
import {
  IconHourglassHigh,
  IconMailCheck,
  IconShieldCheck,
  IconProgressCheck,
  IconHelpCircle,
} from "@tabler/icons-react";

import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ProductosCanje } from "components/DetallesVistas/ProductosCanje";

function ListaCanjeos(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const {
    validarIdentidad,
    validarIdentidadSinProveedor,
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
    canjes,
    isPDFViewerOpen,
    handleClosePDFViewer,
    handleOpenPDFViewer,
    procesandoIdentidad,
    visualizacion,
    handleVisualizacion,
    handleAccion,
    //busqueda por fechas
    isAlertOpenFechas,
    handleisAlertCloseFechas,
    handleisAlertOpenFechas,
    fecha1,
    setFecha1,
    fecha2,
    setFecha2,
    getCanjes,
    plataforma,
    procesandoIdentidadDirecto,
    canjesAgrupados,
  } = useListaCanjeos(tipoUsuario);

  const iconProps = { size: 18, stroke: 2 };

  const independiente = () => {
    return !canjes?.length && !procesando ? (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h3>Sin registros</h3>
        </Grid>
      </Grid>
    ) : null;
  };
  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 0,
      top: 5,
      padding: "0",
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

  const estadosValidacionConfig: {
    [key: string]: { label: string; bg: string; color: string; icon: JSX.Element };
  } = {
    NOTIFICACION_ENVIADA: {
      label: "ENVIADO A USUARIO",
      bg: "#f5a623",
      color: "#ffffff",
      icon: <IconHourglassHigh {...iconProps} />,
    },
    SOLICITUD_ENVIADA: {
      label: "SOLICITUD DE CÓDIGO ENVIADA",
      bg: "#084d6e",
      color: "#ffffff",
      icon: <IconMailCheck {...iconProps} />,
    },
    IDENTIDAD_VALIDADA: {
      label: "IDENTIDAD VALIDADA",
      bg: "#3ec972",
      color: "#ffffff",
      icon: <IconShieldCheck {...iconProps} />,
    },
    VALIDACION_PARCIAL: {
      label: "VALIDACIÓN PARCIAL",
      bg: "#eb2fa5",
      color: "#FFF9C4",
      icon: <IconProgressCheck {...iconProps} />,
    },
  };

  const estadoDefault = {
    label: "SIN VALIDAR",
    bg: "#9e9e9e",
    color: "#ffffff",
    icon: <IconHelpCircle {...iconProps} />,
  };

  const getEstadoValidacion = (estado?: string | null) =>
    (estado && estadosValidacionConfig[estado.toUpperCase()]) || {
      ...estadoDefault,
      label: estado ? estado.toUpperCase() : estadoDefault.label,
    };

  const canjesPaginados = useMemo(() => {
    const inicio = page * rowsPerPage;
    return canjesAgrupados.slice(inicio, inicio + rowsPerPage);
  }, [canjesAgrupados, page, rowsPerPage]);

  const formatearFecha = (fecha?: string) =>
    fecha ? dayjs(fecha).locale("es").format("DD MMM YYYY, HH:mm") : "Sin fecha";

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <MDBox py={3} mb={20}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={8}>
            <ToggleButtonGroup
              value={visualizacion}
              exclusive
              onChange={handleVisualizacion}
              aria-label="Visualización de productos"
              sx={{ margin: "0 10px" }}
            >
              <Tooltip title="Cuadricula">
                <ToggleButton value="cuadricula" aria-label="cuadricula">
                  <ViewModuleIcon />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Tabla">
                <ToggleButton value="tabla" aria-label="tabla">
                  <TableRowsIcon />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Buscar por fecha">
                <IconButton
                  aria-label="ver"
                  size="small"
                  color="default"
                  onClick={() => {
                    handleisAlertOpenFechas();
                  }}
                  sx={{
                    border: "1px solid #0000001f",
                    borderRadius: 0,
                    "&:hover": {
                      background: "#a5eb2f",
                      color: "#2f2f2f",
                    },
                  }}
                >
                  <DateRangeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {visualizacion === "cuadricula" && (
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
            )}
          </Grid>
        </Grid>
        {canjesPaginados?.length > 0 && visualizacion === "cuadricula" ? (
          <>
            <Grid container spacing={2}>
              {canjesPaginados
                .map((p: any, key: number) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={key}>
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
                        {(() => {
                          const estado = getEstadoValidacion(p.estado_validacion);
                          return (
                            <Chip
                              icon={estado.icon}
                              label={estado.label}
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                flexDirection: "row",
                                p: 1,
                                fontWeight: 500,
                                borderRadius: "0 0 0 20px",
                                background: estado.bg,
                                maxWidth: "150px",
                                height: "auto",
                                whiteSpace: "normal",
                                fontSize: "11px !important",
                                "& .MuiChip-label": {
                                  whiteSpace: "normal",
                                  overflow: "visible",
                                  textOverflow: "clip",
                                  display: "block",
                                  lineHeight: "12px",
                                  color: `${estado.color} !important`,
                                },
                                "& .MuiChip-icon": {
                                  color: `${estado.color} !important`,
                                  fontSize: "18px !important",
                                  width: "20px !important",
                                  height: "20px !important",
                                  marginTop: "2px",
                                  alignSelf: "flex-start",
                                },
                              }}
                            />
                          );
                        })()}
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
                            <TagIcon
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
                              flexDirection: "column",
                              justifyContent: "center",
                              overflow: "hidden",
                              paddingLeft: "10px",
                            }}
                          >
                            <MDTypography
                              variant="caption"
                              color="text"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontWeight: 600,
                                color: green[900],
                              }}
                            >
                              {p.folio}
                            </MDTypography>
                            <MDTypography variant="caption" sx={{ color: green[900], fontSize: "0.7rem" }}>
                              {formatearFecha(p.creacion_canje ?? p.productos?.[0]?.creacion_canje)}
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
                            <Tooltip title="Vista Previa">
                              <IconButton
                                aria-label="ver"
                                size="small"
                                color="default"
                                onClick={() => {
                                  setVerCanje(p);
                                  console.log(verCanje);
                                  handleisAlertOpenVerCanje();
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
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
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                              {p.productos.length} producto(s) · {numericFormatter(String(p.total_puntos), { thousandSeparator: "," })} pts
                            </Typography>
                            <ProductosCanje productos={p.productos} porPagina={3} />
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
                count={canjesAgrupados?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[3, 6, 9, 12]}
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
          </>
        ) : visualizacion === "tabla" && canjes?.length > 0 ? (
          <>
            <DinamicTableMejorada
              actions
              key={tableKey}
              //sinBusqueda
              //sinExport
              esListaCanjes
              //showCheckBox
              data={canjesAgrupados}
              enAccion={(accion, row) => {
                handleAccion(accion, row);
              }}
              columnsOrder={[
                "nombre_premio",
                "folio",
                "sku",
                "puntos_canjeados",
                "estado_validacion",
              ]}
            />
          </>
        ) : !procesando ? (
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <h3>{intl.formatMessage({ id: "sin_canjes_registrados" })}</h3>
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
      {/* VISUALIZAR DATOS DEL PRODUCTO */}
      <ModalComponent
        handleClose={handleisAlertCloseVerCanje}
        isOpen={isAlertOpenVerCanje}
        key={"alertaVerDatos"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verCanje ? (
            <>
              <DetallesCanjeModal
                verCanje={verCanje}
                isPDFViewerOpen={isPDFViewerOpen}
                handleClosePDFViewer={handleClosePDFViewer}
                handleOpenPDFViewer={handleOpenPDFViewer}
                validarIdentidad={validarIdentidad}
                validarIdentidadSinProveedor={validarIdentidadSinProveedor}
                procesandoIdentidad={procesandoIdentidad}
                procesandoIdentidadDirecto={procesandoIdentidadDirecto}
              />
            </>
          ) : null}
        </Grid>
      </ModalComponent>
      {/* BUSCAR PRODUCTOS POR FECHA */}
      <ModalComponent
        handleClose={handleisAlertCloseFechas}
        isOpen={isAlertOpenFechas}
        key={"alertaFechas"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <br />
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h5" gutterBottom noWrap sx={{ fontWeight: 600 }}>
                  BUSCAR CANJES POR FECHA
                </Typography>
              </Grid>

              <Grid item xs={4} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label={intl.formatMessage({ id: "input_fecha" })}
                    openTo="year"
                    format="YYYY/MM/DD"
                    views={["year", "month", "day"]}
                    value={fecha1 ? dayjs(fecha1) : null}
                    onChange={(newValue) => {
                      setFecha1(newValue ? dayjs(newValue).format("YYYY-MM-DD") : "");
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
              <Grid item xs={4} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label={intl.formatMessage({ id: "input_fecha" })}
                    openTo="year"
                    format="YYYY/MM/DD"
                    views={["year", "month", "day"]}
                    value={fecha2 ? dayjs(fecha2) : null}
                    onChange={(newValue) => {
                      setFecha2(newValue ? dayjs(newValue).format("YYYY-MM-DD") : "");
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
              <Grid item xs={4} md={4}>
                <Button
                  sx={{ color: "#fff", background: "#084d6e" }}
                  variant="contained"
                  endIcon={<SearchIcon />}
                  disabled={procesando}
                  onClick={(e: any) => {
                    const datos = {
                      fecha1: fecha1,
                      fecha2: fecha2,
                    };
                    getCanjes(datos);
                    handleisAlertCloseFechas();
                  }}
                >
                  {intl.formatMessage({ id: "buscar_por_fecha" })}
                </Button>
              </Grid>
            </Grid>
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

export default ListaCanjeos;

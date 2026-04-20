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

import { useMemo, useState, useRef } from "react";

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
  Popover,
  MenuItem,
  Paper,
  Radio,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import ModalComponent from "components/Modal";
import Header from "components/Header";
import MDTypography from "components/MDTypography";
import TablePagination from "@mui/material/TablePagination";
import { grey, pink } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Spinner } from "react-bootstrap";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { numericFormatter } from "react-number-format";
import { useListaProductos } from "./customHooksPages/useListaProductos";
import DinamicTableMejorada from "components/DinamicTable/DinamicTable";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import DateRangeIcon from "@mui/icons-material/DateRange";
import HistoryIcon from "@mui/icons-material/History";

import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import HardwareIcon from "@mui/icons-material/Hardware";
import ComputerIcon from "@mui/icons-material/Computer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DetallesProductoModal from "components/DetallesVistas/Producto";

import { HexColorPicker } from "react-colorful";
import ColoresProductoModal from "components/DetallesVistas/ColoresProducto";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CloseIcon from "@mui/icons-material/Close";
import TallasProductoModal from "components/DetallesVistas/TallasProducto";
import FotosProductoModal from "components/DetallesVistas/FotosProducto";
import { MuiFileInput } from "mui-file-input";
import env from "react-dotenv";
import MDButton from "components/MDButton";
import FotosPromoProductoModal from "components/DetallesVistas/FotosPromoProducto";

function TabPanel({
  children,
  value,
  current,
}: {
  children: React.ReactNode;
  value: string;
  current: string;
}) {
  return value === current ? <Box sx={{ p: 2 }}>{children}</Box> : null;
}

function ListaProductos(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const {
    busquedaInteligenteBrimagy,
    verProducto,
    setVerProducto,
    isAlertOpenVerDatos,
    handleisAlertCloseVerDatos,
    handleisAlertOpenVerDatos,
    isSuperAdmin,
    handleBuscadorChange,
    buscador,
    setBuscador,
    navigate,
    productosSeleccionados,
    setProductosSeleccionados,
    asignarPdfDatos,
    isAlertOpenAsignar,
    handleisAlerCloseAsignar,
    handleisAlertOpenAsignar,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    setProcesando,
    setProductoId,
    productoId,
    eliminarProducto,
    openModalConfirmEliminaProducto,
    setOpenModalConfirmEliminaProducto,
    handleisAlertOpenEliminaProducto,
    categorias,
    proveedores,
    nombreProductoEditar,
    setNombreProductoEditar,
    descripcionEditar,
    setDescripcionEditar,
    marcaEditar,
    setMarcaEditar,
    skuEditar,
    setSkuEditar,
    colorEditar,
    setColorEditar,
    tallaEditar,
    setTallaEditar,
    idProveedorEditar,
    setIdProveedorEditar,
    idCatalogoEditar,
    setIdCatalogoEditar,
    costoConIvaEditar,
    setCostoConIvaEditar,
    costoSinIvaEditar,
    setCostoSinIvaEditar,
    costoPuntosConIvaEditar,
    setCostoPuntosConIvaEditar,
    costoPuntosSinIvaEditar,
    setCostoPuntosSinIvaEditar,
    feeBrimagyEditar,
    setFeeBrimagyEditar,
    subtotalEditar,
    setSubtotalEditar,
    envioBaseEditar,
    setEnvioBaseEditar,
    costoCajaEditar,
    setCostoCajaEditar,
    envioExtraEditar,
    setEnvioExtraEditar,
    totalEnvioEditar,
    setTotalEnvioEditar,
    totalEditar,
    setTotalEditar,
    puntosEditar,
    setPuntosEditar,
    factorEditar,
    setFactorEditar,
    procesandoEditar,
    tableKey,
    productoEditar,
    setProductoEditar,
    handleisAlertOpenEditarProducto,
    handleisAlerCloseEditarProducto,
    isAlertOpenEditarProducto,
    productos,
    editaProducto,
    //excel
    excelData,
    isAlertOpenSubirExcel,
    handleisAlerCloseSubirExcel,
    handleFileUpload,
    guardarProductosExcel,
    procesandoExcel,
    descargarPlantillaExcel,
    descargarProductosExcel,
    //Búsqueda intelimagy
    isAlertOpenBI,
    handleisAlertOpenBI,
    handleisAlertCloseBI,
    buscarPorPuntos,
    setBuscarPorPuntos,
    categoriaBuscar,
    setCategoriaBuscar,
    procesandoBusquedaMagica,
    //insertar proveedores y categorias automaticamente
    procesandoRegistroFaltantes,
    registrarProveedoresYCategoriasFaltantes,
    obtenerCategoriasFaltantes,
    obtenerProveedoresFaltantes,
    obtenerPlataformasFaltantes,
    hayProductosValidos,
    hayFaltantes,
    //filtros personalizados
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
    getProductosCatalogo,
    //ver bitacora del producto
    verBitacoraProducto,
    setVerBitacoraProducto,
    isAlertOpenVerBitacoraProducto,
    handleisAlertOpenVerBitacoraProducto,
    handleisAlertCloseVerBitacoraProducto,
    getBitacoraProductoPorId,
    //color picker
    colorNameToHex,
    esColorValido,
    anchorEl,
    setAnchorEl,
    colorHex,
    //edicion con brimagy
    valueTab,
    setValueTab,
    handleChangeTab,
    //colores
    crearEditarColorProducto,
    getProductoColorPorId,
    formikColor,
    colores,
    setVerEditarColor,
    verEditarColor,
    isAlertOpenEditarColor,
    handleisAlertOpenEditarColor,
    handleisAlertCloseEditarColor,
    procesandoColor,
    setEditaColor,
    editaColor,
    desactivarColorProducto,
    activarColorProducto,
    //tallas
    crearEditarTallaProducto,
    getProductoTallaPorId,
    formikTalla,
    tallas,
    setVerEditarTalla,
    verEditarTalla,
    isAlertOpenEditarTalla,
    handleisAlertOpenEditarTalla,
    handleisAlertCloseEditarTalla,
    procesandoTalla,
    setEditaTalla,
    editaTalla,
    desactivarTallaProducto,
    activarTallaProducto,
    //fotos del producto
    procesandoFotosProducto,
    fotosProductoFiles,
    setFotosProductoFiles,
    isModalFotosProducto,
    handleOpenFotosProducto,
    handleCloseFotosProducto,
    isModalVistaFotosProducto,
    fotosProductoSeleccionada,
    handleOpenVistaFotosProducto,
    handleCloseVistaFotosProducto,
    subirFotosProducto,
    getProductoFotoPorId,
    fotos,
    desactivarFotosProducto,
    activarFotosProducto,
    //fotos promo
    procesandoFotosPromoProducto,
    fotosPromoProductoFiles,
    setFotosPromoProductoFiles,
    isModalFotosPromoProducto,
    handleOpenFotosPromoProducto,
    handleCloseFotosPromoProducto,
    isModalVistaFotosPromoProducto,
    fotosPromoProductoSeleccionada,
    handleOpenVistaFotosPromoProducto,
    handleCloseVistaFotosPromoProducto,
    subirFotosPromoProducto,
    getProductoFotoPromoPorId,
    fotosPromo,
    desactivarFotosPromoProducto,
    activarFotosPromoProducto,
    //foto principal del producto
    fotoProductoPrincipalFile,
    setFotoProductoPrincipalFile,
    previewFoto,
    setPreviewFoto,
    handleChangeFotoProductoPrincipal,
    fotoEditar,
  } = useListaProductos(tipoUsuario);

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

  // Calcular las pólizas a mostrar en la página actual
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
          <Grid
            item
            xs={9}
            sx={{
              display: { xs: "flex" },
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "center" },
              gap: { xs: 1 },
            }}
          >
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{
                background: "#084d6e",
                color: "#fff",
              }}
            >
              Subir Excel
              <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
            </Button>
            <Button
              variant="outlined"
              startIcon={<SimCardDownloadIcon />}
              onClick={productos?.length > 0 ? descargarProductosExcel : descargarPlantillaExcel}
              sx={{
                borderColor: "#084d6e",
                color: "#084d6e",
              }}
            >
              {productos?.length > 0
                ? intl.formatMessage({ id: "descargar_productos" })
                : intl.formatMessage({ id: "descargar_plantilla" })}
            </Button>

            <Button
              variant="contained"
              component="label"
              startIcon={<AutoAwesomeIcon />}
              endIcon={<AutoAwesomeIcon />}
              sx={{
                background: "#a5eb2f",
                color: "#2f2f2f",
                "&:hover": {
                  background: "#2f2f2f",
                  color: "#fff",
                },
                "&:focus:not(:hover)": {
                  background: "#a5eb2f",
                },
              }}
              onClick={() => {
                handleisAlertOpenBI();
              }}
            >
              Búsqueda Intelimagy
            </Button>

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
            xs={12}
            sm={3}
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
        {productos?.length > 0 && visualizacion === "cuadricula" ? (
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
                      <Chip
                        icon={p.tipo_producto === "fisico" ? <HardwareIcon /> : <ComputerIcon />}
                        label={p.tipo_producto?.toUpperCase()}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          flexDirection: "row",
                          bgcolor: pink[50],
                          p: 1,
                          fontWeight: 500,
                          borderRadius: "0 0 0 20px",
                          background: "#eb2fa5",
                          maxWidth: "150px",
                          height: "auto",
                          whiteSpace: "normal",
                          "& .MuiChip-label": {
                            whiteSpace: "normal",
                            overflow: "visible",
                            textOverflow: "clip",
                            display: "block",
                            lineHeight: "12px",
                            color: "#FFF9C4 !important",
                          },
                          "& .MuiChip-icon": {
                            color: "#FFF9C4 !important",
                            fontSize: "20px !important",
                            width: "20px !important",
                            height: "20px !important",
                            marginTop: "2px",
                            alignSelf: "flex-start",
                          },
                        }}
                      />
                      {/* Fila superior*/}
                      <Box
                        sx={{
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "row",
                          bgcolor: "#a5eb2f",
                          p: 1,
                          borderBottom: `2px solid #eb2fa5`,
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
                          <InventoryIcon
                            sx={{
                              color: "#eb2fa5",
                              fontSize: 48,
                            }}
                            fontSize="small"
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
                            variant="button"
                            color="text"
                            sx={{
                              fontSize: "14px",
                              paddingLeft: "5px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontWeight: 600,
                              color: "#121f09",
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
                          <Tooltip title="Vista Previa">
                            <IconButton
                              aria-label="ver"
                              size="small"
                              color="default"
                              onClick={() => {
                                setVerProducto(p);
                                handleisAlertOpenVerDatos();
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Historial de cambios">
                            <IconButton
                              aria-label="ver"
                              size="small"
                              color="info"
                              onClick={() => {
                                const datos = {
                                  id_producto: p?.id,
                                };
                                setVerProducto(p);
                                getBitacoraProductoPorId(datos);
                                handleisAlertOpenVerBitacoraProducto();
                              }}
                            >
                              <HistoryIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {isSuperAdmin ? (
                            <Tooltip title="Editar producto">
                              <IconButton
                                aria-label="editar"
                                size="small"
                                color="warning"
                                onClick={() => {
                                  const datos = {
                                    id_producto: p?.id,
                                  };
                                  setProductoEditar(p);
                                  getProductoColorPorId(datos);
                                  getProductoTallaPorId(datos);
                                  getProductoFotoPorId(datos);
                                  getProductoFotoPromoPorId(datos);
                                  handleisAlertOpenEditarProducto();
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null}

                          {isSuperAdmin ? (
                            <Tooltip title="Eliminar producto">
                              <IconButton
                                aria-label="eliminar"
                                size="small"
                                color="error"
                                onClick={() => {
                                  setProductoId(p?.id);
                                  handleisAlertOpenEliminaProducto();
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
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
                          <Typography variant="button" gutterBottom noWrap sx={{ fontWeight: 600 }}>
                            {p.nombre_producto}
                          </Typography>
                          <Typography variant="caption" gutterBottom sx={{ display: "block" }}>
                            {p.descripcion}
                          </Typography>

                          <MDTypography
                            variant="caption"
                            color="text"
                            sx={{
                              mb: 1.5,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {p.correo ?? ""}
                          </MDTypography>

                          <Box sx={{ mt: "auto" }}>
                            <MDTypography variant="caption" display="block" color="text" noWrap>
                              <strong>Sku:</strong> {p.sku ?? "N/A"}
                            </MDTypography>
                            <MDTypography variant="caption" display="block" color="text" noWrap>
                              <strong>Color:</strong> {p.color ?? "N/A"}
                            </MDTypography>
                            <MDTypography variant="caption" display="block" color="text" noWrap>
                              <strong>Categoría:</strong> {p.catalogo ?? "N/A"}
                            </MDTypography>
                            <MDTypography variant="caption" display="block" color="text" noWrap>
                              <strong>Proveedor:</strong> {p.proveedor ?? "N/A"}
                            </MDTypography>
                            {p.prima_asegurada && (
                              <MDTypography
                                variant="caption"
                                display="block"
                                sx={{ mt: 0.5, color: "primary.main", fontWeight: 600 }}
                              >
                                <strong>Prima:</strong>
                                {numericFormatter(String(p.prima_asegurada), {
                                  thousandSeparator: ",",
                                  decimalScale: 2,
                                  fixedDecimalScale: true,
                                  prefix: "$",
                                })}
                              </MDTypography>
                            )}
                          </Box>
                        </CardContent>
                      </Box>
                      <Box
                        sx={{
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          bgcolor: "#a5eb2f",
                          p: 0,
                          pt: 0,
                          gap: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            textAlign: "center",
                            overflow: "hidden",
                            //bgcolor: "#1b5b69",
                            p: 0,
                          }}
                        >
                          <Typography variant="button" gutterBottom noWrap sx={{ fontWeight: 600 }}>
                            {p.nombre_plataforma}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            borderLeft: "eb2fa5",
                            width: "100%",
                            textAlign: "center",
                            overflow: "hidden",
                            p: 0,
                          }}
                        >
                          <EmojiEventsIcon />{" "}
                          <Typography variant="button" gutterBottom noWrap sx={{ fontWeight: 600 }}>
                            {numericFormatter(p.puntos + "", {
                              thousandSeparator: ",",
                              decimalScale: 2,
                              fixedDecimalScale: false,
                              prefix: "",
                            })}
                          </Typography>
                        </Box>
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
          </>
        ) : visualizacion === "tabla" && productos?.length > 0 ? (
          <>
            <DinamicTableMejorada
              actions
              key={tableKey}
              //sinBusqueda
              //sinExport
              esListaProductos
              //showCheckBox
              data={productos}
              enAccion={(accion, row) => {
                handleAccion(accion, row);
              }}
              columnsOrder={[
                "nombre_producto",
                "descripcion",
                "marca",
                "sku",
                "color",
                "categoria",
                "proveedor",
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
              <h3>{intl.formatMessage({ id: "sin_productos_registrados" })}</h3>
            </Grid>
          </Grid>
        ) : null}
      </MDBox>
      <Footer />
      <Backdrop sx={(theme) => ({ color: "#fff", zIndex: 9999999 })} open={procesando}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ModalConfirm
        onAcept={() => {
          setOpenModalConfirmEliminaProducto(false);
          eliminarProducto(Number(productoId));
        }}
        onCancel={() => {
          setOpenModalConfirmEliminaProducto(false);
        }}
        open={openModalConfirmEliminaProducto}
        text={intl.formatMessage({
          id: "eliminar_producto_confirmar",
        })}
        title={""}
        cancelText="No"
        acceptText={intl.formatMessage({
          id: "si",
        })}
      />
      <ModalComponent
        handleClose={handleisAlerCloseEditarProducto}
        isOpen={isAlertOpenEditarProducto}
        key={"alertaEditarProducto"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {productoEditar ? (
            <>
              <Grid item xs={12} mt={2}>
                <h5>Editando producto: {productoEditar?.nombre_producto}</h5>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Box sx={{ width: "100%" }}>
                  <Tabs
                    value={valueTab}
                    onChange={handleChangeTab}
                    aria-label="wrapped label tabs example"
                  >
                    <Tab value="one" label="Valores" />
                    <Tab value="two" label="Colores" />
                    <Tab value="three" label="Tallas" />
                    <Tab value="four" label="Fotos" />
                    <Tab value="five" label="Fotos Ofertas" />
                  </Tabs>
                  <TabPanel value="one" current={valueTab}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={4}>
                        {previewFoto ||
                          (fotoEditar != "" && (
                            <Box mt={2} display="flex" justifyContent="center">
                              <img
                                src={previewFoto || fotoEditar}
                                alt="Vista previa"
                                style={{
                                  width: 200,
                                  height: 200,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                  border: "1px solid #ccc",
                                }}
                              />
                            </Box>
                          ))}
                      </Grid>
                      <Grid item xs={6} sm={4} sx={{ display: "flex", alignItems: "end" }}>
                        <MuiFileInput
                          value={fotoProductoPrincipalFile}
                          onChange={handleChangeFotoProductoPrincipal}
                          label="Selecciona la foto del producto"
                          placeholder="Selecciona la foto a subir"
                          inputProps={{
                            accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
                            multiple: false,
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} sx={{ display: "flex", alignItems: "end" }}>
                        <TextField
                          id="nombreEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_nombre" })}
                          variant="standard"
                          name="nombreEditar"
                          value={nombreProductoEditar || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNombreProductoEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="descripcionEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_descripcion" })}
                          variant="standard"
                          name="descripcionEditar"
                          value={descripcionEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setDescripcionEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="marcaEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_marca" })}
                          variant="standard"
                          name="marcaEditar"
                          value={marcaEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setMarcaEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="skuEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_sku" })}
                          variant="standard"
                          name="skuEditar"
                          value={skuEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSkuEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="id_proveedor"
                          select
                          fullWidth
                          label={`${intl.formatMessage({ id: "select_proveedores" })} *`}
                          variant="standard"
                          name="id_proveedor"
                          value={idProveedorEditar}
                          disabled={!proveedores || proveedores.length === 0}
                          helperText={
                            !proveedores || proveedores.length === 0
                              ? intl.formatMessage({ id: "sin_proveedores_registrados" })
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setIdProveedorEditar(value);
                          }}
                          InputProps={{
                            style: { padding: "5px" },
                          }}
                        >
                          {proveedores?.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nombre}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="id_categoria"
                          select
                          fullWidth
                          label={`${intl.formatMessage({ id: "select_categoria_producto" })} *`}
                          variant="standard"
                          name="id_categoria"
                          value={idCatalogoEditar}
                          disabled={!categorias || categorias.length === 0}
                          helperText={
                            !categorias || categorias.length === 0
                              ? intl.formatMessage({ id: "sin_categorias_registrados" })
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setIdCatalogoEditar(e.target.value);
                          }}
                          InputProps={{
                            style: { padding: "5px" },
                          }}
                        >
                          {categorias?.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.desc}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="costoConIvaEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_costo_con_iva" })}
                          variant="standard"
                          name="costoConIvaEditar"
                          type="number"
                          value={costoConIvaEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCostoConIvaEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="costoSinIvaEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_costo_sin_iva" })}
                          variant="standard"
                          name="costoSinIvaEditar"
                          type="number"
                          value={costoSinIvaEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCostoSinIvaEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="costoPuntosConIvaEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_costo_puntos_con_iva" })}
                          variant="standard"
                          name="costoPuntosConIvaEditar"
                          type="number"
                          value={costoPuntosConIvaEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCostoPuntosConIvaEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="costoPuntosSinIvaEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_costo_puntos_sin_iva" })}
                          variant="standard"
                          name="costoPuntosSinIvaEditar"
                          type="number"
                          value={costoPuntosSinIvaEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCostoPuntosSinIvaEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="feeBrimagyEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_fee_brimagy" })}
                          variant="standard"
                          name="feeBrimagyEditar"
                          type="number"
                          value={feeBrimagyEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFeeBrimagyEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="subtotalEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_subtotal" })}
                          variant="standard"
                          name="subtotalEditar"
                          type="number"
                          value={subtotalEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSubtotalEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="envioBaseEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_envio_base" })}
                          variant="standard"
                          name="envioBase"
                          type="number"
                          value={envioBaseEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEnvioBaseEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="costoCajaEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_costo_caja" })}
                          variant="standard"
                          name="costoCaja"
                          type="number"
                          value={costoCajaEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCostoCajaEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="envioExtraEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_envio_extra" })}
                          variant="standard"
                          name="envioExtra"
                          type="number"
                          value={envioExtraEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEnvioExtraEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="totalEnvioEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_total_envio" })}
                          variant="standard"
                          name="totalEnvio"
                          type="number"
                          value={totalEnvioEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setTotalEnvioEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="totalEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_total" })}
                          variant="standard"
                          name="total"
                          type="number"
                          value={totalEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setTotalEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="puntosEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_puntos" })}
                          variant="standard"
                          name="puntos"
                          type="number"
                          value={puntosEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPuntosEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          id="factorEditar"
                          fullWidth
                          label={intl.formatMessage({ id: "input_factor" })}
                          variant="standard"
                          name="factor"
                          type="number"
                          value={factorEditar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFactorEditar(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Button
                          sx={{ color: "#fff", background: "#084d6e" }}
                          variant="contained"
                          endIcon={<EditIcon />}
                          disabled={procesando}
                          onClick={(e: any) => {
                            const formData = new FormData();
                            formData.append("id_producto", productoEditar?.id);
                            formData.append("nombre_producto", nombreProductoEditar);
                            formData.append("descripcion", descripcionEditar);
                            formData.append("marca", marcaEditar);
                            formData.append("sku", skuEditar);
                            formData.append("color", colorEditar);
                            formData.append("talla", tallaEditar);
                            formData.append("id_proveedor", idProveedorEditar);
                            formData.append("id_catalogo", idCatalogoEditar);
                            formData.append("costo_con_iva", costoConIvaEditar);
                            formData.append("costo_sin_iva", costoSinIvaEditar);
                            formData.append("costo_puntos_con_iva", costoPuntosConIvaEditar);
                            formData.append("costo_puntos_sin_iva", costoPuntosSinIvaEditar);
                            formData.append("fee_brimagy", feeBrimagyEditar);
                            formData.append("subtotal", subtotalEditar);
                            formData.append("envio_base", envioBaseEditar);
                            formData.append("costo_caja", costoCajaEditar);
                            formData.append("envio_extra", envioExtraEditar);
                            formData.append("total_envio", totalEnvioEditar);
                            formData.append("total", totalEditar);
                            formData.append("puntos", puntosEditar);
                            formData.append("factor", factorEditar);
                            formData.append("tipo_registro", "edicion");
                            formData.append("nombre_plataforma", productoEditar?.nombre_plataforma);
                            formData.append(
                              "id_producto_brimagy",
                              productoEditar?.id_producto_brimagy
                            );

                            if (fotoProductoPrincipalFile) {
                              formData.append("foto_producto", fotoProductoPrincipalFile);
                            }

                            editaProducto(formData);
                          }}
                        >
                          {procesandoEditar ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              {intl.formatMessage({ id: "general_editando" })}...{" "}
                            </>
                          ) : (
                            intl.formatMessage({ id: "set_editar_producto" })
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </TabPanel>

                  <TabPanel value="two" current={valueTab}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <ColoresProductoModal
                          verColor={colores}
                          datosProducto={productoEditar}
                          procesandoColor={procesandoColor}
                          crearEditarColorProducto={crearEditarColorProducto}
                          setEditarColor={setVerEditarColor}
                          handleisAlertOpenEditarColor={handleisAlertOpenEditarColor}
                          desactivarColorProducto={desactivarColorProducto}
                          activarColorProducto={activarColorProducto}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>

                  <TabPanel value="three" current={valueTab}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TallasProductoModal
                          verTalla={tallas}
                          datosProducto={productoEditar}
                          procesandoTalla={procesandoTalla}
                          crearEditarTallaProducto={crearEditarTallaProducto}
                          setEditarTalla={setVerEditarTalla}
                          handleisAlertOpenEditarTalla={handleisAlertOpenEditarTalla}
                          desactivarTallaProducto={desactivarTallaProducto}
                          activarTallaProducto={activarTallaProducto}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="four" current={valueTab}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FotosProductoModal
                          verFotos={fotos}
                          datosProducto={productoEditar}
                          procesandoFotosProducto={procesandoFotosProducto}
                          subirFotosProducto={subirFotosProducto}
                          fotosProductoFiles={fotosProductoFiles}
                          setFotosProductoFiles={setFotosProductoFiles}
                          handleOpenVistaFotosProducto={handleOpenVistaFotosProducto}
                          desactivarFotosProducto={desactivarFotosProducto}
                          activarFotosProducto={activarFotosProducto}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="five" current={valueTab}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FotosPromoProductoModal
                          verFotosPromo={fotosPromo}
                          datosProducto={productoEditar}
                          procesandoFotosPromoProducto={procesandoFotosPromoProducto}
                          subirFotosPromoProducto={subirFotosPromoProducto}
                          fotosPromoProductoFiles={fotosPromoProductoFiles}
                          setFotosPromoProductoFiles={setFotosPromoProductoFiles}
                          handleOpenVistaFotosPromoProducto={handleOpenVistaFotosPromoProducto}
                          desactivarFotosPromoProducto={desactivarFotosPromoProducto}
                          activarFotosPromoProducto={activarFotosPromoProducto}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                </Box>
              </Grid>
            </>
          ) : null}
        </Grid>
      </ModalComponent>
      {/* MODAL PARA EDITAR EL COLOR */}
      <ModalComponent
        handleClose={handleisAlertCloseEditarColor}
        isOpen={isAlertOpenEditarColor}
        key={"alertaEditarColor"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verEditarColor && (
            <>
              <Grid item xs={12} mt={2}>
                <h5>Editando color</h5>
              </Grid>
              <Grid item xs={6} sm={4} sx={{ position: "relative" }}>
                <TextField
                  id="editaColor"
                  fullWidth
                  label={intl.formatMessage({ id: "input_color" })}
                  variant="standard"
                  name="editaColor"
                  value={editaColor}
                  onChange={(e) => setEditaColor(e.target.value)}
                  onClick={(e) => setAnchorEl((prev: any) => (prev ? null : e.currentTarget))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "4px",
                            backgroundColor: esColorValido(editaColor) ? editaColor : "transparent",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                {Boolean(anchorEl) && (
                  <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 99999,
                        mt: 1,
                        p: 2,
                        backgroundColor: "#ffffff !important",
                        opacity: 1,
                        borderRadius: 2,
                        boxShadow: 6,
                        display: "inline-block",
                      }}
                    >
                      <HexColorPicker color={colorHex} onChange={(hex) => setEditaColor(hex)} />
                      <Box
                        sx={{
                          mt: 1,
                          textAlign: "center",
                          fontSize: 12,
                          color: "text.secondary",
                        }}
                      >
                        {colorHex}
                      </Box>
                      <Button
                        variant="contained"
                        component="label"
                        endIcon={<CloseIcon />}
                        onClick={() => setAnchorEl(null)}
                        sx={{
                          background: "#084d6e",
                          color: "#fff",
                        }}
                      >
                        Cerrar
                      </Button>
                    </Box>
                  </ClickAwayListener>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  sx={{ color: "#fff", background: "#084d6e" }}
                  variant="contained"
                  endIcon={<EditIcon />}
                  disabled={procesando}
                  onClick={(e: any) => {
                    const datos = {
                      id_producto_dirac: productoEditar?.id,
                      id_color_brimagy: verEditarColor?.id_color_brimagy,
                      id_color: verEditarColor?.id,
                      color: editaColor,
                    };
                    crearEditarColorProducto(datos);
                  }}
                >
                  {procesandoColor ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      {intl.formatMessage({ id: "general_editando" })}...{" "}
                    </>
                  ) : (
                    intl.formatMessage({ id: "set_editar_color" })
                  )}
                </Button>
              </Grid>
            </>
          )}
        </Grid>
        <br />
        <br />
        <br />
      </ModalComponent>
      {/* MODAL PARA VER FOTO DE PRODUCTO INDIVIDUAL */}
      <ModalComponent
        handleClose={handleCloseVistaFotosProducto}
        isOpen={isModalVistaFotosProducto}
        key="vista-foto-individual"
      >
        {fotosProductoSeleccionada ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MDTypography variant="h5">
                  {fotosProductoSeleccionada.nombre_original}
                </MDTypography>
                <IconButton onClick={handleCloseVistaFotosProducto} size="small">
                  <CloseIcon />
                </IconButton>
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <img
                  src={`${env.API_URL_ASSETS}${fotosProductoSeleccionada.url_foto}`}
                  alt={fotosProductoSeleccionada.nombre_original}
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
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseVistaFotosProducto}
                >
                  Cerrar
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="info"
                  component="a"
                  href={`${env.API_URL_ASSETS}${fotosProductoSeleccionada.url_foto}`}
                  download={fotosProductoSeleccionada.nombre_original}
                  target="_blank"
                >
                  Descargar
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        ) : null}
      </ModalComponent>
      {/* MODAL PARA VER FOTO DE PRODUCTO INDIVIDUAL (QUITAR Y UNIFICAR)*/}
      <ModalComponent
        handleClose={handleCloseVistaFotosPromoProducto}
        isOpen={isModalVistaFotosPromoProducto}
        key="vista-foto-promo-individual"
      >
        {fotosPromoProductoSeleccionada ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MDTypography variant="h5">
                  {fotosPromoProductoSeleccionada.nombre_original}
                </MDTypography>
                <IconButton onClick={handleCloseVistaFotosPromoProducto} size="small">
                  <CloseIcon />
                </IconButton>
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <img
                  src={`${env.API_URL_ASSETS}${fotosPromoProductoSeleccionada.url_foto}`}
                  alt={fotosPromoProductoSeleccionada.nombre_original}
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
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseVistaFotosPromoProducto}
                >
                  Cerrar
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="info"
                  component="a"
                  href={`${env.API_URL_ASSETS}${fotosPromoProductoSeleccionada.url_foto}`}
                  download={fotosPromoProductoSeleccionada.nombre_original}
                  target="_blank"
                >
                  Descargar
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        ) : null}
      </ModalComponent>
      {/* MODAL PARA EDITAR LA TALLA */}
      <ModalComponent
        handleClose={handleisAlertCloseEditarTalla}
        isOpen={isAlertOpenEditarTalla}
        key={"alertaEditarTalla"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verEditarTalla && (
            <>
              <Grid item xs={12} mt={2}>
                <h5>Editando talla</h5>
              </Grid>
              <Grid item xs={6} sm={4} sx={{ position: "relative" }}>
                <TextField
                  id="editaTalla"
                  fullWidth
                  label={intl.formatMessage({ id: "input_talla" })}
                  variant="standard"
                  name="editaTalla"
                  value={editaTalla}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditaTalla(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  sx={{ color: "#fff", background: "#084d6e" }}
                  variant="contained"
                  endIcon={<EditIcon />}
                  disabled={procesando}
                  onClick={(e: any) => {
                    const datos = {
                      id_producto_dirac: productoEditar?.id,
                      id_talla_brimagy: verEditarTalla?.id_talla_brimagy,
                      id_talla: verEditarTalla?.id,
                      talla: editaTalla,
                    };
                    crearEditarTallaProducto(datos);
                  }}
                >
                  {procesandoTalla ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      {intl.formatMessage({ id: "general_editando" })}...{" "}
                    </>
                  ) : (
                    intl.formatMessage({ id: "set_editar_talla" })
                  )}
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </ModalComponent>
      {/* Modal para visualizar datos del Excel */}
      <ModalComponent
        handleClose={handleisAlerCloseSubirExcel}
        isOpen={isAlertOpenSubirExcel}
        key={"alertaSubirExcel"}
        esFullScreen
      >
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ textAlign: "center" }} mt={2}>
            <h5>Vista previa de productos del Excel</h5>
            <p>Total de productos: {excelData.length}</p>
          </Grid>

          {/* Resumen de validación */}
          {excelData && excelData.length > 0 && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, bgcolor: "#e8f5e9", borderRadius: 1 }}>
                    <Typography variant="h6" color="success.main">
                      ✓ Productos válidos:{" "}
                      {
                        excelData.filter(
                          (p) => p?.proveedor_valido && p?.categoria_valida && !p?.sku_vacio
                        ).length
                      }
                      <br />✓ Sin SKU: {excelData.filter((p) => p?.sku_vacio).length}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, bgcolor: "#ffebee", borderRadius: 1 }}>
                    <Typography variant="h6" color="error.main">
                      ✗ Productos inválidos:{" "}
                      {excelData.filter((p) => !p?.proveedor_valido || !p?.categoria_valida).length}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Sección de Proveedores faltantes */}
          {obtenerProveedoresFaltantes().length > 0 && (
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: "#fff3e0", borderRadius: 1, border: "2px solid #ff9800" }}>
                <Typography variant="h6" fontWeight="bold" color="warning.main" gutterBottom>
                  ⚠️ Proveedores no encontrados ({obtenerProveedoresFaltantes().length}):
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {obtenerProveedoresFaltantes().join(", ")}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Sección de Categorías faltantes */}
          {obtenerCategoriasFaltantes().length > 0 && (
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: "#fff3e0", borderRadius: 1, border: "2px solid #ff9800" }}>
                <Typography variant="h6" fontWeight="bold" color="warning.main" gutterBottom>
                  ⚠️ Categorías no encontradas ({obtenerCategoriasFaltantes().length}):
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {obtenerCategoriasFaltantes().join(", ")}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Sección de Plataformas faltantes */}
          {obtenerPlataformasFaltantes().length > 0 && (
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: "#fff3e0", borderRadius: 1, border: "2px solid #ff9800" }}>
                <Typography variant="h6" fontWeight="bold" color="warning.main" gutterBottom>
                  ⚠️ Plataformas no encontradas ({obtenerPlataformasFaltantes().length}):
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {obtenerPlataformasFaltantes().join(", ")}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Botón para registrar faltantes */}
          {hayFaltantes() && (
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<SaveIcon />}
                onClick={registrarProveedoresYCategoriasFaltantes}
                disabled={procesandoRegistroFaltantes || procesandoExcel}
                sx={{
                  background: "#ff9800",
                  color: "#fff",
                  "&:hover": {
                    background: "#f57c00",
                  },
                }}
              >
                {procesandoRegistroFaltantes ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Registrando proveedores y categorías...
                  </>
                ) : (
                  `Registrar ${obtenerProveedoresFaltantes().length} proveedor(es) | ${
                    obtenerCategoriasFaltantes().length
                  } Categoría(s) faltantes  | ${
                    obtenerPlataformasFaltantes().length
                  } Plataforma(s) faltantes`
                )}
              </Button>
            </Grid>
          )}

          <Grid item xs={12} style={{ maxHeight: "500px", overflow: "auto" }} mt={2}>
            {excelData.length > 0 ? (
              <DinamicTableMejorada
                esListaProductosExcel
                sinExport
                key={tableKey}
                data={excelData.map((p) => ({
                  ...p,
                  costo_con_iva: numericFormatter(p.costo_con_iva + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: true,
                    prefix: "$",
                  }),
                  costo_sin_iva: numericFormatter(p.costo_sin_iva + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: true,
                    prefix: "$",
                  }),
                  total: numericFormatter(p.total + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: true,
                    prefix: "$",
                  }),
                  producto_status: p.id_producto_brimagy_vacio
                    ? "⚠️ PRODUCTO NUEVO"
                    : p.id_producto_brimagy_duplicado
                    ? "🔄 " + p.id_producto_brimagy + " (Existente)"
                    : p.id_producto_brimagy,
                  plataforma_status: p.plataforma_valida
                    ? "✓ " + p.plataforma
                    : "✗ " + p.plataforma,
                  //proveedor_status: p.proveedor_valido ? "✓ " + p.proveedor : "✗ " + p.proveedor,
                  proveedor_status: p.proveedor_vacio
                    ? "⚠️ Sin proveedor"
                    : p.proveedor_valido
                    ? "✓ " + p.proveedor
                    : "✗ " + p.proveedor,
                  catalogo_status: p.categoria_valida ? "✓ " + p.catalogo : "✗ " + p.catalogo,
                  sku_status: p.sku_vacio
                    ? "⚠️ SKU VACÍO"
                    : p.sku_duplicado
                    ? "🔄 " + p.sku + " (Existente)"
                    : p.sku,
                }))}
                columnsToShow={[
                  "nombre_producto",
                  "descripcion",
                  "marca",
                  "sku_status",
                  "color",
                  "talla",
                  "producto_status",
                  "plataforma_status",
                  "proveedor_status",
                  "catalogo_status",
                  "costo_con_iva",
                  "costo_sin_iva",
                  "total",
                ]}
              />
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </Grid>

          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={guardarProductosExcel}
              disabled={
                procesandoExcel ||
                procesandoRegistroFaltantes ||
                !excelData ||
                excelData.length === 0 ||
                !hayProductosValidos()
              }
              sx={{ background: "#084d6e", color: "#fff", mr: 2 }}
            >
              {procesandoExcel ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Guardando productos...
                </>
              ) : (
                `Guardar ${
                  excelData?.filter(
                    (p) =>
                      p?.sku_vacio || (p?.proveedor_valido && p?.categoria_valida && !p?.sku_vacio)
                  ).length || 0
                } productos válidos`
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={handleisAlerCloseSubirExcel}
              sx={{ color: "#084d6e" }}
              disabled={procesandoExcel}
            >
              Cancelar
            </Button>
          </Grid>
          {/* Mensaje informativo si no hay productos válidos */}
          {!hayProductosValidos() && excelData.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 1, textAlign: "center" }}>
                <Typography variant="body1" color="info.main">
                  ℹ️{" "}
                  {hayFaltantes()
                    ? "Registra primero los proveedores, categorías o plataformas faltantes para habilitar el guardado de productos."
                    : "No hay productos válidos para guardar. Verifica los datos del Excel."}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </ModalComponent>
      {/* VISUALIZAR DATOS DEL PRODUCTO */}
      <ModalComponent
        handleClose={handleisAlertCloseVerDatos}
        isOpen={isAlertOpenVerDatos}
        key={"alertaVerDatos"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verProducto ? (
            <>
              <DetallesProductoModal verProducto={verProducto} />
            </>
          ) : null}
        </Grid>
      </ModalComponent>
      <ModalComponent handleClose={handleisAlertCloseBI} isOpen={isAlertOpenBI} key={"alertaBI"}>
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12} m={2}>
            <Typography variant="button" gutterBottom sx={{ fontSize: "18px", fontWeight: 600 }}>
              Búsqueda inteli<b style={{ color: "#a5eb2f" }}>magy</b>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="buscarPorPuntos"
              fullWidth
              label={`${intl.formatMessage({ id: "input_buscar_por_puntos" })}`}
              variant="standard"
              name="buscarPorPuntos"
              value={buscarPorPuntos || ""}
              onChange={(e) => {
                const value = e.target.value;
                setBuscarPorPuntos(value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="medium" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="categoriaBuscar"
              select
              fullWidth
              label={`${intl.formatMessage({ id: "select_categoria_producto" })} *`}
              variant="standard"
              name="categoriaBuscar"
              value={categoriaBuscar || ""}
              disabled={!categorias || categorias.length === 0}
              helperText={
                !categorias || categorias.length === 0
                  ? intl.formatMessage({ id: "sin_categorias_registradas" })
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value;
                setCategoriaBuscar(value);
              }}
              InputProps={{
                style: { padding: "5px" },
              }}
            >
              <MenuItem value="">{intl.formatMessage({ id: "seleccionar_categoria" })}</MenuItem>
              {categorias?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.desc}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4} display="flex" alignContent="center" justifyContent="center">
            <Button
              variant="contained"
              endIcon={<AutoFixHighIcon />}
              disabled={procesandoBusquedaMagica}
              onClick={(e: any) => {
                const datos = {
                  puntos: buscarPorPuntos,
                  categoria: categoriaBuscar,
                };
                busquedaInteligenteBrimagy(datos);
              }}
              sx={{
                background: "#a5eb2f",
                color: "#2f2f2f",
                ml: 2,
                "&:hover": {
                  background: "#2f2f2f",
                  color: "#fff",
                },
                "&:focus:not(:hover)": {
                  background: "#a5eb2f",
                },
              }}
            >
              {procesandoBusquedaMagica ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {intl.formatMessage({ id: "realizando_busqueda" })}...{" "}
                </>
              ) : (
                intl.formatMessage({ id: "realizar_busqueda_magica" })
              )}
            </Button>
          </Grid>
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
                  BUSCAR PRODUCTO POR FECHA
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
                  endIcon={<EditIcon />}
                  disabled={procesando}
                  onClick={(e: any) => {
                    const datos = {
                      fecha1: fecha1,
                      fecha2: fecha2,
                    };
                    getProductosCatalogo(datos);
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
      {/* VER BITACORA DE PRODUCTO */}
      <ModalComponent
        handleClose={handleisAlertCloseVerBitacoraProducto}
        isOpen={isAlertOpenVerBitacoraProducto}
        key={"alertaBitacoraProducto"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <br />
            {verBitacoraProducto?.length > 0 ? (
              <>
                <Grid item xs={12} sm={12} mb={4}>
                  <Typography variant="h5" gutterBottom noWrap sx={{ fontWeight: 600 }}>
                    HISTORIAL DE CAMBIOS EN EL PRODUCTO {verProducto?.nombre_producto}
                  </Typography>
                </Grid>
                <DinamicTableMejorada
                  //actions
                  key={tableKey}
                  //sinBusqueda
                  sinExport
                  esListaCanjes
                  //showCheckBox
                  data={verBitacoraProducto}
                  enAccion={(accion, row) => {
                    //handleAccion(accion, row);
                  }}
                  columnsOrder={[
                    "nombre_usuario",
                    "correo_usuario",
                    "descripcion",
                    "fecha_edicion",
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
                  <h3>{intl.formatMessage({ id: "sin_cambios_producto" })}</h3>
                </Grid>
              </Grid>
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

export default ListaProductos;

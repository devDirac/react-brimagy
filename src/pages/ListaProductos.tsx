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
import logo from "assets/images/logo.png";
import Footer from "examples/Footer";

import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import {
  Backdrop,
  Box,
  Button,
  CardContent,
  Checkbox,
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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { grey, pink } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import { FormikProvider } from "formik";
import SendIcon from "@mui/icons-material/Send";
import { Spinner } from "react-bootstrap";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";
import MDButton from "components/MDButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

import { MuiFileInput } from "mui-file-input";
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

function ListaProductos(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const {
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

  const handleSeleccionaProducto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const productoId = Number(event.target.value);

    setProductosSeleccionados((prev) => {
      if (event.target.checked) {
        return [...prev, productoId];
      } else {
        return prev.filter((id) => id !== productoId);
      }
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <MDBox py={3} mb={20}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{ background: "#084d6e", color: "#fff", mr: 2 }}
            >
              Subir Excel
              <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
            </Button>

            <Button
              variant="outlined"
              startIcon={<SimCardDownloadIcon />}
              onClick={descargarPlantillaExcel}
              sx={{ borderColor: "#084d6e", color: "#084d6e" }}
            >
              Descargar Plantilla
            </Button>
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
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
                  <Grid item xs={12} sm={6} md={4} lg={3} key={p.id || key}>
                    <Card
                      sx={{
                        border: productosSeleccionados.includes(p.id)
                          ? "2px solid #33F299"
                          : "none",
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
                          bgcolor: pink[50],
                          p: 1,
                          borderBottom: `2px solid ${pink[100]}`,
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
                              color: pink[500],
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
                          {/*<Tooltip title="Vista Previa">
                            <IconButton
                              aria-label="ver"
                              size="small"
                              color="default"
                              onClick={() => vistaPreviaPoliza(p)
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>*/}

                          {/*<Tooltip title="Descargar PDF">
                            <IconButton
                              aria-label="descargar"
                              size="small"
                              color="info"
                              onClick={() => descargarPoliza(p.id)
                            >
                              <CloudDownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>*/}

                          {isSuperAdmin ? (
                            <Tooltip title="Editar producto">
                              <IconButton
                                aria-label="editar"
                                size="small"
                                color="warning"
                                onClick={() => {
                                  setProductoEditar(p);
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
                          bgcolor: "#dee4f0",
                          p: 0,
                          borderBottom: `2px solid ${pink[100]}`,
                        }}
                      >
                        {isSuperAdmin ? (
                          <FormControlLabel
                            control={
                              <Checkbox
                                value={p.id}
                                checked={productosSeleccionados.includes(p.id)}
                                onChange={handleSeleccionaProducto}
                              />
                            }
                            label="Seleccionar"
                          />
                        ) : null}
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
                rowsPerPageOptions={[4, 8, 12, 16]}
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
        ) : !procesando ? (
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <h3>{intl.formatMessage({ id: "sin_polizas_registradas" })}</h3>
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

              <Grid item xs={6} sm={4}>
                <TextField
                  id="nombreEditar"
                  fullWidth
                  label={intl.formatMessage({ id: "input_nombre" })}
                  variant="standard"
                  name="nombreEditar"
                  value={nombreProductoEditar}
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
                  id="colorEditar"
                  fullWidth
                  label={intl.formatMessage({ id: "input_color" })}
                  variant="standard"
                  name="colorEditar"
                  value={colorEditar}
                  onChange={(e) => {
                    const value = e.target.value;
                    setColorEditar(e.target.value);
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
                      {option.nombre}
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
                    const datos = {
                      id_producto: productoEditar?.id,
                      nombre_producto: nombreProductoEditar,
                      descripcion: descripcionEditar,
                      marca: marcaEditar,
                      sku: skuEditar,
                      color: colorEditar,
                      id_proveedor: idProveedorEditar,
                      id_catalogo: idCatalogoEditar,
                      costo_con_iva: costoConIvaEditar,
                      costo_sin_iva: costoSinIvaEditar,
                      costo_puntos_con_iva: costoPuntosConIvaEditar,
                      costo_puntos_sin_iva: costoPuntosSinIvaEditar,
                      fee_brimagy: feeBrimagyEditar,
                      subtotal: subtotalEditar,
                      envio_base: envioBaseEditar,
                      costo_caja: costoCajaEditar,
                      envio_extra: envioExtraEditar,
                      total_envio: totalEnvioEditar,
                      total: totalEditar,
                      puntos: puntosEditar,
                      factor: factorEditar,
                      tipo_registro: "edicion",
                    };
                    editaProducto(datos);
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
            </>
          ) : null}
        </Grid>
      </ModalComponent>
      {/* Modal para visualizar datos del Excel */}
      <ModalComponent
        handleClose={handleisAlerCloseSubirExcel}
        isOpen={isAlertOpenSubirExcel}
        key={"alertaSubirExcel"}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <h5>Vista previa de productos del Excel</h5>
            <p>Total de productos: {excelData.length}</p>
          </Grid>

          <Grid item xs={12} style={{ maxHeight: "500px", overflow: "auto" }}>
            {excelData.length > 0 ? (
              <DinamicTableMejorada
                data={excelData.map((p) => ({
                  ...p,
                  proveedor_status: p.proveedor_valido ? "✓ " + p.proveedor : "✗ " + p.proveedor,
                  catalogo_status: p.categoria_valida ? "✓ " + p.catalogo : "✗ " + p.catalogo,
                  sku_status: p.sku_duplicado ? "🔄 " + p.sku + " (Existente)" : p.sku,
                }))}
                columnsToShow={[
                  "nombre_producto",
                  "descripcion",
                  "marca",
                  "sku_status",
                  "color",
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
              disabled={procesandoExcel || excelData.length === 0}
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
                `Guardar ${excelData.length} productos`
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

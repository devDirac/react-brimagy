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
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import logo from "assets/images/logo.png";
import Footer from "examples/Footer";

import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import { Backdrop, Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import ModalComponent from "components/Modal";
import Header from "components/Header";
import DinamicTable from "components/DinamicTable/DinamicTable";
import CampoAvatar from "components/CampoAvatar";
import { Spinner } from "react-bootstrap";
import { useCatalogoProductos } from "./customHooksPages/useCatalogoProductos";
import EditIcon from "@mui/icons-material/Edit";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import SaveIcon from "@mui/icons-material/Save";

function CatalogoProductos(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
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
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    productos,
    setProcesando,
    editaProducto,
    //excel
    excelData,
    isAlertOpenSubirExcel,
    handleisAlerCloseSubirExcel,
    handleFileUpload,
    guardarProductosExcel,
    procesandoExcel,
    descargarPlantillaExcel,
  } = useCatalogoProductos(tipoUsuario);

  const independiente = () => {
    return !productos?.length && !procesando ? (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h3>Sin productos</h3>
        </Grid>
      </Grid>
    ) : null;
  };

  const handleAccion = (accion: string, row: any) => {
    switch (accion) {
      case "eliminar":
        setProductoId(row?.id);
        handleisAlertOpenEliminaProducto();
        break;
      case "editar":
        setProductoEditar(row);
        handleisAlertOpenEditarProducto();
        break;
      default:
        break;
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <MDBox py={3} mb={20}>
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 8 }}>
          <Grid item xs={12} lg={12}>
            <Grid item xs={12}>
              <Grid item xs={12} mb={2}>
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
            </Grid>
            <Grid item xs={12}>
              {productos.length && !procesando ? (
                <DinamicTable
                  actions
                  key={tableKey}
                  esListaProductos
                  data={productos}
                  enAccion={(accion, row) => {
                    handleAccion(accion, row);
                  }}
                  pinned={[{ columna: "nombre_producto", lado: "left" }]}
                  columnsToShow={[
                    "nombre_producto",
                    "descripcion",
                    "marca",
                    "sku",
                    "color",
                    "proveedor",
                    "catalogo",
                    "costo_con_iva_format",
                    "costo_sin_iva_format",
                    "costo_puntos_con_iva_format",
                    "costo_puntos_sin_iva_format",
                    "fee_brimagy_format",
                    "subtotal_format",
                    "envio_base_format",
                    "costo_caja_format",
                    "envio_extra_format",
                    "total_envio_format",
                    "total_format",
                    "puntos_format",
                    "factor_format",
                    "fecha_creacion",
                  ]}
                />
              ) : (
                independiente()
              )}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={procesando}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
              <DinamicTable
                data={excelData.map((p) => ({
                  ...p,
                  proveedor_status: p.proveedor_valido ? "✓ " + p.proveedor : "✗ " + p.proveedor,
                  catalogo_status: p.categoria_valida ? "✓ " + p.catalogo : "✗ " + p.catalogo,
                }))}
                columnsToShow={[
                  "nombre_producto",
                  "descripcion",
                  "marca",
                  "sku",
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

export default CatalogoProductos;

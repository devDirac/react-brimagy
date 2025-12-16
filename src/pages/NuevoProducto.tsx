import logo from "assets/images/logo.png";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "components/Header";
import { useSelector } from "react-redux";
import { StoreType } from "types/genericTypes";
import { FormikProvider } from "formik";
import {
  Backdrop,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useNuevoProducto } from "./customHooksPages/useNuevoProducto";
import { Card, Spinner } from "react-bootstrap";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModalComponent from "components/Modal";

function NuevoProducto(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    crearProducto,
    procesandoProducto,
    categorias,
    proveedores,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    formik,
    getFieldColor,
  } = useNuevoProducto();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <MDBox py={3}>
        <FormikProvider value={formik!}>
          <Card>
            <CardContent>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                {intl.formatMessage({ id: "alta_nuevo_producto" })}
              </Typography>
              <Typography
                variant="caption"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "40px",
                }}
              >
                {intl.formatMessage({ id: "registra_nuevo_producto_catalogo" })}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="nombre_producto"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_nombre_producto" })} *`}
                    variant="standard"
                    name="nombre_producto"
                    value={formik.values.nombre_producto || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("nombre_producto", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nombre_producto && Boolean(formik.errors.nombre_producto)}
                    helperText={formik.touched.nombre_producto && formik.errors.nombre_producto}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("nombre_producto"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("nombre_producto"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("nombre_producto"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("nombre_producto"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="descripcion"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_descripcion" })} *`}
                    variant="standard"
                    name="descripcion"
                    value={formik.values.descripcion || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("descripcion", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                    helperText={formik.touched.descripcion && formik.errors.descripcion}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("descripcion"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("descripcion"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("descripcion"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("descripcion"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="marca"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_marca" })} *`}
                    variant="standard"
                    name="marca"
                    value={formik.values.marca || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("marca", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.marca && Boolean(formik.errors.marca)}
                    helperText={formik.touched.marca && formik.errors.marca}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("marca"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("marca"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("marca"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("marca"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="sku"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_sku" })} *`}
                    variant="standard"
                    name="sku"
                    value={formik.values.sku || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("sku", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.sku && Boolean(formik.errors.sku)}
                    helperText={formik.touched.sku && formik.errors.sku}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("sku"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("sku"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("sku"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("sku"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="color"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_color" })} *`}
                    variant="standard"
                    name="color"
                    value={formik.values.color || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("color", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.color && Boolean(formik.errors.color)}
                    helperText={formik.touched.color && formik.errors.color}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("color"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("color"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("color"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("color"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="id_proveedor"
                    select
                    fullWidth
                    label={`${intl.formatMessage({ id: "select_proveedores" })} *`}
                    variant="standard"
                    name="id_proveedor"
                    value={formik.values.id_proveedor || ""}
                    disabled={!proveedores || proveedores.length === 0}
                    helperText={
                      !proveedores || proveedores.length === 0
                        ? intl.formatMessage({ id: "sin_proveedores_registrados" })
                        : formik.touched.id_proveedor && formik.errors.id_proveedor
                    }
                    error={formik.touched.id_proveedor && Boolean(formik.errors.id_proveedor)}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("id_proveedor", value);
                    }}
                    InputProps={{
                      style: { padding: "5px" },
                    }}
                    onBlur={formik.handleBlur}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("id_proveedor"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("id_proveedor"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("id_proveedor"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("id_proveedor"),
                      },
                    }}
                  >
                    {proveedores?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="id_catalogo"
                    select
                    fullWidth
                    label={`${intl.formatMessage({ id: "select_categoria_producto" })} *`}
                    variant="standard"
                    name="id_catalogo"
                    value={formik.values.id_catalogo || ""}
                    disabled={!categorias || categorias.length === 0}
                    helperText={
                      !categorias || categorias.length === 0
                        ? intl.formatMessage({ id: "sin_categorias_registradas" })
                        : formik.touched.id_catalogo && formik.errors.id_catalogo
                    }
                    error={formik.touched.id_catalogo && Boolean(formik.errors.id_catalogo)}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("id_catalogo", value);
                    }}
                    InputProps={{
                      style: { padding: "5px" },
                    }}
                    onBlur={formik.handleBlur}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("id_catalogo"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("id_catalogo"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("id_catalogo"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("id_catalogo"),
                      },
                    }}
                  >
                    {categorias?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="costo_con_iva"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_costo_con_iva" })} *`}
                    variant="standard"
                    name="costo_con_iva"
                    type="number"
                    value={formik.values.costo_con_iva || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("costo_con_iva", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.costo_con_iva && Boolean(formik.errors.costo_con_iva)}
                    helperText={formik.touched.costo_con_iva && formik.errors.costo_con_iva}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("costo_con_iva"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("costo_con_iva"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("costo_con_iva"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("costo_con_iva"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="costo_sin_iva"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_costo_sin_iva" })} *`}
                    variant="standard"
                    name="costo_sin_iva"
                    type="number"
                    value={formik.values.costo_sin_iva || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("costo_sin_iva", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.costo_sin_iva && Boolean(formik.errors.costo_sin_iva)}
                    helperText={formik.touched.costo_sin_iva && formik.errors.costo_sin_iva}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("costo_sin_iva"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("costo_sin_iva"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("costo_sin_iva"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("costo_sin_iva"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="costo_puntos_con_iva"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_costo_puntos_con_iva" })} *`}
                    variant="standard"
                    name="costo_puntos_con_iva"
                    type="number"
                    value={formik.values.costo_puntos_con_iva || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("costo_puntos_con_iva", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.costo_puntos_con_iva &&
                      Boolean(formik.errors.costo_puntos_con_iva)
                    }
                    helperText={
                      formik.touched.costo_puntos_con_iva && formik.errors.costo_puntos_con_iva
                    }
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("costo_puntos_con_iva"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("costo_puntos_con_iva"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("costo_puntos_con_iva"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("costo_puntos_con_iva"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="costo_puntos_sin_iva"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_costo_puntos_sin_iva" })} *`}
                    variant="standard"
                    name="costo_puntos_sin_iva"
                    type="number"
                    value={formik.values.costo_puntos_sin_iva || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("costo_puntos_sin_iva", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.costo_puntos_sin_iva &&
                      Boolean(formik.errors.costo_puntos_sin_iva)
                    }
                    helperText={
                      formik.touched.costo_puntos_sin_iva && formik.errors.costo_puntos_sin_iva
                    }
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("costo_puntos_sin_iva"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("costo_puntos_sin_iva"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("costo_puntos_sin_iva"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("costo_puntos_sin_iva"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="fee_brimagy"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_fee_brimagy" })} *`}
                    variant="standard"
                    name="fee_brimagy"
                    type="number"
                    value={formik.values.fee_brimagy || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("fee_brimagy", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fee_brimagy && Boolean(formik.errors.fee_brimagy)}
                    helperText={formik.touched.fee_brimagy && formik.errors.fee_brimagy}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("fee_brimagy"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("fee_brimagy"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("fee_brimagy"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("fee_brimagy"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="subtotal"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_subtotal" })} *`}
                    variant="standard"
                    name="subtotal"
                    type="number"
                    value={formik.values.subtotal || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("subtotal", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.subtotal && Boolean(formik.errors.subtotal)}
                    helperText={formik.touched.subtotal && formik.errors.subtotal}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("subtotal"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("subtotal"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("subtotal"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("subtotal"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="envio_base"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_envio_base" })} *`}
                    variant="standard"
                    name="envio_base"
                    type="number"
                    value={formik.values.envio_base || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("envio_base", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.envio_base && Boolean(formik.errors.envio_base)}
                    helperText={formik.touched.envio_base && formik.errors.envio_base}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("envio_base"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("envio_base"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("envio_base"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("envio_base"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="costo_caja"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_costo_caja" })} *`}
                    variant="standard"
                    name="costo_caja"
                    type="number"
                    value={formik.values.costo_caja || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("costo_caja", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.costo_caja && Boolean(formik.errors.costo_caja)}
                    helperText={formik.touched.costo_caja && formik.errors.costo_caja}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("costo_caja"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("costo_caja"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("costo_caja"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("costo_caja"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="envio_extra"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_envio_extra" })} *`}
                    variant="standard"
                    name="envio_extra"
                    type="number"
                    value={formik.values.envio_extra || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("envio_extra", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.envio_extra && Boolean(formik.errors.envio_extra)}
                    helperText={formik.touched.envio_extra && formik.errors.envio_extra}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("envio_extra"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("envio_extra"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("envio_extra"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("envio_extra"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="total_envio"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_total_envio" })} *`}
                    variant="standard"
                    name="total_envio"
                    type="number"
                    value={formik.values.total_envio || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("total_envio", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.total_envio && Boolean(formik.errors.total_envio)}
                    helperText={formik.touched.total_envio && formik.errors.total_envio}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("total_envio"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("total_envio"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("total_envio"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("total_envio"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="total"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_total" })} *`}
                    variant="standard"
                    name="total"
                    type="number"
                    value={formik.values.total || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("total", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.total && Boolean(formik.errors.total)}
                    helperText={formik.touched.total && formik.errors.total}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("total"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("total"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("total"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("total"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="puntos"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_puntos" })} *`}
                    variant="standard"
                    name="puntos"
                    type="number"
                    value={formik.values.puntos || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("puntos", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.puntos && Boolean(formik.errors.puntos)}
                    helperText={formik.touched.puntos && formik.errors.puntos}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("puntos"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("puntos"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("puntos"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("puntos"),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="factor"
                    fullWidth
                    label={`${intl.formatMessage({ id: "input_factor" })} *`}
                    variant="standard"
                    name="factor"
                    type="number"
                    value={formik.values.factor || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("factor", value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.factor && Boolean(formik.errors.factor)}
                    helperText={formik.touched.factor && formik.errors.factor}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: getFieldColor("factor"),
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: getFieldColor("factor"),
                      },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: getFieldColor("factor"),
                      },
                      "& .MuiInputBase-input": {
                        color: getFieldColor("factor"),
                      },
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  display="flex"
                  alignContent="center"
                  justifyContent="center"
                >
                  <Button
                    sx={{ color: "#fff", background: "#084d6e" }}
                    variant="contained"
                    endIcon={<AddCircleIcon />}
                    disabled={procesando || !formik.dirty || !formik.isValid}
                    onClick={(e: any) => {
                      const datos = {
                        nombre_producto: formik.values.nombre_producto,
                        descripcion: formik.values.descripcion,
                        marca: formik.values.marca,
                        sku: formik.values.sku,
                        color: formik.values.color,
                        id_proveedor: formik.values.id_proveedor,
                        id_catalogo: formik.values.id_catalogo,
                        costo_con_iva: formik.values.costo_con_iva,
                        costo_sin_iva: formik.values.costo_sin_iva,
                        costo_puntos_con_iva: formik.values.costo_puntos_con_iva,
                        costo_puntos_sin_iva: formik.values.costo_puntos_sin_iva,
                        fee_brimagy: formik.values.fee_brimagy,
                        subtotal: formik.values.subtotal,
                        envio_base: formik.values.envio_base,
                        costo_caja: formik.values.costo_caja,
                        envio_extra: formik.values.envio_extra,
                        total_envio: formik.values.total_envio,
                        total: formik.values.total,
                        puntos: formik.values.puntos,
                        factor: formik.values.factor,
                        tipo_registro: "individual",
                      };
                      crearProducto(datos);
                    }}
                  >
                    {procesandoProducto ? (
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
                      intl.formatMessage({ id: "set_añadir_producto" })
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </FormikProvider>
      </MDBox>
      <Footer />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={procesando}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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

export default NuevoProducto;

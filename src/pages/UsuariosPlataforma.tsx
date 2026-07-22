import logo from "assets/images/profile_icon.png";

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
import { Card, Spinner } from "react-bootstrap";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModalComponent from "components/Modal";
import DinamicTableMejorada from "components/DinamicTable/DinamicTable";
import { useUsuariosPlataforma } from "./customHooksPages/useUsuariosPlataforma";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CampoAvatar from "components/CampoAvatar";

function UsuariosPlataforma(): JSX.Element {
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    crearUsuarioPlataforma,
    handleAccion,
    usuariosPlataforma,
    tipoUsuarios,
    procesandoPlataforma,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    formik,
    getFieldColor,
    //editando plataforma
    tableKey,
    usuarioEditar,
    alertEditar,
    handleisAlertOpenEditar,
    handleisAlertCloseEditar,
    //añadir usuario plataforma
    setImagen,
    foto,
    setUsuariosPlataforma,
    setUsuarioEditar,
    tipoUsuario,
    esSuperAdmin,
  } = useUsuariosPlataforma();

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
                {intl.formatMessage({ id: "añadir_usuario_plataforma" })}
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
                {intl.formatMessage({ id: "registra_usuario_plataforma_info" })}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<PersonAddIcon />}
                    endIcon={<PersonAddIcon />}
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
                      setUsuarioEditar(null);
                      handleisAlertOpenEditar();
                    }}
                  >
                    Añadir usuario
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12}>
                  {usuariosPlataforma?.length && !procesando ? (
                    <DinamicTableMejorada
                      actions
                      key={tableKey}
                      //sinBusqueda
                      sinExport
                      esListaUsuariosPlataforma
                      //showCheckBox
                      data={usuariosPlataforma}
                      enAccion={(accion, row) => {
                        handleAccion(accion, row);
                      }}
                      columnsToShow={["name", "email", "tipo_usuario", "status"]}
                    />
                  ) : !usuariosPlataforma?.length && !procesando ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} style={{ textAlign: "center" }}>
                        {intl.formatMessage({ id: "general_sin_datos_registrados" })}
                      </Grid>
                    </Grid>
                  ) : null}
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

      {/* EDITAR VARIABLE GLOBAL */}
      <ModalComponent
        handleClose={handleisAlertCloseEditar}
        isOpen={alertEditar}
        key={"alertaEditar"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12} mt={2}>
            <h5>
              {!usuarioEditar ? "Creando usuario" : `Editando usuario: ${usuarioEditar?.name}`}
            </h5>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              id="usuario"
              fullWidth
              label={`${intl.formatMessage({ id: "input_usuario" })} *`}
              variant="standard"
              name="usuario"
              value={formik.values.usuario || ""}
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue("usuario", value);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.usuario && Boolean(formik.errors.usuario)}
              helperText={formik.touched.usuario && formik.errors.usuario}
              sx={{
                "& .MuiInputLabel-root": {
                  color: getFieldColor("usuario"),
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: getFieldColor("usuario"),
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: getFieldColor("usuario"),
                },
                "& .MuiInputBase-input": {
                  color: getFieldColor("usuario"),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="nombre"
              fullWidth
              label={`${intl.formatMessage({ id: "input_nombre" })} *`}
              variant="standard"
              name="nombre"
              value={formik.values.nombre || ""}
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue("nombre", value);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
              sx={{
                "& .MuiInputLabel-root": {
                  color: getFieldColor("nombre"),
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: getFieldColor("nombre"),
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: getFieldColor("nombre"),
                },
                "& .MuiInputBase-input": {
                  color: getFieldColor("nombre"),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="correo"
              fullWidth
              label={`${intl.formatMessage({ id: "input_correo" })} *`}
              variant="standard"
              name="correo"
              value={formik.values.correo || ""}
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue("correo", value);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.correo && Boolean(formik.errors.correo)}
              helperText={formik.touched.correo && formik.errors.correo}
              sx={{
                "& .MuiInputLabel-root": {
                  color: getFieldColor("correo"),
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: getFieldColor("correo"),
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: getFieldColor("correo"),
                },
                "& .MuiInputBase-input": {
                  color: getFieldColor("correo"),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="telefono"
              fullWidth
              label={`${intl.formatMessage({ id: "input_telefono" })} *`}
              variant="standard"
              name="telefono"
              type="number"
              value={formik.values.telefono || ""}
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue("telefono", value);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.telefono && Boolean(formik.errors.telefono)}
              helperText={formik.touched.telefono && formik.errors.telefono}
              sx={{
                "& .MuiInputLabel-root": {
                  color: getFieldColor("telefono"),
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: getFieldColor("telefono"),
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: getFieldColor("telefono"),
                },
                "& .MuiInputBase-input": {
                  color: getFieldColor("telefono"),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="password"
              fullWidth
              type="password"
              label={intl.formatMessage({ id: "input_password" })}
              variant="standard"
              name="password"
              autoComplete="new-password"
              inputProps={{
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                },
              }}
              value={formik.values.password || ""}
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue("password", value);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{
                "& .MuiInputLabel-root": {
                  color: getFieldColor("password"),
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: getFieldColor("password"),
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: getFieldColor("password"),
                },
                "& .MuiInputBase-input": {
                  color: getFieldColor("password"),
                },
              }}
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="password_confirm"
              fullWidth
              type="password"
              label={intl.formatMessage({ id: "input_password_confirm" })}
              variant="standard"
              name="password_confirm"
              autoComplete="new-password"
              inputProps={{
                autoComplete: "new-password",
              }}
              value={formik.values.password_confirm || ""}
              onChange={(e) => {
                const value = e.target.value;
                formik!.setFieldValue("password_confirm", value);
              }}
              onBlur={formik!.handleBlur}
              error={formik!.touched.password_confirm && Boolean(formik!.errors.password_confirm)}
              helperText={formik!.touched.password_confirm && formik!.errors.password_confirm}
              sx={{
                "& .MuiInputLabel-root": {
                  color: getFieldColor("password_confirm"),
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: getFieldColor("password_confirm"),
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: getFieldColor("password_confirm"),
                },
                "& .MuiInputBase-input": {
                  color: getFieldColor("password_confirm"),
                },
              }}
            ></TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              id="tipo_usuario"
              select
              fullWidth
              label={`${intl.formatMessage({ id: "select_tipo_usuario" })} *`}
              variant="standard"
              name="tipo_usuario"
              value={formik.values.tipo_usuario || ""}
              disabled={!tipoUsuarios || tipoUsuarios.length === 0}
              helperText={
                !tipoUsuarios || tipoUsuarios.length === 0
                  ? intl.formatMessage({ id: "sin_tipo_usuarios_registrados" })
                  : formik.touched.tipo_usuario && formik.errors.tipo_usuario
              }
              error={formik.touched.tipo_usuario && Boolean(formik.errors.tipo_usuario)}
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue("tipo_usuario", value);
              }}
              InputProps={{
                style: { padding: "5px" },
              }}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiInputLabel-root": {
                  color: getFieldColor("tipo_usuario"),
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: getFieldColor("tipo_usuario"),
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: getFieldColor("tipo_usuario"),
                },
                "& .MuiInputBase-input": {
                  color: getFieldColor("tipo_usuario"),
                },
              }}
            >
              {tipoUsuarios?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <h5>Avatar</h5>
            <CampoAvatar foto={foto} alt={formik.values.correo} onChangeImage={setImagen} />
            <br />
          </Grid>
          <Grid item xs={12} sm={12} display="flex" alignContent="center" justifyContent="center">
            <Button
              sx={{ color: "#fff", background: "#084d6e" }}
              variant="contained"
              endIcon={<AddCircleIcon />}
              disabled={procesando || !formik.dirty || !formik.isValid}
              onClick={(e: any) => {
                const datos = {
                  ...(usuarioEditar && { id_usuario: usuarioEditar?.id }),
                  usuario: formik.values.usuario,
                  name: formik.values.nombre,
                  email: formik.values.correo,
                  telefono: formik.values.telefono,
                  foto: foto,
                  tipo_usuario: formik.values.tipo_usuario,
                };
                if (formik.values.password) {
                  datos.password = formik.values.password;
                }
                crearUsuarioPlataforma(datos);
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
                  {intl.formatMessage({ id: "general_actualizando" })}...{" "}
                </>
              ) : !usuarioEditar ? (
                intl.formatMessage({ id: "set_crear_usuario" })
              ) : (
                intl.formatMessage({ id: "set_actualizar_usuario" })
              )}
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

export default UsuariosPlataforma;

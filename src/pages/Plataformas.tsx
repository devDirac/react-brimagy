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
import { usePlataformas } from "./customHooksPages/usePlataformas";

function Plataformas(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    crearPlataforma,
    handleAccion,
    plataformas,
    variablesGlobalesData,
    procesandoPlataforma,
    productosSincronizados,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    formik,
    getFieldColor,
  } = usePlataformas();

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
                {intl.formatMessage({ id: "añadir_variables_globales" })}
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
                {intl.formatMessage({ id: "registra_variables_globales_de_producto" })}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
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
                            nombre: formik.values.nombre,
                            descripcion: formik.values.descripcion,
                          };
                          crearPlataforma(datos);
                        }}
                      >
                        {procesandoPlataforma ? (
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
                          intl.formatMessage({ id: "set_añadir_plataforma" })
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {plataformas?.length && !procesando ? (
                    <DinamicTableMejorada
                      actions
                      key={"variablesGlobales"}
                      //sinBusqueda
                      sinExport
                      esListaUsuarios
                      //showCheckBox
                      data={plataformas}
                      enAccion={(accion, row) => {
                        handleAccion(accion, row);
                      }}
                      columnsToShow={["nombre", "descripcion"]}
                    />
                  ) : !plataformas?.length && !procesando ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} style={{ textAlign: "center" }}>
                        {intl.formatMessage({ id: "sin_plataformas_registradas" })}
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

export default Plataformas;

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
  Alert,
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
import { useVariablesGlobales } from "./customHooksPages/useVariablesGlobales";
import DinamicTableMejorada from "components/DinamicTable/DinamicTable";
import SyncIcon from "@mui/icons-material/Sync";

function VariablesGlobales(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    sincronizarVariablesEnProductos,
    sincronizandoVariables,
    tableKey,
    variableGlobalEditar,
    handleAccion,
    plataformas,
    variablesGlobalesData,
    procesandoVariables,
    setVariablesGlobales,
    setProcesandoVariables,
    productosSincronizados,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    formik,
    getFieldColor,
    alertEditar,
    handleisAlertCloseEditar,
  } = useVariablesGlobales();

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
                <Grid item xs={12} sm={12}>
                  <Grid container spacing={2}>
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
                        id="id_plataforma"
                        select
                        fullWidth
                        label={`${intl.formatMessage({ id: "select_plataforma" })} *`}
                        variant="standard"
                        name="id_plataforma"
                        value={formik.values.id_plataforma || ""}
                        disabled={!plataformas || plataformas.length === 0}
                        helperText={
                          !plataformas || plataformas.length === 0
                            ? intl.formatMessage({ id: "sin_plataformas_registradas" })
                            : formik.touched.id_plataforma && formik.errors.id_plataforma
                        }
                        error={formik.touched.id_plataforma && Boolean(formik.errors.id_plataforma)}
                        onChange={(e) => {
                          const value = e.target.value;
                          formik.setFieldValue("id_plataforma", value);
                        }}
                        InputProps={{
                          style: { padding: "5px" },
                        }}
                        onBlur={formik.handleBlur}
                        sx={{
                          "& .MuiInputLabel-root": {
                            color: getFieldColor("id_plataforma"),
                          },
                          "& .MuiInput-underline:after": {
                            borderBottomColor: getFieldColor("id_plataforma"),
                          },
                          "& .MuiInput-underline:before": {
                            borderBottomColor: getFieldColor("id_plataforma"),
                          },
                          "& .MuiInputBase-input": {
                            color: getFieldColor("id_plataforma"),
                          },
                        }}
                      >
                        {plataformas?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
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
                            fee_brimagy: formik.values.fee_brimagy,
                            envio_base: formik.values.envio_base,
                            costo_caja: formik.values.costo_caja,
                            envio_extra: formik.values.envio_extra,
                            id_plataforma: formik.values.id_plataforma,
                            tipo: "insertar",
                          };
                          setVariablesGlobales(datos);
                        }}
                      >
                        {procesandoVariables ? (
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
                          intl.formatMessage({ id: "set_añadir_variables" })
                        )}
                      </Button>
                    </Grid>
                    {productosSincronizados?.plataformas_desincronizadas !== 0 && !procesando && (
                      <Grid item xs={12} sm={12} mt={2}>
                        <Alert severity="warning">
                          Hay {productosSincronizados?.plataformas_desincronizadas} plataformas
                          desincronizadas con {productosSincronizados?.productos_desincronizados}{" "}
                          productos desincronizados.{" "}
                          <Button
                            sx={{ color: "#fff", background: "#084d6e" }}
                            variant="contained"
                            endIcon={<SyncIcon />}
                            disabled={procesando || sincronizandoVariables}
                            onClick={(e: any) => {
                              sincronizarVariablesEnProductos();
                            }}
                          >
                            {sincronizandoVariables ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                                {intl.formatMessage({ id: "general_sincronizando" })}...{" "}
                              </>
                            ) : (
                              intl.formatMessage({ id: "sincronizar_ahora" })
                            )}
                          </Button>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} mt={4}>
                  {variablesGlobalesData?.length && !procesando ? (
                    <DinamicTableMejorada
                      actions
                      key={tableKey}
                      //sinBusqueda
                      sinExport
                      esListaUsuarios
                      //showCheckBox
                      data={variablesGlobalesData}
                      enAccion={(accion, row) => {
                        handleAccion(accion, row);
                      }}
                      columnsOrder={[
                        "nombre_plataforma",
                        "fee_brimagy",
                        "envio_base",
                        "costo_caja",
                        "envio_extra",
                        "fecha_creacion",
                      ]}
                    />
                  ) : !variablesGlobalesData?.length && !procesando ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} style={{ textAlign: "center" }}>
                        {intl.formatMessage({ id: "sin_variables_registradas" })}
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
          {variableGlobalEditar ? (
            <>
              <Grid item xs={12} mt={2}>
                <h5>Editando variables de: {variableGlobalEditar?.nombre_plataforma}</h5>
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
                  id="id_plataforma"
                  select
                  fullWidth
                  label={`${intl.formatMessage({ id: "select_plataforma" })} *`}
                  variant="standard"
                  name="id_plataforma"
                  value={formik.values.id_plataforma || ""}
                  disabled={!plataformas || plataformas.length === 0}
                  helperText={
                    !plataformas || plataformas.length === 0
                      ? intl.formatMessage({ id: "sin_plataformas_registradas" })
                      : formik.touched.id_plataforma && formik.errors.id_plataforma
                  }
                  error={formik.touched.id_plataforma && Boolean(formik.errors.id_plataforma)}
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue("id_plataforma", value);
                  }}
                  InputProps={{
                    style: { padding: "5px" },
                  }}
                  onBlur={formik.handleBlur}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: getFieldColor("id_plataforma"),
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: getFieldColor("id_plataforma"),
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: getFieldColor("id_plataforma"),
                    },
                    "& .MuiInputBase-input": {
                      color: getFieldColor("id_plataforma"),
                    },
                  }}
                >
                  {plataformas?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.nombre}
                    </MenuItem>
                  ))}
                </TextField>
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
                      fee_brimagy: formik.values.fee_brimagy,
                      envio_base: formik.values.envio_base,
                      costo_caja: formik.values.costo_caja,
                      envio_extra: formik.values.envio_extra,
                      id_plataforma: formik.values.id_plataforma,
                      id: variableGlobalEditar?.id,
                      tipo: "actualizar",
                    };
                    setVariablesGlobales(datos);
                  }}
                >
                  {procesandoVariables ? (
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
                  ) : (
                    intl.formatMessage({ id: "set_actualizar_variables" })
                  )}
                </Button>
              </Grid>
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
    </DashboardLayout>
  );
}

export default VariablesGlobales;

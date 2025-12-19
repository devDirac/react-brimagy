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
import logo from "assets/images/profile_icon.png";
import Footer from "examples/Footer";

import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import ModalComponent from "components/Modal";
import Header from "components/Header";
import DinamicTable from "components/DinamicTable/DinamicTable";
import CampoAvatar from "components/CampoAvatar";
import { Spinner } from "react-bootstrap";
import { useCategoriasProveedores } from "./customHooksPages/useCategoriasProveedores";
import { FormikProvider } from "formik";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";

function CategoriasProveedores(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    telefonoEditar,
    setTelefonoEditar,
    correoEditar,
    setCorreoEditar,
    setTipoEditando,
    tipoEditando,
    eliminarGeneral,
    descripcionEditar,
    setDescripcionEditar,
    handleisAlertOpenConfirm,
    setGeneralId,
    generalId,
    generalEditar,
    setGeneralEditar,
    openModalConfirm,
    setOpenModalConfirm,
    tabableKeyProveedor,
    tableKeyCategoria,
    procesandoProveedor,
    crearProveedor,
    crearCategoria,
    categorias,
    proveedores,
    procesandoCategoria,
    getFieldColor,
    formik,
    formikCategoria,
    procesandoEditar,
    nombreEditar,
    setNombreEditar,
    handleisAlertOpenEditarUsuario,
    handleisAlerCloseEditarUsuario,
    isAlertOpenEditarUsuario,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    usuarios,
    setProcesando,
    editaGeneral,
  } = useCategoriasProveedores(tipoUsuario);

  const independiente = () => {
    return !usuarios?.length && !procesando ? (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h3>{intl.formatMessage({ id: "sin_registros" })}</h3>
        </Grid>
      </Grid>
    ) : null;
  };

  const handleAccion = (accion: string, row: any) => {
    switch (accion) {
      case "desactivar":
        //desactivaUsuario(row);
        break;
      case "eliminar_proveedor":
        setTipoEditando("proveedor");
        setGeneralId(row?.id);
        handleisAlertOpenConfirm();
        break;
      case "eliminar_categoria":
        setTipoEditando("categoria");
        setGeneralId(row?.id);
        handleisAlertOpenConfirm();
        break;
      case "editar_proveedor":
        setTipoEditando("proveedor");
        setGeneralEditar(row);
        handleisAlertOpenEditarUsuario();
        break;
      case "editar_categoria":
        setTipoEditando("categoria");
        setGeneralEditar(row);
        handleisAlertOpenEditarUsuario();
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
        <FormikProvider value={formik!}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={12}>
                    <Typography variant="h5" gutterBottom>
                      {intl.formatMessage({ id: "proveedores" })}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={6}>
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
                  <Grid item xs={6} sm={6}>
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
                  <Grid item xs={6} sm={6}>
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
                  <Grid item xs={6} sm={6}>
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
                          telefono: formik.values.telefono,
                          correo: formik.values.correo,
                        };
                        crearProveedor(datos);
                      }}
                    >
                      {procesandoProveedor ? (
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
                        intl.formatMessage({ id: "set_añadir" })
                      )}
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={6} container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={12}>
                    <Typography variant="h5" gutterBottom>
                      {intl.formatMessage({ id: "categorias" })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="nombre"
                      fullWidth
                      label={`${intl.formatMessage({ id: "input_nombre" })} *`}
                      variant="standard"
                      name="nombre"
                      value={formikCategoria.values.nombre || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        formikCategoria.setFieldValue("nombre", value);
                      }}
                      onBlur={formikCategoria.handleBlur}
                      error={
                        formikCategoria.touched.nombre && Boolean(formikCategoria.errors.nombre)
                      }
                      helperText={formikCategoria.touched.nombre && formikCategoria.errors.nombre}
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
                  {/*<Grid item xs={6} sm={6}>
                    <TextField
                      id="descripcion"
                      fullWidth
                      label={`${intl.formatMessage({ id: "input_descripcion" })} *`}
                      variant="standard"
                      name="descripcion"
                      value={formikCategoria.values.descripcion || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        formikCategoria.setFieldValue("descripcion", value);
                      }}
                      onBlur={formikCategoria.handleBlur}
                      error={
                        formikCategoria.touched.descripcion &&
                        Boolean(formikCategoria.errors.descripcion)
                      }
                      helperText={
                        formikCategoria.touched.descripcion && formikCategoria.errors.descripcion
                      }
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
                  </Grid>*/}
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
                      disabled={procesando || !formikCategoria.dirty || !formikCategoria.isValid}
                      onClick={(e: any) => {
                        const datos = {
                          nombre: formikCategoria.values.nombre,
                        };
                        crearCategoria(datos);
                      }}
                    >
                      {procesandoCategoria ? (
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
                        intl.formatMessage({ id: "set_añadir" })
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} mt={5}>
                  {proveedores.length && !procesando ? (
                    <DinamicTable
                      actions
                      key={tabableKeyProveedor}
                      //sinBusqueda
                      columnsToShow={["nombre", "descripcion"]}
                      sinExport
                      esListaProveedores
                      //showCheckBox
                      data={proveedores}
                      enAccion={(accion, row) => {
                        handleAccion(accion, row);
                      }}
                    />
                  ) : (
                    independiente()
                  )}
                </Grid>
                <Grid item xs={12} sm={6} mt={5}>
                  {categorias.length && !procesando ? (
                    <DinamicTable
                      actions
                      key={tableKeyCategoria}
                      //sinBusqueda
                      columnsToShow={["desc"]}
                      sinExport
                      esListaCategorias
                      //showCheckBox
                      data={categorias}
                      enAccion={(accion, row) => {
                        handleAccion(accion, row);
                      }}
                    />
                  ) : (
                    independiente()
                  )}
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
      <ModalComponent
        handleClose={handleisAlerCloseEditarUsuario}
        isOpen={isAlertOpenEditarUsuario}
        key={"alertaEditarUsuario"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {generalEditar ? (
            <>
              <Grid item xs={12} mt={2}>
                <h5>
                  Editando {tipoEditando === "proveedor" ? "proveedor" : "categoria"}:{" "}
                  {generalEditar?.nombre}
                </h5>
              </Grid>

              <Grid item xs={6} sm={4}>
                <TextField
                  id="nombreEditar"
                  fullWidth
                  label={intl.formatMessage({ id: "input_nombre" })}
                  variant="standard"
                  name="nombreEditar"
                  value={nombreEditar}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNombreEditar(e.target.value);
                  }}
                />
              </Grid>
              {tipoEditando === "proveedor" ? (
                <>
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
                      id="telefonoEditar"
                      fullWidth
                      label={intl.formatMessage({ id: "input_telefono" })}
                      variant="standard"
                      name="telefonoEditar"
                      value={telefonoEditar}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTelefonoEditar(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="correoEditar"
                      fullWidth
                      label={intl.formatMessage({ id: "input_correo" })}
                      variant="standard"
                      name="correoEditar"
                      value={correoEditar}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCorreoEditar(e.target.value);
                      }}
                    />
                  </Grid>
                </>
              ) : null}

              <Grid item xs={12} md={4}>
                <Button
                  sx={{ color: "#fff", background: "#084d6e" }}
                  variant="contained"
                  endIcon={<EditIcon />}
                  disabled={procesando}
                  onClick={(e: any) => {
                    let datos;
                    if (tipoEditando === "proveedor") {
                      datos = {
                        id: generalEditar?.id,
                        nombre: nombreEditar,
                        descripcion: descripcionEditar,
                        telefono: telefonoEditar,
                        correo: correoEditar,
                      };
                    } else if (tipoEditando === "categoria") {
                      datos = {
                        id: generalEditar?.id,
                        desc: nombreEditar,
                      };
                    }
                    console.log(datos);

                    editaGeneral(datos);
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
                  ) : tipoEditando === "proveedor" ? (
                    intl.formatMessage({ id: "set_editar_proveedor" })
                  ) : (
                    intl.formatMessage({ id: "set_editar_categoria" })
                  )}
                </Button>
              </Grid>
            </>
          ) : null}
        </Grid>
      </ModalComponent>
      <ModalConfirm
        onAcept={() => {
          setOpenModalConfirm(false);
          eliminarGeneral(Number(generalId));
        }}
        onCancel={() => {
          setOpenModalConfirm(false);
        }}
        open={openModalConfirm}
        text={
          tipoEditando === "proveedor"
            ? intl.formatMessage({
                id: "eliminar_proveedor_confirmar",
              })
            : intl.formatMessage({
                id: "eliminar_categoria_confirmar",
              })
        }
        title={""}
        cancelText="No"
        acceptText={intl.formatMessage({
          id: "si",
        })}
      />
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

export default CategoriasProveedores;

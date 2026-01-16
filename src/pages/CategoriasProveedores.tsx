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
import React from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import logo from "assets/images/profile_icon.png";
import Footer from "examples/Footer";
import { grey, pink } from "@mui/material/colors";

import { useSelector } from "react-redux";
import { StoreType, TabPanelProps } from "../types/genericTypes";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Tab,
  Tabs,
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
import { TextFieldValidado } from "components/TextFieldValidado/TextFieldValidado";

function CustomTabPanel({ children, value, index, ...other }: TabPanelProps) {
  if (value !== index) return null;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box sx={{ p: 3 }}>{children}</Box>
    </div>
  );
}

function CategoriasProveedores(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    tabsStyles,
    handleAccionCallback,
    valueTab,
    setValueTab,
    handleChangeTab,
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

  function tabProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <MDBox py={3} mb={20}>
        <Card>
          <CardContent>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={valueTab}
                  onChange={handleChangeTab}
                  aria-label="tabs categorias y proveedores"
                  sx={tabsStyles}
                >
                  <Tab label={intl.formatMessage({ id: "proveedores" })} {...tabProps(0)} />
                  <Tab label={intl.formatMessage({ id: "categorias" })} {...tabProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={valueTab} index={0}>
                <FormikProvider value={formik!}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={6}>
                      <TextFieldValidado
                        id="nombre"
                        fullWidth
                        label={`${intl.formatMessage({ id: "input_nombre" })} *`}
                        variant="standard"
                        name="nombre"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextFieldValidado
                        id="razon_social"
                        fullWidth
                        label={`${intl.formatMessage({ id: "input_razon_social" })} *`}
                        variant="standard"
                        name="razon_social"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextFieldValidado
                        id="descripcion"
                        fullWidth
                        label={`${intl.formatMessage({ id: "input_descripcion" })} *`}
                        variant="standard"
                        name="descripcion"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextFieldValidado
                        id="nombre_contacto"
                        fullWidth
                        label={`${intl.formatMessage({ id: "input_nombre_contacto" })} *`}
                        variant="standard"
                        name="nombre_contacto"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextFieldValidado
                        id="telefono"
                        fullWidth
                        label={`${intl.formatMessage({ id: "input_telefono" })} *`}
                        variant="standard"
                        name="telefono"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextFieldValidado
                        id="correo"
                        fullWidth
                        label={`${intl.formatMessage({ id: "input_correo" })} *`}
                        variant="standard"
                        name="correo"
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
                            razon_social: formik.values.razon_social,
                            descripcion: formik.values.descripcion,
                            nombre_contacto: formik.values.nombre_contacto,
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
                    <Grid item xs={12} sm={12} mt={4}>
                      {proveedores.length && !procesando ? (
                        <DinamicTable
                          actions
                          //key={tabableKeyProveedor}
                          //sinBusqueda
                          columnsToShow={["nombre", "descripcion"]}
                          sinExport
                          esListaProveedores
                          //showCheckBox
                          data={proveedores}
                          enAccion={(accion, row) => {
                            handleAccionCallback(accion, row);
                          }}
                        />
                      ) : (
                        independiente()
                      )}
                    </Grid>
                  </Grid>
                </FormikProvider>
              </CustomTabPanel>
              <CustomTabPanel value={valueTab} index={1}>
                <FormikProvider value={formikCategoria!}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <TextFieldValidado
                        id="nombre"
                        fullWidth
                        label={`${intl.formatMessage({ id: "input_nombre" })} *`}
                        variant="standard"
                        name="nombre"
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
                    <Grid item xs={12} sm={12} mt={2}>
                      {categorias.length && !procesando ? (
                        <DinamicTable
                          actions
                          //key={tableKeyCategoria}
                          //sinBusqueda
                          columnsToShow={["desc"]}
                          sinExport
                          esListaCategorias
                          //showCheckBox
                          data={categorias}
                          enAccion={(accion, row) => {
                            handleAccionCallback(accion, row);
                          }}
                        />
                      ) : (
                        independiente()
                      )}
                    </Grid>
                  </Grid>
                </FormikProvider>
              </CustomTabPanel>
            </Box>
          </CardContent>
        </Card>
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

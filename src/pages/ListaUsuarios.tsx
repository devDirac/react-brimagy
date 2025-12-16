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
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import logo from "assets/images/logo.png";
import Footer from "examples/Footer";

// NewUser layout schemas for form and form feilds
import validations from "layouts/pages/users/new-user/schemas/validations";
import form from "layouts/pages/users/new-user/schemas/form";
import initialValues from "layouts/pages/users/new-user/schemas/initialValues";
import { useListaUsuarios } from "./customHooksPages/useListaUsuarios";
import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import { Backdrop, CircularProgress, TextField } from "@mui/material";
import ModalComponent from "components/Modal";
import Header from "components/Header";
import DinamicTable from "components/DinamicTable/DinamicTable";
import CampoAvatar from "components/CampoAvatar";
import { editarUsuarioHttp } from "actions/users";
import { Button, Spinner } from "react-bootstrap";

function ListaUsuarios(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    procesandoEditar,
    nombreEditar,
    setNombreEditar,
    rfcEditar,
    setRfcEditar,
    direccionFiscalEditar,
    setdireccionFiscalEditar,
    correoEditar,
    setCorreoEditar,
    telefonoEditar,
    setTelefonoEditar,
    fotoEditar,
    setFotoEditar,
    tableKey,
    usuarioEditar,
    setUsuarioEditar,
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
    desactivaUsuario,
    reactivaUsuario,
    editaUsuario,
  } = useListaUsuarios(tipoUsuario);

  const independiente = () => {
    return !usuarios?.length && !procesando ? (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h3>Sin registros</h3>
        </Grid>
      </Grid>
    ) : null;
  };

  const handleAccion = (accion: string, row: any) => {
    switch (accion) {
      case "desactivar":
        desactivaUsuario(row);
        break;
      case "reactivar":
        reactivaUsuario(row);
        break;
      case "editar_usuario":
        setUsuarioEditar(row);
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
      <MDBox py={3} mb={20} height="65vh">
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 8 }}>
          <Grid item xs={12} lg={12}>
            <Grid item xs={12}>
              {usuarios.length && !procesando ? (
                <DinamicTable
                  actions
                  key={tableKey}
                  //sinBusqueda
                  //sinExport
                  esListaUsuarios
                  //showCheckBox
                  data={usuarios}
                  enAccion={(accion, row) => {
                    handleAccion(accion, row);
                  }}
                  columnsToShow={["name", "email", "tipo_usuario", "status"]}
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
        handleClose={handleisAlerCloseEditarUsuario}
        isOpen={isAlertOpenEditarUsuario}
        key={"alertaEditarUsuario"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {usuarioEditar ? (
            <>
              <Grid item xs={12} mt={2}>
                <h5>Editando usuario: {usuarioEditar?.nombre}</h5>
              </Grid>

              <Grid item xs={6} sm={4}>
                <TextField
                  id="nombreEditar"
                  fullWidth
                  label={intl.formatMessage({ id: "input_nombre" })}
                  variant="standard"
                  name="nombreEditar"
                  value={nombreEditar || usuarioEditar?.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNombreEditar(e.target.value);
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
                  value={correoEditar || usuarioEditar?.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCorreoEditar(e.target.value);
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
                  type="number"
                  value={telefonoEditar || usuarioEditar?.telefono}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTelefonoEditar(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <h5>Avatar</h5>
                <CampoAvatar
                  foto={fotoEditar || usuarioEditar?.foto}
                  alt={""}
                  onChangeImage={setFotoEditar}
                />
                <br />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  style={{
                    margin: "0 auto",
                    display: "block",
                    marginTop: "10px",
                  }}
                  onClick={(e: any) => {
                    const datos = {
                      id_usuario: usuarioEditar?.id,
                      nombre: nombreEditar,
                      correo: correoEditar,
                      telefono: telefonoEditar,
                      foto: fotoEditar,
                    };
                    editaUsuario(datos);
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
                      Guardando...{" "}
                    </>
                  ) : (
                    intl.formatMessage({ id: "set_general_editar_usuario" })
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

export default ListaUsuarios;

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

import { useState } from "react";

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

// NewUser page components
import UserInfo from "../components/UserForm/UserInfo";
import UserPermiso from "../components/UserForm/UserPermiso";

// NewUser layout schemas for form and form feilds
import validations from "layouts/pages/users/new-user/schemas/validations";
import form from "layouts/pages/users/new-user/schemas/form";
import initialValues from "layouts/pages/users/new-user/schemas/initialValues";
import { useNuevoUsuario } from "./customHooksPages/useNuevoUsuario";
import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import { Backdrop, CircularProgress } from "@mui/material";
import ModalComponent from "components/Modal";
import Header from "components/Header";

function getSteps(): string[] {
  return ["Información de Perfil", "Permisos"];
}

function NuevoUsuario(): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const { formId, formField } = form;
  const currentValidation = validations[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  const {
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    guardaNuevoUsuario,
    formik,
    setProcesando,
  } = useNuevoUsuario(activeStep, isLastStep);

  const UserPermission = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario);
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);
  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const [formDataV, setFormDataV] = useState({
    usuario: "",
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    password_confirm: "",
    foto: "",
    permisos: "",
  });

  const actualizarDatosUsuario = (datos: any) => {
    setFormDataV((prevData) => ({
      ...prevData,
      ...datos,
    }));
  };
  const actualizarPermisos = (datos: any) => {
    setFormDataV((prevData) => ({
      ...prevData,
      ...datos,
    }));
  };

  function getStepContent(stepIndex: number): JSX.Element | null {
    switch (stepIndex) {
      case 0:
        return (
          <UserInfo
            onDatosChange={(datos) => {
              actualizarDatosUsuario(datos);
            }}
            permisoUser={UserPermission}
            formik={formik}
          />
        );
      case 1:
        return (
          <UserPermiso
            onDatosChange={(datos) => {
              actualizarPermisos(datos);
            }}
            permisoUser={UserPermission}
            idUsuario={idUsuario}
            formik={formik}
          />
        );
      default:
        return null;
    }
  }

  const sleep = (ms: any) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  const handleBack = () => setActiveStep(activeStep - 1);

  const submitForm = async (values: any, actions: any) => {
    await sleep(1000);

    alert(JSON.stringify(values, null, 2));

    actions.setSubmitting(false);
    actions.resetForm();

    setActiveStep(0);
  };

  const handleSubmit = () => {
    if (isLastStep) {
      guardaNuevoUsuario(formDataV);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <MDBox py={3} mb={20}>
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 8 }}>
          <Grid item xs={12} lg={8}>
            <Formik
              initialValues={initialValues}
              validationSchema={currentValidation}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              <Form id={formId} autoComplete="off">
                <Card sx={{ height: "100%" }}>
                  <MDBox mx={2} mt={-3}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </MDBox>
                  <MDBox p={3}>
                    <MDBox>
                      {getStepContent(activeStep)}
                      <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
                        {activeStep === 0 ? (
                          <MDBox />
                        ) : (
                          <MDButton variant="gradient" color="light" onClick={handleBack}>
                            Regresar
                          </MDButton>
                        )}
                        <MDButton
                          disabled={
                            isLastStep
                              ? !formik.isValid || !formik.values.permiso
                              : !formik.dirty || !formik.isValid
                          }
                          type="button"
                          variant="gradient"
                          color="dark"
                          onClick={() => {
                            handleSubmit();
                          }}
                        >
                          {isLastStep ? "Guardar" : "Siguiente"}
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </Card>
              </Form>
            </Formik>
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

export default NuevoUsuario;

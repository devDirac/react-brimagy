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
import useAddMultiUsersPage from "./customHooksPages/useAddMultiplesUsuarios";
import ModalConfirm from "../components/ModalConfirm/ModalConfirm";
import AltaMasivaUsuarios from "../components/AltaMasivaUsuarios/AltaMasivaUsuarios";
import ModalComponent from "../components/Modal";
import { Backdrop, CircularProgress } from "@mui/material";

function AddMultiplesUsuarios(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);
  const {
    intl,
    espacio,
    setMensajeAlert,
    handleisAlertOpen,
    procesando,
    addUserPregunta,
    handleisAlerClose,
    isAlertOpen,
    mensajeAlert,
    addUser,
    setOpenModalConfirm,
    setTextModalConfirm,
    setData,
    openModalConfirm,
    textModalConfirm,
  } = useAddMultiUsersPage();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <MDBox py={3}>
        <AltaMasivaUsuarios
          onErrorDocumento={() => {
            setMensajeAlert(
              intl.formatMessage({
                id: "no_valido_carga_masiva",
              })
            );
            handleisAlertOpen();
          }}
          procesando={procesando}
          onSelect={addUserPregunta}
        />
      </MDBox>
      <Backdrop style={{ zIndex: 1000, color: "#fff" }} open={procesando}>
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

      <ModalConfirm
        onAcept={() => {
          addUser();
        }}
        onCancel={() => {
          setOpenModalConfirm(false);
          setTextModalConfirm("");
          setData([]);
        }}
        open={openModalConfirm}
        text={textModalConfirm}
        title={""}
      />
      <Footer />
    </DashboardLayout>
  );
}

export default AddMultiplesUsuarios;

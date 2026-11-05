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

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import logo from "assets/images/profile_icon.png";
import Footer from "examples/Footer";

import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import { Backdrop, CircularProgress } from "@mui/material";
import ModalComponent from "components/Modal";
import Header from "components/Header";
import "dayjs/locale/es";
import EstadisticasHome from "components/DetallesVistas/EstadisticasHome";
import { useEstadisticasComparativaPage } from "./customHooksPages/useEstadisticasComparativaPage";
import EstadisticaComparativaModulo from "components/DetallesVistas/EstadisticaComparativa";

function EstadisticasComparativaPage(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    estadisticaComparativa,
    periodoUnoInicio,
    setPeriodoUnoInicio,
    periodoUnoFin,
    setPeriodoUnoFin,
    periodoDosInicio,
    setPeriodoDosInicio,
    periodoDosFin,
    setPeriodoDosFin,
    plataforma,
  } = useEstadisticasComparativaPage(tipoUsuario);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <Grid container spacing={2} mb={2}>
        <EstadisticaComparativaModulo
          verEstadisticas={estadisticaComparativa}
          procesando={procesando}
          periodoUnoInicio={periodoUnoInicio}
          setPeriodoUnoInicio={setPeriodoUnoInicio}
          periodoUnoFin={periodoUnoFin}
          setPeriodoUnoFin={setPeriodoUnoFin}
          periodoDosInicio={periodoDosInicio}
          setPeriodoDosInicio={setPeriodoDosInicio}
          periodoDosFin={periodoDosFin}
          setPeriodoDosFin={setPeriodoDosFin}
          plataforma={plataforma}
        />
      </Grid>
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

export default EstadisticasComparativaPage;

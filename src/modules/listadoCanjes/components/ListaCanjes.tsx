import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import MDBox from "components/MDBox";
import ModalComponent from "components/Modal";
import Header from "components/Header";
import DetallesCanjeModal from "components/DetallesVistas/DetalleCanje";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import logo from "assets/images/profile_icon.png";
import { StoreType } from "types/genericTypes";
import BarraHerramientas from "./BarraHerramientas";
import CanjesCuadricula from "./CanjesCuadricula";
import TablaCanjes from "./TablaCanjes";
import ModalBusquedaFechas from "./ModalBusquedaFechas";
import { useListaCanjes } from "../hooks";

function ListaCanjes(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const { intl, procesando, canjes, visualizacion, cambiarVisualizacion, busqueda, detalle, alerta } =
    useListaCanjes();

  const hayCanjes = canjes.length > 0;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />

      <MDBox py={3} mb={20}>
        <BarraHerramientas
          visualizacion={visualizacion}
          onCambiarVisualizacion={cambiarVisualizacion}
          onAbrirFechas={busqueda.abrirModal}
          buscador={busqueda.buscador}
          onBuscadorChange={busqueda.handleBuscadorChange}
        />

        {hayCanjes && visualizacion === "cuadricula" && (
          <CanjesCuadricula canjes={canjes} onVer={detalle.abrirCanje} />
        )}
        {hayCanjes && visualizacion === "tabla" && (
          <TablaCanjes canjes={canjes} onVer={detalle.abrirCanje} />
        )}
        {!hayCanjes && !procesando && (
          <Grid container justifyContent="center">
            <h3>{intl.formatMessage({ id: "sin_canjes_registrados" })}</h3>
          </Grid>
        )}
      </MDBox>

      <Footer />

      <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={procesando}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Detalle del canje */}
      <ModalComponent
        handleClose={detalle.cerrarModal}
        isOpen={detalle.modalAbierto}
        key="alertaVerDatos"
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {detalle.verCanje && (
            <DetallesCanjeModal
              verCanje={detalle.verCanje}
              isPDFViewerOpen={detalle.pdfAbierto}
              handleOpenPDFViewer={detalle.abrirPdf}
              handleClosePDFViewer={detalle.cerrarPdf}
              validarIdentidad={detalle.validarIdentidad}
              validarIdentidadSinProveedor={detalle.validarIdentidadSinProveedor}
              procesandoIdentidad={detalle.procesandoIdentidad}
              procesandoIdentidadDirecto={detalle.procesandoIdentidadDirecto}
            />
          )}
        </Grid>
      </ModalComponent>

      <ModalBusquedaFechas
        abierto={busqueda.modalAbierto}
        onCerrar={busqueda.cerrarModal}
        fecha1={busqueda.fecha1}
        setFecha1={busqueda.setFecha1}
        fecha2={busqueda.fecha2}
        setFecha2={busqueda.setFecha2}
        onBuscar={busqueda.buscarPorFechas}
        deshabilitado={procesando}
      />

      <ModalComponent handleClose={alerta.cerrar} isOpen={alerta.abierta} key="alerta">
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12} mt={4}>
            <p>{alerta.mensaje}</p>
          </Grid>
        </Grid>
      </ModalComponent>
    </DashboardLayout>
  );
}

export default ListaCanjes;

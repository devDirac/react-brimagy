import { ComponentProps, useMemo, useRef } from "react";
import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import MDBox from "components/MDBox";
import ModalComponent from "components/Modal";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";
import Header from "components/Header";
import TablaDatos from "components/TablaDatos";
import DetallesProductoModal from "components/DetallesVistas/Producto";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import logo from "assets/images/profile_icon.png";
import { StoreType } from "types/genericTypes";
import BarraHerramientas from "./BarraHerramientas";
import ProductosCuadricula from "./ProductosCuadricula";
import ModalBusquedaFechas from "./ModalBusquedaFechas";
import ModalBusquedaInteligente from "./ModalBusquedaInteligente";
import ModalBitacora from "./ModalBitacora";
import ModalVistaFoto from "./ModalVistaFoto";
import ModalImportarExcel from "./importacion/ModalImportarExcel";
import ModalEditarProducto from "./edicion/ModalEditarProducto";
import { ModalEditarColor, ModalEditarMonto, ModalEditarTalla } from "./edicion/ModalesEdicionRecurso";
import { useCatalogoProductos, useEdicionProducto, useImportacionExcel } from "../hooks";
import { crearColumnasProductos } from "./tabla/columnasProductos";
import type { Producto } from "../types";

// DetallesProductoModal tiene su propio tipo de producto (más estricto que el del catálogo)
type ProductoDetalle = ComponentProps<typeof DetallesProductoModal>["verProducto"];

function CatalogoProductos(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const catalogo = useCatalogoProductos();
  const edicion = useEdicionProducto(catalogo);
  const excel = useImportacionExcel(catalogo);

  const { alerta, cargando, productos, catalogos, plataforma, busqueda } = catalogo;
  const { procesando, intlRef } = cargando;
  const hayProductos = productos.length > 0;

  const acciones = {
    onVer: catalogo.vistaPrevia.abrir,
    onHistorial: catalogo.bitacora.abrir,
    onEditar: edicion.abrir,
    onEliminar: catalogo.eliminar.solicitar,
    onCambiarDisponibilidad: catalogo.cambiarDisponibilidad,
  };

  // Las acciones se leen desde un ref para que las columnas no se recreen en cada render
  const accionesRef = useRef(acciones);
  accionesRef.current = acciones;
  const columnas = useMemo(
    () =>
      crearColumnasProductos(
        {
          onVer: (p) => accionesRef.current.onVer(p),
          onHistorial: (p) => accionesRef.current.onHistorial(p),
          onEditar: (p) => accionesRef.current.onEditar(p),
          onEliminar: (p) => accionesRef.current.onEliminar(p),
          onCambiarDisponibilidad: (p) => accionesRef.current.onCambiarDisponibilidad(p),
        },
        catalogo.esSuperAdmin
      ),
    [catalogo.esSuperAdmin]
  );

  const recursoProps = { producto: edicion.producto, plataforma, deshabilitado: procesando };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />

      <MDBox py={3} mb={20}>
        <BarraHerramientas
          hayProductos={hayProductos}
          onSubirExcel={excel.handleFileUpload}
          onDescargarExcel={catalogo.descargarExcel}
          onAbrirBusquedaInteligente={catalogo.busquedaInteligente.abrir}
          visualizacion={catalogo.visualizacion}
          onCambiarVisualizacion={catalogo.cambiarVisualizacion}
          onAbrirFechas={busqueda.abrirModalFechas}
          buscador={busqueda.buscador}
          onBuscadorChange={busqueda.handleBuscadorChange}
        />

        {hayProductos && catalogo.visualizacion === "cuadricula" && (
          <ProductosCuadricula
            productos={productos}
            esSuperAdmin={catalogo.esSuperAdmin}
            {...acciones}
          />
        )}
        {hayProductos && catalogo.visualizacion === "tabla" && (
          <TablaDatos<Producto>
            data={productos}
            columns={columnas}
            getRowId={(p) => String(p.id)}
            conBuscador
            placeholderBuscador="Buscar en la tabla..."
            opcionesPorPagina={[10, 25, 50, 100]}
            colorFila={(p) => (p.stock === 0 ? "#fff3cd" : undefined)}
          />
        )}
        {!hayProductos && !procesando && (
          <Grid container justifyContent="center">
            <h3>{intlRef.current.formatMessage({ id: "sin_productos_registrados" })}</h3>
          </Grid>
        )}
      </MDBox>

      <Footer />

      <Backdrop sx={{ color: "#fff", zIndex: 9999999 }} open={procesando}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ModalConfirm
        open={catalogo.eliminar.abierto}
        onAcept={catalogo.eliminar.confirmar}
        onCancel={catalogo.eliminar.cancelar}
        text={intlRef.current.formatMessage({ id: "eliminar_producto_confirmar" })}
        title=""
        cancelText="No"
        acceptText={intlRef.current.formatMessage({ id: "si" })}
      />

      <ModalEditarProducto
        edicion={edicion}
        plataforma={plataforma}
        proveedores={catalogos.proveedores}
        categorias={catalogos.categorias}
        procesando={procesando}
      />
      <ModalEditarColor recurso={edicion.colores} {...recursoProps} />
      <ModalEditarTalla recurso={edicion.tallas} {...recursoProps} />
      <ModalEditarMonto recurso={edicion.montos} {...recursoProps} />
      <ModalVistaFoto foto={edicion.vistaFoto.foto} onCerrar={edicion.vistaFoto.cerrar} />

      <ModalImportarExcel excel={excel} />

      <ModalComponent
        handleClose={catalogo.vistaPrevia.cerrar}
        isOpen={catalogo.vistaPrevia.abierta}
        key="alertaVerDatos"
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {catalogo.vistaPrevia.producto && (
            <DetallesProductoModal
              verProducto={catalogo.vistaPrevia.producto as ProductoDetalle}
            />
          )}
        </Grid>
      </ModalComponent>

      <ModalBusquedaInteligente bi={catalogo.busquedaInteligente} categorias={catalogos.categorias} />

      <ModalBusquedaFechas
        abierto={busqueda.modalFechasAbierto}
        onCerrar={busqueda.cerrarModalFechas}
        fecha1={busqueda.fecha1}
        setFecha1={busqueda.setFecha1}
        fecha2={busqueda.fecha2}
        setFecha2={busqueda.setFecha2}
        onBuscar={busqueda.buscarPorFechas}
        deshabilitado={procesando}
      />

      <ModalBitacora
        bitacora={catalogo.bitacora}
        nombreProducto={catalogo.vistaPrevia.producto?.nombre_producto}
        procesando={procesando}
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

export default CatalogoProductos;

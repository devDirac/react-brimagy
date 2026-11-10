import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { StoreType } from "types/genericTypes";
import { setAuth } from "actions/auth";
import {
  eliminarProductoHttp,
  getBitacoraProductoPorIdHttp,
  getBusquedaInteligenteHttp,
  getCatalogoProductosHttp,
  marcarDisponibleHttp,
  marcarNoDisponibleHttp,
} from "actions/productos";
import { getProveedoresHttp } from "actions/proveedores";
import { getCategoriasHttp } from "actions/categorias";
import { getPlataformasHttp, getVariablesGlobalesPorPlataformaHttp } from "actions/configuracion";
import { RETRASO_BUSQUEDA_MS, STOCK_DISPONIBLE } from "../constants";
import { descargarPlantillaExcel, exportarProductosExcel } from "../utils";
import { useAlerta } from "./useAlerta";
import { useCargando } from "./useCargando";
import type {
  FiltrosProductos,
  Producto,
  TipoCatalogo,
  VariablesGlobales,
  Visualizacion,
} from "../types";

/** Listado del catálogo con sus filtros, catálogos auxiliares y acciones sobre cada producto. */
export const useCatalogoProductos = () => {
  const location = useLocation();
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const esSuperAdmin = tipoUsuario === 7;

  const tipoCatalogo: TipoCatalogo = location.pathname.includes("productos-digitales")
    ? "digital"
    : location.pathname.includes("productos-fisicos")
    ? "fisico"
    : "todos";

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const alerta = useAlerta();
  const cargando = useCargando(alerta.mostrar);
  const { ejecutar, intlRef } = cargando;
  const t = (id: string) => intlRef.current.formatMessage({ id });

  const [productos, setProductos] = useState<Producto[]>([]);
  const [visualizacion, setVisualizacion] = useState<Visualizacion>("cuadricula");

  // Catálogos auxiliares
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [plataformas, setPlataformas] = useState<any[]>([]);
  const [variablesGlobales, setVariablesGlobales] = useState<VariablesGlobales>(null);

  // Búsqueda por texto y fechas
  const [buscador, setBuscador] = useState("");
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [modalFechasAbierto, setModalFechasAbierto] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>();

  // Búsqueda inteligente
  const [modalBIAbierto, setModalBIAbierto] = useState(false);
  const [puntosBI, setPuntosBI] = useState("");
  const [categoriaBI, setCategoriaBI] = useState("");
  const [procesandoBI, setProcesandoBI] = useState(false);

  // Vista previa y bitácora
  const [verProducto, setVerProducto] = useState<Producto | null>(null);
  const [modalVistaAbierto, setModalVistaAbierto] = useState(false);
  const [bitacora, setBitacora] = useState<any[] | null>(null);
  const [modalBitacoraAbierto, setModalBitacoraAbierto] = useState(false);

  // Eliminar
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null);

  const getProductos = useCallback(
    async (filtros: FiltrosProductos = {}) => {
      const datos = await ejecutar(() =>
        getCatalogoProductosHttp(
          tipoCatalogo,
          filtros.search,
          filtros.fecha1 ? new Date(filtros.fecha1) : undefined,
          filtros.fecha2 ? new Date(filtros.fecha2) : undefined,
          plataforma
        )
      );
      if (datos) setProductos(datos as Producto[]);
    },
    [ejecutar, tipoCatalogo, plataforma]
  );

  const cargarCatalogos = useCallback(async () => {
    await Promise.all([
      ejecutar(async () => setProveedores(await getProveedoresHttp())),
      ejecutar(async () => setCategorias(await getCategoriasHttp(plataforma))),
      ejecutar(async () => setPlataformas(await getPlataformasHttp())),
      ejecutar(async () =>
        setVariablesGlobales(await getVariablesGlobalesPorPlataformaHttp({ plataforma }))
      ),
    ]);
  }, [ejecutar, plataforma]);

  useEffect(() => {
    getProductos();
    cargarCatalogos();
  }, [plataforma, tipoCatalogo]);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const cambiarVisualizacion = (_: React.MouseEvent<HTMLElement>, nueva: Visualizacion | null) => {
    if (nueva) setVisualizacion(nueva);
  };

  const handleBuscadorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBuscador(valor);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(
      () => getProductos({ search: valor, fecha1, fecha2 }),
      RETRASO_BUSQUEDA_MS
    );
  };

  const buscarPorFechas = () => {
    getProductos({ fecha1, fecha2 });
    setModalFechasAbierto(false);
  };

  const busquedaInteligente = async () => {
    try {
      setProcesandoBI(true);
      const resultados = await getBusquedaInteligenteHttp({
        puntos: puntosBI,
        categoria: categoriaBI,
        plataforma,
        tipo_producto: tipoCatalogo,
      });
      const encontrados = (resultados ?? []) as Producto[];
      setProductos(encontrados);
      setModalBIAbierto(false);
      alerta.mostrar(`Se encontraron ${encontrados.length} productos relacionados`);
    } catch (error) {
      alerta.mostrar(cargando.mensajeDeError(error, "get_elementos_error"));
    } finally {
      setProcesandoBI(false);
    }
  };

  const abrirVistaPrevia = (producto: Producto) => {
    setVerProducto(producto);
    setModalVistaAbierto(true);
  };

  const abrirBitacora = async (producto: Producto) => {
    setVerProducto(producto);
    setModalBitacoraAbierto(true);
    const datos = await ejecutar(() =>
      getBitacoraProductoPorIdHttp({ id_producto: producto.id, plataforma })
    );
    if (datos) setBitacora(datos as any[]);
  };

  const confirmarEliminar = async () => {
    if (productoAEliminar === null) return;
    const id = productoAEliminar;
    setProductoAEliminar(null);

    const ok = await ejecutar(async () => {
      await eliminarProductoHttp(id);
      return true;
    }, "producto_eliminado_error");
    if (!ok) return;

    await getProductos();
    alerta.mostrar(t("producto_eliminado_correctamente"));
  };

  /** Marca el producto como disponible o no disponible (según su stock actual). */
  const cambiarDisponibilidad = async (producto: Producto) => {
    const disponible = producto.stock !== 0;
    const datos = { id_producto: producto.id, plataforma };

    const ok = await ejecutar(
      async () => {
        await (disponible ? marcarNoDisponibleHttp(datos) : marcarDisponibleHttp(datos));
        return true;
      },
      disponible ? "producto_no_disponible_error" : "producto_disponible_error"
    );
    if (!ok) return;

    const nuevoStock = disponible ? 0 : STOCK_DISPONIBLE;
    setProductos((prev) =>
      prev.map((p) => (p.id === producto.id ? { ...p, stock: nuevoStock } : p))
    );
    alerta.mostrar(
      t(disponible ? "producto_no_disponible_correctamente" : "producto_disponible_correctamente")
    );
  };

  /** Con productos, exporta el catálogo; sin productos, descarga la plantilla vacía. */
  const descargarExcel = () =>
    productos.length > 0
      ? ejecutar(
          () => exportarProductosExcel(productos, variablesGlobales),
          () => "Error al exportar los productos"
        )
      : ejecutar(descargarPlantillaExcel, () => "Error al generar la plantilla");

  return {
    plataforma,
    tipoCatalogo,
    esSuperAdmin,
    alerta,
    cargando,
    productos,
    getProductos,
    visualizacion,
    cambiarVisualizacion,
    catalogos: {
      proveedores,
      categorias,
      plataformas,
      variablesGlobales,
      setProveedores,
      setCategorias,
      setPlataformas,
    },
    busqueda: {
      buscador,
      handleBuscadorChange,
      fecha1,
      setFecha1,
      fecha2,
      setFecha2,
      buscarPorFechas,
      modalFechasAbierto,
      abrirModalFechas: () => setModalFechasAbierto(true),
      cerrarModalFechas: () => setModalFechasAbierto(false),
    },
    busquedaInteligente: {
      modalAbierto: modalBIAbierto,
      abrir: () => setModalBIAbierto(true),
      cerrar: () => setModalBIAbierto(false),
      puntos: puntosBI,
      setPuntos: setPuntosBI,
      categoria: categoriaBI,
      setCategoria: setCategoriaBI,
      procesando: procesandoBI,
      buscar: busquedaInteligente,
    },
    vistaPrevia: {
      producto: verProducto,
      abierta: modalVistaAbierto,
      abrir: abrirVistaPrevia,
      cerrar: () => setModalVistaAbierto(false),
    },
    bitacora: {
      registros: bitacora,
      abierta: modalBitacoraAbierto,
      abrir: abrirBitacora,
      cerrar: () => setModalBitacoraAbierto(false),
    },
    eliminar: {
      abierto: productoAEliminar !== null,
      solicitar: (producto: Producto) => setProductoAEliminar(producto.id),
      confirmar: confirmarEliminar,
      cancelar: () => setProductoAEliminar(null),
    },
    cambiarDisponibilidad,
    descargarExcel,
  };
};

export type CatalogoProductosState = ReturnType<typeof useCatalogoProductos>;

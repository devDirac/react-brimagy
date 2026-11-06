import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { getErrorHttpMessage } from "utils";
import { StoreType } from "types/genericTypes";
import { setAuth } from "actions/auth";
import {
  actualizarResumenCanjes,
  enviarValidacionHttp,
  enviarValidacionSinProveedorHttp,
  getCanjesHttp,
} from "actions/canjes";
import { ESTADO_NOTIFICACION_ENVIADA, ESTADO_VALIDADO, RETRASO_BUSQUEDA_MS } from "../constants";
import { agruparCanjes, formatearFilas, ordenarPendientesPrimero } from "../utils";
import type {
  CanjeAgrupado,
  FilaCanje,
  FiltrosCanjes,
  TipoProducto,
  Visualizacion,
} from "../types";

/** Estado y acciones de la lista de canjes: carga, búsqueda, detalle y validación. */
export const useListaCanjes = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const location = useLocation();

  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");
  const tipoProducto: TipoProducto = location.pathname.includes("canjes-digitales")
    ? "digital"
    : "fisico";

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const [canjes, setCanjes] = useState<FilaCanje[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [visualizacion, setVisualizacion] = useState<Visualizacion>("cuadricula");

  // Alerta general
  const [alertaAbierta, setAlertaAbierta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const mostrarAlerta = useCallback((mensaje: string) => {
    setMensajeAlerta(mensaje);
    setAlertaAbierta(true);
  }, []);

  // Búsqueda
  const [buscador, setBuscador] = useState("");
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [modalFechasAbierto, setModalFechasAbierto] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>();

  // Detalle del canje
  const [verCanje, setVerCanje] = useState<CanjeAgrupado | null>(null);
  const [modalCanjeAbierto, setModalCanjeAbierto] = useState(false);
  const [pdfAbierto, setPdfAbierto] = useState(false);
  const [procesandoIdentidad, setProcesandoIdentidad] = useState(false);
  const [procesandoIdentidadDirecto, setProcesandoIdentidadDirecto] = useState(false);

  const refrescarResumen = useCallback(
    () => actualizarResumenCanjes(dispatch, plataforma, tipoProducto),
    [dispatch, plataforma, tipoProducto]
  );

  const getCanjes = useCallback(
    async (filtros: FiltrosCanjes = {}) => {
      try {
        setProcesando(true);
        const filas = await getCanjesHttp(
          tipoProducto,
          filtros.search || undefined,
          filtros.fecha1 ? new Date(filtros.fecha1) : undefined,
          filtros.fecha2 ? new Date(filtros.fecha2) : undefined,
          plataforma
        );
        setCanjes(formatearFilas(filas as FilaCanje[]));
      } catch (error) {
        mostrarAlerta(
          getErrorHttpMessage(error) || intl.formatMessage({ id: "get_elementos_error" })
        );
      } finally {
        setProcesando(false);
      }
    },
    [tipoProducto, plataforma, mostrarAlerta, intl]
  );

  useEffect(() => {
    getCanjes();
    refrescarResumen();
  }, [plataforma, tipoProducto]);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const canjesAgrupados = useMemo(
    () => ordenarPendientesPrimero(agruparCanjes(canjes)),
    [canjes]
  );

  const cambiarVisualizacion = (_: React.MouseEvent<HTMLElement>, nueva: Visualizacion | null) => {
    if (nueva) setVisualizacion(nueva);
  };

  // Búsqueda con debounce: espera a que el usuario deje de escribir
  const handleBuscadorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBuscador(valor);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(
      () => getCanjes({ search: valor, fecha1, fecha2 }),
      RETRASO_BUSQUEDA_MS
    );
  };

  const buscarPorFechas = () => {
    getCanjes({ search: buscador, fecha1, fecha2 });
    setModalFechasAbierto(false);
  };

  // Estable para que las columnas de la tabla no se reconstruyan en cada render
  const abrirCanje = useCallback((canje: CanjeAgrupado) => {
    setVerCanje(canje);
    setModalCanjeAbierto(true);
  }, []);

  // Refleja el nuevo estatus en el modal abierto y en la lista, sin recargar
  const marcarEstado = (idCanje: number, estado: string) => {
    setVerCanje((prev) => (prev && prev.id === idCanje ? { ...prev, estado_validacion: estado } : prev));
    setCanjes((prev) => prev.map((f) => (f.id === idCanje ? { ...f, estado_validacion: estado } : f)));
  };

  const ejecutarValidacion = async (
    peticion: (datos: any) => Promise<unknown>,
    datos: any,
    opciones: {
      estado: string;
      setCargando: (v: boolean) => void;
      mensajeExito: string;
      mensajeError: string;
    }
  ) => {
    try {
      opciones.setCargando(true);
      await peticion(datos);
      marcarEstado(datos?.id ?? verCanje?.id, opciones.estado);
      refrescarResumen();
      mostrarAlerta(intl.formatMessage({ id: opciones.mensajeExito }));
    } catch (error) {
      mostrarAlerta(
        getErrorHttpMessage(error) || intl.formatMessage({ id: opciones.mensajeError })
      );
    } finally {
      opciones.setCargando(false);
    }
  };

  const validarIdentidad = (datos: any) =>
    ejecutarValidacion(enviarValidacionHttp, datos, {
      estado: ESTADO_NOTIFICACION_ENVIADA,
      setCargando: setProcesandoIdentidad,
      mensajeExito: "validacion_enviada_correctamente",
      mensajeError: "validacion_enviada_error",
    });

  const validarIdentidadSinProveedor = (datos: any) =>
    ejecutarValidacion(enviarValidacionSinProveedorHttp, datos, {
      estado: ESTADO_VALIDADO,
      setCargando: setProcesandoIdentidadDirecto,
      mensajeExito: "canje_validado_correctamente",
      mensajeError: "canje_validado_error",
    });

  return {
    intl,
    procesando,
    canjes: canjesAgrupados,
    visualizacion,
    cambiarVisualizacion,

    busqueda: {
      buscador,
      handleBuscadorChange,
      fecha1,
      setFecha1,
      fecha2,
      setFecha2,
      buscarPorFechas,
      modalAbierto: modalFechasAbierto,
      abrirModal: () => setModalFechasAbierto(true),
      cerrarModal: () => setModalFechasAbierto(false),
    },

    detalle: {
      verCanje,
      abrirCanje,
      modalAbierto: modalCanjeAbierto,
      cerrarModal: () => setModalCanjeAbierto(false),
      pdfAbierto,
      abrirPdf: () => setPdfAbierto(true),
      cerrarPdf: () => setPdfAbierto(false),
      validarIdentidad,
      validarIdentidadSinProveedor,
      procesandoIdentidad,
      procesandoIdentidadDirecto,
    },

    alerta: {
      abierta: alertaAbierta,
      mensaje: mensajeAlerta,
      cerrar: () => setAlertaAbierta(false),
    },
  };
};

export type ListaCanjesState = ReturnType<typeof useListaCanjes>;

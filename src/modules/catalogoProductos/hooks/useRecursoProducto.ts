import { useCallback, useState } from "react";
import type { Alerta } from "./useAlerta";
import type { Cargando } from "./useCargando";
import type { RecursoProducto } from "../types";

type Peticion = (datos: any) => Promise<any>;

export interface ConfigRecurso {
  obtener: Peticion;
  activar: Peticion;
  desactivar: Peticion;
  /** Alta o edición (colores, tallas, montos). */
  crearEditar?: Peticion;
  /** Campo de `datos` que indica que es edición (ej. "id_color"). */
  campoEdicion?: string;
  /** Subida de archivos (fotos). */
  subir?: (data: FormData) => Promise<any>;
  /** Cómo convertir la respuesta de `subir` en la lista; si regresa null, la lista no cambia. */
  normalizarSubida?: (respuesta: any) => RecursoProducto[] | null;
  mensajes: {
    /** Textos literales que ya se mostraban así en la versión anterior. */
    creado?: string;
    editado?: string;
    /** El resto son ids de react-intl. */
    errorCrear?: string;
    errorEditar?: string;
    subido?: string;
    errorSubir?: string;
    activado: string;
    errorActivar: string;
    desactivado: string;
    errorDesactivar: string;
  };
}

const normalizarPorDefecto = (r: any) => (Array.isArray(r) ? r : null);

/**
 * Estado y acciones de un recurso del producto en edición (colores, tallas, montos o fotos).
 * Sustituye la lógica que estaba repetida para cada uno en useListaProductos.
 */
export const useRecursoProducto = (config: ConfigRecurso, alerta: Alerta, cargando: Cargando) => {
  const { ejecutar, mensajeDeError, intlRef } = cargando;
  const t = (id: string) => intlRef.current.formatMessage({ id });

  const [items, setItems] = useState<RecursoProducto[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [enEdicion, setEnEdicion] = useState<RecursoProducto | null>(null);
  const [archivos, setArchivos] = useState<File[]>([]);

  const { obtener } = config;
  const cargar = useCallback(
    async (datos: { id_producto: number }) => {
      const lista = await ejecutar(() => obtener(datos));
      if (lista) setItems(lista);
    },
    [ejecutar, obtener]
  );

  /** Alta o edición; al terminar recarga la lista y, si era edición, cierra el modal. */
  const guardar = async (datos: any) => {
    if (!config.crearEditar) return;
    const esEdicion = !!(config.campoEdicion && datos?.[config.campoEdicion]);
    const { mensajes } = config;

    try {
      setProcesando(true);
      const respuesta = await config.crearEditar(datos);
      await cargar({ id_producto: respuesta?.data?.id_producto ?? datos?.id_producto_dirac });
      alerta.mostrar((esEdicion ? mensajes.editado : mensajes.creado) ?? "");
      if (esEdicion) setEnEdicion(null);
    } catch (error) {
      alerta.mostrar(
        mensajeDeError(error, (esEdicion ? mensajes.errorEditar : mensajes.errorCrear) ?? "")
      );
    } finally {
      setProcesando(false);
    }
  };

  const subir = async (data: FormData) => {
    if (!config.subir) return;
    const { mensajes } = config;

    try {
      setProcesando(true);
      const respuesta = await config.subir(data);
      const lista = (config.normalizarSubida ?? normalizarPorDefecto)(respuesta);
      if (lista) setItems(lista);
      if (mensajes.subido) alerta.mostrar(t(mensajes.subido));
    } catch (error) {
      alerta.mostrar(mensajeDeError(error, mensajes.errorSubir ?? "get_elementos_error"));
    } finally {
      setProcesando(false);
    }
  };

  /** Activa o desactiva y refleja el nuevo status en la lista. */
  const cambiarEstado = async (datos: any, activar: boolean) => {
    const { mensajes } = config;
    const actualizado = await ejecutar(
      () => (activar ? config.activar(datos) : config.desactivar(datos)),
      activar ? mensajes.errorActivar : mensajes.errorDesactivar
    );
    if (!actualizado) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === actualizado.id ? { ...item, status: actualizado.status } : item
      )
    );
    alerta.mostrar(t(activar ? mensajes.activado : mensajes.desactivado));
  };

  return {
    items,
    procesando,
    cargar,
    guardar,
    subir,
    activar: (datos: any) => cambiarEstado(datos, true),
    desactivar: (datos: any) => cambiarEstado(datos, false),
    archivos,
    setArchivos,
    enEdicion,
    abrirEdicion: (item: RecursoProducto) => setEnEdicion(item),
    cerrarEdicion: () => setEnEdicion(null),
  };
};

export type Recurso = ReturnType<typeof useRecursoProducto>;

/** Campos que cambian de un producto a otro dentro del mismo canje. */
export const CAMPOS_PRODUCTO = [
  "id_producto",
  "id_proveedor",
  "award_id",
  "tipo_producto",
  "nombre_premio",
  "sku",
  "sku_catalogo",
  "size",
  "color",
  "category",
  "number_of_awards",
  "costo_premio",
  "puntos_canjeados",
  "estado_validacion",
] as const;

/** Prioridad para el estatus de un canje cuyos productos tienen estatus distintos. */
export const ORDEN_ESTADOS = ["notificacion_enviada", "solicitud_enviada", "identidad_validada"];

export const ESTADO_NOTIFICACION_ENVIADA = "notificacion_enviada";
export const ESTADO_VALIDADO = "identidad_validada";

export const OPCIONES_POR_PAGINA = [10, 20, 30];
export const RETRASO_BUSQUEDA_MS = 500;

/** Estilos de la vista de tabla */
export const ESTILOS_TABLA = {
  encabezadoFondo: "#a5eb2f",
  encabezadoTexto: "#000",
  encabezadoTamano: "0.8rem",
  celdaTamano: "0.8rem",
};

export { ESTADOS_VALIDACION, ESTADO_SIN_VALIDAR } from "./estadosValidacion";

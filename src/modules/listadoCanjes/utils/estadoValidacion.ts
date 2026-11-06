import { ESTADOS_VALIDACION, ESTADO_SIN_VALIDAR } from "../constants";
import type { EstadoValidacionVisual } from "../types";

export const getEstadoValidacion = (estado?: string | null): EstadoValidacionVisual =>
  (estado && ESTADOS_VALIDACION[estado.toUpperCase()]) || {
    ...ESTADO_SIN_VALIDAR,
    label: estado ? estado.toUpperCase() : ESTADO_SIN_VALIDAR.label,
  };

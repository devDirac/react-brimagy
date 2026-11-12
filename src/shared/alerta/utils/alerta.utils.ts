import { createElement, type ReactNode } from "react";
import { darken } from "@mui/material/styles";
import { ALERTA_DEFAULTS, ICONOS_POR_TIPO, TIPOS_ALERTA } from "../constants/alerta.constants";
import type {
  EstilosAlerta,
  ParametrosEstiloAlerta,
  TipoAlerta,
} from "../types/alerta.types";

/** Regresa un tipo válido; si llega algo desconocido usa el de por defecto */
export const normalizarTipo = (tipo?: string): TipoAlerta =>
  TIPOS_ALERTA.includes(tipo as TipoAlerta) ? (tipo as TipoAlerta) : ALERTA_DEFAULTS.tipo;

/** Icono de tabler por defecto para el tipo */
export const obtenerIconoPorDefecto = (tipo: TipoAlerta, compacta = false): ReactNode =>
  createElement(ICONOS_POR_TIPO[tipo], {
    size: compacta ? ALERTA_DEFAULTS.tamanoIconoCompacta : ALERTA_DEFAULTS.tamanoIcono,
    stroke: ALERTA_DEFAULTS.grosorIcono,
  });

/**
 * Icono final: el personalizado si viene, ninguno si es `false`,
 * o el de tabler del tipo si no se pasó nada.
 */
export const resolverIcono = (
  tipo: TipoAlerta,
  icono?: ReactNode,
  compacta = false
): ReactNode => {
  if (icono === false) return false;
  if (icono === undefined || icono === null) return obtenerIconoPorDefecto(tipo, compacta);
  return icono;
};

/** Oscurece un color sin romper si MUI no soporta el formato (ej. "transparent") */
export const oscurecerSeguro = (color: string, cantidad: number): string => {
  try {
    return darken(color, cantidad);
  } catch {
    return color;
  }
};

export const crearEstilosAlerta = ({
  compacta,
  fondo,
  fondoHover,
  colorTexto,
  colorIcono,
}: ParametrosEstiloAlerta): EstilosAlerta => ({
  alerta: {
    alignItems: "center",
    textAlign: "left",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
    ...(compacta && { py: 0.25, px: 1.5 }),
    ...(fondo && { backgroundColor: fondo }),
    ...(colorTexto && { color: colorTexto }),
    "& .MuiAlert-icon": {
      alignItems: "center",
      opacity: 1,
      ...(compacta && { mr: 1, py: 0.5 }),
      ...((colorIcono || colorTexto) && { color: colorIcono || colorTexto }),
    },
    "& .MuiAlert-message": {
      overflow: "visible",
      fontSize: compacta ? ALERTA_DEFAULTS.tamanoTextoCompacta : ALERTA_DEFAULTS.tamanoTexto,
      lineHeight: 1.4,
      ...(compacta && { py: 0.5 }),
    },
    "& .MuiAlert-action": {
      alignItems: "center",
      pt: 0,
      ...(compacta && { py: 0.5 }),
    },
    ...(fondoHover && {
      "&:hover": { backgroundColor: fondoHover },
    }),
  },
  titulo: {
    fontWeight: 700,
    fontSize: compacta ? ALERTA_DEFAULTS.tamanoTituloCompacta : ALERTA_DEFAULTS.tamanoTitulo,
    lineHeight: 1.3,
    mt: 0,
    mb: compacta ? 0 : 0.25,
    color: colorTexto ?? "inherit",
  },
});

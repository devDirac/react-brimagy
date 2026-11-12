import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import type { ComponenteIcono, TipoAlerta, VarianteAlerta } from "../types/alerta.types";

export const TIPOS_ALERTA: TipoAlerta[] = ["success", "info", "warning", "error"];

export const ALERTA_DEFAULTS = {
  tipo: "info" as TipoAlerta,
  variante: "standard" as VarianteAlerta,
  tamanoIcono: 22,
  tamanoIconoCompacta: 18,
  grosorIcono: 2,
  /** Tamaños de texto (px): normal / compacta */
  tamanoTitulo: 14,
  tamanoTituloCompacta: 13,
  tamanoTexto: 14,
  tamanoTextoCompacta: 12.5,
  /** Oscurecimiento del hover cuando hay fondoAlert pero no hoverAlert */
  oscurecerHover: 0.05,
} as const;

/** Icono de tabler que se usa por defecto en cada tipo */
export const ICONOS_POR_TIPO: Record<TipoAlerta, ComponenteIcono> = {
  success: IconCircleCheck,
  info: IconInfoCircle,
  warning: IconAlertTriangle,
  error: IconAlertCircle,
};

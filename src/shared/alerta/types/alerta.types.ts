import type { ComponentType, ReactNode } from "react";
import type { AlertColor } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";

/** Tipos disponibles en el Alert de MUI */
export type TipoAlerta = AlertColor; // "success" | "info" | "warning" | "error"

export type VarianteAlerta = "standard" | "filled" | "outlined";

/** Componente de icono (por ejemplo, cualquier icono de @tabler/icons-react) */
export type ComponenteIcono = ComponentType<{ size?: number | string; stroke?: number | string }>;

export interface AlertaProps {
  /** success | info | warning | error. Por defecto "info" */
  tipo?: TipoAlerta;
  /** Título en negritas arriba del texto */
  titulo?: ReactNode;
  /** Texto del mensaje. Si no se pasa, se usa children */
  texto?: ReactNode;
  children?: ReactNode;
  /**
   * Icono personalizado (ej. <IconPackage stroke={2} />).
   * Si no se pasa, se usa el icono de tabler del tipo. Con `false` no se muestra icono.
   */
  icono?: ReactNode;
  /** Color de fondo. Si no se pasa, se usa el del tipo de MUI */
  fondoAlert?: string;
  /** Fondo al pasar el mouse. Si hay fondoAlert y no se pasa, se oscurece un poco */
  hoverAlert?: string;
  /** Color del texto y del título */
  colorTexto?: string;
  /** Color del icono. Por defecto igual que colorTexto */
  colorIcono?: string;
  /** standard | filled | outlined. Por defecto "standard" */
  variante?: VarianteAlerta;
  /** Versión más chica: menos padding, textos e icono más pequeños */
  compacta?: boolean;
  /** Si se pasa, muestra la X para cerrar */
  onClose?: () => void;
  /** Contenido a la derecha (ej. un botón) */
  accion?: ReactNode;
  /** Estilos extra encima de los de la alerta */
  sx?: SxProps<Theme>;
}

export type EstiloAlerta = SystemStyleObject<Theme>;

export interface EstilosAlerta {
  alerta: EstiloAlerta;
  titulo: EstiloAlerta;
}

export interface ParametrosEstiloAlerta {
  compacta: boolean;
  fondo?: string;
  fondoHover?: string;
  colorTexto?: string;
  colorIcono?: string;
}

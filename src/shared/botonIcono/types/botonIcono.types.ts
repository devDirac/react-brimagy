import type { MouseEvent, ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";

/**
 * - soloIcono: solo icono (admite tooltip)
 * - unTexto:   icono + un texto más grande, centrado verticalmente
 * - dosTextos: icono + dos textos tipo caption del mismo tamaño
 */
export type VarianteBotonIcono = "soloIcono" | "unTexto" | "dosTextos";

export interface BotonIconoProps {
  icono: ReactNode;
  textoUno?: ReactNode;
  textoDos?: ReactNode;
  tooltipTexto?: string;
  onClick?: (evento: MouseEvent<HTMLButtonElement>) => void;
  colorTexto?: string;
  colorIcono?: string;
  fondoBoton?: string;
  fondoHover?: string;
  degradado?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  sx?: SxProps<Theme>;
}

export type EstiloBotonIcono = SystemStyleObject<Theme>;

export interface EstilosBotonIcono {
  boton: EstiloBotonIcono;
  icono: EstiloBotonIcono;
  contenedorTexto: EstiloBotonIcono;
  texto: EstiloBotonIcono;
}

export interface ParametrosEstiloBotonIcono {
  variante: VarianteBotonIcono;
  fondo: string;
  fondoHover: string;
  colorTexto: string;
  colorIcono: string;
}

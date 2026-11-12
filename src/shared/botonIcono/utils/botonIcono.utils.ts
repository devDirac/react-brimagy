import type { ReactNode } from "react";
import { darken, lighten } from "@mui/material/styles";
import type { VarianteBotonIcono } from "../types/botonIcono.types";

export const tieneContenido = (texto?: ReactNode): boolean =>
  texto !== undefined && texto !== null && texto !== false && texto !== "";

export const obtenerVariante = (
  textoUno?: ReactNode,
  textoDos?: ReactNode
): VarianteBotonIcono => {
  const hayUno = tieneContenido(textoUno);
  const hayDos = tieneContenido(textoDos);
  if (hayUno && hayDos) return "dosTextos";
  if (hayUno || hayDos) return "unTexto";
  return "soloIcono";
};

export const obtenerTextos = (
  variante: VarianteBotonIcono,
  textoUno?: ReactNode,
  textoDos?: ReactNode
): ReactNode[] => {
  if (variante === "dosTextos") return [textoUno, textoDos];
  if (variante === "unTexto") return [tieneContenido(textoUno) ? textoUno : textoDos];
  return [];
};

export const oscurecerSeguro = (color: string, cantidad: number): string => {
  try {
    return darken(color, cantidad);
  } catch {
    return color;
  }
};

const aclararSeguro = (color: string, cantidad: number): string => {
  try {
    return lighten(color, cantidad);
  } catch {
    return color;
  }
};

export const construirFondo = (color: string, degradado: boolean): string => {
  if (!degradado) return color;
  const claro = aclararSeguro(color, 0.3);
  return claro === color ? color : `linear-gradient(135deg, ${color} 0%, ${claro} 100%)`;
};

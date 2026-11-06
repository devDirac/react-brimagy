import { numericFormatter } from "react-number-format";

export const truncarTexto = (texto?: string, limite = 60): string => {
  if (!texto) return "";
  return texto.length > limite ? `${texto.slice(0, limite)}...` : texto;
};

export const formatearNumero = (valor: unknown, decimales = 2, prefijo = "", fijo = true) =>
  numericFormatter(`${valor}`, {
    thousandSeparator: ",",
    decimalScale: decimales,
    fixedDecimalScale: fijo,
    prefix: prefijo,
  });

/** Quita acentos y cambia espacios por guiones bajos (para file_path de categorías). */
export const normalizarNombre = (texto: string): string =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/\s+/g, "_");

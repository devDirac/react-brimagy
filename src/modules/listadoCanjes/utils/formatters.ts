import dayjs from "dayjs";
import "dayjs/locale/es";
import moment from "moment";
import { numericFormatter } from "react-number-format";
import type { FilaCanje } from "../types";

export const formatearFecha = (fecha?: string | null) =>
  fecha ? dayjs(fecha).locale("es").format("DD MMM YYYY, HH:mm") : "Sin fecha";

export const formatearPuntos = (puntos?: number | string | null) =>
  numericFormatter(String(puntos ?? 0), { thousandSeparator: "," });

export const formatearFilas = (filas: FilaCanje[]): FilaCanje[] =>
  filas.map((e) => ({
    ...e,
    costo_con_iva_format: numericFormatter(`${e?.costo_con_iva}`, {
      thousandSeparator: ",",
      decimalScale: 2,
      fixedDecimalScale: true,
      prefix: "$",
    }),
    fecha_creacion: moment(e?.fecha_ejecucion).format("DD-MM-YYYY"),
  }));

import type { CSSProperties } from "react";
import type { Column, Table } from "@tanstack/react-table";

export interface ColoresTabla {
    etiqueta: string;
    borde: string;
    fondoEncabezado: string;
    fondoFila: string;
    fondoPie: string;
    sombraFijado: string;
}

export const obtenerColoresTabla = (darkMode: boolean): ColoresTabla => ({
    etiqueta: darkMode ? "#64748b" : "#fff",
    borde: darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
    fondoEncabezado: darkMode ? "#232b3e" : "#041d45",
    fondoFila: darkMode ? "#1c2438" : "#ffffff",
    fondoPie: darkMode ? "#232b3e" : "#f8fafc",
    sombraFijado: darkMode ? "rgba(0,0,0,0.45)" : "rgba(15,23,42,0.10)",
});

export type ObtenerEstiloFijado<TFila> = (
    columna: Column<TFila, unknown>,
    fondo: string
) => CSSProperties | undefined;

export const crearObtenerEstiloFijado = <TFila,>(
    tabla: Table<TFila>,
    sombraFijado: string
): ObtenerEstiloFijado<TFila> => {
    const fijacion = tabla.getState().columnPinning;
    const ultimaFijadaIzquierda = (fijacion.left ?? []).slice(-1)[0];
    const primeraFijadaDerecha = (fijacion.right ?? [])[0];

    return (columna, fondo) => {
        const lado = columna.getIsPinned();

        if (lado === false) {
            return undefined;
        }

        const esBorde =
            lado === "left"
                ? columna.id === ultimaFijadaIzquierda
                : columna.id === primeraFijadaDerecha;

        return {
            position: "sticky",
            left: lado === "left" ? columna.getStart("left") : undefined,
            right: lado === "right" ? columna.getAfter("right") : undefined,
            zIndex: 2,
            backgroundColor: fondo,
            boxShadow: esBorde
                ? lado === "left"
                    ? `2px 0 4px ${sombraFijado}`
                    : `-2px 0 4px ${sombraFijado}`
                : undefined,
        };
    };
};

export const anchoDeColumna = <TFila,>(
    columna: Column<TFila, unknown>
): number | string | undefined =>
    columna.getIsPinned() === false
        ? columna.columnDef.meta?.ancho
        : columna.getSize();

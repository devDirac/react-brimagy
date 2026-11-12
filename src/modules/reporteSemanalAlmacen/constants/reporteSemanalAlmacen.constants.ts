export const SEMANA_TODAS = "todas" as const;

export const RETRASO_BUSQUEDA_MS = 350;

export const TAMANO_SIN_PAGINAR = 10000;

/** Colores del chip de la columna Notas, por tipo_envio. */
export const COLORES_TIPO_ENVIO: Record<number, string> = {
    1: "#0ea5e9",
    2: "#7c3aed",
};

export const ANCHOS_REPORTE = {
    producto: 480,
    moneda: 120,
    cantidad: 100,
    notas: 170,
    fecha: 120,
} as const;

export const ANCHO_MINIMO_REPORTE =
    ANCHOS_REPORTE.producto +
    ANCHOS_REPORTE.moneda * 3 +
    ANCHOS_REPORTE.cantidad * 3 +
    ANCHOS_REPORTE.notas +
    ANCHOS_REPORTE.fecha;
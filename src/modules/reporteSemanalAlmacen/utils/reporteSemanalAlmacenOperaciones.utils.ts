import { coincideBusqueda } from "../../../shared/table";
import { SEMANA_TODAS } from "../constants/reporteSemanalAlmacen.constants";
import type {
    FilaReporteSemanal,
    GrupoProveedor,
    ReporteSemanalAlmacen,
    SemanaSeleccionada,
    TotalesReporteSemanal,
} from "../types/reporteSemanalAlmacen.types";

const TOTALES_VACIOS: TotalesReporteSemanal = {
    registros: 0,
    cantidadGestionada: 0,
    entrega: 0,
    faltante: 0,
    total: 0,
};

export const calcularTotales = (filas: FilaReporteSemanal[]): TotalesReporteSemanal =>
    filas.reduce<TotalesReporteSemanal>(
        (acc, f) => ({
            registros: acc.registros + 1,
            cantidadGestionada: acc.cantidadGestionada + f.cantidadGestionada,
            entrega: acc.entrega + f.entrega,
            faltante: acc.faltante + (f.esUltimo ? f.faltante : 0),
            total: Math.round((acc.total + f.total) * 100) / 100,
        }),
        TOTALES_VACIOS
    );

export const sumarTotales = (lista: TotalesReporteSemanal[]): TotalesReporteSemanal =>
    lista.reduce<TotalesReporteSemanal>(
        (acc, t) => ({
            registros: acc.registros + t.registros,
            cantidadGestionada: acc.cantidadGestionada + t.cantidadGestionada,
            entrega: acc.entrega + t.entrega,
            faltante: acc.faltante + t.faltante,
            total: Math.round((acc.total + t.total) * 100) / 100,
        }),
        TOTALES_VACIOS
    );

/** Texto en el que busca el buscador general. */
const textoBuscable = (f: FilaReporteSemanal): string =>
    [f.nombreProveedor, f.plataforma, f.nombreProducto, f.sku, f.marca, f.folioCanje, f.noOrden, f.notas, f.folioFactura].join(" ");

/**
 * Agrupa las filas por semana y, dentro de cada semana, por proveedor.
 * Con "todas" salen los bloques de todas las semanas, en orden.
 */
export const agruparPorProveedor = (
    reporte: ReporteSemanalAlmacen | null,
    semana: SemanaSeleccionada,
    busqueda: string,
    textoSinProveedor: string
): GrupoProveedor[] => {
    if (!reporte) return [];

    const semanas =
        semana === SEMANA_TODAS ? reporte.semanas : reporte.semanas.filter((s) => s.numero === semana);

    return semanas.flatMap(({ numero, etiqueta, fechaInicio, fechaFin, registros }) => {
        const datosSemana = { numero, etiqueta, fechaInicio, fechaFin };
        const porProveedor = new Map<string, FilaReporteSemanal[]>();

        registros
            .filter((f) => coincideBusqueda(textoBuscable(f), busqueda))
            .forEach((f) => {
                const llave = f.idProveedor !== null ? `id-${f.idProveedor}` : `n-${f.nombreProveedor}`;
                porProveedor.set(llave, [...(porProveedor.get(llave) ?? []), f]);
            });

        return Array.from(porProveedor.entries())
            .map(([llave, filas]): GrupoProveedor => ({
                id: `${datosSemana.numero}-${llave}`,
                idProveedor: filas[0].idProveedor,
                nombreProveedor: filas[0].nombreProveedor || textoSinProveedor,
                semana: datosSemana,
                filas,
                totales: calcularTotales(filas),
            }))
            .sort((a, b) => a.nombreProveedor.localeCompare(b.nombreProveedor, "es"));
    });
};

/** Fila del pie de la tabla con los totales */
export const crearFilaTotal = (
    totales: TotalesReporteSemanal,
    etiqueta: string
): FilaReporteSemanal => ({
    id: "total",
    idProductoAlmacen: 0,
    idCanje: 0,
    folioCanje: "",
    noOrden: "",
    semana: null,
    idPlataforma: null,
    plataforma: "",
    idProveedor: null,
    nombreProveedor: "",
    nombreProducto: etiqueta,
    sku: "",
    marca: "",
    precio: null,
    cantidadGestionada: totales.cantidadGestionada,
    entrega: totales.entrega,
    faltante: totales.faltante,
    esContinuacion: false,
    esUltimo: true,
    tipoEnvio: null,
    notas: "",
    fechaFactura: "",
    folioFactura: "",
    precioUnitarioCompra: null,
    total: totales.total,
    estatus: "",
    esTotal: true,
});
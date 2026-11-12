import type {
    FilaReporteSemanal,
    OpcionPeriodo,
    PeriodoReporte,
    ReporteSemanalAlmacen,
    SemanaReporte,
    TotalesReporteSemanal,
} from "../types/reporteSemanalAlmacen.types";

const esObjeto = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const aTexto = (v: unknown): string => (v === undefined || v === null ? "" : String(v).trim());
const aNumero = (v: unknown): number => Number(v) || 0;
const aNumeroONulo = (v: unknown): number | null =>
    v === undefined || v === null || v === "" ? null : Number(v);
const aLista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const aObjeto = (v: unknown): Record<string, unknown> => (esObjeto(v) ? v : {});

const normalizarFila = (r: Record<string, unknown>): FilaReporteSemanal => ({
    id: `${aNumero(r.id_canje)}-${aNumero(r.id_producto)}`,
    idProductoAlmacen: aNumero(r.id_producto_almacen),
    idCanje: aNumero(r.id_canje),
    folioCanje: aTexto(r.folio_canje),
    noOrden: aTexto(r.no_orden),
    semana: aNumeroONulo(r.semana),
    idProveedor: aNumeroONulo(r.id_proveedor),
    nombreProveedor: aTexto(r.nombre_proveedor),
    nombreProducto: aTexto(r.nombre_producto),
    sku: aTexto(r.sku),
    marca: aTexto(r.marca),
    precio: aNumeroONulo(r.precio),
    cantidadGestionada: aNumero(r.cantidad_gestionada),
    entrega: aNumero(r.entrega),
    faltante: aNumero(r.faltante),
    tipoEnvio: aNumeroONulo(r.tipo_envio),
    notas: aTexto(r.notas),
    fechaFactura: aTexto(r.fecha_factura),
    folioFactura: aTexto(r.folio_factura),
    precioUnitarioCompra: aNumeroONulo(r.precio_unitario_compra),
    total: aNumero(r.total),
    estatus: aTexto(r.estatus),
    esTotal: false,
});

export const normalizarTotales = (v: unknown): TotalesReporteSemanal => {
    const t = aObjeto(v);
    return {
        registros: aNumero(t.registros),
        cantidadGestionada: aNumero(t.cantidad_gestionada),
        entrega: aNumero(t.entrega),
        faltante: aNumero(t.faltante),
        total: aNumero(t.total),
    };
};

const normalizarSemana = (s: Record<string, unknown>): SemanaReporte => ({
    numero: aNumero(s.numero),
    etiqueta: aTexto(s.etiqueta),
    fechaInicio: aTexto(s.fecha_inicio),
    fechaFin: aTexto(s.fecha_fin),
    registros: aLista(s.registros).filter(esObjeto).map(normalizarFila),
    totales: normalizarTotales(s.totales),
});

const normalizarPeriodo = (p: Record<string, unknown>): PeriodoReporte => ({
    id: aNumero(p.id),
    fechaInicio: aTexto(p.fecha_inicio),
    fechaFin: aTexto(p.fecha_fin),
    activo: p.activo === true || aNumero(p.activo) === 1,
    totalSemanas: aNumero(p.total_semanas),
});

export const normalizarReporteSemanal = (respuesta: unknown): ReporteSemanalAlmacen => {
    const r = aObjeto(respuesta);
    return {
        plataforma: aTexto(r.plataforma),
        periodo: normalizarPeriodo(aObjeto(r.periodo)),
        semanas: aLista(r.semanas).filter(esObjeto).map(normalizarSemana),
        totales: normalizarTotales(r.totales),
    };
};

/** Convierte la respuesta de getPeriodos; los más recientes primero. */
export const normalizarPeriodos = (respuesta: unknown): OpcionPeriodo[] =>
    aLista(respuesta)
        .filter(esObjeto)
        .map((p) => ({
            id: aNumero(p.id),
            fechaInicio: aTexto(p.fecha_inicio),
            fechaFin: aTexto(p.fecha_fin),
            activo: aNumero(p.activo) === 1,
        }))
        .sort((a, b) => b.id - a.id);
export type PlataformaReporte = "puntotes" | "club_bohn";

export type SemanaSeleccionada = number | "todas";

export interface FilaReporteSemanal {
    id: string;
    idProductoAlmacen: number;
    idCanje: number;
    folioCanje: string;
    noOrden: string;
    semana: number | null;
    idProveedor: number | null;
    nombreProveedor: string;
    nombreProducto: string;
    sku: string;
    marca: string;
    precio: number | null;
    cantidadGestionada: number;
    entrega: number;
    faltante: number;
    tipoEnvio: number | null;
    notas: string;
    fechaFactura: string;
    folioFactura: string;
    precioUnitarioCompra: number | null;
    total: number;
    estatus: string;
    esTotal: boolean;
}

export interface TotalesReporteSemanal {
    registros: number;
    cantidadGestionada: number;
    entrega: number;
    faltante: number;
    total: number;
}

export interface SemanaReporte {
    numero: number;
    etiqueta: string;
    fechaInicio: string;
    fechaFin: string;
    registros: FilaReporteSemanal[];
    totales: TotalesReporteSemanal;
}

export interface PeriodoReporte {
    id: number;
    fechaInicio: string;
    fechaFin: string;
    activo: boolean;
    totalSemanas: number;
}

export interface ReporteSemanalAlmacen {
    plataforma: string;
    periodo: PeriodoReporte;
    semanas: SemanaReporte[];
    totales: TotalesReporteSemanal;
}

export interface GrupoProveedor {
    id: string;
    idProveedor: number | null;
    nombreProveedor: string;
    semana: Omit<SemanaReporte, "registros" | "totales">;
    filas: FilaReporteSemanal[];
    totales: TotalesReporteSemanal;
}

export interface OpcionPeriodo {
    id: number;
    fechaInicio: string;
    fechaFin: string;
    activo: boolean;
}

export interface TextosReporteSemanal {
    proveedor: string;
    sinProveedor: string;
    periodo: string;
    activo: string;
    semana: string;
    todas: string;
    buscar: string;
    vacio: string;
    producto: string;
    sku: string;
    precio: string;
    cantidadGestionada: string;
    entrega: string;
    faltante: string;
    notas: string;
    fechaFactura: string;
    marca: string;
    precioUnitarioCompra: string;
    total: string;
    totalProveedor: string;
    totalVista: string;
    registros: string;
    folio: string;
}
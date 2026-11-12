import type {
    ColumnDef,
    ExpandedState,
    RowData,
    Table,
} from "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        ancho?: number | string;
        alineacion?: "left" | "center" | "right";
        ocultarEnMovil?: boolean;
        sinCorte?: boolean;
    }
}

export type SharedTablaModo = "cliente" | "servidor";

export type SharedTablaAlineacion = "left" | "center" | "right";

export interface SharedTablaOrden {
    id: string;
    desc: boolean;
}

export interface SharedTablaFiltroColumna {
    id: string;
    value: unknown;
}

export interface SharedTablaPaginacion {
    indicePagina: number;
    tamanoPagina: number;
}

export interface SharedTablaConsulta {
    filtroGlobal: string | null;
    orden: SharedTablaOrden[];
    filtrosColumna: SharedTablaFiltroColumna[];
    paginacion: SharedTablaPaginacion;
}

export interface SharedTablaColumnasFijas {
    izquierda?: string[];
    derecha?: string[];
}

export interface OpcionesSharedTabla<TFila> {
    columnas: ColumnDef<TFila, unknown>[];
    datos: TFila[];
    modo?: SharedTablaModo;
    total?: number;
    tamanoPaginaInicial?: number;
    ordenInicial?: SharedTablaOrden[];
    expansionInicial?: ExpandedState;
    obtenerIdFila?: (fila: TFila) => string;
    obtenerSubFilas?: (fila: TFila) => TFila[] | undefined;
    seleccionHabilitada?: boolean;
    columnasFijas?: SharedTablaColumnasFijas;
    filasPie?: TFila[];
}

export interface ControlSharedTabla<TFila> {
    tabla: Table<TFila>;
    tablaPie: Table<TFila>;
    hayFilasPie: boolean;
    modo: SharedTablaModo;
    consulta: SharedTablaConsulta;
    total: number;
    filtroGlobal: string;
    establecerFiltroGlobal: (valor: string) => void;
    hayFiltrosActivos: boolean;
    limpiarFiltros: () => void;
    filasSeleccionadas: TFila[];
    limpiarSeleccion: () => void;
}

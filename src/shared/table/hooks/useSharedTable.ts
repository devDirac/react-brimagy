import { useCallback, useMemo, useState } from "react";
import {
    FilterFn,
    getCoreRowModel,
    getExpandedRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnFiltersState,
    type ColumnPinningState,
    type ExpandedState,
    type OnChangeFn,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
} from "@tanstack/react-table";
import type {
    ControlSharedTabla,
    OpcionesSharedTabla,
    SharedTablaConsulta,
} from "../types/sharedTable.types";
import { coincideBusqueda } from "../utils/normalizarTexto";

const TAMANO_PAGINA_POR_DEFECTO = 10;
const COLUMNA_ACCIONES = "acciones";

const filtroGlobalSinAcentos: FilterFn<any> = (fila, idColumna, valorFiltro) =>
    coincideBusqueda(fila.getValue(idColumna), String(valorFiltro ?? ""));

// La columna de acciones va siempre primero, a la izquierda, y si la tabla
// tiene columnas fijadas viaja fijada con ellas. Se resuelve aqui para que
// valga en todas las tablas del sistema sin tocar cada definicion.
const identificarColumna = (columna: {
    id?: string;
    accessorKey?: unknown;
}): string | undefined =>
    columna.id ??
    (typeof columna.accessorKey === "string" ? columna.accessorKey : undefined);

export const useSharedTable = <TFila,>({
    columnas,
    datos,
    modo = "cliente",
    total,
    tamanoPaginaInicial = TAMANO_PAGINA_POR_DEFECTO,
    ordenInicial = [],
    expansionInicial = {},
    obtenerIdFila,
    obtenerSubFilas,
    seleccionHabilitada = false,
    columnasFijas,
    filasPie,
}: OpcionesSharedTabla<TFila>): ControlSharedTabla<TFila> => {
    const esServidor = modo === "servidor";

    const [orden, establecerOrden] = useState<SortingState>(ordenInicial);
    const [filtrosColumna, establecerFiltrosColumna] = useState<ColumnFiltersState>([]);
    const [filtroGlobal, establecerFiltroGlobal] = useState<string>("");
    const [expansion, establecerExpansion] = useState<ExpandedState>(expansionInicial);
    const [seleccion, establecerSeleccion] = useState<RowSelectionState>({});
    const [paginacion, establecerPaginacion] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: tamanoPaginaInicial,
    });

    const totalFilas = esServidor ? total ?? 0 : datos.length;

    const ordenColumnas = useMemo<string[]>(() => {
        const identificadores = columnas
            .map((columna) => identificarColumna(columna as never))
            .filter((identificador): identificador is string => identificador !== undefined);

        if (!identificadores.includes(COLUMNA_ACCIONES)) {
            return identificadores;
        }

        return [
            COLUMNA_ACCIONES,
            ...identificadores.filter((identificador) => identificador !== COLUMNA_ACCIONES),
        ];
    }, [columnas]);

    const fijacionColumnas = useMemo<ColumnPinningState>(() => {
        const izquierda = columnasFijas?.izquierda ?? [];
        const hayAcciones = ordenColumnas.includes(COLUMNA_ACCIONES);

        return {
            left:
                izquierda.length > 0 && hayAcciones && !izquierda.includes(COLUMNA_ACCIONES)
                    ? [COLUMNA_ACCIONES, ...izquierda]
                    : izquierda,
            right: columnasFijas?.derecha ?? [],
        };
    }, [columnasFijas, ordenColumnas]);

    const volverAPrimeraPagina = useCallback(() => {
        establecerPaginacion((actual) =>
            actual.pageIndex === 0 ? actual : { ...actual, pageIndex: 0 }
        );
    }, []);

    const alCambiarOrden: OnChangeFn<SortingState> = useCallback(
        (actualizador) => {
            establecerOrden(actualizador);
            volverAPrimeraPagina();
        },
        [volverAPrimeraPagina]
    );

    const alCambiarFiltrosColumna: OnChangeFn<ColumnFiltersState> = useCallback(
        (actualizador) => {
            establecerFiltrosColumna(actualizador);
            volverAPrimeraPagina();
        },
        [volverAPrimeraPagina]
    );

    const alCambiarFiltroGlobal: OnChangeFn<string> = useCallback(
        (actualizador) => {
            establecerFiltroGlobal(actualizador);
            volverAPrimeraPagina();
        },
        [volverAPrimeraPagina]
    );

    const tabla = useReactTable<TFila>({
        data: datos,
        columns: columnas,
        globalFilterFn: filtroGlobalSinAcentos,
        state: {
            sorting: orden,
            columnFilters: filtrosColumna,
            globalFilter: filtroGlobal,
            expanded: expansion,
            rowSelection: seleccion,
            pagination: paginacion,
            columnPinning: fijacionColumnas,
            columnOrder: ordenColumnas,
        },
        onSortingChange: alCambiarOrden,
        onColumnFiltersChange: alCambiarFiltrosColumna,
        onGlobalFilterChange: alCambiarFiltroGlobal,
        onExpandedChange: establecerExpansion,
        onRowSelectionChange: establecerSeleccion,
        onPaginationChange: establecerPaginacion,
        getRowId: obtenerIdFila
            ? (fila) => obtenerIdFila(fila)
            : undefined,
        getSubRows: obtenerSubFilas,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: esServidor ? undefined : getSortedRowModel(),
        getFilteredRowModel: esServidor ? undefined : getFilteredRowModel(),
        getPaginationRowModel: esServidor ? undefined : getPaginationRowModel(),
        getFacetedRowModel: esServidor ? undefined : getFacetedRowModel(),
        getFacetedUniqueValues: esServidor ? undefined : getFacetedUniqueValues(),
        getFacetedMinMaxValues: esServidor ? undefined : getFacetedMinMaxValues(),
        enableRowSelection: seleccionHabilitada,
        manualSorting: esServidor,
        manualFiltering: esServidor,
        manualPagination: esServidor,
        rowCount: esServidor ? totalFilas : undefined,
        autoResetPageIndex: !esServidor,
    });

    const datosPie = useMemo<TFila[]>(() => filasPie ?? [], [filasPie]);

    const tablaPie = useReactTable<TFila>({
        data: datosPie,
        columns: columnas,
        state: { columnPinning: fijacionColumnas },
        getCoreRowModel: getCoreRowModel(),
    });

    const consulta = useMemo<SharedTablaConsulta>(
        () => ({
            filtroGlobal: filtroGlobal.trim() === "" ? null : filtroGlobal.trim(),
            orden: orden.map((entrada) => ({ id: entrada.id, desc: entrada.desc })),
            filtrosColumna: filtrosColumna.map((filtro) => ({
                id: filtro.id,
                value: filtro.value,
            })),
            paginacion: {
                indicePagina: paginacion.pageIndex,
                tamanoPagina: paginacion.pageSize,
            },
        }),
        [filtroGlobal, orden, filtrosColumna, paginacion]
    );

    const hayFiltrosActivos =
        filtroGlobal.trim().length > 0 || filtrosColumna.length > 0;

    const cambiarFiltroGlobal = useCallback(
        (valor: string) => {
            establecerFiltroGlobal(valor);
            volverAPrimeraPagina();
        },
        [volverAPrimeraPagina]
    );

    const limpiarSeleccion = useCallback(() => {
        establecerSeleccion({});
    }, []);

    const limpiarFiltros = useCallback(() => {
        establecerFiltroGlobal("");
        establecerFiltrosColumna([]);
        volverAPrimeraPagina();
    }, [volverAPrimeraPagina]);

    return {
        tabla,
        tablaPie,
        hayFilasPie: datosPie.length > 0,
        modo,
        consulta,
        total: esServidor ? totalFilas : tabla.getFilteredRowModel().rows.length,
        filtroGlobal,
        establecerFiltroGlobal: cambiarFiltroGlobal,
        hayFiltrosActivos,
        limpiarFiltros,
        filasSeleccionadas: tabla
            .getSelectedRowModel()
            .rows.map((fila) => fila.original),
        limpiarSeleccion,
    };
};

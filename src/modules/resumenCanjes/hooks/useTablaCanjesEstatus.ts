import { useEffect, useMemo, useState } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { OPCIONES_POR_PAGINA_MODAL } from "../constants";
import { crearColumnasCanjesEstatus } from "../components/columnasCanjesEstatus";
import { filtroGlobalCanje } from "../utils";
import type { AccionesFilaCanje, CanjeEstatus, EstatusCanje } from "../types";

/** Instancia de TanStack Table del modal: orden, búsqueda y paginación del lado del cliente. */
export const useTablaCanjesEstatus = (
    data: CanjeEstatus[],
    acciones: AccionesFilaCanje,
    estatus: EstatusCanje | null
) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: OPCIONES_POR_PAGINA_MODAL[0],
    });

    const { onVer, onValidar, enCurso } = acciones;
    const columns = useMemo(
        () => crearColumnasCanjesEstatus({ onVer, onValidar, enCurso }),
        [onVer, onValidar, enCurso]
    );

    const table = useReactTable({
        data,
        columns,
        state: { sorting, pagination, globalFilter },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: filtroGlobalCanje,
        getRowId: (row) => String(row.id),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    useEffect(() => {
        setGlobalFilter("");
        setPagination((p) => ({ ...p, pageIndex: 0 }));
    }, [estatus]);

    const totalPaginas = table.getPageCount();
    useEffect(() => {
        const ultima = Math.max(totalPaginas - 1, 0);
        if (pagination.pageIndex > ultima) {
            setPagination((p) => ({ ...p, pageIndex: ultima }));
        }
    }, [totalPaginas, pagination.pageIndex]);

    return table;
};
import { useEffect, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { OPCIONES_POR_PAGINA } from "../constants";
import { crearColumnasCanjes } from "../components/columnasCanjes";
import type { CanjeAgrupado } from "../types";

/** Instancia de TanStack Table para la vista de tabla. */
export const useTablaCanjes = (data: CanjeAgrupado[], onVer: (canje: CanjeAgrupado) => void) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: OPCIONES_POR_PAGINA[0],
  });

  const columns = useMemo(() => crearColumnasCanjes(onVer), [onVer]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  // Si una búsqueda deja menos resultados, regresa a una página que exista
  const totalPaginas = table.getPageCount();
  useEffect(() => {
    const ultima = Math.max(totalPaginas - 1, 0);
    if (pagination.pageIndex > ultima) {
      setPagination((p) => ({ ...p, pageIndex: ultima }));
    }
  }, [totalPaginas, pagination.pageIndex]);

  return table;
};

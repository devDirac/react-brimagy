import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Box,
  InputAdornment,
  Paper,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Theme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const ESTILOS_TABLA_DATOS = {
  encabezadoFondo: "#F0FCDC",
  encabezadoTexto: "#2F2F2F",
  encabezadoTamano: "0.8rem",
  celdaTamano: "0.75rem",
};

export interface TablaDatosProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  /** Id estable de cada fila (por defecto, el índice). */
  getRowId?: (fila: T, indice: number) => string;
  /** Muestra un buscador que filtra en todas las columnas (en el navegador). */
  conBuscador?: boolean;
  placeholderBuscador?: string;
  /** Sin paginación muestra todas las filas. */
  paginacion?: boolean;
  opcionesPorPagina?: number[];
  /** Color de fondo de una fila según sus datos (ej. filas inválidas). */
  colorFila?: (fila: T) => string | undefined;
  /** Alto máximo del cuerpo con scroll; el encabezado queda fijo. */
  alturaMaxima?: number | string;
  anchoMinimo?: number;
  mensajeVacio?: string;
  sx?: SxProps<Theme>;
}

/**
 * Tabla genérica con TanStack Table: orden por columna, buscador y paginación.
 * Pensada para sustituir a DinamicTableMejorada.
 */
function TablaDatos<T>({
  data,
  columns,
  getRowId,
  conBuscador = false,
  placeholderBuscador = "Buscar...",
  paginacion = true,
  opcionesPorPagina = [10, 20, 50],
  colorFila,
  alturaMaxima,
  anchoMinimo = 900,
  mensajeVacio = "No hay datos para mostrar",
  sx,
}: TablaDatosProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtro, setFiltro] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: opcionesPorPagina[0],
  });

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, globalFilter: filtro, ...(paginacion ? { pagination } : {}) },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltro,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(paginacion ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    // Al actualizar una fila (ej. disponibilidad) no se regresa a la página 1
    autoResetPageIndex: false,
  });

  // Si el filtro o los datos dejan menos páginas, regresa a una que exista
  const totalPaginas = table.getPageCount();
  useEffect(() => {
    const ultima = Math.max(totalPaginas - 1, 0);
    if (pagination.pageIndex > ultima) setPagination((p) => ({ ...p, pageIndex: ultima }));
  }, [totalPaginas, pagination.pageIndex]);

  const filas = table.getRowModel().rows;
  const totalFiltradas = table.getFilteredRowModel().rows.length;

  return (
    <Box sx={sx}>
      {conBuscador && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1, px: "10px" }}>
          <TextField
            variant="standard"
            placeholder={placeholderBuscador}
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
            sx={{ width: { xs: "100%", md: "40%" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      <TableContainer
        component={Paper}
        sx={{ mx: "10px", width: "auto", maxHeight: alturaMaxima, overflow: "auto" }}
      >
        <Table size="small" stickyHeader={!!alturaMaxima} sx={{ minWidth: anchoMinimo }}>
          {/* El tema de Material Dashboard le pone display: block al thead y desalinea las columnas */}
          <TableHead sx={{ display: "table-header-group", p: 0 }}>
            {table.getHeaderGroups().map((grupo) => (
              <TableRow key={grupo.id}>
                {grupo.headers.map((header) => {
                  const orden = header.column.getIsSorted();
                  const titulo = flexRender(header.column.columnDef.header, header.getContext());
                  return (
                    <TableCell
                      key={header.id}
                      sx={{
                        width: header.getSize(),
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                        fontSize: ESTILOS_TABLA_DATOS.encabezadoTamano,
                        backgroundColor: ESTILOS_TABLA_DATOS.encabezadoFondo,
                        color: ESTILOS_TABLA_DATOS.encabezadoTexto,
                      }}
                    >
                      {header.column.getCanSort() ? (
                        <TableSortLabel
                          active={!!orden}
                          direction={orden || "asc"}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {titulo}
                        </TableSortLabel>
                      ) : (
                        titulo
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {filas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  {mensajeVacio}
                </TableCell>
              </TableRow>
            ) : (
              filas.map((fila) => (
                <TableRow
                  key={fila.id}
                  hover
                  sx={{ backgroundColor: colorFila?.(fila.original) }}
                >
                  {fila.getVisibleCells().map((celda) => (
                    <TableCell
                      key={celda.id}
                      sx={{
                        maxWidth: celda.column.getSize(),
                        fontSize: ESTILOS_TABLA_DATOS.celdaTamano,
                        "& .MuiTypography-root": { fontSize: ESTILOS_TABLA_DATOS.celdaTamano },
                      }}
                    >
                      {flexRender(celda.column.columnDef.cell, celda.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {paginacion && (
        <TablePagination
          component="div"
          count={totalFiltradas}
          page={pagination.pageIndex}
          onPageChange={(_, pagina) => table.setPageIndex(pagina)}
          rowsPerPage={pagination.pageSize}
          onRowsPerPageChange={(e) =>
            setPagination({ pageIndex: 0, pageSize: parseInt(e.target.value, 10) })
          }
          rowsPerPageOptions={opcionesPorPagina}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          sx={{
            ".MuiTablePagination-toolbar": { justifyContent: "center" },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": { margin: 0 },
          }}
        />
      )}
    </Box>
  );
}

export default TablaDatos;

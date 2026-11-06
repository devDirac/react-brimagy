import { flexRender } from "@tanstack/react-table";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import PaginacionCanjes from "./PaginacionCanjes";
import { useTablaCanjes } from "../hooks";
import type { CanjeAgrupado } from "../types";
import { ESTILOS_TABLA } from "../constants";

interface Props {
  canjes: CanjeAgrupado[];
  onVer: (canje: CanjeAgrupado) => void;
}

const TablaCanjes = ({ canjes, onVer }: Props) => {
  const table = useTablaCanjes(canjes, onVer);
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <>
      <TableContainer component={Paper} sx={{ mx: "10px", width: "auto" }}>
        <Table size="small" sx={{ minWidth: 900 }}>
          <TableHead sx={{ display: "table-header-group", p: 0 }}>
            {table.getHeaderGroups().map((grupo) => (
              <TableRow key={grupo.id}>
                {grupo.headers.map((header) => {
                  const ordenable = header.column.getCanSort();
                  const orden = header.column.getIsSorted();
                  return (
                    <TableCell
                      key={header.id}
                      sx={{
                        width: header.getSize(),
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                        fontSize: ESTILOS_TABLA.encabezadoTamano,
                        backgroundColor: ESTILOS_TABLA.encabezadoFondo,
                        color: ESTILOS_TABLA.encabezadoTexto,
                        "& .MuiTableSortLabel-root, & .MuiTableSortLabel-root:hover, & .MuiTableSortLabel-root.Mui-active, & .MuiTableSortLabel-icon":
                          { color: `${ESTILOS_TABLA.encabezadoTexto} !important` },
                      }}
                    >
                      {ordenable ? (
                        <TableSortLabel
                          active={!!orden}
                          direction={orden || "asc"}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableSortLabel>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} hover>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    sx={{
                      maxWidth: cell.column.getSize(),
                      fontSize: ESTILOS_TABLA.celdaTamano,
                      "& .MuiTypography-root": { fontSize: ESTILOS_TABLA.celdaTamano },
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PaginacionCanjes
        total={canjes.length}
        pagina={pageIndex}
        porPagina={pageSize}
        onCambiarPagina={(p) => table.setPageIndex(p)}
        onCambiarPorPagina={(n) => {
          table.setPageSize(n);
          table.setPageIndex(0);
        }}
      />
    </>
  );
};

export default TablaCanjes;

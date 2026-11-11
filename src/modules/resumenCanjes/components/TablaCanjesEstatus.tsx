import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
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
import PaginacionTabla from "./PaginacionTabla";
import { ESTILOS_TABLA_MODAL } from "../constants";
import type { CanjeEstatus } from "../types";

interface Props {
    table: TanstackTable<CanjeEstatus>;
    color?: string;
}

const TablaCanjesEstatus = ({ table, color }: Props) => {
    const filas = table.getRowModel().rows;

    return (
        <>
            <TableContainer component={Paper} sx={{ maxHeight: "60vh" }}>
                <Table size="small" stickyHeader sx={{ minWidth: 900 }}>
                    <TableHead sx={{ display: "table-header-group" }}>
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
                                                fontSize: ESTILOS_TABLA_MODAL.encabezadoTamano,
                                                backgroundColor: ESTILOS_TABLA_MODAL.encabezadoFondo,
                                                color: ESTILOS_TABLA_MODAL.encabezadoTexto,
                                                "& .MuiTableSortLabel-root, & .MuiTableSortLabel-root:hover, & .MuiTableSortLabel-root.Mui-active, & .MuiTableSortLabel-icon":
                                                    { color: `${ESTILOS_TABLA_MODAL.encabezadoTexto} !important` },
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
                        {filas.map((row) => (
                            <TableRow key={row.id} hover>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        sx={{
                                            maxWidth: cell.column.getSize(),
                                            fontSize: ESTILOS_TABLA_MODAL.celdaTamano,
                                            "& .MuiTypography-root": { fontSize: ESTILOS_TABLA_MODAL.celdaTamano },
                                        }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {filas.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getVisibleLeafColumns().length}
                                    align="center"
                                    sx={{ py: 4 }}
                                >
                                    No hay canjes que mostrar
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <PaginacionTabla table={table} color={color} />
        </>
    );
};

export default TablaCanjesEstatus;
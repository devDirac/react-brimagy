import { Table } from "@tanstack/react-table";
import { Box, IconButton, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
} from "@tabler/icons-react";
import { OPCIONES_POR_PAGINA_MODAL, PAGINAS_VISIBLES } from "../constants";
import { paginasVisibles } from "../utils";

interface Props<T> {
    table: Table<T>;
    color?: string;
}

/** Paginación TanStack Table. */
const PaginacionTabla = <T,>({ table, color = "#084d6e" }: Props<T>) => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const totalPaginas = Math.max(table.getPageCount(), 1);
    const totalFilas = table.getFilteredRowModel().rows.length;

    const desde = totalFilas === 0 ? 0 : pageIndex * pageSize + 1;
    const hasta = Math.min((pageIndex + 1) * pageSize, totalFilas);

    const botonNav = (
        titulo: string,
        icono: JSX.Element,
        onClick: () => void,
        deshabilitado: boolean
    ) => (
        <Tooltip title={titulo}>
            <span>
                <IconButton size="small" aria-label={titulo} onClick={onClick} disabled={deshabilitado}>
                    {icono}
                </IconButton>
            </span>
        </Tooltip>
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                pt: 2,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                    Canjes por página
                </Typography>
                <Select
                    size="small"
                    value={pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                        table.setPageIndex(0);
                    }}
                    sx={{ minWidth: 70, "& .MuiSelect-select": { py: 0.5 } }}
                >
                    {OPCIONES_POR_PAGINA_MODAL.map((opcion) => (
                        <MenuItem key={opcion} value={opcion}>
                            {opcion}
                        </MenuItem>
                    ))}
                </Select>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {desde}-{hasta} de {totalFilas}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {botonNav(
                    "Primera página",
                    <IconChevronsLeft size={18} />,
                    () => table.setPageIndex(0),
                    !table.getCanPreviousPage()
                )}
                {botonNav(
                    "Página anterior",
                    <IconChevronLeft size={18} />,
                    () => table.previousPage(),
                    !table.getCanPreviousPage()
                )}

                {paginasVisibles(pageIndex, totalPaginas, PAGINAS_VISIBLES).map((pagina, i) =>
                    pagina === null ? (
                        <Typography key={`hueco-${i}`} variant="caption" sx={{ px: 0.5 }}>
                            …
                        </Typography>
                    ) : (
                        <Box
                            key={pagina}
                            component="button"
                            type="button"
                            aria-label={`Página ${pagina + 1}`}
                            aria-current={pagina === pageIndex ? "page" : undefined}
                            onClick={() => table.setPageIndex(pagina)}
                            sx={{
                                minWidth: 32,
                                height: 32,
                                px: 1,
                                border: 0,
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                backgroundColor: pagina === pageIndex ? color : "transparent",
                                color: pagina === pageIndex ? "#fff" : "text.primary",
                                transition: "background-color 200ms ease",
                                "&:hover": { backgroundColor: pagina === pageIndex ? color : "#f1f3f5" },
                            }}
                        >
                            {pagina + 1}
                        </Box>
                    )
                )}

                {botonNav(
                    "Página siguiente",
                    <IconChevronRight size={18} />,
                    () => table.nextPage(),
                    !table.getCanNextPage()
                )}
                {botonNav(
                    "Última página",
                    <IconChevronsRight size={18} />,
                    () => table.setPageIndex(totalPaginas - 1),
                    !table.getCanNextPage()
                )}
            </Box>
        </Box>
    );
};

export default PaginacionTabla;
import { Checkbox } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";

const ID_COLUMNA_SELECCION = "seleccion";
const ANCHO_COLUMNA_SELECCION = 44;

export const crearColumnaSeleccion = <TFila,>(): ColumnDef<TFila, unknown> => ({
    id: ID_COLUMNA_SELECCION,
    enableSorting: false,
    enableColumnFilter: false,
    meta: { ancho: ANCHO_COLUMNA_SELECCION, alineacion: "center" },
    header: ({ table }) => (
        <Checkbox
            size="small"
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            inputProps={{ "aria-label": "Seleccionar todas las filas de la página" }}
            sx={{ padding: 0 }}
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            size="small"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            inputProps={{ "aria-label": "Seleccionar fila" }}
            sx={{ padding: 0 }}
        />
    ),
});

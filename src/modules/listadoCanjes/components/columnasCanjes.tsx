import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { Chip, IconButton, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EstadoValidacionChip from "./EstadoValidacionChip";
import { formatearFecha, formatearPuntos } from "../utils";
import type { CanjeAgrupado } from "../types";
import { IconBox } from "@tabler/icons-react";

const columnHelper = createColumnHelper<CanjeAgrupado>();

const nombresProductos = (canje: CanjeAgrupado) =>
  canje.productos
    .map((p) => p.nombre_premio)
    .filter(Boolean)
    .join(", ");

/** Columnas de la vista de tabla. `onVer` abre el detalle del canje. */
export const crearColumnasCanjes = (
  onVer: (canje: CanjeAgrupado) => void
): ColumnDef<CanjeAgrupado, any>[] => [
    columnHelper.display({
      id: "acciones",
      header: "Herramientas",
      size: 50,
      cell: ({ row }) => (
        <Tooltip title="Vista Previa">
          <IconButton aria-label="ver" size="small" onClick={() => onVer(row.original)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    }),
    columnHelper.accessor("folio", { header: "Folio", size: 140 }),
    columnHelper.accessor("nombre_usuario", { header: "Cliente", size: 200 }),
    columnHelper.accessor("creacion_canje", {
      header: "Fecha",
      size: 180,
      cell: (info) => formatearFecha(info.getValue()),
    }),
    columnHelper.accessor("total_puntos", {
      header: "Puntos",
      size: 110,
      cell: (info) => formatearPuntos(info.getValue()),
    }),
    columnHelper.accessor(nombresProductos, {
      id: "productos",
      header: "Productos",
      size: 170,
      cell: ({ row, getValue }) => {
        const nombres = getValue() as string;
        const labelProducto = row.original.productos.length > 1 ? "productos" : "producto";
        const sinRegistrar = row.original.productos.some((p) => !p.id_producto);
        return (
          <Tooltip title={nombres}>
            <Chip icon={<IconBox stroke={2} />} label={row.original.productos.length + " " + labelProducto} />
          </Tooltip>
        );
      },
    }),
    columnHelper.accessor("estado_validacion", {
      header: "Estatus",
      size: 190,
      sortUndefined: "last",
      cell: (info) => <EstadoValidacionChip estado={info.getValue()} />,
    }),
  ];

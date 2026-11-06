import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Chip, Tooltip, Typography } from "@mui/material";
import AccionesProducto, { HandlersProducto } from "../AccionesProducto";
import { truncarTexto } from "../../utils";
import type { Producto } from "../../types";

const col = createColumnHelper<Producto>();

const TextoLargo = ({ texto, limite }: { texto?: string; limite: number }) => (
  <Tooltip title={texto ?? ""}>
    <Typography variant="caption">{truncarTexto(texto, limite)}</Typography>
  </Tooltip>
);

/** Columnas de la vista de tabla del catálogo. */
export const crearColumnasProductos = (
  handlers: HandlersProducto,
  esSuperAdmin: boolean
): ColumnDef<Producto, any>[] => [
  col.display({
    id: "acciones",
    header: "Herramientas",
    size: 170,
    cell: ({ row }) => (
      <AccionesProducto
        producto={row.original}
        // Igual que en la tabla anterior: la disponibilidad no exige super admin
        puedeAdministrar={esSuperAdmin}
        puedeCambiarDisponibilidad
        {...handlers}
      />
    ),
  }),
  col.accessor("nombre_producto", {
    header: "Nombre",
    size: 200,
    cell: (info) => <TextoLargo texto={info.getValue()} limite={40} />,
  }),
  col.accessor("descripcion", {
    header: "Descripción",
    size: 240,
    cell: (info) => <TextoLargo texto={info.getValue()} limite={60} />,
  }),
  col.accessor("marca", { header: "Marca", size: 130 }),
  col.accessor("sku", { header: "SKU", size: 120 }),
  col.accessor("color", { header: "Color", size: 100 }),
  col.accessor((p) => p.categoria ?? p.catalogo ?? "", { id: "categoria", header: "Categoría", size: 150 }),
  col.accessor("proveedor", { header: "Proveedor", size: 150 }),
  col.accessor((p) => (p.stock === 0 ? "No disponible" : "Disponible"), {
    id: "disponibilidad",
    header: "Estatus",
    size: 130,
    cell: (info) => (
      <Chip
        size="small"
        label={info.getValue()}
        color={info.row.original.stock === 0 ? "error" : "success"}
        variant="outlined"
      />
    ),
  }),
];

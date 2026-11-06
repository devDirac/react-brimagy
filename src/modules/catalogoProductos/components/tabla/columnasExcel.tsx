import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { formatearNumero } from "../../utils";
import type { ProductoExcel } from "../../types";

const col = createColumnHelper<ProductoExcel>();

const estado = (valido: boolean, texto: string) => `${valido ? "✓" : "✗"} ${texto}`;

/** Columnas de la vista previa del Excel, con indicadores de validación. */
export const columnasExcel: ColumnDef<ProductoExcel, any>[] = [
  col.accessor("nombre_producto", { header: "Nombre", size: 200 }),
  col.accessor("descripcion", { header: "Descripción", size: 220 }),
  col.accessor("marca", { header: "Marca", size: 120 }),
  col.accessor(
    (p) => (p.sku_vacio ? "⚠️ SKU VACÍO" : p.sku_duplicado ? `🔄 ${p.sku} (Existente)` : p.sku),
    { id: "sku", header: "SKU", size: 140 }
  ),
  col.accessor("color", { header: "Color", size: 100 }),
  col.accessor((p) => String(p.talla ?? ""), { id: "talla", header: "Talla", size: 80 }),
  col.accessor(
    (p) =>
      p.id_producto_brimagy_vacio
        ? "⚠️ PRODUCTO NUEVO"
        : p.id_producto_brimagy_duplicado
        ? `🔄 ${p.id_producto_brimagy} (Existente)`
        : String(p.id_producto_brimagy),
    { id: "producto", header: "Id Brimagy", size: 150 }
  ),
  col.accessor((p) => estado(p.plataforma_valida, p.plataforma), {
    id: "plataforma",
    header: "Plataforma",
    size: 130,
  }),
  col.accessor((p) => (p.proveedor_vacio ? "⚠️ Sin proveedor" : estado(p.proveedor_valido, p.proveedor)), {
    id: "proveedor",
    header: "Proveedor",
    size: 150,
  }),
  col.accessor((p) => estado(p.categoria_valida, p.catalogo), {
    id: "categoria",
    header: "Categoría",
    size: 150,
  }),
  col.accessor("costo_con_iva", {
    header: "Costo con IVA",
    size: 120,
    cell: (info) => formatearNumero(info.getValue(), 2, "$"),
  }),
  col.accessor("costo_puntos_con_iva", {
    header: "Costo puntos con IVA",
    size: 150,
    cell: (info) => formatearNumero(info.getValue(), 0),
  }),
  col.accessor("envio_extra", {
    header: "Envío extra",
    size: 110,
    cell: (info) => formatearNumero(info.getValue(), 0),
  }),
];

/** Mismos colores que usaba DinamicTable para las filas del Excel. */
export const colorFilaExcel = (p: ProductoExcel): string | undefined => {
  if (p.sku_vacio) return "#fff9c4";
  if (!p.proveedor_valido || !p.categoria_valida || !p.plataforma_valida) return "#FF2C00";
  if (p.sku_duplicado || p.id_producto_brimagy_duplicado) return "#fff3cd";
  return undefined;
};

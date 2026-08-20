import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { CanjeReporteItem } from "../types/reporteCanjes";
import { reporteColors } from "../config/reporteCanjesColors";
import { formatNumber, formatCurrency } from "../utils/formatters";

const columnHelper = createColumnHelper<CanjeReporteItem>();

const leaf = (accessor: keyof CanjeReporteItem, header: string, cellBgColor?: string, size = 130, formatter?: (value: any) => string) =>
  columnHelper.accessor(accessor, {
    header,
    cell: (info) => {
      const value = info.getValue();
      return formatter ? formatter(value) : value ?? "-";
    },
    size,
    minSize: 60,
    maxSize: 500,
    meta: { cellBgColor, formatter },
  });

export const reporteCanjesColumns: ColumnDef<CanjeReporteItem, any>[] = [
  columnHelper.group({
    id: "grupo_usuario",
    header: "Información de usuario",
    meta: { groupBg: reporteColors.usuario.header, groupText: reporteColors.usuario.headerText },
    columns: [
      leaf("api_id", "API ID", reporteColors.usuario.cell, 100),
      leaf("nombre", "Nombre", reporteColors.usuario.cell, 160),
      leaf("telefono", "Teléfono", reporteColors.usuario.cell, 120),
      leaf("correo", "Correo", reporteColors.usuario.cell, 220),
      leaf("calle", "Calle", reporteColors.usuario.cell, 240),
      leaf("no_ext", "No. Ext", reporteColors.usuario.cell, 80),
      leaf("no_int", "No. Int", reporteColors.usuario.cell, 80),
      leaf("colonia", "Colonia", reporteColors.usuario.cell, 160),
      leaf("municipio_delegacion", "Municipio/Delegación", reporteColors.usuario.cell, 220),
      leaf("codigo_postal", "C.P.", reporteColors.usuario.cell, 90),
      leaf("entre_calles", "Entre calles", reporteColors.usuario.cell, 200),
      leaf("referencia_adicional", "Referencia adicional", reporteColors.usuario.cell, 260),
    ],
  }),

  columnHelper.group({
    id: "grupo_canje",
    header: "Información de canje",
    meta: { groupBg: reporteColors.canje.header, groupText: reporteColors.canje.headerText },
    columns: [
      leaf("folio_canje", "Folio canje", reporteColors.canje.cell, 140),
      leaf("category", "Categoría", reporteColors.canje.cell, 200),
      leaf("premio", "Premio", reporteColors.canje.cell, 220),
      leaf("sku", "SKU", reporteColors.canje.cell, 110),
      leaf("talla", "Talla", reporteColors.canje.cell, 80),
      leaf("color", "Color", reporteColors.canje.cell, 90),
      leaf("puntos_premio", "Puntos premio", reporteColors.canje.cell, 110, (v) =>
        formatCurrency(v)),
      leaf("premios_canjeados", "Premios canjeados", reporteColors.canje.cell, 130),
      leaf("puntos_canjeados", "Puntos canjeados", reporteColors.canje.cell, 130, (v) =>
        formatCurrency(v)),
      leaf("fecha_canje", "Fecha canje", reporteColors.canje.cell, 150),
    ],
  }),

  columnHelper.group({
    id: "grupo_compra",
    header: "Información de compra",
    meta: { groupBg: reporteColors.compra.header, groupText: reporteColors.compra.headerText },
    columns: [
      leaf("fecha_compra", "Fecha compra", reporteColors.compra.cell, 150),
      leaf("folio_factura", "Folio factura", reporteColors.compra.cell, 140),
      leaf("marca", "Marca", reporteColors.compra.cell, 120),
      leaf("imei", "IMEI", reporteColors.compra.cell, 150),
    ],
  }),

  columnHelper.group({
    id: "grupo_desglose",
    header: "Desglose de información",
    meta: { groupBg: reporteColors.desglose.header, groupText: reporteColors.desglose.headerText },
    columns: [
      leaf(
        "precio_sin_iva_puntos_prespuestado",
        "Precio s/IVA puntos presup.",
        reporteColors.verde,
        160,
        (v) => formatCurrency(v)
      ),
      leaf(
        "precio_sin_iva_proveedor_prespuestado",
        "Precio s/IVA proveedor presup.",
        reporteColors.verde,
        170,
        (v) => formatCurrency(v)
      ),
      leaf("precio_compra_sin_iva", "Precio compra s/IVA", reporteColors.verde, 150,
        (v) => formatCurrency(v)),
      leaf("diferencia_precio_usuario", "Diferencia precio usuario", reporteColors.verde, 160,
        (v) => formatCurrency(v)),
      leaf("diferencia_precio_proveedor", "Diferencia precio proveedor", reporteColors.verde, 170,
        (v) => formatCurrency(v)),

      leaf("fee_presupuestado_puntos", "Fee presup. puntos", reporteColors.gris, 140,
        (v) => formatCurrency(v)),
      leaf("fee_presupuestado_proveedor_puntos", "Fee presup. proveedor", reporteColors.gris, 150,
        (v) => formatCurrency(v)),
      leaf("fee_real", "Fee real", reporteColors.gris, 110,
        (v) => formatCurrency(v)),
      leaf("diferencia_precio_usuario_2", "Diferencia precio usuario 2", reporteColors.gris, 170,
        (v) => formatCurrency(v)),
      leaf(
        "diferencia_precio_proveedor_2",
        "Diferencia precio proveedor 2",
        reporteColors.gris,
        180,
        (v) => formatCurrency(v)
      ),

      leaf("envio_presupuestado", "Envío presupuestado", reporteColors.naranjaAmarillo, 150,
        (v) => formatCurrency(v)),
      leaf("costo_envio_real", "Costo envío real", reporteColors.naranjaAmarillo, 140,
        (v) => formatCurrency(v)),
      leaf("diferencia_envio", "Diferencia envío", reporteColors.naranjaAmarillo, 140,
        (v) => formatCurrency(v)),

      leaf("total_presupuestado_puntos", "Total presup. puntos", reporteColors.naranja, 150,
        (v) => formatCurrency(v)),
      leaf(
        "total_presupuestado_proveedor_puntos",
        "Total presup. proveedor",
        reporteColors.naranja,
        160,
        (v) => formatCurrency(v)
      ),
      leaf("total_real", "Total real", reporteColors.naranja, 110,
        (v) => formatCurrency(v)),
      leaf("total_diferencia_puntos_usuario", "Total dif. usuario", reporteColors.naranja, 150,
        (v) => formatCurrency(v)),
      leaf("total_diferencia_puntos_proveedor", "Total dif. proveedor", reporteColors.naranja, 160,
        (v) => formatCurrency(v)),
    ],
  }),
];

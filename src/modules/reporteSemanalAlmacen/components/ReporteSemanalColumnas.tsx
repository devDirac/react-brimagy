import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Chip, Typography } from "@mui/material";
import { SharedTextoRecortado } from "../../../shared/table";
import type {
    FilaReporteSemanal,
    TextosReporteSemanal,
} from "../types/reporteSemanalAlmacen.types";
import { ANCHOS_REPORTE, COLORES_TIPO_ENVIO } from "../constants/reporteSemanalAlmacen.constants";
import { fecha, moneda, textoOVacio } from "../utils/reporteSemanalAlmacenFormato.utils";
import { IconAward, IconBarcode, IconBrandAppgallery } from "@tabler/icons-react";

type Columna = ColumnDef<FilaReporteSemanal, unknown>;

const COLOR_FALTANTE = "#dc2626";
const COLOR_COMPLETO = "#16a34a";

const celdaTexto = (valor: string) => (
    <Typography variant="caption" sx={{ fontSize: 13, display: "block" }} noWrap title={valor}>
        {textoOVacio(valor)}
    </Typography>
);

const celdaNumero = (valor: number | string, negrita = false) => (
    <Typography variant="caption" sx={{ fontSize: 13, display: "block", fontWeight: negrita ? 700 : 400 }}>
        {valor}
    </Typography>
);

const soloDetalle =
    (render: (fila: FilaReporteSemanal) => ReactNode): Columna["cell"] =>
        ({ row }) =>
            row.original.esTotal ? null : render(row.original);

const chipSolido = (bg: string, texto = "#fff") => ({
    bgcolor: bg,
    color: texto,
    fontWeight: "bold",
    height: 22,
    "& .MuiChip-icon": { color: texto, ml: "6px" },
});

/** Columnas de los productos de un proveedor (proveedor, periodo y semana van en el encabezado del bloque). */
export const construirColumnasReporteSemanal = (textos: TextosReporteSemanal): Columna[] => [
    {
        accessorKey: "nombreProducto",
        header: textos.producto,
        size: ANCHOS_REPORTE.producto,
        meta: { ancho: ANCHOS_REPORTE.producto },
        cell: ({ row }) => {
            const fila = row.original;
            if (fila.esTotal) {
                return <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{fila.nombreProducto}</Typography>;
            }
            return (
                <>
                    <Typography variant="h4" fontWeight={600} sx={{ fontSize: 13.5, display: "block" }}>
                        <SharedTextoRecortado texto={fila.nombreProducto.toUpperCase() || "N/A"} />
                    </Typography>
                    {fila.folioCanje && (
                        <Chip
                            size="small"
                            icon={<IconAward size={14} stroke={2} />}
                            label={fila.folioCanje ?? "Sin folio"}
                            sx={{ ...chipSolido("#6dc794", "#000"), mr: 0.5 }}
                        />

                    )}
                    {fila.sku && (
                        <Chip
                            size="small"
                            icon={<IconBarcode size={14} stroke={2} />}
                            label={fila.sku ?? "SIN SKU"}
                            sx={{ ...chipSolido("#f5ec71", "#000"), mr: 0.5 }}
                        />
                    )}
                    {fila.marca && (
                        <Chip
                            size="small"
                            icon={<IconBrandAppgallery size={14} stroke={2} />}
                            label={fila.marca ?? "SIN MARCA"}
                            sx={{ ...chipSolido("#9879fc", "#000") }}
                        />
                    )}
                </>
            );
        },
    },
    {
        accessorKey: "precio",
        header: textos.precio,
        meta: { ancho: ANCHOS_REPORTE.moneda, alineacion: "right", sinCorte: true },
        cell: soloDetalle((fila) => celdaNumero(moneda(fila.precio))),
    },
    {
        accessorKey: "cantidadGestionada",
        header: textos.cantidadGestionada,
        meta: { ancho: ANCHOS_REPORTE.cantidad, alineacion: "center" },
        cell: ({ row }) => celdaNumero(row.original.cantidadGestionada, row.original.esTotal),
    },
    {
        accessorKey: "entrega",
        header: textos.entrega,
        meta: { ancho: ANCHOS_REPORTE.cantidad, alineacion: "center" },
        cell: ({ row }) => celdaNumero(row.original.entrega, row.original.esTotal),
    },
    {
        accessorKey: "faltante",
        header: textos.faltante,
        meta: { ancho: ANCHOS_REPORTE.cantidad, alineacion: "center" },
        cell: ({ row }) => {
            const { faltante, esTotal } = row.original;
            const color = faltante > 0 ? COLOR_FALTANTE : COLOR_COMPLETO;
            return (
                <Typography sx={{ fontSize: 13, fontWeight: esTotal || faltante > 0 ? 700 : 400, color }}>
                    {faltante}
                </Typography>
            );
        },
    },
    {
        accessorKey: "notas",
        header: textos.notas,
        meta: { ancho: ANCHOS_REPORTE.notas, alineacion: "center" },
        cell: soloDetalle((fila) => {
            if (!fila.notas) return celdaTexto("");
            const color = COLORES_TIPO_ENVIO[fila.tipoEnvio ?? 0] ?? "#64748b";
            return (
                <Chip
                    size="small"
                    label={fila.notas}
                    sx={{
                        fontWeight: 600,
                        fontSize: 10,
                        color,
                        backgroundColor: `${color}1A`,
                        border: `1px solid ${color}`,
                    }}
                />
            );
        }),
    },
    {
        accessorKey: "fechaFactura",
        header: textos.fechaFactura,
        meta: { ancho: ANCHOS_REPORTE.fecha, alineacion: "center", sinCorte: true },
        cell: soloDetalle((fila) => celdaNumero(fecha(fila.fechaFactura))),
    },
    {
        accessorKey: "precioUnitarioCompra",
        header: textos.precioUnitarioCompra,
        meta: { ancho: ANCHOS_REPORTE.moneda, alineacion: "right", sinCorte: true },
        cell: soloDetalle((fila) => celdaNumero(moneda(fila.precioUnitarioCompra))),
    },
    {
        accessorKey: "total",
        header: textos.total,
        meta: { ancho: ANCHOS_REPORTE.moneda, alineacion: "right", sinCorte: true },
        cell: ({ row }) => celdaNumero(moneda(row.original.total), true),
    },
];
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import { IconBox, IconEye } from "@tabler/icons-react";
import EstadoValidacionChip from "modules/listadoCanjes/components/EstadoValidacionChip";
import { formatearFecha, formatearPuntos } from "modules/listadoCanjes/utils";
import BotonValidacion from "./BotonValidacion";
import { motivoNoValidable } from "../utils";
import type { AccionesFilaCanje, CanjeEstatus } from "../types";

const columnHelper = createColumnHelper<CanjeEstatus>();

const nombresProductos = (canje: CanjeEstatus) =>
    canje.productos
        .map((p) => p.nombre_premio)
        .filter(Boolean)
        .join(", ");

/** Columnas de la tabla del modal **/
export const crearColumnasCanjesEstatus = ({
    onVer,
    onValidar,
    enCurso,
}: AccionesFilaCanje): ColumnDef<CanjeEstatus, any>[] => [
        columnHelper.display({
            id: "validaciones",
            header: "Acciones",
            size: 140,
            cell: ({ row }) => {
                const canje = row.original;
                const motivo = motivoNoValidable(canje);
                const esEsteCanje = enCurso?.idCanje === canje.id;

                return (
                    <Box sx={{ display: "flex", whiteSpace: "nowrap" }}>
                        <Tooltip title="Ver detalle del canje">
                            <IconButton
                                aria-label="Ver detalle del canje"
                                size="small"
                                onClick={() => onVer(canje)}
                                sx={{
                                    background: "#084d6e",
                                    color: "#fff",
                                    borderRadius: 1,
                                    mr: 0.5,
                                    "&:hover": { background: "#043952" },
                                }}
                            >
                                <IconEye stroke={2} size={18} />
                            </IconButton>
                        </Tooltip>
                        <BotonValidacion
                            tipo="cliente"
                            onClick={() => onValidar(canje, "cliente")}
                            procesando={esEsteCanje && enCurso?.tipo === "cliente"}
                            bloqueado={!!enCurso}
                            motivoDeshabilitado={motivo}
                        />
                        <BotonValidacion
                            tipo="directa"
                            onClick={() => onValidar(canje, "directa")}
                            procesando={esEsteCanje && enCurso?.tipo === "directa"}
                            bloqueado={!!enCurso}
                            motivoDeshabilitado={motivo}
                        />
                    </Box>
                );
            },
        }),
        columnHelper.accessor("folio", { header: "Folio", size: 140 }),
        columnHelper.accessor("nombre_usuario", { header: "Cliente", size: 200 }),
        columnHelper.accessor("creacion_canje", {
            header: "Fecha",
            size: 170,
            cell: (info) => formatearFecha(info.getValue()),
        }),
        columnHelper.accessor("total_puntos", {
            header: "Puntos",
            size: 100,
            cell: (info) => formatearPuntos(info.getValue()),
        }),
        columnHelper.accessor(nombresProductos, {
            id: "productos",
            header: "Productos",
            size: 150,
            cell: ({ row, getValue }) => {
                const total = row.original.productos.length;
                const sinRegistrar = row.original.productos.filter((p) => !p.id_producto).length;
                const titulo = sinRegistrar
                    ? `${getValue()} — ${sinRegistrar} sin registrar en catálogo`
                    : getValue();

                return (
                    <Tooltip title={titulo}>
                        <Chip
                            icon={<IconBox stroke={2} />}
                            color={sinRegistrar ? "warning" : "default"}
                            label={`${total} ${total > 1 ? "productos" : "producto"}`}
                        />
                    </Tooltip>
                );
            },
        }),
        columnHelper.accessor("estado_validacion", {
            header: "Estatus",
            size: 180,
            sortUndefined: "last",
            cell: (info) => <EstadoValidacionChip estado={info.getValue()} />,
        }),
    ];
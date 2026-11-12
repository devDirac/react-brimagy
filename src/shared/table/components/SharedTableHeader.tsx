import type { CSSProperties } from "react";
import { flexRender } from "@tanstack/react-table";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import type { ControlSharedTabla } from "../types/sharedTable.types";
import type {
    ColoresTabla,
    ObtenerEstiloFijado,
} from "../utils/tableStyles";

const ICONO_ORDEN = {
    asc: ArrowUpwardRoundedIcon,
    desc: ArrowDownwardRoundedIcon,
} as const;

interface SharedTableHeaderProps<TFila> {
    control: ControlSharedTabla<TFila>;
    colores: ColoresTabla;
    obtenerEstiloFijado: ObtenerEstiloFijado<TFila>;
    darkMode: boolean;
    estilo?: CSSProperties;
}

export const SharedTableHeader = <TFila,>({
    control,
    colores,
    obtenerEstiloFijado,
    darkMode,
    estilo,
}: SharedTableHeaderProps<TFila>): JSX.Element => (
    <thead style={estilo}>
        {control.tabla.getHeaderGroups().map((grupo) => (
            <tr
                key={grupo.id}
                style={{
                    backgroundColor: darkMode ? "rgba(255,255,255,0.03)" : "#041d45",
                }}
            >
                {grupo.headers.map((encabezado) => {
                    const meta = encabezado.column.columnDef.meta;
                    const puedeOrdenar = encabezado.column.getCanSort();
                    const direccion = encabezado.column.getIsSorted();
                    const IconoOrden =
                        direccion === false
                            ? UnfoldMoreRoundedIcon
                            : ICONO_ORDEN[direccion];

                    const estiloFijado = obtenerEstiloFijado(
                        encabezado.column,
                        colores.fondoEncabezado
                    );

                    return (
                        <th
                            key={encabezado.id}
                            className="text-nowrap px-3 py-2 fw-bold text-uppercase"
                            style={{
                                fontSize: 9.5,
                                letterSpacing: "0.06em",
                                width: estiloFijado
                                    ? encabezado.column.getSize()
                                    : meta?.ancho,
                                textAlign: meta?.alineacion ?? "left",
                                color: colores.etiqueta,
                                borderBottom: `1px solid ${colores.borde}`,
                                ...estiloFijado,
                                zIndex: estiloFijado ? 3 : undefined,
                            }}
                            aria-sort={
                                direccion === "asc"
                                    ? "ascending"
                                    : direccion === "desc"
                                        ? "descending"
                                        : undefined
                            }
                        >
                            {encabezado.isPlaceholder ? null : puedeOrdenar ? (
                                <button
                                    type="button"
                                    onClick={encabezado.column.getToggleSortingHandler()}
                                    className="sharedtabla-orden d-inline-flex align-items-center gap-1 border-0 bg-transparent p-0 fw-bold text-uppercase"
                                    style={{ color: "inherit", cursor: "pointer", fontSize: 9.5, letterSpacing: "0.06em" }}
                                >
                                    {flexRender(
                                        encabezado.column.columnDef.header,
                                        encabezado.getContext()
                                    )}
                                    <IconoOrden
                                        sx={{
                                            fontSize: 15,
                                            stroke: "currentColor",
                                            strokeWidth: direccion === false ? 0 : 1.1,
                                            opacity: direccion === false ? 0.38 : 1,
                                            transition:
                                                "opacity 0.15s ease, stroke-width 0.15s ease",
                                            ".sharedtabla-orden:hover &": {
                                                opacity: 1,
                                                strokeWidth: 1.1,
                                            },
                                        }}
                                    />
                                </button>
                            ) : (
                                flexRender(
                                    encabezado.column.columnDef.header,
                                    encabezado.getContext()
                                )
                            )}
                        </th>
                    );
                })}
            </tr>
        ))}
    </thead>
);
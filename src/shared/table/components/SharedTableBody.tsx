import { Fragment, type ReactNode } from "react";
import { flexRender, type Row } from "@tanstack/react-table";
import { SharedTableEstadoVacio } from "./SharedTableEstadoVacio";
import type { ControlSharedTabla } from "../types/sharedTable.types";
import type {
    ColoresTabla,
    ObtenerEstiloFijado,
} from "../utils/tableStyles";

const ANCHO_RELLENO_DETALLE = 32;

export interface FilaAPintar<TFila> {
    fila: Row<TFila>;
    indice: number;
}

interface SharedTableBodyProps<TFila> {
    control: ControlSharedTabla<TFila>;
    colores: ColoresTabla;
    obtenerEstiloFijado: ObtenerEstiloFijado<TFila>;
    darkMode: boolean;
    filasAPintar: FilaAPintar<TFila>[];
    totalColumnas: number;
    mensajeVacio: string;
    claseCelda: string;
    sangriaPorNivel: number;
    anchoVisible: number;
    espacioSuperior: number;
    espacioInferior: number;
    renderDetalle?: (fila: Row<TFila>) => ReactNode;
    renderSubFila?: (fila: Row<TFila>) => ReactNode;
}

export const SharedTableBody = <TFila,>({
    control,
    colores,
    obtenerEstiloFijado,
    darkMode,
    filasAPintar,
    totalColumnas,
    mensajeVacio,
    claseCelda,
    sangriaPorNivel,
    anchoVisible,
    espacioSuperior,
    espacioInferior,
    renderDetalle,
    renderSubFila
}: SharedTableBodyProps<TFila>): JSX.Element => {
    const { tabla, tablaPie, hayFilasPie } = control;
    const sinFilas = tabla.getRowModel().rows.length === 0;
    const claseHoverFila = darkMode
        ? "sharedtabla-fila-hover-dark"
        : "sharedtabla-fila-hover-light";

    return (
        <>
            <tbody>
                {sinFilas ? (
                    <tr>
                        <td colSpan={totalColumnas} className="p-0">
                            <SharedTableEstadoVacio mensaje={mensajeVacio} />
                        </td>
                    </tr>
                ) : (
                    <>
                        {espacioSuperior > 0 && (
                            <tr aria-hidden="true">
                                <td colSpan={totalColumnas} style={{ height: espacioSuperior }} />
                            </tr>
                        )}

                        {filasAPintar.map(({ fila, indice }) => {
                            const subFila = renderSubFila?.(fila);

                            return (
                                <Fragment key={fila.id}>
                                    <tr
                                        className={claseHoverFila}
                                        style={{ transition: "background-color 150ms" }}
                                    >
                                        {fila.getVisibleCells().map((celda, indiceCelda) => {
                                            const meta = celda.column.columnDef.meta;

                                            return (
                                                <td
                                                    key={celda.id}
                                                    className={claseCelda}
                                                    style={{
                                                        textAlign: meta?.alineacion ?? "left",
                                                        whiteSpace: meta?.sinCorte ? "nowrap" : undefined,
                                                        paddingLeft:
                                                            indiceCelda === 0 && sangriaPorNivel > 0
                                                                ? 12 + fila.depth * sangriaPorNivel
                                                                : undefined,
                                                        borderTop:
                                                            indice === 0
                                                                ? undefined
                                                                : `1px solid ${colores.borde}`,
                                                        ...obtenerEstiloFijado(
                                                            celda.column,
                                                            colores.fondoFila
                                                        ),
                                                    }}
                                                >
                                                    {flexRender(
                                                        celda.column.columnDef.cell,
                                                        celda.getContext()
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    {subFila && (
                                        <tr>
                                            <td
                                                colSpan={totalColumnas}
                                                className={claseCelda}
                                                style={{ paddingTop: 0, whiteSpace: "normal" }}
                                            >
                                                {subFila}
                                            </td>
                                        </tr>
                                    )}

                                    {renderDetalle && fila.getIsExpanded() && (
                                        <tr>
                                            <td
                                                colSpan={totalColumnas}
                                                className="px-4 pb-3"
                                                style={{
                                                    backgroundColor: darkMode
                                                        ? "rgba(255,255,255,0.02)"
                                                        : "#f8fafc",
                                                }}
                                            >
                                                <div
                                                    style={
                                                        anchoVisible > 0
                                                            ? {
                                                                position: "sticky",
                                                                left: 0,
                                                                width: anchoVisible - ANCHO_RELLENO_DETALLE,
                                                            }
                                                            : undefined
                                                    }
                                                >
                                                    {renderDetalle(fila)}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        })}

                        {espacioInferior > 0 && (
                            <tr aria-hidden="true">
                                <td colSpan={totalColumnas} style={{ height: espacioInferior }} />
                            </tr>
                        )}
                    </>
                )}
            </tbody>

            {hayFilasPie && (
                <tfoot>
                    {tablaPie.getRowModel().rows.map((fila, indice) => (
                        <tr key={fila.id} style={{ backgroundColor: colores.fondoPie }}>
                            {fila.getVisibleCells().map((celda) => {
                                const meta = celda.column.columnDef.meta;

                                return (
                                    <td
                                        key={celda.id}
                                        className={`${claseCelda} fw-bold`}
                                        style={{
                                            textAlign: meta?.alineacion ?? "left",
                                            whiteSpace: meta?.sinCorte ? "nowrap" : undefined,
                                            borderTop:
                                                indice === 0
                                                    ? `2px solid ${colores.borde}`
                                                    : `1px solid ${colores.borde}`,
                                            ...obtenerEstiloFijado(celda.column, colores.fondoPie),
                                        }}
                                    >
                                        {flexRender(celda.column.columnDef.cell, celda.getContext())}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tfoot>
            )}
        </>
    );
};
import { ReactNode } from "react";
import { flexRender, type Row } from "@tanstack/react-table";
import { useMaterialUIController } from "context";
import { SharedTableEstadoVacio } from "./SharedTableEstadoVacio";
import type { ControlSharedTabla } from "../types/sharedTable.types";

interface SharedTableCardsProps<TFila> {
    control: ControlSharedTabla<TFila>;
    mensajeVacio?: string;
    renderTarjeta?: (fila: Row<TFila>) => ReactNode;
    renderDetalle?: (fila: Row<TFila>) => ReactNode;
    renderSubFila?: (fila: Row<TFila>) => ReactNode;
}

export const SharedTableCards = <TFila,>({
    control,
    mensajeVacio = "Sin registros",
    renderTarjeta,
    renderDetalle,
    renderSubFila
}: SharedTableCardsProps<TFila>): JSX.Element => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { tabla, tablaPie, hayFilasPie } = control;

    const filas = tabla.getRowModel().rows;
    const filasPie = tablaPie.getRowModel().rows;
    const encabezadosPorColumna = new Map(
        tabla.getFlatHeaders().map((encabezado) => [encabezado.column.id, encabezado])
    );
    const colorEtiqueta = darkMode ? "#64748b" : "#94a3b8";
    const colorBorde = darkMode
        ? "rgba(255,255,255,0.06)"
        : "rgba(15,23,42,0.06)";

    if (filas.length === 0) {
        return <SharedTableEstadoVacio mensaje={mensajeVacio} darkMode={darkMode} />;
    }

    const colorFondoPie = darkMode ? '#232b3e' : '#f8fafc';
    const colorBordeFuerte = darkMode
        ? 'rgba(255,255,255,0.16)'
        : 'rgba(15,23,42,0.16)';

    return (
        <div className="d-flex flex-column">
            {filas.map((fila) => {
                const subFila = renderSubFila?.(fila)

                return (
                    <div
                        key={fila.id}
                        className="px-3 py-3"
                        style={{ borderBottom: `1px solid ${colorBorde}` }}
                    >
                        {renderTarjeta ? (
                            renderTarjeta(fila)
                        ) : (
                            <dl
                                className="m-0"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "minmax(0, 7rem) 1fr",
                                    columnGap: 12,
                                    rowGap: 6,
                                }}
                            >
                                {fila
                                    .getVisibleCells()
                                    .filter(
                                        (celda) =>
                                            celda.column.columnDef.meta?.ocultarEnMovil !== true
                                    )
                                    .map((celda) => {
                                        const encabezado = encabezadosPorColumna.get(celda.column.id);

                                        return (
                                            <div key={celda.id} style={{ display: "contents" }}>
                                                <dt
                                                    className="fw-bold text-uppercase"
                                                    style={{ fontSize: 10, letterSpacing: "0.05em", color: colorEtiqueta }}
                                                >
                                                    {encabezado && !encabezado.isPlaceholder
                                                        ? flexRender(
                                                            encabezado.column.columnDef.header,
                                                            encabezado.getContext()
                                                        )
                                                        : null}
                                                </dt>
                                                <dd className="m-0" style={{ minWidth: 0, fontSize: 13 }}>
                                                    {flexRender(
                                                        celda.column.columnDef.cell,
                                                        celda.getContext()
                                                    )}
                                                </dd>
                                            </div>
                                        );
                                    })}
                            </dl>
                        )}

                        {renderDetalle && fila.getIsExpanded() && (
                            <div className="mt-2">{renderDetalle(fila)}</div>
                        )}

                        {subFila && <div className="mt-2">{subFila}</div>}

                    </div>
                )
            })}

            {hayFilasPie &&
                filasPie.map((fila) => (
                    <div
                        key={fila.id}
                        className="px-3 py-3"
                        style={{
                            borderTop: `2px solid ${colorBordeFuerte}`,
                            backgroundColor: colorFondoPie,
                        }}
                    >
                        {renderTarjeta ? (
                            renderTarjeta(fila)
                        ) : (
                            <dl className="m-0 d-flex flex-column gap-1 fw-bold">
                                {fila.getVisibleCells().map((celda) => {
                                    const encabezado = encabezadosPorColumna.get(celda.column.id);

                                    return (
                                        <div key={celda.id} className="d-flex flex-column">
                                            <dt
                                                className="fw-bold text-uppercase"
                                                style={{ fontSize: 9, letterSpacing: "0.05em", color: colorEtiqueta }}
                                            >
                                                {encabezado && !encabezado.isPlaceholder
                                                    ? flexRender(
                                                        encabezado.column.columnDef.header,
                                                        encabezado.getContext()
                                                    )
                                                    : null}
                                            </dt>
                                            <dd className="m-0 text-break" style={{ minWidth: 0, fontSize: 12.5 }}>
                                                {flexRender(celda.column.columnDef.cell, celda.getContext())}
                                            </dd>
                                        </div>
                                    );
                                })}
                            </dl>
                        )}
                    </div>
                ))}
        </div>
    );
};
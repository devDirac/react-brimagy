import { ReactNode, useRef } from "react";
import { useMediaQuery } from "@mui/material";
import type { Row } from "@tanstack/react-table";
import { useMaterialUIController } from "context";
import { SharedTableSearch } from "./SharedTableSearch";
import { SharedTableColumns } from "./SharedTableColumns";
import { SharedTableEstadoVacio } from "./SharedTableEstadoVacio";
import { SharedTablePaginator } from "./SharedTablePaginator";
import { SharedTableCards } from "./SharedTableCards";
import type { ControlSharedTabla } from "../types/sharedTable.types";
import { SharedTableLoading } from "./SharedTableLoading";

const CONSULTA_PANTALLA_MOVIL = "(max-width: 767.98px)";

interface SharedTableProps<TFila> {
    control: ControlSharedTabla<TFila>;
    cargando?: boolean;
    busqueda?: boolean;
    placeholderBusqueda?: string;
    paginador?: boolean;
    mensajeVacio?: string;
    anchoMinimo?: number;
    sangriaPorNivel?: number;
    virtualizada?: boolean;
    alturaVisible?: number;
    alturaFilaEstimada?: number;
    compacta?: boolean;
    renderDetalle?: (fila: Row<TFila>) => ReactNode;
    renderTarjeta?: (fila: Row<TFila>) => ReactNode;
    acciones?: ReactNode;
    exportar?: ReactNode;
    accionesDebajo?: boolean;
    encabezadoFijo?: boolean;
    navegacionFija?: boolean;
    children?: ReactNode;
    renderSubFila?: (fila: Row<TFila>) => ReactNode;
}

export const SharedTable = <TFila,>({
    control,
    cargando = false,
    busqueda = false,
    placeholderBusqueda,
    paginador = true,
    mensajeVacio = "Sin registros",
    anchoMinimo,
    sangriaPorNivel,
    virtualizada,
    alturaVisible,
    alturaFilaEstimada,
    compacta,
    renderDetalle,
    renderTarjeta,
    acciones,
    exportar,
    accionesDebajo = false,
    encabezadoFijo = false,
    navegacionFija = true,
    children,
    renderSubFila
}: SharedTableProps<TFila>): JSX.Element => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const esPantallaMovil = useMediaQuery(CONSULTA_PANTALLA_MOVIL);
    const refPie = useRef<HTMLDivElement>(null);

    const colorBorde = darkMode
        ? "rgba(255,255,255,0.06)"
        : "rgba(15,23,42,0.06)";

    const sinFilas = control.tabla.getRowModel().rows.length === 0;
    const soloEstadoVacio =
        sinFilas && !cargando && !control.hayFiltrosActivos && children === undefined;

    if (soloEstadoVacio) {
        return (
            <>
                {(acciones || exportar) && (
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-3">
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            {acciones}
                        </div>
                        {exportar}
                    </div>
                )}
                <SharedTableEstadoVacio mensaje={mensajeVacio} darkMode={darkMode} />
            </>
        );
    }

    const cuerpo =
        children ??
        (esPantallaMovil ? (
            <SharedTableCards
                control={control}
                mensajeVacio={mensajeVacio}
                renderTarjeta={renderTarjeta}
                renderDetalle={renderDetalle}
                renderSubFila={renderSubFila}
            />
        ) : (
            <SharedTableColumns
                control={control}
                mensajeVacio={mensajeVacio}
                anchoMinimo={anchoMinimo}
                sangriaPorNivel={sangriaPorNivel}
                virtualizada={virtualizada}
                alturaVisible={alturaVisible}
                alturaFilaEstimada={alturaFilaEstimada}
                compacta={compacta}
                renderDetalle={renderDetalle}
                encabezadoFijo={encabezadoFijo}
                refPie={refPie}
                navegacionFija={navegacionFija && paginador}
                renderSubFila={renderSubFila}
            />
        ));

    return (
        <div
            className={`rounded-4 border ${encabezadoFijo ? "" : "overflow-hidden"}`}
            style={{
                position: "relative",
                overflow: encabezadoFijo ? "clip" : undefined,
                backgroundColor: darkMode ? "#1c2438" : "#ffffff",
                borderColor: colorBorde,
                boxShadow: darkMode
                    ? "0 0 0 rgba(0,0,0,0)"
                    : "0 1px 2px rgba(15,23,42,0.04)",
            }}
        >
            <SharedTableLoading visible={cargando} darkMode={darkMode} />

            {(busqueda || acciones || exportar) && (
                <div
                    className={`d-flex gap-2 px-3 py-3 ${accionesDebajo
                        ? "flex-column"
                        : "flex-wrap align-items-center justify-content-between"
                        }`}
                    style={{ borderBottom: `1px solid ${colorBorde}` }}
                >
                    {(busqueda || exportar) && (
                        <div
                            className={`d-flex align-items-center justify-content-between gap-2 ${accionesDebajo ? "w-100" : "flex-grow-1"
                                }`}
                            // Ocupa el espacio libre sin empujar a las acciones; si no caben, éstas bajan completas
                            style={accionesDebajo ? undefined : { flexBasis: 260, minWidth: 0 }}
                        >
                            {busqueda ? (
                                <SharedTableSearch
                                    control={control}
                                    placeholder={placeholderBusqueda}
                                />
                            ) : (
                                <span />
                            )}

                            {exportar && (
                                <div className="d-flex flex-shrink-0 align-items-center gap-2">
                                    {exportar}
                                </div>
                            )}
                        </div>
                    )}

                    {acciones && (
                        <div
                            className={
                                accionesDebajo
                                    ? "d-flex w-100 align-items-center gap-2 overflow-auto pb-1"
                                    : "d-flex flex-nowrap flex-shrink-0 align-items-center gap-2 ms-auto"
                            }
                        >
                            {acciones}
                        </div>
                    )}
                </div>
            )}

            {cuerpo}

            {paginador && (
                <div ref={refPie} style={{ borderTop: `1px solid ${colorBorde}` }}>
                    <SharedTablePaginator control={control} />
                </div>
            )}
        </div>
    );
};
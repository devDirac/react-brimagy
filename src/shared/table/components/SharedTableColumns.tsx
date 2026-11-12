import {
    CSSProperties,
    ReactNode,
    RefObject,
    useEffect,
    useRef,
    useState,
} from "react";
import type { Row } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMaterialUIController } from "context";
import { SharedTableBarraFija } from "./SharedTableBarraFija";
import { SharedTableBody } from "./SharedTableBody";
import { useHeaderFijo } from "../hooks/useHeaderFijo";
import "../styles/sharedTable.css";
import type { ControlSharedTabla } from "../types/sharedTable.types";
import {
    anchoDeColumna,
    crearObtenerEstiloFijado,
    obtenerColoresTabla,
} from "../utils/tableStyles";
import { SharedTableHeader } from "./SharedTableHeader";

interface SharedTableColumnsProps<TFila> {
    control: ControlSharedTabla<TFila>;
    anchoMinimo?: number;
    mensajeVacio?: string;
    renderDetalle?: (fila: Row<TFila>) => ReactNode;
    sangriaPorNivel?: number;
    virtualizada?: boolean;
    alturaVisible?: number;
    alturaFilaEstimada?: number;
    compacta?: boolean;
    encabezadoFijo?: boolean;
    refPie?: RefObject<HTMLElement>;
    navegacionFija?: boolean;
    renderSubFila?: (fila: Row<TFila>) => ReactNode;
}

export const SharedTableColumns = <TFila,>({
    control,
    anchoMinimo = 880,
    mensajeVacio = "Sin registros",
    renderDetalle,
    sangriaPorNivel = 0,
    virtualizada = false,
    alturaVisible = 520,
    alturaFilaEstimada = 44,
    compacta = false,
    encabezadoFijo = false,
    refPie,
    navegacionFija = true,
    renderSubFila
}: SharedTableColumnsProps<TFila>): JSX.Element => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { tabla } = control;

    const colores = obtenerColoresTabla(darkMode);
    const obtenerEstiloFijado = crearObtenerEstiloFijado(
        tabla,
        colores.sombraFijado
    );

    const filas = tabla.getRowModel().rows;
    const totalColumnas = tabla.getVisibleFlatColumns().length;
    const contenedorRef = useRef<HTMLDivElement>(null);
    const [anchoVisible, setAnchoVisible] = useState<number>(0);

    const dividido = encabezadoFijo && !virtualizada;

    const {
        refCentinela,
        refEncabezado,
        refCuerpo,
        refPista,
        refPulgar,
        desplazamientoSuperior,
        mostrarHerramientas,
        pegado,
        hayDesbordeHorizontal,
    } = useHeaderFijo(dividido, refPie);

    useEffect(() => {
        const contenedor = contenedorRef.current;

        if (contenedor === null) {
            return;
        }

        const medir = (): void => setAnchoVisible(contenedor.clientWidth);

        medir();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", medir);

            return () => window.removeEventListener("resize", medir);
        }

        const observador = new ResizeObserver(medir);

        observador.observe(contenedor);

        return () => observador.disconnect();
    }, [dividido]);

    const claseCelda = compacta
        ? "overflow-hidden px-2 py-1 align-middle"
        : "overflow-hidden px-3 py-2 align-middle";
    const estiloCelda: CSSProperties = compacta ? { fontSize: 12 } : {};

    const virtualizador = useVirtualizer({
        count: virtualizada ? filas.length : 0,
        getScrollElement: () => contenedorRef.current,
        estimateSize: () => alturaFilaEstimada,
        overscan: 8,
    });

    const filasVirtuales = virtualizador.getVirtualItems();
    const espacioSuperior = filasVirtuales.length > 0 ? filasVirtuales[0].start : 0;
    const espacioInferior =
        filasVirtuales.length > 0
            ? virtualizador.getTotalSize() -
            filasVirtuales[filasVirtuales.length - 1].end
            : 0;

    const filasAPintar = virtualizada
        ? filasVirtuales.map((virtual) => ({
            fila: filas[virtual.index],
            indice: virtual.index,
        }))
        : filas.map((fila, indice) => ({ fila, indice }));

    const estiloTabla: CSSProperties = {
        minWidth: anchoMinimo,
        tableLayout: "fixed",
        width: "100%",
        borderCollapse: "collapse",
    };

    const grupoColumnas = (
        <colgroup>
            {tabla.getVisibleLeafColumns().map((columna) => (
                <col key={columna.id} style={{ width: anchoDeColumna(columna) }} />
            ))}
        </colgroup>
    );

    const cuerpo = (
        <SharedTableBody
            control={control}
            colores={colores}
            obtenerEstiloFijado={obtenerEstiloFijado}
            darkMode={darkMode}
            filasAPintar={filasAPintar}
            totalColumnas={totalColumnas}
            mensajeVacio={mensajeVacio}
            claseCelda={claseCelda}
            sangriaPorNivel={sangriaPorNivel}
            anchoVisible={anchoVisible}
            espacioSuperior={espacioSuperior}
            espacioInferior={espacioInferior}
            renderDetalle={renderDetalle}
            renderSubFila={renderSubFila}
        />
    );

    if (!dividido) {
        return (
            <div
                ref={contenedorRef}
                style={{
                    overflowX: "auto",
                    ...(virtualizada ? { maxHeight: alturaVisible, overflowY: "auto" } : {}),
                }}
            >
                <table style={estiloTabla}>
                    <SharedTableHeader
                        control={control}
                        colores={colores}
                        obtenerEstiloFijado={obtenerEstiloFijado}
                        darkMode={darkMode}
                        estilo={
                            virtualizada
                                ? { position: "sticky", top: 0, zIndex: 1 }
                                : undefined
                        }
                    />
                    {cuerpo}
                </table>
            </div>
        );
    }

    return (
        <div ref={contenedorRef} style={{ position: "relative" }}>
            <div ref={refCentinela} style={{ height: 1 }} aria-hidden="true" />

            <div
                style={{
                    position: "sticky",
                    top: desplazamientoSuperior,
                    zIndex: 20,
                    backgroundColor: colores.fondoEncabezado,
                    boxShadow: pegado ? "0 12px 24px -20px rgba(9,24,48,0.6)" : "none",
                    transition: "box-shadow 220ms linear",
                }}
            >
                <SharedTableBarraFija
                    control={control}
                    colores={colores}
                    darkMode={darkMode}
                    visible={mostrarHerramientas}
                    refPista={refPista}
                    refPulgar={refPulgar}
                    hayDesbordeHorizontal={hayDesbordeHorizontal}
                    navegacion={navegacionFija}
                />

                <div
                    ref={refEncabezado}
                    className="sharedtabla-encabezado-fijo"
                    style={{ overflowX: "auto", overflowY: "hidden" }}
                >
                    <table style={estiloTabla}>
                        {grupoColumnas}
                        <SharedTableHeader
                            control={control}
                            colores={colores}
                            obtenerEstiloFijado={obtenerEstiloFijado}
                            darkMode={darkMode}
                        />
                    </table>
                </div>
            </div>

            <div ref={refCuerpo} style={{ overflowX: "auto" }}>
                <table style={estiloTabla}>
                    {grupoColumnas}
                    {cuerpo}
                </table>
            </div>
        </div>
    );
};
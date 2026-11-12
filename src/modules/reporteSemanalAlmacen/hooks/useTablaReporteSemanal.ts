import { useMemo } from "react";
import { useSharedTable } from "../../../shared/table";
import type {
    FilaReporteSemanal,
    GrupoProveedor,
    TextosReporteSemanal,
} from "../types/reporteSemanalAlmacen.types";
import { construirColumnasReporteSemanal } from "../components/ReporteSemanalColumnas";
import { TAMANO_SIN_PAGINAR } from "../constants/reporteSemanalAlmacen.constants";
import { crearFilaTotal } from "../utils/reporteSemanalAlmacenOperaciones.utils";

/** Control de la tabla de productos de un proveedor (con su total en el pie). */
export const useTablaReporteSemanal = (grupo: GrupoProveedor, textos: TextosReporteSemanal) => {
    const columnas = useMemo(() => construirColumnasReporteSemanal(textos), [textos]);

    const filasPie = useMemo(
        () => [crearFilaTotal(grupo.totales, textos.totalProveedor)],
        [grupo.totales, textos.totalProveedor]
    );

    return useSharedTable<FilaReporteSemanal>({
        columnas,
        datos: grupo.filas,
        filasPie,
        tamanoPaginaInicial: TAMANO_SIN_PAGINAR,
        obtenerIdFila: (fila) => fila.id,
        columnasFijas: { izquierda: ["nombreProducto"] },
    });
};
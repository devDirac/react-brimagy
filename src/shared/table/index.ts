export { useSharedTable } from "./hooks/useSharedTable";
export { SharedTable } from "./components/SharedTable";
export { SharedTableColumns } from "./components/SharedTableColumns";
export { SharedTableHeader } from "./components/SharedTableHeader";
export { SharedTableBody } from "./components/SharedTableBody";
export { SharedTableBarraFija } from "./components/SharedTableBarraFija";
export { SharedTableCards } from "./components/SharedTableCards";
export { crearColumnaSeleccion } from "./components/ColumnSelection";
export { SharedTableSearch } from "./components/SharedTableSearch";
export { SharedTextoRecortado } from "./components/SharedTextoRecortado";
export {
    SharedTablePaginator,
    OPCIONES_POR_PAGINA,
} from "./components/SharedTablePaginator";
export { SharedPaginator } from "./components/SharedPaginator";
export { SharedTableEstadoVacio } from "./components/SharedTableEstadoVacio";
//export { SharedTablaExportarExcel } from "./components/SharedTablaExportarExcel";
export { SharedTableLoading } from "./components/SharedTableLoading";
export { useHeaderFijo } from "./hooks/useHeaderFijo";
export {
    obtenerColoresTabla,
    crearObtenerEstiloFijado,
    anchoDeColumna,
} from "./utils/tableStyles";
export type { ColoresTabla, ObtenerEstiloFijado } from "./utils/tableStyles";
export type {
    ControlSharedTabla,
    OpcionesSharedTabla,
    SharedTablaConsulta,
    SharedTablaModo,
    SharedTablaOrden,
    SharedTablaFiltroColumna,
    SharedTablaPaginacion,
    SharedTablaColumnasFijas,
} from "./types/sharedTable.types";
export { normalizarTexto, coincideBusqueda } from "./utils/normalizarTexto";
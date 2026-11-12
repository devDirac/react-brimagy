import { SharedPaginator } from "./SharedPaginator";
import type { ControlSharedTabla } from "../types/sharedTable.types";

export { OPCIONES_POR_PAGINA } from "./SharedPaginator";

interface SharedTablePaginatorProps<TFila> {
    control: ControlSharedTabla<TFila>;
}

export const SharedTablePaginator = <TFila,>({
    control,
}: SharedTablePaginatorProps<TFila>): JSX.Element => {
    const { tabla, total } = control;
    const { pageIndex, pageSize } = tabla.getState().pagination;

    return (
        <SharedPaginator
            indicePagina={pageIndex}
            tamanoPagina={pageSize}
            total={total}
            totalPaginas={tabla.getPageCount()}
            onCambiarPagina={(indicePagina) => tabla.setPageIndex(indicePagina)}
            onCambiarTamanoPagina={(tamanoPagina) => tabla.setPageSize(tamanoPagina)}
        />
    );
};

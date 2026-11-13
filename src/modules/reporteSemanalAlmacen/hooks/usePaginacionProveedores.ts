import { useCallback, useEffect, useMemo, useState } from "react";
import type { GrupoProveedor } from "../types/reporteSemanalAlmacen.types";
import { TAMANO_PAGINA_PROVEEDORES } from "../constants/reporteSemanalAlmacen.constants";

/**
 * Paginación de los bloques de proveedores (en el cliente).
 * Vuelve a la primera página cuando cambian los grupos: otro periodo, semana o búsqueda.
 */
export const usePaginacionProveedores = (
    grupos: GrupoProveedor[],
    tamanoInicial: number = TAMANO_PAGINA_PROVEEDORES
) => {
    const [indicePagina, setIndicePagina] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(tamanoInicial);

    useEffect(() => {
        setIndicePagina(0);
    }, [grupos]);

    const totalPaginas = Math.max(1, Math.ceil(grupos.length / tamanoPagina));
    const indice = Math.min(indicePagina, totalPaginas - 1);

    const visibles = useMemo(
        () => grupos.slice(indice * tamanoPagina, (indice + 1) * tamanoPagina),
        [grupos, indice, tamanoPagina]
    );

    const cambiarTamanoPagina = useCallback((tamano: number) => {
        setTamanoPagina(tamano);
        setIndicePagina(0);
    }, []);

    return {
        visibles,
        indicePagina: indice,
        tamanoPagina,
        total: grupos.length,
        totalPaginas,
        cambiarPagina: setIndicePagina,
        cambiarTamanoPagina,
    };
};
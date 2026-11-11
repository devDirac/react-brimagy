import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { StoreType } from "types/genericTypes";
import { actualizarResumenCanjes } from "actions/canjes";
import { tipoProductoDesdeRuta } from "../utils";
import type { EstatusCanje } from "../types";

export const useContadorCanjes = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");
    const resumen = useSelector((state: StoreType) => state?.app?.resumenCanjes || null);

    const tipoProducto = tipoProductoDesdeRuta(location.pathname);

    const [estatusAbierto, setEstatusAbierto] = useState<EstatusCanje | null>(null);

    const refrescarResumen = useCallback(
        () => actualizarResumenCanjes(dispatch, plataforma, tipoProducto),
        [dispatch, plataforma, tipoProducto]
    );

    useEffect(() => {
        refrescarResumen();
    }, [refrescarResumen]);

    return {
        plataforma,
        tipoProducto,
        resumen,
        cargando: resumen === null,
        estatusAbierto,
        abrir: setEstatusAbierto,
        cerrar: () => setEstatusAbierto(null),
        refrescarResumen,
    };
};
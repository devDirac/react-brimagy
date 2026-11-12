import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { getErrorHttpMessage } from "utils";
import type { StoreType } from "types/genericTypes";
import { setAuth } from "actions/auth";
import { getReporteSemanalAlmacenHttp } from "actions/almacen";
import { getPeriodosHttp } from "actions/configuracion";
import type {
    OpcionPeriodo,
    PlataformaReporte,
    ReporteSemanalAlmacen,
    SemanaSeleccionada,
} from "../types/reporteSemanalAlmacen.types";
import {
    normalizarPeriodos,
    normalizarReporteSemanal,
} from "../utils/reporteSemanalAlmacenNormalizar.utils";
import {
    agruparPorProveedor,
    sumarTotales,
} from "../utils/reporteSemanalAlmacenOperaciones.utils";
import { SEMANA_TODAS } from "../constants/reporteSemanalAlmacen.constants";

/**
 * Datos del reporte: periodos de la plataforma, reporte del periodo elegido,
 * semana activa, búsqueda y los bloques por proveedor que pinta la vista.
 */
export const useReporteSemanalAlmacen = (textoSinProveedor: string) => {
    // useIntl cambia de identidad en cada render de App (IntlProvider recibe un objeto
    // de mensajes nuevo y App se re-renderiza con el scroll). Se guarda en un ref para
    // que no dispare de nuevo la consulta ni resetee la semana elegida.
    const intl = useIntl();
    const intlRef = useRef(intl);
    intlRef.current = intl;

    const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
    const plataforma = useSelector(
        (state: StoreType) => (state?.app?.plataforma || "puntotes") as PlataformaReporte
    );

    useEffect(() => {
        setAuth(token);
    }, [token]);

    const [periodos, setPeriodos] = useState<OpcionPeriodo[]>([]);
    /** null = periodo activo de la plataforma */
    const [idPeriodo, setIdPeriodo] = useState<number | null>(null);
    const [reporte, setReporte] = useState<ReporteSemanalAlmacen | null>(null);
    const [semana, setSemana] = useState<SemanaSeleccionada>(SEMANA_TODAS);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Al cambiar de plataforma: periodo activo y todo el periodo
    useEffect(() => {
        setIdPeriodo(null);
        setSemana(SEMANA_TODAS);
        getPeriodosHttp(plataforma)
            .then((respuesta) => setPeriodos(normalizarPeriodos(respuesta)))
            .catch(() => setPeriodos([]));
    }, [plataforma]);

    /** Al elegir otro periodo se vuelve a "Todo el periodo". */
    const cambiarPeriodo = useCallback((id: number | null) => {
        setIdPeriodo(id);
        setSemana(SEMANA_TODAS);
    }, []);

    const cargarReporte = useCallback(async () => {
        try {
            setCargando(true);
            setError(null);
            const datos = normalizarReporteSemanal(
                await getReporteSemanalAlmacenHttp(plataforma, idPeriodo)
            );
            setReporte(datos);
            // Respeta la semana elegida; solo si ya no existe vuelve a todo el periodo
            setSemana((actual) =>
                actual === SEMANA_TODAS || datos.semanas.some((s) => s.numero === actual)
                    ? actual
                    : SEMANA_TODAS
            );
        } catch (e) {
            setReporte(null);
            setError(
                getErrorHttpMessage(e) ||
                intlRef.current.formatMessage({
                    id: "reporte_semanal_error",
                    defaultMessage: "No se pudo obtener el reporte semanal",
                })
            );
        } finally {
            setCargando(false);
        }
    }, [plataforma, idPeriodo]);

    useEffect(() => {
        cargarReporte();
    }, [cargarReporte]);

    const grupos = useMemo(
        () => agruparPorProveedor(reporte, semana, busqueda, textoSinProveedor),
        [reporte, semana, busqueda, textoSinProveedor]
    );

    const totales = useMemo(() => sumarTotales(grupos.map((g) => g.totales)), [grupos]);

    return {
        plataforma,
        periodos,
        idPeriodo: idPeriodo ?? reporte?.periodo.id ?? null,
        cambiarPeriodo,
        reporte,
        semana,
        cambiarSemana: setSemana,
        busqueda,
        cambiarBusqueda: setBusqueda,
        grupos,
        totales,
        cargando,
        error,
        recargar: cargarReporte,
    };
};
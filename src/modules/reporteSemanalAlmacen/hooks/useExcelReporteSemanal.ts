import { useCallback, useState } from "react";
import { getReporteSemanalAlmacenExcelHttp } from "actions/almacen";
import type { SemanaSeleccionada } from "../types/reporteSemanalAlmacen.types";
import { SEMANA_TODAS } from "../constants/reporteSemanalAlmacen.constants";
import { descargarBlob, mensajeErrorDescarga } from "../utils/reporteSemanalAlmacenDescarga.utils";

/** Descarga del Excel con el periodo y la semana que están seleccionados. */
export const useExcelReporteSemanal = (
    idPeriodo: number | null,
    semana: SemanaSeleccionada,
    textoError: string
) => {
    const [descargando, setDescargando] = useState(false);
    const [mensajeError, setMensajeError] = useState<string | null>(null);

    const descargarExcel = useCallback(async () => {
        try {
            setDescargando(true);
            const params: { id_periodo?: number; semana?: number } = {};
            if (idPeriodo) params.id_periodo = idPeriodo;
            if (semana !== SEMANA_TODAS) params.semana = semana;

            const respuesta = await getReporteSemanalAlmacenExcelHttp(params);
            const sufijo = semana === SEMANA_TODAS ? "periodo" : `semana_${semana}`;
            descargarBlob(respuesta.data, `reporte_semanal_almacen_${sufijo}_${Date.now()}.xlsx`);
        } catch (error) {
            setMensajeError(await mensajeErrorDescarga(error, textoError));
        } finally {
            setDescargando(false);
        }
    }, [idPeriodo, semana, textoError]);

    const cerrarError = useCallback(() => setMensajeError(null), []);

    return { descargando, mensajeError, cerrarError, descargarExcel };
};
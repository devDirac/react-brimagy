import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { getErrorHttpMessage } from "utils";
import { enviarValidacionHttp, enviarValidacionSinProveedorHttp } from "actions/canjes";
import { TIPOS_VALIDACION } from "../constants";
import { armarPayloadValidacion, motivoNoValidable } from "../utils";
import type {
    CanjeEstatus,
    MensajeValidacion,
    TipoValidacion,
    ValidacionEnCurso,
    ValidacionPendiente,
} from "../types";

/** Endpoint de cada validación (los mismos que usa DetalleCanje.tsx). */
const PETICIONES: Record<TipoValidacion, (datos: any) => Promise<unknown>> = {
    cliente: enviarValidacionHttp,
    directa: enviarValidacionSinProveedorHttp,
};

interface Params {
    plataforma: string;
    onValidado?: (canje: CanjeEstatus, tipo: TipoValidacion) => void;
}

export const useValidacionCanje = ({ plataforma, onValidado }: Params) => {
    const intl = useIntl();

    const [pendiente, setPendiente] = useState<ValidacionPendiente | null>(null);
    const [enCurso, setEnCurso] = useState<ValidacionEnCurso | null>(null);
    const [mensaje, setMensaje] = useState<MensajeValidacion | null>(null);

    const solicitar = useCallback((canje: CanjeEstatus, tipo: TipoValidacion) => {
        const motivo = motivoNoValidable(canje);
        if (motivo) {
            setMensaje({ texto: motivo, severidad: "error" });
            return;
        }
        setPendiente({ canje, tipo });
    }, []);

    const confirmar = useCallback(async () => {
        if (!pendiente || enCurso) return;
        const { canje, tipo } = pendiente;
        const config = TIPOS_VALIDACION[tipo];

        setPendiente(null);
        setEnCurso({ idCanje: canje.id, tipo });
        try {
            await PETICIONES[tipo](armarPayloadValidacion(canje, plataforma));
            setMensaje({
                texto: `${intl.formatMessage({ id: config.idMensajeExito })} (folio ${canje.folio})`,
                severidad: "success",
            });
            onValidado?.(canje, tipo);
        } catch (error) {
            setMensaje({
                texto: getErrorHttpMessage(error) || intl.formatMessage({ id: config.idMensajeError }),
                severidad: "error",
            });
        } finally {
            setEnCurso(null);
        }
    }, [pendiente, enCurso, plataforma, intl, onValidado]);

    return {
        pendiente,
        enCurso,
        mensaje,
        solicitar,
        confirmar,
        cancelar: () => setPendiente(null),
        cerrarMensaje: () => setMensaje(null),
    };
};
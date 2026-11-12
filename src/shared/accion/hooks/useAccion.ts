import { useCallback, useEffect, useRef, useState } from "react";
import { mostrarSnackbar } from "../../snackbar/snackbarStore";
import {
    extraerErroresPorCampo,
    extraerMensajeError,
} from "../utils/errorHttp.utils";
import type {
    ControlAccion,
    ErroresPorCampo,
    OpcionesUseAccion,
} from "../types/sharedAccion.types";

const TEXTO_PROCESO_POR_DEFECTO = "Procesando";
const MENSAJE_ERROR_POR_DEFECTO = "No se pudo completar la operación";

export const useAccion = <T, P = void>(
    opciones: OpcionesUseAccion<T, P>
): ControlAccion<T, P> => {
    const [procesando, setProcesando] = useState<boolean>(false);
    const [erroresPorCampo, setErroresPorCampo] = useState<ErroresPorCampo>({});

    const opcionesRef = useRef<OpcionesUseAccion<T, P>>(opciones);
    opcionesRef.current = opciones;

    const enCursoRef = useRef<boolean>(false);
    const montadoRef = useRef<boolean>(true);

    useEffect(() => {
        montadoRef.current = true;

        return () => {
            montadoRef.current = false;
        };
    }, []);

    const limpiarErrores = useCallback(() => {
        setErroresPorCampo({});
    }, []);

    const ejecutar = useCallback(async (parametros: P): Promise<T | undefined> => {
        if (enCursoRef.current) {
            return undefined;
        }

        const actuales = opcionesRef.current;

        enCursoRef.current = true;
        setProcesando(true);
        setErroresPorCampo({});

        try {
            const resultado = await actuales.accion(parametros);

            if (actuales.mensajeExito !== undefined) {
                mostrarSnackbar(actuales.mensajeExito, "exito", {
                    titulo: actuales.tituloExito,
                });
            }

            actuales.alTerminar?.(resultado);

            return resultado;
        } catch (error: unknown) {
            if (montadoRef.current) {
                setErroresPorCampo(extraerErroresPorCampo(error));
            }

            if (actuales.errorSilencioso !== true) {
                mostrarSnackbar(
                    extraerMensajeError(
                        error,
                        actuales.mensajeErrorRespaldo ?? MENSAJE_ERROR_POR_DEFECTO
                    ),
                    "error"
                );
            }

            actuales.alFallar?.(error);

            return undefined;
        } finally {
            enCursoRef.current = false;

            if (montadoRef.current) {
                setProcesando(false);
            }
        }
    }, []);

    return {
        ejecutar,
        procesando,
        textoProceso: opciones.textoProceso ?? TEXTO_PROCESO_POR_DEFECTO,
        erroresPorCampo,
        limpiarErrores,
    };
};
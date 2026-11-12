import type { ErroresPorCampo } from "../types/sharedAccion.types";

const esObjeto = (valor: unknown): valor is Record<string, unknown> =>
    typeof valor === "object" && valor !== null;

const obtenerCuerpoRespuesta = (error: unknown): Record<string, unknown> | null => {
    if (!esObjeto(error) || !esObjeto(error.response)) {
        return null;
    }

    return esObjeto(error.response.data) ? error.response.data : null;
};

const primerTexto = (valor: unknown): string | null => {
    if (typeof valor === "string" && valor.trim().length > 0) {
        return valor;
    }

    if (Array.isArray(valor)) {
        const encontrado = valor.find(
            (elemento): elemento is string =>
                typeof elemento === "string" && elemento.trim().length > 0
        );

        return encontrado ?? null;
    }

    return null;
};

const esMensajeDeAxios = (mensaje: string): boolean =>
    /^Request failed with status code \d+$/i.test(mensaje) ||
    /^Network Error$/i.test(mensaje);

const esMensajeSinContenido = (mensaje: string): boolean =>
    /^(error|failed|exception|internal server error)\.?$/i.test(mensaje.trim());

export const extraerMensajeError = (error: unknown, respaldo: string): string => {
    const cuerpo = obtenerCuerpoRespuesta(error);
    const mensajeRespuesta =
        primerTexto(cuerpo?.message) ?? primerTexto(cuerpo?.msg);

    if (mensajeRespuesta !== null && !esMensajeSinContenido(mensajeRespuesta)) {
        return mensajeRespuesta;
    }

    if (esObjeto(error)) {
        const mensajeError = primerTexto(error.message);

        if (
            mensajeError !== null &&
            !esMensajeDeAxios(mensajeError) &&
            !esMensajeSinContenido(mensajeError)
        ) {
            return mensajeError;
        }
    }

    return respaldo;
};

export const extraerErroresPorCampo = (error: unknown): ErroresPorCampo => {
    const cuerpo = obtenerCuerpoRespuesta(error);

    if (cuerpo === null || !esObjeto(cuerpo.errors)) {
        return {};
    }

    return Object.entries(cuerpo.errors).reduce<ErroresPorCampo>(
        (acumulado, [campo, detalle]) => {
            const mensaje = primerTexto(detalle);

            return mensaje === null ? acumulado : { ...acumulado, [campo]: mensaje };
        },
        {}
    );
};

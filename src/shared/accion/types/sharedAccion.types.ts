export type ErroresPorCampo = Record<string, string>;

export interface OpcionesUseAccion<T, P = void> {
    accion: (parametros: P) => Promise<T>;
    textoProceso?: string;
    mensajeExito?: string;
    tituloExito?: string;
    mensajeErrorRespaldo?: string;
    errorSilencioso?: boolean;
    alTerminar?: (resultado: T) => void;
    alFallar?: (error: unknown) => void;
}

export interface ControlAccion<T, P = void> {
    ejecutar: (parametros: P) => Promise<T | undefined>;
    procesando: boolean;
    textoProceso: string;
    erroresPorCampo: ErroresPorCampo;
    limpiarErrores: () => void;
}

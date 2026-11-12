export type TipoSnackbar = "exito" | "error" | "info" | "advertencia";

export interface OpcionesSnackbar {
    titulo?: string;
    duracionMs?: number;
}

export interface EstadoSnackbar {
    abierto: boolean;
    mensaje: string;
    tipo: TipoSnackbar;
    titulo?: string;
    duracionMs: number;
}

const DURACION_POR_DEFECTO_MS = 4000;

type Escucha = (estado: EstadoSnackbar) => void;

let escucha: Escucha | null = null;

// Un solo listener: hay un único <GenericSnackbar /> montado en la raíz de la app.
export const suscribirSnackbar = (nuevaEscucha: Escucha): (() => void) => {
    escucha = nuevaEscucha;
    return () => {
        if (escucha === nuevaEscucha) {
            escucha = null;
        }
    };
};

export const mostrarSnackbar = (
    mensaje: string,
    tipo: TipoSnackbar = "info",
    opciones: OpcionesSnackbar = {}
): void => {
    escucha?.({
        abierto: true,
        mensaje,
        tipo,
        titulo: opciones.titulo,
        duracionMs: opciones.duracionMs ?? DURACION_POR_DEFECTO_MS,
    });
};
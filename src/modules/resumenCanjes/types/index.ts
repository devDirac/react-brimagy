import type { Canje } from "types/canjeTypes";
import type { ResumenCanjes } from "types/genericTypes";

/** Grupos del contador. Deben coincidir con el enum EstatusCanje del backend. */
export type EstatusCanje = "total" | "sin_validar" | "en_proceso" | "validados";

export type TipoProductoCanje = "fisico" | "digital";

/** "cliente": se envía al usuario para que valide. "directa": se valida sin pasar por el usuario. */
export type TipoValidacion = "cliente" | "directa";

export type CanjeEstatus = Canje;

export interface ConfigEstatusCanje {
    clave: EstatusCanje;
    /** Campo del resumen (Redux) que muestra el contador. */
    campoResumen: keyof ResumenCanjes;
    label: string;
    titulo: string;
    bg: string;
    bgHover: string;
    icon: JSX.Element;
}

export interface ConfigTipoValidacion {
    etiqueta: string;
    confirmacion: string;
    bg: string;
    bgHover: string;
    color: string;
    icon: JSX.Element;
    idMensajeExito: string;
    idMensajeError: string;
    estadoResultante: string;
}

export interface ValidacionEnCurso {
    idCanje: number;
    tipo: TipoValidacion;
}

export interface ValidacionPendiente {
    canje: CanjeEstatus;
    tipo: TipoValidacion;
}

export interface MensajeValidacion {
    texto: string;
    severidad: "success" | "error";
}

export interface FiltrosCanjesEstatus {
    estatus: EstatusCanje;
    plataforma: string;
    tipoProducto?: TipoProductoCanje;
}

export interface AccionesFilaCanje {
    onVer: (canje: CanjeEstatus) => void;
    onValidar: (canje: CanjeEstatus, tipo: TipoValidacion) => void;
    enCurso: ValidacionEnCurso | null;
}
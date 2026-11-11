import {
    IconBrandAuth0,
    IconHelpCircle,
    IconHourglassHigh,
    IconIdBadge2,
    IconListNumbers,
    IconShieldCheck,
} from "@tabler/icons-react";
import type { ConfigEstatusCanje, ConfigTipoValidacion, TipoValidacion } from "../types";

const iconProps = { size: 16, stroke: 2 };

/** Orden y estilo de los contadores */
export const ESTATUS_CANJE: ConfigEstatusCanje[] = [
    {
        clave: "total",
        campoResumen: "total",
        label: "Totales",
        titulo: "Todos los canjes",
        bg: "#084d6e",
        bgHover: "#043952",
        icon: <IconListNumbers {...iconProps} />,
    },
    {
        clave: "sin_validar",
        campoResumen: "sin_validar",
        label: "Sin validar",
        titulo: "Canjes sin validar",
        bg: "#9e9e9e",
        bgHover: "#8a8888",
        icon: <IconHelpCircle {...iconProps} />,
    },
    {
        clave: "en_proceso",
        campoResumen: "en_proceso",
        label: "En proceso",
        titulo: "Canjes en proceso de validación",
        bg: "#f5a623",
        bgHover: "#db9116",
        icon: <IconHourglassHigh {...iconProps} />,
    },
    {
        clave: "validados",
        campoResumen: "validados",
        label: "Validados",
        titulo: "Canjes validados",
        bg: "#3ec972",
        bgHover: "#2fad5e",
        icon: <IconShieldCheck {...iconProps} />,
    },
];

export const TIPOS_VALIDACION: Record<TipoValidacion, ConfigTipoValidacion> = {
    cliente: {
        etiqueta: "Validar identidad con el usuario",
        confirmacion: "Se enviará al cliente un WhatsApp y un correo para que valide su identidad.",
        bg: "#ffc800",
        bgHover: "#cfa300",
        color: "#000",
        icon: <IconIdBadge2 stroke={2} size={18} />,
        idMensajeExito: "validacion_enviada_correctamente",
        idMensajeError: "validacion_enviada_error",
        estadoResultante: "notificacion_enviada",
    },
    directa: {
        etiqueta: "Validar identidad directamente",
        confirmacion:
            "El canje quedará como IDENTIDAD VALIDADA sin pasar por el cliente. Solo se notificará a los administradores del sistema.",
        bg: "#2a9954",
        bgHover: "#19753b",
        color: "#fff",
        icon: <IconBrandAuth0 stroke={2} size={18} />,
        idMensajeExito: "canje_validado_correctamente",
        idMensajeError: "canje_validado_error",
        estadoResultante: "identidad_validada",
    },
};
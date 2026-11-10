import {
  IconHourglassHigh,
  IconMailCheck,
  IconShieldCheck,
  IconProgressCheck,
  IconHelpCircle,
} from "@tabler/icons-react";
import type { EstadoValidacionVisual } from "../types";

const iconProps = { size: 16, stroke: 2 };

export const ESTADOS_VALIDACION: Record<string, EstadoValidacionVisual> = {
  NOTIFICACION_ENVIADA: {
    label: "ENVIADO A USUARIO",
    bg: "#f5a623",
    color: "#ffffff",
    icon: <IconHourglassHigh {...iconProps} />,
  },
  SOLICITUD_ENVIADA: {
    label: "SOLICITUD DE CÓDIGO ENVIADA",
    bg: "#084d6e",
    color: "#ffffff",
    icon: <IconMailCheck {...iconProps} />,
  },
  IDENTIDAD_VALIDADA: {
    label: "IDENTIDAD VALIDADA",
    bg: "#3ec972",
    color: "#ffffff",
    icon: <IconShieldCheck {...iconProps} />,
  },
  VALIDACION_PARCIAL: {
    label: "VALIDACIÓN PARCIAL",
    bg: "#eb2fa5",
    color: "#FFF9C4",
    icon: <IconProgressCheck {...iconProps} />,
  },
};

export const ESTADO_SIN_VALIDAR: EstadoValidacionVisual = {
  label: "SIN VALIDAR",
  bg: "#9e9e9e",
  color: "#ffffff",
  icon: <IconHelpCircle {...iconProps} />,
};

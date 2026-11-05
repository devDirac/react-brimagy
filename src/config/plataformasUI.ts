import { ComponentType } from "react";
import { IconFridge, IconSnowflake, IconBuildingStore } from "@tabler/icons-react";

type IconoTabler = typeof IconFridge;

export interface PlataformaUI {
    label: string;
    color: string;
    textColor?: string;
    icon: IconoTabler;
    iconColor?: string
}

/**
 * Configuración visual por plataforma.
 * La llave es el nombre normalizado (minúsculas, "_" → espacio),
 * tal como viene de dc_plataformas.nombre.
 * Para agregar una plataforma nueva, solo añade una entrada aquí.
 */
export const PLATAFORMAS_UI: Record<string, PlataformaUI> = {
    puntotes: {
        label: "Puntotes",
        color: "#ffdb59",
        textColor: "#000",
        icon: IconFridge,
    },
    "club bohn": {
        label: "Club Bohn",
        color: "#0277bd",
        textColor: "#fff",
        icon: IconSnowflake,
    },
};

export const PLATAFORMA_UI_DEFAULT: PlataformaUI = {
    label: "Sin plataforma",
    color: "#607d8b",
    textColor: "#fff",
    icon: IconBuildingStore,
};

const normalizar = (nombre?: string | null) =>
    (nombre ?? "").trim().toLowerCase().replace(/_/g, " ");

export const getPlataformaUI = (nombre?: string | null): PlataformaUI => {
    const clave = normalizar(nombre);
    if (!clave) return PLATAFORMA_UI_DEFAULT;
    return PLATAFORMAS_UI[clave] ?? { ...PLATAFORMA_UI_DEFAULT, label: nombre as string };
};
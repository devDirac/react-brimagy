import { MouseEvent, ReactNode } from "react";
import { IconButton, SxProps, Theme, Typography } from "@mui/material";

export type SharedIconButtonVariante = "filled" | "ghost";

interface SharedIconButtonProps {
    variante?: SharedIconButtonVariante;
    color?: string;
    colorIcono?: string;
    icono: ReactNode;
    gradient?: boolean;
    sinSombra?: boolean;
    hoverSinBorde?: boolean;
    polished?: boolean;
    disabled?: boolean;
    hoverForzado?: boolean;
    tamanioIcono?: number | string;
    texto?: string;
    titulo?: string;
    onClick?: (evento: MouseEvent<HTMLButtonElement>) => void;
    sx?: SxProps<Theme>;
}

const COLOR_POR_DEFECTO = "#0047AB";
const PADDING_ICONO = "6px";
const GROSOR_BORDE = "1.5px";

// --- Utilidades de color (autocontenidas, sin dependencia externa) ---

interface RgbColor {
    r: number;
    g: number;
    b: number;
}

const hexARgb = (hex: string): RgbColor | null => {
    const resultado = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!resultado) {
        return null;
    }
    return {
        r: parseInt(resultado[1], 16),
        g: parseInt(resultado[2], 16),
        b: parseInt(resultado[3], 16),
    };
};

export const colorARgba = (color: string, alpha: number): string => {
    const rgb = hexARgb(color);
    if (!rgb) {
        return color;
    }
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

const ajustarLuminosidad = (color: string, cantidad: number): string => {
    const rgb = hexARgb(color);
    if (!rgb) {
        return color;
    }
    const ajustar = (valor: number) =>
        Math.max(0, Math.min(255, Math.round(valor + cantidad)));
    return `rgb(${ajustar(rgb.r)}, ${ajustar(rgb.g)}, ${ajustar(rgb.b)})`;
};

const construirGradienteDesdeColor = (color: string): string =>
    `linear-gradient(135deg, ${ajustarLuminosidad(color, 25)}, ${ajustarLuminosidad(color, -25)})`;

// --- Estilos por variante ---

interface EstiloVarianteIconButton {
    color: string;
    backgroundImage: string;
    backgroundColor: string;
    border: string;
    boxShadow: string;
    hover: Record<string, string>;
    active: Record<string, string>;
}

const construirEstilosVariante = (
    variante: SharedIconButtonVariante,
    color: string,
    gradient: boolean,
    colorIcono?: string,
): EstiloVarianteIconButton => {
    const gradiente = construirGradienteDesdeColor(color);
    const sombraReposo = `0 6px 16px ${colorARgba(color, 0.38)}`;
    const sombraHover = `0 10px 22px ${colorARgba(color, 0.5)}`;
    const sombraActivo = `0 4px 10px ${colorARgba(color, 0.4)}`;

    if (variante === "filled") {
        return {
            color: "#FFFFFF !important",
            backgroundImage: gradiente,
            backgroundColor: "transparent",
            border: "none",
            boxShadow: sombraReposo,
            hover: {
                color: "#FFFFFF !important",
                backgroundColor: "transparent",
                boxShadow: sombraHover,
            },
            active: {
                color: "#FFFFFF !important",
                boxShadow: sombraActivo,
            },
        };
    }

    if (gradient) {
        return {
            color: `${colorIcono ?? color} !important`,
            backgroundImage: "none",
            backgroundColor: "transparent",
            border: `${GROSOR_BORDE} solid ${color}`,
            boxShadow: "none",
            hover: {
                color: "#FFFFFF !important",
                backgroundImage: gradiente,
                backgroundColor: "transparent",
                border: `${GROSOR_BORDE} solid transparent`,
                boxShadow: sombraHover,
            },
            active: {
                boxShadow: sombraActivo,
            },
        };
    }

    return {
        color: `${colorIcono ?? color} !important`,
        backgroundImage: "none",
        backgroundColor: "transparent",
        border: `${GROSOR_BORDE} solid ${color}`,
        boxShadow: "none",
        hover: {
            backgroundColor: colorARgba(color, 0.08),
        },
        active: {
            backgroundColor: colorARgba(color, 0.14),
        },
    };
};

const quitarSombras = (
    estilo: EstiloVarianteIconButton,
): EstiloVarianteIconButton => ({
    ...estilo,
    boxShadow: "none",
    hover: { ...estilo.hover, boxShadow: "none" },
    active: { ...estilo.active, boxShadow: "none" },
});

const quitarBordeEnHover = (
    estilo: EstiloVarianteIconButton,
    grosorBorde: string,
): EstiloVarianteIconButton => ({
    ...estilo,
    hover: {
        ...estilo.hover,
        border: "none",
        padding: `calc(${PADDING_ICONO} + ${grosorBorde})`,
    },
});

export const SharedIconButton = ({
    variante = "filled",
    color = COLOR_POR_DEFECTO,
    colorIcono,
    icono,
    gradient = false,
    sinSombra = false,
    hoverSinBorde = false,
    polished = false,
    disabled = false,
    hoverForzado = false,
    tamanioIcono,
    onClick,
    texto,
    titulo,
    sx,
}: SharedIconButtonProps): JSX.Element => {
    const estiloVariante = construirEstilosVariante(
        variante,
        color,
        gradient,
        colorIcono,
    );
    const estiloSinSombra = sinSombra
        ? quitarSombras(estiloVariante)
        : estiloVariante;
    const estilo = hoverSinBorde
        ? quitarBordeEnHover(estiloSinSombra, GROSOR_BORDE)
        : estiloSinSombra;

    return (
        <IconButton
            title={titulo}
            aria-label={titulo ?? texto}
            disabled={disabled}
            onClick={onClick}
            sx={{
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                padding: PADDING_ICONO,
                borderRadius: "10px",
                color: estilo.color,
                backgroundImage: estilo.backgroundImage,
                backgroundColor: estilo.backgroundColor,
                border: estilo.border,
                boxShadow: estilo.boxShadow,
                ...(hoverForzado && estilo.hover),
                transition:
                    "background-color 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease",
                "&:hover": {
                    transform: "translateY(-1px)",
                    ...estilo.hover,
                },
                "&:active": {
                    transform: "translateY(0)",
                    ...estilo.active,
                },
                "&.Mui-disabled": {
                    color: estilo.color,
                    border: estilo.border,
                    opacity: 0.55,
                },
                ...(tamanioIcono !== undefined && {
                    "& svg.MuiSvgIcon-root": {
                        fontSize: `${typeof tamanioIcono === "number"
                            ? `${tamanioIcono}px`
                            : tamanioIcono
                            } !important`,
                    },
                }),
                ...(polished && {
                    "@keyframes sharedActionButtonShine": {
                        "0%": { left: "-60px" },
                        "40%": { left: "calc(100% + 20px)" },
                        "100%": { left: "calc(100% + 20px)" },
                    },
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        height: "250%",
                        width: "40px",
                        top: 0,
                        left: "-60px",
                        background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                        transform: "rotate(45deg) translateY(-35%)",
                        animation: "sharedActionButtonShine 3s ease infinite",
                        pointerEvents: "none",
                    },
                }),
                ...sx,
            }}
        >
            {icono}
            {texto && (
                <Typography
                    variant="button"
                    sx={{
                        width: "100%",
                        fontSize: 12,
                        lineHeight: 1.15,
                        fontWeight: 700,
                        textTransform: "none",
                        textAlign: "center",
                        color: "inherit",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordBreak: "break-word",
                        px: "2px",
                    }}
                >
                    {texto}
                </Typography>
            )}
        </IconButton>
    );
};
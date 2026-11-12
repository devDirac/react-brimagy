import { MouseEvent, ReactNode } from "react";
import { Button, SxProps, Theme } from "@mui/material";

export type SharedActionButtonVariante = "filled" | "ghost";

interface SharedActionButtonProps {
    variante?: SharedActionButtonVariante;
    color?: string;
    colorTexto?: string;
    colorHover?: string;
    colorTextoSobreRelleno?: string;
    texto?: ReactNode;
    icono?: ReactNode;
    gradient?: boolean;
    polished?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    hoverForzado?: boolean;
    tamanioIcono?: number | string;
    onClick?: (evento: MouseEvent<HTMLButtonElement>) => void;
    sx?: SxProps<Theme>;
}

const COLOR_POR_DEFECTO = "#0047AB";
const COLOR_TEXTO_SOBRE_RELLENO = "#FFFFFF";

const envolverIcono = (icono: ReactNode, tamanioIcono?: number | string): ReactNode =>
    tamanioIcono === undefined ? (
        icono
    ) : (
        <span style={{ display: "inline-flex", fontSize: tamanioIcono }}>{icono}</span>
    );

// Si no se pasa colorHover, generamos uno derivado del color base.
const obtenerColorHoverPorDefecto = (color: string): string =>
    /^#([0-9A-Fa-f]{6})$/.test(color) ? `${color}1A` : "rgba(0, 0, 0, 0.08)";

interface EstiloVarianteBoton {
    color: string;
    backgroundColor?: string;
    backgroundImage?: string;
    border: string;
    boxShadow: string;
    hover: Record<string, string>;
    active: Record<string, string>;
}

const construirEstilosVariante = (
    variante: SharedActionButtonVariante,
    color: string,
    colorHover: string,
    gradient: boolean,
    colorTexto?: string,
    colorTextoSobreRelleno?: string
): EstiloVarianteBoton => {
    const colorButton = color;
    const textoSobreRelleno = colorTextoSobreRelleno ?? COLOR_TEXTO_SOBRE_RELLENO;

    if (variante === "filled") {
        return {
            color: `${textoSobreRelleno} !important`,
            backgroundColor: gradient ? undefined : colorButton,
            backgroundImage: gradient
                ? `linear-gradient(135deg, ${colorButton}, ${colorHover})`
                : undefined,
            border: "none",
            boxShadow: "0 6px 16px grey",
            hover: {
                color: `${textoSobreRelleno} !important`,
                backgroundColor: "transparent",
                backgroundImage: "none",
            },
            active: {
                color: `${textoSobreRelleno} !important`,
            },
        };
    }

    return {
        color: `${colorTexto ?? color} !important`,
        backgroundColor: "transparent",
        border: `1.5px solid ${color}`,
        boxShadow: "none",
        hover: {
            backgroundColor: colorHover,
        },
        active: {
            backgroundColor: colorHover,
        },
    };
};

export const SharedActionButton = ({
    variante = "filled",
    color = COLOR_POR_DEFECTO,
    colorTexto,
    colorHover,
    colorTextoSobreRelleno,
    texto,
    icono,
    gradient = false,
    polished = false,
    disabled = false,
    fullWidth = false,
    hoverForzado = false,
    tamanioIcono,
    onClick,
    sx,
}: SharedActionButtonProps): JSX.Element => {
    const colorHoverResuelto = colorHover ?? obtenerColorHoverPorDefecto(color);

    const estilo = construirEstilosVariante(
        variante,
        color,
        colorHoverResuelto,
        gradient,
        colorTexto,
        colorTextoSobreRelleno
    );
    const iconoEnvuelto = envolverIcono(icono, tamanioIcono);

    return (
        <Button
            variant="text"
            color="inherit"
            disabled={disabled}
            fullWidth={fullWidth}
            onClick={onClick}
            startIcon={texto ? iconoEnvuelto : undefined}
            sx={{
                position: "relative",
                overflow: "hidden",
                minWidth: texto ? undefined : 0,
                padding: texto ? undefined : "6px",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: 12,
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
                        fontSize: `${typeof tamanioIcono === "number" ? `${tamanioIcono}px` : tamanioIcono} !important`,
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
            {texto ?? iconoEnvuelto}
        </Button>
    );
};
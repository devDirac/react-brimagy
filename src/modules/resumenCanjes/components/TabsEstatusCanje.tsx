import { KeyboardEvent } from "react";
import { Box, ButtonBase } from "@mui/material";
import type { ResumenCanjes } from "types/genericTypes";
import { ESTATUS_CANJE, TABS_ESTILO } from "../constants";
import type { EstatusCanje } from "../types";

interface Props {
    activa: EstatusCanje;
    onCambiar: (estatus: EstatusCanje) => void;
    resumen?: ResumenCanjes | null;
}

const {
    alto,
    padding,
    tamanoIcono,
    duracionGlider,
    duracionColor,
    colorFondo,
    colorBorde,
    colorTexto,
    colorTextoActivo,
    colorGlider,
    colorBadge,
    colorTextoBadge,
    colorBadgeActivo,
    colorTextoBadgeActivo,
} = TABS_ESTILO;

const TOTAL_TABS = ESTATUS_CANJE.length;

const TabsEstatusCanje = ({ activa, onCambiar, resumen }: Props) => {
    const indiceActivo = Math.max(
        ESTATUS_CANJE.findIndex((tab) => tab.clave === activa),
        0
    );

    const alPresionarTecla = (e: KeyboardEvent<HTMLDivElement>) => {
        const ultimo = TOTAL_TABS - 1;
        const destino: Record<string, number> = {
            ArrowRight: indiceActivo === ultimo ? 0 : indiceActivo + 1,
            ArrowLeft: indiceActivo === 0 ? ultimo : indiceActivo - 1,
            Home: 0,
            End: ultimo,
        };
        if (!(e.key in destino)) return;
        e.preventDefault();
        onCambiar(ESTATUS_CANJE[destino[e.key]].clave);
    };

    return (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Box
                role="tablist"
                aria-label="Estatus de los canjes"
                onKeyDown={alPresionarTecla}
                sx={{
                    position: "relative",
                    display: "flex",
                    width: "100%",
                    minWidth: 560,
                    p: `${padding}px`,
                    borderRadius: "99px",
                    backgroundColor: colorFondo,
                    border: `1px solid ${colorBorde}`,
                    "@media (prefers-reduced-motion: reduce)": {
                        "& *": { transition: "none !important" },
                    },
                }}
            >
                <Box
                    aria-hidden
                    sx={{
                        position: "absolute",
                        top: padding,
                        left: padding,
                        width: `calc((100% - ${padding * 2}px) / ${TOTAL_TABS})`,
                        height: alto,
                        borderRadius: "99px",
                        backgroundColor: colorGlider,
                        transform: `translateX(${indiceActivo * 100}%)`,
                        transition: `transform ${duracionGlider}ms ease-out`,
                        zIndex: 1,
                    }}
                />

                {ESTATUS_CANJE.map((tab) => {
                    const seleccionada = tab.clave === activa;
                    const conteo = resumen?.[tab.campoResumen];

                    return (
                        <ButtonBase
                            key={tab.clave}
                            role="tab"
                            id={`tab-canjes-${tab.clave}`}
                            aria-selected={seleccionada}
                            tabIndex={seleccionada ? 0 : -1}
                            onClick={() => onCambiar(tab.clave)}
                            sx={{
                                position: "relative",
                                zIndex: 2,
                                flex: 1,
                                minWidth: 0,
                                height: alto,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                                px: 1,
                                borderRadius: "99px",
                                fontSize: "0.9rem",
                                fontWeight: seleccionada ? 600 : 500,
                                whiteSpace: "nowrap",
                                color: seleccionada ? colorTextoActivo : colorTexto,
                                transition: `color ${duracionColor}ms ease-in`,
                                "&:hover": { color: colorTextoActivo },
                                "&.Mui-focusVisible": {
                                    outline: `2px solid ${colorBadgeActivo}`,
                                    outlineOffset: 2,
                                },
                            }}
                        >
                            <Box
                                component="span"
                                aria-hidden
                                sx={{
                                    display: "flex",
                                    "& svg": { width: tamanoIcono, height: tamanoIcono },
                                }}
                            >
                                {tab.icon}
                            </Box>
                            {tab.label}
                            <Box
                                component="span"
                                aria-label={`${conteo ?? 0} canjes`}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 26,
                                    height: 26,
                                    px: 0.75,
                                    borderRadius: "99px",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    backgroundColor: seleccionada ? colorBadgeActivo : colorBadge,
                                    color: seleccionada ? colorTextoBadgeActivo : colorTextoBadge,
                                    transition: `all ${duracionColor}ms ease-in`,
                                }}
                            >
                                {conteo ?? "–"}
                            </Box>
                        </ButtonBase>
                    );
                })}
            </Box>
        </Box>
    );
};

export default TabsEstatusCanje;
import { MouseEvent, ReactNode, useState } from "react";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { colorARgba, SharedIconButton } from "./SharedIconButton";
import { SharedActionButton } from "./SharedActionButton";

export interface SharedAccionMenu {
    texto: string;
    icono: ReactNode;
    color?: string;
    disabled?: boolean;
    onClick: () => void;
}

interface SharedMenuAccionesProps {
    acciones: SharedAccionMenu[];
    maximoDirecto?: number;
    tamanioIcono?: number;
    colorDisparador?: string;
    tituloDisparador?: string;
    textoDisparador?: string;
}

const COLOR_POR_DEFECTO = "#0047AB";
const MAXIMO_DIRECTO_POR_DEFECTO = 2;
const TAMANIO_ICONO_POR_DEFECTO = 18;
const TITULO_DISPARADOR = "Más acciones";

export const SharedMenuAcciones = ({
    acciones,
    maximoDirecto = MAXIMO_DIRECTO_POR_DEFECTO,
    tamanioIcono = TAMANIO_ICONO_POR_DEFECTO,
    colorDisparador = COLOR_POR_DEFECTO,
    tituloDisparador = TITULO_DISPARADOR,
    textoDisparador,
}: SharedMenuAccionesProps): JSX.Element | null => {
    const [anclaje, setAnclaje] = useState<HTMLElement | null>(null);

    if (acciones.length === 0) {
        return null;
    }

    if (acciones.length <= maximoDirecto) {
        return (
            <div className="tw-flex tw-justify-center tw-gap-1">
                {acciones.map((accion) => (
                    <SharedIconButton
                        key={accion.texto}
                        variante="ghost"
                        gradient
                        color={accion.color ?? COLOR_POR_DEFECTO}
                        tamanioIcono={tamanioIcono}
                        titulo={accion.texto}
                        icono={accion.icono}
                        disabled={accion.disabled}
                        onClick={accion.onClick}
                    />
                ))}
            </div>
        );
    }

    const abrir = (evento: MouseEvent<HTMLButtonElement>) =>
        setAnclaje(evento.currentTarget);
    const cerrar = () => setAnclaje(null);

    return (
        <div className="tw-flex tw-justify-center">
            {textoDisparador === undefined ? (
                <SharedIconButton
                    variante="ghost"
                    gradient
                    color={colorDisparador}
                    tamanioIcono={tamanioIcono}
                    titulo={tituloDisparador}
                    icono={<MoreVertRoundedIcon fontSize="inherit" />}
                    hoverForzado={anclaje !== null}
                    onClick={abrir}
                />
            ) : (
                <SharedActionButton
                    variante="ghost"
                    gradient
                    color={colorDisparador}
                    texto={textoDisparador}
                    icono={<MoreVertRoundedIcon fontSize="small" />}
                    hoverForzado={anclaje !== null}
                    onClick={abrir}
                />
            )}
            <Menu
                anchorEl={anclaje}
                open={anclaje !== null}
                onClose={cerrar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "14px",
                            minWidth: 210,
                            padding: "6px",
                            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
                        },
                    },
                }}
            >
                {acciones.map((accion) => {
                    const color = accion.color ?? COLOR_POR_DEFECTO;

                    return (
                        <MenuItem
                            key={accion.texto}
                            disabled={accion.disabled}
                            onClick={() => {
                                cerrar();
                                accion.onClick();
                            }}
                            sx={{
                                borderRadius: "10px",
                                gap: "4px",
                                paddingY: "8px",
                                color,
                                "&:hover": { backgroundColor: colorARgba(color, 0.1) },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: "inherit",
                                    minWidth: "auto !important",
                                    "& svg.MuiSvgIcon-root": {
                                        fontSize: `${tamanioIcono}px !important`,
                                    },
                                }}
                            >
                                {accion.icono}
                            </ListItemIcon>
                            <ListItemText
                                primary={accion.texto}
                                primaryTypographyProps={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "inherit",
                                }}
                            />
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
};
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { TIPOS_VALIDACION } from "../constants";
import type { TipoValidacion } from "../types";

interface Props {
    tipo: TipoValidacion;
    onClick: () => void;
    procesando: boolean;
    motivoDeshabilitado?: string | null;
    bloqueado?: boolean;
}

const BotonValidacion = ({ tipo, onClick, procesando, motivoDeshabilitado, bloqueado }: Props) => {
    const { etiqueta, bg, bgHover, color, icon } = TIPOS_VALIDACION[tipo];
    const deshabilitado = procesando || bloqueado || !!motivoDeshabilitado;

    return (
        <Tooltip title={motivoDeshabilitado || etiqueta}>
            <span>
                <IconButton
                    aria-label={etiqueta}
                    size="small"
                    onClick={onClick}
                    disabled={deshabilitado}
                    sx={{
                        background: bg,
                        color,
                        borderRadius: 1,
                        mr: 0.5,
                        "&:hover": { background: bgHover },
                        "&.Mui-disabled": { background: "#e0e0e0", color: "#9e9e9e" },
                    }}
                >
                    {procesando ? <CircularProgress size={18} sx={{ color }} /> : icon}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default BotonValidacion;
import { useCallback } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ModalCanjesPorEstatus from "./ModalCanjesPorEstatus";
import { ESTATUS_CANJE } from "../constants";
import { useContadorCanjes } from "../hooks";
import type { CanjeEstatus, TipoValidacion } from "../types";

const TAMANO_ICONO = 22;

const estiloEtiqueta = {
    position: "absolute" as const,
    top: -20,
    background: "#a5eb2f",
    color: "#000",
    fontSize: 12,
    padding: "2px 10px",
    fontWeight: 600,
};

export interface ContadorCanjesProps {
    onCanjeValidado?: (canje: CanjeEstatus, tipo: TipoValidacion) => void;
}

/** Contador de canjes por estatus. Al dar clic en un grupo abre el modal con esos canjes. */
const ContadorCanjes = ({ onCanjeValidado }: ContadorCanjesProps) => {
    const {
        plataforma,
        tipoProducto,
        resumen,
        cargando,
        estatusAbierto,
        abrir,
        cerrar,
        refrescarResumen,
    } = useContadorCanjes();

    const alValidar = useCallback(
        (canje: CanjeEstatus, tipo: TipoValidacion) => {
            refrescarResumen();
            onCanjeValidado?.(canje, tipo);
        },
        [refrescarResumen, onCanjeValidado]
    );

    return (
        <>
            <MDBox
                display="flex"
                gap={0.5}
                flexWrap="wrap"
                mt={1}
                sx={{
                    border: "1px solid #a5eb2f",
                    borderRadius: "0 0 10px 10px",
                    p: 1,
                    position: "relative",
                }}
            >
                <MDTypography variant="caption" style={{ ...estiloEtiqueta, left: -1 }}>
                    Canjes
                </MDTypography>
                <MDTypography variant="caption" style={{ ...estiloEtiqueta, right: -1 }}>
                    {plataforma === "club_bohn" ? "Club Bohn" : "Puntotes"}
                </MDTypography>

                {ESTATUS_CANJE.map((c) => (
                    <Box
                        key={c.clave}
                        role="button"
                        tabIndex={0}
                        aria-label={`Ver canjes: ${c.label}`}
                        onClick={() => abrir(c.clave)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                abrir(c.clave);
                            }
                        }}
                        sx={{
                            background: c.bg,
                            color: "#fff",
                            fontWeight: 600,
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                            px: 1.5,
                            py: 1,
                            cursor: "pointer",
                            "&:hover, &:focus-visible": { background: c.bgHover, outline: "none" },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    lineHeight: 0,
                                    "& svg, & .material-icons, & .MuiIcon-root": {
                                        fontSize: TAMANO_ICONO,
                                        width: TAMANO_ICONO,
                                        height: TAMANO_ICONO,
                                    },
                                }}
                            >
                                {c.icon}
                            </Box>
                            <Box sx={{ minWidth: 28, textAlign: "right" }}>
                                {cargando ? (
                                    <Skeleton
                                        variant="text"
                                        width={28}
                                        sx={{ bgcolor: "rgba(255,255,255,0.35)", ml: "auto" }}
                                    />
                                ) : (
                                    <Typography
                                        variant="h6"
                                        fontWeight="medium"
                                        color="inherit"
                                        sx={{ lineHeight: 1 }}
                                    >
                                        {resumen?.[c.campoResumen] ?? 0}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Typography variant="caption" fontWeight="medium" color="inherit">
                            {c.label}
                        </Typography>
                    </Box>
                ))}
            </MDBox>

            <ModalCanjesPorEstatus
                estatus={estatusAbierto}
                onCambiarEstatus={abrir}
                onCerrar={cerrar}
                plataforma={plataforma}
                tipoProducto={tipoProducto}
                resumen={resumen}
                onCanjeValidado={alValidar}
            />
        </>
    );
};

export default ContadorCanjes;
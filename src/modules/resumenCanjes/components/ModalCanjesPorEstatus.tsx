import { useCallback } from "react";
import {
    Alert,
    Box,
    Grid,
    IconButton,
    InputAdornment,
    LinearProgress,
    Snackbar,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { ResumenCanjes } from "types/genericTypes";
import ModalComponent from "components/Modal";
import DetallesCanjeModal from "components/DetallesVistas/DetalleCanje";
import TablaCanjesEstatus from "./TablaCanjesEstatus";
import ConfirmarValidacionDialog from "./ConfirmarValidacionDialog";
import TabsEstatusCanje from "./TabsEstatusCanje";
import { TIPOS_VALIDACION } from "../constants";
import { getConfigEstatus } from "../utils";
import {
    useCanjesPorEstatus,
    useDetalleCanjeEstatus,
    useTablaCanjesEstatus,
    useValidacionCanje,
} from "../hooks";
import type { CanjeEstatus, EstatusCanje, TipoProductoCanje, TipoValidacion } from "../types";

export interface ModalCanjesPorEstatusProps {
    estatus: EstatusCanje | null;
    onCambiarEstatus: (estatus: EstatusCanje) => void;
    onCerrar: () => void;
    plataforma: string;
    tipoProducto?: TipoProductoCanje;
    /** Para mostrar el conteo en cada pestaña. */
    resumen?: ResumenCanjes | null;
    onCanjeValidado?: (canje: CanjeEstatus, tipo: TipoValidacion) => void;
}

const ModalCanjesPorEstatus = ({
    estatus,
    onCambiarEstatus,
    onCerrar,
    plataforma,
    tipoProducto,
    resumen,
    onCanjeValidado,
}: ModalCanjesPorEstatusProps) => {
    const { canjes, cargando, error, recargar } = useCanjesPorEstatus({
        estatus,
        plataforma,
        tipoProducto,
    });

    const detalle = useDetalleCanjeEstatus();
    const { actualizarEstado } = detalle;

    const alValidar = useCallback(
        (canje: CanjeEstatus, tipo: TipoValidacion) => {
            recargar();
            actualizarEstado(canje.id, TIPOS_VALIDACION[tipo].estadoResultante);
            onCanjeValidado?.(canje, tipo);
        },
        [recargar, actualizarEstado, onCanjeValidado]
    );

    const validacion = useValidacionCanje({ plataforma, onValidado: alValidar });
    const table = useTablaCanjesEstatus(
        canjes,
        { onVer: detalle.abrir, onValidar: validacion.solicitar, enCurso: validacion.enCurso },
        estatus
    );

    const validarDesdeDetalle = (tipo: TipoValidacion) => async () => {
        if (detalle.verCanje) validacion.solicitar(detalle.verCanje, tipo);
    };
    const enCursoDetalle =
        validacion.enCurso && validacion.enCurso.idCanje === detalle.verCanje?.id
            ? validacion.enCurso.tipo
            : null;

    if (!estatus) return null;

    const config = getConfigEstatus(estatus);
    const busqueda = (table.getState().globalFilter as string) ?? "";

    return (
        <>
            <ModalComponent handleClose={onCerrar} isOpen size="xl" anchoCompleto key="canjesPorEstatus">
                <Box sx={{ width: "100%" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            my: 2,
                        }}
                    >
                        <Box sx={{ display: "flex", color: config.bg, "& svg": { width: 24, height: 24 } }}>
                            {config.icon}
                        </Box>
                        <Typography variant="h5" component="h2" align="center" sx={{ color: "#004c93" }}>
                            {config.titulo}
                            {tipoProducto && ` (${tipoProducto === "digital" ? "digitales" : "físicos"})`}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <TabsEstatusCanje activa={estatus} onCambiar={onCambiarEstatus} resumen={resumen} />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <TextField
                            size="small"
                            placeholder="Buscar por folio, cliente, correo, teléfono o producto"
                            value={busqueda}
                            onChange={(e) => table.setGlobalFilter(e.target.value)}
                            sx={{ flex: 1, maxWidth: 480 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Tooltip title="Recargar">
                            <span>
                                <IconButton onClick={recargar} disabled={cargando}>
                                    <RefreshIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>

                    {cargando && <LinearProgress sx={{ mb: 1 }} />}
                    {error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <TablaCanjesEstatus table={table} color={config.bg} />
                    )}
                </Box>
            </ModalComponent>

            {/* Detalle del canje */}
            <ModalComponent
                handleClose={detalle.cerrar}
                isOpen={detalle.abierto}
                key="detalleCanjeEstatus"
            >
                <Grid container spacing={2} style={{ textAlign: "center" }}>
                    {detalle.verCanje && (
                        <DetallesCanjeModal
                            verCanje={detalle.verCanje}
                            isPDFViewerOpen={detalle.pdfAbierto}
                            handleOpenPDFViewer={detalle.abrirPdf}
                            handleClosePDFViewer={detalle.cerrarPdf}
                            validarIdentidad={validarDesdeDetalle("cliente")}
                            validarIdentidadSinProveedor={validarDesdeDetalle("directa")}
                            procesandoIdentidad={enCursoDetalle === "cliente"}
                            procesandoIdentidadDirecto={enCursoDetalle === "directa"}
                        />
                    )}
                </Grid>
            </ModalComponent>

            <ConfirmarValidacionDialog
                pendiente={validacion.pendiente}
                onConfirmar={validacion.confirmar}
                onCancelar={validacion.cancelar}
            />

            <Snackbar
                open={!!validacion.mensaje}
                autoHideDuration={5000}
                onClose={validacion.cerrarMensaje}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {validacion.mensaje ? (
                    <Alert
                        severity={validacion.mensaje.severidad}
                        onClose={validacion.cerrarMensaje}
                        variant="filled"
                    >
                        {validacion.mensaje.texto}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </>
    );
};

export default ModalCanjesPorEstatus;
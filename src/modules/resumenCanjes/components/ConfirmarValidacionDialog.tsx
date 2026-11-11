import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import { TIPOS_VALIDACION } from "../constants";
import { productosRegistrados } from "../utils";
import type { ValidacionPendiente } from "../types";

interface Props {
    pendiente: ValidacionPendiente | null;
    onConfirmar: () => void;
    onCancelar: () => void;
}

const ConfirmarValidacionDialog = ({ pendiente, onConfirmar, onCancelar }: Props) => {
    if (!pendiente) return null;

    const { canje, tipo } = pendiente;
    const config = TIPOS_VALIDACION[tipo];
    const registrados = productosRegistrados(canje).length;
    const sinRegistrar = canje.productos.length - registrados;

    return (
        <Dialog open onClose={onCancelar} maxWidth="xs" fullWidth>
            <DialogTitle>{config.etiqueta}</DialogTitle>
            <DialogContent>
                <Typography variant="body2" gutterBottom>
                    Canje <b>#{canje.folio}</b> de <b>{canje.nombre_usuario}</b>.
                </Typography>
                <Typography variant="body2" gutterBottom>
                    {config.confirmacion}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Productos a validar: {registrados}
                    {sinRegistrar > 0 && ` (${sinRegistrar} sin registrar en catálogo no se incluyen)`}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancelar} sx={{ color: "#0a1105" }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    startIcon={config.icon}
                    onClick={onConfirmar}
                    sx={{
                        background: config.bg,
                        color: `${config.color} !important`,
                        "&:hover": { background: config.bgHover },
                    }}
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmarValidacionDialog;
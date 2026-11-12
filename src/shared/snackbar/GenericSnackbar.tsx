import { useEffect, useState } from "react";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { suscribirSnackbar, type EstadoSnackbar, type TipoSnackbar } from "./snackbarStore";

const ESTADO_INICIAL: EstadoSnackbar = {
    abierto: false,
    mensaje: "",
    tipo: "info",
    duracionMs: 4000,
};

const mapearSeveridad = (tipo: TipoSnackbar): "success" | "error" | "info" | "warning" => {
    switch (tipo) {
        case "exito":
            return "success";
        case "error":
            return "error";
        case "advertencia":
            return "warning";
        default:
            return "info";
    }
};

// Móntalo una sola vez en la raíz de la app (junto a tu <ModalComponent> global, por ejemplo).
export const GenericSnackbar = (): JSX.Element => {
    const [estado, setEstado] = useState<EstadoSnackbar>(ESTADO_INICIAL);

    useEffect(() => suscribirSnackbar(setEstado), []);

    const cerrar = (): void => setEstado((actual) => ({ ...actual, abierto: false }));

    return (
        <Snackbar
            open={estado.abierto}
            autoHideDuration={estado.duracionMs}
            onClose={(_evento, razon) => {
                if (razon !== "clickaway") cerrar();
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert
                onClose={cerrar}
                severity={mapearSeveridad(estado.tipo)}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {estado.titulo && <AlertTitle>{estado.titulo}</AlertTitle>}
                {estado.mensaje}
            </Alert>
        </Snackbar>
    );
};
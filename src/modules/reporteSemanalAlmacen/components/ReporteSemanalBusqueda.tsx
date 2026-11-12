import { memo, useEffect, useState } from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import { IconBackspaceFilled, IconSearch } from "@tabler/icons-react";
import { RETRASO_BUSQUEDA_MS } from "../constants/reporteSemanalAlmacen.constants";

interface ReporteSemanalBusquedaProps {
    valor: string;
    onCambiar: (valor: string) => void;
    placeholder: string;
}

const ReporteSemanalBusquedaBase = ({
    valor,
    onCambiar,
    placeholder,
}: ReporteSemanalBusquedaProps): JSX.Element => {
    const [texto, setTexto] = useState(valor);

    useEffect(() => {
        if (texto === valor) return;
        const temporizador = window.setTimeout(() => onCambiar(texto), RETRASO_BUSQUEDA_MS);
        return () => window.clearTimeout(temporizador);
    }, [texto, valor, onCambiar]);

    return (
        <Box sx={{ display: "flex", alignItems: "stretch", maxWidth: 360, width: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    background: "#041d45",
                    borderRadius: "10px 0 0 10px",
                    px: 0.5,
                }}
            >
                <IconSearch stroke={2} style={{ color: "#fff" }} />
            </Box>
            <TextField
                fullWidth
                size="small"
                label="Buscar"
                placeholder={placeholder}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "0 10px 10px 0" },
                    "& .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused": { color: "#041d45", fontWeight: 500 },
                    "& .MuiInputLabel-shrink": { background: "#fff" },
                    "& .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        { border: "1px solid #041d45" },
                }}
                InputProps={{
                    endAdornment:
                        texto.length > 0 ? (
                            <InputAdornment position="end">
                                <IconBackspaceFilled
                                    onClick={() => setTexto("")}
                                    style={{ fontSize: 16, cursor: "pointer", color: "#041d45" }}
                                />
                            </InputAdornment>
                        ) : undefined,
                }}
            />
        </Box>
    );
};

export const ReporteSemanalBusqueda = memo(ReporteSemanalBusquedaBase);
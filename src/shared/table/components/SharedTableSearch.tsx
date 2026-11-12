import { useEffect, useState } from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useMaterialUIController } from "context";
import type { ControlSharedTabla } from "../types/sharedTable.types";
import { IconSearch, IconBackspaceFilled } from '@tabler/icons-react';

interface SharedTableSearchProps<TFila> {
    control: ControlSharedTabla<TFila>;
    placeholder?: string;
    retrasoMs?: number;
}

const RETRASO_POR_DEFECTO_MS = 350;

export const SharedTableSearch = <TFila,>({
    control,
    placeholder = "Buscar…",
    retrasoMs = RETRASO_POR_DEFECTO_MS,
}: SharedTableSearchProps<TFila>): JSX.Element => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { filtroGlobal, establecerFiltroGlobal } = control;
    const [texto, establecerTexto] = useState<string>(filtroGlobal);

    // Envía el texto al control después del retraso
    useEffect(() => {
        if (texto === filtroGlobal) {
            return;
        }

        const temporizador = window.setTimeout(
            () => establecerFiltroGlobal(texto),
            retrasoMs
        );

        return () => window.clearTimeout(temporizador);
    }, [texto, filtroGlobal, establecerFiltroGlobal, retrasoMs]);

    // Refleja limpiezas o cambios hechos desde fuera del componente
    useEffect(() => {
        establecerTexto((actual) => (actual === filtroGlobal ? actual : filtroGlobal));
    }, [filtroGlobal]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "stretch",
                    justifyContent: "center",
                    maxWidth: 360,
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#041d45",
                        borderRadius: "10px 0 0 10px",
                        px: 0.5,
                        boxSizing: "border-box",
                    }}
                >
                    <IconSearch stroke={2} style={{ color: "#fff" }} />
                </Box>
                <TextField
                    fullWidth
                    size="small"
                    label="Buscar"
                    placeholder={placeholder}
                    variant="outlined"
                    value={texto}
                    onChange={(evento) => establecerTexto(evento.target.value)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "0 10px 10px 0",
                        },
                        "& .MuiInputLabel-root": {
                            color: "#041d45",
                            fontWeight: 500,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#041d45",
                        },
                        "& .MuiInputLabel-shrink": {
                            background: "#fff",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #041d45",
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #041d45",
                        },
                    }}
                    InputProps={{
                        endAdornment:
                            texto.length > 0 ? (
                                <InputAdornment position="end">
                                    <IconBackspaceFilled
                                        onClick={() => establecerTexto("")}
                                        style={{
                                            fontSize: 16,
                                            cursor: "pointer",
                                            color: darkMode ? "#94a3b8" : "#041d45",
                                        }}
                                    />
                                </InputAdornment>
                            ) : undefined,
                    }}
                />
            </Box>
        </>
    );
};

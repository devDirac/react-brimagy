import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface SharedTableEstadoVacioProps {
    mensaje: string;
    descripcion?: string;
    darkMode?: boolean;
    icono?: ReactNode;
}

export const SharedTableEstadoVacio = ({
    mensaje,
    descripcion,
    darkMode = false,
    icono,
}: SharedTableEstadoVacioProps): JSX.Element => (
    <Box
        sx={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            py: 4,
            textAlign: "center",
        }}
    >
        <Box>
            <Box
                sx={{
                    fontSize: 28,
                    lineHeight: 1,
                    color: darkMode ? "#64748b" : "#94A3B8",
                    mb: 1,
                    display: "flex",
                    justifyContent: "center",
                    "& > svg": { fontSize: 40 },
                }}
            >
                {icono ?? "⌀"}
            </Box>

            <Typography
                sx={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: darkMode ? "#f1f5f9" : "#0F172A",
                    mb: 0.5,
                }}
            >
                {mensaje}
            </Typography>

            <Typography
                sx={{
                    fontSize: 12.5,
                    color: darkMode ? "#94a3b8" : "#64748B",
                    maxWidth: 360,
                }}
            >
                {descripcion}
            </Typography>
        </Box>
    </Box>
);
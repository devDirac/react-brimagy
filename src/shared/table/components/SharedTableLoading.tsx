import { Box, CircularProgress, Typography } from "@mui/material";

interface SharedTableLoadingProps {
    visible: boolean;
    darkMode?: boolean;
}

export const SharedTableLoading = ({
    visible,
    darkMode = false,
}: SharedTableLoadingProps): JSX.Element | null => {
    if (!visible) {
        return null;
    }

    return (
        <Box
            sx={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: darkMode
                    ? "rgba(15, 23, 42, 0.72)"
                    : "rgba(255, 255, 255, 0.72)",
                backdropFilter: "blur(2px)",
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: "14px",
                    backgroundColor: darkMode ? "#1f283e" : "#FFFFFF",
                    border: darkMode
                        ? "1px solid rgba(255, 255, 255, 0.14)"
                        : "1px solid rgba(15, 23, 42, 0.10)",
                    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                }}
            >
                <CircularProgress size={18} />

                <Typography
                    sx={{
                        fontSize: 12.5,
                        fontWeight: 800,
                        color: darkMode ? "#f1f5f9" : "#0F172A",
                    }}
                >
                    Cargando información
                </Typography>
            </Box>
        </Box>
    );
};
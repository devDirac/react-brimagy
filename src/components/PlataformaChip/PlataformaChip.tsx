import { Chip, ChipProps } from "@mui/material";
import { getPlataformaUI } from "config/plataformasUI";

interface PlataformaChipProps extends Omit<ChipProps, "label" | "icon" | "color"> {
    plataforma?: string | null;
    iconSize?: number;
    cantidad?: number;
}

const PlataformaChip = ({ plataforma, iconSize = 14, cantidad, sx, ...rest }: PlataformaChipProps) => {
    const { label, color, textColor = "#fff", iconColor, icon: Icono } = getPlataformaUI(plataforma);

    return (
        <Chip
            size="small"
            icon={<Icono size={iconSize} stroke={2} />}
            label={cantidad != null ? `${label} · ${cantidad}` : label}
            {...rest}
            sx={{
                bgcolor: color,
                color: textColor,
                fontWeight: "bold",
                height: 22,
                textTransform: "uppercase",
                "& .MuiChip-icon": { color: iconColor ?? textColor, ml: "6px" },
                ...sx,
            }}
        />
    );
};

export default PlataformaChip;
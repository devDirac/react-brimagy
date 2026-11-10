import { Chip, ChipProps } from "@mui/material";
import { IconAward } from "@tabler/icons-react";

interface FolioChipProps extends Omit<ChipProps, "label" | "icon" | "color"> {
    folio?: string | null;
    cantidad?: number;
}

const FolioChip = ({ folio, cantidad, sx, ...rest }: FolioChipProps) => (
    <Chip
        size="small"
        icon={<IconAward size={14} stroke={2} />}
        label={`${folio ?? "Sin folio"}${cantidad != null ? ` · x${cantidad}` : ""}`}
        {...rest}
        sx={{
            bgcolor: "#084d6e",
            color: "#fff",
            fontWeight: "bold",
            height: 22,
            "& .MuiChip-icon": { color: "#fff", ml: "6px" },
            ...sx,
        }}
    />
);

export default FolioChip;
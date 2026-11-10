import { Chip, SxProps, Theme } from "@mui/material";
import { getEstadoValidacion } from "../utils";

interface Props {
  estado?: string | null;
  /** true: etiqueta pegada a la esquina de la tarjeta; false: chip normal (tabla). */
  enEsquina?: boolean;
}

const estiloEsquina: SxProps<Theme> = {
  position: "absolute",
  top: 0,
  right: 0,
  borderRadius: "0 0 0 20px",
  maxWidth: "150px",
};

const EstadoValidacionChip = ({ estado, enEsquina = false }: Props) => {
  const { label, bg, color, icon } = getEstadoValidacion(estado);

  return (
    <Chip
      icon={icon}
      label={label}
      sx={{
        ...(enEsquina ? estiloEsquina : { maxWidth: "180px" }),
        flexDirection: "row",
        p: 1,
        fontWeight: 500,
        background: bg,
        height: "auto",
        whiteSpace: "normal",
        fontSize: "11px !important",
        "& .MuiChip-label": {
          whiteSpace: "normal",
          overflow: "visible",
          textOverflow: "clip",
          display: "block",
          lineHeight: "12px",
          color: `${color} !important`,
        },
        "& .MuiChip-icon": {
          color: `${color} !important`,
          fontSize: "18px !important",
          width: "20px !important",
          height: "20px !important",
          marginTop: "2px",
          alignSelf: "flex-start",
        },
      }}
    />
  );
};

export default EstadoValidacionChip;

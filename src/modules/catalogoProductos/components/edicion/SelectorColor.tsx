import { useState } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CloseIcon from "@mui/icons-material/Close";
import { HexColorPicker } from "react-colorful";
import { useIntl } from "react-intl";
import { COLORES } from "../../constants";
import { colorHex, esColorValido } from "../../utils";

interface Props {
  valor: string;
  onCambiar: (color: string) => void;
  id?: string;
}

/** Campo de color con muestra y selector visual. El padre debe tener position: relative. */
const SelectorColor = ({ valor, onCambiar, id = "color" }: Props) => {
  const intl = useIntl();
  const [abierto, setAbierto] = useState(false);
  const hex = colorHex(valor);

  return (
    <>
      <TextField
        id={id}
        fullWidth
        label={intl.formatMessage({ id: "input_color" })}
        variant="standard"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        onClick={() => setAbierto((a) => !a)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "4px",
                  backgroundColor: esColorValido(valor) ? valor : "transparent",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      {abierto && (
        <ClickAwayListener onClickAway={() => setAbierto(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 99999,
              mt: 1,
              p: 2,
              backgroundColor: "#ffffff !important",
              borderRadius: 2,
              boxShadow: 6,
              display: "inline-block",
            }}
          >
            <HexColorPicker color={hex} onChange={onCambiar} />
            <Box sx={{ mt: 1, textAlign: "center", fontSize: 12, color: "text.secondary" }}>
              {hex}
            </Box>
            <Button
              variant="contained"
              endIcon={<CloseIcon />}
              onClick={() => setAbierto(false)}
              sx={{ background: COLORES.primario, color: "#fff" }}
            >
              Cerrar
            </Button>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default SelectorColor;

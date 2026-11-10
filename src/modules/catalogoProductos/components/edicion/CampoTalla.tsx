import { MenuItem, TextField } from "@mui/material";
import { useIntl } from "react-intl";
import { TALLAS } from "../../constants";

interface Props {
  valor: string;
  onCambiar: (talla: string) => void;
  id?: string;
}

const CampoTalla = ({ valor, onCambiar, id = "talla" }: Props) => {
  const intl = useIntl();

  return (
    <TextField
      id={id}
      select
      fullWidth
      label={`${intl.formatMessage({ id: "input_talla" })} *`}
      variant="standard"
      value={valor}
      onChange={(e) => onCambiar(e.target.value)}
      InputProps={{ style: { padding: "5px" } }}
    >
      {TALLAS.map((talla) => (
        <MenuItem key={talla} value={talla}>
          {talla}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CampoTalla;

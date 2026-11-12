import { Alert, AlertTitle } from "@mui/material";
import { ALERTA_DEFAULTS } from "../constants/alerta.constants";
import { useAlerta } from "../hooks/useAlerta";
import type { AlertaProps } from "../types/alerta.types";

export const Alerta = (props: AlertaProps): JSX.Element => {
  const {
    titulo,
    texto,
    children,
    variante = ALERTA_DEFAULTS.variante,
    onClose,
    accion,
    sx,
  } = props;
  const { tipo, icono, estilos } = useAlerta(props);

  return (
    <Alert
      severity={tipo}
      variant={variante}
      icon={icono}
      onClose={onClose}
      action={accion}
      sx={[estilos.alerta, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {titulo && <AlertTitle sx={estilos.titulo}>{titulo}</AlertTitle>}
      {texto ?? children}
    </Alert>
  );
};

export default Alerta;

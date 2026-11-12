import { Box, ButtonBase, Tooltip, Typography } from "@mui/material";
import type { BotonIconoProps } from "../types/botonIcono.types";
import { useBotonIcono } from "../hooks/useBotonIcono";

export const BotonIcono = (props: BotonIconoProps): JSX.Element => {
  const { icono, tooltipTexto, onClick, disabled = false, type = "button", sx } = props;
  const { variante, textos, estilos, mostrarTooltip } = useBotonIcono(props);

  const boton = (
    <ButtonBase
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={variante === "soloIcono" ? tooltipTexto : undefined}
      sx={[estilos.boton, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Box component="span" sx={estilos.icono}>
        {icono}
      </Box>

      {variante !== "soloIcono" && (
        <Box component="span" sx={estilos.contenedorTexto}>
          {textos.map((texto, index) => (
            <Typography
              key={index}
              component="span"
              variant={variante === "dosTextos" ? "caption" : "body2"}
              sx={estilos.texto}
            >
              {texto}
            </Typography>
          ))}
        </Box>
      )}
    </ButtonBase>
  );

  if (!mostrarTooltip) return boton;

  // El span permite que el tooltip funcione aunque el botón esté deshabilitado
  return (
    <Tooltip title={tooltipTexto} arrow>
      <Box component="span" sx={{ display: "inline-flex" }}>
        {boton}
      </Box>
    </Tooltip>
  );
};

export default BotonIcono;

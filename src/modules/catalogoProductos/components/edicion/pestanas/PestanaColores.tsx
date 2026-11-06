import { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useIntl } from "react-intl";
import SeccionRecurso from "../SeccionRecurso";
import SelectorColor from "../SelectorColor";
import AccionesRecurso from "../AccionesRecurso";
import TextoCargando from "../../TextoCargando";
import { COLORES } from "../../../constants";
import { estiloInactivo, traducirEstadoRecurso } from "../../../utils";
import type { Recurso } from "../../../hooks";
import type { Producto } from "../../../types";

interface Props {
  recurso: Recurso;
  producto: Producto;
  plataforma: string;
}

const PestanaColores = ({ recurso, producto, plataforma }: Props) => {
  const intl = useIntl();
  const [color, setColor] = useState("");

  const formulario = (
    <>
      <Grid item xs={6} sx={{ position: "relative" }}>
        <SelectorColor valor={color} onCambiar={setColor} />
      </Grid>
      <Grid item xs={6}>
        <Button
          sx={{ color: "#fff", background: COLORES.primario }}
          variant="contained"
          endIcon={<AddBoxIcon />}
          disabled={recurso.procesando}
          onClick={() =>
            recurso.guardar({
              id_producto_dirac: producto.id,
              id_producto_brimagy: producto.id_producto_brimagy,
              color,
              plataforma,
            })
          }
        >
          <TextoCargando
            cargando={recurso.procesando}
            texto={intl.formatMessage({ id: "set_añadir_color" })}
            textoCargando={intl.formatMessage({ id: "general_añadiendo" })}
          />
        </Button>
      </Grid>
    </>
  );

  return (
    <SeccionRecurso
      titulo="Colores registrados"
      subtitulo="Registrar nuevo color"
      formulario={formulario}
      mensajeVacio="no_hay_colores_registrados"
      vacio={recurso.items.length === 0}
    >
      {recurso.items.map((c) => {
        const datos = { id_color: c.id, id_color_brimagy: c.id_color_brimagy, plataforma };
        return (
          <Grid container spacing={2} key={c.id}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Color
              </Typography>
              <Typography
                variant="body2"
                fontWeight="medium"
                sx={{ display: "flex", alignItems: "center", flexDirection: "column", ...estiloInactivo(c.status) }}
              >
                {c.color}
                {c.status === "ACTIVE" && <Box sx={{ bgcolor: c.color, width: 60, height: 20 }} />}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Estatus
              </Typography>
              <Typography variant="body2" fontWeight="medium" sx={estiloInactivo(c.status)}>
                {traducirEstadoRecurso(c.status)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Acciones
              </Typography>
              <AccionesRecurso
                item={c}
                nombre="color"
                onEditar={() => recurso.abrirEdicion(c)}
                onActivar={() => recurso.activar(datos)}
                onDesactivar={() => recurso.desactivar(datos)}
              />
            </Grid>
          </Grid>
        );
      })}
    </SeccionRecurso>
  );
};

export default PestanaColores;

import { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useIntl } from "react-intl";
import SeccionRecurso from "../SeccionRecurso";
import CampoTalla from "../CampoTalla";
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

const PestanaTallas = ({ recurso, producto, plataforma }: Props) => {
  const intl = useIntl();
  const [talla, setTalla] = useState("");

  const formulario = (
    <>
      <Grid item xs={6}>
        <CampoTalla valor={talla} onCambiar={setTalla} />
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
              talla,
              plataforma,
            })
          }
        >
          <TextoCargando
            cargando={recurso.procesando}
            texto={intl.formatMessage({ id: "set_añadir_talla" })}
            textoCargando={intl.formatMessage({ id: "general_añadiendo" })}
          />
        </Button>
      </Grid>
    </>
  );

  return (
    <SeccionRecurso
      titulo="Tallas registradas"
      subtitulo="Registrar nueva talla"
      formulario={formulario}
      mensajeVacio="no_hay_tallas_registradas"
      vacio={recurso.items.length === 0}
    >
      {recurso.items.map((t) => {
        const datos = { id_talla: t.id, id_talla_brimagy: t.id_talla_brimagy, plataforma };
        return (
          <Grid container spacing={2} key={t.id}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Talla
              </Typography>
              <Typography variant="body2" fontWeight="medium" sx={estiloInactivo(t.status)}>
                {t.talla}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Estatus
              </Typography>
              <Typography variant="body2" fontWeight="medium" sx={estiloInactivo(t.status)}>
                {traducirEstadoRecurso(t.status)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Acciones
              </Typography>
              <AccionesRecurso
                item={t}
                nombre="talla"
                onEditar={() => recurso.abrirEdicion(t)}
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

export default PestanaTallas;

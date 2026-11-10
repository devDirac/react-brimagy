import { useState } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useIntl } from "react-intl";
import SeccionRecurso from "../SeccionRecurso";
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

const PestanaMontos = ({ recurso, producto, plataforma }: Props) => {
  const intl = useIntl();
  const [monto, setMonto] = useState("");
  const [puntos, setPuntos] = useState<number | "">("");
  const [descripcion, setDescripcion] = useState("");

  const campo = (id: string, valor: string | number, onCambiar: (v: string) => void, tipo?: string) => (
    <Grid item xs={6}>
      <TextField
        id={id}
        fullWidth
        label={`${intl.formatMessage({ id: `input_${id}` })} *`}
        variant="standard"
        type={tipo}
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
      />
    </Grid>
  );

  const formulario = (
    <>
      {campo("monto", monto, setMonto)}
      {campo("puntos", puntos, (v) => setPuntos(v === "" ? "" : Number(v)), "number")}
      {campo("descripcion", descripcion, setDescripcion)}
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
              monto,
              puntos: puntos === "" ? undefined : puntos,
              descripcion,
              plataforma,
            })
          }
        >
          <TextoCargando
            cargando={recurso.procesando}
            texto={intl.formatMessage({ id: "set_añadir_monto" })}
            textoCargando={intl.formatMessage({ id: "general_añadiendo" })}
          />
        </Button>
      </Grid>
    </>
  );

  const celda = (titulo: string, valor: React.ReactNode, status: string) => (
    <Grid item xs={6} md={2}>
      <Typography variant="body2" color="text.secondary">
        {titulo}
      </Typography>
      <Typography variant="body2" fontWeight="medium" sx={estiloInactivo(status)}>
        {valor}
      </Typography>
    </Grid>
  );

  return (
    <SeccionRecurso
      titulo="Montos registrados"
      subtitulo="Registrar nuevo monto"
      formulario={formulario}
      mensajeVacio="no_hay_montos_registrados"
      vacio={recurso.items.length === 0}
    >
      {recurso.items.map((m) => {
        const datos = { id_monto: m.id, id_monto_brimagy: m.id_monto_brimagy, plataforma };
        return (
          <Grid container spacing={2} key={m.id}>
            {celda("Monto", m.monto, m.status)}
            {celda("Puntos", m.puntos, m.status)}
            {celda("Descripción", m.descripcion, m.status)}
            {celda("Estatus", traducirEstadoRecurso(m.status), m.status)}
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Acciones
              </Typography>
              <AccionesRecurso
                item={m}
                nombre="monto"
                onEditar={() => recurso.abrirEdicion(m)}
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

export default PestanaMontos;

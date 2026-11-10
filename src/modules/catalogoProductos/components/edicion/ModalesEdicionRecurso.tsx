import { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useIntl } from "react-intl";
import ModalComponent from "components/Modal";
import SelectorColor from "./SelectorColor";
import CampoTalla from "./CampoTalla";
import TextoCargando from "../TextoCargando";
import { COLORES } from "../../constants";
import type { Recurso } from "../../hooks";
import type { Producto, RecursoProducto } from "../../types";

interface PropsModal {
  recurso: Recurso;
  producto: Producto | null;
  plataforma: string;
  /** Loader global en curso (deshabilita el botón, como antes). */
  deshabilitado: boolean;
}

interface PropsFormulario extends Omit<PropsModal, "recurso" | "producto"> {
  item: RecursoProducto;
  producto: Producto;
  recurso: Recurso;
}

const BotonEditar = ({
  recurso,
  deshabilitado,
  idTexto,
  onClick,
}: {
  recurso: Recurso;
  deshabilitado: boolean;
  idTexto: string;
  onClick: () => void;
}) => {
  const intl = useIntl();
  return (
    <Button
      sx={{ color: "#fff", background: COLORES.primario }}
      variant="contained"
      endIcon={<EditIcon />}
      disabled={deshabilitado}
      onClick={onClick}
    >
      <TextoCargando
        cargando={recurso.procesando}
        texto={intl.formatMessage({ id: idTexto })}
        textoCargando={intl.formatMessage({ id: "general_editando" })}
      />
    </Button>
  );
};

/** Marco común: el formulario se monta con `key` para inicializarse con el elemento elegido. */
const ModalEdicion = ({
  titulo,
  modalKey,
  props,
  Formulario,
}: {
  titulo: string;
  modalKey: string;
  props: PropsModal;
  Formulario: (p: PropsFormulario) => JSX.Element;
}) => {
  const { recurso, producto } = props;
  const item = recurso.enEdicion;

  return (
    <ModalComponent handleClose={recurso.cerrarEdicion} isOpen={!!item} key={modalKey}>
      <Grid container spacing={2} mb={6} style={{ textAlign: "center" }}>
        {item && producto && (
          <>
            <Grid item xs={12} mt={2}>
              <h5>{titulo}</h5>
            </Grid>
            <Formulario key={item.id} {...props} item={item} producto={producto} recurso={recurso} />
          </>
        )}
      </Grid>
    </ModalComponent>
  );
};

// ---------- Color ----------

const FormularioColor = ({ item, producto, plataforma, recurso, deshabilitado }: PropsFormulario) => {
  const [color, setColor] = useState<string>(item.color || "");
  return (
    <>
      <Grid item xs={6} sm={4} sx={{ position: "relative" }}>
        <SelectorColor id="editaColor" valor={color} onCambiar={setColor} />
      </Grid>
      <Grid item xs={12} md={6}>
        <BotonEditar
          recurso={recurso}
          deshabilitado={deshabilitado}
          idTexto="set_editar_color"
          onClick={() =>
            recurso.guardar({
              id_producto_dirac: producto.id,
              id_color_brimagy: item.id_color_brimagy,
              id_color: item.id,
              color,
              plataforma,
            })
          }
        />
      </Grid>
    </>
  );
};

export const ModalEditarColor = (props: PropsModal) => (
  <ModalEdicion titulo="Editando color" modalKey="alertaEditarColor" props={props} Formulario={FormularioColor} />
);

// ---------- Talla ----------

const FormularioTalla = ({ item, producto, plataforma, recurso, deshabilitado }: PropsFormulario) => {
  const [talla, setTalla] = useState<string>(item.talla || "");
  return (
    <>
      <Grid item xs={6} sm={4}>
        <CampoTalla id="editaTalla" valor={talla} onCambiar={setTalla} />
      </Grid>
      <Grid item xs={12} md={6}>
        <BotonEditar
          recurso={recurso}
          deshabilitado={deshabilitado}
          idTexto="set_editar_talla"
          onClick={() =>
            recurso.guardar({
              id_producto_dirac: producto.id,
              id_talla_brimagy: item.id_talla_brimagy,
              id_talla: item.id,
              talla,
              plataforma,
            })
          }
        />
      </Grid>
    </>
  );
};

export const ModalEditarTalla = (props: PropsModal) => (
  <ModalEdicion titulo="Editando talla" modalKey="alertaEditarTalla" props={props} Formulario={FormularioTalla} />
);

// ---------- Monto ----------

const FormularioMonto = ({ item, producto, recurso, deshabilitado }: PropsFormulario) => {
  const intl = useIntl();
  const [monto, setMonto] = useState<string>(item.monto || "");
  const [puntos, setPuntos] = useState<string | number>(item.puntos || 0);
  const [descripcion, setDescripcion] = useState<string>(item.descripcion || "");

  const campo = (id: string, valor: string | number, onCambiar: (v: string) => void) => (
    <Grid item xs={12} sm={4}>
      <TextField
        id={`edita_${id}`}
        fullWidth
        label={intl.formatMessage({ id: `input_${id}` })}
        variant="standard"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
      />
    </Grid>
  );

  return (
    <>
      {campo("monto", monto, setMonto)}
      {campo("puntos", puntos, setPuntos)}
      {campo("descripcion", descripcion, setDescripcion)}
      <Grid item xs={12}>
        <BotonEditar
          recurso={recurso}
          deshabilitado={deshabilitado}
          idTexto="set_editar_monto"
          onClick={() =>
            // Igual que antes, la edición de monto no envía la plataforma
            recurso.guardar({
              id_producto_dirac: producto.id,
              id_monto_brimagy: item.id_monto_brimagy,
              id_monto: item.id,
              monto,
              puntos,
              descripcion,
            })
          }
        />
      </Grid>
    </>
  );
};

export const ModalEditarMonto = (props: PropsModal) => (
  <ModalEdicion titulo="Editando monto" modalKey="alertaEditarMonto" props={props} Formulario={FormularioMonto} />
);

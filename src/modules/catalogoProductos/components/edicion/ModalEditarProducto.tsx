import { Box, Grid, Tab, Tabs } from "@mui/material";
import ModalComponent from "components/Modal";
import FormularioValores from "./FormularioValores";
import PestanaColores from "./pestanas/PestanaColores";
import PestanaTallas from "./pestanas/PestanaTallas";
import PestanaMontos from "./pestanas/PestanaMontos";
import PestanaFotos, { FOTO_MONTO, FOTOS_PRODUCTO, FOTOS_PROMO } from "./pestanas/PestanaFotos";
import type { EdicionProducto } from "../../hooks";
import type { PestanaEdicion } from "../../types";

interface Props {
  edicion: EdicionProducto;
  plataforma: string;
  proveedores: any[];
  categorias: any[];
  procesando: boolean;
}

const PESTANAS: { valor: PestanaEdicion; etiqueta: string; tipo?: "fisico" | "digital" }[] = [
  { valor: "one", etiqueta: "Valores" },
  { valor: "two", etiqueta: "Colores", tipo: "fisico" },
  { valor: "three", etiqueta: "Tallas", tipo: "fisico" },
  { valor: "four", etiqueta: "Fotos", tipo: "fisico" },
  { valor: "five", etiqueta: "Fotos Ofertas", tipo: "fisico" },
  { valor: "six", etiqueta: "Montos", tipo: "digital" },
  { valor: "seven", etiqueta: "Foto Montos", tipo: "digital" },
];

const ModalEditarProducto = ({ edicion, plataforma, proveedores, categorias, procesando }: Props) => {
  const { producto, pestana } = edicion;
  const visibles = PESTANAS.filter((p) => !p.tipo || p.tipo === producto?.tipo_producto);
  const comunes = { producto: producto!, plataforma };

  const contenido = () => {
    switch (pestana) {
      case "one":
        return (
          <FormularioValores
            edicion={edicion}
            proveedores={proveedores}
            categorias={categorias}
            procesando={procesando}
          />
        );
      case "two":
        return <PestanaColores recurso={edicion.colores} {...comunes} />;
      case "three":
        return <PestanaTallas recurso={edicion.tallas} {...comunes} />;
      case "four":
        return (
          <PestanaFotos
            config={FOTOS_PRODUCTO}
            recurso={edicion.fotos}
            onVerFoto={edicion.vistaFoto.abrir}
            {...comunes}
          />
        );
      case "five":
        return (
          <PestanaFotos
            config={FOTOS_PROMO}
            recurso={edicion.fotosPromo}
            onVerFoto={edicion.vistaFoto.abrir}
            {...comunes}
          />
        );
      case "six":
        return <PestanaMontos recurso={edicion.montos} {...comunes} />;
      case "seven":
        return (
          <PestanaFotos
            config={FOTO_MONTO}
            recurso={edicion.fotoMonto}
            onVerFoto={edicion.vistaFoto.abrir}
            {...comunes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ModalComponent
      handleClose={edicion.cerrar}
      isOpen={edicion.modalAbierto}
      key="alertaEditarProducto"
    >
      {producto && (
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12} mt={2}>
            <h5>Editando producto: {producto.nombre_producto}</h5>
          </Grid>
          <Grid item xs={12}>
            <Tabs value={pestana} onChange={(_, valor) => edicion.setPestana(valor)}>
              {visibles.map((p) => (
                <Tab key={p.valor} value={p.valor} label={p.etiqueta} />
              ))}
            </Tabs>
            <Box sx={{ p: 2 }}>{contenido()}</Box>
          </Grid>
        </Grid>
      )}
    </ModalComponent>
  );
};

export default ModalEditarProducto;

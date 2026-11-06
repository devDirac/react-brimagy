import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { MuiFileInput } from "mui-file-input";
import { useIntl } from "react-intl";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TextoCargando from "../TextoCargando";
import { ACEPTA_IMAGENES, COLORES } from "../../constants";
import { formatearNumero } from "../../utils";
import type { EdicionProducto } from "../../hooks";
import { useMemo } from "react";

interface Props {
  edicion: EdicionProducto;
  proveedores: any[];
  categorias: any[];
  procesando: boolean;
}

type CampoFormik = keyof EdicionProducto["formik"]["values"];


/** Pestaña "Valores": datos generales, costos, puntos estimados y foto principal. */
const FormularioValores = ({ edicion, proveedores, categorias, procesando }: Props) => {
  const intl = useIntl();
  const { formik, puntosEsperados, foto } = edicion;
  const hayErrores = Object.keys(formik.errors).length > 0;
  const idCategoriaActual = edicion.producto?.id_catalogo;
  const categoriasActivas = useMemo(
    () =>
      (categorias ?? []).filter(
        (c) => c.status === "ACTIVE" || (idCategoriaActual != null && c.id === idCategoriaActual)
      ),
    [categorias, idCategoriaActual]
  );

  const campo = (nombre: CampoFormik, idTexto: string, tipo?: string) => {
    const esNumero = tipo === "number";

    return (
      <Grid item xs={6} sm={4}>
        <TextField
          id={nombre}
          name={nombre}
          fullWidth
          label={intl.formatMessage({ id: idTexto })}
          variant="standard"
          type={esNumero ? "text" : tipo}
          inputProps={esNumero ? { inputMode: "decimal" } : undefined}
          value={formik.values[nombre]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched[nombre] && Boolean(formik.errors[nombre])}
          helperText={formik.touched[nombre] && formik.errors[nombre]}
        />
      </Grid>
    );
  };

  const select = (
    nombre: CampoFormik,
    etiqueta: string,
    opciones: any[],
    texto: (o: any) => string,
    sinOpciones?: string
  ) => {
    const vacio = !opciones || opciones.length === 0;
    return (
      <Grid item xs={6} sm={4}>
        <TextField
          id={nombre}
          name={nombre}
          select
          fullWidth
          label={`${intl.formatMessage({ id: etiqueta })} *`}
          variant="standard"
          value={formik.values[nombre]}
          disabled={vacio}
          helperText={vacio && sinOpciones ? intl.formatMessage({ id: sinOpciones }) : ""}
          onChange={formik.handleChange}
          InputProps={{ style: { padding: "5px" } }}
        >
          {opciones?.map((o) => (
            <MenuItem key={o.id} value={o.id}>
              {texto(o)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      {campo("nombre_producto", "input_nombre")}
      {campo("descripcion", "input_descripcion")}
      {campo("marca", "input_marca")}
      {campo("sku", "input_sku")}
      {select(
        "id_proveedor",
        "select_proveedores",
        proveedores,
        (o) => o.nombre,
        "sin_proveedores_registrados"
      )}
      {select("id_catalogo", "select_categoria_producto", categoriasActivas, (o) =>
        o.status === "ACTIVE" ? o.desc : `${o.desc} (inactiva)`
      )}
      {campo("costo_con_iva", "input_costo_con_iva", "number")}
      {campo("costo_puntos_con_iva", "input_costo_puntos_con_iva", "number")}
      {campo("envio_extra", "input_envio_extra", "number")}
      {campo("valor_factor", "input_valor_factor", "number")}
      {campo("tyc", "input_tyc")}
      {campo("vigencia", "input_vigencia")}

      <Grid item xs={12} sm={4}>
        <MDBox
          sx={{
            p: 1.5,
            bgcolor: "#f0f7f0",
            borderRadius: 1,
            border: `1px solid ${COLORES.verde}`,
            textAlign: "center",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <MDTypography variant="caption" color="text" sx={{ fontWeight: 600 }}>
            PUNTOS
          </MDTypography>
          <MDTypography variant="h6" sx={{ color: "#2f7a2f", fontWeight: 700 }}>
            {puntosEsperados ? formatearNumero(puntosEsperados.factor, 0) : "—"}
          </MDTypography>
        </MDBox>
      </Grid>

      <Grid item xs={6} sm={4}>
        {foto.mostrar && (
          <Box mt={2} display="flex" justifyContent="center">
            <img
              src={foto.mostrar}
              alt="Vista previa"
              style={{
                width: 200,
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
          </Box>
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        <MuiFileInput
          value={foto.archivo}
          onChange={foto.cambiar}
          label="Selecciona la foto del producto"
          placeholder="Selecciona la foto a subir"
          inputProps={{ accept: ACEPTA_IMAGENES, multiple: false }}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          sx={{ color: "#fff", background: COLORES.primario }}
          variant="contained"
          endIcon={<EditIcon />}
          disabled={procesando || hayErrores}
          onClick={edicion.guardar}
        >
          <TextoCargando
            cargando={edicion.procesandoEditar}
            texto={intl.formatMessage({ id: "set_editar_producto" })}
            textoCargando={intl.formatMessage({ id: "general_editando" })}
          />
        </Button>
      </Grid>
    </Grid>
  );
};

export default FormularioValores;

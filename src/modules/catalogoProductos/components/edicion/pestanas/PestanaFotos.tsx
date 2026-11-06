import { Box, Button, Card, CardContent, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MuiFileInput } from "mui-file-input";
import { useIntl } from "react-intl";
import env from "react-dotenv";
import MDTypography from "components/MDTypography";
import SeccionRecurso from "../SeccionRecurso";
import AccionesRecurso from "../AccionesRecurso";
import TextoCargando from "../../TextoCargando";
import { ACEPTA_IMAGENES } from "../../../constants";
import type { Recurso } from "../../../hooks";
import type { Producto, RecursoProducto } from "../../../types";

export interface ConfigPestanaFotos {
  titulo: string;
  mensajeVacio: string;
  /** Nombre del campo de archivo en el FormData ("fotos_producto[]", "foto_monto"…). */
  campoArchivo: string;
  /** La foto de monto no envía id_producto_brimagy. */
  conIdBrimagy: boolean;
  /** Datos que esperan activar/desactivar para una foto. */
  datosEstado: (foto: RecursoProducto, plataforma: string) => Record<string, any>;
  /** Una sola foto grande (foto de monto) en lugar de miniaturas. */
  unica?: boolean;
}

export const FOTOS_PRODUCTO: ConfigPestanaFotos = {
  titulo: "Fotos registradas",
  mensajeVacio: "no_hay_fotos_registradas",
  campoArchivo: "fotos_producto[]",
  conIdBrimagy: true,
  datosEstado: (f, plataforma) => ({ id_foto: f.id, id_foto_brimagy: f.id_foto_brimagy, plataforma }),
};

export const FOTOS_PROMO: ConfigPestanaFotos = {
  titulo: "Fotos de promo registradas",
  mensajeVacio: "no_hay_fotos_promo_registradas",
  campoArchivo: "fotos_promo_producto[]",
  conIdBrimagy: true,
  datosEstado: (f, plataforma) => ({
    id_foto_promo: f.id,
    id_foto_promo_brimagy: f.id_foto_promo_brimagy,
    plataforma,
  }),
};

export const FOTO_MONTO: ConfigPestanaFotos = {
  titulo: "Foto de montos",
  mensajeVacio: "no_hay_foto_registrada",
  campoArchivo: "foto_monto",
  conIdBrimagy: false,
  unica: true,
  datosEstado: (f, plataforma) => ({ id_foto_monto: f.id, plataforma }),
};

interface Props {
  config: ConfigPestanaFotos;
  recurso: Recurso;
  producto: Producto;
  plataforma: string;
  onVerFoto: (foto: RecursoProducto) => void;
}

const PestanaFotos = ({ config, recurso, producto, plataforma, onVerFoto }: Props) => {
  const intl = useIntl();
  const { archivos, setArchivos } = recurso;

  const textoBoton = config.unica
    ? intl.formatMessage({
        id: recurso.items.length > 0 ? "put_general_foto_monto" : "set_general_foto_monto",
      })
    : intl.formatMessage({ id: "set_general_fotos_producto" });

  const subir = () => {
    const formData = new FormData();
    formData.append("id_producto", String(producto.id));
    if (config.conIdBrimagy) {
      formData.append("id_producto_brimagy", String(producto.id_producto_brimagy ?? ""));
    }
    formData.append("plataforma", plataforma);
    archivos.forEach((archivo) => formData.append(config.campoArchivo, archivo));
    recurso.subir(formData);
    setArchivos([]);
  };

  const formulario = (
    <>
      <Grid item xs={12} sm={8}>
        <MuiFileInput
          value={archivos}
          onChange={(nuevos: File[] | null) => setArchivos(nuevos || [])}
          label={config.unica ? "Selecciona la foto" : "Selecciona fotos"}
          placeholder={config.unica ? "Selecciona la foto a subir" : "Selecciona las fotos a subir"}
          inputProps={{ accept: ACEPTA_IMAGENES, multiple: !config.unica }}
          multiple
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Button
          fullWidth
          sx={{
            color: "#000",
            background: "#8ded42",
            "&:hover": { color: "#000", background: "#62b324" },
          }}
          disabled={archivos.length === 0 || recurso.procesando}
          onClick={subir}
        >
          <TextoCargando cargando={recurso.procesando} texto={textoBoton} textoCargando="Añadiendo" />
        </Button>
      </Grid>
    </>
  );

  return (
    <SeccionRecurso
      titulo={config.titulo}
      subtitulo="Registrar nueva foto"
      formulario={formulario}
      mensajeVacio={config.mensajeVacio}
      vacio={recurso.items.length === 0}
    >
      <Grid container spacing={2}>
        {recurso.items.map((f) => {
          const inactiva = f.status === "INACTIVE";
          const datos = config.datosEstado(f, plataforma);
          return (
            <Grid item xs={config.unica ? 12 : 6} sm={config.unica ? 12 : 3} key={f.id}>
              <Card
                sx={{
                  width: config.unica ? "100%" : 150,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
                }}
              >
                <CardContent sx={{ p: 1, textAlign: "center" }} onClick={() => onVerFoto(f)}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      display: "inline-block",
                      width: "100%",
                    }}
                  >
                    <img
                      src={`${env.API_URL_ASSETS}${f.url_foto}`}
                      alt={f.nombre_original}
                      style={{
                        width: "100%",
                        height: config.unica ? 300 : 100,
                        objectFit: "cover",
                        borderRadius: 4,
                        ...(inactiva ? { opacity: 0.4, filter: "grayscale(100%)" } : {}),
                      }}
                    />
                    {inactiva && (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(0,0,0,0.3)",
                        }}
                      >
                        <CloseIcon sx={{ color: "red" }} fontSize="large" />
                      </Box>
                    )}
                  </Box>
                  <MDTypography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f.nombre_original}
                  </MDTypography>
                </CardContent>
                <AccionesRecurso
                  item={f}
                  nombre="foto"
                  onActivar={() => recurso.activar(datos)}
                  onDesactivar={() => recurso.desactivar(datos)}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </SeccionRecurso>
  );
};

export default PestanaFotos;

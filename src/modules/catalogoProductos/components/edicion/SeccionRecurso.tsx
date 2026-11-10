import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useIntl } from "react-intl";

interface Props {
  titulo: string;
  subtitulo: string;
  /** Formulario para registrar un nuevo elemento. */
  formulario: React.ReactNode;
  /** Id de react-intl del mensaje cuando la lista está vacía. */
  mensajeVacio: string;
  vacio: boolean;
  children: React.ReactNode;
}

/** Marco común de las pestañas: título, formulario de alta y lista. */
const SeccionRecurso = ({ titulo, subtitulo, formulario, mensajeVacio, vacio, children }: Props) => {
  const intl = useIntl();

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          {titulo}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="info" gutterBottom>
              {subtitulo}
            </Typography>
          </Grid>
          {formulario}
        </Grid>
        <Divider sx={{ m: 2 }} />
        {vacio ? (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h6" color="text.secondary">
              {intl.formatMessage({ id: mensajeVacio })}
            </Typography>
          </Box>
        ) : (
          children
        )}
      </Paper>
    </Box>
  );
};

export default SeccionRecurso;

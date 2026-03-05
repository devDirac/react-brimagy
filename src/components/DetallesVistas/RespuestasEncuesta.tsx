import { Grid, Typography, Divider, Box, Paper, Tooltip, IconButton } from "@mui/material";
import { useIntl } from "react-intl";
import { useMemo } from "react";

import { useSelector } from "react-redux";
import { StoreType } from "../../types/genericTypes";
import { green, red, amber, grey, orange } from "@mui/material/colors";
//muy satisfecho
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
//satisfecho
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
//neutral
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
//insatisfecho
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
//muy insatisfecho
import MoodBadIcon from "@mui/icons-material/MoodBad";

interface Respuesta {
  id_respuesta: number;
  pregunta: string;
  tipo_encuesta: string;
  tipo_pregunta: string;
  id_canje: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  respuesta: string;
  creacion_respuesta: Date;
}

interface DetalleCanjeProps {
  verRespuestas?: Respuesta[] | null;
}

const RespuestasEncuestaModal = ({ verRespuestas }: DetalleCanjeProps) => {
  if (!verRespuestas) return null;
  const intl = useIntl();

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const isSuperAdmin = tipoUsuario === 6;
  const isAdministracion = tipoUsuario === 5;
  const isInventario = tipoUsuario === 4;
  const isCompras = tipoUsuario === 3;
  const isAuditor = tipoUsuario === 2;
  const isInternauta = tipoUsuario === 1;

  const iconosRespuestaMultiple = [
    {
      id: "5",
      texto: "Muy satisfecho",
      icono: SentimentVerySatisfiedIcon,
      color: green[500],
    },
    {
      id: "4",
      texto: "Satisfecho",
      icono: SentimentSatisfiedIcon,
      color: green[300],
    },
    {
      id: "3",
      texto: "Neutral",
      icono: SentimentNeutralIcon,
      color: amber[500],
    },
    {
      id: "2",
      texto: "Insatisfecho",
      icono: SentimentDissatisfiedIcon,
      color: orange[500],
    },
    {
      id: "1",
      texto: "Muy insatisfecho",
      icono: MoodBadIcon,
      color: red[500],
    },
  ];

  const traducirRespuesta = (respuesta: string, tipo_pregunta: string) => {
    if (!respuesta) return "";
    if (!tipo_pregunta) return "";
    const iconosRespuestaText = iconosRespuestaMultiple.find(
      (e: any) => String(e?.id) === respuesta
    );
    const IconoComponente = iconosRespuestaText?.icono;
    const tipoMultiplePregunta = tipo_pregunta === "opcion_multiple";
    return (
      <Box>
        {tipoMultiplePregunta ? (
          <Tooltip title={iconosRespuestaText?.texto}>
            <IconButton>
              {IconoComponente && (
                <IconoComponente
                  sx={{
                    color: iconosRespuestaText?.color,
                    transform: "scale(1.5)",
                    transition: "all 0.3s",
                  }}
                  fontSize="medium"
                />
              )}
            </IconButton>
          </Tooltip>
        ) : (
          <Typography variant="body2" fontWeight="medium">
            {respuesta}
          </Typography>
        )}
      </Box>
    );
  };

  const getEstadoPreguntaColor = (estado_pregunta: string) => {
    switch (estado_pregunta?.toLowerCase()) {
      case "activa":
        return "success";
      case "desactivada":
        return "error";
      default:
        return "default";
    }
  };

  const tipoEncuestaMap: { [key: string]: string } = {
    SATISFACCION_COMPRA: "SATISFACCIÓN DE COMPRA",
    SATISFACCION_PLATAFORMA: "SATISFACCIÓN DE PLATAFORMA",
  };

  const tipoPreguntaMap: { [key: string]: string } = {
    ABIERTA: "PREGUNTA ABIERTA",
    OPCION_MULTIPLE: "OPCIÓN MÚLTIPLE",
    SI_NO: "PREGUNTA DE SI O NO",
  };

  const estadosPreguntaMap: { [key: string]: string } = {
    ACTIVA: "PREGUNTA ACTIVA",
    DESACTIVADA: "PREGUNTA INACTIVA",
  };

  const traducirEstadoPregunta = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosPreguntaMap[estadoUpper] || estadoUpper;
  };

  const traducirTipoEncuesta = (tipo_encuesta: string | null): string => {
    if (!tipo_encuesta) return "ENCUESTA NORMAL";
    const estadoUpper = tipo_encuesta.toUpperCase();
    return tipoEncuestaMap[estadoUpper] || estadoUpper;
  };

  const traducirTipoPregunta = (tipo_pregunta: string | null): string => {
    if (!tipo_pregunta) return "PREGUNTA NORMAL";
    const estadoUpper = tipo_pregunta.toUpperCase();
    return tipoPreguntaMap[estadoUpper] || estadoUpper;
  };

  const respuestasAgrupadas = useMemo(() => {
    const grupos: { [key: string]: any[] } = {};

    verRespuestas.forEach((respuesta) => {
      const tipo = respuesta.tipo_encuesta || "SIN_TIPO";
      if (!grupos[tipo]) {
        grupos[tipo] = [];
      }
      grupos[tipo].push(respuesta);
    });

    return grupos;
  }, [verRespuestas]);

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              ENCUESTAS REGISTRADAS
            </Typography>
          </Box>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Respuestas de acuerdo a tipo de encuesta */}
        {Object.entries(respuestasAgrupadas).map(([tipoEncuesta, respuestas]) => (
          <Grid item xs={12} key={tipoEncuesta}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {traducirTipoEncuesta(tipoEncuesta)}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {respuestas.map((respuesta: any, key: number) => (
                <Grid container spacing={2} key={key} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="body2" color="text.secondary">
                      Pregunta
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {respuesta?.pregunta}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Respuesta
                    </Typography>

                    {traducirRespuesta(respuesta?.respuesta, respuesta?.tipo_pregunta)}
                  </Grid>
                </Grid>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default RespuestasEncuestaModal;

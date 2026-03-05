import { useRef, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "components/Header";
import MDBox from "components/MDBox";
import {
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
  Paper,
  Backdrop,
  CircularProgress,
  Chip,
  Stack,
  Tooltip,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import logo from "assets/images/profile_icon.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { green, red, amber, grey, orange } from "@mui/material/colors";
import ModalComponent from "components/Modal";
import GppBadIcon from "@mui/icons-material/GppBad";
import { numericFormatter } from "react-number-format";
import AddIcon from "@mui/icons-material/Add";
import HttpsIcon from "@mui/icons-material/Https";
import { Spinner } from "react-bootstrap";
import Forward10Icon from "@mui/icons-material/Forward10";
import { useEncuestaUsuario } from "./customHooksPages/useEncuestaUsuario";
import BallotIcon from "@mui/icons-material/Ballot";
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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SendIcon from "@mui/icons-material/Send";

function EncuestaUsuario(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    id_canje,
    addRespuestasEncuestaUsuario,
    verificado,
    codigoVerificacion,
    procesandoCreateRespuestasUsuario,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    respuestas,
    preguntas,
    procesando,
    intl,
    navigate,
    respuestasUsuario,
    setRespuestasUsuario,
    handleRespuestaChange,
    todasRespuestasCompletas,
  } = useEncuestaUsuario();

  const tipoEncuestaMap: { [key: string]: string } = {
    SATISFACCION_COMPRA: "SATISFACCIÓN DE COMPRA",
    SATISFACCION_PLATAFORMA: "SATISFACCIÓN DE PLATAFORMA",
  };

  const tipoPreguntaMap: { [key: string]: string } = {
    ABIERTA: "PREGUNTA ABIERTA",
    OPCION_MULTIPLE: "OPCIÓN MÚLTIPLE",
    SI_NO: "PREGUNTA DE SI O NO",
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

  const mostrarInputPorTipoPregunta = (pregunta: any) => {
    const tipo = pregunta.tipo_pregunta?.toLowerCase();
    const valorActual = respuestasUsuario[pregunta.id] || "";
    const yaRespondida = respuestas?.some((r: any) => r.id === pregunta.id && r.respuesta);

    switch (tipo) {
      case "abierta":
        return (
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Escribe tu respuesta aquí..."
              value={valorActual}
              onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
              disabled={yaRespondida}
              // value={respuestas[pregunta.id] || ""}
              // onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
            />
          </Grid>
        );

      case "opcion_multiple":
        return (
          <Grid item xs={12} md={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              {/* Muy Satisfecho */}
              <Tooltip title="Muy satisfecho">
                <IconButton
                  onClick={() => handleRespuestaChange(pregunta.id, "5")}
                  disabled={yaRespondida}
                >
                  <SentimentVerySatisfiedIcon
                    sx={{
                      fontSize: 88,
                      color: valorActual === "5" ? green[500] : grey[400],
                      transform: valorActual === "5" ? "scale(1.5)" : "",
                      transition: "all 0.3s",
                      opacity: yaRespondida ? 0.6 : 1,
                      "&:hover": {
                        transform: "scale(1.5)",
                        color: yaRespondida
                          ? valorActual === "5"
                            ? green[500]
                            : grey[400]
                          : green[500],
                      },
                    }}
                    fontSize="large"
                  />
                </IconButton>
              </Tooltip>

              {/* Satisfecho */}
              <Tooltip title="Satisfecho">
                <IconButton
                  onClick={() => handleRespuestaChange(pregunta.id, "4")}
                  disabled={yaRespondida}
                >
                  <SentimentSatisfiedIcon
                    sx={{
                      fontSize: 88,
                      color: valorActual === "4" ? green[300] : grey[400],
                      transform: valorActual === "4" ? "scale(1.5)" : "",
                      transition: "all 0.3s",
                      opacity: yaRespondida ? 0.6 : 1,
                      "&:hover": {
                        transform: "scale(1.5)",
                        color: yaRespondida
                          ? valorActual === "4"
                            ? green[300]
                            : grey[400]
                          : green[300],
                      },
                    }}
                    fontSize="large"
                  />
                </IconButton>
              </Tooltip>

              {/* Neutral */}
              <Tooltip title="Neutral">
                <IconButton
                  onClick={() => handleRespuestaChange(pregunta.id, "3")}
                  disabled={yaRespondida}
                >
                  <SentimentNeutralIcon
                    sx={{
                      fontSize: 88,
                      color: valorActual === "3" ? amber[500] : grey[400],
                      transform: valorActual === "3" ? "scale(1.5)" : "",
                      transition: "all 0.3s",
                      opacity: yaRespondida ? 0.6 : 1,
                      "&:hover": {
                        transform: "scale(1.5)",
                        color: yaRespondida
                          ? valorActual === "3"
                            ? amber[500]
                            : grey[400]
                          : amber[500],
                      },
                    }}
                    fontSize="large"
                  />
                </IconButton>
              </Tooltip>

              {/* Insatisfecho */}
              <Tooltip title="Insatisfecho">
                <IconButton
                  onClick={() => handleRespuestaChange(pregunta.id, "2")}
                  disabled={yaRespondida}
                >
                  <SentimentDissatisfiedIcon
                    sx={{
                      fontSize: 88,
                      color: valorActual === "2" ? orange[500] : grey[400],
                      transform: valorActual === "2" ? "scale(1.5)" : "",
                      transition: "all 0.3s",
                      opacity: yaRespondida ? 0.6 : 1,
                      "&:hover": {
                        transform: "scale(1.5)",
                        color: yaRespondida
                          ? valorActual === "2"
                            ? orange[500]
                            : grey[400]
                          : orange[500],
                      },
                    }}
                    fontSize="large"
                  />
                </IconButton>
              </Tooltip>

              {/* Muy Insatisfecho */}
              <Tooltip title="Muy insatisfecho">
                <IconButton
                  onClick={() => handleRespuestaChange(pregunta.id, "1")}
                  disabled={yaRespondida}
                >
                  <MoodBadIcon
                    sx={{
                      fontSize: 88,
                      color: valorActual === "1" ? red[500] : grey[400],
                      transform: valorActual === "1" ? "scale(1.5)" : "",
                      transition: "all 0.3s",
                      opacity: yaRespondida ? 0.6 : 1,
                      "&:hover": {
                        transform: "scale(1.5)",
                        color: yaRespondida
                          ? valorActual === "1"
                            ? red[500]
                            : grey[400]
                          : red[500],
                      },
                    }}
                    fontSize="large"
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        );

      case "si_no":
        return (
          <Grid item xs={12} md={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name={`respuesta_${pregunta.id}`}
                  value={valorActual}
                  onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
                  sx={{ textAlign: "center" }}
                >
                  <FormControlLabel
                    value="si"
                    control={<Radio />}
                    label="Sí"
                    disabled={yaRespondida}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontWeight: valorActual === "si" ? 600 : 400,
                        color: valorActual === "si" ? green[500] : grey[400],
                      },
                    }}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="No"
                    disabled={yaRespondida}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontWeight: valorActual === "no" ? 600 : 400,
                        color: valorActual === "no" ? red[500] : grey[400],
                      },
                    }}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
        );

      default:
        return (
          <Grid item xs={12} md={12}>
            <Typography variant="body1" color="error">
              Tipo de pregunta no válido
            </Typography>
          </Grid>
        );
    }
  };

  return (
    <DashboardLayout withSidebar={false}>
      <MDBox py={0} mb={0}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={10} lg={9}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                {preguntas ? (
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <BallotIcon sx={{ fontSize: 60, color: green[500], mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                      ENCUESTA DE {traducirTipoEncuesta(preguntas?.[0].tipo_encuesta)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hola, para asegurarnos de que todo salió perfecto, te invitamos a completar
                      esta encuesta, tu opinión nos ayuda a mejorar y a seguir trayendo los mejores
                      premios para ti. ¡Muchas gracias!
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <GppBadIcon sx={{ fontSize: 80, color: red[500], mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                      NO EXISTE UNA ENCUESTA DE ESE TIPO
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Por favor introduce un tipo de encuesta válido
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Información del Canje */}
                {preguntas && (
                  <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h5" color={"#eb2fa5"}>
                        Preguntas
                      </Typography>
                    </Box>
                    {preguntas.map((p: any, key: number) => {
                      const respuestaExistente = respuestas?.find((r: any) => r.id === p.id);
                      return (
                        <Grid container spacing={2} key={key}>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <Typography variant="body1" fontWeight={400}>
                              {p.pregunta}{" "}
                              {respuestaExistente && (
                                <Chip
                                  label="Respondida"
                                  color="success"
                                  size="small"
                                  sx={{ ml: 2 }}
                                  icon={<CheckCircleIcon />}
                                />
                              )}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={12}>
                            {mostrarInputPorTipoPregunta(p)}
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <Divider sx={{ my: 1 }} />
                          </Grid>
                        </Grid>
                      );
                    })}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      display="flex"
                      alignContent="center"
                      justifyContent="center"
                    >
                      <Button
                        sx={{ color: "#fff", background: "#084d6e" }}
                        variant="contained"
                        endIcon={<SendIcon />}
                        disabled={procesandoCreateRespuestasUsuario || todasRespuestasCompletas()}
                        onClick={(e: any) => {
                          const datos = {
                            id_canje: id_canje,
                            respuestas: respuestasUsuario,
                            tipo_encuesta: preguntas?.[0].tipo_encuesta,
                          };
                          addRespuestasEncuestaUsuario(datos);
                          //console.log(datos);
                        }}
                      >
                        {todasRespuestasCompletas() ? (
                          "Encuesta Completada"
                        ) : procesandoCreateRespuestasUsuario ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            {intl.formatMessage({ id: "general_enviando" })}...{" "}
                          </>
                        ) : (
                          intl.formatMessage({ id: "enviar_respuestas" })
                        )}
                      </Button>
                    </Grid>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <ModalComponent handleClose={handleisAlerClose} isOpen={isAlertOpen} key={"alerta"}>
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <br />
            <p>{mensajeAlert}</p>
          </Grid>
        </Grid>
      </ModalComponent>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={procesando}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </DashboardLayout>
  );
}

export default EncuestaUsuario;

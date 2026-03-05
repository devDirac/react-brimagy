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
  IconButton,
  MenuItem,
} from "@mui/material";
import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import logo from "assets/images/profile_icon.png";
import ModalComponent from "components/Modal";
import { useCatalogoEncuestas } from "./customHooksPages/useCatalogoEncuestas";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { green } from "@mui/material/colors";
import MDTypography from "components/MDTypography";
import { styled } from "@mui/material/styles";
import Badge, { BadgeProps } from "@mui/material/Badge";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Spinner } from "react-bootstrap";
import PreguntasEncuestaModal from "components/DetallesVistas/PreguntasEncuesta";
import EditIcon from "@mui/icons-material/Edit";
import DinamicTableMejorada from "components/DinamicTable/DinamicTable";
import RespuestasEncuestaModal from "components/DetallesVistas/RespuestasEncuesta";

function CatalogoEncuestas(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    handleAccionCallback,
    formik,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    procesando,
    intl,
    navigate,
    getFieldColor,
    //encuesta
    encuestas,
    verEncuesta,
    setVerEncuesta,
    procesandoPregunta,
    createPreguntaEncuesta,
    tipoEncuestaArray,
    tipoPreguntaArray,
    isAlertOpenEncuesta,
    handleisAlertOpenEncuesta,
    handleisAlertCloseEncuesta,
    getPreguntasPorTipo,
    editarPreguntaEncuesta,
    verEditarPregunta,
    setEditarPregunta,
    isAlertOpenEditarPregunta,
    handleisAlertOpenEditarPregunta,
    handleisAlertCloseEditarPregunta,
    //pregunta
    editaPregunta,
    setEditaPregunta,
    editaTipoPregunta,
    setEditaTipoPregunta,
    procesandoEditarPregunta,
    desactivarPreguntaEncuesta,
    activarPreguntaEncuesta,
    //respuestas
    procesandoRespuestasEncuesta,
    getRespuestasPorEncuesta,
    getRespuestasPorCanje,
    verRespuestasEncuesta,
    isAlertOpenVerRespuestasEncuesta,
    handleisAlertOpenVerRespuestasEncuesta,
    handleisAlertCloseVerRespuestasEncuesta,
    //respuestas por canje
    verRespuestasCanje,
    isAlertOpenVerRespuestasCanje,
    handleisAlertOpenVerRespuestasCanje,
    handleisAlertCloseVerRespuestasCanje,
  } = useCatalogoEncuestas();

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

  const encuestasDisponibles = () => {
    return !encuestas?.length && !procesando ? (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h3>{intl.formatMessage({ id: "sin_encuestas_registradas" })}</h3>
        </Grid>
      </Grid>
    ) : null;
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 2,
      top: 7,
      background: `#eb2fa5`,
      padding: "0 4px",
      fontSize: "10px",
    },
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header tipoUsuario={tipoUsuario} nombreUsuario={userName} fotoPerfil={fotoUser} />
      <MDBox py={0} mb={0}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={12} lg={12} mt={2}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" gutterBottom>
                    ENCUESTAS DE LA PLATAFORMA
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En este módulo puedes añadir una encuesta, añadiendo preguntas de acuerdo al
                    tipo de encuesta que deseas añadir entre las disponibles, añade una pregunta, el
                    tipo de pregunta que será y el tipo de encuesta.
                  </Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
                    <Typography variant="h5" gutterBottom>
                      Añadir nueva pregunta
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="pregunta"
                      fullWidth
                      label={`${intl.formatMessage({ id: "input_pregunta" })} *`}
                      variant="standard"
                      name="pregunta"
                      value={formik.values.pregunta || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        formik.setFieldValue("pregunta", value);
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.pregunta && Boolean(formik.errors.pregunta)}
                      helperText={formik.touched.pregunta && formik.errors.pregunta}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: getFieldColor("pregunta"),
                        },
                        "& .MuiInput-underline:after": {
                          borderBottomColor: getFieldColor("pregunta"),
                        },
                        "& .MuiInput-underline:before": {
                          borderBottomColor: getFieldColor("pregunta"),
                        },
                        "& .MuiInputBase-input": {
                          color: getFieldColor("pregunta"),
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="tipo_encuesta"
                      select
                      fullWidth
                      label={`${intl.formatMessage({ id: "select_tipo_encuesta" })} *`}
                      variant="standard"
                      name="tipo_encuesta"
                      value={formik.values.tipo_encuesta || ""}
                      disabled={procesando}
                      helperText={formik.touched.tipo_encuesta && formik.errors.tipo_encuesta}
                      error={formik.touched.tipo_encuesta && Boolean(formik.errors.tipo_encuesta)}
                      onChange={(e) => {
                        const value = e.target.value;
                        formik.setFieldValue("tipo_encuesta", value);
                      }}
                      InputProps={{
                        style: { padding: "5px" },
                      }}
                      onBlur={formik.handleBlur}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: getFieldColor("tipo_encuesta"),
                        },
                        "& .MuiInput-underline:after": {
                          borderBottomColor: getFieldColor("tipo_encuesta"),
                        },
                        "& .MuiInput-underline:before": {
                          borderBottomColor: getFieldColor("tipo_encuesta"),
                        },
                        "& .MuiInputBase-input": {
                          color: getFieldColor("tipo_encuesta"),
                        },
                      }}
                    >
                      {tipoEncuestaArray?.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="tipo_pregunta"
                      select
                      fullWidth
                      label={`${intl.formatMessage({ id: "select_tipo_pregunta" })} *`}
                      variant="standard"
                      name="tipo_pregunta"
                      value={formik.values.tipo_pregunta || ""}
                      disabled={procesando}
                      helperText={formik.touched.tipo_pregunta && formik.errors.tipo_pregunta}
                      error={formik.touched.tipo_pregunta && Boolean(formik.errors.tipo_pregunta)}
                      onChange={(e) => {
                        const value = e.target.value;
                        formik.setFieldValue("tipo_pregunta", value);
                      }}
                      InputProps={{
                        style: { padding: "5px" },
                      }}
                      onBlur={formik.handleBlur}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: getFieldColor("tipo_pregunta"),
                        },
                        "& .MuiInput-underline:after": {
                          borderBottomColor: getFieldColor("tipo_pregunta"),
                        },
                        "& .MuiInput-underline:before": {
                          borderBottomColor: getFieldColor("tipo_pregunta"),
                        },
                        "& .MuiInputBase-input": {
                          color: getFieldColor("tipo_pregunta"),
                        },
                      }}
                    >
                      {tipoPreguntaArray?.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={12}
                    display="flex"
                    alignContent="center"
                    justifyContent="center"
                  >
                    <Button
                      sx={{ color: "#fff", background: "#084d6e" }}
                      variant="contained"
                      endIcon={<AddCircleIcon />}
                      disabled={procesando || !formik.dirty || !formik.isValid}
                      onClick={(e: any) => {
                        const datos = {
                          pregunta: formik.values.pregunta,
                          tipo_encuesta: formik.values.tipo_encuesta,
                          tipo_pregunta: formik.values.tipo_pregunta,
                        };
                        createPreguntaEncuesta(datos);
                      }}
                    >
                      {procesandoPregunta ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          {intl.formatMessage({ id: "general_añadiendo" })}...{" "}
                        </>
                      ) : (
                        intl.formatMessage({ id: "set_añadir_pregunta" })
                      )}
                    </Button>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                {encuestas?.length > 0 ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
                      <Typography variant="h5" gutterBottom>
                        Encuestas disponibles
                      </Typography>
                    </Grid>
                    {encuestas.map((p: any, key: number) => {
                      return (
                        <Grid item xs={12} sm={6} md={6} lg={6} key={p.id || key}>
                          <Card
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                              overflow: "hidden",
                              transition: "all 0.3s",
                              "&:hover": {
                                boxShadow: 6,
                                transform: "translateY(-4px)",
                              },
                            }}
                          >
                            {/* Fila superior*/}
                            <Box
                              sx={{
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "row",
                                bgcolor: "#a5eb2f",
                                p: 1,
                                borderBottom: `2px solid #02999e`,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  p: 1,
                                }}
                              >
                                <QuestionAnswerIcon
                                  sx={{
                                    color: "#eb2fa5",
                                    fontSize: 48,
                                  }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  overflow: "hidden",
                                }}
                              >
                                <MDTypography
                                  variant="caption"
                                  color="text"
                                  sx={{
                                    paddingLeft: "10px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontWeight: 600,
                                    color: green[900],
                                  }}
                                >
                                  {traducirTipoEncuesta(p.tipo_encuesta?.toUpperCase())}
                                </MDTypography>
                              </Box>
                            </Box>

                            {/* Fila inferior - Iconos a la izquierda, Info a la derecha */}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                flex: 1,
                                overflow: "hidden",
                              }}
                            >
                              {/* Columna derecha - Información */}
                              <CardContent
                                sx={{
                                  flex: 1,
                                  gap: 2,
                                  p: 2,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  textAlign: "center",
                                  overflow: "hidden",
                                }}
                              >
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Preguntas
                                  </Typography>
                                  <Tooltip title="Ver Preguntas">
                                    <StyledBadge badgeContent={p.total_preguntas} color="secondary">
                                      <IconButton
                                        aria-label="ver"
                                        size="small"
                                        color="default"
                                        onClick={() => {
                                          const datos = {
                                            tipo_encuesta: p.tipo_encuesta,
                                          };
                                          getPreguntasPorTipo(datos);
                                          handleisAlertOpenEncuesta();
                                        }}
                                      >
                                        <VisibilityIcon fontSize="medium" />
                                      </IconButton>
                                    </StyledBadge>
                                  </Tooltip>
                                </Box>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Respuestas
                                  </Typography>
                                  {p.total_respuestas ? (
                                    <Tooltip title="Ver Respuestas">
                                      <StyledBadge
                                        badgeContent={p.total_respuestas}
                                        color="secondary"
                                      >
                                        <IconButton
                                          aria-label="ver"
                                          size="small"
                                          color="default"
                                          onClick={() => {
                                            const datos = {
                                              tipo_encuesta: p.tipo_encuesta,
                                            };
                                            getRespuestasPorEncuesta(datos);
                                            console.log(verRespuestasEncuesta);
                                            handleisAlertOpenVerRespuestasEncuesta();
                                          }}
                                        >
                                          <VisibilityIcon fontSize="medium" />
                                        </IconButton>
                                      </StyledBadge>
                                    </Tooltip>
                                  ) : (
                                    0
                                  )}
                                </Box>
                              </CardContent>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : !procesando ? (
                  encuestasDisponibles()
                ) : null}
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
      {/* MODAL PARA MOSTRAR PREGUNTAS DE ENCUESTA */}
      <ModalComponent
        handleClose={handleisAlertCloseEncuesta}
        isOpen={isAlertOpenEncuesta}
        key={"alertaEncuesta"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verEncuesta && (
            <PreguntasEncuestaModal
              verPregunta={verEncuesta}
              editarPreguntaEncuesta={editarPreguntaEncuesta}
              setEditarPregunta={setEditarPregunta}
              handleisAlertOpenEditarPregunta={handleisAlertOpenEditarPregunta}
              desactivarPreguntaEncuesta={desactivarPreguntaEncuesta}
              activarPreguntaEncuesta={activarPreguntaEncuesta}
            />
          )}
        </Grid>
      </ModalComponent>
      {/* MODAL PARA EDITAR LA PREGUNTA */}
      <ModalComponent
        handleClose={handleisAlertCloseEditarPregunta}
        isOpen={isAlertOpenEditarPregunta}
        key={"alertaEditarPregunta"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verEditarPregunta && (
            <>
              <Grid item xs={12} mt={2}>
                <h5>Editando pregunta</h5>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="editaPregunta"
                  fullWidth
                  label={intl.formatMessage({ id: "input_nombre" })}
                  variant="standard"
                  name="editaPregunta"
                  value={editaPregunta}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditaPregunta(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  sx={{ color: "#fff", background: "#084d6e" }}
                  variant="contained"
                  endIcon={<EditIcon />}
                  disabled={procesando}
                  onClick={(e: any) => {
                    const datos = {
                      id_pregunta: verEditarPregunta?.id,
                      pregunta: editaPregunta,
                    };
                    editarPreguntaEncuesta(datos);
                  }}
                >
                  {procesandoEditarPregunta ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      {intl.formatMessage({ id: "general_editando" })}...{" "}
                    </>
                  ) : (
                    intl.formatMessage({ id: "set_editar_pregunta" })
                  )}
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </ModalComponent>
      {/* MODAL PARA VER RESPUESTAS DE LAS PREGUNTAS */}
      <ModalComponent
        handleClose={handleisAlertCloseVerRespuestasEncuesta}
        isOpen={isAlertOpenVerRespuestasEncuesta}
        key={"alertaVerRespuestas"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verRespuestasEncuesta && (
            <>
              <Grid item xs={12} mt={2}>
                <h5>Respuestas de los usuarios</h5>
              </Grid>
              <Grid item xs={12} mt={2}>
                {verRespuestasEncuesta.length && !procesandoRespuestasEncuesta ? (
                  <DinamicTableMejorada
                    actions
                    //key={tableKeyCategoria}
                    //sinBusqueda
                    columnsToShow={"nombre_completo, pregunta, respuesta, creacion_respuesta"}
                    sinExport
                    esListaRespuestas
                    //showCheckBox
                    data={verRespuestasEncuesta}
                    enAccion={(accion, row) => {
                      handleAccionCallback(accion, row);
                    }}
                  />
                ) : !verRespuestasEncuesta?.length && !procesandoRespuestasEncuesta ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <h3>{intl.formatMessage({ id: "sin_registros" })}</h3>
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
            </>
          )}
        </Grid>
      </ModalComponent>
      {/* MODAL PARA VER RESPUESTAS POR ID DE CANJE */}
      <ModalComponent
        handleClose={handleisAlertCloseVerRespuestasCanje}
        isOpen={isAlertOpenVerRespuestasCanje}
        key={"alertaVerRespuestasCanje"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          {verRespuestasCanje && (
            <>
              <Grid item xs={12} mt={2}>
                <RespuestasEncuestaModal verRespuestas={verRespuestasCanje} />
              </Grid>
            </>
          )}
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

export default CatalogoEncuestas;

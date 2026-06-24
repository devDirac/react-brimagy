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
} from "@mui/material";
import { useSelector } from "react-redux";
import { StoreType } from "../types/genericTypes";
import logo from "assets/images/logo_puntotes_2026.png";
import { useValidarIdentidad } from "./customHooksPages/useValidarIdentidad";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { green, red } from "@mui/material/colors";
import ModalComponent from "components/Modal";
import GppBadIcon from "@mui/icons-material/GppBad";
import { numericFormatter } from "react-number-format";
import AddIcon from "@mui/icons-material/Add";
import HttpsIcon from "@mui/icons-material/Https";
import { Spinner } from "react-bootstrap";
import Forward10Icon from "@mui/icons-material/Forward10";

function ValidarIdentidad(): JSX.Element {
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const userName = useSelector((state: StoreType) => state?.app?.user?.data?.name || false);
  const fotoUser: any = useSelector((state: StoreType) => state?.app?.user?.data?.foto || logo);

  const {
    validarIdentidadPorCodigo,
    verificado,
    showInput,
    setShowInput,
    codigoVerificacion,
    solicitarCodigoValidacion,
    procesandoCodigo,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    canje,
    procesando,
    intl,
  } = useValidarIdentidad();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleVerify = (id_canje: number) => {
    const codigoVerificacion = otp.join("");
    validarIdentidadPorCodigo(Number(codigoVerificacion), id_canje);
    setOtp(["", "", "", "", "", ""]);
  };

  const getEstadoColor = (estado_validacion: string) => {
    switch (estado_validacion?.toLowerCase()) {
      case "identidad_validada":
        return "success";
      case "solicitud_enviada":
        return "info";
      case "notificacion_enviada":
        return "warning";
      default:
        return "default";
    }
  };

  const getEstadoCanjeColor = (estado_canje: string) => {
    switch (estado_canje?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const estadosCanjeMap: { [key: string]: string } = {
    ACTIVE: "ACTIVO",
    INACTIVE: "INACTIVO",
  };

  const estadosValidacionMap: { [key: string]: string } = {
    NOTIFICACION_ENVIADA: "EN ESPERA DE VALIDACIÓN DE IDENTIDAD",
    SOLICITUD_ENVIADA: "SOLICITUD DE CÓDIGO ENVIADA",
    IDENTIDAD_VALIDADA: "IDENTIDAD VALIDADA",
  };
  // Función helper para traducir estados
  const traducirEstadoCanje = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosCanjeMap[estadoUpper] || estadoUpper;
  };

  const traducirEstadoValidacion = (estado: string | null): string => {
    if (!estado) return "SIN VALIDAR";
    const estadoUpper = estado.toUpperCase();
    return estadosValidacionMap[estadoUpper] || estadoUpper;
  };

  const calle = canje?.calle ?? "";
  const numero_calle = canje?.numero_calle ?? "";
  const colony = canje?.colony ?? "";
  const municipio = canje?.municipio ?? "";
  const codigo_postal = canje?.codigo_postal ?? "";

  const direccion_completa = `${calle} ${numero_calle}, ${colony} ${municipio}, ${codigo_postal}`;

  return (
    <Box sx={{ fontFamily: "Poppins !important" }}>
      <MDBox p={0} m={0}>
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={12} lg={12}>
            <Box
              sx={{
                background:
                  "linear-gradient(180deg,rgba(0, 181, 225, 1) 0%, rgba(0, 132, 171, 1) 100%);",
              }}
            >
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={5}
                  md={4}
                  lg={3}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    component="img"
                    src={logo}
                    alt="Puntotes"
                    sx={{
                      width: {
                        xs: 120,
                        sm: 150,
                        md: 200,
                        lg: 200,
                        xl: 200,
                      },
                      padding: "15px 0",
                      height: "auto",
                    }}
                  />
                </Grid>
                <Grid item xs={2} md={4} lg={6}></Grid>
                <Grid
                  item
                  xs={5}
                  md={4}
                  lg={3}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="h4" gutterBottom sx={{ color: "#fff" }}>
                    Hola, {canje && canje.nombre_usuario}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Grid container spacing={0}>
              <Card style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Grid item xs={11} md={9} lg={9}>
                  <CardContent sx={{ p: 4 }}>
                    {canje ? (
                      <>
                        {!codigoVerificacion && !verificado && (
                          <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Typography variant="h4" gutterBottom sx={{ color: "#00506E" }}>
                              Validación de Canje
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#000" }}>
                              Hemos identificado un canje asociado a tu cuenta. Si lo reconoces, por
                              favor confírmalo haciendo clic en el botón para recibir tu código de
                              verificación.
                            </Typography>
                          </Box>
                        )}
                        {verificado && (
                          <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Typography variant="h4" gutterBottom sx={{ color: "#00506E" }}>
                              ¡Felicidades!
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#000" }}>
                              Tu canje se ha procesado correctamente <br />
                              El tiempo estimado de entrega es de 30 días naturales a partir de la
                              fecha en que realizaste tu canje. <br />
                              <br />
                              Cualquier duda o pregunta contáctanos en atencion@puntotes.com.mx
                            </Typography>
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box sx={{ textAlign: "center", mb: 3 }}>
                        <Typography variant="h4" gutterBottom sx={{ color: "#00506E" }}>
                          Canje no existente
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#000" }}>
                          Por favor introduce un código de canje válido
                        </Typography>
                      </Box>
                    )}
                    {canje && !verificado && (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Box>
                          {!codigoVerificacion ? (
                            <Button
                              sx={{
                                color: "#fff",
                                background: "#00506E",
                                fontSize: "0.75rem",
                                padding: "10px 20px",
                                borderRadius: "30px",
                                mt: 0,
                                "&:hover": {
                                  background: "#0a6b8f",
                                },
                              }}
                              variant="contained"
                              onClick={(e: any) => {
                                solicitarCodigoValidacion(canje);
                              }}
                            >
                              {procesandoCodigo ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                  Solicitando código...{" "}
                                </>
                              ) : (
                                intl.formatMessage({ id: "solicitar_codigo_input" })
                              )}
                            </Button>
                          ) : codigoVerificacion ? (
                            <Box>
                              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ textAlign: "center", color: "#00506E" }}
                              >
                                Ingresa tu código de Verificación
                              </Typography>
                              <Stack direction="row" spacing={1} mb={1} mt={1}>
                                {otp.map((digit, index) => (
                                  <TextField
                                    key={index}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    inputRef={(el) => (inputRefs.current[index] = el)}
                                    inputProps={{
                                      maxLength: 1,
                                      style: {
                                        textAlign: "center",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                      },
                                    }}
                                    sx={{
                                      width: { xs: 50, sm: 50 },
                                      "& .MuiOutlinedInput-root": {
                                        width: 50,
                                        height: 40,
                                        borderRadius: "20px",
                                        "& fieldset": {
                                          border: "5px solid #00506E",
                                          borderRadius: "20px",
                                        },
                                        "&:hover fieldset": {
                                          border: "5px solid #00506E",
                                        },
                                        "&.Mui-focused fieldset": {
                                          border: "5px solid #00506E",
                                        },
                                      },
                                    }}
                                    autoFocus={index === 0}
                                  />
                                ))}
                              </Stack>
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Button
                                  sx={{
                                    color: "#fff",
                                    background: "#00506E",
                                    fontSize: "0.75rem",
                                    padding: "10px 20px",
                                    borderRadius: "30px",
                                    mt: 2,
                                    "&:hover": {
                                      background: "#0e749a",
                                    },
                                  }}
                                  variant="contained"
                                  size="small"
                                  onClick={(e: any) => {
                                    handleVerify(canje.id);
                                  }}
                                  disabled={otp.some((d) => !d)}
                                >
                                  Verificar
                                </Button>
                                <Button
                                  sx={{
                                    color: "#fff",
                                    background: "#bdcdd1",
                                    padding: "10px 20px",
                                    borderRadius: "30px",
                                    mt: 0,
                                    "&:hover": {
                                      background: "#a5bcc2",
                                    },
                                  }}
                                  variant="contained"
                                  endIcon={<Forward10Icon />}
                                  onClick={(e: any) => {
                                    setOtp(["", "", "", "", "", ""]);
                                    solicitarCodigoValidacion(canje);
                                  }}
                                >
                                  {procesandoCodigo ? (
                                    <>
                                      <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                      />
                                      Reenviando código...{" "}
                                    </>
                                  ) : (
                                    intl.formatMessage({ id: "reenviar_codigo_verificacion" })
                                  )}
                                </Button>
                              </Stack>
                            </Box>
                          ) : null}
                        </Box>
                      </Grid>
                    )}

                    <Grid item xs={12} md={12}>
                      <Divider
                        sx={{
                          my: 3,
                          borderStyle: "dotted",
                          borderColor: "#000",
                          opacity: 1,
                          mb: 0,
                        }}
                      />
                    </Grid>

                    {/* Información del Canje */}
                    {canje && (
                      <Paper elevation={0} sx={{ mt: 1, p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h4" gutterBottom sx={{ color: "#00506E" }}>
                            Datos de tu canje
                          </Typography>
                        </Box>
                        <Grid container spacing={1}>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                          >
                            <Typography
                              variant="caption"
                              fontWeight="bold"
                              fontSize="14px"
                              sx={{ color: "#000" }}
                            >
                              Folio Canje
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              fontSize="14px"
                              sx={{ color: "#00506E" }}
                            >
                              {canje.folio}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                          >
                            <Typography
                              variant="caption"
                              fontWeight="bold"
                              fontSize="14px"
                              sx={{ color: "#000" }}
                            >
                              Premio seleccionado
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              fontSize="14px"
                              sx={{ color: "#00506E" }}
                            >
                              {canje.nombre_premio}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                          >
                            <Typography
                              variant="caption"
                              fontWeight="bold"
                              fontSize="14px"
                              sx={{ color: "#000" }}
                            >
                              Dirección de entrega
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              fontSize="14px"
                              sx={{ color: "#00506E" }}
                            >
                              {direccion_completa}
                            </Typography>
                          </Grid>
                          {/* Información de la dirección de envío */}
                        </Grid>
                      </Paper>
                    )}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12} lg={12}>
                        <Box
                          sx={{
                            background: "#00506E",
                            padding: "20px 0",
                            borderRadius: "16px",
                          }}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          flexDirection="column"
                        >
                          <Typography variant="h5" sx={{ color: "#fff" }}>
                            Atención a Cliente
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#fff" }}>
                            Tienes dudas o comentarios, contáctanos:
                          </Typography>
                          <Typography variant="h6" sx={{ color: "#fff" }}>
                            atencion@puntotes.com.mx
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#fff" }}>
                            Atención de lunes a viernes de 9:00 a 7:00 pm horario CDMX
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12}>
                        <Typography variant="body2" sx={{ textAlign: "center", fontSize: "14px" }}>
                          © TODOS LOS DERECHOS RESERVADOS Controladora Mabe SA de CV Pase de las
                          palmas 100, Col. Lomas de Chapultepec, Ciudad de México Código Postal
                          11000
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Grid>
              </Card>
            </Grid>
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
    </Box>
  );
}

export default ValidarIdentidad;

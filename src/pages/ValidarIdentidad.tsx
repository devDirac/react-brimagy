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
import logo from "assets/images/profile_icon.png";
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

  return (
    <DashboardLayout withSidebar={false}>
      <MDBox py={0} mb={0}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={10} lg={9}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                {canje ? (
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <VerifiedIcon sx={{ fontSize: 60, color: green[500], mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                      VALIDACIÓN DE IDENTIDAD
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hola <b style={{ color: "#A5EB2F" }}>{canje.nombre_usuario}</b>, a
                      continuación se muestran los detalles de tu canje, da click en el botón para
                      enviarte un código y cólocalo en las casillas para verificar tu identidad
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <GppBadIcon sx={{ fontSize: 80, color: red[500], mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                      Canje no existente
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
                            color: "#2f2f2f",
                            background: "#3ec972",
                            fontSize: "0.75rem",
                            padding: "6px 8px",
                            mt: 0,
                            "&:hover": {
                              background: "#2fb85e",
                            },
                          }}
                          variant="contained"
                          endIcon={<HttpsIcon />}
                          //disabled={}
                          onClick={(e: any) => {
                            //setShowInput(true);
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
                            variant="caption"
                            color="text.secondary"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                          >
                            Ingresar código de validación
                          </Typography>
                          <Stack direction="row" spacing={1} mb={1}>
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
                                sx={{ width: { xs: 30, sm: 40 } }}
                                autoFocus={index === 0}
                              />
                            ))}
                          </Stack>
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Button
                              sx={{
                                color: "#2f2f2f",
                                background: "#3ec972",
                                fontSize: "0.75rem",
                                padding: "6px 8px",
                                mt: 2,
                                "&:hover": {
                                  background: "#2fb85e",
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
                                color: "#2f2f2f",
                                background: "#ffffbf",
                                fontSize: "0.75rem",
                                padding: "6px 8px",
                                mt: 0,
                                "&:hover": {
                                  background: "#f0f075",
                                },
                              }}
                              variant="contained"
                              endIcon={<Forward10Icon />}
                              //disabled={}
                              onClick={(e: any) => {
                                //setShowInput(true);
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
                            {/*<Button
                                  size="small"
                                  onClick={() => {
                                    setShowInput(false);
                                    setOtp(["", "", "", "", "", ""]);
                                  }}
                                >
                                  Cancelar
                                </Button>*/}
                          </Stack>
                        </Box>
                      ) : null}
                    </Box>
                  </Grid>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Información del Canje */}
                {canje && (
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
                        Datos de mi canje
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Typography variant="caption" color="text.secondary">
                          Folio
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {canje.folio}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Typography variant="caption" color="text.secondary">
                          Estado de validación
                        </Typography>
                        <Box>
                          <Chip
                            label={traducirEstadoValidacion(canje.estado_validacion?.toUpperCase())}
                            color={getEstadoColor(canje.estado_validacion)}
                            size="small"
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Typography variant="caption" color="text.secondary">
                          Estatus del canje
                        </Typography>
                        <Box>
                          <Chip
                            label={traducirEstadoCanje(canje.estado_canje?.toUpperCase())}
                            color={getEstadoCanjeColor(canje.estado_canje)}
                            size="small"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h5" color={"#eb2fa5"}>
                            Mis datos
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Cliente
                        </Typography>
                        <Typography variant="body2">{canje.nombre_usuario}</Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Correo
                        </Typography>
                        <Typography variant="body2">{canje.email}</Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Teléfono
                        </Typography>
                        <Typography variant="body2">{canje.phone}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h5" color={"#eb2fa5"}>
                            Datos del premio
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Premio
                        </Typography>
                        <Typography variant="body2">{canje.nombre_premio}</Typography>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Tamaño
                        </Typography>
                        <Typography variant="body2">{canje.size}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Color
                        </Typography>
                        <Stack>
                          <Tooltip title={canje.color}>
                            <Box sx={{ bgcolor: canje.color, width: 60, height: 20 }} />
                          </Tooltip>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Categoría
                        </Typography>
                        <Typography variant="body2">{canje.category}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          SKU
                        </Typography>
                        <Typography variant="body2">{canje.sku}</Typography>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          SKU
                        </Typography>
                        <Typography variant="body2">{canje.sku}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Costo
                        </Typography>
                        <Typography variant="body2">
                          {numericFormatter(canje.costo_premio + "", {
                            thousandSeparator: ",",
                            fixedDecimalScale: false,
                            prefix: "",
                          })}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Premios solicitados
                        </Typography>
                        <Typography variant="body2">{canje.number_of_awards}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Puntos Canjeados
                        </Typography>
                        <Typography variant="body2">
                          {numericFormatter(canje.puntos_canjeados + "", {
                            thousandSeparator: ",",
                            fixedDecimalScale: false,
                            prefix: "",
                          })}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h5" color={"#eb2fa5"}>
                            Dirección del envío
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Calle
                        </Typography>
                        <Typography variant="body2">{canje.calle}</Typography>
                      </Grid>

                      <Grid item xs={6} md={4}>
                        <Typography variant="caption" color="text.secondary">
                          Número exterior
                        </Typography>
                        <Typography variant="body2">{canje.numero_calle}</Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography variant="caption" color="text.secondary">
                          Número interior
                        </Typography>
                        <Typography variant="body2">{canje.numero_interior}</Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography variant="caption" color="text.secondary">
                          Colonia
                        </Typography>
                        <Typography variant="body2">{canje.colonia}</Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography variant="caption" color="text.secondary">
                          Municipio
                        </Typography>
                        <Typography variant="body2">{canje.municipio}</Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography variant="caption" color="text.secondary">
                          Código postal
                        </Typography>
                        <Typography variant="body2">{canje.codigo_postal}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h6" color={"#eb2fa5"}>
                            Entre calles
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Calle 1
                        </Typography>
                        <Typography variant="body2">{canje.between_1}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Calle 2
                        </Typography>
                        <Typography variant="body2">{canje.between_2}</Typography>
                      </Grid>

                      {/* Información de la dirección de envío */}
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

export default ValidarIdentidad;

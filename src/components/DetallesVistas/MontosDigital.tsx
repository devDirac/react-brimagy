import {
  Grid,
  Typography,
  Divider,
  Box,
  Chip,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useIntl } from "react-intl";
import ModalComponent from "components/Modal";
import { useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { numericFormatter } from "react-number-format";

import { useSelector } from "react-redux";
import { StoreType } from "../../types/genericTypes";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";

import { HexColorPicker } from "react-colorful";
import ClickAwayListener from "@mui/material/ClickAwayListener";

interface Monto {
  id: number;
  id_producto: number;
  id_monto_brimagy: number;
  monto: string;
  puntos: number;
  descripcion: string;
  status: string;
}

interface DetalleMontoProps {
  verMonto?: Monto[] | null;
  procesandoMonto: boolean;
  datosProducto: any;
  crearEditarMontoProducto: (datos: any) => Promise<void>;
  setEditarMonto: React.Dispatch<React.SetStateAction<any>>;
  handleisAlertOpenEditarMonto: () => void;
  desactivarMontoProducto: (datos: any) => Promise<void>;
  activarMontoProducto: (datos: any) => Promise<void>;
}

const MontosDigitalModal = ({
  verMonto,
  procesandoMonto,
  datosProducto,
  handleisAlertOpenEditarMonto,
  crearEditarMontoProducto,
  desactivarMontoProducto,
  activarMontoProducto,
  setEditarMonto,
}: DetalleMontoProps) => {
  if (!verMonto) return null;
  const intl = useIntl();

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const isSuperAdmin = tipoUsuario === 6;
  const isAdministracion = tipoUsuario === 5;
  const isInventario = tipoUsuario === 4;
  const isCompras = tipoUsuario === 3;
  const isAuditor = tipoUsuario === 2;
  const isInternauta = tipoUsuario === 1;

  const [monto, setMonto] = useState("");
  const [puntos, setPuntos] = useState<number>();
  const [descripcion, setDescripcion] = useState("");

  const estadosMap: { [key: string]: string } = {
    ACTIVE: "ACTIVADO",
    INACTIVE: "DESACTIVADO",
  };

  const traducirEstadoMonto = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosMap[estadoUpper] || estadoUpper;
  };

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={3}>
        {/* Información de la Monto */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Montos registrados
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" color="info" gutterBottom>
                  Registrar nuevo monto
                </Typography>
              </Grid>

              <Grid item xs={6} sm={6} sx={{ position: "relative" }}>
                <TextField
                  id="monto"
                  fullWidth
                  label={`${intl.formatMessage({ id: "input_monto" })} *`}
                  variant="standard"
                  name="monto"
                  value={monto}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMonto(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} sx={{ position: "relative" }}>
                <TextField
                  id="puntos"
                  fullWidth
                  label={`${intl.formatMessage({ id: "input_puntos" })} *`}
                  variant="standard"
                  name="puntos"
                  type="number"
                  value={puntos}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPuntos(Number(value));
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} sx={{ position: "relative" }}>
                <TextField
                  id="descripcion"
                  fullWidth
                  label={`${intl.formatMessage({ id: "input_descripcion" })} *`}
                  variant="standard"
                  name="descripcion"
                  value={descripcion}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDescripcion(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <Button
                  sx={{ color: "#fff", background: "#084d6e" }}
                  variant="contained"
                  endIcon={<AddBoxIcon />}
                  disabled={procesandoMonto}
                  onClick={(e: any) => {
                    const datos = {
                      id_producto_dirac: datosProducto?.id,
                      id_producto_brimagy: datosProducto?.id_producto_brimagy,
                      monto: monto,
                      puntos: puntos,
                      descripcion: descripcion,
                    };
                    crearEditarMontoProducto(datos);
                  }}
                >
                  {procesandoMonto ? (
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
                    intl.formatMessage({ id: "set_añadir_monto" })
                  )}
                </Button>
              </Grid>
            </Grid>
            <Divider sx={{ m: 2 }} />
            {verMonto.length > 0 ? (
              verMonto.map((m: any, key: number) => {
                return (
                  <Grid container spacing={2} key={key}>
                    <Grid item xs={6} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Monto
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={
                          m.status === "INACTIVE"
                            ? {
                                color: "#7a7a7a",
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                            : {}
                        }
                      >
                        {m?.monto}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Puntos
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={
                          m.status === "INACTIVE"
                            ? {
                                color: "#7a7a7a",
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                            : {}
                        }
                      >
                        {m?.puntos}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Descripción
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={
                          m.status === "INACTIVE"
                            ? {
                                color: "#7a7a7a",
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                            : {}
                        }
                      >
                        {m?.descripcion}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Estatus
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={
                          m.status === "INACTIVE"
                            ? {
                                color: "#7a7a7a",
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                            : {}
                        }
                      >
                        {traducirEstadoMonto(m?.status).toLocaleLowerCase()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Acciones
                      </Typography>
                      {m?.status === "ACTIVE" && (
                        <Tooltip title="Editar monto">
                          <IconButton
                            aria-label="ver"
                            size="small"
                            color="warning"
                            onClick={() => {
                              setEditarMonto(m);
                              handleisAlertOpenEditarMonto();
                            }}
                          >
                            <EditNoteIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {m?.status === "ACTIVE" ? (
                        <Tooltip title="Desactivar monto">
                          <IconButton
                            aria-label="ver"
                            size="small"
                            color="error"
                            onClick={() => {
                              const datos = {
                                id_monto: m?.id,
                                id_monto_brimagy: m?.id_monto_brimagy,
                              };
                              desactivarMontoProducto(datos);
                            }}
                          >
                            <DisabledByDefaultIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Activar monto">
                          <IconButton
                            aria-label="ver"
                            size="small"
                            color="success"
                            onClick={() => {
                              const datos = {
                                id_monto: m?.id,
                                id_monto_brimagy: m?.id_monto_brimagy,
                              };
                              activarMontoProducto(datos);
                            }}
                          >
                            <CheckCircleOutlineIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Grid>
                  </Grid>
                );
              })
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {intl.formatMessage({ id: "no_hay_montos_registrados" })}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default MontosDigitalModal;

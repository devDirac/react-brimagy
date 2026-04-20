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

interface Talla {
  id: number;
  id_producto: number;
  id_talla_brimagy: number;
  talla: string;
  status: string;
}

interface DetalleTallaProps {
  verTalla?: Talla[] | null;
  procesandoTalla: boolean;
  datosProducto: any;
  crearEditarTallaProducto: (datos: any) => Promise<void>;
  setEditarTalla: React.Dispatch<React.SetStateAction<any>>;
  handleisAlertOpenEditarTalla: () => void;
  desactivarTallaProducto: (datos: any) => Promise<void>;
  activarTallaProducto: (datos: any) => Promise<void>;
}

const TallasProductoModal = ({
  verTalla,
  procesandoTalla,
  datosProducto,
  handleisAlertOpenEditarTalla,
  crearEditarTallaProducto,
  desactivarTallaProducto,
  activarTallaProducto,
  setEditarTalla,
}: DetalleTallaProps) => {
  if (!verTalla) return null;
  const intl = useIntl();

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const isSuperAdmin = tipoUsuario === 6;
  const isAdministracion = tipoUsuario === 5;
  const isInventario = tipoUsuario === 4;
  const isCompras = tipoUsuario === 3;
  const isAuditor = tipoUsuario === 2;
  const isInternauta = tipoUsuario === 1;

  const getEstadoTalla = (estado_talla: string) => {
    switch (estado_talla?.toLowerCase()) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "error";
      default:
        return "default";
    }
  };

  const [talla, setTalla] = useState("");

  const estadosMap: { [key: string]: string } = {
    ACTIVE: "ACTIVADO",
    INACTIVE: "DESACTIVADO",
  };

  const traducirEstadoTalla = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosMap[estadoUpper] || estadoUpper;
  };

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={3}>
        {/* Información de la talla */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Tallas registradas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" color="info" gutterBottom>
                  Registrar nueva talla
                </Typography>
              </Grid>

              <Grid item xs={6} sm={6} sx={{ position: "relative" }}>
                <TextField
                  id="talla"
                  fullWidth
                  label={intl.formatMessage({ id: "input_talla" })}
                  variant="standard"
                  name="talla"
                  value={talla}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTalla(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <Button
                  sx={{ color: "#fff", background: "#084d6e" }}
                  variant="contained"
                  endIcon={<AddBoxIcon />}
                  disabled={procesandoTalla}
                  onClick={(e: any) => {
                    const datos = {
                      id_producto_dirac: datosProducto?.id,
                      id_producto_brimagy: datosProducto?.id_producto_brimagy,
                      talla: talla,
                    };
                    crearEditarTallaProducto(datos);
                  }}
                >
                  {procesandoTalla ? (
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
                    intl.formatMessage({ id: "set_añadir_talla" })
                  )}
                </Button>
              </Grid>
            </Grid>
            <Divider sx={{ m: 2 }} />
            {verTalla.length > 0 ? (
              verTalla.map((c: any, key: number) => {
                return (
                  <Grid container spacing={2} key={key}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Talla
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={
                          c.status === "INACTIVE"
                            ? {
                                color: "#7a7a7a",
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                            : {}
                        }
                      >
                        {c?.talla}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Estatus
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={
                          c.status === "INACTIVE"
                            ? {
                                color: "#7a7a7a",
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                            : {}
                        }
                      >
                        {traducirEstadoTalla(c?.status).toLocaleLowerCase()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Acciones
                      </Typography>
                      {c?.status === "ACTIVE" && (
                        <Tooltip title="Editar talla">
                          <IconButton
                            aria-label="ver"
                            size="small"
                            color="warning"
                            onClick={() => {
                              setEditarTalla(c);
                              handleisAlertOpenEditarTalla();
                            }}
                          >
                            <EditNoteIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {c?.status === "ACTIVE" ? (
                        <Tooltip title="Desactivar talla">
                          <IconButton
                            aria-label="ver"
                            size="small"
                            color="error"
                            onClick={() => {
                              const datos = {
                                id_talla: c?.id,
                                id_talla_brimagy: c?.id_talla_brimagy,
                              };
                              desactivarTallaProducto(datos);
                            }}
                          >
                            <DisabledByDefaultIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Activar talla">
                          <IconButton
                            aria-label="ver"
                            size="small"
                            color="success"
                            onClick={() => {
                              const datos = {
                                id_talla: c?.id,
                                id_talla_brimagy: c?.id_talla_brimagy,
                              };
                              activarTallaProducto(datos);
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
                  {intl.formatMessage({ id: "no_hay_tallas_registradas" })}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default TallasProductoModal;

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

interface Color {
  id: number;
  id_producto: number;
  color: string;
  status: string;
}

interface DetalleColorProps {
  verColor?: Color[] | null;
  procesandoColor: boolean;
  datosProducto: any;
  crearEditarColorProducto: (datos: any) => Promise<void>;
  setEditarColor: React.Dispatch<React.SetStateAction<any>>;
  handleisAlertOpenEditarColor: () => void;
  desactivarColorProducto: (datos: any) => Promise<void>;
  activarColorProducto: (datos: any) => Promise<void>;
}

const ColoresProductoModal = ({
  verColor,
  procesandoColor,
  datosProducto,
  handleisAlertOpenEditarColor,
  crearEditarColorProducto,
  desactivarColorProducto,
  activarColorProducto,
  setEditarColor,
}: DetalleColorProps) => {
  if (!verColor) return null;
  const intl = useIntl();

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const isSuperAdmin = tipoUsuario === 6;
  const isAdministracion = tipoUsuario === 5;
  const isInventario = tipoUsuario === 4;
  const isCompras = tipoUsuario === 3;
  const isAuditor = tipoUsuario === 2;
  const isInternauta = tipoUsuario === 1;

  const getEstadoColor = (estado_color: string) => {
    switch (estado_color?.toLowerCase()) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "error";
      default:
        return "default";
    }
  };

  const colorNameToHex = (color: string): string => {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return color;
    ctx.fillStyle = color;
    const computed = ctx.fillStyle;
    return computed.startsWith("#") ? computed : color;
  };

  const esColorValido = (color: string): boolean => {
    const s = new Option().style;
    s.color = color;
    return s.color !== "";
  };

  const [color, setColor] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const colorHex = esColorValido(color) ? colorNameToHex(color) : "#000000";

  const estadosMap: { [key: string]: string } = {
    ACTIVE: "ACTIVADO",
    INACTIVE: "DESACTIVADO",
  };

  const traducirEstadoColor = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosMap[estadoUpper] || estadoUpper;
  };

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={3}>
        {/* Información del Color */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Colores registrados
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" color="info" gutterBottom>
                  Registrar nuevo color
                </Typography>
              </Grid>

              <Grid item xs={6} sm={6} sx={{ position: "relative" }}>
                <TextField
                  id="color"
                  fullWidth
                  label={intl.formatMessage({ id: "input_color" })}
                  variant="standard"
                  name="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  onClick={(e) => setAnchorEl((prev: any) => (prev ? null : e.currentTarget))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "4px",
                            backgroundColor: esColorValido(color) ? color : "transparent",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                {Boolean(anchorEl) && (
                  <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 99999,
                        mt: 1,
                        p: 2,
                        backgroundColor: "#ffffff !important",
                        opacity: 1,
                        borderRadius: 2,
                        boxShadow: 6,
                        display: "inline-block",
                      }}
                    >
                      <HexColorPicker color={colorHex} onChange={(hex) => setColor(hex)} />
                      <Box
                        sx={{
                          mt: 1,
                          textAlign: "center",
                          fontSize: 12,
                          color: "text.secondary",
                        }}
                      >
                        {colorHex}
                      </Box>
                      <Button
                        variant="contained"
                        component="label"
                        endIcon={<CloseIcon />}
                        onClick={() => setAnchorEl(null)}
                        sx={{
                          background: "#084d6e",
                          color: "#fff",
                        }}
                      >
                        Cerrar
                      </Button>
                    </Box>
                  </ClickAwayListener>
                )}
              </Grid>
              <Grid item xs={6} md={6}>
                <Button
                  sx={{ color: "#fff", background: "#084d6e" }}
                  variant="contained"
                  endIcon={<AddBoxIcon />}
                  disabled={procesandoColor}
                  onClick={(e: any) => {
                    const datos = {
                      id_producto_dirac: datosProducto?.id,
                      id_producto_brimagy: datosProducto?.id_producto_brimagy,
                      color: color,
                    };
                    crearEditarColorProducto(datos);
                  }}
                >
                  {procesandoColor ? (
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
                    intl.formatMessage({ id: "set_añadir_color" })
                  )}
                </Button>
              </Grid>
            </Grid>
            <Divider sx={{ m: 2 }} />
            {verColor.length > 0 ? (
              verColor.map((c: any, key: number) => {
                return (
                  <Grid container spacing={2} key={key}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Color
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          ...(c.status === "INACTIVE"
                            ? {
                                color: "#7a7a7a",
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                            : {}),
                        }}
                      >
                        {c?.color}{" "}
                        {c.status === "ACTIVE" && (
                          <Box sx={{ bgcolor: c?.color, width: 60, height: 20 }} />
                        )}
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
                        {traducirEstadoColor(c?.status).toLocaleLowerCase()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Acciones
                      </Typography>
                      {c?.status === "ACTIVE" && (
                        <Tooltip title="Editar color">
                          <IconButton
                            aria-label="ver"
                            size="small"
                            color="warning"
                            onClick={() => {
                              setEditarColor(c);
                              handleisAlertOpenEditarColor();
                            }}
                          >
                            <EditNoteIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {c?.status === "ACTIVE" ? (
                        <Tooltip title="Desactivar color">
                          <IconButton
                            aria-label="ver"
                            size="small"
                            color="error"
                            onClick={() => {
                              const datos = {
                                id_color: c?.id,
                                id_color_brimagy: c?.id_color_brimagy,
                              };
                              desactivarColorProducto(datos);
                            }}
                          >
                            <DisabledByDefaultIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Activar color">
                          <IconButton
                            aria-label="ver"
                            size="small"
                            color="success"
                            onClick={() => {
                              const datos = {
                                id_color: c?.id,
                                id_color_brimagy: c?.id_color_brimagy,
                              };
                              activarColorProducto(datos);
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
                  {intl.formatMessage({ id: "no_hay_colores_registrados" })}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ColoresProductoModal;

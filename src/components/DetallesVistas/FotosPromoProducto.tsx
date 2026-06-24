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
import { MuiFileInput } from "mui-file-input";
import env from "react-dotenv";

interface FotosPromo {
  id: number;
  id_producto: number;
  id_talla_brimagy: number;
  talla: string;
  status: string;
}

interface DetalleFotosPromoProps {
  verFotosPromo?: FotosPromo[] | null;
  procesandoFotosPromoProducto: boolean;
  datosProducto: any;
  subirFotosPromoProducto: (data: FormData) => Promise<void>;
  fotosPromoProductoFiles: File[];
  setFotosPromoProductoFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleOpenVistaFotosPromoProducto: (fotos_producto: any) => void;
  desactivarFotosPromoProducto: (datos: any) => Promise<void>;
  activarFotosPromoProducto: (datos: any) => Promise<void>;
}

const FotosPromoProductoModal = ({
  verFotosPromo,
  procesandoFotosPromoProducto,
  datosProducto,
  fotosPromoProductoFiles,
  subirFotosPromoProducto,
  setFotosPromoProductoFiles,
  handleOpenVistaFotosPromoProducto,
  desactivarFotosPromoProducto,
  activarFotosPromoProducto,
}: DetalleFotosPromoProps) => {
  if (!verFotosPromo) return null;
  const intl = useIntl();

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const isSuperAdmin = tipoUsuario === 6;
  const isAdministracion = tipoUsuario === 5;
  const isInventario = tipoUsuario === 4;
  const isCompras = tipoUsuario === 3;
  const isAuditor = tipoUsuario === 2;
  const isInternauta = tipoUsuario === 1;

  const handleChangeFotosPromoProducto = (newFiles: File[] | null) => {
    setFotosPromoProductoFiles(newFiles || []);
  };

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
        {/* Información de las fotos */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Fotos de promo registradas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" color="info" gutterBottom>
                  Registrar nueva foto
                </Typography>
              </Grid>

              <Grid item xs={12} sm={8}>
                <MuiFileInput
                  value={fotosPromoProductoFiles}
                  onChange={handleChangeFotosPromoProducto}
                  label="Selecciona fotos"
                  placeholder="Selecciona las fotos a subir"
                  inputProps={{
                    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
                    multiple: true,
                  }}
                  multiple
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  sx={{
                    color: "#000",
                    background: "#8ded42",
                    "&:hover": {
                      color: "#000",
                      background: "#62b324",
                    },
                  }}
                  disabled={fotosPromoProductoFiles.length === 0 || procesandoFotosPromoProducto}
                  onClick={(e: any) => {
                    const formData = new FormData();
                    formData.append("id_producto", datosProducto?.id);
                    formData.append("id_producto_brimagy", datosProducto?.id_producto_brimagy);
                    fotosPromoProductoFiles.forEach((file) => {
                      formData.append("fotos_promo_producto[]", file);
                    });

                    subirFotosPromoProducto(formData);
                    setFotosPromoProductoFiles([]);
                  }}
                >
                  {procesandoFotosPromoProducto ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Añadiendo...{" "}
                    </>
                  ) : (
                    intl.formatMessage({ id: "set_general_fotos_producto" })
                  )}
                </Button>
              </Grid>
            </Grid>
            <Divider sx={{ m: 2 }} />
            <Grid container spacing={2}>
              {verFotosPromo.length > 0 ? (
                verFotosPromo.map((f: any, key: number) => {
                  return (
                    <Grid item xs={6} sm={3} key={key}>
                      <Card
                        sx={{
                          width: 150,
                          cursor: "pointer",
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: 6,
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 1,
                            textAlign: "center",
                          }}
                          onClick={() => {
                            handleOpenVistaFotosPromoProducto(f);
                          }}
                        >
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
                              alt={f?.nombre_original}
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 4,
                                ...(f.status === "INACTIVE" && {
                                  opacity: 0.4,
                                  filter: "grayscale(100%)",
                                }),
                              }}
                            />

                            {f.status === "INACTIVE" && (
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
                            {f?.nombre_original}
                          </MDTypography>
                        </CardContent>
                        {f?.status === "ACTIVE" ? (
                          <Tooltip title="Desactivar foto">
                            <IconButton
                              aria-label="ver"
                              size="small"
                              color="error"
                              onClick={() => {
                                const datos = {
                                  id_foto_promo: f?.id,
                                  id_foto_promo_brimagy: f?.id_foto_promo_brimagy,
                                };
                                desactivarFotosPromoProducto(datos);
                              }}
                            >
                              <DisabledByDefaultIcon fontSize="medium" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Activar foto">
                            <IconButton
                              aria-label="ver"
                              size="small"
                              color="success"
                              onClick={() => {
                                const datos = {
                                  id_foto_promo: f?.id,
                                  id_foto_promo_brimagy: f?.id_foto_promo_brimagy,
                                };
                                console.log(datos);
                                activarFotosPromoProducto(datos);
                              }}
                            >
                              <CheckCircleOutlineIcon fontSize="medium" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Card>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12} sm={12}>
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
                      {intl.formatMessage({ id: "no_hay_fotos_promo_registradas" })}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default FotosPromoProductoModal;

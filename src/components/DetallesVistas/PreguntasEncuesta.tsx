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

interface Pregunta {
  id: number;
  pregunta: string;
  tipo_encuesta: string;
  tipo_pregunta: string;
  estatus: string;
}

interface DetalleCanjeProps {
  verPregunta?: Pregunta[] | null;
  editarPreguntaEncuesta: (datos: any) => Promise<void>;
  setEditarPregunta: React.Dispatch<React.SetStateAction<any>>;
  handleisAlertOpenEditarPregunta: () => void;
  desactivarPreguntaEncuesta: (datos: any) => Promise<void>;
  activarPreguntaEncuesta: (datos: any) => Promise<void>;
}

const PreguntasEncuestaModal = ({
  verPregunta,
  handleisAlertOpenEditarPregunta,
  editarPreguntaEncuesta,
  desactivarPreguntaEncuesta,
  activarPreguntaEncuesta,
  setEditarPregunta,
}: DetalleCanjeProps) => {
  if (!verPregunta) return null;
  const intl = useIntl();

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const isSuperAdmin = tipoUsuario === 6;
  const isAdministracion = tipoUsuario === 5;
  const isInventario = tipoUsuario === 4;
  const isCompras = tipoUsuario === 3;
  const isAuditor = tipoUsuario === 2;
  const isInternauta = tipoUsuario === 1;

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

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              ENCUESTA DE {traducirTipoEncuesta(verPregunta?.[0].tipo_encuesta).toUpperCase()}
            </Typography>
          </Box>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Información del Cliente */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Preguntas registradas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {verPregunta.map((pregunta: any, key: number) => {
              return (
                <Grid container spacing={2} key={key}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Pregunta
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={
                        pregunta.estatus === "desactivada"
                          ? {
                              color: "#7a7a7a",
                              textDecoration: "line-through",
                              textDecorationColor: "red",
                            }
                          : {}
                      }
                    >
                      {pregunta?.pregunta}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Tipo de pregunta
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={
                        pregunta.estatus === "desactivada"
                          ? {
                              color: "#7a7a7a",
                              textDecoration: "line-through",
                              textDecorationColor: "red",
                            }
                          : {}
                      }
                    >
                      {traducirTipoPregunta(pregunta?.tipo_pregunta).toLocaleLowerCase()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Acciones
                    </Typography>
                    {pregunta.estatus === "activa" && (
                      <Tooltip title="Editar pregunta">
                        <IconButton
                          aria-label="ver"
                          size="small"
                          color="warning"
                          onClick={() => {
                            setEditarPregunta(pregunta);
                            handleisAlertOpenEditarPregunta();
                          }}
                        >
                          <EditNoteIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {pregunta?.estatus === "activa" ? (
                      <Tooltip title="Desactivar pregunta">
                        <IconButton
                          aria-label="ver"
                          size="small"
                          color="error"
                          onClick={() => {
                            const datos = {
                              id_pregunta: pregunta?.id,
                            };
                            desactivarPreguntaEncuesta(datos);
                          }}
                        >
                          <DisabledByDefaultIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Activar pregunta">
                        <IconButton
                          aria-label="ver"
                          size="small"
                          color="success"
                          onClick={() => {
                            const datos = {
                              id_pregunta: pregunta?.id,
                            };
                            activarPreguntaEncuesta(datos);
                          }}
                        >
                          <CheckCircleOutlineIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              );
            })}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default PreguntasEncuestaModal;

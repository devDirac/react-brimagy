import { Grid, Typography, Divider, Box, Chip, Paper, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useIntl } from "react-intl";
import ModalComponent from "components/Modal";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { numericFormatter } from "react-number-format";

import { useSelector } from "react-redux";
import { StoreType } from "../../types/genericTypes";
import PDFViewerCanje from "components/PDFViews/PDFViewerCanje";
import { IconBrandAuth0, IconIdBadge2 } from "@tabler/icons-react";
import { ProductosCanje } from "./ProductosCanje";
import { Canje } from "../../types/canjeTypes";
import dayjs from "dayjs";
import "dayjs/locale/es";

interface DetalleCanjeProps {
  verCanje?: Canje | null;
  isPDFViewerOpen: boolean;
  handleClosePDFViewer: () => void;
  handleOpenPDFViewer: () => void;
  validarIdentidadSinProveedor: (data: any) => Promise<void>;
  validarIdentidad: (data: any) => Promise<void>;
  procesandoIdentidad: boolean;
  procesandoIdentidadDirecto: boolean;
}

const DetallesCanjeModal = ({
  isPDFViewerOpen,
  handleClosePDFViewer,
  handleOpenPDFViewer,
  validarIdentidadSinProveedor,
  validarIdentidad,
  verCanje,
  procesandoIdentidad,
  procesandoIdentidadDirecto
}: DetalleCanjeProps) => {
  if (!verCanje) return null;
  const intl = useIntl();

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");

  const getEstadoColorCanje = (estado_canje: string) => {
    if (!estado_canje) return "default";
    switch (estado_canje.toLowerCase()) {
      case "inactive":
        return "error";
      case "active":
        return "success";
      default:
        return "default";
    }
  };
  const getEstadoColorValidacion = (estado_validacion?: string | null) => {
    if (!estado_validacion) return "default";
    switch (estado_validacion.toLowerCase()) {
      case "notificacion_enviada":
        return "warning";
      case "solicitud_enviada":
        return "error";
      case "identidad_validada":
        return "success";
      case "validacion_parcial":
        return "warning"
      default:
        return "default";
    }
  };

  const estadosCanjeMap: { [key: string]: string } = {
    ACTIVE: "ACTIVO",
    INACTIVE: "INACTIVO",
  };

  const estadosValidacionMap: { [key: string]: string } = {
    NOTIFICACION_ENVIADA: "NOTIFICACIÓN ENVIADA",
    SOLICITUD_ENVIADA: "SOLICITUD ENVIADA",
    IDENTIDAD_VALIDADA: "IDENTIDAD VALIDADA",
    VALIDACION_PARCIAL: "VALIDACIÓN PARCIAL"
  };

  // Función helper para traducir estados
  const traducirEstadoCanje = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosCanjeMap[estadoUpper] || estadoUpper;
  };

  const traducirEstadoValidacion = (estado?: string | null): string => {
    if (!estado) return "SIN VALIDAR";
    const estadoUpper = estado.toUpperCase();
    return estadosValidacionMap[estadoUpper] || estadoUpper;
  };

  const formatearFecha = (fecha?: string | null) =>
    fecha ? dayjs(fecha).locale("es").format("DD [de] MMMM [de] YYYY, HH:mm") : "Sin fecha";

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Detalles del canje con folio #{verCanje.folio}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center" gap={2}>
          <Button
            sx={{ color: "#fff", background: "#084d6e", fontSize: "0.75rem", padding: "6px 8px" }}
            variant="contained"
            endIcon={<AddIcon />}
            disabled={false}
            onClick={(e) => {
              handleOpenPDFViewer();
            }}
          >
            {intl.formatMessage({ id: "generar_pdf_input" })}
          </Button>
          <Button
            sx={{
              color: "#fff",
              background: "#2a9954",
              fontSize: "0.75rem",
              padding: "6px 8px",
              "&:hover": {
                background: "#19753b"
              },
              "&:focus": {
                background: "#19753b"
              }
            }}
            variant="contained"
            startIcon={<IconBrandAuth0 stroke={2} />}
            disabled={
              verCanje.estado_canje === "INACTIVE" ||
              verCanje.estado_validacion === "identidad_validada"
            }
            onClick={(e: any) => {
              validarIdentidadSinProveedor({ plataforma: plataforma, ...verCanje })
            }}
          >
            {procesandoIdentidadDirecto ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Validando...{" "}
              </>
            ) : intl.formatMessage({ id: "validar_identidad_directa" })}
          </Button>
          <Button
            sx={{
              color: "#000",
              background: "#ffc800",
              fontSize: "0.75rem",
              padding: "6px 8px",
              "&:hover": {
                background: "#cfa300"
              },
              "&:focus": {
                background: "#cfa300"
              }
            }}
            variant="contained"
            startIcon={<IconIdBadge2 stroke={2} />}
            disabled={
              verCanje.estado_canje === "INACTIVE" ||
              verCanje.estado_validacion === "identidad_validada"
            }
            onClick={(e: any) => {
              validarIdentidad({ plataforma: plataforma, ...verCanje });
            }}
          >
            {procesandoIdentidad ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Enviando validación...{" "}
              </>
            ) : intl.formatMessage({ id: "validar_identidad_input" })}
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="body2" color="text.secondary">
            Fecha del canje
          </Typography>
          <Typography variant="body2" fontWeight="medium" sx={{ mt: 0.5, fontSize: 14 }}>
            {formatearFecha(verCanje.creacion_canje)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" color="text.secondary">
            Estatus del Canje
          </Typography>
          <Chip
            label={traducirEstadoCanje(verCanje.estado_canje?.toUpperCase())}
            color={getEstadoColorCanje(verCanje.estado_canje)}
            sx={{ fontWeight: "bold" }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" color="text.secondary">
            Estatus de Validación
          </Typography>
          <Chip
            label={traducirEstadoValidacion(verCanje.estado_validacion?.toUpperCase())}
            color={getEstadoColorValidacion(verCanje.estado_validacion)}
            sx={{ fontWeight: "bold" }}
          />
        </Grid>

        {/* Información del Cliente */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Información del Cliente
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" color="text.secondary">
                  Nombre
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.nombre_usuario}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Correo
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Teléfono
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.phone}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Información del premio canjeado */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Productos del canje ({verCanje.productos.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ProductosCanje productos={verCanje.productos} porPagina={3} />
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" fontWeight="medium">
              Total: {numericFormatter(String(verCanje.total_puntos), { thousandSeparator: "," })} puntos
            </Typography>
          </Paper>
        </Grid>

        {/* Información de la dirección de envío */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Dirección del envío
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" color="text.secondary">
                  Calle
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.calle}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Número exterior
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.numero_calle}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Número interior
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.numero_interior}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Colonia
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.colonia}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Municipio
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.municipio}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Código postal
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.codigo_postal}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" color="primary" gutterBottom>
              Entre calles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2} p={2}>
              <Grid item xs={12} md={5}>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.between_1}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" fontWeight="medium">
                  y
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.between_2}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography variant="body2" color="text.secondary">
                Referencia adicional
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {verCanje.referencia_adicional}
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      {/* Visor de PDF */}
      <PDFViewerCanje open={isPDFViewerOpen} onClose={handleClosePDFViewer} canje={verCanje} />
    </Box>
  );
};
export default DetallesCanjeModal;

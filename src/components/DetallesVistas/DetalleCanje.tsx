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

interface Canje {
  id: number;
  folio: string;
  nombre_usuario: string;
  email: string;
  phone: number;
  number_of_awards: string;
  size: string;
  color: string;
  category: string;
  puntos_canjeados: string;
  nombre_premio: string;
  costo_premio: string;
  sku: string;
  calle: string;
  numero_calle: string;
  colonia: string;
  codigo_postal: number;
  municipio: string;
  numero_interior: string;
  between_1: string;
  between_2: string;
  referencia_adicional: string;
  creacion_canje: string;
  estado_canje: string;
  estado_validacion: string;
}

interface DetalleCanjeProps {
  verCanje?: Canje | null;
  isPDFViewerOpen: boolean;
  handleClosePDFViewer: () => void;
  handleOpenPDFViewer: () => void;
  validarIdentidad: (data: any) => Promise<void>;
  procesandoIdentidad: boolean;
}

const DetallesCanjeModal = ({
  isPDFViewerOpen,
  handleClosePDFViewer,
  handleOpenPDFViewer,
  validarIdentidad,
  verCanje,
  procesandoIdentidad,
}: DetalleCanjeProps) => {
  if (!verCanje) return null;
  const intl = useIntl();

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const isSuperAdmin = tipoUsuario === 6;
  const isAdministracion = tipoUsuario === 5;
  const isInventario = tipoUsuario === 4;
  const isCompras = tipoUsuario === 3;
  const isAuditor = tipoUsuario === 2;
  const isInternauta = tipoUsuario === 1;

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
  const getEstadoColorValidacion = (estado_validacion: string) => {
    if (!estado_validacion) return "default";
    switch (estado_validacion.toLowerCase()) {
      case "notificacion_enviada":
        return "warning";
      case "solicitud_enviada":
        return "error";
      case "identidad_validada":
        return "success";
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
            sx={{ color: "#fff", background: "#3ec972", fontSize: "0.75rem", padding: "6px 8px" }}
            variant="contained"
            endIcon={<AddIcon />}
            disabled={
              isInventario ||
              isCompras ||
              isAuditor ||
              isInternauta ||
              verCanje.estado_canje === "INACTIVE"
            }
            onClick={(e: any) => {
              validarIdentidad(verCanje);
            }}
          >
            {procesandoIdentidad ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Enviando validación...{" "}
              </>
            ) : (
              intl.formatMessage({ id: "validar_identidad_input" })
            )}
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Estatus del Canje
          </Typography>
          <Chip
            label={traducirEstadoCanje(verCanje.estado_canje?.toUpperCase())}
            color={getEstadoColorCanje(verCanje.estado_canje)}
            sx={{ fontWeight: "bold" }}
          />
        </Grid>
        <Grid item xs={6}>
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
              Información del Premio
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" color="text.secondary">
                  Nombre del premio
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.nombre_premio}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Tamaño
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.size}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Color
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.color}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Categoría
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.category}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" color="text.secondary">
                  SKU
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.sku}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Costo
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verCanje.costo_premio + "", {
                    thousandSeparator: ",",
                    fixedDecimalScale: false,
                    prefix: "",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Premios solicitados
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje.number_of_awards}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Puntos canjeados
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verCanje.puntos_canjeados + "", {
                    thousandSeparator: ",",
                    fixedDecimalScale: false,
                    prefix: "",
                  })}
                </Typography>
              </Grid>
            </Grid>
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

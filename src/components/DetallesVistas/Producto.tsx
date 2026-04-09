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
import moment from "moment";

interface Producto {
  id: number;
  nombre_producto: string;
  descripcion: string;
  marca: string;
  sku: string;
  color: string;
  talla: string;
  proveedor: string;
  catalogo: string;
  fee_brimagy: string;
  fecha_creacion: string;
  tipo_producto: string;
  nombre_plataforma: string;
  costo_sin_iva: number;
  costo_con_iva: number;
  costo_puntos_sin_iva: number;
  costo_puntos_con_iva: number;
  subtotal: number;
  envio_base: number;
  costo_caja: number;
  envio_extra: number;
  total_envio: number;
  total: number;
  puntos: number;
  factor: number;
}

interface DetalleProductoProps {
  verProducto?: Producto | null;
}

const DetallesProductoModal = ({ verProducto }: DetalleProductoProps) => {
  if (!verProducto) return null;
  const intl = useIntl();

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const isSuperAdmin = tipoUsuario === 6;
  const isAdministracion = tipoUsuario === 5;
  const isInventario = tipoUsuario === 4;
  const isCompras = tipoUsuario === 3;
  const isAuditor = tipoUsuario === 2;
  const isInternauta = tipoUsuario === 1;

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={3}>
        {/* Información del Cliente */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Información del Producto
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" color="text.secondary">
                  Nombre del producto
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.nombre_producto}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Descripción
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.descripcion}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Catálogo
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.catalogo ?? "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Marca
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.marca}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  SKU
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.sku}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Color
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.color ?? "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Talla
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.talla ?? "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Proveedor
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.proveedor ?? "Sin proveedor"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Tipo de producto
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.tipo_producto ?? "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Plataforma
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.nombre_plataforma ?? "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de creación
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {moment(verProducto.fecha_creacion).format("DD-MM-YYYY")}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Información de costos del producto */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Información de Costos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Costo proveedor sin IVA
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.costo_sin_iva + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: false,
                    prefix: "",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Costo proveedor con IVA
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.costo_con_iva + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: false,
                    prefix: "",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Costo puntos sin IVA
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.costo_puntos_sin_iva + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: false,
                    prefix: "",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Costo puntos con IVA
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.costo_puntos_con_iva + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: false,
                    prefix: "",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Fee Brimagy
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.fee_brimagy + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: true,
                    suffix: "%",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.subtotal + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: true,
                    prefix: "$",
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Información de costos del envio */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Información de Costos de Envíos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Envio base
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.envio_base + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: true,
                    prefix: "$",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Costo caja
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.costo_caja + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: true,
                    prefix: "$",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Envio extra
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.envio_extra + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: true,
                    prefix: "$",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Total envío
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.total_envio + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: true,
                    prefix: "$",
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Totales del producto */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Totales
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.total + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: true,
                    prefix: "$",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={4} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Puntos
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.puntos + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: false,
                    prefix: "",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={4} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Factor
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {numericFormatter(verProducto.factor + "", {
                    thousandSeparator: ",",
                    decimalScale: 2,
                    fixedDecimalScale: false,
                    prefix: "",
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DetallesProductoModal;

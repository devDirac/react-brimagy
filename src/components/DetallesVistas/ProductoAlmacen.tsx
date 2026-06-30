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
  TablePagination,
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

interface ProductoAlmacen {
  id_producto_almacen: number;
  id_proveedor: number;
  nombre_proveedor: string;
  nombre_producto_nuevo: string;
  marca_nuevo: string;
  sku_nuevo: string;
  precio_compra: number;
  cantidad_almacen: number;
  comentarios: string | null;
  imei: string;
  no_serie: string;
}

interface DetalleAlmacen {
  id_producto_almacen: number;
  id_canje: number;
  id_usuario: number;
  nombre_proveedor: string;
  nombre_usuario: string;
  primer_apellido: string;
  segundo_apellido: string;
  id_producto: number;
  nombre_producto: string;
  marca: string;
  imei: string;
  no_serie: string;
  sku: string;
  costo_sin_iva: number;
  id_orden_compra: number;
  no_orden: string;
  cantidad_producto: number;
  estatus: string;
  fecha: string;
  fecha_pago: string | null;
  cantidad_almacen: number;
  evidencias: any | null;
  comentarios: string | null;
  guia: string | null;
  productos: ProductoAlmacen[];
}

interface DetalleCanjeProps {
  verProducto?: DetalleAlmacen | null;
  addProductoAlmacen: (datos: any) => Promise<void>;
  enviarProductoAlmacen: (datos: any) => Promise<void>;
  confirmarRecepcionProductoAlmacen: (datos: any) => Promise<void>;
  procesandoEnvioProducto: boolean;
  procesandoRecepcionProducto: boolean;
  procesandoRecibirProducto: boolean;
  procesandoGuiaProducto: boolean;
  handleisAlertOpenNuevoPrecio: () => void;
  handleisAlertOpenCantidad: () => void;
  handleisAlertOpenEnviarEncuesta: () => void;
  handleisAlertOpenGuia: () => void;
  handleOpenEvidencia: () => void;
  handleisAlertOpenProductosTecnologicos: () => void;
  handleOpenVistaEvidencia: (evidencia: any) => void;
  setDatosEncuestaEnviar: React.Dispatch<React.SetStateAction<any>>;
  setProductoSeleccionado: React.Dispatch<React.SetStateAction<any>>;
}

const ProductoAlmacenModal = ({
  addProductoAlmacen,
  enviarProductoAlmacen,
  confirmarRecepcionProductoAlmacen,
  handleisAlertOpenNuevoPrecio,
  handleisAlertOpenCantidad,
  handleisAlertOpenEnviarEncuesta,
  handleisAlertOpenGuia,
  handleOpenVistaEvidencia,
  handleOpenEvidencia,
  handleisAlertOpenProductosTecnologicos,
  setDatosEncuestaEnviar,
  setProductoSeleccionado,
  verProducto,
  procesandoGuiaProducto,
  procesandoRecibirProducto,
  procesandoEnvioProducto,
  procesandoRecepcionProducto,
}: DetalleCanjeProps) => {
  if (!verProducto) return null;
  const intl = useIntl();

  /*const ahorroProducto =
    verProducto.precio_compra === null ? 0 : verProducto.costo_sin_iva - verProducto.precio_compra;
  const porcentajeAhorro =
    verProducto.costo_sin_iva > 0 ? (ahorroProducto / verProducto.costo_sin_iva) * 100 : 0;
  const esPositivoAhorro = ahorroProducto > 0;
  const esNegativoAhorro = ahorroProducto < 0;*/

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const isSuperAdmin = tipoUsuario === 6;
  const isAdministracion = tipoUsuario === 5;
  const isInventario = tipoUsuario === 4;
  const isCompras = tipoUsuario === 3;
  const isAuditor = tipoUsuario === 2;
  const isInternauta = tipoUsuario === 1;

  const [pageProduct, setPageProduct] = useState(0);
  const [rowsProductsPerPage, setRowsProductsPerPage] = useState(1);

  const getEstadoColor = (estado: string) => {
    if (!estado) return "default";
    switch (estado.toLowerCase()) {
      case "con_detalles":
        return "info";
      case "por_recibir":
        return "warning";
      case "en_almacen":
        return "primary";
      case "en_almacen_parcialmente":
        return "primary";
      case "guia_asignada":
        return "primary";
      case "enviado":
        return "warning";
      case "entregado":
        return "success";
      default:
        return "default";
    }
  };

  const estadosMap: { [key: string]: string } = {
    CON_DETALLES: "EL PRODUCTO PRESENTA DETALLES",
    POR_RECIBIR: "A ESPERA DE RECIBIR EL PRODUCTO EN ALMACEN",
    EN_ALMACEN: "PRODUCTO EXISTENTE EN ALMACEN",
    EN_ALMACEN_PARCIALMENTE: "SE RECIBIÓ EN ALMACEN PARTE DE LA CANTIDAD TOTAL DE PRODUCTOS",
    GUIA_ASIGNADA: "SE ASIGNÓ UNA GUÍA AL PRODUCTO",
    ENVIADO: "EL PRODUCTO HA SIDO ENVIADO AL CLIENTE",
    ENTREGADO: "EL CLIENTE CONFIRMÓ RECEPCIÓN DEL PRODUCTO",
  };

  // Función helper para traducir estados
  const traducirEstado = (estado: string | null): string => {
    if (!estado) return "SIN ESTADO";
    const estadoUpper = estado.toUpperCase();
    return estadosMap[estadoUpper] || estadoUpper;
  };

  const evidenciasArray = useMemo(() => {
    if (!verProducto?.evidencias) return [];

    if (typeof verProducto.evidencias === "string") {
      try {
        return JSON.parse(verProducto.evidencias);
      } catch (e) {
        console.error("Error al parsear evidencias:", e);
        return [];
      }
    }

    return Array.isArray(verProducto.evidencias) ? verProducto.evidencias : [];
  }, [verProducto?.evidencias]);

  // Handlers para la paginación
  const handleChangePageProduct = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageProduct(newPage);
  };

  const handleChangeRowsProductPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsProductsPerPage(parseInt(event.target.value, 10));
    setPageProduct(0);
  };

  const productosModalPaginados = useMemo(() => {
    const startIndex = pageProduct * rowsProductsPerPage;
    const endIndex = startIndex + rowsProductsPerPage;
    return verProducto?.productos.slice(startIndex, endIndex) || [];
  }, [verProducto?.productos, pageProduct, rowsProductsPerPage]);

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Detalles del producto {verProducto.nombre_producto}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: "center",
          }}
          gap={1}
        >
          <Button
            sx={{ color: "#fff", background: "#3ec972", fontSize: "0.75rem", padding: "6px 8px" }}
            variant="contained"
            endIcon={<AddIcon />}
            disabled={
              verProducto.estatus !== "por_recibir" &&
              verProducto.estatus !== "en_almacen_parcialmente"
            }
            onClick={(e: any) => {
              handleisAlertOpenCantidad();
            }}
          >
            {procesandoRecibirProducto ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Confirmando recepción...{" "}
              </>
            ) : (
              intl.formatMessage({ id: "recibir_en_almacen" })
            )}
          </Button>
          <Button
            sx={{ color: "#fff", background: "#3ec972", fontSize: "0.75rem", padding: "6px 8px" }}
            variant="contained"
            endIcon={<AddIcon />}
            disabled={verProducto.estatus !== "en_almacen"}
            onClick={(e: any) => {
              handleisAlertOpenGuia();
            }}
          >
            {procesandoGuiaProducto ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Confirmando recepción...{" "}
              </>
            ) : (
              intl.formatMessage({ id: "asignar_guia_envio" })
            )}
          </Button>
          <Button
            sx={{ color: "#fff", background: "#3ec972", fontSize: "0.75rem", padding: "6px 8px" }}
            variant="contained"
            endIcon={<AddIcon />}
            disabled={verProducto.estatus !== "guia_asignada"}
            onClick={(e: any) => {
              const datos = {
                id_producto_almacen: verProducto?.id_producto_almacen,
              };
              enviarProductoAlmacen(datos);
            }}
          >
            {procesandoEnvioProducto ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Enviando...{" "}
              </>
            ) : (
              intl.formatMessage({ id: "enviar_producto" })
            )}
          </Button>
          <Button
            sx={{ color: "#fff", background: "#3ec972", fontSize: "0.75rem", padding: "6px 8px" }}
            variant="contained"
            endIcon={<AddIcon />}
            disabled={verProducto.estatus !== "enviado"}
            onClick={(e: any) => {
              const datos = {
                id_producto_almacen: verProducto?.id_producto_almacen,
              };
              confirmarRecepcionProductoAlmacen(datos);
            }}
          >
            {procesandoRecepcionProducto ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Confirmando...{" "}
              </>
            ) : (
              intl.formatMessage({ id: "confirmar_recepcion_producto" })
            )}
          </Button>
          <Button
            sx={{ color: "#fff", background: "#9732d1", fontSize: "0.75rem", padding: "6px 8px" }}
            variant="contained"
            endIcon={<AddIcon />}
            disabled={verProducto.estatus !== "entregado"}
            onClick={(e: any) => {
              const datos = {
                id_canje: verProducto?.id_canje,
              };
              setDatosEncuestaEnviar(datos);
              handleisAlertOpenEnviarEncuesta();
            }}
          >
            {procesandoRecepcionProducto ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Enviando...{" "}
              </>
            ) : (
              intl.formatMessage({ id: "enviar_encuesta" })
            )}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Estatus del Producto
          </Typography>
          <Chip
            label={traducirEstado(verProducto.estatus?.toUpperCase())}
            color={getEstadoColor(verProducto.estatus)}
            sx={{ fontWeight: "bold" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Producto solicitado
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Nombre
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto?.nombre_producto}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Proveedor
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto?.nombre_proveedor ?? "Sin proveedor"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Marca
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto?.marca}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Sku
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto?.sku}
                </Typography>
              </Grid>
              {verProducto?.imei && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    IMEI
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {verProducto?.imei}
                  </Typography>
                </Grid>
              )}
              {verProducto?.no_serie && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    No. Serie
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {verProducto?.no_serie}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Cantidad por surtir
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.cantidad_producto}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Cantidad en almacen
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.cantidad_almacen}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" color="text.secondary">
                  Comentarios
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.comentarios}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Información de nuevos precios de premio*/}
        <Grid item xs={12}>
          {productosModalPaginados.map((p: any, key: number) => {
            const ahorroProducto =
              p?.precio_compra === null ? 0 : verProducto?.costo_sin_iva - p?.precio_compra;
            const porcentajeAhorro =
              verProducto?.costo_sin_iva > 0
                ? (ahorroProducto / verProducto?.costo_sin_iva) * 100
                : 0;
            const esPositivoAhorro = ahorroProducto > 0;
            const esNegativoAhorro = ahorroProducto < 0;
            const porcentajeAhorroMostrar =
              porcentajeAhorro > 0 ? porcentajeAhorro : -porcentajeAhorro;
            return (
              <>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Nuevos precios
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2} key={p.id || key}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Nombre
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {p?.nombre_producto_nuevo ?? p?.nombre_producto}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Proveedor
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {p?.nombre_proveedor ?? "Sin proveedor"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Marca
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {p?.marca_nuevo ?? p?.marca}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Sku
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {p?.sku_nuevo ?? p?.sku}
                      </Typography>
                    </Grid>
                    {p?.imei && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                          IMEI
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {p?.imei}
                        </Typography>
                      </Grid>
                    )}
                    {p?.no_serie && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                          No. Serie
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {p?.no_serie}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Precio de compra
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {esPositivoAhorro ? (
                          <>
                            <b
                              style={{
                                color: "#000",
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                                textDecorationThickness: "3px",
                              }}
                            >
                              {numericFormatter(verProducto?.costo_sin_iva + "", {
                                thousandSeparator: ",",
                                decimalScale: 2,
                                fixedDecimalScale: true,
                                prefix: "$",
                              })}
                            </b>{" "}
                            →{" "}
                            <b
                              style={{
                                color: "green",
                              }}
                            >
                              {numericFormatter(p?.precio_compra + "", {
                                thousandSeparator: ",",
                                decimalScale: 2,
                                fixedDecimalScale: true,
                                prefix: "$",
                              })}
                            </b>
                            <br />
                            {"Se ahorró un " +
                              numericFormatter(porcentajeAhorroMostrar + "", {
                                thousandSeparator: ",",
                                decimalScale: 2,
                                fixedDecimalScale: true,
                                suffix: "%",
                              })}
                          </>
                        ) : esNegativoAhorro ? (
                          <>
                            <b
                              style={{
                                color: "#000",
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                                textDecorationThickness: "3px",
                              }}
                            >
                              {numericFormatter(verProducto?.costo_sin_iva + "", {
                                thousandSeparator: ",",
                                decimalScale: 2,
                                fixedDecimalScale: true,
                                prefix: "$",
                              })}
                            </b>{" "}
                            →{" "}
                            <b
                              style={{
                                color: "green",
                              }}
                            >
                              {numericFormatter(p?.precio_compra + "", {
                                thousandSeparator: ",",
                                decimalScale: 2,
                                fixedDecimalScale: true,
                                prefix: "$",
                              })}
                            </b>
                            <br />
                            {"Tuvo un sobrecosto de " +
                              numericFormatter(porcentajeAhorroMostrar + "", {
                                thousandSeparator: ",",
                                decimalScale: 2,
                                fixedDecimalScale: true,
                                suffix: "%",
                              })}
                          </>
                        ) : (
                          ""
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Comentarios
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {p?.comentarios}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            );
          })}
        </Grid>
        {/* Componente de paginación */}
        <Grid item xs={12}>
          <MDBox mt={0} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TablePagination
              component="div"
              count={verProducto?.productos.length}
              page={pageProduct}
              onPageChange={handleChangePageProduct}
              rowsPerPage={rowsProductsPerPage}
              onRowsPerPageChange={handleChangeRowsProductPerPage}
              rowsPerPageOptions={[1, 2, 3]}
              labelRowsPerPage="Premios por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              sx={{
                direction: "ltr",
                ".MuiTablePagination-toolbar": {
                  justifyContent: "space-between",
                  padding: "16px 24px",
                },
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                  margin: 0,
                },
                ".MuiTablePagination-actions svg": {
                  transform: "scaleX(-1)",
                },
              }}
            />
          </MDBox>
        </Grid>
        {/* Información del premio canjeado */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Información de la orden
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  No. orden
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.no_orden}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Guía
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProducto.guia && (
                    <a href={verProducto.guia} target="_blank" rel="noreferrer">
                      Ver rastreo
                    </a>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Evidencias del producto */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Evidencias del producto
            </Typography>
            <Typography variant="caption" color="info" gutterBottom>
              Aquí se muestran las evidencias del producto cuando se recibe en almacén
            </Typography>
            <Grid item xs={12} display="flex" justifyContent="center" mt={1}>
              <Button
                sx={{
                  color: "#fff",
                  background: "#3ec972",
                  fontSize: "0.75rem",
                  padding: "6px 8px",
                }}
                variant="contained"
                endIcon={<AddIcon />}
                disabled={verProducto.estatus === "por_recibir"}
                onClick={(e: any) => {
                  handleOpenEvidencia();
                }}
              >
                {intl.formatMessage({ id: "añadir_evidencia_producto" })}
              </Button>
            </Grid>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MDBox display="flex" flexWrap="wrap" gap={2} mt={2}>
                  {evidenciasArray.length > 0 ? (
                    evidenciasArray.map((evidencia: any, index: number) => (
                      <Card
                        key={index}
                        sx={{
                          width: 150,
                          cursor: "pointer",
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: 6,
                            transform: "scale(1.05)",
                          },
                        }}
                        onClick={() => {
                          handleOpenVistaEvidencia(evidencia);
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 1,
                            textAlign: "center",
                          }}
                        >
                          <img
                            src={evidencia.url}
                            alt={evidencia.nombre_original}
                            style={{
                              width: "100%",
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
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
                            {evidencia.nombre_original}
                          </MDTypography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 2,
                      }}
                    >
                      <MDTypography variant="body2" color="text.secondary">
                        No hay evidencias cargadas
                      </MDTypography>
                    </Box>
                  )}
                </MDBox>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ProductoAlmacenModal;

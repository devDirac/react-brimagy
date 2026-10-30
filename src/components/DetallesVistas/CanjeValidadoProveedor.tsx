import {
  Grid,
  Typography,
  Divider,
  Box,
  Chip,
  Paper,
  Button,
  TextField,
  TablePagination,
  Tooltip,
  IconButton,
  Alert,
  createFilterOptions,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useIntl } from "react-intl";
import { useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { numericFormatter } from "react-number-format";

import { useSelector } from "react-redux";
import { StoreType } from "../../types/genericTypes";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import ModalConfirm from "components/ModalConfirm/ModalConfirm";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SendIcon from "@mui/icons-material/Send";
import PDFViewerOrdenCompra from "components/PDFViews/PDFViewerOrdenCompra";
import { MuiFileInput } from "mui-file-input";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { InputAdornment } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Proveedor as ProveedorCatalogo } from "types/canjeTypes";
import { IconAward, IconCreditCardFilled, IconLeafFilled } from "@tabler/icons-react";

interface Producto {
  id: number;
  id_validacion_producto: number;
  id_canje: number;
  id_proveedor: number;
  folio: string;
  nombre_usuario: string;
  email: string;
  phone: number;
  number_of_awards: number;
  talla: string;
  color: string;
  category: string;
  puntos_canjeados: number;
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
  nombre_producto: string;
  marca: string;
  nombre_proveedor: string;
  razon_social: string;
  fecha_validacion?: string;
  fee_brimagy: number;
  costo_sin_iva: number;
  costo_con_iva: number;
  iva: number;
  estatus_proveedor: number;
  porcentaje_descuento: number;
  cantidad_producto: number;
  precio_unitario: number;
  estatus_almacen: number;
  importe_total: number;
  subtotal: number;
  tipo_producto: string;
  categoria: string;
  plataforma: string | null;
  id_plataforma: number;
}
interface Proveedor {
  id: number;
  nombre: string;
  razon_social: string;
  descripcion: string;
  nombre_contacto: number;
  telefono: string;
  correo: string;
  total_canjes: string;
}

interface CanjesResponse {
  estadisticas?: {
    total_productos: number;
    productos_aceptados: number;
    productos_rechazados: number;
    productos_pendientes: number;
  };
  orden_compra: {
    id: number;
    id_usuario: number;
    no_orden: string;
    estatus: string;
    observaciones: string;
    nombre_vendedor: string;
    primer_apellido: string;
    segundo_apellido: string;
    created_at: string;
    updated_at: string;
  };
  proveedor: {
    id: number;
    nombre: string;
    razon_social: string;
    descripcion: string;
    nombre_contacto: string;
    telefono: string;
    correo: string;
  };
  totales: {
    subtotal: number;
    iva: number;
    total: number;
  };
  productos: Producto[];
}

interface DetalleCanjeProps {
  verCanje?: CanjesResponse | null;
  verProveedor?: Proveedor | null;
  isPDFViewerOpen: boolean;
  handleClosePDFViewer: () => void;
  handleOpenPDFViewer: () => void;
  handleisAlertOpenOtroProveedor: () => void;
  handleisAlertOpenAsignarProveedor: () => void;
  procesandoIdentidad: boolean;
  procesandoEnviarProveedor: boolean;
  procesandoOrdenCompra: boolean;
  procesandoEnviarOrdenAProveedor: boolean;
  procesandoRechazarCotizacion: boolean;
  procesandoValidandoFactura: boolean;
  procesandoSubirPDFFactura: boolean;
  procesandoValidacionFinal: boolean;
  validarOrdenCompraFinal: (data: any) => Promise<void>;
  subirPDFFactura: (data: any) => Promise<void>;
  validarFacturaOrdenCompra: (data: any) => Promise<void>;
  enviarOrdenCompraProveedor: (data: any) => Promise<void>;
  enviarCotizacionProveedor: (data: any) => Promise<void>;
  rechazarCotizacionDeProveedor: (data: any) => Promise<void>;
  getProductoNuevoProveedor: (data: any) => Promise<void>;
  setOrdenCompraActiva: React.Dispatch<React.SetStateAction<any>>;
  factura: File | null;
  setProductoSeleccionado: React.Dispatch<React.SetStateAction<any>>;
  handleChangeFactura: (newFile: File | null) => void;
  proveedoresSelect: ProveedorCatalogo[];
}

const CanjeValidadoProveedorModal = ({
  isPDFViewerOpen,
  handleClosePDFViewer,
  handleOpenPDFViewer,
  verCanje,
  verProveedor,
  procesandoIdentidad,
  procesandoEnviarProveedor,
  procesandoOrdenCompra,
  procesandoEnviarOrdenAProveedor,
  procesandoRechazarCotizacion,
  procesandoValidandoFactura,
  procesandoSubirPDFFactura,
  procesandoValidacionFinal,
  validarOrdenCompraFinal,
  subirPDFFactura,
  validarFacturaOrdenCompra,
  enviarCotizacionProveedor,
  enviarOrdenCompraProveedor,
  rechazarCotizacionDeProveedor,
  getProductoNuevoProveedor,
  handleisAlertOpenOtroProveedor,
  handleisAlertOpenAsignarProveedor,
  setOrdenCompraActiva,
  setProductoSeleccionado,
  factura,
  handleChangeFactura,
  proveedoresSelect
}: DetalleCanjeProps) => {
  const intl = useIntl();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [proveedoresPorProducto, setProveedoresPorProducto] = useState<Record<number, number[]>>({});

  const setProveedoresProducto = (key: number, ids: number[]) =>
    setProveedoresPorProducto((prev) => ({ ...prev, [key]: ids }));

  const opcionesProveedores = useMemo<ProveedorCatalogo[]>(
    () =>
      [...(proveedoresSelect ?? [])].sort((a, b) =>
        (a.nombre ?? "").localeCompare(b.nombre ?? "")
      ),
    [proveedoresSelect]
  );

  // Handlers para la paginación
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const canjesPaginados = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return verCanje?.productos.slice(startIndex, endIndex) || [];
  }, [verCanje, page, rowsPerPage]);

  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");

  const [isAlertOpenCompraDigital, setIsAlertOpenCompraDigital] = useState(false);
  const handleisAlertOpenCompraDigital = () => setIsAlertOpenCompraDigital(true);
  const handleisAlertCloseCompraDigital = () => setIsAlertOpenCompraDigital(false);

  const getEstadoColorValidacion = (estado_validacion: string) => {
    if (!estado_validacion) return "default";
    switch (estado_validacion.toLowerCase()) {
      case "cotizacion_enviada_a_proveedor":
        return "warning";
      case "cotizacion_validada_por_proveedor":
        return "primary";
      case "orden_compra_enviada_a_proveedor":
        return "info";
      case "orden_validada_por_proveedor":
        return "success";
      case "cotizacion_rechazada":
        return "error";
      case "xml_validado_correctamente_proveedor":
        return "primary";
      case "factura_subida_correctamente_proveedor":
        return "primary";
      default:
        return "default";
    }
  };

  const estadosValidacionMap: { [key: string]: string } = {
    COTIZACION_ENVIADA_A_PROVEEDOR: "LA COTIZACIÓN FUE ENVIADA A PROVEEDOR",
    COTIZACION_VALIDADA_POR_PROVEEDOR: "LA COTIZACIÓN FUE VALIDADA POR EL PROVEEDOR",
    ORDEN_COMPRA_ENVIADA_A_PROVEEDOR: "LA ORDEN DE COMPRA FUE ENVIADA AL PROVEEDOR",
    ORDEN_VALIDADA_POR_PROVEEDOR: "LA ORDEN DE COMPRA FUE VALIDADA POR EL PROVEEDOR",
    COTIZACION_RECHAZADA: "LA COTIZACIÓN HA SIDO RECHAZADA",
    XML_VALIDADO_CORRECTAMENTE_PROVEEDOR: "EL XML DE LA FACTURA FUE VALIDADO POR EL PROVEEDOR",
    FACTURA_SUBIDA_CORRECTAMENTE_PROVEEDOR: "ESPERANDO VALIDACIÓN DE ORDEN POR PROVEEDOR",
  };

  type EstatusVisual = { label: string; color: string };

  const getEstatusVisual = (
    estatusProveedor: number | null | undefined,
    tipoProducto: string
  ): EstatusVisual => {
    if (tipoProducto === "digital") {
      return { label: "Producto digital", color: "#ff9809" };
    }

    switch (estatusProveedor) {
      case null:
      case undefined:
        return { label: "Cotización pendiente", color: "grey.500" };
      case 0:
        return { label: "Validación pendiente", color: "secondary.main" };
      case 1:
        return { label: "Aceptado", color: "success.main" };
      case 2:
        return { label: "Rechazado", color: "error.main" };
      default:
        return { label: "Sin estatus", color: "grey.400" };
    }
  };

  const traducirEstadoValidacion = (estado: string | null): string => {
    if (!estado) return "SIN ESTATUS";
    const estadoUpper = estado.toUpperCase();
    return estadosValidacionMap[estadoUpper] || estadoUpper;
  };

  const todosProductosValidados = useMemo(() => {
    if (!verCanje?.productos || verCanje.productos.length === 0) {
      return false;
    }

    return verCanje.productos.every(
      (producto: any) =>
        producto.estatus_proveedor === 0 ||
        producto.estatus_proveedor === 1 ||
        producto.estatus_proveedor === 2
    );
  }, [verCanje]);

  const hayProductoSinPrecioUnitario = useMemo(() => {
    if (!verCanje?.productos || verCanje.productos.length === 0) {
      return false;
    }
    return verCanje.productos.some((p) => Number(p.costo_sin_iva || 0) === 0 && p.tipo_producto === "fisico");
  }, [verCanje]);

  const formatearFecha = (fecha?: string | null) =>
    fecha ? dayjs(fecha).locale("es").format("DD [de] MMMM [de] YYYY, HH:mm") : "Sin fecha";

  const etiquetaProveedor = (p: ProveedorCatalogo): string =>
    p.nombre || p.razon_social || `Proveedor #${p.id}`;

  const filtrarProveedores = createFilterOptions<ProveedorCatalogo>({
    stringify: (p) =>
      `${p.nombre ?? ""} ${p.razon_social ?? ""} ${p.nombre_contacto ?? ""} ${p.correo ?? ""}`,
    ignoreAccents: true,
    ignoreCase: true,
  });

  const renderOpcion = (props: any, option: ProveedorCatalogo, selected: boolean) => (
    <li
      {...props}
      key={option.id}
      style={{
        ...props.style,
        borderLeft: selected ? "2px solid #084d6e" : "2px solid transparent",
        fontWeight: selected ? 600 : 400,
      }}
    >
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="body2" sx={{ fontSize: 14, fontWeight: selected ? 600 : 400 }}>
          {etiquetaProveedor(option)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {option.razon_social}
          {option.correo ? ` · ${option.correo}` : ""}
        </Typography>
      </Box>
    </li>
  );

  const renderTags = (value: ProveedorCatalogo[], getTagProps: any) =>
    value.map((o, index) => (
      <Chip
        {...getTagProps({ index })}
        key={o.id}
        label={etiquetaProveedor(o)}
        size="small"
        sx={{
          backgroundColor: "#084d6e",
          color: "#fff",
          "& .MuiChip-deleteIcon": { color: "#fff" },
        }}
      />
    ));

  const renderSelectorProveedores = (
    opciones: ProveedorCatalogo[],
    idsSel: number[],
    onChange: (ids: number[]) => void
  ) => {
    const valor = opciones.filter((o) => idsSel.includes(o.id));
    return (
      <Autocomplete
        multiple
        disableCloseOnSelect
        fullWidth
        sx={{
          mt: 1.5,
          "& .MuiOutlinedInput-root": { paddingTop: "8px", paddingBottom: "8px" },
          "& .MuiAutocomplete-input": {
            paddingTop: "4px !important",
            paddingBottom: "4px !important",
          },
        }}
        options={opciones}
        filterOptions={filtrarProveedores}
        getOptionLabel={etiquetaProveedor}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        value={valor}
        onChange={(_, nuevos) => onChange(nuevos.map((n) => n.id))}
        renderOption={(props, option, { selected }) => renderOpcion(props, option, selected)}
        renderTags={renderTags}
        noOptionsText={intl.formatMessage({ id: "general_sin_registros" })}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Proveedores a cotizar"
            placeholder={valor.length ? "" : "Buscar proveedor..."}
          />
        )}
      />
    );
  };

  const productosDigitales = useMemo(
    () => (verCanje?.productos ?? []).filter((p) => p.tipo_producto === "digital"),
    [verCanje]
  );
  const productosFisicos = useMemo(
    () => (verCanje?.productos ?? []).filter((p) => p.tipo_producto === "fisico"),
    [verCanje]
  );
  const tipoEnvioDigitales = verProveedor?.id ? "proveedor" : "directo";
  const procesandoDigitales = procesandoValidacionFinal || procesandoEnviarProveedor;
  const esDirecto = verProveedor?.id == null;

  const procesandoFisicos = esDirecto ? procesandoValidacionFinal : procesandoEnviarProveedor;

  const deshabilitarFisicos =
    procesandoFisicos ||
    hayProductoSinPrecioUnitario ||
    productosFisicos.length === 0 ||
    (esDirecto
      ? !!verCanje?.orden_compra
      : todosProductosValidados);

  if (!verCanje) return null;
  if (!verProveedor) return null;

  return (
    <Box sx={{ px: 2, pb: 2, mt: 3 }}>
      <Grid container spacing={2}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Productos registrados
            </Typography>
          </Box>
        </Grid>

        {/* Datos del proveedor */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Datos del proveedor
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Nombre del proveedor
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProveedor.nombre}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Razón Social
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProveedor.razon_social ?? "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Nombre del contacto
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProveedor.nombre_contacto ?? "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Teléfono
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProveedor.telefono ?? "S/N"}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Correo
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verProveedor.correo ?? "N/A"}
                </Typography>
              </Grid>
              {!verCanje?.orden_compra?.estatus ? null : (
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Estatus de la orden de compra
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    <Chip
                      label={traducirEstadoValidacion(
                        verCanje?.orden_compra?.estatus?.toUpperCase()
                      )}
                      color={getEstadoColorValidacion(verCanje?.orden_compra?.estatus)}
                      sx={{ fontWeight: "bold" }}
                    />
                  </Typography>
                </Grid>
              )}
              {verCanje?.orden_compra?.created_at && (
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de creación de la orden
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatearFecha(verCanje.orden_compra.created_at)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        {/* Información de los canjes */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            {canjesPaginados.length > 0 ? (
              canjesPaginados.map((canje) => {
                const precioUnitario = canje.costo_sin_iva || 0;
                const cantidad = canje.number_of_awards || 0;
                const subtotalSinDescuento = precioUnitario * cantidad;
                const iva = subtotalSinDescuento * 0.16;
                const importeTotal = subtotalSinDescuento + iva;

                const estiloTexto =
                  canje.estatus_proveedor === 2
                    ? { textDecoration: "line-through", textDecorationColor: "red" }
                    : canje.tipo_producto === "digital"
                      ? { color: "#ff9809" }
                      : {};
                const estatus = getEstatusVisual(canje.estatus_proveedor, canje.tipo_producto);
                const keyProducto = canje.id_validacion_producto ?? canje.id;
                const idsSel = proveedoresPorProducto[keyProducto] ?? [];

                return (
                  <Box
                    key={canje.id_validacion_producto ?? canje.id}
                    sx={{
                      position: "relative",
                      mt: 3,
                      p: 2,
                      pt: 2.5,
                      border: "1px solid",
                      borderLeftWidth: 5,
                      borderColor: estatus.color,
                      borderRadius: 2,
                    }}
                  >
                    <Chip
                      label={estatus.label}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 16,
                        transform: "translateY(-50%)",
                        bgcolor: estatus.color,
                        color: "#fff",
                        fontWeight: "bold",
                        height: 22,
                      }}
                    />
                    <Chip
                      label={canje.folio ?? "Sin folio"}
                      size="small"
                      icon={<IconAward stroke={2} size={14} />}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 16,
                        transform: "translateY(-50%)",
                        bgcolor: "#084d6e",
                        color: "#fff",
                        fontWeight: "bold",
                        height: 22,
                        "& .MuiChip-icon": {
                          color: "#fff",
                          ml: "6px",
                        },
                      }}
                    />
                    <Chip
                      label={canje.plataforma ?? "Sin plataforma"}
                      size="small"
                      icon={<IconLeafFilled size={14} />}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "#44856b",
                        color: "#fff",
                        fontWeight: "bold",
                        height: 22,
                        textTransform: "uppercase",
                        "& .MuiChip-icon": {
                          color: "#fff",
                          ml: "6px",
                        },
                      }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={!verCanje?.orden_compra ? 3 : 4}>
                        <Typography variant="body2" color="text.secondary">
                          Nombre del producto
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={estiloTexto}>
                          {canje.nombre_premio}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          <b>SKU:</b> {canje.sku ?? "N/A"} · <b>Marca:</b> {canje.marca ?? "N/A"}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={1}>
                        <Typography variant="body2" color="text.secondary">
                          Cantidad
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={
                            canje.estatus_proveedor === 2
                              ? {
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                              : canje.tipo_producto === "digital"
                                ? { color: "#ff9809" }
                                : {}
                          }
                        >
                          {cantidad}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Precio unitario
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={
                            canje.estatus_proveedor === 2
                              ? {
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                              : canje.tipo_producto === "digital"
                                ? { color: "#ff9809" }
                                : {}
                          }
                        >
                          {numericFormatter(precioUnitario.toString(), {
                            thousandSeparator: ",",
                            decimalScale: 2,
                            fixedDecimalScale: true,
                            prefix: "$",
                          })}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Importe
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={
                            canje.estatus_proveedor === 2
                              ? {
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                              : canje.tipo_producto === "digital"
                                ? { color: "#ff9809" }
                                : {}
                          }
                        >
                          {numericFormatter(importeTotal.toString(), {
                            thousandSeparator: ",",
                            decimalScale: 2,
                            fixedDecimalScale: true,
                            prefix: "$",
                          })}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={
                            canje.estatus_proveedor === 2
                              ? {
                                textDecoration: "line-through",
                                textDecorationColor: "red",
                              }
                              : canje.tipo_producto === "digital"
                                ? { color: "#ff9809" }
                                : {}
                          }
                        >
                          (IVA 16%)
                        </Typography>
                      </Grid>

                      {canje.tipo_producto === "fisico" && !verCanje?.orden_compra && (
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Cotizar con otros proveedores
                          </Typography>
                          {renderSelectorProveedores(opcionesProveedores, idsSel, (ids) =>
                            setProveedoresProducto(keyProducto, ids)
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </Box>
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
                  {intl.formatMessage({ id: "no_hay_canjes_validados_disponibles" })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No se encontraron canjes sin orden de compra disponibles
                </Typography>
              </Box>
            )}

            {/* Componente de paginación */}
            <MDBox mt={3} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TablePagination
                component="div"
                count={verCanje.productos.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[4, 8, 10, 12]}
                labelRowsPerPage="Canjes por página:"
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

            {verCanje?.orden_compra?.observaciones && (
              <Grid item xs={12} mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Observaciones del proveedor
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verCanje?.orden_compra?.observaciones}
                </Typography>
              </Grid>
            )}

            {verCanje?.orden_compra?.estatus === "orden_compra_enviada_a_proveedor" ||
              verCanje?.orden_compra?.estatus === "xml_validado_correctamente_proveedor" ? (
              <>
                <Divider sx={{ mb: 2 }} />
                <Grid item xs={12}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography variant="h5" color={"#eb2fa5"}>
                      Validar y subir factura
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Para continuar el proceso, valida el XML, sube el PDF de la factura y da click
                      en <b style={{ color: "#A5EB2F" }}>Validar orden de compra</b>, para validar
                      la información de la orden de compra
                    </Typography>
                  </Box>
                </Grid>
                <Divider sx={{ mb: 2 }} />
                <Grid item xs={12} md={12} display="flex" justifyContent="center" mb={2}>
                  {verCanje?.orden_compra?.estatus !== "xml_validado_correctamente_proveedor" && (
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
                        Validar XML
                      </Typography>
                      <MuiFileInput
                        value={factura}
                        onChange={handleChangeFactura}
                        inputProps={{ accept: ".xml" }}
                        hideSizeText
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CloudUploadIcon fontSize="medium" />
                            </InputAdornment>
                          ),
                          endAdornment: factura && (
                            <InputAdornment position="end">
                              <Button
                                sx={{
                                  color: "#fff",
                                  background: "#eb2fa5",
                                  fontSize: "0.75rem",
                                  padding: "6px 8px",
                                  margin: "0",
                                }}
                                size="small"
                                variant="contained"
                                disabled={procesandoValidandoFactura}
                                onClick={(e: any) => {
                                  const datos = {
                                    id_orden_compra: verCanje?.orden_compra?.id,
                                    id_proveedor: verCanje?.proveedor?.id,
                                    id_usuario: verCanje?.orden_compra?.id_usuario,
                                    xml_factura: factura,
                                  };
                                  validarFacturaOrdenCompra(datos);
                                }}
                              >
                                {procesandoValidandoFactura ? (
                                  <>
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                    />
                                    Validando...{" "}
                                  </>
                                ) : (
                                  intl.formatMessage({ id: "validar_xml" })
                                )}
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        placeholder={`${intl.formatMessage({ id: "validar_xml_factura" })}`}
                      />
                    </Grid>
                  )}
                  {verCanje?.orden_compra?.estatus === "xml_validado_correctamente_proveedor" && (
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
                        Sube tu PDF de la factura
                      </Typography>
                      <MuiFileInput
                        value={factura}
                        onChange={handleChangeFactura}
                        inputProps={{ accept: ".pdf" }}
                        hideSizeText
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PictureAsPdfIcon fontSize="medium" />
                            </InputAdornment>
                          ),
                          endAdornment: factura && (
                            <InputAdornment position="end">
                              <Button
                                sx={{
                                  color: "#fff",
                                  background: "#eb2fa5",
                                  fontSize: "0.75rem",
                                  padding: "6px 8px",
                                  margin: "0",
                                }}
                                size="small"
                                variant="contained"
                                disabled={procesandoValidandoFactura}
                                onClick={(e: any) => {
                                  const datos = {
                                    id_orden_compra: verCanje?.orden_compra?.id,
                                    id_proveedor: verCanje?.proveedor?.id,
                                    id_usuario: verCanje?.orden_compra?.id_usuario,
                                    pdf_factura: factura,
                                  };
                                  subirPDFFactura(datos);
                                }}
                              >
                                {procesandoValidandoFactura ? (
                                  <>
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                    />
                                    Validando...{" "}
                                  </>
                                ) : (
                                  intl.formatMessage({ id: "subir_pdf_factura" })
                                )}
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        placeholder={`${intl.formatMessage({
                          id: "subir_pdf_factura_placeholder",
                        })}`}
                      />
                    </Grid>
                  )}
                </Grid>
                <Divider sx={{ mb: 2 }} />
              </>
            ) : null}

            {verCanje?.orden_compra?.estatus === "factura_subida_correctamente_proveedor" ? (
              <Alert severity="warning" sx={{ m: 2 }}>
                La factura fue subida con éxito, para continuar el proceso debes dar click en{" "}
                <b>Validar orden de compra</b>
              </Alert>
            ) : null}

            {hayProductoSinPrecioUnitario && (
              <Alert severity="error" sx={{ m: 2 }}>
                Hay productos con precio unitario en $0. Corrige el precio antes de generar la orden
                de compra.
              </Alert>
            )}

            <Button
              sx={{
                color: "#fff",
                background: "#3ec972",
                fontSize: "0.75rem",
                padding: "6px 8px",
                margin: "5px 10px",
              }}
              variant="contained"
              endIcon={<SendIcon />}
              disabled={
                hayProductoSinPrecioUnitario ||
                procesandoEnviarOrdenAProveedor ||
                verCanje?.orden_compra?.estatus !== "cotizacion_validada_por_proveedor"
              }
              onClick={(e: any) => {
                const datos = {
                  id_orden_compra: verCanje?.orden_compra?.id,
                  id_proveedor: verProveedor.id,
                };
                enviarOrdenCompraProveedor(datos);
              }}
            >
              {procesandoEnviarOrdenAProveedor ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Enviando orden...{" "}
                </>
              ) : (
                intl.formatMessage({ id: "enviar_orden_de_compra" })
              )}
            </Button>

            <Button
              sx={{
                color: "#fff",
                background: "#3ec972",
                fontSize: "0.75rem",
                padding: "6px 8px",
                margin: "5px 10px",
              }}
              variant="contained"
              endIcon={<SendIcon />}
              disabled={
                procesandoValidacionFinal ||
                !todosProductosValidados ||
                !verCanje?.orden_compra ||
                verCanje?.orden_compra?.estatus !== "factura_subida_correctamente_proveedor"
              }
              onClick={(e: any) => {
                const datos = {
                  id_orden_compra: verCanje?.orden_compra.id,
                };
                validarOrdenCompraFinal(datos);
              }}
            >
              {procesandoValidacionFinal ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Validando...{" "}
                </>
              ) : (
                intl.formatMessage({ id: "validar_orden_de_compra" })
              )}
            </Button>

            <Button
              sx={{
                color: "#fff",
                background: "#e01032",
                fontSize: "0.75rem",
                padding: "6px 8px",
                margin: "5px 10px",
              }}
              variant="contained"
              endIcon={<SendIcon />}
              disabled={
                procesandoRechazarCotizacion ||
                verCanje?.orden_compra?.estatus !== "cotizacion_validada_por_proveedor"
              }
              onClick={(e: any) => {
                const datos = {
                  id_orden_compra: verCanje?.orden_compra?.id,
                  id_proveedor: verProveedor.id,
                };
                rechazarCotizacionDeProveedor(datos);
              }}
            >
              {procesandoRechazarCotizacion ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Enviando orden...{" "}
                </>
              ) : (
                intl.formatMessage({ id: "rechazar_cotizacion_proveedor" })
              )}
            </Button>

            <Button
              sx={{
                color: "#fff",
                background: "#3ec972",
                fontSize: "0.75rem",
                padding: "6px 8px",
                margin: "5px 10px",
              }}
              variant="contained"
              endIcon={<SendIcon />}
              disabled={deshabilitarFisicos}
              onClick={() =>
                enviarCotizacionProveedor({
                  id_usuario: idUsuario,
                  id_proveedor: verProveedor.id,
                  productos: productosFisicos.map((p) => ({
                    id_validacion: p.id_validacion_producto,
                    estatus_proveedor: esDirecto ? 1 : 0,
                    estatus_almacen: 0,
                  })),
                  /*productos: productosFisicos.map((p) => ({
                    id_canje: p.id_canje,
                    id_producto: p.id,
                    cantidad_producto: p.number_of_awards,
                    cantidad_almacen: p.number_of_awards,
                    estatus_almacen: 0,
                    estatus_proveedor: esDirecto ? 1 : 0,
                  })),*/
                  plataforma,
                  tipo_envio: esDirecto ? "directo" : "proveedor",
                })
              }
            >
              {procesandoFisicos ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  {esDirecto ? "Validando..." : "Enviando..."}{" "}
                </>
              ) : (
                intl.formatMessage({ id: esDirecto ? "validar_sin_proveedor" : "enviar_a_proveedor" })
              )}
            </Button>

            {productosDigitales.length > 0 && (
              <Button
                sx={{
                  color: "#fff",
                  background: "#ff9809",
                  fontSize: "0.75rem",
                  padding: "6px 8px",
                  margin: "5px 10px",
                }}
                variant="contained"
                startIcon={<IconCreditCardFilled />}
                disabled={
                  procesandoDigitales ||
                  verCanje?.orden_compra?.estatus === "cotizacion_validada_por_proveedor"
                }
                onClick={() =>
                  enviarCotizacionProveedor({
                    id_usuario: idUsuario,
                    id_proveedor: verProveedor.id,
                    /*productos: productosDigitales.map((p) => ({
                      id_canje: p.id_canje,
                      id_producto: p.id,
                      cantidad_producto: p.number_of_awards,
                      cantidad_almacen: p.number_of_awards,
                      estatus_almacen: 0,
                      estatus_proveedor: 1,
                    })),*/
                    productos: productosDigitales.map((p) => ({
                      id_validacion: p.id_validacion_producto,
                      estatus_proveedor: 1,
                      estatus_almacen: 0,
                    })),
                    plataforma,
                    tipo_envio: tipoEnvioDigitales,
                  })
                }
              >
                {procesandoDigitales ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    Validando...{" "}
                  </>
                ) : (
                  intl.formatMessage({ id: "validar_productos_digitales" })
                )}
              </Button>
            )}

            <Button
              sx={{
                color: "#fff",
                background: "#084d6e",
                fontSize: "0.75rem",
                padding: "6px 8px",
                margin: "5px 10px",
              }}
              variant="contained"
              endIcon={<PictureAsPdfIcon />}
              disabled={
                procesandoOrdenCompra ||
                canjesPaginados.length === 0 ||
                !todosProductosValidados ||
                verCanje?.orden_compra?.estatus === "cotizacion_enviada_a_proveedor" ||
                verCanje?.orden_compra?.estatus === "cotizacion_validada_por_proveedor"
              }
              onClick={(e: any) => {
                handleOpenPDFViewer();
              }}
            >
              {procesandoOrdenCompra ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Generando orden de compra...{" "}
                </>
              ) : (
                intl.formatMessage({ id: "generar_orden_compra" })
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <ModalConfirm
        onAcept={() => {
          handleisAlertCloseCompraDigital();
        }}
        onCancel={() => {
          handleisAlertCloseCompraDigital();
        }}
        open={isAlertOpenCompraDigital}
        text={intl.formatMessage({
          id: "producto_compra_digital_confirmar",
        })}
        title={""}
        cancelText="No"
        acceptText={intl.formatMessage({
          id: "si",
        })}
      />
      {/* Visor de PDF */}
      <PDFViewerOrdenCompra
        open={isPDFViewerOpen}
        onClose={handleClosePDFViewer}
        ordenCompra={verCanje}
      />
    </Box>
  );
};
export default CanjeValidadoProveedorModal;

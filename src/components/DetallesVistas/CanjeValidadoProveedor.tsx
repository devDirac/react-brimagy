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
import { useEffect, useMemo, useState } from "react";
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
import {
  IconAward,
  IconCreditCardFilled,
  IconLeafFilled,
  IconBarcode,
  IconTag,
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCalendar,
} from "@tabler/icons-react";
import { getPlataformaUI } from "config/plataformasUI";
import PlataformaChip from "components/PlataformaChip/PlataformaChip";
import ModalComponent from "components/Modal";

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
  id_validacion?: number;
  orden_ejecutada?: string | null;
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
  cotizarConOtrosProveedores: (data: any) => Promise<boolean>;
  procesandoCotizarOtros: boolean;
  modoCotizacion: "acumular" | "directo";
}

type EstatusVisual = { label: string; color: string };

const formatoMoneda = (valor: number | string | null | undefined) =>
  numericFormatter(Number(valor || 0).toFixed(2), {
    thousandSeparator: ",",
    decimalScale: 2,
    fixedDecimalScale: true,
    prefix: "$",
  });

const chipSolido = (bg: string, texto = "#fff") => ({
  bgcolor: bg,
  color: texto,
  fontWeight: "bold",
  height: 22,
  "& .MuiChip-icon": { color: texto, ml: "6px" },
});
const Dato = ({
  label,
  children,
  sx,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  sx?: object;
  icon?: React.ReactNode;
}) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 0.5,
        lineHeight: 1.4,
      }}
    >
      {icon}
      {label}
    </Typography>
    <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: "break-word", ...sx }}>
      {children || "N/A"}
    </Typography>
  </Box>
);

interface ProductoCardProps {
  canje: Producto;
  estatus: EstatusVisual;
  selector?: React.ReactNode;
}

const ProductoCard = ({ canje, estatus, selector }: ProductoCardProps) => {
  const precioUnitario = Number(canje.precio_unitario ?? canje.costo_sin_iva ?? 0);
  const cantidad = Number(canje.cantidad_producto ?? canje.number_of_awards ?? 0);
  const subtotal = precioUnitario * cantidad;
  const iva = subtotal * 0.16;
  const importe = subtotal + iva;

  const estiloValor =
    canje.estatus_proveedor === 2
      ? { textDecoration: "line-through", textDecorationColor: "red" }
      : canje.tipo_producto === "digital"
        ? { color: "#ff9809" }
        : {};

  const direccion = [
    [canje.calle, canje.numero_calle].filter(Boolean).join(" "),
    canje.numero_interior && `Int. ${canje.numero_interior}`,
    canje.colonia,
    canje.municipio,
    canje.codigo_postal && `C.P. ${canje.codigo_postal}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Paper
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        borderLeft: "5px solid",
        borderLeftColor: estatus.color,
        overflow: "hidden",
      }}
    >
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 1,
          px: 2,
          pt: 1.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          <Chip
            size="small"
            icon={<IconAward size={14} stroke={2} />}
            label={canje.folio ?? "Sin folio"}
            sx={chipSolido("#084d6e")}
          />
          <PlataformaChip plataforma={canje.plataforma} />
        </Box>
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Tooltip title="SKU">
            <Chip
              size="small"
              variant="outlined"
              icon={<IconBarcode size={14} />}
              label={canje.sku ?? "N/A"}
              sx={{ height: 22, fontWeight: 600 }}
            />
          </Tooltip>
          <Tooltip title="Marca">
            <Chip
              size="small"
              variant="outlined"
              icon={<IconTag size={14} />}
              label={canje.marca ?? "N/A"}
              sx={{ height: 22, fontWeight: 600 }}
            />
          </Tooltip>
        </Box>
      </Box>

      {/* Producto */}
      <Box sx={{ px: 2, pt: 1.5 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.3, ...estiloValor }}>
          {canje.nombre_premio ?? canje.nombre_producto}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75, flexWrap: "wrap" }}>
          <Chip size="small" label={estatus.label} sx={chipSolido(estatus.color)} />
          {canje.categoria && (
            <Typography variant="caption" color="text.secondary">
              {canje.categoria}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
            gap: 1.5,
            mt: 1.5,
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: "action.hover",
          }}
        >
          <Dato label="Cantidad" sx={estiloValor}>
            {cantidad}
          </Dato>
          <Dato label="Precio unitario" sx={estiloValor}>
            {formatoMoneda(precioUnitario)}
          </Dato>
          <Dato label="Subtotal" sx={estiloValor}>
            {formatoMoneda(subtotal)}
          </Dato>
          <Dato label="Importe (+IVA 16%)" sx={{ ...estiloValor, fontWeight: "bold" }}>
            {formatoMoneda(importe)}
          </Dato>
        </Box>
      </Box>

      {/* Usuario que realizó el canje */}
      <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
        <Divider sx={{ mb: 1.5 }} />
        <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
          Datos del canje
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 1.5,
            mt: 1,
          }}
        >
          <Dato label="Usuario" icon={<IconUser size={13} />}>
            {canje.nombre_usuario}
          </Dato>
          <Dato label="Teléfono" icon={<IconPhone size={13} />}>
            {canje.phone}
          </Dato>
          <Dato label="Correo" icon={<IconMail size={13} />}>
            {canje.email}
          </Dato>
          <Dato label="Fecha de validación" icon={<IconCalendar size={13} />}>
            {canje.fecha_validacion
              ? dayjs(canje.fecha_validacion).locale("es").format("DD/MM/YYYY HH:mm")
              : null}
          </Dato>
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Dato label="Dirección de envío" icon={<IconMapPin size={13} />}>
              {direccion}
            </Dato>
          </Box>
        </Box>
      </Box>

      {selector && <Box sx={{ px: 2, pb: 2, mt: "auto" }}>{selector}</Box>}
    </Paper>
  );
};

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
  proveedoresSelect,
  cotizarConOtrosProveedores,
  procesandoCotizarOtros,
  modoCotizacion,
}: DetalleCanjeProps) => {
  const intl = useIntl();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const llaveValidacion = (p: Producto) => p.id_validacion_producto ?? p.id_validacion ?? p.id;

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [proveedoresPorProducto, setProveedoresPorProducto] = useState<Record<number, number[]>>({});

  const setProveedoresProducto = (key: number, ids: number[]) =>
    setProveedoresPorProducto((prev) => ({ ...prev, [key]: ids }));

  const opcionesProveedores = useMemo<ProveedorCatalogo[]>(
    () =>
      [...(proveedoresSelect ?? [])]
        .filter((p) => p.id !== verProveedor?.id)
        .sort((a, b) => (a.nombre ?? "").localeCompare(b.nombre ?? "")),
    [proveedoresSelect, verProveedor]
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

  useEffect(() => {
    setPage(0);
  }, [verCanje]);

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
        return { label: "No disponible", color: "error.main" };
      case 3:
        return { label: "Descartado (asignado a otro proveedor)", color: "grey.600" };
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

  const [confirmarEnvioGlobal, setConfirmarEnvioGlobal] = useState(false);

  const textosCotizacion =
    modoCotizacion === "directo"
      ? {
        boton: "Enviar cotización",
        botonGlobal: "Enviar cotizaciones",
        titulo: "Confirmar envío de cotizaciones",
        descripcion: "Cada proveedor recibirá una sola cotización con todos sus productos.",
      }
      : {
        boton: "Agregar a pendientes",
        botonGlobal: "Agregar a pendientes",
        titulo: "Confirmar asignación a proveedores",
        descripcion:
          "Los productos se agregarán a los pendientes de cada proveedor y se acumularán con sus otros canjes sin orden de compra.",
      };

  const productosPorKey = useMemo(
    () =>
      new Map(
        (verCanje?.productos ?? []).map((p) => [llaveValidacion(p), p] as const)
      ),
    [verCanje]
  );

  const nombreProveedor = (id: number) => {
    const p = (proveedoresSelect ?? []).find((o) => o.id === id);
    return p ? etiquetaProveedor(p) : `Proveedor #${id}`;
  };

  // Resumen para el diálogo: proveedor → productos
  const enviosPorProveedor = useMemo(() => {
    const mapa = new Map<number, Producto[]>();
    Object.entries(proveedoresPorProducto).forEach(([key, ids]) => {
      const producto = productosPorKey.get(Number(key));
      if (!producto) return;
      ids.forEach((idProv) => {
        if (!mapa.has(idProv)) mapa.set(idProv, []);
        mapa.get(idProv)!.push(producto);
      });
    });
    return mapa;
  }, [proveedoresPorProducto, productosPorKey]);

  const totalProductosConSeleccion = Object.values(proveedoresPorProducto).filter(
    (ids) => ids.length > 0
  ).length;

  const ejecutarCotizacion = async (seleccion: Record<number, number[]>) => {
    const asignaciones = Object.entries(seleccion)
      .filter(([, ids]) => ids.length > 0)
      .map(([key, ids]) => ({ id_validacion: Number(key), proveedores: ids }));

    if (asignaciones.length === 0) return;

    const ok = await cotizarConOtrosProveedores({ asignaciones });

    if (ok) {
      setProveedoresPorProducto((prev) => {
        const next = { ...prev };
        asignaciones.forEach((a) => delete next[a.id_validacion]);
        return next;
      });
      setConfirmarEnvioGlobal(false);
    }
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
            {enviosPorProveedor.size > 0 && (
              <Alert
                severity="info"
                sx={{
                  position: "sticky",
                  top: 8,
                  zIndex: 2,
                  mb: 2,
                  alignItems: "center",
                  "& .MuiAlert-message": { flex: 1, textAlign: "left" },
                }}
                action={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      color="inherit"
                      disabled={procesandoCotizarOtros}
                      onClick={() => setProveedoresPorProducto({})}
                    >
                      Limpiar
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<SendIcon />}
                      disabled={procesandoCotizarOtros}
                      onClick={() => setConfirmarEnvioGlobal(true)}
                      sx={{ background: "#084d6e", color: "#fff" }}
                    >
                      {textosCotizacion.botonGlobal}
                    </Button>
                  </Box>
                }
              >
                <b>{totalProductosConSeleccion}</b> producto{totalProductosConSeleccion !== 1 ? "s" : ""} con{" "}
                <b>{enviosPorProveedor.size}</b> proveedor{enviosPorProveedor.size !== 1 ? "es" : ""}{" "}
                seleccionado{enviosPorProveedor.size !== 1 ? "s" : ""}
              </Alert>
            )}
            {canjesPaginados.length > 0 ? (
              <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                {canjesPaginados.map((canje) => {
                  const keyProducto = llaveValidacion(canje);
                  const idsSel = proveedoresPorProducto[keyProducto] ?? [];
                  const ordenCerrada = [
                    "factura_subida_correctamente_proveedor",
                    "orden_validada_por_proveedor",
                  ].includes(verCanje?.orden_compra?.estatus ?? "");

                  const respondido = canje.estatus_proveedor === 1 || canje.estatus_proveedor === 2;

                  const mostrarSelector =
                    canje.tipo_producto === "fisico" &&
                    !canje.orden_ejecutada &&
                    !ordenCerrada &&
                    (!verCanje?.orden_compra || respondido);

                  return (
                    <Grid item xs={12} md={6} key={keyProducto}>
                      <ProductoCard
                        canje={canje}
                        estatus={getEstatusVisual(canje.estatus_proveedor, canje.tipo_producto)}
                        selector={
                          mostrarSelector ? (
                            <>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {canje.estatus_proveedor === 2
                                  ? "No disponible con este proveedor: cotízalo con otro"
                                  : "Cotizar con otros proveedores"}
                              </Typography>
                              {renderSelectorProveedores(opcionesProveedores, idsSel, (ids) =>
                                setProveedoresProducto(keyProducto, ids)
                              )}
                              {idsSel.length > 0 && (
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<SendIcon />}
                                    disabled={procesandoCotizarOtros}
                                    onClick={() => ejecutarCotizacion({ [keyProducto]: idsSel })}
                                    sx={{ fontSize: "0.7rem" }}
                                  >
                                    {procesandoCotizarOtros ? (
                                      <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                                        Procesando...
                                      </>
                                    ) : (
                                      `${textosCotizacion.boton} (${idsSel.length})`
                                    )}
                                  </Button>
                                </Box>
                              )}
                            </>
                          ) : undefined
                        }
                      />
                    </Grid>
                  );
                })}
              </Grid>
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
                rowsPerPageOptions={[4, 10, 20]}
                labelRowsPerPage="Productos por página:"
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
      {/* RESUMEN DE COTIZACIÓN CON OTROS PROVEEDORES */}
      <ModalComponent
        handleClose={() => !procesandoCotizarOtros && setConfirmarEnvioGlobal(false)}
        isOpen={confirmarEnvioGlobal}
        key={"alertaResumenCotizacion"}
      >
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <Typography variant="button" display="block" gutterBottom sx={{ fontWeight: 600 }}>
              {textosCotizacion.titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {textosCotizacion.descripcion}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ maxHeight: "55vh", overflowY: "auto", textAlign: "left" }}>
            {Array.from(enviosPorProveedor.entries()).map(([idProv, productos]) => (
              <Paper key={idProv} variant="outlined" sx={{ p: 1.5, mb: 1.5, borderRadius: 2 }}>
                {/* Encabezado del proveedor */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {nombreProveedor(idProv)}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${productos.length} producto${productos.length !== 1 ? "s" : ""}`}
                    sx={chipSolido("#084d6e")}
                  />
                </Box>

                {/* Canjes */}
                {productos.map((p) => {
                  const direccion = [
                    [p.calle, p.numero_calle].filter(Boolean).join(" "),
                    p.numero_interior && `Int. ${p.numero_interior}`,
                    p.colonia,
                    p.municipio,
                    p.codigo_postal && `C.P. ${p.codigo_postal}`,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <Box
                      key={p.id_validacion_producto ?? p.id}
                      sx={{ py: 1, borderTop: "1px dashed", borderColor: "divider" }}
                    >
                      {/* Producto + plataforma */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium" noWrap sx={{ minWidth: 0 }}>
                          {p.nombre_premio}
                        </Typography>
                        <PlataformaChip plataforma={p.plataforma} sx={{ flexShrink: 0 }} />
                      </Box>

                      <Typography variant="caption" color="text.secondary" display="block">
                        <b>Folio:</b> {p.folio ?? "Sin folio"} · <b>SKU:</b> {p.sku ?? "N/A"} ·{" "}
                        <b>Cant.:</b> {p.number_of_awards}
                      </Typography>

                      {/* Usuario del canje */}
                      <Typography variant="caption" color="text.secondary" display="block">
                        <b>Usuario:</b> {p.nombre_usuario ?? "N/A"} · <b>Tel.:</b> {p.phone ?? "N/A"} ·{" "}
                        <b>Correo:</b> {p.email ?? "N/A"}
                      </Typography>

                      {direccion && (
                        <Tooltip title={direccion}>
                          <Typography variant="caption" color="text.secondary" display="block" noWrap>
                            <b>Dirección:</b> {direccion}
                          </Typography>
                        </Tooltip>
                      )}
                    </Box>
                  );
                })}
              </Paper>
            ))}
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="center" gap={2} mb={1}>
            <Button
              variant="outlined"
              disabled={procesandoCotizarOtros}
              onClick={() => setConfirmarEnvioGlobal(false)}
              sx={{ color: "#084d6e", borderColor: "#084d6e" }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              disabled={procesandoCotizarOtros}
              onClick={() => ejecutarCotizacion(proveedoresPorProducto)}
              sx={{ color: "#fff", background: "#084d6e" }}
            >
              {procesandoCotizarOtros ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                  Procesando...
                </>
              ) : (
                textosCotizacion.botonGlobal
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalComponent>
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

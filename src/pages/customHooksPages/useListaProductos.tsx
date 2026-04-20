import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  activarColorProductoHttp,
  activarFotosProductoHttp,
  activarFotosPromoProductoHttp,
  activarTallaProductoHttp,
  crearEditarColorProductoHttp,
  crearEditarTallaProductoHttp,
  crearProductoHttp,
  desactivarColorProductoHttp,
  desactivarFotosProductoHttp,
  desactivarFotosPromoProductoHttp,
  desactivarTallaProductoHttp,
  editarProductoHttp,
  eliminarProductoHttp,
  getBitacoraProductoPorIdHttp,
  getBusquedaInteligenteHttp,
  getCatalogoProductosHttp,
  getProductoColorPorIdHttp,
  getProductoFotoPorIdHttp,
  getProductoFotoPromoPorIdHttp,
  getProductoTallaPorIdHttp,
  subirFotosProductoHttp,
  subirFotosPromoProductoHttp,
  verificarIdProductoBrimagyHttp,
  verificarSkusHttp,
} from "actions/productos";
import { numericFormatter } from "react-number-format";
import moment from "moment";
import { crearProveedorHttp, getProveedoresHttp } from "actions/proveedores";
import { crearCategoriaHttp, getCategoriasHttp } from "actions/categorias";
import ExcelJS from "exceljs";
import { crearPlataformaHttp, getPlataformasHttp } from "actions/configuracion";
import { C } from "@fullcalendar/core/internal-common";
import env from "react-dotenv";

export const useListaProductos = (tipoUsuario: number) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoEditar, setProcesandoEditar] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);
  const [productos, setProductos] = useState<any[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const isSuperAdmin = tipoUsuario === 6;

  const handleisAlertOpenAsignar = () => setIsAlertOpenAsignar(true);
  const handleisAlerCloseAsignar = () => setIsAlertOpenAsignar(false);
  const [isAlertOpenAsignar, setIsAlertOpenAsignar] = useState(false);
  const [asignarPdfDatos, setAsignarPdfDatos] = useState<any[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<number[]>([]);

  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");

  const [isAlertOpenEditarProducto, setIsAlertOpenEditarProducto] = useState(false);
  const handleisAlertOpenEditarProducto = () => setIsAlertOpenEditarProducto(true);
  const handleisAlerCloseEditarProducto = () => setIsAlertOpenEditarProducto(false);
  const [productoEditar, setProductoEditar] = useState<any>(null);

  const [openModalConfirmEliminaProducto, setOpenModalConfirmEliminaProducto] = useState(false);
  const handleisAlertOpenEliminaProducto = () => setOpenModalConfirmEliminaProducto(true);
  const handleisAlerCloseEliminaProducto = () => setOpenModalConfirmEliminaProducto(false);

  const [nombreProductoEditar, setNombreProductoEditar] = useState("");
  const [descripcionEditar, setDescripcionEditar] = useState("");
  const [marcaEditar, setMarcaEditar] = useState("");
  const [skuEditar, setSkuEditar] = useState("");
  const [colorEditar, setColorEditar] = useState("");
  const [tallaEditar, setTallaEditar] = useState("");
  const [idProveedorEditar, setIdProveedorEditar] = useState("");
  const [idCatalogoEditar, setIdCatalogoEditar] = useState("");
  const [costoConIvaEditar, setCostoConIvaEditar] = useState("");
  const [costoSinIvaEditar, setCostoSinIvaEditar] = useState("");
  const [costoPuntosConIvaEditar, setCostoPuntosConIvaEditar] = useState("");
  const [costoPuntosSinIvaEditar, setCostoPuntosSinIvaEditar] = useState("");
  const [feeBrimagyEditar, setFeeBrimagyEditar] = useState("");
  const [subtotalEditar, setSubtotalEditar] = useState("");
  const [envioBaseEditar, setEnvioBaseEditar] = useState("");
  const [costoCajaEditar, setCostoCajaEditar] = useState("");
  const [envioExtraEditar, setEnvioExtraEditar] = useState("");
  const [totalEnvioEditar, setTotalEnvioEditar] = useState("");
  const [totalEditar, setTotalEditar] = useState("");
  const [puntosEditar, setPuntosEditar] = useState("");
  const [factorEditar, setFactorEditar] = useState("");
  const [fotoEditar, setFotoEditar] = useState("");
  const [tipoProductoEditar, setTipoProductoEditar] = useState("");
  const [tipoPlataformaEditar, setPlataformaEditar] = useState("");
  const [productoId, setProductoId] = useState("");
  const [valueTab, setValueTab] = useState("one");

  const [proveedores, setProveedores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [plataformas, setPlataformas] = useState<any[]>([]);

  const [excelData, setExcelData] = useState<any[]>([]);
  const [isAlertOpenSubirExcel, setIsAlertOpenSubirExcel] = useState(false);
  const [procesandoExcel, setProcesandoExcel] = useState(false);

  const handleisAlertOpenSubirExcel = () => setIsAlertOpenSubirExcel(true);
  const handleisAlerCloseSubirExcel = () => {
    setIsAlertOpenSubirExcel(false);
    setExcelData([]);
  };

  const [buscador, setBuscador] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  //Ver datos del producto
  const [verProducto, setVerProducto] = useState<any>(null);
  const [isAlertOpenVerDatos, setIsAlertOpenVerDatos] = useState(false);
  const handleisAlertOpenVerDatos = () => setIsAlertOpenVerDatos(true);
  const handleisAlertCloseVerDatos = () => setIsAlertOpenVerDatos(false);

  //Ver datos del producto buscando por fechas
  const [isAlertOpenFechas, setIsAlertOpenFechas] = useState(false);
  const handleisAlertOpenFechas = () => setIsAlertOpenFechas(true);
  const handleisAlertCloseFechas = () => setIsAlertOpenFechas(false);

  //Ver bitacora del producto
  const [verBitacoraProducto, setVerBitacoraProducto] = useState<any>(null);
  const [isAlertOpenVerBitacoraProducto, setIsAlertOpenVerBitacoraProducto] = useState(false);
  const handleisAlertOpenVerBitacoraProducto = () => setIsAlertOpenVerBitacoraProducto(true);
  const handleisAlertCloseVerBitacoraProducto = () => setIsAlertOpenVerBitacoraProducto(false);

  //Búsqueda intelimagy
  const [procesandoBusquedaMagica, setProcesandoBusquedaMagica] = useState<boolean>(false);
  const [isAlertOpenBI, setIsAlertOpenBI] = useState(false);
  const handleisAlertOpenBI = () => setIsAlertOpenBI(true);
  const handleisAlertCloseBI = () => setIsAlertOpenBI(false);

  const [buscarPorPuntos, setBuscarPorPuntos] = useState("");
  const [categoriaBuscar, setCategoriaBuscar] = useState("");

  //Registrar automaticamente proveedores y categorias
  const [procesandoRegistroFaltantes, setProcesandoRegistroFaltantes] = useState(false);

  const [visualizacion, setVisualizacion] = useState<string | null>("cuadricula");
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };

  //colores
  const [verEditarColor, setVerEditarColor] = useState<any>(null);
  const [procesandoColor, setProcesandoColor] = useState(false);
  const [colores, setColores] = useState<any[]>([]);
  const [isAlertOpenEditarColor, setIsAlertOpenEditarColor] = useState(false);
  const handleisAlertOpenEditarColor = () => setIsAlertOpenEditarColor(true);
  const handleisAlertCloseEditarColor = () => setIsAlertOpenEditarColor(false);
  const [editaColor, setEditaColor] = useState("");

  //tallas
  const [verEditarTalla, setVerEditarTalla] = useState<any>(null);
  const [procesandoTalla, setProcesandoTalla] = useState(false);
  const [tallas, setTallas] = useState<any[]>([]);
  const [isAlertOpenEditarTalla, setIsAlertOpenEditarTalla] = useState(false);
  const handleisAlertOpenEditarTalla = () => setIsAlertOpenEditarTalla(true);
  const handleisAlertCloseEditarTalla = () => setIsAlertOpenEditarTalla(false);
  const [editaTalla, setEditaTalla] = useState("");

  //Para fotos del producto
  const [fotos, setFotos] = useState<any[]>([]);
  const [procesandoFotosProducto, setProcesandoFotosProducto] = useState<boolean>(false);
  const [fotosProductoFiles, setFotosProductoFiles] = useState<File[]>([]);
  const [isModalFotosProducto, setIsModalFotosProducto] = useState(false);
  const handleOpenFotosProducto = () => setIsModalFotosProducto(true);
  const handleCloseFotosProducto = () => setIsModalFotosProducto(false);

  const [isModalVistaFotosProducto, setIsModalVistaFotosProducto] = useState(false);
  const [fotosProductoSeleccionada, setFotosProductoSeleccionada] = useState<any>(null);

  //Para fotos promo del producto
  const [fotosPromo, setFotosPromo] = useState<any[]>([]);
  const [procesandoFotosPromoProducto, setProcesandoFotosPromoProducto] = useState<boolean>(false);
  const [fotosPromoProductoFiles, setFotosPromoProductoFiles] = useState<File[]>([]);
  const [isModalFotosPromoProducto, setIsModalFotosPromoProducto] = useState(false);
  const handleOpenFotosPromoProducto = () => setIsModalFotosPromoProducto(true);
  const handleCloseFotosPromoProducto = () => setIsModalFotosPromoProducto(false);

  const [isModalVistaFotosPromoProducto, setIsModalVistaFotosPromoProducto] = useState(false);
  const [fotosPromoProductoSeleccionada, setFotosPromoProductoSeleccionada] = useState<any>(null);

  const handleOpenVistaFotosProducto = (fotos_producto: any) => {
    setFotosProductoSeleccionada(fotos_producto);
    setIsModalVistaFotosProducto(true);
  };

  const handleCloseVistaFotosProducto = () => {
    setIsModalVistaFotosProducto(false);
    setFotosProductoSeleccionada(null);
  };

  const handleOpenVistaFotosPromoProducto = (fotos_producto: any) => {
    setFotosPromoProductoSeleccionada(fotos_producto);
    setIsModalVistaFotosPromoProducto(true);
  };

  const handleCloseVistaFotosPromoProducto = () => {
    setIsModalVistaFotosPromoProducto(false);
    setFotosPromoProductoSeleccionada(null);
  };

  const [fotoProductoPrincipalFile, setFotoProductoPrincipalFile] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  const esDigital = location.pathname.includes("productos-digitales");
  const esFisico = location.pathname.includes("productos-fisicos");

  const handleChangeFotoProductoPrincipal = (file: File | null) => {
    setFotoProductoPrincipalFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewFoto(url);
    } else {
      setPreviewFoto(null);
    }
  };

  const formikColor = useFormik({
    initialValues: {
      color: "",
    },
    validationSchema: Yup.object({
      color: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
    }),
    onSubmit: async (values) => {
      //console.log("Formulario enviado:", values);
    },
  });

  const formikTalla = useFormik({
    initialValues: {
      talla: "",
    },
    validationSchema: Yup.object({
      talla: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
    }),
    onSubmit: async (values) => {
      //console.log("Formulario enviado:", values);
    },
  });

  // Convierte nombres de color (red, blue) a hex
  const colorNameToHex = (color: string): string => {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return color;
    ctx.fillStyle = color;
    const computed = ctx.fillStyle;
    // Si no pudo convertir, devuelve el valor original
    return computed.startsWith("#") ? computed : color;
  };

  const esColorValido = (color: string): boolean => {
    const s = new Option().style;
    s.color = color;
    return s.color !== "";
  };

  // Dentro de tu componente
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const colorHex = esColorValido(colorEditar) ? colorNameToHex(colorEditar) : "#000000";

  const handleVisualizacion = (
    event: React.MouseEvent<HTMLElement>,
    nuevaVisualizacion: string | null
  ) => {
    setVisualizacion(nuevaVisualizacion);
  };

  const handleAccion = (accion: string, row: any) => {
    switch (accion) {
      case "vista_previa":
        setVerProducto(row);
        handleisAlertOpenVerDatos();
        break;
      case "editar":
        setProductoEditar(row);
        handleisAlertOpenEditarProducto();
        break;
      case "eliminar":
        setProductoId(row?.id);
        handleisAlertOpenEliminaProducto();
        break;
      default:
        break;
    }
  };

  //Categorías que no están registradas
  const obtenerCategoriasFaltantes = useCallback(() => {
    const categoriasFaltantes = Array.from(
      new Set(excelData.filter((p) => !p.categoria_valida).map((p) => p.catalogo))
    );
    return categoriasFaltantes.filter(Boolean);
  }, [excelData]);

  //Obtiene los proveedores únicos que no están registrados
  const obtenerProveedoresFaltantes = useCallback(() => {
    const proveedoresFaltantes = Array.from(
      new Set(
        excelData
          .filter((p) => {
            const esVacioONA = !p.proveedor || p.proveedor.toUpperCase() === "N/A";
            return !p.proveedor_valido && !esVacioONA;
          })
          .map((p) => p.proveedor)
      )
    );
    return proveedoresFaltantes.filter(Boolean);
  }, [excelData]);

  //Obtiene las plataformas que no están registradas
  const obtenerPlataformasFaltantes = useCallback(() => {
    const plataformasFaltantes = Array.from(
      new Set(excelData.filter((p) => !p.plataforma_valida).map((p) => p.plataforma))
    );
    return plataformasFaltantes.filter(Boolean);
  }, [excelData]);

  //Registra proveedores y categorías faltantes
  const registrarProveedoresYCategoriasFaltantes = async () => {
    try {
      setProcesandoRegistroFaltantes(true);

      const categoriasFaltantes = obtenerCategoriasFaltantes();
      const proveedoresFaltantes = obtenerProveedoresFaltantes();
      const plataformasFaltantes = obtenerPlataformasFaltantes();

      let categoriasCreadas = 0;
      let proveedoresCreados = 0;
      let plataformasCreadas = 0;
      const errores: string[] = [];

      // Registrar categorías faltantes
      for (const nombreCategoria of categoriasFaltantes) {
        try {
          await crearCategoriaHttp({
            nombre: nombreCategoria,
          });
          categoriasCreadas++;
        } catch (error) {
          console.error(`Error al crear categoría "${nombreCategoria}":`, error);
          errores.push(`Categoría "${nombreCategoria}": ${getErrorHttpMessage(error)}`);
        }
      }

      // Registrar proveedores faltantes
      for (const nombreProveedor of proveedoresFaltantes) {
        try {
          await crearProveedorHttp({
            nombre: nombreProveedor,
            razon_social: null,
            descripcion: "Proveedor registrado desde Excel",
            nombre_contacto: null,
            telefono: null,
            correo: null,
          });
          proveedoresCreados++;
        } catch (error) {
          console.error(`Error al crear proveedor "${nombreProveedor}":`, error);
          errores.push(`Proveedor "${nombreProveedor}": ${getErrorHttpMessage(error)}`);
        }
      }

      // Registrar proveedores faltantes
      for (const nombrePlataforma of plataformasFaltantes) {
        try {
          await crearPlataformaHttp({
            nombre: nombrePlataforma,
            descripcion: "Plataforma registrada desde Excel",
          });
          plataformasCreadas++;
        } catch (error) {
          console.error(`Error al crear la plataforma "${nombrePlataforma}":`, error);
          errores.push(`Plataforma "${nombrePlataforma}": ${getErrorHttpMessage(error)}`);
        }
      }

      // Recargar proveedores y categorías desde el servidor
      const [nuevosProveedores, nuevasCategorias, nuevasPlataformas] = await Promise.all([
        getProveedoresHttp(),
        getCategoriasHttp(),
        getPlataformasHttp(),
      ]);

      // Actualizar el estado con los nuevos datos
      setProveedores(nuevosProveedores);
      setCategorias(nuevasCategorias);
      setPlataformas(nuevasPlataformas);

      // Revalidar productos con los nuevos proveedores y categorías
      const datosActualizados = excelData.map((producto) => {
        const proveedorObj = nuevosProveedores?.find(
          (p: any) => p.nombre.toLowerCase().trim() === producto.proveedor.toLowerCase().trim()
        );
        const categoriaObj = nuevasCategorias?.find(
          (c: any) => c.desc.toLowerCase().trim() === producto.catalogo.toLowerCase().trim()
        );
        const plataformaObj = nuevasPlataformas?.find(
          (c: any) => c.nombre.toLowerCase().trim() === producto.plataforma.toLowerCase().trim()
        );

        return {
          ...producto,
          id_proveedor: proveedorObj?.id || producto.id_proveedor,
          id_catalogo: categoriaObj?.id || producto.id_catalogo,
          proveedor_valido: !!proveedorObj,
          categoria_valida: !!categoriaObj,
          plataforma_valida: !!plataformaObj,
        };
      });

      setExcelData(datosActualizados);
      setTableKey((prev) => prev + 1);
      setProcesandoRegistroFaltantes(false);

      // Mensaje de resultado
      let mensaje = `✓ Proceso completado:\n`;
      if (categoriasCreadas > 0) {
        mensaje += `Categorías creadas: ${categoriasCreadas}\n`;
      }
      if (proveedoresCreados > 0) {
        mensaje += `Proveedores creados: ${proveedoresCreados}\n`;
      }
      if (plataformasCreadas > 0) {
        mensaje += `Plataformas creadas: ${plataformasCreadas}\n`;
      }
      if (errores.length > 0) {
        mensaje += `\n⚠️ Errores (${errores.length}):\n${errores.slice(0, 3).join("\n")}`;
        if (errores.length > 3) {
          mensaje += `\n... y ${errores.length - 3} más`;
        }
      }

      setMensajeAlert(mensaje);
      handleisAlertOpen();
    } catch (error) {
      //console.error("Error general al registrar proveedores y categorías:", error);
      setProcesandoRegistroFaltantes(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || "Error al registrar");
      handleisAlertOpen();
    }
  };

  //Verificar si hay productos válidos para guardar
  const hayProductosValidos = useCallback(() => {
    return excelData.some(
      (p) => p.proveedor_valido && p.categoria_valida && p.plataforma_valida // && p.sku_vacio
    );
  }, [excelData]);

  //Verificar si hay proveedores, categorías o plataformas faltantes
  const hayFaltantes = useCallback(() => {
    return (
      obtenerCategoriasFaltantes().length > 0 ||
      obtenerProveedoresFaltantes().length > 0 ||
      obtenerPlataformasFaltantes().length > 0
    );
  }, [obtenerCategoriasFaltantes, obtenerProveedoresFaltantes, obtenerPlataformasFaltantes]);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  useEffect(() => {
    if (productoEditar && proveedores && categorias && plataformas) {
      const proveedorEncontrado = proveedores.find((p) => p.nombre === productoEditar.proveedor);
      const categoriaEncontrada = categorias.find((p) => p.desc === productoEditar.catalogo);
      setNombreProductoEditar(productoEditar.nombre_producto || "");
      setDescripcionEditar(productoEditar.descripcion || "");
      setMarcaEditar(productoEditar.marca || "");
      setSkuEditar(productoEditar.sku || "");
      setColorEditar(productoEditar.color || "");
      setTallaEditar(productoEditar.talla || "");
      setIdProveedorEditar(proveedorEncontrado?.id || "");
      setIdCatalogoEditar(categoriaEncontrada?.id || "");
      setCostoConIvaEditar(productoEditar.costo_con_iva || "");
      setCostoSinIvaEditar(productoEditar.costo_sin_iva || "");
      setCostoPuntosConIvaEditar(productoEditar.costo_puntos_con_iva || "");
      setCostoPuntosSinIvaEditar(productoEditar.costo_puntos_sin_iva || "");
      setFeeBrimagyEditar(productoEditar.fee_brimagy || "");
      setSubtotalEditar(productoEditar.subtotal || "");
      setEnvioBaseEditar(productoEditar.envio_base || "");
      setCostoCajaEditar(productoEditar.costo_caja || "");
      setEnvioExtraEditar(productoEditar.envio_extra || "");
      setTotalEnvioEditar(productoEditar.total_envio || "");
      setTotalEditar(productoEditar.total || "");
      setPuntosEditar(productoEditar.puntos || "");
      setFactorEditar(productoEditar.factor || "");
      setTipoProductoEditar(productoEditar.tipo_producto || "");
      setPlataformaEditar(productoEditar.id_plataforma || "");
      setFotoEditar(
        productoEditar.foto_producto
          ? `${env.API_URL_ASSETS}fotos_producto/${productoEditar?.id}/${productoEditar.foto_producto}`
          : ""
      );
    }
  }, [productoEditar]);
  // Debounce para evitar muchas peticiones
  const handleBuscadorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBuscador(value);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      getProductosCatalogo({ search: value, fecha1, fecha2 });
    }, 500);

    setDebounceTimeout(timeout);
  };

  const getProductosCatalogo = useCallback(
    async (params?: { search?: string; fecha1?: string; fecha2?: string }) => {
      try {
        setProcesando(true);
        const productosData = await getCatalogoProductosHttp(
          esDigital ? "digital" : esFisico ? "fisico" : "todos",
          params?.search,
          params?.fecha1 ? new Date(params.fecha1) : undefined,
          params?.fecha2 ? new Date(params.fecha2) : undefined
        );
        setProductos(productosData);
        setTableKey((prev) => prev + 1);
        setProcesando(false);
      } catch (error) {
        setProcesando(false);
        const message = getErrorHttpMessage(error);
        setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
        handleisAlertOpen();
      }
    },
    [esDigital, esFisico]
  );

  const getBitacoraProductoPorId = async (datos: any) => {
    try {
      setProcesando(true);
      const data = await getBitacoraProductoPorIdHttp(datos);
      setVerBitacoraProducto(data);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  };

  const editaProducto = async (datos: any) => {
    try {
      setProcesandoEditar(true);
      const productosData = await editarProductoHttp(datos);
      await getProductosCatalogo();
      setProcesandoEditar(false);
      setMensajeAlert(intl.formatMessage({ id: "producto_editado_correctamente" }));
      handleisAlertOpen();
      handleisAlerCloseEditarProducto();
    } catch (error) {
      setProcesandoEditar(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "producto_editado_error" }));
      handleisAlertOpen();
    }
  };

  const eliminarProducto = async (id: number) => {
    try {
      setProcesando(true);
      const productosData = await eliminarProductoHttp(id);
      await getProductosCatalogo();
      setProcesando(false);
      setMensajeAlert(intl.formatMessage({ id: "producto_eliminado_correctamente" }));
      handleisAlertOpen();
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "producto_eliminado_error" }));
      handleisAlertOpen();
    }
  };

  const getProveedores = useCallback(async () => {
    try {
      setProcesando(true);
      const proveedores = await getProveedoresHttp();
      setProveedores(proveedores);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getCategoriasProducto = useCallback(async () => {
    try {
      setProcesando(true);
      const categorias = await getCategoriasHttp();
      setCategorias(categorias);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getPlataformas = useCallback(async () => {
    try {
      setProcesando(true);
      const data = await getPlataformasHttp();
      setPlataformas(data);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  useEffect(() => {
    getCategoriasProducto();
    getProveedores();
    getProductosCatalogo();
    getPlataformas();
  }, [getProductosCatalogo, getCategoriasProducto, getProveedores]);

  // Función para procesar el Excel con ExcelJS
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setProcesando(true);
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();

      await workbook.xlsx.load(arrayBuffer);

      // Obtener la primera hoja
      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        setMensajeAlert("El archivo Excel no contiene hojas");
        handleisAlertOpen();
        setProcesando(false);
        return;
      }

      const datosFormateados: any[] = [];
      const erroresValidacion: string[] = [];

      // Leer los headers (primera fila)
      const headers: { [key: number]: string } = {};
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber] = cell.text.toLowerCase().trim();
      });

      const getValueByHeader = (row: ExcelJS.Row, headerName: string): any => {
        const colIndex = Object.keys(headers).find((key) =>
          headers[parseInt(key)].includes(headerName)
        );
        if (colIndex) {
          const cell = row.getCell(parseInt(colIndex));
          return cell.value;
        }
        return "";
      };

      const limpiarNumero = (valor: any): number => {
        if (valor === null || valor === undefined || valor === "") return 0;

        let valorLimpio = String(valor)
          .replace(/\$/g, "")
          .replace(/,/g, "")
          .replace(/\s/g, "")
          .trim();

        const numero = parseFloat(valorLimpio);

        return isNaN(numero) ? 0 : numero;
      };

      // Función para limpiar SKU - solo permite números y letras
      const limpiarSku = (valor: any): string => {
        if (valor === null || valor === undefined) return "";

        const valorStr = String(valor).toUpperCase().trim();

        if (valorStr === "N/A" || valorStr === "") return "N/A";

        return (
          valorStr
            .normalize("NFD") // Normalizar para separar acentos
            .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
            .replace(/[^A-Z0-9]/g, "") // Solo letras y números
            .trim() || "N/A"
        );
      };

      // Función para limpiar texto con caracteres permitidos -_',
      const limpiarTextoConCaracteres = (valor: any): string => {
        if (valor === null || valor === undefined) return "";

        return String(valor)
          .replace(/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ\-_',()]/g, "") // Solo letras, números, espacios, acentos y -_',()
          .trim();
      };

      const limpiarTexto = (valor: any): string => {
        if (valor === null || valor === undefined) return "";
        return String(valor).trim();
      };

      // Función para validar que solo contenga números
      const esNumeroValido = (valor: any): boolean => {
        if (valor === null || valor === undefined || valor === "") return true;

        const valorLimpio = String(valor)
          .replace(/\$/g, "")
          .replace(/,/g, "")
          .replace(/\s/g, "")
          .trim();

        return !isNaN(parseFloat(valorLimpio)) && isFinite(parseFloat(valorLimpio));
      };

      // Función para validar caracteres especiales en texto
      const tieneCaracteresNoPermitidos = (valor: string, tipo: "texto" | "sku"): boolean => {
        if (!valor) return false;

        if (tipo === "sku") {
          // SKU: solo letras y números
          return !/^[A-Z0-9]+$/i.test(valor);
        } else {
          // Texto: letras, números, espacios, acentos y -_',()
          return /[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ\-_',()]/.test(valor);
        }
      };

      const valoresVacios = (valor: string, tipo: "texto" | "sku"): boolean => {
        if (!valor) return false;

        if (tipo === "sku" && valor !== "N/A") {
          // SKU: solo letras y números
          return !/^[A-Z0-9]+$/i.test(valor);
        } else {
          // Texto: letras, números, espacios, acentos y -_',()
          return /[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ\-_',()]/.test(valor);
        }
      };

      // Leer datos desde la fila 2 (después del header)
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const proveedor = String(getValueByHeader(row, "proveedor") || "").trim();
        const proveedorVacio = !proveedor || proveedor.toUpperCase() === "N/A";

        const categoria = String(
          getValueByHeader(row, "categoría") ||
            getValueByHeader(row, "categoria") ||
            getValueByHeader(row, "catalogo") ||
            ""
        ).trim();

        const nombre_producto = limpiarTextoConCaracteres(getValueByHeader(row, "nombre"));
        const descripcion = limpiarTextoConCaracteres(
          getValueByHeader(row, "descripción") || getValueByHeader(row, "descripcion")
        );
        const marca = limpiarTextoConCaracteres(getValueByHeader(row, "marca"));
        const sku = limpiarSku(getValueByHeader(row, "sku"));
        const skuVacio = !sku || sku.trim() === "" || sku === "N/A";
        const color = limpiarTexto(getValueByHeader(row, "color"));
        const talla = getValueByHeader(row, "talla");
        const id_producto_brimagy = getValueByHeader(row, "id producto");
        const idBrimagyVacio = !id_producto_brimagy;

        // Validaciones de campos de texto
        if (nombre_producto && tieneCaracteresNoPermitidos(nombre_producto, "texto")) {
          erroresValidacion.push(
            `Fila ${rowNumber}: El nombre del producto contiene caracteres especiales no permitidos (solo se permite: -_',())`
          );
        }

        if (marca && tieneCaracteresNoPermitidos(marca, "texto")) {
          erroresValidacion.push(
            `Fila ${rowNumber}: La marca contiene caracteres especiales no permitidos (solo se permite: -_',())`
          );
        }

        if (sku && tieneCaracteresNoPermitidos(sku, "sku") && sku !== "N/A") {
          erroresValidacion.push(
            `Fila ${rowNumber}: El SKU solo puede contener letras y números (sin espacios ni caracteres especiales)`
          );
        }

        /*if (skuVacio) {
          erroresValidacion.push(`Fila ${rowNumber}: El SKU no puede estar vacío`);
        }*/

        // Obtener y validar valores numéricos
        const costoConIvaRaw = getValueByHeader(row, "costo con iva");
        const costoSinIvaRaw = getValueByHeader(row, "costo sin iva");
        const costoPuntosConIvaRaw = getValueByHeader(row, "costo puntos con iva");
        const costoPuntosSinIvaRaw = getValueByHeader(row, "costo puntos sin iva");
        const feeBrimagyRaw = getValueByHeader(row, "fee brimagy") || getValueByHeader(row, "fee");
        const subtotalRaw = getValueByHeader(row, "subtotal");
        const envioBaseRaw =
          getValueByHeader(row, "envío base") || getValueByHeader(row, "envio base");
        const costoCajaRaw = getValueByHeader(row, "costo caja");
        const envioExtraRaw =
          getValueByHeader(row, "envío extra") || getValueByHeader(row, "envio extra");
        const totalEnvioRaw =
          getValueByHeader(row, "total envío") || getValueByHeader(row, "total envio");
        const totalRaw = getValueByHeader(row, "total");
        const puntosRaw = getValueByHeader(row, "puntos");
        const factorRaw = getValueByHeader(row, "factor");
        const tipoProductoRaw = getValueByHeader(row, "tipo producto");
        const plataforma = getValueByHeader(row, "plataforma");

        // Validar que los campos numéricos sean válidos
        const camposNumericos = [
          { nombre: "Costo con IVA", valor: costoConIvaRaw },
          { nombre: "Costo sin IVA", valor: costoSinIvaRaw },
          { nombre: "Costo puntos con IVA", valor: costoPuntosConIvaRaw },
          { nombre: "Costo puntos sin IVA", valor: costoPuntosSinIvaRaw },
          { nombre: "Fee Brimagy", valor: feeBrimagyRaw },
          { nombre: "Subtotal", valor: subtotalRaw },
          { nombre: "Envío base", valor: envioBaseRaw },
          { nombre: "Costo caja", valor: costoCajaRaw },
          { nombre: "Envío extra", valor: envioExtraRaw },
          { nombre: "Total envío", valor: totalEnvioRaw },
          { nombre: "Total", valor: totalRaw },
          { nombre: "Puntos", valor: puntosRaw },
          { nombre: "Factor", valor: factorRaw },
        ];

        camposNumericos.forEach((campo) => {
          if (!esNumeroValido(campo.valor)) {
            erroresValidacion.push(
              `Fila ${rowNumber}: ${campo.nombre} debe ser un número válido (valor actual: ${campo.valor})`
            );
          }
        });

        const proveedorObj = proveedorVacio
          ? null
          : proveedores?.find((p) => p.nombre.toLowerCase() === proveedor.toLowerCase());
        const categoriaObj = categorias?.find(
          (c) => c.desc.toLowerCase().trim() === categoria.toLowerCase().trim()
        );
        const plataformaObj = plataformas?.find(
          (c) => c.nombre.toLowerCase().trim() === plataforma.toLowerCase().trim()
        );

        const producto = {
          id: rowNumber - 1,
          fila: rowNumber,
          id_catalogo: categoriaObj?.id || null,
          catalogo: categoria,
          nombre_producto,
          descripcion,
          marca,
          proveedor,
          id_proveedor: proveedorObj?.id || null,
          sku,
          color,
          talla,
          costo_con_iva: Math.round(limpiarNumero(costoConIvaRaw)),
          costo_sin_iva: Math.round(limpiarNumero(costoSinIvaRaw)),
          costo_puntos_con_iva: Math.round(limpiarNumero(costoPuntosConIvaRaw)),
          costo_puntos_sin_iva: Math.round(limpiarNumero(costoPuntosSinIvaRaw)),
          fee_brimagy: Math.round(limpiarNumero(feeBrimagyRaw)),
          subtotal: Math.round(limpiarNumero(subtotalRaw)),
          envio_base: Math.round(limpiarNumero(envioBaseRaw)),
          costo_caja: Math.round(limpiarNumero(costoCajaRaw)),
          envio_extra: Math.round(limpiarNumero(envioExtraRaw)),
          total_envio: Math.round(limpiarNumero(totalEnvioRaw)),
          total: Math.round(limpiarNumero(totalRaw)),
          puntos: Math.round(limpiarNumero(puntosRaw)),
          factor: Math.round(limpiarNumero(factorRaw)),
          tipo_producto: tipoProductoRaw,
          //proveedor_valido: !!proveedorObj,
          proveedor_valido: proveedorVacio ? true : !!proveedorObj,
          proveedor_vacio: proveedorVacio,
          categoria_valida: !!categoriaObj,
          plataforma_valida: !!plataformaObj,
          sku_duplicado: false,
          id_producto_brimagy_duplicado: false,
          sku_vacio: skuVacio,
          id_producto_brimagy_vacio: idBrimagyVacio,
          plataforma: plataforma,
          id_producto_brimagy: id_producto_brimagy,
        };

        // Solo agregar si tiene al menos nombre y SKU
        if (producto.nombre_producto || producto.sku) {
          datosFormateados.push(producto);
        }
      });

      if (erroresValidacion.length > 0) {
        setProcesando(false);
        setMensajeAlert(
          `Se encontraron ${
            erroresValidacion.length
          } error(es) de validación:\n\n${erroresValidacion.slice(0, 5).join("\n")}${
            erroresValidacion.length > 5 ? `\n... y ${erroresValidacion.length - 5} más` : ""
          }`
        );
        handleisAlertOpen();
        event.target.value = "";
        return;
      }

      const skus = datosFormateados.map((p) => p.sku).filter(Boolean);
      const ids = datosFormateados.map((p) => p.id_producto_brimagy).filter(Boolean);

      if (ids.length > 0) {
        try {
          const idsExistentesResponse = await verificarIdProductoBrimagyHttp(ids);
          const idsExistentes = idsExistentesResponse?.ids_existentes || [];

          datosFormateados.forEach((producto) => {
            if (idsExistentes.includes(producto.id_producto_brimagy)) {
              producto.id_producto_brimagy_duplicado = true;
            }
          });

          const cantidadDuplicados = datosFormateados.filter(
            (p) => p.id_producto_brimagy_duplicado
          ).length;
          if (cantidadDuplicados > 0) {
            setMensajeAlert(
              `⚠️ Se encontraron ${cantidadDuplicados} producto(s) con id existente. Estos productos se actualizarán en lugar de crearse nuevos.`
            );
            handleisAlertOpen();
          }
        } catch (error) {
          console.error("Error al verificar Ids:", error);
        }
      }

      setExcelData(datosFormateados);
      handleisAlertOpenSubirExcel();
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      setMensajeAlert("Error al procesar el archivo Excel: " + error);
      handleisAlertOpen();
    }

    // Limpia el input
    event.target.value = "";
  };

  // Función para descargar plantilla de Excel
  const descargarPlantillaExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Productos");

      // Definir columnas con formato
      worksheet.columns = [
        { header: "Categoría", key: "categoria", width: 25 },
        { header: "Nombre Producto", key: "nombre_producto", width: 30 },
        { header: "Descripción", key: "descripcion", width: 40 },
        { header: "Marca", key: "marca", width: 20 },
        { header: "Proveedor", key: "proveedor", width: 25 },
        { header: "SKU", key: "sku", width: 20 },
        { header: "Color", key: "color", width: 15 },
        { header: "Talla", key: "talla", width: 15 },
        { header: "Costo con IVA", key: "costo_con_iva", width: 15 },
        { header: "Costo sin IVA", key: "costo_sin_iva", width: 15 },
        { header: "Costo Puntos con IVA", key: "costo_puntos_con_iva", width: 20 },
        { header: "Costo Puntos sin IVA", key: "costo_puntos_sin_iva", width: 20 },
        { header: "Fee Brimagy", key: "fee_brimagy", width: 15 },
        { header: "Subtotal", key: "subtotal", width: 15 },
        { header: "Envío Base", key: "envio_base", width: 15 },
        { header: "Costo Caja", key: "costo_caja", width: 15 },
        { header: "Envío Extra", key: "envio_extra", width: 15 },
        { header: "Total Envío", key: "total_envio", width: 15 },
        { header: "Total", key: "total", width: 15 },
        { header: "Puntos", key: "puntos", width: 15 },
        { header: "Factor", key: "factor", width: 15 },
        { header: "Tipo Producto", key: "tipo_producto", width: 15 },
        { header: "Plataforma", key: "plataforma", width: 15 },
      ];

      // Estilo para el header
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF084d6e" },
      };
      worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

      worksheet.addRow({
        categoria: "Categoria1",
        nombre_producto: "Producto Ejemplo",
        descripcion: "Descripción del producto",
        marca: "Marca X",
        proveedor: "Proveedor1",
        sku: "SKU123",
        color: "Rojo",
        talla: "",
        costo_con_iva: 100,
        costo_sin_iva: 86,
        costo_puntos_con_iva: 100,
        costo_puntos_sin_iva: 86,
        fee_brimagy: 10,
        subtotal: 90,
        envio_base: 50,
        costo_caja: 20,
        envio_extra: 10,
        total_envio: 60,
        total: 150,
        puntos: 150,
        factor: 15,
        tipo_producto: "fisico",
        plataforma: "ejemplo1",
      });
      // Generar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `plantilla_productos_${moment().format("DDMMYYYY")}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar plantilla:", error);
      setMensajeAlert("Error al generar la plantilla");
      handleisAlertOpen();
    }
  };

  const descargarProductosExcel = async () => {
    try {
      setProcesando(true);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Productos");

      worksheet.columns = [
        { header: "Id Producto", key: "id_producto", width: 10 },
        { header: "Categoría", key: "categoria", width: 25 },
        { header: "Nombre Producto", key: "nombre_producto", width: 30 },
        { header: "Descripción", key: "descripcion", width: 40 },
        { header: "Marca", key: "marca", width: 20 },
        { header: "Proveedor", key: "proveedor", width: 25 },
        { header: "SKU", key: "sku", width: 20 },
        { header: "Color", key: "color", width: 15 },
        { header: "Talla", key: "talla", width: 15 },
        { header: "Costo con IVA", key: "costo_con_iva", width: 15 },
        { header: "Costo sin IVA", key: "costo_sin_iva", width: 15 },
        { header: "Costo Puntos con IVA", key: "costo_puntos_con_iva", width: 20 },
        { header: "Costo Puntos sin IVA", key: "costo_puntos_sin_iva", width: 20 },
        { header: "Fee Brimagy", key: "fee_brimagy", width: 15 },
        { header: "Subtotal", key: "subtotal", width: 15 },
        { header: "Envío Base", key: "envio_base", width: 15 },
        { header: "Costo Caja", key: "costo_caja", width: 15 },
        { header: "Envío Extra", key: "envio_extra", width: 15 },
        { header: "Total Envío", key: "total_envio", width: 15 },
        { header: "Total", key: "total", width: 15 },
        { header: "Puntos", key: "puntos", width: 15 },
        { header: "Factor", key: "factor", width: 15 },
        { header: "Tipo Producto", key: "tipo_producto", width: 15 },
        { header: "Plataforma", key: "plataforma", width: 15 },
      ];

      // Estilo del header (igual que la plantilla)
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF084d6e" },
      };
      worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

      productos.forEach((p) => {
        const row = worksheet.addRow({
          id_producto: p.id_producto_brimagy || "",
          categoria: p.catalogo || "",
          nombre_producto: p.nombre_producto || "",
          descripcion: p.descripcion || "",
          marca: p.marca || "",
          proveedor: p.proveedor || "",
          sku: p.sku || "",
          color: p.color || "",
          talla: p.talla || "",
          costo_con_iva: p.costo_con_iva ?? 0,
          costo_sin_iva: p.costo_sin_iva ?? 0,
          costo_puntos_con_iva: p.costo_puntos_con_iva ?? 0,
          costo_puntos_sin_iva: p.costo_puntos_sin_iva ?? 0,
          fee_brimagy: p.fee_brimagy ?? 0,
          subtotal: p.subtotal ?? 0,
          envio_base: p.envio_base ?? 0,
          costo_caja: p.costo_caja ?? 0,
          envio_extra: p.envio_extra ?? 0,
          total_envio: p.total_envio ?? 0,
          total: p.total ?? 0,
          puntos: p.puntos ?? 0,
          factor: p.factor ?? 0,
          tipo_producto: p.tipo_producto || "",
          plataforma: p.nombre_plataforma || "",
        });

        const columnasNumericas = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
        columnasNumericas.forEach((col) => {
          row.getCell(col).numFmt = "#,##0.00";
        });
      });

      // Generar y descargar
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `productos_${moment().format("DDMMYYYY_HHmm")}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      console.error("Error al exportar productos:", error);
      setMensajeAlert("Error al exportar los productos");
      handleisAlertOpen();
    }
  };

  // Función para guardar productos
  const guardarProductosExcel = async () => {
    try {
      setProcesandoExcel(true);

      const productosValidos = excelData.filter((p) => p.proveedor_valido && p.categoria_valida);

      const productosInvalidos = excelData.length - productosValidos.length;

      let exitosos = 0;
      let actualizados = 0;
      let fallidos = 0;
      const errores: string[] = [];

      for (const producto of excelData) {
        try {
          /*const datos = {
            id_catalogo: producto.id_catalogo,
            catalogo: producto.catalogo,
            nombre_producto: producto.nombre_producto,
            descripcion: producto.descripcion,
            marca: producto.marca,
            proveedor: producto.proveedor,
            id_proveedor: producto.id_proveedor,
            sku: producto.sku,
            color: producto.color,
            talla: producto.talla,
            costo_con_iva: producto.costo_con_iva,
            costo_sin_iva: producto.costo_sin_iva,
            costo_puntos_con_iva: producto.costo_puntos_con_iva,
            costo_puntos_sin_iva: producto.costo_puntos_sin_iva,
            fee_brimagy: producto.fee_brimagy,
            subtotal: producto.subtotal,
            envio_base: producto.envio_base,
            costo_caja: producto.costo_caja,
            envio_extra: producto.envio_extra,
            total_envio: producto.total_envio,
            total: producto.total,
            puntos: producto.puntos,
            factor: producto.factor,
            id_producto_brimagy: producto.id_producto_brimagy,
            tipo_producto: producto.tipo_producto,
            nombre_plataforma: producto.plataforma,
            tipo_registro: "excel",
          };*/
          const formData = new FormData();
          formData.append("id_catalogo", producto.id_catalogo);
          formData.append("catalogo", producto.catalogo);
          formData.append("nombre_producto", producto.nombre_producto);
          formData.append("descripcion", producto.descripcion);
          formData.append("marca", producto.marca);
          formData.append("proveedor", producto.proveedor);
          formData.append("id_proveedor", producto.id_proveedor ?? "");
          formData.append("sku", producto.sku);
          formData.append("color", producto.color);
          formData.append("talla", producto.talla);
          formData.append("costo_con_iva", producto.costo_con_iva);
          formData.append("costo_sin_iva", producto.costo_sin_iva);
          formData.append("costo_puntos_con_iva", producto.costo_puntos_con_iva);
          formData.append("costo_puntos_sin_iva", producto.costo_puntos_sin_iva);
          formData.append("fee_brimagy", producto.fee_brimagy);
          formData.append("subtotal", producto.subtotal);
          formData.append("envio_base", producto.envio_base);
          formData.append("costo_caja", producto.costo_caja);
          formData.append("envio_extra", producto.envio_extra);
          formData.append("total_envio", producto.total_envio);
          formData.append("total", producto.total);
          formData.append("puntos", producto.puntos);
          formData.append("factor", producto.factor);
          formData.append("id_producto_brimagy", producto.id_producto_brimagy);
          formData.append("tipo_producto", producto.tipo_producto);
          formData.append("nombre_plataforma", producto.plataforma);
          formData.append("tipo_registro", "excel");

          const response: any = await crearProductoHttp(formData);

          if (response.data?.actualizado) {
            actualizados++;
          } else {
            exitosos++;
          }
        } catch (error) {
          fallidos++;
          errores.push(`SKU ${producto.sku}: ${getErrorHttpMessage(error)}`);
        }
      }

      await getProductosCatalogo();
      setProcesandoExcel(false);
      handleisAlerCloseSubirExcel();

      let mensaje = `✓ Nuevos productos: ${exitosos}`;
      if (actualizados > 0) {
        mensaje += ` | 🔄 Actualizados: ${actualizados}`;
      }
      if (fallidos > 0) {
        mensaje += ` | ✗ Fallidos: ${fallidos}`;
      }

      if (productosInvalidos > 0) {
        mensaje += ` | ⚠️ Omitidos (SKU vacío o datos inválidos): ${productosInvalidos}`;
      }

      setMensajeAlert(mensaje);
      handleisAlertOpen();
    } catch (error) {
      setProcesandoExcel(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || "Error al guardar los productos");
      handleisAlertOpen();
    }
  };

  //Búsqueda inteligente
  const busquedaInteligenteBrimagy = useCallback(async (datos?: any) => {
    try {
      setProcesandoBusquedaMagica(true);
      const busqueda = await getBusquedaInteligenteHttp(datos);
      // Formatear los datos igual que en getProductosCatalogo
      const datosFormateados = busqueda.map((e: any) => {
        return {
          ...e,
          ...{
            costo_con_iva_format: numericFormatter(e?.costo_con_iva + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            costo_sin_iva_format: numericFormatter(e?.costo_sin_iva + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            costo_puntos_con_iva_format: numericFormatter(e?.costo_puntos_con_iva + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            costo_puntos_sin_iva_format: numericFormatter(e?.costo_puntos_sin_iva + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            subtotal_format: numericFormatter(e?.subtotal + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            envio_base_format: numericFormatter(e?.envio_base + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            costo_caja_format: numericFormatter(e?.costo_caja + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            envio_extra_format: numericFormatter(e?.envio_extra + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            total_envio_format: numericFormatter(e?.total_envio + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            total_format: numericFormatter(e?.total + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            fee_brimagy_format: numericFormatter(e?.fee_brimagy + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            puntos_format: numericFormatter(e?.puntos + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "",
            }),
            factor_format: numericFormatter(e?.factor + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "",
            }),
            fecha_creacion: moment(e?.fecha_ejecucion).format("DD-MM-YYYY"),
          },
        };
      });
      setProductos(datosFormateados);
      setProcesandoBusquedaMagica(false);
      handleisAlertCloseBI();
      setMensajeAlert(`Se encontraron ${datosFormateados.length} productos relacionados`);
      handleisAlertOpen();
    } catch (error) {
      setProcesandoBusquedaMagica(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  //colores
  const getProductoColorPorId = useCallback(async (datos: any) => {
    try {
      setProcesando(true);
      const colores = await getProductoColorPorIdHttp(datos);
      setColores(colores);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);
  const crearEditarColorProducto = async (datos: any) => {
    try {
      setProcesandoColor(true);
      const response: any = await crearEditarColorProductoHttp(datos);
      const colorData = response?.data;

      const esEdicion = !!datos?.id_color;

      console.log("response completo:", response);

      if (esEdicion) {
        setColores((prevColores: any[]) =>
          prevColores.map((c) =>
            c.id === colorData?.id
              ? { ...c, color: colorData?.color, status: colorData?.status }
              : c
          )
        );
      } else if (colorData) {
        setColores((prevColores: any[]) => [...prevColores, colorData]);
      }

      const datosRefresh = {
        id_producto: colorData?.id_producto ?? datos?.id_producto_dirac,
      };
      await getProductoColorPorId(datosRefresh);

      setMensajeAlert(
        esEdicion ? "Color actualizado exitosamente." : "Color registrado exitosamente."
      );
      formikColor.resetForm();
      if (esEdicion) {
        handleisAlertCloseEditarColor();
      }
      handleisAlertOpen();
      setProcesandoColor(false);
    } catch (error) {
      setProcesandoColor(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(
        message
          ? message
          : !!datos?.id_color
          ? intl.formatMessage({ id: "error_editar_color" })
          : intl.formatMessage({ id: "error_crear_color" })
      );
      handleisAlertOpen();
    }
  };

  const desactivarColorProducto = async (datos: any) => {
    try {
      setProcesando(true);
      const color: any = await desactivarColorProductoHttp(datos);
      setColores((prevColores: any[]) => {
        return prevColores.map((c) => {
          if (c.id === color.id) {
            return {
              ...c,
              status: color.status,
            };
          }
          return c;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "color_desactivado_correctamente" }));
      handleisAlertOpen();
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "color_desactivado_error" }));
      handleisAlertOpen();
    }
  };
  const activarColorProducto = async (datos: any) => {
    try {
      setProcesando(true);
      const color: any = await activarColorProductoHttp(datos);
      setColores((prevColores: any[]) => {
        return prevColores.map((c) => {
          if (c.id === color.id) {
            return {
              ...c,
              status: color.status,
            };
          }
          return c;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "color_activado_correctamente" }));
      handleisAlertOpen();
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "color_activado_error" }));
      handleisAlertOpen();
    }
  };
  //tallas
  //colores y tallas
  const getProductoTallaPorId = useCallback(async (datos: any) => {
    try {
      setProcesando(true);
      const tallas = await getProductoTallaPorIdHttp(datos);
      setTallas(tallas);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);
  const crearEditarTallaProducto = async (datos: any) => {
    try {
      setProcesandoTalla(true);
      const response: any = await crearEditarTallaProductoHttp(datos);
      const tallaData = response?.data;

      const esEdicion = !!datos?.id_talla;

      console.log("response completo:", response);

      if (esEdicion) {
        setTallas((prevTallas: any[]) =>
          prevTallas.map((t) =>
            t.id === tallaData?.id
              ? { ...t, color: tallaData?.color, status: tallaData?.status }
              : t
          )
        );
      } else if (tallaData) {
        setTallas((prevTallas: any[]) => [...prevTallas, tallaData]);
      }

      const datosRefresh = {
        id_producto: tallaData?.id_producto ?? datos?.id_producto_dirac,
      };
      await getProductoTallaPorId(datosRefresh);

      setMensajeAlert(
        esEdicion ? "Talla actualizada exitosamente." : "Talla registrada exitosamente."
      );
      formikTalla.resetForm();
      if (esEdicion) {
        handleisAlertCloseEditarTalla();
      }
      handleisAlertOpen();
      setProcesandoTalla(false);
    } catch (error) {
      setProcesandoTalla(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(
        message
          ? message
          : !!datos?.id_tall
          ? intl.formatMessage({ id: "error_editar_talla" })
          : intl.formatMessage({ id: "error_crear_talla" })
      );
      handleisAlertOpen();
    }
  };

  const desactivarTallaProducto = async (datos: any) => {
    try {
      setProcesando(true);
      const color: any = await desactivarTallaProductoHttp(datos);
      setTallas((prevTallas: any[]) => {
        return prevTallas.map((c) => {
          if (c.id === color.id) {
            return {
              ...c,
              status: color.status,
            };
          }
          return c;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "talla_desactivada_correctamente" }));
      handleisAlertOpen();
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "talla_desactivada_error" }));
      handleisAlertOpen();
    }
  };
  const activarTallaProducto = async (datos: any) => {
    try {
      setProcesando(true);
      const talla: any = await activarTallaProductoHttp(datos);
      setTallas((prevTallas: any[]) => {
        return prevTallas.map((t) => {
          if (t.id === talla.id) {
            return {
              ...t,
              status: talla.status,
            };
          }
          return t;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "talla_activada_correctamente" }));
      handleisAlertOpen();
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "talla_activada_error" }));
      handleisAlertOpen();
    }
  };
  //fotos del producto
  const subirFotosProducto = async (data: FormData) => {
    try {
      setProcesandoFotosProducto(true);
      const resultado = await subirFotosProductoHttp(data);
      if (resultado && Array.isArray(resultado)) {
        setFotos(resultado);
      }
      setMensajeAlert(intl.formatMessage({ id: "http_exito_fotos_subidas" }));
      handleisAlertOpen();
      setProcesandoFotosProducto(false);
    } catch (error) {
      setProcesandoFotosProducto(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "fotos_subidas_error" }));
      handleisAlertOpen();
    }
  };
  const getProductoFotoPorId = useCallback(async (datos: any) => {
    try {
      setProcesando(true);
      const fotos = await getProductoFotoPorIdHttp(datos);
      setFotos(fotos);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);
  const desactivarFotosProducto = async (datos: any) => {
    try {
      setProcesando(true);
      const fotos: any = await desactivarFotosProductoHttp(datos);
      setFotos((prevFotos: any[]) => {
        return prevFotos.map((f) => {
          if (f.id === fotos.id) {
            return {
              ...f,
              status: fotos.status,
            };
          }
          return f;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "foto_desactivada_correctamente" }));
      handleisAlertOpen();
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "foto_desactivada_error" }));
      handleisAlertOpen();
    }
  };
  const activarFotosProducto = async (datos: any) => {
    try {
      setProcesando(true);
      const fotos: any = await activarFotosProductoHttp(datos);
      setFotos((prevFotos: any[]) => {
        return prevFotos.map((f) => {
          if (f.id === fotos.id) {
            return {
              ...f,
              status: fotos.status,
            };
          }
          return f;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "foto_activada_correctamente" }));
      handleisAlertOpen();
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "foto_activada_error" }));
      handleisAlertOpen();
    }
  };
  //fotos promo del producto
  const subirFotosPromoProducto = async (data: FormData) => {
    try {
      setProcesandoFotosPromoProducto(true);
      const resultado = await subirFotosPromoProductoHttp(data);
      if (resultado && Array.isArray(resultado)) {
        setFotosPromo(resultado);
      }
      setMensajeAlert(intl.formatMessage({ id: "http_exito_fotos_subidas" }));
      handleisAlertOpen();
      setProcesandoFotosPromoProducto(false);
    } catch (error) {
      setProcesandoFotosPromoProducto(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "fotos_subidas_error" }));
      handleisAlertOpen();
    }
  };
  const getProductoFotoPromoPorId = useCallback(async (datos: any) => {
    try {
      setProcesando(true);
      const fotos = await getProductoFotoPromoPorIdHttp(datos);
      setFotosPromo(fotos);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const desactivarFotosPromoProducto = async (datos: any) => {
    try {
      setProcesando(true);
      const fotos: any = await desactivarFotosPromoProductoHttp(datos);
      setFotosPromo((prevFotos: any[]) => {
        return prevFotos.map((f) => {
          if (f.id === fotos.id) {
            return {
              ...f,
              status: fotos.status,
            };
          }
          return f;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "foto_desactivada_correctamente" }));
      handleisAlertOpen();
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "foto_desactivada_error" }));
      handleisAlertOpen();
    }
  };
  const activarFotosPromoProducto = async (datos: any) => {
    try {
      setProcesando(true);
      const fotos: any = await activarFotosPromoProductoHttp(datos);
      setFotosPromo((prevFotos: any[]) => {
        return prevFotos.map((f) => {
          if (f.id === fotos.id) {
            return {
              ...f,
              status: fotos.status,
            };
          }
          return f;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "foto_activada_correctamente" }));
      handleisAlertOpen();
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "foto_activada_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    if (verEditarColor) {
      setEditaColor(verEditarColor.color || "");
    }
  }, [verEditarColor]);

  useEffect(() => {
    if (verEditarTalla) {
      setEditaTalla(verEditarTalla.talla || "");
    }
  }, [verEditarTalla]);

  return {
    busquedaInteligenteBrimagy,
    verProducto,
    setVerProducto,
    isAlertOpenVerDatos,
    handleisAlertCloseVerDatos,
    handleisAlertOpenVerDatos,
    isSuperAdmin,
    handleBuscadorChange,
    buscador,
    setBuscador,
    navigate,
    productosSeleccionados,
    setProductosSeleccionados,
    asignarPdfDatos,
    isAlertOpenAsignar,
    handleisAlerCloseAsignar,
    handleisAlertOpenAsignar,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    setProcesando,
    setProductoId,
    productoId,
    eliminarProducto,
    openModalConfirmEliminaProducto,
    setOpenModalConfirmEliminaProducto,
    handleisAlertOpenEliminaProducto,
    categorias,
    proveedores,
    nombreProductoEditar,
    setNombreProductoEditar,
    descripcionEditar,
    setDescripcionEditar,
    marcaEditar,
    setMarcaEditar,
    skuEditar,
    setSkuEditar,
    colorEditar,
    setColorEditar,
    tallaEditar,
    setTallaEditar,
    idProveedorEditar,
    setIdProveedorEditar,
    idCatalogoEditar,
    setIdCatalogoEditar,
    costoConIvaEditar,
    setCostoConIvaEditar,
    costoSinIvaEditar,
    setCostoSinIvaEditar,
    costoPuntosConIvaEditar,
    setCostoPuntosConIvaEditar,
    costoPuntosSinIvaEditar,
    setCostoPuntosSinIvaEditar,
    feeBrimagyEditar,
    setFeeBrimagyEditar,
    subtotalEditar,
    setSubtotalEditar,
    envioBaseEditar,
    setEnvioBaseEditar,
    costoCajaEditar,
    setCostoCajaEditar,
    envioExtraEditar,
    setEnvioExtraEditar,
    totalEnvioEditar,
    setTotalEnvioEditar,
    totalEditar,
    setTotalEditar,
    puntosEditar,
    setPuntosEditar,
    factorEditar,
    setFactorEditar,
    procesandoEditar,
    tableKey,
    productoEditar,
    setProductoEditar,
    handleisAlertOpenEditarProducto,
    handleisAlerCloseEditarProducto,
    isAlertOpenEditarProducto,
    productos,
    editaProducto,
    //excel
    excelData,
    isAlertOpenSubirExcel,
    handleisAlerCloseSubirExcel,
    handleFileUpload,
    guardarProductosExcel,
    procesandoExcel,
    descargarPlantillaExcel,
    descargarProductosExcel,
    //Búsqueda intelimagy
    isAlertOpenBI,
    handleisAlertOpenBI,
    handleisAlertCloseBI,
    buscarPorPuntos,
    setBuscarPorPuntos,
    categoriaBuscar,
    setCategoriaBuscar,
    procesandoBusquedaMagica,
    //insertar proveedores y categorias automaticamente
    procesandoRegistroFaltantes,
    registrarProveedoresYCategoriasFaltantes,
    obtenerCategoriasFaltantes,
    obtenerProveedoresFaltantes,
    obtenerPlataformasFaltantes,
    hayProductosValidos,
    hayFaltantes,
    //filtros personalizados
    visualizacion,
    handleVisualizacion,
    handleAccion,
    //busqueda por fechas
    isAlertOpenFechas,
    handleisAlertCloseFechas,
    handleisAlertOpenFechas,
    fecha1,
    setFecha1,
    fecha2,
    setFecha2,
    getProductosCatalogo,
    //ver bitacora del producto
    verBitacoraProducto,
    setVerBitacoraProducto,
    isAlertOpenVerBitacoraProducto,
    handleisAlertOpenVerBitacoraProducto,
    handleisAlertCloseVerBitacoraProducto,
    getBitacoraProductoPorId,
    //color picker
    colorNameToHex,
    esColorValido,
    anchorEl,
    setAnchorEl,
    colorHex,
    //edicion con brimagy
    valueTab,
    setValueTab,
    handleChangeTab,
    //colores
    crearEditarColorProducto,
    getProductoColorPorId,
    formikColor,
    colores,
    setVerEditarColor,
    verEditarColor,
    isAlertOpenEditarColor,
    handleisAlertOpenEditarColor,
    handleisAlertCloseEditarColor,
    procesandoColor,
    setEditaColor,
    editaColor,
    desactivarColorProducto,
    activarColorProducto,
    //tallas
    crearEditarTallaProducto,
    getProductoTallaPorId,
    formikTalla,
    tallas,
    setVerEditarTalla,
    verEditarTalla,
    isAlertOpenEditarTalla,
    handleisAlertOpenEditarTalla,
    handleisAlertCloseEditarTalla,
    procesandoTalla,
    setEditaTalla,
    editaTalla,
    desactivarTallaProducto,
    activarTallaProducto,
    //fotos del producto
    procesandoFotosProducto,
    fotosProductoFiles,
    setFotosProductoFiles,
    isModalFotosProducto,
    handleOpenFotosProducto,
    handleCloseFotosProducto,
    isModalVistaFotosProducto,
    fotosProductoSeleccionada,
    handleOpenVistaFotosProducto,
    handleCloseVistaFotosProducto,
    subirFotosProducto,
    getProductoFotoPorId,
    fotos,
    desactivarFotosProducto,
    activarFotosProducto,
    //fotos promo
    procesandoFotosPromoProducto,
    fotosPromoProductoFiles,
    setFotosPromoProductoFiles,
    isModalFotosPromoProducto,
    handleOpenFotosPromoProducto,
    handleCloseFotosPromoProducto,
    isModalVistaFotosPromoProducto,
    fotosPromoProductoSeleccionada,
    handleOpenVistaFotosPromoProducto,
    handleCloseVistaFotosPromoProducto,
    subirFotosPromoProducto,
    getProductoFotoPromoPorId,
    fotosPromo,
    desactivarFotosPromoProducto,
    activarFotosPromoProducto,
    //foto principal del producto
    fotoProductoPrincipalFile,
    setFotoProductoPrincipalFile,
    previewFoto,
    setPreviewFoto,
    handleChangeFotoProductoPrincipal,
    fotoEditar,
  };
};

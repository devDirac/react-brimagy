import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import {
  crearProductoHttp,
  editarProductoHttp,
  eliminarProductoHttp,
  getBusquedaInteligenteHttp,
  getCatalogoProductosHttp,
  verificarSkusHttp,
} from "actions/productos";
import { numericFormatter } from "react-number-format";
import moment from "moment";
import { getProveedoresHttp } from "actions/proveedores";
import { getCategoriasHttp } from "actions/categorias";
import ExcelJS from "exceljs";

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
  const [productoId, setProductoId] = useState("");

  const [proveedores, setProveedores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

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

  //Búsqueda intelimagy
  const [procesandoBusquedaMagica, setProcesandoBusquedaMagica] = useState<boolean>(false);
  const [isAlertOpenBI, setIsAlertOpenBI] = useState(false);
  const handleisAlertOpenBI = () => setIsAlertOpenBI(true);
  const handleisAlertCloseBI = () => setIsAlertOpenBI(false);

  const [buscarPorPuntos, setBuscarPorPuntos] = useState("");
  const [categoriaBuscar, setCategoriaBuscar] = useState("");

  useEffect(() => {
    setAuth(token);
  }, [token]);

  useEffect(() => {
    if (productoEditar && proveedores && categorias) {
      const proveedorEncontrado = proveedores.find((p) => p.nombre === productoEditar.proveedor);
      const categoriaEncontrada = categorias.find((p) => p.nombre === productoEditar.catalogo);
      setNombreProductoEditar(productoEditar.nombre_producto || "");
      setDescripcionEditar(productoEditar.descripcion || "");
      setMarcaEditar(productoEditar.marca || "");
      setSkuEditar(productoEditar.sku || "");
      setColorEditar(productoEditar.color || "");
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
    }
  }, [productoEditar]);

  // Debounce para evitar muchas peticiones
  const handleBuscadorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBuscador(value);

    // Limpia el timeout anterior
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Crea un nuevo timeout
    const timeout = setTimeout(() => {
      getProductosCatalogo(value);
    }, 500); // Espera 500ms después de que el usuario deje de escribir

    setDebounceTimeout(timeout);
  };

  const getProductosCatalogo = useCallback(async (search?: string) => {
    try {
      setProcesando(true);
      const productosData = await getCatalogoProductosHttp(search);

      const datosFormateados = productosData.map((e: any) => {
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
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

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
      const asegurados = await getProveedoresHttp();
      setProveedores(asegurados);
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
      const asegurados = await getCategoriasHttp();
      setCategorias(asegurados);
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

      // Función helper para obtener valor de celda por nombre de columna
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

        return String(valor)
          .toUpperCase() // Convertir a mayúsculas (opcional, depende de tu estándar)
          .normalize("NFD") // Normalizar para separar acentos
          .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
          .replace(/[^A-Z0-9]/g, "") // Solo letras y números
          .trim();
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

      // Leer datos desde la fila 2 (después del header)
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const proveedor = String(getValueByHeader(row, "proveedor") || "").trim();

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
        const color = limpiarTexto(getValueByHeader(row, "color"));

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

        if (sku && tieneCaracteresNoPermitidos(sku, "sku")) {
          erroresValidacion.push(
            `Fila ${rowNumber}: El SKU solo puede contener letras y números (sin espacios ni caracteres especiales)`
          );
        }

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

        // Buscar IDs de proveedor y categoría
        const proveedorObj = proveedores?.find(
          (p) => p.nombre.toLowerCase() === proveedor.toLowerCase()
        );
        const categoriaObj = categorias?.find(
          (c) => c.desc.toLowerCase() === categoria.toLowerCase()
        );

        const producto = {
          id: rowNumber - 1,
          fila: rowNumber,
          id_catalogo: categoriaObj?.id || null,
          nombre_producto,
          descripcion,
          marca,
          sku,
          color,
          proveedor,
          catalogo: categoria,
          id_proveedor: proveedorObj?.id || null,
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
          proveedor_valido: !!proveedorObj,
          categoria_valida: !!categoriaObj,
          sku_duplicado: false,
        };

        // Solo agregar si tiene al menos nombre y SKU
        if (producto.nombre_producto || producto.sku) {
          datosFormateados.push(producto);
        }
      });

      // Si hay errores de validación, mostrarlos y no continuar
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

      // Verificar SKUs duplicados en la BD
      const skus = datosFormateados.map((p) => p.sku).filter(Boolean);

      if (skus.length > 0) {
        try {
          const skusExistentesResponse = await verificarSkusHttp(skus);
          const skusExistentes = skusExistentesResponse?.skus_existentes || [];

          // Marcar productos con SKU duplicado
          datosFormateados.forEach((producto) => {
            if (skusExistentes.includes(producto.sku)) {
              producto.sku_duplicado = true;
            }
          });

          // Mostrar alerta si hay SKUs duplicados
          const cantidadDuplicados = datosFormateados.filter((p) => p.sku_duplicado).length;
          if (cantidadDuplicados > 0) {
            setMensajeAlert(
              `⚠️ Se encontraron ${cantidadDuplicados} producto(s) con SKU existente. Estos productos se actualizarán en lugar de crearse nuevos.`
            );
            handleisAlertOpen();
          }
        } catch (error) {
          console.error("Error al verificar SKUs:", error);
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
        { header: "SKU", key: "sku", width: 20 },
        { header: "Color", key: "color", width: 15 },
        { header: "Proveedor", key: "proveedor", width: 25 },
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
      ];

      // Estilo para el header
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF084d6e" },
      };
      worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

      // Agregar una fila de ejemplo
      worksheet.addRow({
        nombre_producto: "Producto Ejemplo",
        descripcion: "Descripción del producto",
        marca: "Marca X",
        sku: "SKU123",
        color: "Rojo",
        proveedor: proveedores?.[0]?.nombre || "Proveedor1",
        categoria: categorias?.[0]?.nombre || "Categoria1",
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
      });

      // Agregar hoja con lista de proveedores
      const proveedoresSheet = workbook.addWorksheet("Proveedores");
      proveedoresSheet.addRow(["Proveedores Disponibles"]);
      proveedoresSheet.getRow(1).font = { bold: true };
      proveedores?.forEach((p) => {
        proveedoresSheet.addRow([p.nombre]);
      });

      // Agregar hoja con lista de categorías
      const categoriasSheet = workbook.addWorksheet("Categorías");
      categoriasSheet.addRow(["Categorías Disponibles"]);
      categoriasSheet.getRow(1).font = { bold: true };
      categorias?.forEach((c) => {
        categoriasSheet.addRow([c.nombre]);
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

  // Función para guardar productos (igual que antes)
  const guardarProductosExcel = async () => {
    try {
      setProcesandoExcel(true);

      let exitosos = 0;
      let actualizados = 0;
      let fallidos = 0;
      const errores: string[] = [];

      for (const producto of excelData) {
        try {
          const datos = {
            id_catalogo: producto.id_catalogo,
            nombre_producto: producto.nombre_producto,
            descripcion: producto.descripcion,
            marca: producto.marca,
            sku: producto.sku,
            color: producto.color,
            proveedor: producto.proveedor,
            catalogo: producto.catalogo,
            id_proveedor: producto.id_proveedor,
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
            tipo_registro: "excel",
          };

          const response: any = await crearProductoHttp(datos);

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
    //Búsqueda intelimagy
    isAlertOpenBI,
    handleisAlertOpenBI,
    handleisAlertCloseBI,
    buscarPorPuntos,
    setBuscarPorPuntos,
    categoriaBuscar,
    setCategoriaBuscar,
    procesandoBusquedaMagica,
  };
};

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
  getCatalogoProductosHttp,
} from "actions/productos";
import { numericFormatter } from "react-number-format";
import moment from "moment";
import { getProveedoresHttp } from "actions/proveedores";
import { getCategoriasHttp } from "actions/categorias";
import ExcelJS from "exceljs";

export const useCatalogoProductos = (tipoUsuario: number) => {
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
  const isSuperAdmin = tipoUsuario === 4;

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

        // Buscar IDs de proveedor y categoría
        const proveedorObj = proveedores?.find(
          (p) => p.nombre.toLowerCase() === proveedor.toLowerCase()
        );
        const categoriaObj = categorias?.find(
          (c) => c.nombre.toLowerCase() === categoria.toLowerCase()
        );

        const producto = {
          id: rowNumber - 1,
          nombre_producto: String(getValueByHeader(row, "nombre") || "").trim(),
          descripcion: String(
            getValueByHeader(row, "descripción") || getValueByHeader(row, "descripcion") || ""
          ).trim(),
          marca: String(getValueByHeader(row, "marca") || "").trim(),
          sku: String(getValueByHeader(row, "sku") || "").trim(),
          color: String(getValueByHeader(row, "color") || "").trim(),
          proveedor: proveedor,
          catalogo: categoria,
          id_proveedor: proveedorObj?.id || null,
          id_catalogo: categoriaObj?.id || null,
          costo_con_iva: Number(getValueByHeader(row, "costo con iva") || 0),
          costo_sin_iva: Number(getValueByHeader(row, "costo sin iva") || 0),
          costo_puntos_con_iva: Number(getValueByHeader(row, "costo puntos con iva") || 0),
          costo_puntos_sin_iva: Number(getValueByHeader(row, "costo puntos sin iva") || 0),
          fee_brimagy: Number(
            getValueByHeader(row, "fee brimagy") || getValueByHeader(row, "fee") || 0
          ),
          subtotal: Number(getValueByHeader(row, "subtotal") || 0),
          envio_base: Number(
            getValueByHeader(row, "envío base") || getValueByHeader(row, "envio base") || 0
          ),
          costo_caja: Number(getValueByHeader(row, "costo caja") || 0),
          envio_extra: Number(
            getValueByHeader(row, "envío extra") || getValueByHeader(row, "envio extra") || 0
          ),
          total_envio: Number(
            getValueByHeader(row, "total envío") || getValueByHeader(row, "total envio") || 0
          ),
          total: Number(getValueByHeader(row, "total") || 0),
          puntos: Number(getValueByHeader(row, "puntos") || 0),
          factor: Number(getValueByHeader(row, "factor") || 0),
          proveedor_valido: !!proveedorObj,
          categoria_valida: !!categoriaObj,
        };

        // Solo agregar si tiene al menos nombre y SKU
        if (producto.nombre_producto || producto.sku) {
          datosFormateados.push(producto);
        }
      });

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
        { header: "Nombre Producto", key: "nombre_producto", width: 30 },
        { header: "Descripción", key: "descripcion", width: 40 },
        { header: "Marca", key: "marca", width: 20 },
        { header: "SKU", key: "sku", width: 20 },
        { header: "Color", key: "color", width: 15 },
        { header: "Proveedor", key: "proveedor", width: 25 },
        { header: "Categoría", key: "categoria", width: 25 },
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
        factor: 1.5,
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
      let fallidos = 0;
      const errores: string[] = [];

      for (const producto of excelData) {
        try {
          const datos = {
            nombre_producto: producto.nombre_producto,
            descripcion: producto.descripcion,
            marca: producto.marca,
            sku: producto.sku,
            color: producto.color,
            proveedor: producto.proveedor,
            catalogo: producto.catalogo,
            id_proveedor: producto.id_proveedor,
            id_catalogo: producto.id_catalogo,
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

          await crearProductoHttp(datos);
          exitosos++;
        } catch (error) {
          fallidos++;
          errores.push(`SKU ${producto.sku}: ${getErrorHttpMessage(error)}`);
        }
      }

      await getProductosCatalogo();
      setProcesandoExcel(false);
      handleisAlerCloseSubirExcel();

      let mensaje = `✓ Productos guardados: ${exitosos}`;
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

  return {
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
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    setProcesando,
    productos,
    tipoUsuario,
    editaProducto,
    //excel
    excelData,
    isAlertOpenSubirExcel,
    handleisAlerCloseSubirExcel,
    handleFileUpload,
    guardarProductosExcel,
    procesandoExcel,
    descargarPlantillaExcel,
  };
};

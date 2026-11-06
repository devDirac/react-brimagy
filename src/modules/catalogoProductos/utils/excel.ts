import ExcelJS from "exceljs";
import moment from "moment";
import { COLORES, MIME_EXCEL } from "../constants";
import { reconstruirCostosDesdeRequiredScore } from "./calculos";
import type { Catalogos, Producto, ProductoExcel, VariablesGlobales } from "../types";

// ---------- Limpieza y validación de celdas ----------

const REGEX_TEXTO_NO_PERMITIDO = /[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ\-_',()]/g;

const limpiarNumero = (valor: any): number => {
  if (valor === null || valor === undefined || valor === "") return 0;
  const numero = parseFloat(String(valor).replace(/[$,\s]/g, "").trim());
  return isNaN(numero) ? 0 : numero;
};

const esNumeroValido = (valor: any): boolean => {
  if (valor === null || valor === undefined || valor === "") return true;
  const numero = parseFloat(String(valor).replace(/[$,\s]/g, "").trim());
  return !isNaN(numero) && isFinite(numero);
};

/** SKU en mayúsculas, sin acentos ni caracteres especiales; "N/A" si queda vacío. */
const limpiarSku = (valor: any): string => {
  if (valor === null || valor === undefined) return "";
  const texto = String(valor).toUpperCase().trim();
  if (texto === "N/A" || texto === "") return "N/A";
  return (
    texto
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Z0-9]/g, "")
      .trim() || "N/A"
  );
};

/** Solo letras, números, espacios, acentos y -_',() */
const limpiarTextoPermitido = (valor: any): string =>
  valor === null || valor === undefined
    ? ""
    : String(valor).replace(REGEX_TEXTO_NO_PERMITIDO, "").trim();

const tieneCaracteresNoPermitidos = (valor: string, tipo: "texto" | "sku"): boolean => {
  if (!valor) return false;
  return tipo === "sku"
    ? !/^[A-Z0-9]+$/i.test(valor)
    : new RegExp(REGEX_TEXTO_NO_PERMITIDO.source).test(valor);
};

const igualSinMayusculas = (a?: string, b?: string) =>
  (a ?? "").toLowerCase().trim() === (b ?? "").toLowerCase().trim();

// ---------- Lectura del Excel ----------

/**
 * Lee la primera hoja del Excel y valida cada fila contra proveedores, categorías y plataformas.
 * Regresa los productos y los errores de validación encontrados.
 */
export const leerProductosDesdeExcel = async (
  archivo: File,
  { proveedores, categorias, plataformas }: Catalogos
): Promise<{ productos: ProductoExcel[]; errores: string[]; sinHojas?: boolean }> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await archivo.arrayBuffer());

  const hoja = workbook.worksheets[0];
  if (!hoja) return { productos: [], errores: [], sinHojas: true };

  const productos: ProductoExcel[] = [];
  const errores: string[] = [];

  const encabezados: Record<number, string> = {};
  hoja.getRow(1).eachCell((celda, columna) => {
    encabezados[columna] = celda.text.toLowerCase().trim();
  });

  // Busca la primera columna cuyo encabezado contenga el texto indicado
  const valor = (fila: ExcelJS.Row, encabezado: string): any => {
    const columna = Object.keys(encabezados).find((k) =>
      encabezados[parseInt(k, 10)].includes(encabezado)
    );
    return columna ? fila.getCell(parseInt(columna, 10)).value : "";
  };

  hoja.eachRow((fila, numeroFila) => {
    if (numeroFila === 1) return;

    const proveedor = String(valor(fila, "proveedor") || "").trim();
    const proveedorVacio = !proveedor || proveedor.toUpperCase() === "N/A";
    const categoria = String(
      valor(fila, "categoría") || valor(fila, "categoria") || valor(fila, "catalogo") || ""
    ).trim();
    const plataforma = String(valor(fila, "plataforma") ?? "");

    const nombre_producto = limpiarTextoPermitido(valor(fila, "nombre"));
    const descripcion = limpiarTextoPermitido(
      valor(fila, "descripción") || valor(fila, "descripcion")
    );
    const marca = limpiarTextoPermitido(valor(fila, "marca"));
    const sku = limpiarSku(valor(fila, "sku"));
    const id_producto_brimagy = valor(fila, "id producto brimagy");

    if (nombre_producto && tieneCaracteresNoPermitidos(nombre_producto, "texto")) {
      errores.push(
        `Fila ${numeroFila}: El nombre del producto contiene caracteres especiales no permitidos (solo se permite: -_',())`
      );
    }
    if (marca && tieneCaracteresNoPermitidos(marca, "texto")) {
      errores.push(
        `Fila ${numeroFila}: La marca contiene caracteres especiales no permitidos (solo se permite: -_',())`
      );
    }
    if (sku && sku !== "N/A" && tieneCaracteresNoPermitidos(sku, "sku")) {
      errores.push(
        `Fila ${numeroFila}: El SKU solo puede contener letras y números (sin espacios ni caracteres especiales)`
      );
    }

    // Solo los numéricos que usa crearProducto; el resto de columnas del Excel se ignora
    const crudos = {
      costo_con_iva: valor(fila, "costo con iva"),
      costo_puntos_con_iva: valor(fila, "costo puntos con iva"),
      fee_brimagy: valor(fila, "fee brimagy") || valor(fila, "fee"),
      valor_factor: valor(fila, "valor_factor"),
      envio_extra: valor(fila, "envío extra") || valor(fila, "envio extra"),
    };

    const nombresCampo: Record<keyof typeof crudos, string> = {
      costo_con_iva: "Costo con IVA",
      costo_puntos_con_iva: "Costo puntos con IVA",
      fee_brimagy: "Fee Brimagy",
      valor_factor: "Factor",
      envio_extra: "Envío extra",
    };

    (Object.keys(crudos) as (keyof typeof crudos)[]).forEach((campo) => {
      if (!esNumeroValido(crudos[campo])) {
        errores.push(
          `Fila ${numeroFila}: ${nombresCampo[campo]} debe ser un número válido (valor actual: ${crudos[campo]})`
        );
      }
    });

    const numero = (campo: keyof typeof crudos) => Math.round(limpiarNumero(crudos[campo]));

    const proveedorObj = proveedorVacio
      ? null
      : proveedores?.find((p) => (p.nombre ?? "").toLowerCase() === proveedor.toLowerCase());
    const categoriaObj = categorias?.find((c) => igualSinMayusculas(c.desc, categoria));
    const plataformaObj = plataformas?.find((c) => igualSinMayusculas(c.nombre, plataforma));

    const producto: ProductoExcel = {
      id: numeroFila - 1,
      fila: numeroFila,
      id_catalogo: categoriaObj?.id || null,
      catalogo: categoria,
      nombre_producto,
      descripcion,
      marca,
      proveedor,
      id_proveedor: proveedorObj?.id || null,
      sku,
      color: String(valor(fila, "color") ?? "").trim(),
      talla: valor(fila, "talla"),
      costo_con_iva: numero("costo_con_iva"),
      costo_puntos_con_iva: numero("costo_puntos_con_iva"),
      fee_brimagy: numero("fee_brimagy"),
      valor_factor: numero("valor_factor"),
      envio_extra: numero("envio_extra"),
      tipo_producto: valor(fila, "tipo producto"),
      proveedor_valido: proveedorVacio ? true : !!proveedorObj,
      proveedor_vacio: proveedorVacio,
      categoria_valida: !!categoriaObj,
      plataforma_valida: !!plataformaObj,
      sku_duplicado: false,
      id_producto_brimagy_duplicado: false,
      sku_vacio: !sku || sku.trim() === "" || sku === "N/A",
      id_producto_brimagy_vacio: !id_producto_brimagy,
      plataforma,
      id_producto_brimagy,
    };

    // Solo se agrega si tiene al menos nombre o SKU
    if (producto.nombre_producto || producto.sku) productos.push(producto);
  });

  return { productos, errores };
};

/** Vuelve a validar las filas del Excel después de registrar proveedores/categorías/plataformas. */
export const revalidarProductosExcel = (
  productos: ProductoExcel[],
  { proveedores, categorias, plataformas }: Catalogos
): ProductoExcel[] =>
  productos.map((p) => {
    const proveedorObj = proveedores?.find((x) => igualSinMayusculas(x.nombre, p.proveedor));
    const categoriaObj = categorias?.find((x) => igualSinMayusculas(x.desc, p.catalogo));
    const plataformaObj = plataformas?.find((x) => igualSinMayusculas(x.nombre, p.plataforma));

    return {
      ...p,
      id_proveedor: proveedorObj?.id || p.id_proveedor,
      id_catalogo: categoriaObj?.id || p.id_catalogo,
      proveedor_valido: p.proveedor_vacio ? true : !!proveedorObj,
      categoria_valida: !!categoriaObj,
      plataforma_valida: !!plataformaObj,
    };
  });

/** Categorías, proveedores y plataformas del Excel que todavía no existen. */
export const obtenerFaltantes = (productos: ProductoExcel[]) => {
  const unicos = (valores: string[]) => Array.from(new Set(valores)).filter(Boolean);
  return {
    categorias: unicos(productos.filter((p) => !p.categoria_valida).map((p) => p.catalogo)),
    proveedores: unicos(
      productos
        .filter((p) => !p.proveedor_valido && !p.proveedor_vacio)
        .map((p) => p.proveedor)
    ),
    plataformas: unicos(productos.filter((p) => !p.plataforma_valida).map((p) => p.plataforma)),
  };
};

/** FormData que espera crearProductoHttp para una fila del Excel. */
export const formDataProductoExcel = (p: ProductoExcel): FormData => {
  const formData = new FormData();
  const campos: [string, any][] = [
    ["id_catalogo", p.id_catalogo],
    ["catalogo", p.catalogo],
    ["nombre_producto", p.nombre_producto],
    ["descripcion", p.descripcion],
    ["marca", p.marca],
    ["proveedor", p.proveedor],
    ["id_proveedor", p.id_proveedor ?? ""],
    ["sku", p.sku],
    ["color", p.color],
    ["talla", p.talla],
    ["costo_con_iva", p.costo_con_iva],
    ["costo_puntos_con_iva", p.costo_puntos_con_iva],
    ["fee_brimagy", p.fee_brimagy],
    ["envio_extra", p.envio_extra],
    ["valor_factor", p.valor_factor],
    ["id_producto_brimagy", p.id_producto_brimagy],
    ["tipo_producto", p.tipo_producto],
    ["nombre_plataforma", p.plataforma],
    ["tipo_registro", "excel"],
  ];
  campos.forEach(([clave, valor]) => formData.append(clave, valor));
  return formData;
};

// ---------- Generación de archivos ----------

const estilizarEncabezado = (hoja: ExcelJS.Worksheet) => {
  const encabezado = hoja.getRow(1);
  encabezado.font = { bold: true, color: { argb: "FFFFFFFF" } };
  encabezado.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${COLORES.primario.replace("#", "")}` },
  };
  encabezado.alignment = { vertical: "middle", horizontal: "center" };
};

const descargarWorkbook = async (workbook: ExcelJS.Workbook, nombreArchivo: string) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const url = window.URL.createObjectURL(new Blob([buffer], { type: MIME_EXCEL }));
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const descargarPlantillaExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const hoja = workbook.addWorksheet("Productos");

  hoja.columns = [
    { header: "Id brimagy", key: "id_producto_brimagy", width: 25 },
    { header: "Categoría", key: "categoria", width: 25 },
    { header: "Nombre Producto", key: "nombre_producto", width: 30 },
    { header: "Descripción", key: "descripcion", width: 40 },
    { header: "Marca", key: "marca", width: 20 },
    { header: "Proveedor", key: "proveedor", width: 25 },
    { header: "SKU", key: "sku", width: 20 },
    { header: "Color", key: "color", width: 15 },
    { header: "Talla", key: "talla", width: 15 },
    { header: "Costo con IVA", key: "costo_con_iva", width: 15 },
    { header: "Costo Puntos con IVA", key: "costo_puntos_con_iva", width: 20 },
    { header: "Factor", key: "valor_factor", width: 15 },
    { header: "Envío Extra", key: "envio_extra", width: 15 },
    { header: "Tipo Producto", key: "tipo_producto", width: 15 },
    { header: "Plataforma", key: "plataforma", width: 15 },
  ];
  estilizarEncabezado(hoja);

  hoja.addRow({
    id_producto_brimagy: 12345,
    categoria: "Categoria1",
    nombre_producto: "Producto Ejemplo",
    descripcion: "Descripción del producto",
    marca: "Marca X",
    proveedor: "Proveedor1",
    sku: "SKU123",
    color: "Rojo",
    talla: "",
    costo_con_iva: 100,
    costo_puntos_con_iva: 100,
    valor_factor: 10,
    envio_extra: 10,
    tipo_producto: "fisico",
    plataforma: "ejemplo1",
  });

  await descargarWorkbook(workbook, `plantilla_productos_${moment().format("DDMMYYYY")}.xlsx`);
};

const CATALOGOS_DIGITALES = ["gifs", "bohn cardssss"];

export const exportarProductosExcel = async (
  productos: Producto[],
  variables: VariablesGlobales
) => {
  const workbook = new ExcelJS.Workbook();
  const hoja = workbook.addWorksheet("Productos");

  hoja.columns = [
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
    { header: "Costo Puntos con IVA", key: "costo_puntos_con_iva", width: 20 },
    { header: "Envío Extra", key: "envio_extra", width: 15 },
    { header: "Factor", key: "valor_factor", width: 15 },
    { header: "Id producto brimagy", key: "id_producto_brimagy", width: 15 },
    { header: "Tipo Producto", key: "tipo_producto", width: 15 },
    { header: "Plataforma", key: "plataforma", width: 15 },
  ];
  estilizarEncabezado(hoja);

  productos.forEach((p) => {
    const reconstruido = reconstruirCostosDesdeRequiredScore(
      p.required_score ?? 0,
      p.plataforma || "puntotes",
      variables
    );
    const fila = hoja.addRow({
      id_producto: p.id ?? 0,
      categoria: p.catalogo || "",
      nombre_producto: p.nombre_producto || "",
      descripcion: p.descripcion || "",
      marca: p.marca || "",
      proveedor: p.proveedor || "",
      sku: p.sku || "",
      color: p.color || "",
      talla: p.talla || "",
      costo_con_iva: p.costo_con_iva ?? 0,
      costo_puntos_con_iva: p.costo_puntos_con_iva ?? reconstruido.costo_puntos_con_iva ?? 0,
      envio_extra: p.envio_extra ?? 0,
      valor_factor: p.valor_factor ?? 0,
      id_producto_brimagy: p.id_producto_brimagy ?? 0,
      tipo_producto: CATALOGOS_DIGITALES.includes(p.catalogo?.toLowerCase() ?? "")
        ? "digital"
        : "fisico",
      plataforma: p.plataforma || "puntotes",
    });

    [10, 11, 12].forEach((columna) => {
      fila.getCell(columna).numFmt = "#,##0.00";
    });
  });

  await descargarWorkbook(workbook, `productos_${moment().format("DDMMYYYY_HHmm")}.xlsx`);
};

import { useMemo, useState } from "react";
import { crearProductoHttp, verificarIdProductoBrimagyHttp } from "actions/productos";
import { crearProveedorHttp, getProveedoresHttp } from "actions/proveedores";
import { crearCategoriaHttp, getCategoriasHttp } from "actions/categorias";
import { crearPlataformaHttp, getPlataformasHttp } from "actions/configuracion";
import { getErrorHttpMessage } from "utils";
import {
  formDataProductoExcel,
  leerProductosDesdeExcel,
  normalizarNombre,
  obtenerFaltantes,
  revalidarProductosExcel,
} from "../utils";
import type { CatalogoProductosState } from "./useCatalogoProductos";
import type { ProductoExcel } from "../types";

const resumirErrores = (errores: string[], maximo: number) =>
  errores.slice(0, maximo).join("\n") +
  (errores.length > maximo ? `\n... y ${errores.length - maximo} más` : "");

/** Carga masiva de productos desde Excel: lectura, validación, alta de faltantes y guardado. */
export const useImportacionExcel = (catalogo: CatalogoProductosState) => {
  const { alerta, cargando, catalogos, plataforma, getProductos } = catalogo;

  const [productosExcel, setProductosExcel] = useState<ProductoExcel[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [procesandoGuardado, setProcesandoGuardado] = useState(false);
  const [procesandoRegistro, setProcesandoRegistro] = useState(false);

  const faltantes = useMemo(() => obtenerFaltantes(productosExcel), [productosExcel]);
  const hayFaltantes =
    faltantes.categorias.length > 0 ||
    faltantes.proveedores.length > 0 ||
    faltantes.plataformas.length > 0;
  const hayProductosValidos = productosExcel.some(
    (p) => p.proveedor_valido && p.categoria_valida && p.plataforma_valida
  );

  const cerrar = () => {
    setModalAbierto(false);
    setProductosExcel([]);
  };

  /** Marca las filas cuyo id_producto_brimagy ya existe (se actualizarán en lugar de crearse). */
  const marcarExistentes = async (productos: ProductoExcel[]) => {
    const ids = productos
      .map((p) => p.id_producto_brimagy)
      .filter(Boolean)
      .map(String);
    if (ids.length === 0) return;

    try {
      const respuesta: any = await verificarIdProductoBrimagyHttp(ids);
      const existentes = new Set((respuesta?.ids_existentes || []).map(String));
      productos.forEach((p) => {
        if (p.id_producto_brimagy && existentes.has(String(p.id_producto_brimagy))) {
          p.id_producto_brimagy_duplicado = true;
        }
      });

      const duplicados = productos.filter((p) => p.id_producto_brimagy_duplicado).length;
      if (duplicados > 0) {
        alerta.mostrar(
          `⚠️ Se encontraron ${duplicados} producto(s) con id existente. Estos productos se actualizarán en lugar de crearse nuevos.`
        );
      }
    } catch {
      // Si la verificación falla, se continúa: el backend decide al guardar
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const archivo = input.files?.[0];
    if (!archivo) return;

    await cargando.ejecutar(
      async () => {
        const { productos, errores, sinHojas } = await leerProductosDesdeExcel(archivo, catalogos);

        if (sinHojas) {
          alerta.mostrar("El archivo Excel no contiene hojas");
          return;
        }
        if (errores.length > 0) {
          alerta.mostrar(
            `Se encontraron ${errores.length} error(es) de validación:\n\n${resumirErrores(errores, 5)}`
          );
          return;
        }

        await marcarExistentes(productos);
        setProductosExcel(productos);
        setModalAbierto(true);
      },
      (error) => `Error al procesar el archivo Excel: ${error}`
    );

    // Limpia el input para poder volver a elegir el mismo archivo
    input.value = "";
  };

  /** Da de alta las categorías, proveedores y plataformas que el Excel menciona y no existen. */
  const registrarFaltantes = async () => {
    try {
      setProcesandoRegistro(true);
      const errores: string[] = [];
      let categoriasCreadas = 0;
      let proveedoresCreados = 0;
      let plataformasCreadas = 0;

      for (const nombre of faltantes.categorias) {
        try {
          await crearCategoriaHttp({
            nombre,
            envio: "excel",
            file_path: normalizarNombre(nombre),
            plataforma,
          });
          categoriasCreadas++;
        } catch (error) {
          errores.push(`Categoría "${nombre}": ${getErrorHttpMessage(error)}`);
        }
      }

      for (const nombre of faltantes.proveedores) {
        try {
          await crearProveedorHttp({
            nombre,
            razon_social: null,
            descripcion: "Proveedor registrado desde Excel",
            nombre_contacto: null,
            telefono: null,
            correo: null,
          });
          proveedoresCreados++;
        } catch (error) {
          errores.push(`Proveedor "${nombre}": ${getErrorHttpMessage(error)}`);
        }
      }

      for (const nombre of faltantes.plataformas) {
        try {
          await crearPlataformaHttp({ nombre, descripcion: "Plataforma registrada desde Excel" });
          plataformasCreadas++;
        } catch (error) {
          errores.push(`Plataforma "${nombre}": ${getErrorHttpMessage(error)}`);
        }
      }

      const [proveedores, categorias, plataformas] = await Promise.all([
        getProveedoresHttp(),
        getCategoriasHttp(plataforma),
        getPlataformasHttp(),
      ]);
      catalogos.setProveedores(proveedores);
      catalogos.setCategorias(categorias);
      catalogos.setPlataformas(plataformas);

      setProductosExcel((prev) =>
        revalidarProductosExcel(prev, { proveedores, categorias, plataformas })
      );

      let mensaje = "✓ Proceso completado:\n";
      if (categoriasCreadas > 0) mensaje += `Categorías creadas: ${categoriasCreadas}\n`;
      if (proveedoresCreados > 0) mensaje += `Proveedores creados: ${proveedoresCreados}\n`;
      if (plataformasCreadas > 0) mensaje += `Plataformas creadas: ${plataformasCreadas}\n`;
      if (errores.length > 0) {
        mensaje += `\n⚠️ Errores (${errores.length}):\n${resumirErrores(errores, 3)}`;
      }
      alerta.mostrar(mensaje);
    } catch (error) {
      alerta.mostrar(getErrorHttpMessage(error) || "Error al registrar");
    } finally {
      setProcesandoRegistro(false);
    }
  };

  /** Guarda (crea o actualiza) cada fila del Excel. */
  const guardar = async () => {
    try {
      setProcesandoGuardado(true);
      const invalidos = productosExcel.filter(
        (p) => !(p.proveedor_valido && p.categoria_valida)
      ).length;
      let nuevos = 0;
      let actualizados = 0;
      let fallidos = 0;

      for (const producto of productosExcel) {
        try {
          const respuesta: any = await crearProductoHttp(formDataProductoExcel(producto));
          // crearProducto no regresa una bandera; distingue la actualización por el mensaje
          const fueActualizado =
            respuesta?.data?.actualizado ||
            respuesta?.message === "Producto actualizado exitosamente.";
          if (fueActualizado) actualizados++;
          else nuevos++;
        } catch {
          fallidos++;
        }
      }

      await getProductos();
      cerrar();

      let mensaje = `✓ Nuevos productos: ${nuevos}`;
      if (actualizados > 0) mensaje += ` | 🔄 Actualizados: ${actualizados}`;
      if (fallidos > 0) mensaje += ` | ✗ Fallidos: ${fallidos}`;
      if (invalidos > 0) {
        mensaje += ` | ⚠️ Omitidos (SKU vacío o datos inválidos): ${invalidos}`;
      }
      alerta.mostrar(mensaje);
    } catch (error) {
      alerta.mostrar(getErrorHttpMessage(error) || "Error al guardar los productos");
    } finally {
      setProcesandoGuardado(false);
    }
  };

  return {
    productos: productosExcel,
    modalAbierto,
    cerrar,
    handleFileUpload,
    faltantes,
    hayFaltantes,
    hayProductosValidos,
    registrarFaltantes,
    procesandoRegistro,
    guardar,
    procesandoGuardado,
  };
};

export type ImportacionExcel = ReturnType<typeof useImportacionExcel>;

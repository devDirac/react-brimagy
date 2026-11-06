import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import env from "react-dotenv";
import {
  activarColorProductoHttp,
  activarFotoMontoHttp,
  activarFotosProductoHttp,
  activarFotosPromoProductoHttp,
  activarMontoProductoHttp,
  activarTallaProductoHttp,
  crearEditarColorProductoHttp,
  crearEditarMontoProductoHttp,
  crearEditarTallaProductoHttp,
  desactivarColorProductoHttp,
  desactivarFotoMontoHttp,
  desactivarFotosProductoHttp,
  desactivarFotosPromoProductoHttp,
  desactivarMontoProductoHttp,
  desactivarTallaProductoHttp,
  editarProductoHttp,
  getFotoMontoPorIdHttp,
  getProductoColorPorIdHttp,
  getProductoFotoPorIdHttp,
  getProductoFotoPromoPorIdHttp,
  getProductoMontoPorIdHttp,
  getProductoTallaPorIdHttp,
  subirFotoMontoHttp,
  subirFotosProductoHttp,
  subirFotosPromoProductoHttp,
} from "actions/productos";
import { REGEX_DECIMAL_8_4, REGEX_VALOR_FACTOR } from "../constants";
import { calcularPuntosEsperados } from "../utils";
import { useRecursoProducto } from "./useRecursoProducto";
import type { CatalogoProductosState } from "./useCatalogoProductos";
import type { PestanaEdicion, Producto, RecursoProducto } from "../types";

const VALORES_INICIALES = {
  nombre_producto: "",
  descripcion: "",
  marca: "",
  sku: "",
  color: "",
  talla: "",
  id_proveedor: "",
  id_catalogo: "",
  costo_con_iva: "",
  costo_puntos_con_iva: "",
  envio_extra: "",
  valor_factor: "",
  tyc: "",
  vigencia: "",
};

const SIN_CAMBIOS = "No hay cambios que guardar.";

const MENSAJES_FOTOS = {
  subido: "http_exito_fotos_subidas",
  errorSubir: "fotos_subidas_error",
  activado: "foto_activada_correctamente",
  errorActivar: "foto_activada_error",
  desactivado: "foto_desactivada_correctamente",
  errorDesactivar: "foto_desactivada_error",
};

/** Modal de edición de un producto: formulario de valores y todas sus pestañas. */
export const useEdicionProducto = (catalogo: CatalogoProductosState) => {
  const { alerta, cargando, catalogos, getProductos } = catalogo;
  const t = (id: string) => cargando.intlRef.current.formatMessage({ id });

  const [producto, setProducto] = useState<Producto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pestana, setPestana] = useState<PestanaEdicion>("one");
  const [procesandoEditar, setProcesandoEditar] = useState(false);

  // Foto principal
  const [fotoPrincipal, setFotoPrincipal] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  // Foto ampliada (fotos, fotos de oferta y foto de monto comparten el mismo modal)
  const [fotoEnVista, setFotoEnVista] = useState<RecursoProducto | null>(null);

  const decimal = Yup.string().matches(
    REGEX_DECIMAL_8_4,
    t("input_validation_numero_decimal")
  );

  const formik = useFormik({
    initialValues: VALORES_INICIALES,
    validationSchema: Yup.object({
      costo_con_iva: decimal,
      costo_puntos_con_iva: decimal,
      envio_extra: decimal,
      valor_factor: Yup.string().matches(REGEX_VALOR_FACTOR, t("input_validation_valor_factor")),
    }),
    onSubmit: () => {},
  });

  // Llena el formulario con el producto seleccionado
  useEffect(() => {
    if (!producto) return;
    const proveedor = catalogos.proveedores.find((p) => p.nombre === producto.proveedor);
    const categoria = catalogos.categorias.find((c) => c.desc === producto.catalogo);

    formik.setValues({
      nombre_producto: producto.nombre_producto || "",
      descripcion: producto.descripcion || "",
      marca: producto.marca || "",
      sku: producto.sku || "",
      color: producto.color || "",
      talla: producto.talla || "",
      id_proveedor: proveedor?.id || "",
      id_catalogo: categoria?.id || "",
      costo_con_iva: producto.costo_con_iva || "",
      costo_puntos_con_iva: producto.costo_puntos_con_iva || "",
      envio_extra: producto.envio_extra ?? "",
      valor_factor: producto.valor_factor ?? "",
      tyc: producto.tyc || "",
      vigencia: producto.vigencia || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto]);

  // Libera la URL temporal de la vista previa
  useEffect(
    () => () => {
      if (previewFoto) URL.revokeObjectURL(previewFoto);
    },
    [previewFoto]
  );

  const fotoActual = producto?.foto_producto
    ? `${env.API_URL_ASSETS}fotos_producto/${producto.foto_producto}`
    : "";

  const puntosEsperados = useMemo(
    () =>
      calcularPuntosEsperados(
        formik.values.costo_puntos_con_iva,
        { envio_extra: formik.values.envio_extra, valor_factor: formik.values.valor_factor },
        { envio_extra: producto?.envio_extra, valor_factor: producto?.valor_factor },
        catalogos.variablesGlobales,
        producto?.nombre_plataforma || "puntotes"
      ),
    [formik.values, catalogos.variablesGlobales, producto]
  );

  // ---------- Pestañas ----------

  const colores = useRecursoProducto(
    {
      obtener: getProductoColorPorIdHttp,
      crearEditar: crearEditarColorProductoHttp,
      campoEdicion: "id_color",
      activar: activarColorProductoHttp,
      desactivar: desactivarColorProductoHttp,
      mensajes: {
        creado: "Color registrado exitosamente.",
        editado: "Color actualizado exitosamente.",
        errorCrear: "error_crear_color",
        errorEditar: "error_editar_color",
        activado: "color_activado_correctamente",
        errorActivar: "color_activado_error",
        desactivado: "color_desactivado_correctamente",
        errorDesactivar: "color_desactivado_error",
      },
    },
    alerta,
    cargando
  );

  const tallas = useRecursoProducto(
    {
      obtener: getProductoTallaPorIdHttp,
      crearEditar: crearEditarTallaProductoHttp,
      campoEdicion: "id_talla",
      activar: activarTallaProductoHttp,
      desactivar: desactivarTallaProductoHttp,
      mensajes: {
        creado: "Talla registrada exitosamente.",
        editado: "Talla actualizada exitosamente.",
        errorCrear: "error_crear_talla",
        errorEditar: "error_editar_talla",
        activado: "talla_activada_correctamente",
        errorActivar: "talla_activada_error",
        desactivado: "talla_desactivada_correctamente",
        errorDesactivar: "talla_desactivada_error",
      },
    },
    alerta,
    cargando
  );

  const montos = useRecursoProducto(
    {
      obtener: getProductoMontoPorIdHttp,
      crearEditar: crearEditarMontoProductoHttp,
      campoEdicion: "id_monto",
      activar: activarMontoProductoHttp,
      desactivar: desactivarMontoProductoHttp,
      mensajes: {
        creado: "Monto registrado exitosamente.",
        editado: "Monto actualizado exitosamente.",
        errorCrear: "error_crear_monto",
        errorEditar: "error_editar_monto",
        activado: "monto_activado_correctamente",
        errorActivar: "monto_activado_error",
        desactivado: "monto_desactivado_correctamente",
        errorDesactivar: "monto_desactivado_error",
      },
    },
    alerta,
    cargando
  );

  const fotos = useRecursoProducto(
    {
      obtener: getProductoFotoPorIdHttp,
      subir: subirFotosProductoHttp,
      activar: activarFotosProductoHttp,
      desactivar: desactivarFotosProductoHttp,
      mensajes: MENSAJES_FOTOS,
    },
    alerta,
    cargando
  );

  const fotosPromo = useRecursoProducto(
    {
      obtener: getProductoFotoPromoPorIdHttp,
      subir: subirFotosPromoProductoHttp,
      activar: activarFotosPromoProductoHttp,
      desactivar: desactivarFotosPromoProductoHttp,
      mensajes: MENSAJES_FOTOS,
    },
    alerta,
    cargando
  );

  const fotoMonto = useRecursoProducto(
    {
      obtener: getFotoMontoPorIdHttp,
      subir: subirFotoMontoHttp,
      // La foto de monto es una sola: el backend puede regresar un objeto en vez de arreglo
      normalizarSubida: (r) => (Array.isArray(r) ? r : [r]),
      activar: activarFotoMontoHttp,
      desactivar: desactivarFotoMontoHttp,
      mensajes: {
        ...MENSAJES_FOTOS,
        subido: "http_exito_foto_subida",
        errorSubir: "foto_subida_error",
      },
    },
    alerta,
    cargando
  );

  // ---------- Acciones ----------

  /** Abre el modal de edición y carga todas las pestañas del producto. */
  const abrir = (p: Producto) => {
    setProducto(p);
    setPestana("one");
    setFotoPrincipal(null);
    setPreviewFoto(null);
    setModalAbierto(true);

    const datos = { id_producto: p.id };
    [colores, tallas, montos, fotos, fotosPromo, fotoMonto].forEach((r) => r.cargar(datos));
  };

  const cambiarFotoPrincipal = (archivo: File | null) => {
    setFotoPrincipal(archivo);
    setPreviewFoto(archivo ? URL.createObjectURL(archivo) : null);
  };

  const guardar = async () => {
    if (!producto || Object.keys(formik.errors).length > 0) return;

    const formData = new FormData();
    Object.entries(formik.values).forEach(([clave, valor]) => formData.append(clave, valor));
    formData.append("id_producto", String(producto.id));
    formData.append("tipo_registro", "edicion");
    formData.append("nombre_plataforma", producto.nombre_plataforma ?? "");
    formData.append("id_producto_brimagy", String(producto.id_producto_brimagy ?? ""));
    if (fotoPrincipal) formData.append("foto_producto", fotoPrincipal);

    try {
      setProcesandoEditar(true);
      const respuesta: any = await editarProductoHttp(formData);
      // editarProducto responde con este texto cuando no detecta cambios
      if (respuesta?.data === SIN_CAMBIOS) {
        alerta.mostrar(SIN_CAMBIOS);
        return;
      }
      await getProductos();
      alerta.mostrar(t("producto_editado_correctamente"));
      setModalAbierto(false);
    } catch (error) {
      alerta.mostrar(cargando.mensajeDeError(error, "producto_editado_error"));
    } finally {
      setProcesandoEditar(false);
    }
  };

  return {
    producto,
    modalAbierto,
    abrir,
    cerrar: () => setModalAbierto(false),
    pestana,
    setPestana,
    formik,
    puntosEsperados,
    guardar,
    procesandoEditar,
    foto: {
      archivo: fotoPrincipal,
      cambiar: cambiarFotoPrincipal,
      mostrar: previewFoto || fotoActual,
    },
    colores,
    tallas,
    montos,
    fotos,
    fotosPromo,
    fotoMonto,
    vistaFoto: {
      foto: fotoEnVista,
      abrir: (f: RecursoProducto) => setFotoEnVista(f),
      cerrar: () => setFotoEnVista(null),
    },
  };
};

export type EdicionProducto = ReturnType<typeof useEdicionProducto>;

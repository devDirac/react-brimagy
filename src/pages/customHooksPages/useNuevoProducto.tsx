import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import { StoreType } from "../../types/genericTypes";
import * as Yup from "yup";
import { getProveedoresHttp } from "actions/proveedores";
import { getCategoriasHttp } from "actions/categorias";
import { crearProductoHttp, verificarSkuDisponibleHttp } from "actions/productos";
import { setAuth } from "actions/auth";

export const useNuevoProducto = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoProducto, setProcesandoProducto] = useState<boolean>(false);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const [proveedores, setProveedores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const tipoProductoArray = [
    { id: 0, label: "Físico", value: "fisico" },
    { id: 1, label: "Digital", value: "digital" },
  ];

  const formik = useFormik({
    initialValues: {
      nombre_producto: "",
      descripcion: "",
      marca: "",
      sku: "",
      color: "",
      id_proveedor: "",
      id_catalogo: "",
      costo_con_iva: "",
      costo_sin_iva: "",
      costo_puntos_con_iva: "",
      costo_puntos_sin_iva: "",
      fee_brimagy: "",
      subtotal: "",
      envio_base: "",
      costo_caja: "",
      envio_extra: "",
      total_envio: "",
      total: "",
      puntos: "",
      factor: "",
      tipo_producto: "",
    },
    validationSchema: Yup.object({
      nombre_producto: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
      descripcion: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      marca: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      sku: Yup.string()
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .test("sku-disponible", "Este SKU ya está registrado", async function (value) {
          if (!value) return true;

          try {
            const response: any = await verificarSkuDisponibleHttp(value);

            if (!response.disponible) {
              return this.createError({
                message: `Este SKU ya está registrado para el producto: ${
                  response.producto_existente?.nombre || "existente"
                }`,
              });
            }

            return true;
          } catch (error) {
            console.error("Error al validar SKU:", error);
            return true;
          }
        }),
      color: Yup.string(),
      id_proveedor: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      id_catalogo: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      costo_con_iva: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
      costo_sin_iva: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
      costo_puntos_con_iva: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
      costo_puntos_sin_iva: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
      fee_brimagy: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      subtotal: Yup.number()
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .positive(intl.formatMessage({ id: "debe_ser_mayor_cero" }))
        .min(1, intl.formatMessage({ id: "debe_ser_mayor_cero" })),
      envio_base: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      costo_caja: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      envio_extra: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      total_envio: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      total: Yup.number()
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .positive(intl.formatMessage({ id: "debe_ser_mayor_cero" }))
        .min(1, intl.formatMessage({ id: "debe_ser_mayor_cero" })),
      puntos: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      factor: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      tipo_producto: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
    }),
    onSubmit: async (values) => {
      console.log("Formulario enviado:", values);
    },
  });

  const isFieldValid = (fieldName: keyof typeof formik.values) => {
    return (
      formik.touched[fieldName] &&
      !formik.errors[fieldName] &&
      formik.values[fieldName] &&
      formik.values[fieldName] !== ""
    );
  };

  const getFieldColor = (fieldName: keyof typeof formik.values) => {
    return isFieldValid(fieldName) ? "#00AB16" : undefined;
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

  const crearProducto = async (datos: any) => {
    try {
      setProcesandoProducto(true);
      const asegurados = await crearProductoHttp(datos);
      setMensajeAlert(intl.formatMessage({ id: "producto_añadido_correctamente" }));
      formik.resetForm();
      setProcesandoProducto(false);
      handleisAlertOpen();
    } catch (error) {
      setProcesandoProducto(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    getProveedores();
    getCategoriasProducto();
  }, []);

  return {
    tipoProductoArray,
    crearProducto,
    procesandoProducto,
    categorias,
    proveedores,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    formik,
    getFieldColor,
  };
};

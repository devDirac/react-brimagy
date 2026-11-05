import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import { StoreType } from "../../types/genericTypes";
import * as Yup from "yup";
import { setAuth } from "actions/auth";
import {
  crearVariablesGlobalesHttp,
  getPlataformasHttp,
  getProductosSincronizadosHttp,
  getVariablesGlobalesHttp,
  sincronizarVariablesEnProductosHttp,
} from "actions/configuracion";

export const useVariablesGlobales = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoVariables, setProcesandoVariables] = useState<boolean>(false);
  const [sincronizandoVariables, setSincronizandoVariables] = useState<boolean>(false);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const [productosSincronizados, setProductosSincronizados] = useState<any>(null);
  const [variablesGlobalesData, setVariablesGlobalesData] = useState<any[]>([]);
  const [variableGlobalEditar, setVariableGlobalEditar] = useState<any>(null);
  const [plataformas, setPlataformas] = useState<any[]>([]);

  const [tableKey, setTableKey] = useState(0);

  const [alertEditar, setAlertEditar] = useState(false);
  const handleisAlertOpenEditar = () => setAlertEditar(true);
  const handleisAlertCloseEditar = () => setAlertEditar(false);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const handleAccion = (accion: string, row: any) => {
    switch (accion) {
      case "desactivar":
        //desactivaUsuario(row);
        break;
      case "reactivar":
        //reactivaUsuario(row);
        break;
      case "editar_usuario":
        setVariableGlobalEditar(row);
        handleisAlertOpenEditar();
        //handleisAlertOpenEditarUsuario();
        break;
      default:
        break;
    }
  };

  const numeroDecimalRegex = /^\d{1,4}(\.\d{1,4})?$/;

  const formik = useFormik({
    initialValues: {
      fee_brimagy: "",
      envio_base: "",
      costo_caja: "",
      envio_extra: "",
      factor: "",
      id_plataforma: "",
    },
    validationSchema: Yup.object({
      fee_brimagy: Yup.string()
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .matches(numeroDecimalRegex, intl.formatMessage({ id: "input_validation_numero_decimal" })),
      envio_base: Yup.string()
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .matches(numeroDecimalRegex, intl.formatMessage({ id: "input_validation_numero_decimal" })),
      costo_caja: Yup.string()
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .matches(numeroDecimalRegex, intl.formatMessage({ id: "input_validation_numero_decimal" })),
      envio_extra: Yup.string()
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .matches(numeroDecimalRegex, intl.formatMessage({ id: "input_validation_numero_decimal" })),
      factor: Yup.string()
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .matches(numeroDecimalRegex, intl.formatMessage({ id: "input_validation_numero_decimal" })),
      id_plataforma: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
    }),
    onSubmit: async (values) => {},
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

  const getVariablesGlobales = useCallback(async () => {
    try {
      setProcesando(true);
      const data = await getVariablesGlobalesHttp();
      setVariablesGlobalesData(data);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getProductosSincronizados = useCallback(async (datos?: any) => {
    try {
      setProcesando(true);
      const data = await getProductosSincronizadosHttp(datos);
      setProductosSincronizados(data);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const setVariablesGlobales = async (datos: any) => {
    try {
      setProcesandoVariables(true);
      const data: any = await crearVariablesGlobalesHttp(datos);
      if (plataforma) {
        await getProductosSincronizados({ plataforma: plataforma });
      }

      setVariablesGlobalesData((prev: any[]) => {
        const existe = prev.some((v) => v.id === data.id);

        const plataformaEncontrada = plataformas.find((p: any) => p.id === data.id_plataforma);

        if (existe) {
          return prev.map((variable) =>
            variable.id === data.id
              ? {
                  ...variable,
                  ...data,
                  nombre_plataforma: plataformaEncontrada?.nombre || variable.nombre_plataforma,
                  fecha_creacion: data.created_at,
                }
              : variable
          );
        } else {
          return [
            ...prev,
            {
              ...data,
              nombre_plataforma: plataformaEncontrada?.nombre || "",
              fecha_creacion: data.created_at,
            },
          ];
        }
      });
      setTableKey((prev) => prev + 1);
      getPlataformas();

      setMensajeAlert(
        variableGlobalEditar
          ? intl.formatMessage({ id: "variables_actualizadas_correctamente" })
          : intl.formatMessage({ id: "variables_añadidas_correctamente" })
      );
      formik.resetForm();
      handleisAlertCloseEditar();
      setProcesandoVariables(false);
      setVariableGlobalEditar(null);
      handleisAlertOpen();
    } catch (error) {
      setProcesandoVariables(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "variables_añadidas_error" }));
      handleisAlertOpen();
    }
  };

  const sincronizarVariablesEnProductos = async (data?: any) => {
    try {
      setSincronizandoVariables(true);
      await sincronizarVariablesEnProductosHttp(data);
      if (plataforma) {
        await getProductosSincronizados({ plataforma: plataforma });
      }
      setMensajeAlert(intl.formatMessage({ id: "variables_sincronizadas_correctamente" }));
      handleisAlertOpen();
      setSincronizandoVariables(false);
    } catch (error) {
      setSincronizandoVariables(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "variables_sincronizadas_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    if (variableGlobalEditar) {
      const plataformaEncontrada = plataformas.find(
        (p) => p.nombre === variableGlobalEditar?.nombre_plataforma
      );

      formik.setValues({
        fee_brimagy: variableGlobalEditar?.fee_brimagy || "",
        envio_base: variableGlobalEditar?.envio_base || "",
        costo_caja: variableGlobalEditar?.costo_caja || "",
        envio_extra: variableGlobalEditar?.envio_extra || "",
        factor: variableGlobalEditar?.factor || "",
        id_plataforma: plataformaEncontrada?.id || "",
      });
    }
  }, [variableGlobalEditar]);

  useEffect(() => {
    getPlataformas();
    getVariablesGlobales();
    if (plataforma) {
      getProductosSincronizados({ plataforma: plataforma });
    }
  }, [plataforma]);

  return {
    sincronizarVariablesEnProductos,
    sincronizandoVariables,
    tableKey,
    variableGlobalEditar,
    handleAccion,
    plataformas,
    variablesGlobalesData,
    procesandoVariables,
    setVariablesGlobales,
    setProcesandoVariables,
    productosSincronizados,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    formik,
    getFieldColor,
    alertEditar,
    handleisAlertCloseEditar,
    plataforma,
  };
};

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
  crearPlataformaHttp,
  crearVariablesGlobalesHttp,
  getPlataformasHttp,
  getProductosSincronizadosHttp,
  getVariablesGlobalesHttp,
} from "actions/configuracion";

export const usePlataformas = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoPlataforma, setProcesandoPlataforma] = useState<boolean>(false);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const [productosSincronizados, setProductosSincronizados] = useState<any[]>([]);
  const [variablesGlobalesData, setVariablesGlobalesData] = useState<any>(null);
  const [plataformas, setPlataformas] = useState<any[]>([]);

  const [tableKey, setTableKey] = useState(0);

  const [plataformaEditar, setPlataformaEditar] = useState<any>(null);
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
        setPlataformaEditar(row);
        handleisAlertOpenEditar();
        break;
      default:
        break;
    }
  };

  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      descripcion: Yup.string(),
    }),
    onSubmit: async (values) => {
      //console.log("Formulario enviado:", values);
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

  const crearPlataforma = async (datos: any) => {
    try {
      setProcesandoPlataforma(true);
      const data = await crearPlataformaHttp(datos);
      await getPlataformas();
      setTableKey((prev) => prev + 1);

      setMensajeAlert(
        plataformaEditar
          ? intl.formatMessage({ id: "plataforma_actualizada_correctamente" })
          : intl.formatMessage({ id: "plataforma_añadida_correctamente" })
      );
      formik.resetForm();
      setProcesandoPlataforma(false);
      handleisAlertOpen();
    } catch (error) {
      setProcesandoPlataforma(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "plataforma_añadida_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    if (plataformaEditar) {
      formik.setValues({
        nombre: plataformaEditar?.nombre || "",
        descripcion: plataformaEditar?.descripcion || "",
      });
    }
  }, [plataformaEditar]);

  useEffect(() => {
    getPlataformas();
  }, []);

  return {
    crearPlataforma,
    handleAccion,
    plataformas,
    variablesGlobalesData,
    procesandoPlataforma,
    productosSincronizados,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    formik,
    getFieldColor,
    //editando plataforma
    tableKey,
    plataformaEditar,
    alertEditar,
    handleisAlertOpenEditar,
    handleisAlertCloseEditar,
  };
};

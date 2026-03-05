// pages/customHooksPages/useValidarCanje.ts
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { getErrorHttpMessage } from "utils";
import {
  activarPreguntaEncuestaHttp,
  createPreguntaEncuestaHttp,
  desactivarPreguntaEncuestaHttp,
  editarPreguntaEncuestaHttp,
  getEncuestasDisponiblesHttp,
  getPreguntasPorTipoHttp,
  getRespuestasPorCanjeHttp,
  getRespuestasPorEncuestaHttp,
} from "actions/encuestas";
import { setAuth } from "actions/auth";
import { useFormik } from "formik";
import * as Yup from "yup";

export const useCatalogoEncuestas = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const intl = useIntl();

  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");

  const [encuestas, setEncuestas] = useState<any[]>([]);
  const [verEncuesta, setVerEncuesta] = useState<any>(null);

  const [verEditarPregunta, setEditarPregunta] = useState<any>(null);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoPregunta, setProcesandoPregunta] = useState<boolean>(false);
  const [procesandoEditarPregunta, setProcesandoEditarPregunta] = useState<boolean>(false);
  const [procesandoRespuestasEncuesta, setProcesandoRespuestasEncuesta] = useState<boolean>(false);

  const [isAlertOpenEncuesta, setIsAlertOpenEncuesta] = useState(false);
  const handleisAlertOpenEncuesta = () => setIsAlertOpenEncuesta(true);
  const handleisAlertCloseEncuesta = () => setIsAlertOpenEncuesta(false);

  const [isAlertOpenEditarPregunta, setIsAlertOpenEditarPregunta] = useState(false);
  const handleisAlertOpenEditarPregunta = () => setIsAlertOpenEditarPregunta(true);
  const handleisAlertCloseEditarPregunta = () => setIsAlertOpenEditarPregunta(false);

  const [editaPregunta, setEditaPregunta] = useState("");
  const [editaTipoPregunta, setEditaTipoPregunta] = useState("");

  const [verRespuestasEncuesta, setVerRespuestasEncuesta] = useState<any[]>([]);
  const [isAlertOpenVerRespuestasEncuesta, setIsAlertOpenVerRespuestasEncuesta] = useState(false);
  const handleisAlertOpenVerRespuestasEncuesta = () => setIsAlertOpenVerRespuestasEncuesta(true);
  const handleisAlertCloseVerRespuestasEncuesta = () => setIsAlertOpenVerRespuestasEncuesta(false);

  const [verRespuestasCanje, setVerRespuestasCanje] = useState<any[]>([]);
  const [isAlertOpenVerRespuestasCanje, setIsAlertOpenVerRespuestasCanje] = useState(false);
  const handleisAlertOpenVerRespuestasCanje = () => setIsAlertOpenVerRespuestasCanje(true);
  const handleisAlertCloseVerRespuestasCanje = () => setIsAlertOpenVerRespuestasCanje(false);

  const tipoEncuestaArray = [
    { id: 0, label: "Satisfacción de Compra", value: "satisfaccion_compra" },
    { id: 1, label: "Satisfacción de Uso de la plataforma", value: "satisfaccion_plataforma" },
  ];

  const tipoPreguntaArray = [
    { id: 0, label: "Abierta", value: "abierta" },
    { id: 1, label: "Opción múltiple", value: "opcion_multiple" },
    { id: 3, label: "Si o no", value: "si_no" },
  ];

  const formik = useFormik({
    initialValues: {
      pregunta: "",
      tipo_encuesta: "",
      tipo_pregunta: "",
    },
    validationSchema: Yup.object({
      pregunta: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      tipo_encuesta: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
      tipo_pregunta: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
    }),
    onSubmit: async (values) => {
      console.log("Formulario enviado:", values);
    },
  });

  const handleAccionCallback = useCallback((accion: string, row: any) => {
    switch (accion) {
      case "ver_respuesta":
        const datos = {
          id_canje: row?.id_canje,
        };
        getRespuestasPorCanje(datos);
        handleisAlertOpenVerRespuestasCanje();
        break;
      default:
        break;
    }
  }, []);

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

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const getEncuestasDisponibles = useCallback(async () => {
    try {
      setProcesando(true);
      const response = await getEncuestasDisponiblesHttp();
      setEncuestas(response);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getRespuestasPorEncuesta = useCallback(async (datos: any) => {
    try {
      setProcesandoRespuestasEncuesta(true);
      const response = await getRespuestasPorEncuestaHttp(datos);
      setVerRespuestasEncuesta(response);
      setProcesandoRespuestasEncuesta(false);
    } catch (error) {
      setProcesandoRespuestasEncuesta(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getRespuestasPorCanje = useCallback(async (datos: any) => {
    try {
      setProcesando(true);
      const response = await getRespuestasPorCanjeHttp(datos);
      setVerRespuestasCanje(response);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const createPreguntaEncuesta = async (datos: any) => {
    try {
      setProcesandoPregunta(true);
      const pregunta: any = await createPreguntaEncuestaHttp(datos);
      setEncuestas((prevEncuestas: any[]) => {
        const exists = prevEncuestas.some((enc) => enc.tipo_encuesta === pregunta.tipo_encuesta);

        if (exists) {
          return prevEncuestas.map((encuesta) =>
            encuesta.tipo_encuesta === pregunta.tipo_encuesta
              ? { ...encuesta, total_preguntas: (encuesta.total_preguntas || 0) + 1 }
              : encuesta
          );
        }
        return [
          ...prevEncuestas,
          {
            tipo_encuesta: pregunta.tipo_encuesta,
            total_preguntas: 1,
            total_respuestas: 0,
          },
        ];
      });
      formik.resetForm();
      setMensajeAlert(intl.formatMessage({ id: "pregunta_añadida_correctamente" }));
      handleisAlertOpen();
      setProcesandoPregunta(false);
    } catch (error) {
      setProcesandoPregunta(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "pregunta_añadida_error" }));
      handleisAlertOpen();
    }
  };

  const getPreguntasPorTipo = useCallback(async (datos: any) => {
    try {
      setProcesando(true);
      const response = await getPreguntasPorTipoHttp(datos);
      setVerEncuesta(response);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const editarPreguntaEncuesta = async (datos: any) => {
    try {
      setProcesandoPregunta(true);
      const pregunta: any = await editarPreguntaEncuestaHttp(datos);
      setVerEncuesta((prevPreguntas: any[]) => {
        return prevPreguntas.map((p) => {
          if (p.id === pregunta.id) {
            return {
              ...p,
              pregunta: pregunta.pregunta,
            };
          }
          return p;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "pregunta_editada_correctamente" }));
      handleisAlertOpen();
      handleisAlertCloseEditarPregunta();
      setProcesandoPregunta(false);
    } catch (error) {
      setProcesandoPregunta(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "pregunta_editada_error" }));
      handleisAlertOpen();
    }
  };
  const desactivarPreguntaEncuesta = async (datos: any) => {
    try {
      setProcesandoPregunta(true);
      const pregunta: any = await desactivarPreguntaEncuestaHttp(datos);
      setVerEncuesta((prevPreguntas: any[]) => {
        return prevPreguntas.map((p) => {
          if (p.id === pregunta.id) {
            return {
              ...p,
              estatus: pregunta.estatus,
            };
          }
          return p;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "pregunta_desactivada_correctamente" }));
      handleisAlertOpen();
      handleisAlertCloseEditarPregunta();
      setProcesandoPregunta(false);
    } catch (error) {
      setProcesandoPregunta(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "pregunta_desactivada_error" }));
      handleisAlertOpen();
    }
  };
  const activarPreguntaEncuesta = async (datos: any) => {
    try {
      setProcesandoPregunta(true);
      const pregunta: any = await activarPreguntaEncuestaHttp(datos);
      setVerEncuesta((prevPreguntas: any[]) => {
        return prevPreguntas.map((p) => {
          if (p.id === pregunta.id) {
            return {
              ...p,
              estatus: pregunta.estatus,
            };
          }
          return p;
        });
      });
      setMensajeAlert(intl.formatMessage({ id: "pregunta_activada_correctamente" }));
      handleisAlertOpen();
      handleisAlertCloseEditarPregunta();
      setProcesandoPregunta(false);
    } catch (error) {
      setProcesandoPregunta(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "pregunta_activada_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    if (verEditarPregunta) {
      setEditaPregunta(verEditarPregunta.pregunta || "");
      //setEditaTipoPregunta(verEditarPregunta.tipo_pregunta || "");
    }
  }, [verEditarPregunta]);

  useEffect(() => {
    getEncuestasDisponibles();
  }, []);

  return {
    handleAccionCallback,
    formik,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    procesando,
    intl,
    navigate,
    getFieldColor,
    //encuesta
    encuestas,
    verEncuesta,
    setVerEncuesta,
    procesandoPregunta,
    createPreguntaEncuesta,
    tipoEncuestaArray,
    tipoPreguntaArray,
    isAlertOpenEncuesta,
    handleisAlertOpenEncuesta,
    handleisAlertCloseEncuesta,
    getPreguntasPorTipo,
    editarPreguntaEncuesta,
    verEditarPregunta,
    setEditarPregunta,
    isAlertOpenEditarPregunta,
    handleisAlertOpenEditarPregunta,
    handleisAlertCloseEditarPregunta,
    //pregunta
    editaPregunta,
    setEditaPregunta,
    editaTipoPregunta,
    setEditaTipoPregunta,
    procesandoEditarPregunta,
    desactivarPreguntaEncuesta,
    activarPreguntaEncuesta,
    //respuestas
    procesandoRespuestasEncuesta,
    getRespuestasPorEncuesta,
    getRespuestasPorCanje,
    verRespuestasEncuesta,
    isAlertOpenVerRespuestasEncuesta,
    handleisAlertOpenVerRespuestasEncuesta,
    handleisAlertCloseVerRespuestasEncuesta,
    //respuestas por canje
    verRespuestasCanje,
    isAlertOpenVerRespuestasCanje,
    handleisAlertOpenVerRespuestasCanje,
    handleisAlertCloseVerRespuestasCanje,
  };
};

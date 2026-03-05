// pages/customHooksPages/useValidarCanje.ts
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { getErrorHttpMessage } from "utils";
import {
  addRespuestasEncuestaUsuarioHttp,
  getEncuestaPorTipoHttp,
  getRespuestasEncuestaPorCanjeHttp,
} from "actions/encuestas";

export const useEncuestaUsuario = () => {
  const { tipo_encuesta, id_canje } = useParams<{ tipo_encuesta: string; id_canje: string }>();
  const navigate = useNavigate();
  const intl = useIntl();

  const [preguntas, setPreguntas] = useState<any>(null);
  const [respuestas, setRespuestas] = useState<any>(null);
  const [codigoVerificacion, setCodigoVerificacion] = useState<any>(null);
  const [verificado, setVerificado] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoCreateRespuestasUsuario, setProcesandoCreateRespuestasUsuario] =
    useState<boolean>(false);

  const [respuestasUsuario, setRespuestasUsuario] = useState<{ [key: number]: string }>({});

  const handleRespuestaChange = (preguntaId: number, valor: string) => {
    setRespuestasUsuario((prev) => ({
      ...prev,
      [preguntaId]: valor,
    }));
  };

  const todasRespuestasCompletas = useCallback(() => {
    if (!preguntas || !respuestas) return false;

    return preguntas.every((pregunta: any) => {
      return respuestas.some((resp: any) => resp.id === pregunta.id && resp.respuesta);
    });
  }, [preguntas, respuestas]);

  const getEncuestaPorTipo = useCallback(async (datos: any) => {
    try {
      setProcesando(true);
      const response = await getEncuestaPorTipoHttp(datos);
      setPreguntas(response);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "no_existe_canje" }));
      handleisAlertOpen();
    }
  }, []);

  const getRespuestasEncuestaPorCanje = useCallback(async (datos: any) => {
    try {
      setProcesando(true);
      const response = await getRespuestasEncuestaPorCanjeHttp(datos);
      setRespuestas(response);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "no_existe_canje" }));
      handleisAlertOpen();
    }
  }, []);

  const addRespuestasEncuestaUsuario = async (datos: any) => {
    try {
      setProcesandoCreateRespuestasUsuario(true);
      const nuevasRespuestas: any = await addRespuestasEncuestaUsuarioHttp(datos);
      const respuestasActualizadas = nuevasRespuestas.map((resp: any) => {
        const pregunta = preguntas.find((p: any) => p.id === resp.id_pregunta);

        return {
          id: resp.id_pregunta,
          pregunta: pregunta?.pregunta || "",
          respuesta: resp.respuesta,
        };
      });

      // Actualizar el estado con las nuevas respuestas
      setRespuestas(respuestasActualizadas);
      setMensajeAlert(intl.formatMessage({ id: "exito_añadir_respuestas" }));
      handleisAlertOpen();
      setProcesandoCreateRespuestasUsuario(false);
    } catch (error) {
      setProcesandoCreateRespuestasUsuario(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "error_añadir_respuestas" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    const datosEncuesta = {
      tipo_encuesta: tipo_encuesta,
      id_canje: id_canje,
    };
    if (datosEncuesta) {
      getEncuestaPorTipo(datosEncuesta);
      getRespuestasEncuestaPorCanje(datosEncuesta);
    }
  }, []);

  // Nuevo: Cargar respuestas existentes en el estado
  useEffect(() => {
    if (respuestas && respuestas.length > 0) {
      const respuestasIniciales: { [key: number]: string } = {};
      respuestas.forEach((resp: any) => {
        respuestasIniciales[resp.id] = resp.respuesta;
      });
      setRespuestasUsuario(respuestasIniciales);
    }
  }, [respuestas]);

  return {
    id_canje,
    addRespuestasEncuestaUsuario,
    verificado,
    codigoVerificacion,
    procesandoCreateRespuestasUsuario,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    respuestas,
    preguntas,
    procesando,
    intl,
    navigate,
    respuestasUsuario,
    setRespuestasUsuario,
    handleRespuestaChange,
    todasRespuestasCompletas,
  };
};

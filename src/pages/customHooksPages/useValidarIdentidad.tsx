// pages/customHooksPages/useValidarCanje.ts
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import {
  getCanjeByIdHttp,
  getCodigoVerificacionByIdHttp,
  solicitarCodigoValidacionHttp,
  validarIdentidadPorCodigoHttp,
} from "actions/canjes";
import { getErrorHttpMessage } from "utils";

export const useValidarIdentidad = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const intl = useIntl();

  const [canje, setCanje] = useState<any>(null);
  const [codigoVerificacion, setCodigoVerificacion] = useState<any>(null);
  const [verificado, setVerificado] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoCodigo, setProcesandoCodigo] = useState<boolean>(false);
  const [procesandoIdentidad, setProcesandoIdentidad] = useState<boolean>(false);

  const [showInput, setShowInput] = useState(false);

  const cargarCanjePorId = useCallback(async (id_canje: number) => {
    try {
      setProcesando(true);
      const response = await getCanjeByIdHttp(id_canje);
      setCanje(response);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "no_existe_canje" }));
      handleisAlertOpen();
    }
  }, []);

  const cargarCodigoVerificacionPorId = useCallback(async (id_canje: number) => {
    try {
      setProcesando(true);
      const response = await getCodigoVerificacionByIdHttp(id_canje);
      console.log("estatus: ", response);
      if (response == "solicitud_enviada") {
        setCodigoVerificacion(response);
      } else if (response == "identidad_validada") {
        setVerificado(true);
      }
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "no_existe_canje" }));
      handleisAlertOpen();
    }
  }, []);

  const solicitarCodigoValidacion = async (data: any) => {
    try {
      setProcesandoCodigo(true);
      const response = await solicitarCodigoValidacionHttp(data);
      setCanje((prevCanje: any) => ({
        ...prevCanje,
        estado_validacion: "solicitud_enviada",
      }));
      setCodigoVerificacion(response);
      setMensajeAlert(intl.formatMessage({ id: "codigo_enviado_whatsapp_correctamente" }));
      handleisAlertOpen();
      setProcesandoCodigo(false);
    } catch (error) {
      setProcesandoCodigo(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "codigo_enviado_whatsapp_error" }));
      handleisAlertOpen();
    }
  };

  const validarIdentidadPorCodigo = async (codigo: number, id_canje: number) => {
    try {
      setProcesando(true);
      const response = await validarIdentidadPorCodigoHttp(codigo, id_canje);
      setCanje((prevCanje: any) => ({
        ...prevCanje,
        estado_validacion: "identidad_validada",
      }));
      setVerificado(true);
      setMensajeAlert(intl.formatMessage({ id: "identidad_validada_correctamente" }));
      handleisAlertOpen();
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "identidad_validada_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    if (codigo) {
      cargarCanjePorId(Number(codigo));
      cargarCodigoVerificacionPorId(Number(codigo));
    }
  }, [codigo]);

  return {
    validarIdentidadPorCodigo,
    verificado,
    showInput,
    setShowInput,
    codigoVerificacion,
    solicitarCodigoValidacion,
    procesandoCodigo,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    canje,
    procesando,
    intl,
    navigate,
  };
};

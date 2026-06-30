import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  addGuiaProductoAlmacenHttp,
  confirmarRecepcionProductoAlmacenHttp,
  enviarProductoAlmacenHttp,
  getProductoAlmacenPorIdHttp,
  getProductosAlmacenHttp,
  recibirProductoAlmacenHttp,
  registrarMeiNoSerieHttp,
  registrarNuevoPrecioAlmacenHttp,
} from "actions/almacen";
import { subirEvidenciasHttp } from "actions/evidencias";
import { addFechaPagoFacturaHttp } from "actions/factura";
import { enviarEncuestaUsuarioHttp, getEncuestasDisponiblesHttp } from "actions/encuestas";
import { crearProveedorHttp, getProveedoresHttp } from "actions/proveedores";
import { getEstadisticasHomeHttp } from "actions/estadisticas";

export const useEstadisticasHome = (tipoUsuario: number) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();

  const [procesandoEditar, setProcesandoEditar] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);
  const [tableKey, setTableKey] = useState(0);

  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");

  const [procesando, setProcesando] = useState<boolean>(false);
  const [estadistica, setEstadistica] = useState<any>(null);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const getEstadisticasHome = useCallback(async () => {
    try {
      setProcesando(true);
      const proveedores = await getEstadisticasHomeHttp();
      setEstadistica(proveedores);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  useEffect(() => {
    getEstadisticasHome();
  }, []);

  return {
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    estadistica,
  };
};

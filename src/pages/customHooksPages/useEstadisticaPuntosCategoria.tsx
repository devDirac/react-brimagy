import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import {
  getEstadisticasCanjeadosHttp,
  getEstadisticasHomeHttp,
  getEstadisticasPuntosCategoriaHttp,
} from "actions/estadisticas";

export const useEstadisticaPuntosCategoria = (tipoUsuario: number) => {
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
  const [estadisticaProductosCanjeados, setEstadisticaProductosCanjeados] = useState<any>(null);

  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const getEstadisticasPuntosCategoria = useCallback(async (inicio?: string, fin?: string) => {
    try {
      setProcesando(true);
      const params: Record<string, string> = {};
      if (inicio) params.fecha_inicio = inicio;
      if (fin) params.fecha_fin = fin;
      const estadistica = await getEstadisticasPuntosCategoriaHttp(params);
      setEstadisticaProductosCanjeados(estadistica);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  useEffect(() => {
    getEstadisticasPuntosCategoria();
  }, []);

  useEffect(() => {
    if (fechaInicio || fechaFin) {
      getEstadisticasPuntosCategoria(fechaInicio, fechaFin);
    }
  }, [fechaInicio, fechaFin]);

  return {
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    estadisticaProductosCanjeados,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
  };
};

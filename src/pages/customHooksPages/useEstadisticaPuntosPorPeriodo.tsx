import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  getEstadisticasPuntosPorTipoProductoHttp,
} from "actions/estadisticas";

export const useEstadisticaPuntosPorPeriodo = (tipoUsuario: number) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const isMounted = useRef(false);

  const [procesandoEditar, setProcesandoEditar] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");

  const [procesando, setProcesando] = useState<boolean>(false);
  const [estadisticaProductosCanjeados, setEstadisticaProductosCanjeados] = useState<any>(null);

  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [agrupacion, setAgrupacion] = useState<string>("mensual");

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const getEstadisticasPuntosPorPeriodo = useCallback(
    async (agrupacion?: string, inicio?: string, fin?: string, plataforma?: string) => {
      try {
        setProcesando(true);
        const params: Record<string, string> = {};
        if (agrupacion) params.agrupacion = agrupacion;
        if (inicio) params.fecha_inicio = inicio;
        if (fin) params.fecha_fin = fin;
        if (plataforma) params.plataforma = plataforma;
        const estadistica = await getEstadisticasPuntosPorTipoProductoHttp(params);
        setEstadisticaProductosCanjeados(estadistica);
        setProcesando(false);
      } catch (error) {
        setProcesando(false);
        const message = getErrorHttpMessage(error);
        setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
        handleisAlertOpen();
      }
    },
    []
  );

  useEffect(() => {
    getEstadisticasPuntosPorPeriodo(agrupacion, undefined, undefined, plataforma);
  }, [plataforma]);

  useEffect(() => {
    if (fechaInicio || fechaFin) {
      getEstadisticasPuntosPorPeriodo(agrupacion, fechaInicio, fechaFin, plataforma);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    getEstadisticasPuntosPorPeriodo(agrupacion, fechaInicio, fechaFin, plataforma);
  }, [agrupacion]);

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
    setAgrupacion,
    agrupacion,
  };
};

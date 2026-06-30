import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import { getEstadisticasComparativaHttp, getEstadisticasHomeHttp } from "actions/estadisticas";

export const useEstadisticasComparativaPage = (tipoUsuario: number) => {
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
  const [estadisticaComparativa, setEstadisticaComparativa] = useState<any>(null);

  const [periodoUnoInicio, setPeriodoUnoInicio] = useState<string>("");
  const [periodoUnoFin, setPeriodoUnoFin] = useState<string>("");
  const [periodoDosInicio, setPeriodoDosInicio] = useState<string>("");
  const [periodoDosFin, setPeriodoDosFin] = useState<string>("");

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const getEstadisticasComparativa = useCallback(
    async (
      periodo1_inicio?: string,
      periodo1_fin?: string,
      periodo2_inicio?: string,
      periodo2_fin?: string
    ) => {
      try {
        setProcesando(true);
        const params: Record<string, string> = {};
        if (periodo1_inicio) params.periodo1_inicio = periodo1_inicio;
        if (periodo1_fin) params.periodo1_fin = periodo1_fin;
        if (periodo2_inicio) params.periodo2_inicio = periodo2_inicio;
        if (periodo2_fin) params.periodo2_fin = periodo2_fin;
        const estadistica = await getEstadisticasComparativaHttp(params);
        setEstadisticaComparativa(estadistica);
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
    getEstadisticasComparativa();
  }, []);

  useEffect(() => {
    if (periodoUnoInicio || periodoUnoFin || periodoDosInicio || periodoDosFin) {
      getEstadisticasComparativa(periodoUnoInicio, periodoUnoFin, periodoDosInicio, periodoDosFin);
    }
  }, [periodoUnoInicio, periodoUnoFin, periodoDosInicio, periodoDosFin]);

  return {
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    estadisticaComparativa,
    periodoUnoInicio,
    setPeriodoUnoInicio,
    periodoUnoFin,
    setPeriodoUnoFin,
    periodoDosInicio,
    setPeriodoDosInicio,
    periodoDosFin,
    setPeriodoDosFin,
  };
};

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import { numericFormatter } from "react-number-format";
import moment from "moment";
import { enviarValidacionHttp, getCanjesHttp } from "actions/canjes";

export const useListaCanjeos = (tipoUsuario: number) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoEditar, setProcesandoEditar] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);
  const [canjes, setCanjes] = useState<any[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const isSuperAdmin = tipoUsuario === 6;

  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");

  const [canjeId, setCanjeId] = useState("");

  const [buscador, setBuscador] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  //Ver datos del canje
  const [verCanje, setVerCanje] = useState<any>(null);
  const [isAlertOpenVerCanje, setIsAlertOpenVerCanje] = useState(false);
  const handleisAlertOpenVerCanje = () => setIsAlertOpenVerCanje(true);
  const handleisAlertCloseVerCanje = () => setIsAlertOpenVerCanje(false);

  const [procesandoIdentidad, setProcesandoIdentidad] = useState<boolean>(false);
  //Generación PDF
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const handleOpenPDFViewer = () => setIsPDFViewerOpen(true);
  const handleClosePDFViewer = () => setIsPDFViewerOpen(false);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  // Debounce para evitar muchas peticiones
  const handleBuscadorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBuscador(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      getCanjes(value);
    }, 500);
    setDebounceTimeout(timeout);
  };

  const getCanjes = useCallback(async (search?: string) => {
    try {
      setProcesando(true);
      const productosData = await getCanjesHttp(search);

      const datosFormateados = productosData.map((e: any) => {
        return {
          ...e,
          ...{
            costo_con_iva_format: numericFormatter(e?.costo_con_iva + "", {
              thousandSeparator: ",",
              decimalScale: 2,
              fixedDecimalScale: true,
              prefix: "$",
            }),
            fecha_creacion: moment(e?.fecha_ejecucion).format("DD-MM-YYYY"),
          },
        };
      });
      setCanjes(datosFormateados);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const validarIdentidad = async (data: any) => {
    try {
      setProcesandoIdentidad(true);
      await enviarValidacionHttp(data);
      setMensajeAlert(intl.formatMessage({ id: "validacion_enviada_correctamente" }));
      handleisAlertOpen();
      setProcesandoIdentidad(false);
    } catch (error) {
      setProcesandoIdentidad(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "validacion_enviada_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    getCanjes();
  }, [getCanjes]);

  return {
    validarIdentidad,
    verCanje,
    setVerCanje,
    isAlertOpenVerCanje,
    handleisAlertCloseVerCanje,
    handleisAlertOpenVerCanje,
    isSuperAdmin,
    handleBuscadorChange,
    buscador,
    setBuscador,
    navigate,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    setProcesando,
    setCanjeId,
    canjeId,
    procesandoEditar,
    tableKey,
    canjes,
    isPDFViewerOpen,
    handleClosePDFViewer,
    handleOpenPDFViewer,
    procesandoIdentidad,
  };
};

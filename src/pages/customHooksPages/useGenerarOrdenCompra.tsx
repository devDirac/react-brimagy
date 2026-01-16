import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import { numericFormatter } from "react-number-format";
import moment from "moment";
import { enviarValidacionHttp, getCanjesHttp, getCanjesPorProveedorHttp } from "actions/canjes";
import { enviarCotizacionProveedorHttp, getProveedoresOCHttp } from "actions/ordenCompra";

export const useGenerarOrdenCompra = (tipoUsuario: number) => {
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
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const isSuperAdmin = tipoUsuario === 6;

  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");

  const [canjeId, setCanjeId] = useState("");

  const [buscador, setBuscador] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  //Ver datos del canje
  const [verCanje, setVerCanje] = useState<any>(null);
  const [verProveedor, setVerProveedor] = useState<any>(null);
  const [isAlertOpenVerCanje, setIsAlertOpenVerCanje] = useState(false);
  const handleisAlertOpenVerCanje = () => setIsAlertOpenVerCanje(true);
  const handleisAlertCloseVerCanje = () => setIsAlertOpenVerCanje(false);

  const [procesandoIdentidad, setProcesandoIdentidad] = useState<boolean>(false);
  const [procesandoEnviarProveedor, setProcesandoEnviarProveedor] = useState<boolean>(false);
  const [procesandoOrdenCompra, setProcesandoOrdenCompra] = useState<boolean>(false);
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
      getProveedoresOC(value);
    }, 500);
    setDebounceTimeout(timeout);
  };

  const getProveedoresOC = useCallback(async (search?: string) => {
    try {
      setProcesando(true);
      const proveedoresData = await getProveedoresOCHttp(search);
      setProveedores(proveedoresData);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getCanjesPorProveedor = useCallback(async (id_proveedor: number) => {
    try {
      setProcesando(true);
      const proveedorData = await getCanjesPorProveedorHttp(id_proveedor);
      setVerCanje(proveedorData);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const enviarCotizacionProveedor = useCallback(async (datos: any) => {
    try {
      setProcesandoEnviarProveedor(true);
      await enviarCotizacionProveedorHttp(datos);
      setMensajeAlert(intl.formatMessage({ id: "exito_enviar_cotizacion_proveedor" }));
      handleisAlertOpen();
      setProcesandoEnviarProveedor(false);
    } catch (error) {
      setProcesandoEnviarProveedor(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "error_enviar_cotizacion_proveedor" }));
      handleisAlertOpen();
    }
  }, []);

  useEffect(() => {
    getProveedoresOC();
  }, [getProveedoresOC]);

  return {
    enviarCotizacionProveedor,
    procesandoEnviarProveedor,
    procesandoOrdenCompra,
    verProveedor,
    setVerProveedor,
    getCanjesPorProveedor,
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
    proveedores,
    isPDFViewerOpen,
    handleClosePDFViewer,
    handleOpenPDFViewer,
    procesandoIdentidad,
  };
};

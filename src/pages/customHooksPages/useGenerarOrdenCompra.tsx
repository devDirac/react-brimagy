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
import {
  enviarCotizacionProveedorHttp,
  enviarOrdenCompraFileProveedorHttp,
  getOCPorIdHttp,
  getOCPorIdProveedorHttp,
  getProveedoresOCHttp,
  rechazarCotizacionDeProveedorHttp,
} from "actions/ordenCompra";
import {
  enviarANuevoProveedorHttp,
  getProductoNuevoProveedorHttp,
  getProveedoresHttp,
} from "actions/proveedores";

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
  const [proveedoresSelect, setProveedoresSelect] = useState<any[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const isSuperAdmin = tipoUsuario === 6;

  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");

  const [canjeId, setCanjeId] = useState("");

  const [buscador, setBuscador] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  //Ver datos del canje
  const [verOrdenCompra, setVerOrdenCompra] = useState<any>(null);
  const [ordenesCompra, setOrdenesCompra] = useState<any[]>([]);
  const [conOC, setConOC] = useState(false);
  const [verCanje, setVerCanje] = useState<any>(null);
  const [verProveedor, setVerProveedor] = useState<any>(null);
  const [isAlertOpenVerCanje, setIsAlertOpenVerCanje] = useState(false);
  const handleisAlertOpenVerCanje = () => setIsAlertOpenVerCanje(true);
  const handleisAlertCloseVerCanje = () => setIsAlertOpenVerCanje(false);

  const [procesandoNuevoProveedor, setProcesandoNuevoProveedor] = useState<boolean>(false);
  const [procesandoIdentidad, setProcesandoIdentidad] = useState<boolean>(false);
  const [procesandoEnviarProveedor, setProcesandoEnviarProveedor] = useState<boolean>(false);
  const [procesandoOrdenCompra, setProcesandoOrdenCompra] = useState<boolean>(false);
  const [procesandoEnviarOrdenAProveedor, setProcesandoEnviarOrdenAProveedor] =
    useState<boolean>(false);
  const [procesandoRechazarCotizacion, setProcesandoRechazarCotizacion] = useState<boolean>(false);
  //Generación PDF
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const handleOpenPDFViewer = () => setIsPDFViewerOpen(true);
  const handleClosePDFViewer = () => setIsPDFViewerOpen(false);

  const [isAlertOpenVerOC, setIsAlertOpenVerOC] = useState(false);
  const handleisAlertOpenVerOC = () => setIsAlertOpenVerOC(true);
  const handleisAlertCloseVerOC = () => setIsAlertOpenVerOC(false);

  const [isAlertOpenOtroProveedor, setIsAlertOpenOtroProveedor] = useState(false);
  const handleisAlertOpenOtroProveedor = () => setIsAlertOpenOtroProveedor(true);
  const handleisAlertCloseOtroProveedor = () => setIsAlertOpenOtroProveedor(false);

  const [proveedorNuevo, setProveedorNuevo] = useState<any>(null);

  //ENVIAR PRODUCTO A OTRO PROVEEDOR
  const [ordenCompraActiva, setOrdenCompraActiva] = useState<any>(null);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<any>(null);
  const [productoNuevoProveedor, setProductoNuevoProveedor] = useState<any[]>([]);

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

  const getProveedores = useCallback(async () => {
    try {
      setProcesando(true);
      const asegurados = await getProveedoresHttp();
      setProveedoresSelect(asegurados);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

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

  const getOCPorIdProveedor = useCallback(async (id_proveedor: number) => {
    try {
      setProcesando(true);
      const ocData = await getOCPorIdProveedorHttp(id_proveedor);
      setOrdenesCompra(ocData);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getOCPorId = useCallback(async (id_orden_compra: number) => {
    try {
      setProcesando(true);
      const ocData = await getOCPorIdHttp(id_orden_compra);
      setVerCanje(ocData);
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

  const enviarCotizacionProveedor = async (datos: any) => {
    try {
      setProcesandoEnviarProveedor(true);
      await enviarCotizacionProveedorHttp(datos);
      setVerCanje((prevCanje: any) => {
        if (!prevCanje?.productos) return prevCanje;

        return {
          ...prevCanje,
          productos: prevCanje.productos.map((canje: any) =>
            canje.id_canje === datos.productos.id_canje ? { ...canje, estatus_proveedor: 0 } : canje
          ),
        };
      });
      setMensajeAlert(intl.formatMessage({ id: "exito_enviar_cotizacion_proveedor" }));
      handleisAlertOpen();
      setProcesandoEnviarProveedor(false);
    } catch (error) {
      setProcesandoEnviarProveedor(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "error_enviar_cotizacion_proveedor" }));
      handleisAlertOpen();
    }
  };

  const rechazarCotizacionDeProveedor = async (datos: any) => {
    try {
      setProcesandoRechazarCotizacion(true);
      const response = await rechazarCotizacionDeProveedorHttp(datos);
      setVerCanje((prevCanje: any) => ({
        ...prevCanje,
        orden_compra: {
          ...prevCanje.orden_compra,
          estatus: "cotizacion_rechazada",
        },
      }));
      setMensajeAlert(intl.formatMessage({ id: "cotizacion_rechazada_correctamente" }));
      handleisAlertOpen();
      setProcesandoRechazarCotizacion(false);
    } catch (error) {
      setProcesandoRechazarCotizacion(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "cotizacion_rechazada_error" }));
      handleisAlertOpen();
    }
  };

  const enviarOrdenCompraProveedor = async (datos: any) => {
    try {
      setProcesandoEnviarOrdenAProveedor(true);
      await enviarOrdenCompraFileProveedorHttp(datos);
      setVerCanje((prevCanje: any) => ({
        ...prevCanje,
        orden_compra: {
          ...prevCanje.orden_compra,
          estatus: "orden_compra_enviada_a_proveedor",
        },
      }));
      setMensajeAlert(intl.formatMessage({ id: "exito_enviar_orden_compra_proveedor" }));
      handleisAlertOpen();
      setProcesandoEnviarOrdenAProveedor(false);
    } catch (error) {
      setProcesandoEnviarOrdenAProveedor(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "error_enviar_orden_compra_proveedor" }));
      handleisAlertOpen();
    }
  };
  const enviarANuevoProveedor = async (datos: any) => {
    try {
      setProcesandoNuevoProveedor(true);
      await enviarANuevoProveedorHttp(datos);
      setMensajeAlert(intl.formatMessage({ id: "exito_enviar_producto_a_otro_proveedor" }));
      handleisAlertOpen();
      setProcesandoNuevoProveedor(false);
    } catch (error) {
      setProcesandoNuevoProveedor(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(
        message || intl.formatMessage({ id: "error_enviar_producto_a_otro_proveedor" })
      );
      handleisAlertOpen();
    }
  };

  const getProductoNuevoProveedor = useCallback(async (datos: any) => {
    try {
      console.log(datos);
      setProcesando(true);
      const nuevosProveedores = await getProductoNuevoProveedorHttp(datos);
      setProductoNuevoProveedor(nuevosProveedores);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  useEffect(() => {
    getProveedoresOC();
    getProveedores();
  }, [getProveedoresOC, getProveedores]);

  return {
    enviarANuevoProveedor,
    setOrdenCompraActiva,
    ordenCompraActiva,
    setProveedorSeleccionado,
    proveedorSeleccionado,
    getProductoNuevoProveedor,
    setProductoNuevoProveedor,
    productoNuevoProveedor,
    rechazarCotizacionDeProveedor,
    procesandoRechazarCotizacion,
    procesandoNuevoProveedor,
    setProveedorNuevo,
    proveedorNuevo,
    proveedoresSelect,
    isAlertOpenOtroProveedor,
    handleisAlertCloseOtroProveedor,
    handleisAlertOpenOtroProveedor,
    procesandoEnviarOrdenAProveedor,
    enviarOrdenCompraProveedor,
    getOCPorId,
    ordenesCompra,
    isAlertOpenVerOC,
    handleisAlertOpenVerOC,
    handleisAlertCloseVerOC,
    conOC,
    getOCPorIdProveedor,
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

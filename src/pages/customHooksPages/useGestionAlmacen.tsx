import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import {
  addGuiaProductoAlmacenHttp,
  confirmarRecepcionProductoAlmacenHttp,
  enviarProductoAlmacenHttp,
  getProductoAlmacenPorIdHttp,
  getProductosAlmacenHttp,
  recibirProductoAlmacenHttp,
} from "actions/almacen";
import { subirEvidenciasHttp } from "actions/evidencias";
import { addFechaPagoFacturaHttp } from "actions/factura";
import { enviarEncuestaUsuarioHttp, getEncuestasDisponiblesHttp } from "actions/encuestas";

export const useGestionAlmacen = (tipoUsuario: number) => {
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

  const [buscador, setBuscador] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoRecibirProducto, setProcesandoRecibirProducto] = useState<boolean>(false);
  const [procesandoGuiaProducto, setProcesandoGuiaProducto] = useState<boolean>(false);
  const [procesandoEnvioProducto, setProcesandoEnvioProducto] = useState<boolean>(false);
  const [procesandoRecepcionProducto, setProcesandoRecepcionProducto] = useState<boolean>(false);

  //Ver productos en almacen
  const [productos, setProductos] = useState<any[]>([]);
  const [verProducto, setVerProducto] = useState<any>(null);
  const [isAlertOpenVerProducto, setIsAlertOpenVerProducto] = useState(false);
  const handleisAlertOpenVerProducto = () => setIsAlertOpenVerProducto(true);
  const handleisAlertCloseVerProducto = () => setIsAlertOpenVerProducto(false);

  const [cantidadProducto, setCantidadProducto] = useState("");
  const [isAlertOpenCantidad, setIsAlertOpenCantidad] = useState(false);
  const handleisAlertOpenCantidad = () => setIsAlertOpenCantidad(true);
  const handleisAlertCloseCantidad = () => setIsAlertOpenCantidad(false);

  const [guiaProducto, setGuiaProducto] = useState("");
  const [isAlertOpenGuia, setIsAlertOpenGuia] = useState(false);
  const handleisAlertOpenGuia = () => setIsAlertOpenGuia(true);
  const handleisAlertCloseGuia = () => setIsAlertOpenGuia(false);

  //Para evidencias
  const [procesandoEvidencias, setProcesandoEvidencias] = useState<boolean>(false);
  const [evidenciasFiles, setEvidenciasFiles] = useState<File[]>([]);
  const [isModalEvidencia, setIsModalEvidencia] = useState(false);
  const handleOpenEvidencia = () => setIsModalEvidencia(true);
  const handleCloseEvidencia = () => setIsModalEvidencia(false);

  const [isModalVistaEvidencia, setIsModalVistaEvidencia] = useState(false);
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState<any>(null);

  const handleOpenVistaEvidencia = (evidencia: any) => {
    setEvidenciaSeleccionada(evidencia);
    setIsModalVistaEvidencia(true);
  };

  const handleCloseVistaEvidencia = () => {
    setIsModalVistaEvidencia(false);
    setEvidenciaSeleccionada(null);
  };

  //factura
  const [isModalVistaFactura, setIsModalVistaFactura] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);

  const handleOpenVistaFactura = (factura: any) => {
    setFacturaSeleccionada(factura);
    setIsModalVistaFactura(true);
  };

  const handleCloseVistaFactura = () => {
    setIsModalVistaFactura(false);
    setFacturaSeleccionada(null);
  };
  //FECHA PAGO DE FACTURA
  const [procesandoFechaPagoFactura, setProcesandoFechaPagoFactura] = useState<boolean>(false);
  const [fechaPagoFactura, setFechaPagoFactura] = useState("");
  const [isAlertOpenFechaPagoFactura, setIsAlertOpenFechaPagoFactura] = useState(false);
  const handleisAlertOpenFechaPagoFactura = () => setIsAlertOpenFechaPagoFactura(true);
  const handleisAlertCloseFechaPagoFactura = () => setIsAlertOpenFechaPagoFactura(false);
  //ENVIAR ENCUESTA
  const [encuestas, setEncuestas] = useState<any[]>([]);
  const [tipoEncuesta, setTipoEncuesta] = useState("");
  const [datosEncuestaEnviar, setDatosEncuestaEnviar] = useState<any>(null);
  const [procesandoEnviarEncuesta, setProcesandoEnviarEncuesta] = useState<boolean>(false);
  const [isAlertOpenEnviarEncuesta, setIsAlertOpenEnviarEncuesta] = useState(false);
  const handleisAlertOpenEnviarEncuesta = () => setIsAlertOpenEnviarEncuesta(true);
  const handleisAlertCloseEnviarEncuesta = () => setIsAlertOpenEnviarEncuesta(false);

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
      getProductosAlmacen(value);
    }, 500);
    setDebounceTimeout(timeout);
  };

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

  const getProductosAlmacen = useCallback(async (search?: string) => {
    try {
      setProcesando(true);
      const productos = await getProductosAlmacenHttp(search);
      setProductos(productos);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getProductoAlmacenPorId = useCallback(async (data: any) => {
    try {
      setProcesando(true);
      const proveedorData = await getProductoAlmacenPorIdHttp(data);
      setVerProducto(proveedorData);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const addProductoAlmacen = async (datos: any) => {
    try {
      setProcesandoRecibirProducto(true);
      const recibirProducto: any = await recibirProductoAlmacenHttp(datos);
      setVerProducto((prevProducto: any) => ({
        ...prevProducto,
        estatus: recibirProducto?.estatus,
        cantidad_almacen: recibirProducto?.cantidad_recibida,
      }));

      setMensajeAlert(
        `${intl.formatMessage({ id: "exito_recibir_producto" })}. ${
          recibirProducto.estatus === "en_almacen"
            ? "Producto completamente recibido."
            : `Pendiente: ${recibirProducto.cantidad_pendiente} unidades.`
        }`
      );
      setCantidadProducto("");
      handleisAlertOpen();
      setProcesandoRecibirProducto(false);
    } catch (error) {
      setProcesandoRecibirProducto(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "error_recibir_producto" }));
      handleisAlertOpen();
    }
  };

  const addGuiaProductoAlmacen = async (datos: any) => {
    try {
      setProcesandoGuiaProducto(true);
      await addGuiaProductoAlmacenHttp(datos);
      setVerProducto((prevProducto: any) => ({
        ...prevProducto,
        estatus: "guia_asignada",
      }));

      setMensajeAlert(intl.formatMessage({ id: "guia_añadida_correctamente" }));
      setCantidadProducto("");
      handleisAlertOpen();
      setProcesandoGuiaProducto(false);
    } catch (error) {
      setProcesandoGuiaProducto(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "guia_añadida_error" }));
      handleisAlertOpen();
    }
  };
  const enviarProductoAlmacen = async (datos: any) => {
    try {
      setProcesandoEnvioProducto(true);
      await enviarProductoAlmacenHttp(datos);
      setVerProducto((prevProducto: any) => ({
        ...prevProducto,
        estatus: "enviado",
      }));

      setMensajeAlert(intl.formatMessage({ id: "producto_enviado_correctamente" }));
      setCantidadProducto("");
      handleisAlertOpen();
      setProcesandoEnvioProducto(false);
    } catch (error) {
      setProcesandoEnvioProducto(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "producto_enviado_error" }));
      handleisAlertOpen();
    }
  };
  const confirmarRecepcionProductoAlmacen = async (datos: any) => {
    try {
      setProcesandoRecepcionProducto(true);
      await confirmarRecepcionProductoAlmacenHttp(datos);
      setVerProducto((prevProducto: any) => ({
        ...prevProducto,
        estatus: "entregado",
      }));

      setMensajeAlert(intl.formatMessage({ id: "producto_entregado_correctamente" }));
      setCantidadProducto("");
      handleisAlertOpen();
      setProcesandoRecepcionProducto(false);
    } catch (error) {
      setProcesandoRecepcionProducto(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "producto_entregado_error" }));
      handleisAlertOpen();
    }
  };

  const subirEvidencias = async (data: FormData) => {
    try {
      setProcesandoEvidencias(true);
      const resultado = await subirEvidenciasHttp(data);
      // Actualizar verProducto con las nuevas evidencias
      if (resultado && resultado.evidencias) {
        setVerProducto((prev: any) => ({
          ...prev,
          evidencias: resultado.evidencias,
        }));
      }
      setMensajeAlert(intl.formatMessage({ id: "http_exito_evidencia_enviada" }));
      handleisAlertOpen();
      setProcesandoEvidencias(false);
    } catch (error) {
      setProcesandoEvidencias(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "evidencia_enviada_error" }));
      handleisAlertOpen();
    }
  };

  const addFechaPagoFactura = async (datos: any) => {
    try {
      setProcesandoFechaPagoFactura(true);
      await addFechaPagoFacturaHttp(datos);
      setVerProducto((prevProducto: any) => ({
        ...prevProducto,
        fecha_pago: fechaPagoFactura,
      }));

      setMensajeAlert(intl.formatMessage({ id: "añadir_fecha_pago_factura_correctamente" }));
      setCantidadProducto("");
      handleisAlertOpen();
      setProcesandoFechaPagoFactura(false);
    } catch (error) {
      setProcesandoFechaPagoFactura(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "añadir_fecha_pago_factura_error" }));
      handleisAlertOpen();
    }
  };

  const enviarEncuesta = async (data: any) => {
    try {
      setProcesandoEnviarEncuesta(true);
      const resultado = await enviarEncuestaUsuarioHttp(data);
      setMensajeAlert(intl.formatMessage({ id: "encuesta_enviada_correctamente" }));
      handleisAlertOpen();
      setProcesandoEnviarEncuesta(false);
    } catch (error) {
      setProcesandoEnviarEncuesta(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "encuesta_enviada_error" }));
      handleisAlertOpen();
    }
  };

  const cantidadMaximaPermitida = useMemo(() => {
    if (!verProducto) return 0;
    const cantidadTotal = verProducto.cantidad_producto || 0;
    const cantidadYaRecibida = verProducto.cantidad_almacen || 0;
    return cantidadTotal - cantidadYaRecibida;
  }, [verProducto]);

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    if (isNaN(value) || value < 0) {
      setCantidadProducto("");
      return;
    }
    if (value > cantidadMaximaPermitida) {
      setCantidadProducto(cantidadMaximaPermitida.toString());
      return;
    }
    setCantidadProducto(value.toString());
  };

  useEffect(() => {
    getEncuestasDisponibles();
  }, []);

  useEffect(() => {
    getProductosAlmacen();
  }, [getProductosAlmacen]);

  return {
    enviarEncuesta,
    addFechaPagoFactura,
    enviarProductoAlmacen,
    confirmarRecepcionProductoAlmacen,
    procesandoEnvioProducto,
    procesandoGuiaProducto,
    procesandoRecepcionProducto,
    setGuiaProducto,
    guiaProducto,
    isAlertOpenGuia,
    handleisAlertOpenGuia,
    handleisAlertCloseGuia,
    addGuiaProductoAlmacen,
    isAlertOpenCantidad,
    handleisAlertOpenCantidad,
    handleisAlertCloseCantidad,
    handleCantidadChange,
    cantidadMaximaPermitida,
    setCantidadProducto,
    cantidadProducto,
    procesandoRecibirProducto,
    addProductoAlmacen,
    getProductoAlmacenPorId,
    productos,
    verProducto,
    isAlertOpenVerProducto,
    handleisAlertCloseVerProducto,
    handleisAlertOpenVerProducto,
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
    procesandoEditar,
    tableKey,
    //evidencias
    subirEvidencias,
    isModalVistaEvidencia,
    evidenciaSeleccionada,
    handleOpenVistaEvidencia,
    handleCloseVistaEvidencia,
    procesandoEvidencias,
    setProcesandoEvidencias,
    evidenciasFiles,
    setEvidenciasFiles,
    handleOpenEvidencia,
    handleCloseEvidencia,
    isModalEvidencia,
    //facturas
    isModalVistaFactura,
    setIsModalVistaFactura,
    handleOpenVistaFactura,
    handleCloseVistaFactura,
    facturaSeleccionada,
    setFacturaSeleccionada,
    //fecha de pago de la factura
    procesandoFechaPagoFactura,
    isAlertOpenFechaPagoFactura,
    handleisAlertOpenFechaPagoFactura,
    handleisAlertCloseFechaPagoFactura,
    setFechaPagoFactura,
    fechaPagoFactura,
    //encuestas
    procesandoEnviarEncuesta,
    isAlertOpenEnviarEncuesta,
    handleisAlertOpenEnviarEncuesta,
    handleisAlertCloseEnviarEncuesta,
    setDatosEncuestaEnviar,
    datosEncuestaEnviar,
    encuestas,
    setTipoEncuesta,
    tipoEncuesta,
  };
};

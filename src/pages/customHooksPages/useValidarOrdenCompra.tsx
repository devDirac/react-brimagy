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
import {
  aceptarProductoOCHttp,
  getOrdenCompraPorProveedorHttp,
  rechazarProductoOCHttp,
} from "actions/ordenCompra";

export const useValidarOrdenCompra = () => {
  const { id_ordencompra } = useParams<{ id_ordencompra: string }>();
  const navigate = useNavigate();
  const intl = useIntl();

  const [ordenCompra, setOrdenCompra] = useState<any>(null);
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

  const cargarOrdenCompraPorProveedor = useCallback(async (id_ordencompra: string) => {
    try {
      setProcesando(true);
      const response = await getOrdenCompraPorProveedorHttp(id_ordencompra);
      setOrdenCompra(response);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "no_existe_canje" }));
      handleisAlertOpen();
    }
  }, []);

  const aceptarProductoOC = async (idCanje: number) => {
    try {
      setProcesandoCodigo(true);
      const response = await aceptarProductoOCHttp({ id_canje: idCanje });
      setOrdenCompra((prevOrden: any) => {
        if (!prevOrden?.productos) return prevOrden;

        return {
          ...prevOrden,
          productos: prevOrden.productos.map((producto: any) =>
            producto.id_canje === idCanje ? { ...producto, estatus_proveedor: 1 } : producto
          ),
        };
      });
      setMensajeAlert(intl.formatMessage({ id: "producto_aceptado_correctamente" }));
      handleisAlertOpen();
      setProcesandoCodigo(false);
    } catch (error) {
      setProcesandoCodigo(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "producto_aceptado_error" }));
      handleisAlertOpen();
    }
  };

  const rechazarProductoOC = async (idCanje: number) => {
    try {
      setProcesandoCodigo(true);
      const response = await rechazarProductoOCHttp({ id_canje: idCanje });
      setOrdenCompra((prevOrden: any) => {
        if (!prevOrden?.productos) return prevOrden;

        return {
          ...prevOrden,
          productos: prevOrden.productos.map((producto: any) =>
            producto.id_canje === idCanje ? { ...producto, estatus_proveedor: 2 } : producto
          ),
        };
      });
      setMensajeAlert(intl.formatMessage({ id: "producto_rechazado_correctamente" }));
      handleisAlertOpen();
      setProcesandoCodigo(false);
    } catch (error) {
      setProcesandoCodigo(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "producto_rechazado_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    if (id_ordencompra) {
      cargarOrdenCompraPorProveedor(id_ordencompra);
    }
  }, [id_ordencompra]);

  return {
    aceptarProductoOC,
    rechazarProductoOC,
    cargarOrdenCompraPorProveedor,
    verificado,
    showInput,
    setShowInput,
    codigoVerificacion,
    procesandoCodigo,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    ordenCompra,
    procesando,
    intl,
    navigate,
  };
};

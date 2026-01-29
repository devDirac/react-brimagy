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
  enviarOCAprobacionHttp,
  getOrdenCompraPorProveedorHttp,
  rechazarProductoOCHttp,
  subirPDFFacturaHttp,
  validarFacturaOrdenCompraHttp,
  validarOrdenCompraFinalHttp,
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
  const [procesandoValidandoFactura, setProcesandoValidandoFactura] = useState<boolean>(false);
  const [procesandoSubirPDFFactura, setProcesandoSubirPDFFactura] = useState<boolean>(false);
  const [procesandoValidacionFinal, setProcesandoValidacionFinal] = useState<boolean>(false);

  const [facturaValidada, setFacturaValidada] = useState<boolean>(false);
  const [observaciones, setObservaciones] = useState("");
  //Generación PDF
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const handleOpenPDFViewer = () => setIsPDFViewerOpen(true);
  const handleClosePDFViewer = () => setIsPDFViewerOpen(false);

  const [factura, setFactura] = useState<File | null>(null);
  const handleChangeFactura = (newFile: File | null) => {
    setFactura(newFile);
  };

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

  const aceptarProductoOC = async (id_producto: number) => {
    try {
      setProcesandoCodigo(true);
      const response = await aceptarProductoOCHttp({ id_producto: id_producto });
      setOrdenCompra((prevOrden: any) => {
        if (!prevOrden?.productos) return prevOrden;

        return {
          ...prevOrden,
          productos: prevOrden.productos.map((producto: any) =>
            producto.id === id_producto ? { ...producto, estatus_proveedor: 1 } : producto
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

  const rechazarProductoOC = async (id_producto: number) => {
    try {
      setProcesandoCodigo(true);
      const response = await rechazarProductoOCHttp({ id_producto: id_producto });
      setOrdenCompra((prevOrden: any) => {
        if (!prevOrden?.productos) return prevOrden;

        return {
          ...prevOrden,
          productos: prevOrden.productos.map((producto: any) =>
            producto.id === id_producto ? { ...producto, estatus_proveedor: 2 } : producto
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
  const enviarAprobacion = async (data: any) => {
    try {
      setProcesandoCodigo(true);
      const response = await enviarOCAprobacionHttp(data);
      setOrdenCompra((prevOrden: any) => ({
        ...prevOrden,
        orden_compra: {
          ...prevOrden.orden_compra,
          estatus: "cotizacion_validada_por_proveedor",
        },
      }));
      setMensajeAlert(intl.formatMessage({ id: "orden_compra_enviada_aprobacion_exito" }));
      handleisAlertOpen();
      setProcesandoCodigo(false);
    } catch (error) {
      setProcesandoCodigo(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(
        message || intl.formatMessage({ id: "orden_compra_enviada_aprobacion_error" })
      );
      handleisAlertOpen();
    }
  };
  const validarFacturaOrdenCompra = async (data: any) => {
    try {
      setProcesandoValidandoFactura(true);

      const formData = new FormData();
      formData.append("id_orden_compra", data.id_orden_compra);
      formData.append("id_proveedor", data.id_proveedor);
      formData.append("id_usuario", data.id_usuario);
      formData.append("xml_factura", data.xml_factura);

      const response: any = await validarFacturaOrdenCompraHttp(formData);
      if (response.validacion.status === "success") {
        setFacturaValidada(true);
      }
      setOrdenCompra((prevOrden: any) => ({
        ...prevOrden,
        orden_compra: {
          ...prevOrden.orden_compra,
          estatus: "xml_validado_correctamente_proveedor",
        },
      }));
      setMensajeAlert(intl.formatMessage({ id: "factura_validada_correctamente" }));
      handleisAlertOpen();
      setProcesandoValidandoFactura(false);
      // Limpiar el archivo después de validar
      setFactura(null);
    } catch (error) {
      setProcesandoValidandoFactura(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "factura_validada_error" }));
      handleisAlertOpen();
    }
  };

  const subirPDFFactura = async (data: any) => {
    try {
      setProcesandoSubirPDFFactura(true);

      const formData = new FormData();
      formData.append("id_orden_compra", data.id_orden_compra);
      formData.append("id_proveedor", data.id_proveedor);
      formData.append("id_usuario", data.id_usuario);
      formData.append("pdf_factura", data.pdf_factura);

      const response: any = await subirPDFFacturaHttp(formData);
      setOrdenCompra((prevOrden: any) => ({
        ...prevOrden,
        orden_compra: {
          ...prevOrden.orden_compra,
          estatus: "factura_subida_correctamente_proveedor",
        },
      }));
      setMensajeAlert(intl.formatMessage({ id: "pdf_factura_subido_correctamente" }));
      handleisAlertOpen();
      setProcesandoSubirPDFFactura(false);
      setFactura(null);
    } catch (error) {
      setProcesandoSubirPDFFactura(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "pdf_factura_subido_error" }));
      handleisAlertOpen();
    }
  };

  const validarOrdenCompraFinal = async (data: any) => {
    try {
      setProcesandoValidacionFinal(true);
      const response = await validarOrdenCompraFinalHttp(data);
      setOrdenCompra((prevOrden: any) => ({
        ...prevOrden,
        orden_compra: {
          ...prevOrden.orden_compra,
          estatus: "orden_validada_por_proveedor",
        },
      }));
      setMensajeAlert(intl.formatMessage({ id: "orden_compra_final_validada_exito" }));
      handleisAlertOpen();
      setProcesandoValidacionFinal(false);
    } catch (error) {
      setProcesandoValidacionFinal(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "orden_compra_final_validada_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    if (id_ordencompra) {
      cargarOrdenCompraPorProveedor(id_ordencompra);
    }
  }, [id_ordencompra]);

  return {
    handleOpenPDFViewer,
    isPDFViewerOpen,
    handleClosePDFViewer,
    validarOrdenCompraFinal,
    subirPDFFactura,
    procesandoSubirPDFFactura,
    procesandoValidandoFactura,
    validarFacturaOrdenCompra,
    factura,
    handleChangeFactura,
    setObservaciones,
    observaciones,
    enviarAprobacion,
    aceptarProductoOC,
    rechazarProductoOC,
    cargarOrdenCompraPorProveedor,
    verificado,
    facturaValidada,
    setFacturaValidada,
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

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  subirPDFFacturaHttp,
  validarFacturaOrdenCompraHttp,
  validarOrdenCompraFinalHttp,
} from "actions/ordenCompra";
import {
  asignarProveedorHttp,
  crearProveedorHttp,
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
  const [procesandoValidandoFactura, setProcesandoValidandoFactura] = useState<boolean>(false);
  const [procesandoSubirPDFFactura, setProcesandoSubirPDFFactura] = useState<boolean>(false);
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

  const [visualizacion, setVisualizacion] = useState<string | null>("cuadricula");

  //ASIGNAR PROVEEDOR A UN PRODUCTO
  const [procesandoProveedor, setProcesandoProveedor] = useState<boolean>(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  const [isAlertOpenAsignarProveedor, setIsAlertOpenAsignarProveedor] = useState(false);
  const handleisAlertOpenAsignarProveedor = () => setIsAlertOpenAsignarProveedor(true);
  const handleisAlerCloseAsignarProveedor = () => setIsAlertOpenAsignarProveedor(false);

  //MODAL REGISTRAR NUEVO PROVEEDOR
  const [isAlertOpenNuevoProveedor, setIsAlertOpenNuevoProveedor] = useState(false);
  const handleisAlertOpenNuevoProveedor = () => setIsAlertOpenNuevoProveedor(true);
  const handleisAlerCloseNuevoProveedor = () => setIsAlertOpenNuevoProveedor(false);

  //PARA AÑADIR FACTURAS/XML
  const [facturaValidada, setFacturaValidada] = useState<boolean>(false);
  const [procesandoValidacionFinal, setProcesandoValidacionFinal] = useState<boolean>(false);
  const [factura, setFactura] = useState<File | null>(null);
  const handleChangeFactura = (newFile: File | null) => {
    setFactura(newFile);
  };

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const formikAsignar = useFormik({
    initialValues: {
      id_proveedor: "",
    },
    validationSchema: Yup.object({
      id_proveedor: Yup.string(),
    }),
    onSubmit: async (values) => {
      console.log("Formulario enviado:", values);
    },
  });

  const formik = useFormik({
    initialValues: {
      id_proveedor: "",
      nombre: "",
      razon_social: "",
      descripcion: "",
      nombre_contacto: "",
      telefono: "",
      correo: "",
    },
    validationSchema: Yup.object({
      id_proveedor: Yup.string(),
      nombre: Yup.string(),
      razon_social: Yup.string(),
      descripcion: Yup.string(),
      nombre_contacto: Yup.string(),
      telefono: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      correo: Yup.string()
        .email(intl.formatMessage({ id: "input_validation_email_invalido" }))
        .required(intl.formatMessage({ id: "input_validation_requerido" })),
    }),
    onSubmit: async (values) => {
      console.log("Formulario enviado:", values);
    },
  });

  const isFieldValid = (fieldName: keyof typeof formikAsignar.values) => {
    return (
      formikAsignar.touched[fieldName] &&
      !formikAsignar.errors[fieldName] &&
      formikAsignar.values[fieldName] &&
      formikAsignar.values[fieldName] !== ""
    );
  };

  const getFieldColor = (fieldName: keyof typeof formikAsignar.values) => {
    return isFieldValid(fieldName) ? "#00AB16" : undefined;
  };

  const handleVisualizacion = (
    event: React.MouseEvent<HTMLElement>,
    nuevaVisualizacion: string | null
  ) => {
    setVisualizacion(nuevaVisualizacion);
  };

  const handleAccion = (accion: string, row: any) => {
    switch (accion) {
      case "crear_orden_compra":
        setVerProveedor(row);
        getCanjesPorProveedor(row.id);
        handleisAlertOpenVerCanje();
        break;
      case "vista_previa":
        setVerProveedor(row);
        getOCPorIdProveedor(row.id);
        handleisAlertOpenVerOC();
        break;
      case "eliminar":
        //setProductoId(row?.id);
        //handleisAlertOpenEliminaProducto();
        break;
      default:
        break;
    }
  };

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
      const proveedores = await getProveedoresHttp();
      setProveedoresSelect(proveedores);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const crearProveedor = async (datos: any) => {
    try {
      setProcesandoProveedor(true);
      const proveedorData: any = await crearProveedorHttp(datos);
      setProveedoresSelect((prev) => [...prev, proveedorData]);
      formikAsignar.setFieldValue("id_proveedor", proveedorData.id);
      formik.resetForm();
      setProcesandoProveedor(false);
      setMensajeAlert(intl.formatMessage({ id: "proveedor_creado_correctamente" }));
      handleisAlerCloseNuevoProveedor();
      handleisAlertOpen();
    } catch (error) {
      setProcesandoProveedor(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "proveedor_creado_error" }));
      handleisAlertOpen();
    }
  };

  const asignarProveedor = async (datos: any) => {
    try {
      setProcesandoProveedor(true);
      const proveedorData: any = await asignarProveedorHttp(datos);
      await getProveedoresOC();
      //setProveedoresSelect((prev) => [...prev, proveedorData]);
      //formikAsignar.setFieldValue("id_proveedor", proveedorData.id);
      formikAsignar.resetForm();
      setProcesandoProveedor(false);
      setMensajeAlert(intl.formatMessage({ id: "proveedor_asignado_correctamente" }));
      handleisAlertCloseVerCanje();
      handleisAlerCloseNuevoProveedor();
      handleisAlerCloseAsignarProveedor();
      handleisAlertOpen();
    } catch (error) {
      setProcesandoProveedor(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "proveedor_asignado_error" }));
      handleisAlertOpen();
    }
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

  //FUNCIONES PARA FACTURAS POR PARTE DE BRIMAGY
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
      setVerCanje((prevOrden: any) => ({
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
      setVerCanje((prevOrden: any) => ({
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
      setVerCanje((prevOrden: any) => ({
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
    getProveedoresOC();
    getProveedores();
  }, [getProveedoresOC, getProveedores]);

  return {
    formik,
    formikAsignar,
    getFieldColor,
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
    visualizacion,
    handleVisualizacion,
    handleAccion,
    //para factura
    procesandoValidandoFactura,
    procesandoSubirPDFFactura,
    factura,
    handleChangeFactura,
    validarFacturaOrdenCompra,
    subirPDFFactura,
    procesandoValidacionFinal,
    validarOrdenCompraFinal,
    //ASIGNAR PROVEEDOR A UN PRODUCTO
    asignarProveedor,
    crearProveedor,
    procesandoProveedor,
    productoSeleccionado,
    setProductoSeleccionado,
    isAlertOpenAsignarProveedor,
    handleisAlertOpenAsignarProveedor,
    handleisAlerCloseAsignarProveedor,
    isAlertOpenNuevoProveedor,
    handleisAlertOpenNuevoProveedor,
    handleisAlerCloseNuevoProveedor,
  };
};

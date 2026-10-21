import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import { numericFormatter } from "react-number-format";
import moment from "moment";
import {
  enviarValidacionHttp,
  enviarValidacionSinProveedorHttp,
  getCanjesHttp,
} from "actions/canjes";

const CAMPOS_PRODUCTO = [
  "id_producto", "id_proveedor", "nombre_premio", "sku", "sku_catalogo",
  "size", "color", "category", "number_of_awards", "costo_premio",
  "puntos_canjeados", "estado_validacion",
] as const;

export const agruparCanjes = (rows: any[]) => {
  const mapa = new Map<number, any>();

  rows.forEach((row) => {
    if (row.id_producto == null) return;

    const producto: any = {};
    CAMPOS_PRODUCTO.forEach((k) => (producto[k] = row[k]));

    const existente = mapa.get(row.id);
    if (existente) {
      existente.productos.push(producto);
    } else {
      // datos del canje = todo lo que no es del producto
      const canje: any = { ...row };
      CAMPOS_PRODUCTO.forEach((k) => delete canje[k]);
      mapa.set(row.id, { ...canje, productos: [producto] });
    }
  });

  return Array.from(mapa.values()).map((c) => {
    const estados = c.productos.map((p: any) => p.estado_validacion);
    const todos = estados.every((e: string | null) => e === "identidad_validada");
    const ninguno = estados.every((e: string | null) => !e);
    return {
      ...c,
      estado_validacion: todos ? "identidad_validada" : ninguno ? null : "validacion_parcial",
      total_puntos: c.productos.reduce((acc: number, p: any) => acc + Number(p.puntos_canjeados || 0), 0),
      total_premios: c.productos.reduce((acc: number, p: any) => acc + Number(p.number_of_awards || 0), 0),
    };
  });
};

export const useListaCanjeos = (tipoUsuario: number) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
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
  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");

  const [canjeId, setCanjeId] = useState("");

  const [buscador, setBuscador] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  //Ver datos del canje
  const [verCanje, setVerCanje] = useState<any>(null);
  const [isAlertOpenVerCanje, setIsAlertOpenVerCanje] = useState(false);
  const handleisAlertOpenVerCanje = () => setIsAlertOpenVerCanje(true);
  const handleisAlertCloseVerCanje = () => setIsAlertOpenVerCanje(false);

  //Ver datos del producto buscando por fechas
  const [isAlertOpenFechas, setIsAlertOpenFechas] = useState(false);
  const handleisAlertOpenFechas = () => setIsAlertOpenFechas(true);
  const handleisAlertCloseFechas = () => setIsAlertOpenFechas(false);

  const [procesandoIdentidad, setProcesandoIdentidad] = useState<boolean>(false);
  const [procesandoIdentidadDirecto, setProcesandoIdentidadDirecto] = useState<boolean>(false);
  //Generación PDF
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const handleOpenPDFViewer = () => setIsPDFViewerOpen(true);
  const handleClosePDFViewer = () => setIsPDFViewerOpen(false);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const [visualizacion, setVisualizacion] = useState<string | null>("cuadricula");
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");

  const esDigital = location.pathname.includes("canjes-digitales");

  const canjesAgrupados = useMemo(() => agruparCanjes(canjes), [canjes]);

  const handleVisualizacion = (
    event: React.MouseEvent<HTMLElement>,
    nuevaVisualizacion: string | null
  ) => {
    setVisualizacion(nuevaVisualizacion);
  };

  const handleAccion = (accion: string, row: any) => {
    switch (accion) {
      case "vista_previa":
        const canje = canjesAgrupados.find((c) => c.id === row.id);
        if (!canje) break;
        setVerCanje(canje);
        handleisAlertOpenVerCanje();
        break;
      case "editar":
        //setProductoEditar(row);
        //handleisAlertOpenEditarProducto();
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
      getCanjes({ search: value, fecha1, fecha2 });
    }, 500);
    setDebounceTimeout(timeout);
  };

  const getCanjes = useCallback(
    async (params?: {
      tipo_producto?: string;
      search?: string;
      fecha1?: string;
      fecha2?: string;
      plataforma?: string;
    }) => {
      try {
        setProcesando(true);
        const productosData = await getCanjesHttp(
          esDigital ? "digital" : "fisico",
          params?.search,
          params?.fecha1 ? new Date(params.fecha1) : undefined,
          params?.fecha2 ? new Date(params.fecha2) : undefined,
          params?.plataforma ?? plataforma
        );

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
    },
    [esDigital, plataforma]
  );

  const validarIdentidad = async (data: any) => {
    try {
      setProcesandoIdentidad(true);
      await enviarValidacionHttp(data);
      setVerCanje((prevCanje: any) => ({
        ...prevCanje,
        estado_validacion: "notificacion_enviada",
      }));
      setCanjes((prevCanjes: any[]) =>
        prevCanjes.map((c) =>
          c.id === verCanje?.id ? { ...c, estado_validacion: "notificacion_enviada" } : c
        )
      );
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

  const validarIdentidadSinProveedor = async (data: any) => {
    try {
      setProcesandoIdentidadDirecto(true);
      await enviarValidacionSinProveedorHttp(data);
      setVerCanje((prevCanje: any) => ({
        ...prevCanje,
        estado_validacion: "identidad_validada",
      }));
      setCanjes((prevCanjes: any[]) =>
        prevCanjes.map((c) =>
          c.id === verCanje?.id ? { ...c, estado_validacion: "identidad_validada" } : c
        )
      );
      setMensajeAlert(intl.formatMessage({ id: "canje_validado_correctamente" }));
      handleisAlertOpen();
      setProcesandoIdentidadDirecto(false);
    } catch (error) {
      setProcesandoIdentidadDirecto(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "canje_validado_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    getCanjes({ plataforma });
  }, [getCanjes, plataforma]);

  return {
    validarIdentidad,
    validarIdentidadSinProveedor,
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
    visualizacion,
    handleVisualizacion,
    handleAccion,
    //busqueda por fechas
    isAlertOpenFechas,
    handleisAlertCloseFechas,
    handleisAlertOpenFechas,
    fecha1,
    setFecha1,
    fecha2,
    setFecha2,
    getCanjes,
    plataforma,
    procesandoIdentidadDirecto,
    canjesAgrupados,
  };
};

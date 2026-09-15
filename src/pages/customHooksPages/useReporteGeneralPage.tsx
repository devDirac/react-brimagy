import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import {
  getEstadisticasCanjeadosHttp,
  getReporteGeneralCanjesHttp,
  getReporteGlobalExcelHttp,
} from "actions/estadisticas";
import { crearPeriodoHttp, editarPeriodoHttp, getPeriodosHttp } from "actions/configuracion";
import { useFormik } from "formik";
import * as Yup from "yup";

export const useReporteGeneralPage = (tipoUsuario: number) => {
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
  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");

  const [procesando, setProcesando] = useState<boolean>(false);
  const [reporteGeneralDatos, setReporteGeneralDatos] = useState<any>(null);

  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const [descargando, setDescargando] = useState<boolean>(false);

  //periodos
  const [periodos, setPeriodos] = useState<any[]>([]);
  const [procesandoPeriodo, setProcesandoPeriodo] = useState<boolean>(false);

  const [isAlertOpenPeriodo, setIsAlertOpenPeriodo] = useState(false);
  const handleisAlertOpenPeriodo = () => setIsAlertOpenPeriodo(true);
  const handleisAlertClosePeriodo = () => setIsAlertOpenPeriodo(false);
  const [periodoEditar, setPeriodoEditar] = useState<any>(null);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const formik = useFormik({
    initialValues: {
      fecha_inicio_periodo: "",
      fecha_fin_periodo: "",
    },
    validationSchema: Yup.object({
      fecha_inicio_periodo: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
      fecha_fin_periodo: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
    }),
    onSubmit: async (values) => {},
  });

  const isFieldValid = (fieldName: keyof typeof formik.values) => {
    return (
      formik.touched[fieldName] &&
      !formik.errors[fieldName] &&
      formik.values[fieldName] &&
      formik.values[fieldName] !== ""
    );
  };

  const getFieldColor = (fieldName: keyof typeof formik.values) => {
    return isFieldValid(fieldName) ? "#00AB16" : undefined;
  };

  const getPeriodos = useCallback(async (plataforma: string) => {
    try {
      setProcesando(true);
      const datos: any = await getPeriodosHttp(plataforma);
      setPeriodos(datos);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getReporteGeneralCanjes = useCallback(
    async (
      inicio?: string,
      fin?: string,
      plataforma?: string,
      fechaInicioPeriodo?: string,
      fechaFinPeriodo?: string
    ) => {
      try {
        setProcesando(true);
        const params: Record<string, string> = {};
        if (inicio) params.fecha_inicio = inicio;
        if (fin) params.fecha_fin = fin;
        if (plataforma) params.plataforma = plataforma;
        if (fechaInicioPeriodo) params.fecha_inicio_periodo = fechaInicioPeriodo;
        if (fechaFinPeriodo) params.fecha_fin_periodo = fechaFinPeriodo;
        const datos = await getReporteGeneralCanjesHttp(params);
        setReporteGeneralDatos(datos);
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

  const handleExportarExcel = async (inicio?: string, fin?: string, plataforma?: string) => {
    try {
      setDescargando(true);
      const params: Record<string, string> = {};
      if (inicio) params.fecha_inicio = inicio;
      if (fin) params.fecha_fin = fin;
      if (plataforma) params.plataforma = plataforma;

      const response: any = await getReporteGlobalExcelHttp(params);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_canjes_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      if (error?.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const parsed = JSON.parse(text);
          setMensajeAlert(parsed?.message || intl.formatMessage({ id: "get_excel_error" }));
        } catch {
          setMensajeAlert(intl.formatMessage({ id: "get_excel_error" }));
        }
      } else {
        const message = getErrorHttpMessage(error);
        setMensajeAlert(message || intl.formatMessage({ id: "get_excel_error" }));
      }
    } finally {
      setDescargando(false);
    }
  };

  const createPeriodo = async (datos: any) => {
    try {
      setProcesandoPeriodo(true);
      const nuevoPeriodo = await crearPeriodoHttp(datos);
      setPeriodos((prev) => [...prev.map((p) => ({ ...p, activo: 2 })), nuevoPeriodo]);
      setMensajeAlert(intl.formatMessage({ id: "periodo_agregado_correctamente" }));
      formik.resetForm();
      handleisAlertClosePeriodo();
      handleisAlertOpen();
      setProcesandoPeriodo(false);
    } catch (error) {
      setProcesandoPeriodo(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "periodo_agregado_error" }));
      handleisAlertOpen();
    }
  };

  const editarPeriodo = async (datos: any) => {
    try {
      setProcesandoPeriodo(true);
      const periodoActualizado: any = await editarPeriodoHttp(datos);
      setPeriodos((prev) =>
        prev.map((p) => (p.id === periodoActualizado.id ? periodoActualizado : p))
      );

      formik.resetForm();
      setPeriodoEditar(null);
      setMensajeAlert(intl.formatMessage({ id: "periodo_editado_correctamente" }));
      handleisAlertClosePeriodo();
      handleisAlertOpen();
      setProcesandoPeriodo(false);
    } catch (error) {
      setProcesandoPeriodo(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "periodo_editado_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    if (periodoEditar) {
      formik.setValues({
        fecha_inicio_periodo: periodoEditar?.fecha_inicio || "",
        fecha_fin_periodo: periodoEditar?.fecha_fin || "",
      });
    } else {
      formik.resetForm();
    }
  }, [periodoEditar]);

  useEffect(() => {
    getPeriodos(plataforma);
  }, [plataforma]);

  useEffect(() => {
    const periodoActivo = periodos?.find((p: any) => p.activo === 1);
    if (periodoActivo) {
      getReporteGeneralCanjes(
        undefined,
        undefined,
        plataforma,
        periodoActivo.fecha_inicio,
        periodoActivo.fecha_fin
      );
    } else {
      getReporteGeneralCanjes(undefined, undefined, plataforma);
    }
  }, [periodos]);

  useEffect(() => {
    if (fechaInicio || fechaFin) {
      getReporteGeneralCanjes(fechaInicio, fechaFin, plataforma);
    }
  }, [fechaInicio, fechaFin]);

  return {
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    reporteGeneralDatos,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    handleExportarExcel,
    descargando,
    plataforma,
    //periodos
    periodos,
    formik,
    getFieldColor,
    createPeriodo,
    procesandoPeriodo,
    isAlertOpenPeriodo,
    handleisAlertOpenPeriodo,
    handleisAlertClosePeriodo,
    setPeriodoEditar,
    periodoEditar,
    editarPeriodo,
  };
};

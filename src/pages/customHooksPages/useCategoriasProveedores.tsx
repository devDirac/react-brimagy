import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  activarUsuarioHttp,
  desactivarUsuarioHttp,
  editarUsuarioHttp,
  getUsuariosHttp,
} from "../../actions/users";
import { getErrorHttpMessage } from "../../utils";
import { StoreType } from "../../types/genericTypes";
import { useIntl } from "react-intl";
import { setAuth } from "../../actions/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  crearProveedorHttp,
  editarProveedorHttp,
  eliminarProveedorHttp,
  getProveedoresHttp,
} from "actions/proveedores";
import {
  crearCategoriaHttp,
  editarCategoriaHttp,
  eliminarCategoriaHttp,
  getCategoriasHttp,
} from "actions/categorias";

export const useCategoriasProveedores = (tipoUsuario: number) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoProveedor, setProcesandoProveedor] = useState<boolean>(false);
  const [procesandoCategoria, setProcesandoCategoria] = useState<boolean>(false);

  const [procesandoEditar, setProcesandoEditar] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [tabableKeyProveedor, setTableKeyProveedor] = useState(0);
  const [tableKeyCategoria, setTableKeyCategoria] = useState(0);
  const isSuperAdmin = tipoUsuario === 4;

  const [proveedores, setProveedores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");

  const [isAlertOpenEditarUsuario, setIsAlertOpenEditarUsuario] = useState(false);
  const handleisAlertOpenEditarUsuario = () => setIsAlertOpenEditarUsuario(true);
  const handleisAlerCloseEditarUsuario = () => setIsAlertOpenEditarUsuario(false);

  const [nombreEditar, setNombreEditar] = useState("");
  const [descripcionEditar, setDescripcionEditar] = useState("");
  const [tipoEditando, setTipoEditando] = useState("");

  /* seccion de confirmación eliminar póliza */
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const handleisAlertOpenConfirm = () => setOpenModalConfirm(true);
  const handleisAlerCloseConfirm = () => setOpenModalConfirm(false);

  const [generalEditar, setGeneralEditar] = useState<any>(null);
  const [generalId, setGeneralId] = useState("");

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      descripcion: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
    }),
    onSubmit: async (values) => {
      console.log("Formulario enviado:", values);
    },
  });

  const formikCategoria = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      descripcion: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
    }),
    onSubmit: async (values) => {
      console.log("Formulario enviado:", values);
    },
  });

  // Funciones auxiliares para validaciones visuales
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

  const getProveedores = useCallback(async () => {
    try {
      setProcesando(true);
      const proveedoresData = await getProveedoresHttp();
      setProveedores(proveedoresData);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getCategorias = useCallback(async () => {
    try {
      setProcesando(true);
      const categoriasData = await getCategoriasHttp();
      setCategorias(categoriasData);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const editaGeneral = async (datos: any) => {
    try {
      setProcesandoEditar(true);
      tipoEditando === "proveedor"
        ? (await editarProveedorHttp(datos), await getProveedores())
        : (await editarCategoriaHttp(datos), await getCategorias());
      setProcesandoEditar(false);
      setMensajeAlert(intl.formatMessage({ id: "general_editado_correctamente" }));
      handleisAlerCloseEditarUsuario();
      handleisAlertOpen();
    } catch (error) {
      setProcesandoEditar(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "general_editado_error" }));
      handleisAlertOpen();
    }
  };

  const eliminarGeneral = async (datos: any) => {
    try {
      setProcesandoEditar(true);
      tipoEditando === "proveedor"
        ? (await eliminarProveedorHttp(datos), await getProveedores())
        : (await eliminarCategoriaHttp(datos), await getCategorias());
      setProcesandoEditar(false);
      setMensajeAlert(intl.formatMessage({ id: "general_eliminado_correctamente" }));
      handleisAlerCloseConfirm();
      handleisAlertOpen();
    } catch (error) {
      setProcesandoEditar(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "general_eliminado_error" }));
      handleisAlertOpen();
    }
  };

  const crearProveedor = async (datos: any) => {
    try {
      setProcesandoProveedor(true);
      const proveedorData: any = await crearProveedorHttp(datos);
      setProveedores((prevProveedores) => [...prevProveedores, proveedorData]);
      formik.resetForm();
      setTableKeyProveedor((prev) => prev + 1);
      setProcesandoProveedor(false);
      setMensajeAlert(intl.formatMessage({ id: "proveedor_creado_correctamente" }));
      handleisAlertOpen();
    } catch (error) {
      setProcesandoProveedor(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "proveedor_creado_error" }));
      handleisAlertOpen();
    }
  };

  const crearCategoria = async (datos: any) => {
    try {
      setProcesandoCategoria(true);
      const categoriaData: any = await crearCategoriaHttp(datos);
      setCategorias((prevCategorias) => [...prevCategorias, categoriaData]);
      formikCategoria.resetForm();
      setTableKeyCategoria((prev) => prev + 1);
      setProcesandoCategoria(false);
      setMensajeAlert(intl.formatMessage({ id: "categoria_creada_correctamente" }));
      handleisAlertOpen();
    } catch (error) {
      setProcesandoCategoria(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "categoria_creada_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    getProveedores();
    getCategorias();
  }, [getProveedores, getCategorias]);

  return {
    setTipoEditando,
    tipoEditando,
    eliminarGeneral,
    descripcionEditar,
    setDescripcionEditar,
    handleisAlertOpenConfirm,
    setGeneralId,
    generalId,
    generalEditar,
    setGeneralEditar,
    openModalConfirm,
    setOpenModalConfirm,
    tabableKeyProveedor,
    tableKeyCategoria,
    procesandoProveedor,
    crearProveedor,
    crearCategoria,
    categorias,
    proveedores,
    procesandoCategoria,
    getFieldColor,
    formik,
    formikCategoria,
    procesandoEditar,
    nombreEditar,
    setNombreEditar,
    handleisAlertOpenEditarUsuario,
    handleisAlerCloseEditarUsuario,
    isAlertOpenEditarUsuario,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    setProcesando,
    usuarios,
    tipoUsuario,
    editaGeneral,
  };
};

import { useCallback, useEffect, useMemo, useState } from "react";
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
  getCategoriasPrincipalHttp,
  reactivarCategoriaHttp,
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
  const [subcategorias, setSubCategorias] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");

  const [isAlertOpenEditarUsuario, setIsAlertOpenEditarUsuario] = useState(false);
  const handleisAlertOpenEditarUsuario = () => setIsAlertOpenEditarUsuario(true);
  const handleisAlerCloseEditarUsuario = () => setIsAlertOpenEditarUsuario(false);

  const [nombreEditar, setNombreEditar] = useState("");
  const [razonSocialEditar, setRazonSocialEditar] = useState("");
  const [nombreContactoEditar, setNombreContactoEditar] = useState("");
  const [descripcionEditar, setDescripcionEditar] = useState("");
  const [telefonoEditar, setTelefonoEditar] = useState("");
  const [correoEditar, setCorreoEditar] = useState("");
  const [tipoEditando, setTipoEditando] = useState("");

  /* seccion de confirmación eliminar póliza */
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const handleisAlertOpenConfirm = () => setOpenModalConfirm(true);
  const handleisAlerCloseConfirm = () => setOpenModalConfirm(false);

  const [generalEditar, setGeneralEditar] = useState<any>(null);
  const [generalId, setGeneralId] = useState("");

  const [valueTab, setValueTab] = useState(0);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  }, []);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const normalizarNombre = (texto: string): string => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/\s+/g, "_");
  };

  useEffect(() => {
    if (generalEditar && tipoEditando === "proveedor") {
      setNombreEditar(generalEditar.nombre || "");
      setRazonSocialEditar(generalEditar.razon_social || "");
      setDescripcionEditar(generalEditar.descripcion || "");
      setNombreContactoEditar(generalEditar.nombre_contacto || "");
      setTelefonoEditar(generalEditar.telefono || "");
      setCorreoEditar(generalEditar.correo || "");
    } else if (generalEditar && tipoEditando === "categoria") {
      setNombreEditar(generalEditar.desc || "");
    }
  }, [generalEditar]);

  const tabsStyles = useMemo(
    () => ({
      background: "#F0FCDC",
      borderRadius: "10px 10px 0 0",
      "& .MuiTab-root": {
        transition: "none",
      },
      "& .Mui-selected": {
        background: "#a5eb2f !important",
        color: "#2F2F2F !important",
        fontWeight: 600,
      },
    }),
    []
  );

  const formik = useFormik({
    initialValues: {
      nombre: "",
      razon_social: "",
      descripcion: "",
      nombre_contacto: "",
      telefono: "",
      correo: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      razon_social: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      descripcion: Yup.string(),
      nombre_contacto: Yup.string().required(
        intl.formatMessage({ id: "input_validation_requerido" })
      ),
      telefono: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      correo: Yup.string()
        .email(intl.formatMessage({ id: "input_validation_email_invalido" }))
        .required(intl.formatMessage({ id: "input_validation_requerido" })),
    }),
    onSubmit: async (values) => {
      console.log("Formulario enviado:", values);
    },
  });

  const formikCategoria = useFormik({
    initialValues: {
      nombre: "",
      category_id: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      category_id: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
    }),
    onSubmit: async (values) => {
      console.log("Formulario enviado:", values);
    },
  });

  const isFieldValid = (fieldName: keyof typeof formikCategoria.values) => {
    return (
      formikCategoria.touched[fieldName] &&
      !formikCategoria.errors[fieldName] &&
      formikCategoria.values[fieldName] &&
      formikCategoria.values[fieldName] !== ""
    );
  };

  const getFieldColor = (fieldName: keyof typeof formikCategoria.values) => {
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

  const getCategorias = useCallback(async (plataforma?: string) => {
    try {
      setProcesando(true);
      const categoriasData = await getCategoriasHttp(plataforma);
      setSubCategorias(categoriasData);
      setTableKeyCategoria((prev) => prev + 1);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getCategoriasPrincipal = useCallback(async (plataforma?: string) => {
    try {
      setProcesando(true);
      const categoriasData = await getCategoriasPrincipalHttp(plataforma);
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
        : (await editarCategoriaHttp(datos), await getCategorias(plataforma));
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
        : (await eliminarCategoriaHttp(datos), await getCategorias(plataforma));
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

  const reactivarCategoria = async (datos: any) => {
    try {
      setProcesandoEditar(true);
      const categoriaData: any = await reactivarCategoriaHttp(datos);
      await getCategorias(plataforma);
      setProcesandoEditar(false);
      setMensajeAlert(intl.formatMessage({ id: "general_reactivado_correctamente" }));
      handleisAlertOpen();
    } catch (error) {
      setProcesandoEditar(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "general_reactivado_error" }));
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
      await getProveedores();
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
      setSubCategorias((prevCategorias) => [...prevCategorias, categoriaData]);
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

  const handleAccionCallback = useCallback((accion: string, row: any) => {
    switch (accion) {
      case "eliminar_proveedor":
        setTipoEditando("proveedor");
        setGeneralId(row?.id);
        handleisAlertOpenConfirm();
        break;
      case "eliminar_categoria":
        setTipoEditando("categoria");
        setGeneralId(row?.id);
        handleisAlertOpenConfirm();
        break;
      case "reactivar_categoria":
        reactivarCategoria(row?.id);
        break;
      case "editar_proveedor":
        setTipoEditando("proveedor");
        setGeneralEditar(row);
        handleisAlertOpenEditarUsuario();
        break;
      case "editar_categoria":
        setTipoEditando("categoria");
        setGeneralEditar(row);
        handleisAlertOpenEditarUsuario();
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    getProveedores();
    getCategorias(plataforma);
    getCategoriasPrincipal(plataforma);
  }, [getProveedores, getCategorias, getCategoriasPrincipal, plataforma]);

  return {
    nombreContactoEditar,
    setNombreContactoEditar,
    razonSocialEditar,
    setRazonSocialEditar,
    tabsStyles,
    handleAccionCallback,
    valueTab,
    setValueTab,
    handleChangeTab,
    telefonoEditar,
    setTelefonoEditar,
    correoEditar,
    setCorreoEditar,
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
    subcategorias,
    getFieldColor,
    plataforma,
    normalizarNombre,
  };
};

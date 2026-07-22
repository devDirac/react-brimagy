import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getErrorHttpMessage } from "../../utils";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import { StoreType } from "../../types/genericTypes";
import * as Yup from "yup";
import { setAuth } from "actions/auth";
import {
  crearUsuarioPlataformaHttp,
  getCheckEmailUsuarioPlataformaHttp,
  getTipoUsuariosHttp,
  getUsuariosPlataformaHttp,
} from "actions/users";

export const useUsuariosPlataforma = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);

  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoPlataforma, setProcesandoPlataforma] = useState<boolean>(false);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const [tipoUsuarios, setTipoUsuarios] = useState<any[]>([]);
  const [usuariosPlataforma, setUsuariosPlataforma] = useState<any[]>([]);

  const [tableKey, setTableKey] = useState(0);

  const [usuarioEditar, setUsuarioEditar] = useState<any>(null);
  const [alertEditar, setAlertEditar] = useState(false);
  const handleisAlertOpenEditar = () => setAlertEditar(true);
  const handleisAlertCloseEditar = () => setAlertEditar(false);

  const [foto, setFoto] = useState("");
  const esSuperAdmin = tipoUsuario === 7;

  const setImagen = (data: any) => {
    setFoto(data);
  };

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const handleAccion = (accion: string, row: any) => {
    switch (accion) {
      case "desactivar":
        break;
      case "reactivar":
        break;
      case "editar":
        setUsuarioEditar(row);
        handleisAlertOpenEditar();
        break;
      default:
        break;
    }
  };

  const formik = useFormik({
    initialValues: {
      usuario: "",
      nombre: "",
      correo: "",
      telefono: "",
      password: "",
      password_confirm: "",
      tipo_usuario: "",
    },
    validationSchema: Yup.object({
      usuario: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
      nombre: Yup.string()
        .min(4, intl.formatMessage({ id: "input_validation_min_4" }))
        .max(150, intl.formatMessage({ id: "input_validation_max_150" }))
        .required(intl.formatMessage({ id: "input_validation_requerido" })),
      correo: Yup.string()
        .email(intl.formatMessage({ id: "input_validation_formato_invalido" }))
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .test("email-unique", "Este correo ya está registrado", async function (value) {
          if (!value) return true;
          if (usuarioEditar && value === usuarioEditar.email) return true;
          return await checkEmailAvailability(value);
        }),
      telefono: Yup.string()
        .matches(/^[0-9]+$/, intl.formatMessage({ id: "input_validation_solo_numeros" }))
        .min(10, intl.formatMessage({ id: "input_validation_min_10_digitos" }))
        .max(10, intl.formatMessage({ id: "input_validation_max_10_digitos" }))
        .required(intl.formatMessage({ id: "input_validation_requerido" })),
      password: usuarioEditar
        ? Yup.string()
            .min(4, intl.formatMessage({ id: "input_validation_min_4" }))
            .max(50, intl.formatMessage({ id: "input_validation_max_50" }))
        : Yup.string()
            .min(4, intl.formatMessage({ id: "input_validation_min_4" }))
            .max(50, intl.formatMessage({ id: "input_validation_max_50" }))
            .required(intl.formatMessage({ id: "input_validation_requerido" })),
      password_confirm: usuarioEditar
        ? Yup.string().oneOf(
            [Yup.ref("password")],
            intl.formatMessage({ id: "input_validation_password_coincidir" })
          )
        : Yup.string()
            .oneOf(
              [Yup.ref("password")],
              intl.formatMessage({ id: "input_validation_password_coincidir" })
            )
            .required(intl.formatMessage({ id: "input_validation_requerido" })),
      tipo_usuario: Yup.string().required(intl.formatMessage({ id: "input_validation_requerido" })),
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

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const response = await getCheckEmailUsuarioPlataformaHttp(email);
      return !response.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return true;
    }
  };

  const getUsuariosPlataforma = useCallback(async () => {
    try {
      setProcesando(true);
      const data = await getUsuariosPlataformaHttp();
      setUsuariosPlataforma(data);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const getTipoUsuarios = useCallback(async () => {
    try {
      setProcesando(true);
      const data = await getTipoUsuariosHttp();
      setTipoUsuarios(esSuperAdmin ? [...data, { id: 7, nombre: "Super Admin" }] : data);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const crearUsuarioPlataforma = async (datos: any) => {
    try {
      setProcesando(true);
      const data = await crearUsuarioPlataformaHttp(datos);
      await getUsuariosPlataforma();

      setMensajeAlert(
        usuarioEditar
          ? intl.formatMessage({ id: "usuario_plataforma_actualizado_correctamente" })
          : intl.formatMessage({ id: "usuario_plataforma_añadido_correctamente" })
      );
      formik.resetForm();
      setProcesando(false);
      handleisAlertCloseEditar();
      handleisAlertOpen();
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(
        message || usuarioEditar
          ? intl.formatMessage({ id: "usuario_plataforma_actualizado_error" })
          : intl.formatMessage({ id: "usuario_plataforma_añadido_error" })
      );
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    if (usuarioEditar) {
      formik.setValues({
        usuario: usuarioEditar?.usuario || "",
        nombre: usuarioEditar?.name || "",
        correo: usuarioEditar?.email || "",
        telefono: usuarioEditar?.telefono || "",
        password: "",
        password_confirm: "",
        tipo_usuario: usuarioEditar?.tipo_usuario || "",
      });
      setFoto(usuarioEditar?.foto || "");
    } else {
      setFoto("");
    }
  }, [usuarioEditar]);

  useEffect(() => {
    getUsuariosPlataforma();
    getTipoUsuarios();
  }, []);

  return {
    crearUsuarioPlataforma,
    handleAccion,
    usuariosPlataforma,
    tipoUsuarios,
    procesandoPlataforma,
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    formik,
    getFieldColor,
    //editando plataforma
    tableKey,
    usuarioEditar,
    alertEditar,
    handleisAlertOpenEditar,
    handleisAlertCloseEditar,
    //añadir usuario plataforma
    setImagen,
    foto,
    setUsuariosPlataforma,
    setUsuarioEditar,
    tipoUsuario,
    esSuperAdmin,
  };
};

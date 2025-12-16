import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveUserHttp, getCheckEmailHttp, getCheckUsuarioHttp } from "../../actions/users";
import { getErrorHttpMessage } from "../../utils";
import { useIntl } from "react-intl";

export const useNuevoUsuario = (activeStep: number, isLastStep: boolean) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  // Crear el esquema de validación dinámicamente con useMemo
  const validationSchema = useMemo(() => {
    // Esquema base sin permiso
    const baseValidationSchema = Yup.object({
      usuario: Yup.string()
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .test("usuario-unique", "Este usuario ya está registrado", async function (value) {
          if (!value) return true;

          return await checkUsuarioAvailability(value);
        }),
      nombre: Yup.string()
        .min(4, intl.formatMessage({ id: "input_validation_min_4" }))
        .max(150, intl.formatMessage({ id: "input_validation_max_150" }))
        .required(intl.formatMessage({ id: "input_validation_requerido" })),
      correo: Yup.string()
        .email(intl.formatMessage({ id: "input_validation_formato_invalido" }))
        .required(intl.formatMessage({ id: "input_validation_requerido" }))
        .test("email-unique", "Este correo ya está registrado", async function (value) {
          if (!value) return true;

          return await checkEmailAvailability(value);
        }),
      telefono: Yup.string()
        .matches(/^[0-9]+$/, intl.formatMessage({ id: "input_validation_solo_numeros" }))
        .min(10, intl.formatMessage({ id: "input_validation_min_10_digitos" }))
        .max(10, intl.formatMessage({ id: "input_validation_max_10_digitos" }))
        .required(intl.formatMessage({ id: "input_validation_requerido" })),
      password: Yup.string()
        .min(4, intl.formatMessage({ id: "input_validation_min_4" }))
        .max(50, intl.formatMessage({ id: "input_validation_max_50" }))
        .required(intl.formatMessage({ id: "input_validation_requerido" })),
      password_confirm: Yup.string()
        .oneOf(
          [Yup.ref("password")],
          intl.formatMessage({ id: "input_validation_password_coincidir" })
        )
        .required(intl.formatMessage({ id: "input_validation_requerido" })),
    });

    if (isLastStep) {
      return baseValidationSchema.shape({
        permiso: Yup.string()
          .oneOf(
            ["Super Admin", "Editor", "Usuario"],
            intl.formatMessage({ id: "campo_permiso_valido" })
          )
          .required(intl.formatMessage({ id: "input_validation_requerido" })),
      });
    }

    return baseValidationSchema;
  }, [isLastStep, intl]);

  const formik = useFormik({
    initialValues: {
      usuario: "",
      nombre: "",
      correo: "",
      telefono: "",
      password: "",
      password_confirm: "",
      tipo_usuario: "",
      foto: "",
      permiso: "",
    },
    onSubmit: async (values) => {},
    validationSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isLastStep) {
      formik.validateForm();
    }
  }, [isLastStep]);

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const response = await getCheckEmailHttp(email);
      return !response.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return true;
    }
  };

  const checkUsuarioAvailability = async (usuario: string): Promise<boolean> => {
    try {
      const response = await getCheckUsuarioHttp(usuario);
      return !response.exists;
    } catch (error) {
      console.error("Error checking usuario:", error);
      return true;
    }
  };

  const guardaNuevoUsuario = async (data: any) => {
    try {
      setProcesando(true);
      const datos = await saveUserHttp(data);
      setMensajeAlert(intl.formatMessage({ id: "http_exito_registrar" }));
      setProcesando(false);
      handleisAlertOpen();
    } catch (error) {
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "http_error_registrar" }));
      setProcesando(false);
      handleisAlertOpen();
    }
  };
  return {
    procesando,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
    errorLogin,
    guardaNuevoUsuario,
    formik,
    setProcesando,
  };
};

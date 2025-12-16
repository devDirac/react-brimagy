import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { recuperaContrasenaTokenValidacion, updatePassword } from "../../actions/auth";
import { getErrorHttpMessage } from "../../utils/index";
import { useIntl } from "react-intl";

export const usePasswordRecoverValidationPage = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [procesando, setProcesando] = useState<boolean>(false);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [queryParameters] = useSearchParams();
  const token: string = queryParameters.get("token") || "";
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => {
    setIsAlertOpen(false);
    navigate(`/login`);
  };
  const actualizaPassword = async (value: { password: string; passwordConfirm: string }) => {
    try {
      setProcesando(true);
      await updatePassword(value?.password || "", value?.passwordConfirm || "", token);
      setProcesando(false);
      setMensajeAlert(intl.formatMessage({ id: "recuperacion_contrasena_exito_al_actualizar" }));
      handleisAlertOpen();
    } catch (error) {
      const message = getErrorHttpMessage(error);
      setMensajeAlert(
        message || intl.formatMessage({ id: "recuperacion_contrasena_error_al_actualizar" })
      );
      setProcesando(false);
      handleisAlertOpen();
    }
  };

  const validaToken = useCallback(async () => {
    try {
      setProcesando(true);
      await recuperaContrasenaTokenValidacion(token);
      setIsValidToken(true);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
    }
  }, [token]);

  useEffect(() => {
    validaToken();
  }, [validaToken]);

  return {
    queryParameters,
    isValidToken,
    procesando,
    actualizaPassword,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
  };
};

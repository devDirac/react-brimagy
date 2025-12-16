import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginAction } from "../../components/LoginForm/types";
import { loginHttp, recoverPasswordGenerateToken, setUser } from "../../actions/auth";
import { getErrorHttpMessage } from "../../utils";
import { setMenuRoutes } from "../../actions/menu";
import { useIntl } from "react-intl";

export const usePasswordRecoverPage = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [procesando, setProcesando] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const recuperaPassword = async (usr: { email: string }) => {
    try {
      setProcesando(true);
      await recoverPasswordGenerateToken({ email: usr.email });
      setMensajeAlert(intl.formatMessage({ id: "recuperacion_contrasena_inicio_proceso_exito" }));
      setProcesando(false);
      handleisAlertOpen();
    } catch (err) {
      const message = getErrorHttpMessage(err);
      setMensajeAlert(
        message || intl.formatMessage({ id: "recuperacion_contrasena_inicio_proceso_error" })
      );
      setProcesando(false);
      handleisAlertOpen();
    }
  };

  return {
    procesando,
    recuperaPassword,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
    intl,
  };
};

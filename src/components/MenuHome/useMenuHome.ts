import { useState } from "react";
import routes from "../../routes";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useMaterialUIController } from "context";

const useMenuHome = (props: any) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tipoUsuario = useSelector((state: any) => state?.app?.user?.data?.tipo_usuario || []);
  const newRoutes = routes.filter(
    (w) => w?.type === "collapse" && (w?.allow || []).includes(tipoUsuario)
  );
  const superAdministrador = useSelector(
    (state: any) => state?.app?.user?.data?.tipo_usuario === 3
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return {
    navigate,
    intl,
    newRoutes,
    superAdministrador,
    dispatch,
    mensajeAlert,
    isAlertOpen,
    darkMode,
  };
};

export default useMenuHome;

import { useMaterialUIController } from "context";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../types/genericTypes";
import { getErrorHttpMessage } from "../../utils";
import _ from "lodash";
import type { AddUserFormProps } from "./types";
import { useIntl } from "react-intl";
import { getTiposUsuarioHttp } from "actions/users";

export const useUserInfo = (props: AddUserFormProps) => {
  const plataforma = useSelector((state: StoreType) => state?.app?.plataforma || "puntotes");
  const intl = useIntl();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPassword_confirm] = useState("");
  const [telefono, setTelefono] = useState("");
  const [foto, setFoto] = useState("");
  const [permisos, setPermisos] = useState<number>();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [procesando, setProcesando] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const [tipoUsuarios, setTipoUsuarios] = useState<any[]>([]);

  const setImagen = (data: any) => {
    setFoto(data);
  };

  const getTiposUsuario = async (plataforma?: any) => {
    try {
      setProcesando(true);
      const data = await getTiposUsuarioHttp(plataforma);
      setTipoUsuarios(data);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    getTiposUsuario(plataforma);
  }, [plataforma]);

  return {
    intl,
    darkMode,
    nombre,
    correo,
    password,
    password_confirm,
    telefono,
    foto,
    setNombre,
    setCorreo,
    setPassword,
    setPassword_confirm,
    setTelefono,
    setFoto,
    setImagen,
    permisos,
    setPermisos,
    tipoUsuarios,
  };
};

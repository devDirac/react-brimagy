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

export const useListaUsuarios = (tipoUsuario: number) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState<boolean>(false);
  const [procesandoEditar, setProcesandoEditar] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const isSuperAdmin = tipoUsuario === 4;

  const idUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.id || 0);
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");

  const [isAlertOpenEditarUsuario, setIsAlertOpenEditarUsuario] = useState(false);
  const handleisAlertOpenEditarUsuario = () => setIsAlertOpenEditarUsuario(true);
  const handleisAlerCloseEditarUsuario = () => setIsAlertOpenEditarUsuario(false);
  const [usuarioEditar, setUsuarioEditar] = useState<any>(null);

  const [nombreEditar, setNombreEditar] = useState("");
  const [rfcEditar, setRfcEditar] = useState("");
  const [direccionFiscalEditar, setdireccionFiscalEditar] = useState("");
  const [correoEditar, setCorreoEditar] = useState("");
  const [telefonoEditar, setTelefonoEditar] = useState("");
  const [fotoEditar, setFotoEditar] = useState("");

  useEffect(() => {
    setAuth(token);
  }, [token]);

  const getUsuarios = useCallback(async () => {
    try {
      setProcesando(true);
      const usuariosData = await getUsuariosHttp();
      setUsuarios(usuariosData);
      setProcesando(false);
    } catch (error) {
      setProcesando(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  }, []);

  const desactivaUsuario = async (data: any) => {
    try {
      await desactivarUsuarioHttp(data);
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === data.id ? { ...usuario, status: "DEACTIVATE" } : usuario
        )
      );
      setTableKey((prev) => prev + 1);
      setMensajeAlert(intl.formatMessage({ id: "desactivado_correctamente" }));
      handleisAlertOpen();
    } catch (error) {
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "desactivado_error" }));
      handleisAlertOpen();
    }
  };

  const reactivaUsuario = async (data: any) => {
    try {
      const reactivar = await activarUsuarioHttp(data);
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === data.id ? { ...usuario, status: "ACTIVE" } : usuario
        )
      );
      setTableKey((prev) => prev + 1);
      setMensajeAlert(intl.formatMessage({ id: "reactivado_correctamente" }));
      handleisAlertOpen();
    } catch (error) {
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "reactivado_error" }));
      handleisAlertOpen();
    }
  };

  const editaUsuario = async (datos: any) => {
    try {
      setProcesandoEditar(true);
      const usuariosData = await editarUsuarioHttp(datos);
      setProcesandoEditar(false);
      setMensajeAlert(intl.formatMessage({ id: "usuario_editado_correctamente" }));
      handleisAlertOpen();
    } catch (error) {
      setProcesandoEditar(false);
      const message = getErrorHttpMessage(error);
      setMensajeAlert(message || intl.formatMessage({ id: "get_elementos_error" }));
      handleisAlertOpen();
    }
  };

  useEffect(() => {
    getUsuarios();
  }, [getUsuarios]);

  return {
    procesandoEditar,
    nombreEditar,
    setNombreEditar,
    rfcEditar,
    setRfcEditar,
    direccionFiscalEditar,
    setdireccionFiscalEditar,
    correoEditar,
    setCorreoEditar,
    telefonoEditar,
    setTelefonoEditar,
    fotoEditar,
    setFotoEditar,
    tableKey,
    usuarioEditar,
    setUsuarioEditar,
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
    desactivaUsuario,
    reactivaUsuario,
    editaUsuario,
  };
};

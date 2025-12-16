import _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ComplexProjectCard from "../../examples/Cards/ProjectCards/ComplexProjectCard";
import { saveUserHttp } from "../../actions/users";
import { StoreType } from "../../types/genericTypes";
import { setAuth } from "../../actions/auth";
import { useIntl } from "react-intl";

const useAddMultiUsersPage = () => {
  const intl = useIntl();
  const token = useSelector((state: StoreType) => state?.app?.user?.token || "");
  const espacio = useSelector((state: any) => state?.app?.espacio || null);
  const [procesando, setProcesando] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);
  const [data, setData] = useState<any[]>([]);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [textModalConfirm, setTextModalConfirm] = useState("");
  const tiposUsuario = useSelector(
    (state: StoreType) => state?.app?.catalogos?.["apm_tipo_usuarios"] || []
  );
  const addUserPregunta = (data: any[]) => {
    setTextModalConfirm(
      intl.formatMessage({
        id: "validacion_archivo_excel",
      })
    );
    setData(data);
    setOpenModalConfirm(true);
  };
  const addUser = async () => {
    setOpenModalConfirm(false);
    setProcesando(true);
    await data.reduce(async (_: any, cat: any) => {
      try {
        await _;
        const userAlta = {
          nombre: cat?.[0] || "",
          correo: cat?.[1] || "",
          password: cat?.[2] || "",
          direccion: cat?.[3] || "",
          rfc: cat?.[4] || "",
          telefono: String(cat?.[5]) || "",
          permisos: cat?.[6] || "",
          agente_id: cat?.[7] || "",
        };
        await saveUserHttp(userAlta);
      } catch (error) {}
    }, Promise.resolve());
    setProcesando(false);
    setMensajeAlert(
      intl.formatMessage({
        id: "exito_registro_usuarios",
      })
    );
    handleisAlertOpen();
  };
  useEffect(() => {
    setAuth(token);
  }, [token]);

  return {
    intl,
    espacio,
    setMensajeAlert,
    handleisAlertOpen,
    procesando,
    addUserPregunta,
    handleisAlerClose,
    isAlertOpen,
    mensajeAlert,
    addUser,
    setOpenModalConfirm,
    setTextModalConfirm,
    setData,
    openModalConfirm,
    textModalConfirm,
  };
};

export default useAddMultiUsersPage;

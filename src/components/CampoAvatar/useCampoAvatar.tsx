import type { CampoAvatarProps } from "./index";
import { useRef, useState } from "react";
import { fromFileToBase64 } from "../../utils/index";
import { useIntl } from "react-intl";

const useCampoAvatar = (props: CampoAvatarProps) => {
  const reference = useRef(null);
  const intl = useIntl();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState("");
  const handleisAlertOpen = () => setIsAlertOpen(true);
  const handleisAlerClose = () => setIsAlertOpen(false);

  const handleEditPictureProfile = () => {
    const node = reference.current as any;
    node.click();
  };

  const enviaImagen = async (evt: any) => {
    try {
      const file = evt.target.files[0];
      var sizeInMB = (file?.size / (1024 * 1024)).toFixed(2);
      if (+sizeInMB > 1) {
        setMensajeAlert(
          intl.formatMessage({ id: "campo_avatar_component_tamano_maximo_imagenes" }) +
            ": " +
            sizeInMB +
            "MB"
        );
        handleisAlertOpen();
        props?.onChangeImage && props?.onChangeImage("");
        return false;
      }
      const elemento = await fromFileToBase64(file);
      props?.onChangeImage && props?.onChangeImage(elemento);
    } catch (error) {}
  };
  return {
    handleEditPictureProfile,
    enviaImagen,
    reference,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
  };
};

export default useCampoAvatar;

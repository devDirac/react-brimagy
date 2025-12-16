export interface ModalConfirmProps {
  onAcept: (comentarios?: string) => void;
  onCancel: () => void;
  open: boolean;
  text: string;
  title: string;
  cancelText?: string;
  acceptText?: string;
  esCambioEstatusEstimacion?: boolean;
  esConFirma?: boolean;
  procesando?: boolean;
  children?: React.ReactNode;
}

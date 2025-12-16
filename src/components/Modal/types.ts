import { ReactNode } from "react";

export interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
  title?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  procesando?: boolean;
  titleBoton?: string;
  esFullScreen?: boolean;
  esError?: boolean;
}

import { FormikProps } from "formik";

interface FormValues {
  usuario: string;
  nombre: string;
  correo: string;
  telefono: string;
  password: string;
  password_confirm: string;
  tipo_usuario: string;
  foto: string;
  permiso: string;
}

export interface AddUserFormProps {
  formik?: FormikProps<FormValues>;
  onDataChange?: (data: any) => void;
  resetForm?: boolean;
  permisoUser?: number;
  idUsuario?: number;
  onReset?: () => void;
  onDatosChange?: (datos: any) => void;
}
